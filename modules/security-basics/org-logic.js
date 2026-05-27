/** 组织保障 — 左组织树 + 右双 Tab */

var sbSelectedUnitId = 'group';
var sbDrawerTarget = null;
var sbTreeExpanded = new Set(['group', 'u03', 'u05']);
var sbActiveTab = 'chart';

function sbIsUnitNode(n) {
  return n && n.type === '单位';
}

function sbDerivePosts(data) {
  var map = {};
  function add(members) {
    (members || []).forEach(function(m) {
      var postName = SB_DUTY_TO_POST[m.duty] || m.duty;
      if (!map[postName]) map[postName] = { postName: postName, names: [] };
      if (map[postName].names.indexOf(m.name) < 0) map[postName].names.push(m.name);
    });
  }
  if (data.committee) add(data.committee.members);
  if (data.office) add(data.office.members);
  return Object.keys(map).map(function(k) { return map[k]; });
}

function sbMemberSummary(members, max) {
  max = max || 3;
  if (!members || !members.length) return '未配置成员';
  var parts = members.slice(0, max).map(function(m) { return m.name; });
  var s = parts.join('、');
  if (members.length > max) s += ' 等' + members.length + '人';
  return s;
}

function sbUnitStatusTag(unitId) {
  var data = sbSafetyOrgByUnit[unitId];
  if (!data || data.publishStatus === 'none' || !data.committee) {
    return '<span class="sb-tree-tag tag-default">未配置</span>';
  }
  if (data.pendingApproval) {
    return '<span class="sb-tree-tag tag-warning">审批中</span>';
  }
  return '<span class="sb-tree-tag tag-success">已生效</span>';
}

function sbBuildTreeHTML(nodes, depth, filter) {
  var html = '';
  var q = (filter || '').trim().toLowerCase();
  (nodes || []).forEach(function(n) {
    var nameMatch = !q || n.name.toLowerCase().indexOf(q) >= 0;
    var hasCh = n.children && n.children.length;
    var childMatch = false;
    if (q && hasCh) {
      (function walk(arr) {
        arr.forEach(function(c) {
          if (c.name.toLowerCase().indexOf(q) >= 0) childMatch = true;
          if (c.children) walk(c.children);
        });
      })(n.children);
    }
    if (q && !nameMatch && !childMatch) return;

    var hasChUnits = hasCh;
    var arrowClass = hasChUnits ? (sbTreeExpanded.has(n.id) ? 'open' : '') : 'empty';
    var selected = sbSelectedUnitId === n.id ? ' selected' : '';
    var hl = n.name;
    if (q && nameMatch) {
      hl = n.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    }

    html += '<div class="src-node' + selected + '" style="padding-left:' + (4 + depth * 14) + 'px;" data-action="selectSbUnit" data-param="' + n.id + '">';
    html += '<span class="arrow ' + arrowClass + '" data-action="sbToggleTree" data-param="' + n.id + '">&#9654;</span>';
    html += '<span class="node-icon unit">单</span>';
    html += '<span class="node-label">' + hl + '</span>';
    html += sbUnitStatusTag(n.id);
    html += '</div>';
    if (hasChUnits) {
      html += '<div class="src-children' + (sbTreeExpanded.has(n.id) ? '' : ' collapsed') + '">';
      html += sbBuildTreeHTML(n.children, depth + 1, filter);
      html += '</div>';
    }
  });
  return html;
}

function sbRenderOrgTree() {
  var box = document.getElementById('org-tree-container');
  if (!box) return;
  var f = document.getElementById('org-tree-search');
  var filter = f ? f.value.trim() : '';
  var html = sbBuildTreeHTML(sbOrgTree, 0, filter);
  box.innerHTML = html || '<div class="sb-tree-empty">无匹配单位</div>';
}

function sbToggleTree(unitId, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (sbTreeExpanded.has(unitId)) sbTreeExpanded.delete(unitId);
  else sbTreeExpanded.add(unitId);
  sbRenderOrgTree();
}
window.sbToggleTree = sbToggleTree;

function sbFilterOrgTree(val) {
  if ((val || '').trim()) {
    (function expandAll(nodes) {
      nodes.forEach(function(n) {
        if (n.children && n.children.length) {
          sbTreeExpanded.add(n.id);
          expandAll(n.children);
        }
      });
    })(sbOrgTree);
  }
  sbRenderOrgTree();
}
window.sbFilterOrgTree = sbFilterOrgTree;

function switchSbTab(tab, secondArg) {
  sbActiveTab = tab || 'chart';
  document.querySelectorAll('#sb-tab-bar .tab-item').forEach(function(t) {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  var tabEl = secondArg && secondArg.target ? secondArg.target.closest('.tab-item') : null;
  if (!tabEl) {
    document.querySelectorAll('#sb-tab-bar .tab-item').forEach(function(t) {
      if (t.getAttribute('data-param') === sbActiveTab) tabEl = t;
    });
  }
  if (tabEl) {
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-selected', 'true');
  }
  document.getElementById('tab-chart').classList.toggle('active', sbActiveTab === 'chart');
  document.getElementById('tab-config').classList.toggle('active', sbActiveTab === 'config');
}
window.switchSbTab = switchSbTab;

function sbRenderBanner(data) {
  var el = document.getElementById('unit-banner');
  if (!el) return;
  if (!data || !data.committee) {
    el.innerHTML = '当前单位：<strong>' + (data ? data.unitName : '未知单位') + '</strong> · <span class="tag tag-default">未配置</span>';
    var hint = document.getElementById('sb-unconfigured-hint');
    if (hint) hint.style.display = 'block';
    return;
  }
  var tags = '<span class="tag tag-success">已生效</span>';
  if (data.pendingApproval) tags += ' <span class="tag tag-warning">审批中</span>';
  el.innerHTML = '当前单位：<strong>' + data.unitName + '</strong> · ' + tags;
  var hint = document.getElementById('sb-unconfigured-hint');
  if (hint) hint.style.display = 'none';
}

function sbRenderPendingBanner(data) {
  var banner = document.getElementById('sb-pending-banner');
  if (!banner) return;
  if (data && data.pendingApproval) {
    banner.style.display = 'block';
    banner.textContent = data.pendingHint || '变更审批中，当前展示已生效版本。';
  } else {
    banner.style.display = 'none';
  }
}

function sbRenderChart(data) {
  var wrap = document.getElementById('chart-container');
  if (!data || !data.committee) {
    wrap.innerHTML =
      '<div class="sb-empty">' +
      '<p>该单位尚未配置安全组织。</p>' +
      '<button type="button" class="btn btn-primary" data-action="sbStartConfigure">开始配置</button>' +
      '</div>';
    return;
  }
  var cm = data.committee;
  var of = data.office;
  var posts = sbDerivePosts(data);
  var html = '';
  html += '<div class="chart-node chart-node-clickable" data-action="openSbDrawer" data-param="committee">';
  html += '<div class="node-title">' + cm.name + '</div>';
  html += '<div class="node-sub">安委会 · ' + sbMemberSummary(cm.members) + '</div>';
  html += '<div class="node-hint">点击编辑</div></div>';
  html += '<div class="chart-line"></div>';
  html += '<div class="chart-node chart-node-clickable" data-action="openSbDrawer" data-param="office">';
  html += '<div class="node-title">' + of.name + '</div>';
  html += '<div class="node-sub">安委办 · ' + (of.attachNote || '') + '</div>';
  html += '<div class="node-sub">' + sbMemberSummary(of.members) + '</div>';
  html += '<div class="node-hint">点击编辑</div></div>';
  html += '<div class="chart-line"></div>';
  html += '<div class="chart-post-layer">';
  html += '<div class="chart-post-layer-title">安全岗位（职务自动推导，只读）</div>';
  html += '<div class="chart-posts">';
  posts.forEach(function(p) {
    html += '<div class="chart-post-card" data-action="sbPostReadonlyHint">';
    html += '<div class="post-name">' + p.postName + '</div>';
    html += '<div class="post-person">' + p.names.join('、') + '</div></div>';
  });
  html += '</div></div>';
  wrap.innerHTML = html;
}

function sbRenderConfig(data) {
  var wrap = document.getElementById('config-container');
  if (!data || !data.committee) {
    wrap.innerHTML = '<div class="sb-empty">请先在「安全组织架构图」Tab 完成配置，或点击「开始配置」。</div>';
    return;
  }
  var cm = data.committee;
  var of = data.office;
  var posts = sbDerivePosts(data);
  function memberTags(list) {
    return (list || []).map(function(m) {
      return '<span class="member-tag">' + m.name + ' <span class="role">' + m.duty + '</span></span>';
    }).join('');
  }
  var postRows = posts.map(function(p, i) {
    return '<tr><td>' + (i + 1) + '</td><td>' + p.postName + '</td><td>' + p.names.join('、') + '</td><td><span class="tag tag-default">自动推导</span></td></tr>';
  }).join('');

  var approvalBar = '';
  if (data.pendingApproval && sbSafetyOrgByUnit.group && sbSafetyOrgByUnit.group.isGroupLevel) {
    approvalBar = '<div style="margin-bottom:14px;padding:10px 14px;background:var(--warning-light);border:1px solid var(--warning-border);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;">' +
      '<span style="font-size:var(--font-size-13);color:var(--warning);">' + (data.pendingHint || '变更审批中') + '</span>' +
      '<span style="display:flex;gap:8px;">' +
      '<button type="button" class="btn btn-primary btn-sm" data-action="sbApproveSubmit">审批通过</button>' +
      '<button type="button" class="btn btn-default btn-sm" data-action="sbRejectSubmit">退回</button>' +
      '</span></div>';
  }

  wrap.innerHTML = approvalBar +
    '<div class="section-block">' +
      '<div class="section-block-header"><span class="section-block-title">安委会</span>' +
      '<button type="button" class="btn btn-primary btn-sm" data-action="openSbDrawer" data-param="committee">编辑</button></div>' +
      '<div class="section-block-body">' +
        '<div class="block-name">' + cm.name + '</div>' +
        '<div class="section-desc">' + cm.duty + '</div>' +
        '<div class="field-label">成员</div><div class="member-list">' + memberTags(cm.members) + '</div>' +
      '</div></div>' +
    '<div class="section-block">' +
      '<div class="section-block-header"><span class="section-block-title">安委办</span>' +
      '<button type="button" class="btn btn-primary btn-sm" data-action="openSbDrawer" data-param="office">编辑</button></div>' +
      '<div class="section-block-body">' +
        '<div class="block-name">' + of.name + '</div>' +
        '<div class="attach-line">挂靠说明：' + (of.attachNote || '—') + '</div>' +
        '<div class="section-desc">' + of.duty + '</div>' +
        '<div class="member-list">' + memberTags(of.members) + '</div>' +
      '</div></div>' +
    '<div class="section-block">' +
      '<div class="section-block-header"><span class="section-block-title">安全岗位展示（只读）</span>' +
      '<button type="button" class="btn btn-default btn-sm" data-action="sbPostReadonlyHint">说明</button></div>' +
      '<div class="section-block-body"><div class="table-wrap"><table class="data-table">' +
        '<thead><tr><th>序号</th><th>岗位</th><th>人员</th><th>来源</th></tr></thead><tbody>' + postRows + '</tbody></table></div></div></div>';
}

function sbRenderUnitPanel() {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  sbRenderBanner(data);
  sbRenderPendingBanner(data);
  sbRenderChart(data);
  sbRenderConfig(data);
}

function selectSbUnit(unitId) {
  if (!unitId) return;
  var found = null;
  (function walk(nodes) {
    nodes.forEach(function(n) {
      if (n.id === unitId) found = n;
      if (n.children) walk(n.children);
    });
  })(sbOrgTree);
  if (!found || !sbIsUnitNode(found)) return;
  sbSelectedUnitId = unitId;
  closeSbDrawer();
  sbRenderOrgTree();
  sbRenderUnitPanel();
}
window.selectSbUnit = selectSbUnit;

/* —— 抽屉（与此前确认方案一致）—— */

function sbRenderDrawerForm(target) {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !data.committee) return;
  var block = target === 'office' ? data.office : data.committee;
  document.getElementById('sb-drawer-title').textContent = '编辑 · ' + (target === 'office' ? '安委办' : '安委会');
  document.getElementById('sb-field-attach').style.display = target === 'office' ? 'block' : 'none';
  document.getElementById('sb-field-name').value = block.name || '';
  document.getElementById('sb-field-duty').value = block.duty || '';
  if (target === 'office') {
    document.getElementById('sb-field-attach-input').value = block.attachNote || '';
  }
  document.getElementById('sb-members-editor').innerHTML = (block.members || []).map(function(m, idx) {
    return '<div class="member-row">' +
      '<select class="form-input form-select">' +
      sbUserPickerOptions.map(function(o) {
        return '<option value="' + o.id + '"' + (o.id === m.userId ? ' selected' : '') + '>' + o.label + '</option>';
      }).join('') + '</select>' +
      '<select class="form-input form-select">' +
      SB_DUTY_OPTIONS.map(function(d) {
        return '<option' + (d === m.duty ? ' selected' : '') + '>' + d + '</option>';
      }).join('') + '</select>' +
      '<button type="button" class="btn btn-text btn-sm" data-action="sbRemoveMember" data-param="' + idx + '">删除</button></div>';
  }).join('');
  var saveBtn = document.getElementById('sb-drawer-save');
  if (data.isGroupLevel) {
    saveBtn.textContent = '保存（立即生效）';
    saveBtn.setAttribute('data-action', 'sbSaveGroup');
  } else {
    saveBtn.textContent = '保存并提交审批';
    saveBtn.setAttribute('data-action', 'sbSaveSubmit');
  }
}

function openSbDrawer(target) {
  sbDrawerTarget = target;
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !data.committee) {
    showToast('请先配置安全组织');
    return;
  }
  sbRenderDrawerForm(target);
  document.getElementById('sb-drawer').classList.add('open');
  document.getElementById('sb-drawer-mask').classList.add('open');
}
window.openSbDrawer = openSbDrawer;

function closeSbDrawer() {
  document.getElementById('sb-drawer').classList.remove('open');
  document.getElementById('sb-drawer-mask').classList.remove('open');
  sbDrawerTarget = null;
}
window.closeSbDrawer = closeSbDrawer;

function sbPostReadonlyHint() {
  showToast('岗位由成员职务自动推导，请在安委会/安委办中维护成员与职务');
}
window.sbPostReadonlyHint = sbPostReadonlyHint;

function sbStartConfigure() {
  var u = sbOrgTree[0];
  (function find(nodes) {
    nodes.forEach(function(n) {
      if (n.id === sbSelectedUnitId) u = n;
      if (n.children) find(n.children);
    });
  })(sbOrgTree);
  sbSafetyOrgByUnit[sbSelectedUnitId] = {
    unitName: sbSelectedUnitId === 'group' ? '深圳港集团（集团本部）' : (u ? u.name : sbSelectedUnitId),
    isGroupLevel: sbSelectedUnitId === 'group',
    publishStatus: 'draft',
    pendingApproval: false,
    committee: { name: '安全生产委员会', duty: '', members: [{ userId: 'u001', name: '张董事长', duty: '主任' }] },
    office: { name: '安全生产委员会办公室', duty: '', attachNote: '', members: [] }
  };
  sbRenderOrgTree();
  sbRenderUnitPanel();
  switchSbTab('config');
  openSbDrawer('committee');
}
window.sbStartConfigure = sbStartConfigure;

function sbAddMember() {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !sbDrawerTarget) return;
  var block = sbDrawerTarget === 'office' ? data.office : data.committee;
  block.members.push({ userId: sbUserPickerOptions[0].id, name: sbUserPickerOptions[0].label, duty: '委员' });
  sbRenderDrawerForm(sbDrawerTarget);
}
window.sbAddMember = sbAddMember;

function sbRemoveMember(idx) {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !sbDrawerTarget) return;
  var block = sbDrawerTarget === 'office' ? data.office : data.committee;
  if (block.members.length <= 1) {
    showToast('至少保留 1 名成员');
    return;
  }
  block.members.splice(Number(idx), 1);
  sbRenderDrawerForm(sbDrawerTarget);
}
window.sbRemoveMember = sbRemoveMember;

function sbCollectDrawerMembers() {
  var rows = document.querySelectorAll('#sb-members-editor .member-row');
  var list = [];
  rows.forEach(function(row) {
    var userSel = row.querySelectorAll('select')[0];
    var dutySel = row.querySelectorAll('select')[1];
    var uid = userSel.value;
    var opt = sbUserPickerOptions.find(function(o) { return o.id === uid; });
    list.push({ userId: uid, name: opt ? opt.label : uid, duty: dutySel.value });
  });
  return list;
}

function sbPersistDrawer() {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !sbDrawerTarget) return;
  var block = sbDrawerTarget === 'office' ? data.office : data.committee;
  block.name = document.getElementById('sb-field-name').value.trim();
  block.duty = document.getElementById('sb-field-duty').value.trim();
  if (sbDrawerTarget === 'office') {
    block.attachNote = document.getElementById('sb-field-attach-input').value.trim();
  }
  block.members = sbCollectDrawerMembers();
}

function sbSaveGroup() {
  sbPersistDrawer();
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (data) {
    data.publishStatus = 'effective';
    data.pendingApproval = false;
  }
  closeSbDrawer();
  showToast('已保存并立即生效（集团本级）');
  sbRenderOrgTree();
  sbRenderUnitPanel();
}
window.sbSaveGroup = sbSaveGroup;

function sbSaveSubmit() {
  sbPersistDrawer();
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (data) {
    data.publishStatus = 'pending';
    data.pendingApproval = true;
    data.pendingHint = '刚刚提交变更，待集团安全管理部审批';
  }
  closeSbDrawer();
  showToast('已提交审批，生效后将通知您');
  sbRenderOrgTree();
  sbRenderUnitPanel();
}
window.sbSaveSubmit = sbSaveSubmit;

function sbApproveSubmit() {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !data.pendingApproval) return;
  data.publishStatus = 'effective';
  data.pendingApproval = false;
  data.pendingHint = '';
  showToast('审批通过，变更已生效');
  sbRenderOrgTree();
  sbRenderUnitPanel();
}
window.sbApproveSubmit = sbApproveSubmit;

function sbRejectSubmit() {
  var data = sbSafetyOrgByUnit[sbSelectedUnitId];
  if (!data || !data.pendingApproval) return;
  data.publishStatus = 'effective';
  data.pendingApproval = false;
  data.pendingHint = '';
  showToast('已退回，申请人将收到通知');
  sbRenderOrgTree();
  sbRenderUnitPanel();
}
window.sbRejectSubmit = sbRejectSubmit;

function sbInitPage() {
  sbOrgTree = sbFilterUnitsOnly(sbOrgSourceFull);
  sbTreeExpanded.add('group');
  sbRenderOrgTree();
  sbRenderUnitPanel();
}

document.addEventListener('DOMContentLoaded', sbInitPage);
