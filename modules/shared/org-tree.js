/**
 * shared/org-tree.js
 * 统一单位组织树渲染器，数据源来自 system-admin/org-data.js 的 orgList
 * 参考 system-admin/org.html 的源组织树样式：展开折叠箭头、类型图标、滚动容器
 *
 * 用法：
 *   renderOrgTree('unitTree', 'currentUnitLabel', { mode:'units-only' });
 *   renderOrgTree('unitTree', 'currentUnitLabel', { mode:'assessment' });
 *
 * HTML 结构：
 *   .org-tree > .tree-node + .tree-children > .tree-node + .tree-children ...
 *   每行: .tree-arrow(▶) + .node-icon(单/部) + .tree-label(名称) + .level-tag(级别)
 */

// ---------- inject CSS once ----------
(function() {
  if (document.getElementById('org-tree-css')) return;
  var s = document.createElement('style');
  s.id = 'org-tree-css';
  s.textContent = [
    '.org-tree { font-size:var(--font-size-13); line-height:1; user-select:none; }',
    '.tree-node { display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:var(--radius-sm); cursor:pointer; transition:background .15s; }',
    '.tree-node:hover { background:var(--bg-hover); }',
    '.tree-node.active { background:var(--primary-light); color:var(--primary); font-weight:500; }',
    '.tree-node.active:hover { background:var(--primary-light); }',
    '.tree-arrow { font-size:9px; color:var(--text-tertiary); width:16px; height:16px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; cursor:pointer; transition:transform .15s; border-radius:3px; }',
    '.tree-arrow:hover { background:var(--bg-active); }',
    '.tree-arrow.open { transform:rotate(90deg); }',
    '.tree-arrow.empty { visibility:hidden; }',
    '.tree-label { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
    '.tree-children { padding-left:16px; }',
    '.tree-children.collapsed { display:none; }',
    '.level-tag { display:inline-block; padding:0 5px; border-radius:8px; font-size:11px; line-height:16px; flex-shrink:0; }',
    '.level-tag-a { background:var(--tag-error-bg,#fde8e8); color:var(--error); }',
    '.level-tag-b { background:var(--tag-warning-bg,#fef3e2); color:var(--warning); }',
    '.level-tag-c { background:var(--tag-info-bg,#e8f4fd); color:var(--tag-info-color,var(--primary)); }',
    '.level-tag-yilei { background:#e8f4fd; color:var(--primary); }',
    '.level-tag-erlei { background:#f0e8fd; color:#7c5cfc; }',
    '.org-tree-count { font-size:var(--font-size-11); color:var(--text-tertiary); padding:4px 8px; margin-bottom:4px; }'
  ].join('\n');
  document.head.appendChild(s);
})();

// ---------- state ----------
var _orgTreeExpanded = { /* containerId -> Set of expanded node ids */ };
var _orgTreeSelected = { /* containerId -> selected node id */ };
var _orgTreeOptions = { /* containerId -> options */ };

// ---------- helpers ----------
var _LEVEL_TAG_MAP = {
  'A级管控': { cls:'level-tag-a', label:'A' },
  'B级管控': { cls:'level-tag-b', label:'B' },
  'C级管控': { cls:'level-tag-c', label:'C' }
};

function getOrgUnits() {
  if (typeof orgList === 'undefined') return [];
  var root = orgList[0];
  if (!root) return [];
  var units = [{ id:root.id, name:root.name, level:'', levelClass:'' }];
  if (root.children) {
    root.children.forEach(function(c) {
      if (c.type === '单位') {
        units.push({ id:c.id, name:c.name, level:c.level||'', levelClass:c.levelClass||'' });
      }
    });
  }
  return units;
}

// ---------- render ----------
function renderOrgTree(containerId, labelId, options) {
  var container = document.getElementById(containerId);
  if (!container) return;
  if (typeof orgList === 'undefined') {
    container.innerHTML = '<div style="padding:12px;color:var(--text-tertiary);font-size:var(--font-size-12);">未加载组织数据</div>';
    return;
  }
  var opts = options || {};
  var mode = opts.mode || 'units-only';
  var defaultUnit = opts.defaultUnit || 'group';
  var root = orgList[0];
  if (!root) return;

  // ensure expanded set exists, default: root expanded
  if (!_orgTreeExpanded[containerId]) {
    _orgTreeExpanded[containerId] = new Set(['group']);
  }
  // track selected unit
  if (!_orgTreeSelected[containerId]) {
    _orgTreeSelected[containerId] = defaultUnit;
  }
  _orgTreeOptions[containerId] = { mode:mode, labelId:labelId, defaultUnit:defaultUnit };

  var selectedId = _orgTreeSelected[containerId];
  var html = '<div class="org-tree">';
  html += _renderNode(root, 0, selectedId, mode, containerId);

  // children of root
  var expanded = _orgTreeExpanded[containerId];
  var childrenHtml = '';
  var hasChildren = false;

  if (mode === 'assessment') {
    // virtual groups first
    childrenHtml += _renderVirtualNode('yilei', '一类考核部室', 'level-tag-yilei', '一类', selectedId);
    childrenHtml += _renderVirtualNode('erlei', '二类考核部室', 'level-tag-erlei', '二类', selectedId);
    hasChildren = true;
  }

  if (root.children) {
    root.children.forEach(function(c) {
      if (c.type !== '单位') return;
      hasChildren = true;
      childrenHtml += _renderUnitNode(c, selectedId, mode, containerId);
    });
  }

  if (hasChildren) {
    html += '<div class="tree-children' + (expanded.has('group') ? '' : ' collapsed') + '">';
    html += childrenHtml;
    html += '</div>';
  }

  html += '</div>';

  // unit count
  var unitCount = root.children ? root.children.filter(function(c){ return c.type==='单位'; }).length : 0;
  html += '<div class="org-tree-count">共 ' + unitCount + ' 家二级企业</div>';

  container.innerHTML = html;

  // bind search filter
  _bindTreeSearch(containerId);
}

function _renderNode(node, depth, activeId, mode, containerId) {
  var isActive = node.id === activeId;
  var expanded = _orgTreeExpanded[containerId] || new Set();
  var hasChildren = !!(node.children && node.children.length > 0);
  if (node.id === 'group') hasChildren = true;

  return '<div class="tree-node' + (isActive ? ' active' : '') + '" data-unit="' + node.id + '" data-action="selectUnit" data-param="' + node.id + '">'
    + '<span class="tree-arrow' + (hasChildren ? (expanded.has(node.id) ? ' open' : '') : ' empty') + '" data-action="toggleOrgTreeNode" data-param="' + node.id + '">&#9654;</span>'
    + '<span class="node-icon unit">单</span>'
    + '<span class="tree-label">' + node.name + '</span>'
    + '</div>';
}

function _renderUnitNode(unit, activeId, mode, containerId) {
  var isActive = unit.id === activeId;
  var expanded = _orgTreeExpanded[containerId] || new Set();
  var hasDeptChildren = !!(unit.children && unit.children.length > 0);
  var tag = '';
  if (mode === 'assessment' && _LEVEL_TAG_MAP[unit.level]) {
    var m = _LEVEL_TAG_MAP[unit.level];
    tag = '<span class="level-tag ' + m.cls + '">' + m.label + '</span>';
  }

  var html = '<div class="tree-node' + (isActive ? ' active' : '') + '" data-unit="' + unit.id + '" data-action="selectUnit" data-param="' + unit.id + '">'
    + '<span class="tree-arrow' + (hasDeptChildren ? (expanded.has(unit.id) ? ' open' : '') : ' empty') + '" data-action="toggleOrgTreeNode" data-param="' + unit.id + '">&#9654;</span>'
    + '<span class="node-icon unit">单</span>'
    + '<span class="tree-label">' + unit.name + '</span>'
    + tag
    + '</div>';

  if (hasDeptChildren) {
    html += '<div class="tree-children' + (expanded.has(unit.id) ? '' : ' collapsed') + '">';
    unit.children.forEach(function(dept) {
      html += '<div class="tree-node" data-unit="' + dept.id + '" data-action="selectUnit" data-param="' + dept.id + '">'
        + '<span class="tree-arrow empty">&#9654;</span>'
        + '<span class="node-icon dept">部</span>'
        + '<span class="tree-label">' + dept.name + '</span>'
        + '</div>';
    });
    html += '</div>';
  }
  return html;
}

function _renderVirtualNode(id, name, tagCls, tagLabel, activeId) {
  var isActive = id === activeId;
  return '<div class="tree-node' + (isActive ? ' active' : '') + '" data-unit="' + id + '" data-action="selectUnit" data-param="' + id + '">'
    + '<span class="tree-arrow empty">&#9654;</span>'
    + '<span class="node-icon dept">类</span>'
    + '<span class="tree-label">' + name + '</span>'
    + '<span class="level-tag ' + tagCls + '">' + tagLabel + '</span>'
    + '</div>';
}

// ---------- select unit ----------
function selectOrgUnit(containerId, unitId) {
  _orgTreeSelected[containerId] = unitId;
  var opts = _orgTreeOptions[containerId] || {};
  // update label
  var label = document.getElementById(opts.labelId);
  if (label) {
    var nodeEl = document.querySelector('#' + containerId + ' [data-unit="' + unitId + '"]');
    if (nodeEl) {
      var labelEl = nodeEl.querySelector('.tree-label');
      label.textContent = '（' + (labelEl ? labelEl.textContent : unitId) + '）';
    }
  }
  // re-render to update active state
  renderOrgTree(containerId, opts.labelId, opts);
}

// ---------- toggle expand/collapse ----------
function toggleOrgTreeNode(nodeId) {
  var container = null;
  var containerId = null;
  var allContainers = document.querySelectorAll('.org-tree');
  for (var i = 0; i < allContainers.length; i++) {
    var arrow = allContainers[i].querySelector('[data-action="toggleOrgTreeNode"][data-param="' + nodeId + '"]');
    if (arrow) {
      container = allContainers[i].parentElement;
      containerId = container.id;
      break;
    }
  }
  if (!containerId) return;

  var expanded = _orgTreeExpanded[containerId];
  if (!expanded) return;

  if (expanded.has(nodeId)) {
    expanded.delete(nodeId);
  } else {
    expanded.add(nodeId);
  }

  var opts = _orgTreeOptions[containerId] || {};
  renderOrgTree(containerId, opts.labelId, opts);
}
window.toggleOrgTreeNode = toggleOrgTreeNode;

// ---------- search filter ----------
function _bindTreeSearch(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var panel = container.closest('.st-tree-panel');
  var searchInput = panel ? panel.querySelector('#treeSearch') : null;
  if (!searchInput) searchInput = document.getElementById('treeSearch');
  if (!searchInput) return;

  // remove old listener
  if (searchInput._orgTreeSearchHandler) {
    searchInput.removeEventListener('input', searchInput._orgTreeSearchHandler);
  }

  searchInput._orgTreeSearchHandler = function() {
    var q = this.value.trim().toLowerCase();
    var orgTree = container.querySelector('.org-tree');
    if (!orgTree) return;

    var nodes = orgTree.querySelectorAll('.tree-node');

    if (!q) {
      // reset: re-render to restore expand/collapse state
      var opts = _orgTreeOptions[containerId] || {};
      renderOrgTree(containerId, opts.labelId, opts);
      return;
    }

    // hide all first
    nodes.forEach(function(n) { n.style.display = 'none'; });
    // expand all children containers
    orgTree.querySelectorAll('.tree-children').forEach(function(c) { c.classList.remove('collapsed'); });

    // show matching nodes + ancestors
    nodes.forEach(function(n) {
      var labelEl = n.querySelector('.tree-label');
      if (labelEl && labelEl.textContent.toLowerCase().indexOf(q) !== -1) {
        n.style.display = '';
        // show all ancestor nodes and expand their children containers
        var parent = n.parentElement;
        while (parent && parent !== orgTree) {
          if (parent.classList.contains('tree-node')) {
            parent.style.display = '';
          }
          parent = parent.parentElement;
        }
      }
    });
  };

  searchInput.addEventListener('input', searchInput._orgTreeSearchHandler);
}

// ---------- public API ----------
window.renderOrgTree = renderOrgTree;
window.getOrgUnits = getOrgUnits;
window.selectOrgUnit = selectOrgUnit;
