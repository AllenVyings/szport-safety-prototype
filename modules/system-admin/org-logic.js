/** org.html - 逻辑层（从内联脚本提取） */
    function flattenOrg(nodes, depth, result) {
      result = result || [];
      nodes.forEach(function(node) {
        result.push({ data:node, depth:depth, hasChildren: !!(node.children && node.children.length) });
        if (node.children && expandedSet.has(node.id)) flattenOrg(node.children, depth + 1, result);
      });
      return result;
    }

    function renderTable() {
      var rows = flattenOrg(orgList, 0);
      var html = '';
      rows.forEach(function(row) {
        var d = row.data;
        var isAbnormal = d.sync === '异常';
        var isDeleted = d.sync === '已删除';
        var rowClass = isAbnormal ? 'row-abnormal' : (isDeleted ? 'row-deleted' : '');
        var indent = '';
        for (var i = 0; i < row.depth; i++) indent += '<span class="indent"></span>';
        var toggleClass = row.hasChildren ? (expandedSet.has(d.id) ? 'open' : '') : 'empty';
        var iconClass = d.type === '单位' ? 'unit' : 'dept';
        var icon = d.type === '单位' ? '单' : '部';
        var statusDotClass = isAbnormal ? 'abnormal' : (isDeleted ? 'deleted' : 'normal');
        var statusBar = '<span class="status-bar ' + statusDotClass + '"></span>';
        // #4 fix: 管控级别标签用独立 class，不再加 tag 基类
        var levelHtml = d.levelClass ? '<span class="' + d.levelClass + '">' + d.level + '</span>' : '—';
        var syncHtml = '<span class="tag ' + d.syncClass + '" style="font-size:var(--font-size-11);">' + d.sync + '</span>';
        var mapCount = d.mapping ? d.mapping.length : 0;
        var mapHtml = mapCount > 0 ? '<span class="mapping-count" title="' + d.mapping.join('、') + '">' + mapCount + ' 个映射</span>' : '<span style="color:var(--text-description); font-size:var(--font-size-12);">无</span>';

        html += '<tr class="' + rowClass + '" data-id="' + d.id + '" data-name="' + d.name + '" data-type="' + d.type + '" data-level="' + (d.level === '—' ? '' : d.level.charAt(0)) + '" data-sync="' + d.sync + '">';
        html += '<td><div class="name-cell">' + indent;
        html += '<span class="toggle-btn ' + toggleClass + '" data-action="toggleRow" data-param="' + d.id + '">&#9654;</span>';
        html += '<span class="node-icon ' + iconClass + '">' + icon + '</span>';
        html += statusBar + '<span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + d.name + '</span></div></td>';
        html += '<td style="color:var(--text-secondary); font-size:var(--font-size-12); font-family:monospace;">' + d.code + '</td>';
        html += '<td><span class="tag ' + (d.type === '单位' ? 'tag-info' : 'tag-warning') + '" style="font-size:var(--font-size-11);">' + d.type + '</span></td>';
        html += '<td>' + levelHtml + '</td>';
        html += '<td>' + syncHtml + '</td>';
        html += '<td>' + mapHtml + '</td>';
        html += '<td><div class="action-btns">';
        if (isDeleted) {
          html += '<button class="btn btn-text btn-sm" style="color:var(--success);" data-action="openRestore" data-param="' + d.id + '">恢复</button>';
          html += '<button class="btn btn-text btn-sm" style="color:var(--error);" data-action="openDelete" data-param="' + d.id + '">永久删除</button>';
        } else if (isAbnormal) {
          html += '<button class="btn btn-text btn-sm" disabled>编辑</button>';
          html += '<button class="btn btn-text btn-sm" disabled>映射</button>';
          html += '<button class="btn btn-text btn-sm" style="color:var(--error);" data-action="openDelete" data-param="' + d.id + '">删除</button>';
        } else {
          html += '<button class="btn btn-text btn-sm" data-action="openEdit" data-param="' + d.id + '">编辑</button>';
          html += '<button class="btn btn-text btn-sm" style="color:var(--brand);" data-action="openMapping" data-param="' + d.id + '">映射</button>';
          html += '<button class="btn btn-text btn-sm" style="color:var(--error);" data-action="openDelete" data-param="' + d.id + '">删除</button>';
        }
        html += '</div></td></tr>';
      });
      document.getElementById('org-tbody').innerHTML = html;
      // #10 fix: 渲染后重新应用筛选
      applyFilters();
    }

    function toggleRow(id) {
      if (expandedSet.has(id)) expandedSet.delete(id); else expandedSet.add(id);
      renderTable();
    }
    function expandAll() {
      (function walk(nodes) { nodes.forEach(function(n) { if (n.children && n.children.length) { expandedSet.add(n.id); walk(n.children); } }); })(orgList);
      renderTable();
    }
    function collapseAll() { expandedSet.clear(); expandedSet.add('group'); renderTable(); }

    // #10 fix: 统一筛选入口，状态持久化
    function applyFilters() {
      var keyword = document.getElementById('filter-keyword').value.toLowerCase();
      var selects = document.querySelectorAll('.filter-select');
      var level = selects[0].value, type = selects[1].value, sync = selects[2].value;
      filterState = { keyword:keyword, level:level, type:type, sync:sync };

      var visibleCount = 0;
      document.querySelectorAll('#org-tbody tr').forEach(function(tr) {
        var name = (tr.getAttribute('data-name') || '').toLowerCase();
        var show = true;
        if (keyword && name.indexOf(keyword) === -1) show = false;
        if (level && tr.getAttribute('data-level') !== level) show = false;
        if (type && tr.getAttribute('data-type') !== type) show = false;
        if (sync && tr.getAttribute('data-sync') !== sync) show = false;
        tr.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      // #14 fix: 空状态
      var emptyEl = document.getElementById('empty-state');
      if (visibleCount === 0) { emptyEl.classList.add('show'); } else { emptyEl.classList.remove('show'); }
    }

    function resetFilters() {
      document.getElementById('filter-keyword').value = '';
      document.querySelectorAll('.filter-select').forEach(function(s) { s.selectedIndex = 0; });
      applyFilters();
    }

    // ===== 源组织树 =====

    function renderSourceTree(filter) {
      var html = '';
      (function walk(nodes, depth) {
        nodes.forEach(function(n) {
          var nameMatch = !filter || n.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
          var hasCh = n.children && n.children.length;
          var childHasMatch = false;
          if (filter && hasCh) {
            (function check(arr) { arr.forEach(function(c) { if (c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) childHasMatch = true; if (c.children) check(c.children); }); })(n.children);
          }
          var visible = !filter || nameMatch || childHasMatch;
          if (!visible) return;
          var arrowClass = hasCh ? (srcExpanded.has(n.id) ? 'open' : '') : 'empty';
          var icon = n.type === '单位' ? '单' : '部';
          var iconClass = n.type === '单位' ? 'unit' : 'dept';
          // #15 fix: 红色感叹号加 title
          var unmapped = n.unmapped ? '<span class="unmapped-mark" title="该源组织未被本系统映射">!</span>' : '';
          var hlName = filter && nameMatch ? n.name.replace(new RegExp('(' + filter.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','gi'), '<mark>$1</mark>') : n.name;
          html += '<div class="src-node" style="padding-left:' + (6 + depth * 14) + 'px;">';
          html += '<span class="arrow ' + arrowClass + '" data-action="toggleSrcNode" data-param="' + n.id + '">&#9654;</span>';
          html += unmapped + '<span class="node-icon ' + iconClass + '">' + icon + '</span> ' + hlName;
          html += '</div>';
          if (hasCh) {
            html += '<div class="src-children' + (srcExpanded.has(n.id) ? '' : ' collapsed') + '">';
            walk(n.children, depth + 1);
            html += '</div>';
          }
        });
      })(srcOrgData, 0);
      document.getElementById('source-tree').innerHTML = html;
    }

    function toggleSrcNode(id, e) {
      e && e.stopPropagation();
      if (srcExpanded.has(id)) srcExpanded.delete(id); else srcExpanded.add(id);
      var filter = document.querySelector('.src-search').value;
      renderSourceTree(filter || '');
    }

    function filterSrcTree(val) { renderSourceTree(val); }

    // ===== 查找 =====
    function findOrg(nodes, id) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) return nodes[i];
        if (nodes[i].children) { var f = findOrg(nodes[i].children, id); if (f) return f; }
      }
      return null;
    }

    // ===== 编辑弹窗（含映射+脏标记） =====
    var currentEditId = null;

    function openEdit(id) {
      var d = findOrg(orgList, id);
      if (!d) return;
      currentEditId = id;
      document.getElementById('edit-name').value = d.name;
      document.getElementById('edit-code').value = d.code;
      document.querySelectorAll('input[name="edit-type"]').forEach(function(r) { r.checked = (r.value === d.type); });
      document.getElementById('edit-parent').value = d.parent;
      document.getElementById('edit-level').value = d.level === '—' ? '' : d.level;
      document.getElementById('edit-sort').value = d.sort;
      document.getElementById('edit-addr').value = d.addr || '';
      var dirty = d.dirty || {};
      toggleDirty('dirty-name', dirty.name);
      toggleDirty('dirty-level', dirty.level);
      toggleDirty('dirty-sort', dirty.sort);
      toggleDirty('dirty-region', dirty.region);
      toggleDirty('dirty-addr', dirty.addr);
      openModal('modal-edit');
    }

    function toggleDirty(elId, isDirty) {
      var el = document.getElementById(elId);
      if (el) { if (isDirty) el.classList.add('show'); else el.classList.remove('show'); }
    }

    // ===== 映射配置弹窗 =====
    var mappingOrgId = null;
    var mappingSelected = []; // 当前已选中的源组织名称列表

    // 扁平化源组织数据，用于下拉列表
    function flattenSrcOrg(nodes, parentPath) {
      var result = [];
      nodes.forEach(function(n) {
        var path = parentPath ? (parentPath + ' / ' + n.name) : n.name;
        result.push({ id: n.id, name: n.name, type: n.type, path: path, parentPath: parentPath || '' });
        if (n.children) result = result.concat(flattenSrcOrg(n.children, n.name));
      });
      return result;
    }

    // 获取所有已被其他组织映射的源组织名称
    function getLinkedSrcNames(excludeId) {
      var linked = new Set();
      (function walk(list) {
        list.forEach(function(d) {
          if (d.id !== excludeId && d.mapping) {
            d.mapping.forEach(function(m) { linked.add(m); });
          }
          if (d.children) walk(d.children);
        });
      })(orgList);
      return linked;
    }

    function openMapping(id) {
      var d = findOrg(orgList, id);
      if (!d) return;
      mappingOrgId = id;
      mappingSelected = (d.mapping || []).slice();
      document.getElementById('mapping-org-name').value = d.name;
      renderMappingDropdown();
      renderMappingTags();
      openModal('modal-mapping');
    }

    function toggleMappingDropdown() {
      var dd = document.getElementById('mapping-dropdown');
      var trigger = document.getElementById('mapping-select-trigger');
      if (dd.classList.contains('show')) {
        dd.classList.remove('show');
        trigger.classList.remove('open');
      } else {
        var rect = trigger.getBoundingClientRect();
        var ddWidth = rect.width;
        var spaceBelow = window.innerHeight - rect.bottom;
        var listHeight = 300;
        var ddHeight = listHeight + 48; // search + list
        var top = rect.bottom + 4;
        if (spaceBelow < ddHeight && rect.top > ddHeight) {
          top = rect.top - ddHeight - 4;
        }
        dd.style.top = top + 'px';
        dd.style.left = rect.left + 'px';
        dd.style.width = ddWidth + 'px';
        dd.classList.add('show');
        trigger.classList.add('open');
        document.getElementById('mapping-search-input').value = '';
        renderMappingDropdown();
        document.getElementById('mapping-search-input').focus();
      }
    }

    function renderMappingDropdown(filter) {
      var allItems = flattenSrcOrg(srcOrgData, '');
      var linkedNames = getLinkedSrcNames(mappingOrgId);
      var html = '';
      allItems.forEach(function(item) {
        if (filter && item.name.indexOf(filter) === -1 && item.path.indexOf(filter) === -1) return;
        var isSelected = mappingSelected.indexOf(item.name) > -1;
        var isLinkedByOther = linkedNames.has(item.name);
        var cls = 'mapping-option';
        if (isSelected) cls += ' selected';
        if (isLinkedByOther && !isSelected) cls += ' disabled';
        var iconText = item.type === '单位' ? '单' : '部';
        var iconCls = item.type === '单位' ? 'unit' : 'dept';
        html += '<div class="' + cls + '" data-name="' + item.name + '"';
        if (!isLinkedByOther || isSelected) html += ' data-action="toggleMappingOption" data-param="' + item.name.replace(/'/g, "\\'") + '"';
        html += '>';
        html += '<span class="opt-check"></span>';
        html += '<span class="opt-icon ' + iconCls + '">' + iconText + '</span>';
        html += '<span class="opt-label"><span class="opt-name">' + item.name + '</span>';
        if (item.parentPath) html += '<span class="opt-path"> — ' + item.parentPath + '</span>';
        html += '</span>';
        if (isLinkedByOther && !isSelected) html += '<span class="opt-linked">已关联</span>';
        html += '</div>';
      });
      if (!html) html = '<div style="padding:20px; text-align:center; color:var(--text-description); font-size:var(--font-size-13);">无匹配结果</div>';
      document.getElementById('mapping-dropdown-list').innerHTML = html;
    }

    function filterMappingOptions(kw) {
      renderMappingDropdown(kw.trim());
    }

    function toggleMappingOption(name) {
      var idx = mappingSelected.indexOf(name);
      if (idx > -1) {
        mappingSelected.splice(idx, 1);
      } else {
        mappingSelected.push(name);
      }
      renderMappingDropdown(document.getElementById('mapping-search-input').value.trim());
      renderMappingTags();
    }

    function removeMappingTag(name) {
      var idx = mappingSelected.indexOf(name);
      if (idx > -1) mappingSelected.splice(idx, 1);
      renderMappingTags();
      renderMappingDropdown(document.getElementById('mapping-search-input').value.trim());
    }

    function renderMappingTags() {
      var container = document.getElementById('mapping-trigger-tags');
      if (mappingSelected.length === 0) {
        container.innerHTML = '<span class="mapping-placeholder" id="mapping-placeholder">请选择源组织机构</span>';
      } else {
        container.innerHTML = mappingSelected.map(function(name) {
          return '<span class="mapping-trigger-tag">' + name + '<span class="tag-remove" data-action="removeMappingTag" data-param="' + name.replace(/'/g, "\\'") + '">&times;</span></span>';
        }).join('');
      }
    }

    function saveMapping() {
      var d = findOrg(orgList, mappingOrgId);
      if (!d) return;
      d.mapping = mappingSelected.slice();
      renderTable();
      closeModal('modal-mapping');
    }

    // 点击外部关闭下拉
    document.addEventListener('click', function(e) {
      var dd = document.getElementById('mapping-dropdown');
      var trigger = document.getElementById('mapping-select-trigger');
      if (dd && dd.classList.contains('show') && !trigger.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.remove('show');
        trigger.classList.remove('open');
      }
    });
    // 映射弹窗内点击空白也关闭下拉
    document.getElementById('modal-mapping').addEventListener('click', function(e) {
      var dd = document.getElementById('mapping-dropdown');
      var trigger = document.getElementById('mapping-select-trigger');
      if (dd && dd.classList.contains('show') && !trigger.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.remove('show');
        trigger.classList.remove('open');
      }
    });

    // ===== 删除 =====
    function openDelete(id) {
      var d = findOrg(orgList, id);
      if (!d) return;
      var childCount = countDesc(d);
      var isPerm = d.sync === '已删除';
      document.getElementById('delete-title').textContent = isPerm ? '永久删除' : '确认删除';
      var html = '<p>确定要' + (isPerm ? '永久删除' : '删除') + ' <strong>' + d.name + '</strong> 吗？</p>';
      if (isPerm) {
        html += '<div class="alert alert-error">永久删除不可恢复，所有关联数据将被清除</div>';
      } else {
        html += '<div class="alert alert-error">此操作为逻辑删除，删除后可在列表中筛选"已删除"状态恢复</div>';
      }
      if (childCount > 0) {
        html += '<div class="delete-scope"><strong>影响范围：</strong><ul><li>将级联删除下属 ' + childCount + ' 个子组织</li>';
        if (d.type === '单位') html += '<li>该单位下所有业务数据将标记为"已删除组织"关联</li>';
        html += '</ul></div>';
      }
      if (d.type === '单位' && d.sync !== '已删除') {
        var refHtml = getRefSummary(d);
        if (refHtml) html += '<div class="delete-scope" style="margin-top:4px;"><strong>业务引用：</strong><ul>' + refHtml + '</ul></div>';
      }
      document.getElementById('delete-content').innerHTML = html;
      document.getElementById('delete-confirm-btn').textContent = isPerm ? '永久删除' : '确认删除';
      openModal('modal-delete');
    }

    function countDesc(node) {
      if (!node.children) return 0;
      var c = node.children.length;
      node.children.forEach(function(ch) { c += countDesc(ch); });
      return c;
    }

    // #11 fix: 恢复已删除需确认弹窗
    function openRestore(id) {
      var d = findOrg(orgList, id);
      if (!d) return;
      document.getElementById('delete-title').textContent = '确认恢复';
      var html = '<p>确定要恢复 <strong>' + d.name + '</strong> 吗？</p>';
      html += '<div style="padding:12px 16px; border-radius:var(--radius-sm); background:var(--success-light); border:1px solid var(--success); margin:12px 0; font-size:var(--font-size-13); color:var(--success);">恢复后该组织将重新参与业务操作和数据同步</div>';
      var childCount = countDesc(d);
      if (childCount > 0) {
        html += '<div class="delete-scope"><strong>影响范围：</strong><ul><li>将同时恢复下属 ' + childCount + ' 个子组织</li></ul></div>';
      }
      document.getElementById('delete-content').innerHTML = html;
      var btn = document.getElementById('delete-confirm-btn');
      btn.textContent = '确认恢复';
      btn.style.background = 'var(--success)';
      btn.style.borderColor = 'var(--success)';
      btn.onclick = function() { restoreOrg(id); closeModal('modal-delete'); btn.style.background = ''; btn.style.borderColor = ''; btn.onclick = null; };
      openModal('modal-delete');
    }

    function restoreOrg(id) {
      var d = findOrg(orgList, id);
      if (!d) return;
      d.sync = '正常';
      d.syncClass = 'tag-success';
      if (d.children) d.children.forEach(function(ch) { ch.sync = '正常'; ch.syncClass = 'tag-success'; });
      renderTable();
    }

    // ===== 纳入组织弹窗 - 源组织树 =====

    // #13 fix: 框架图动态渲染 + 二级展开/折叠
    var chartExpanded = new Set();

    function renderChart() {
      var root = orgList[0];
      if (!root) return;
      var html = '';
      // 根节点
      html += '<div class="chart-row"><div class="chart-node"><div class="node-name">' + root.name + '</div><div class="node-info">' + root.code + '</div></div></div>';
      html += '<div class="chart-connector-v"></div>';
      // 一级分支
      html += '<div class="chart-branch">';
      root.children.forEach(function(child) {
        // 异常/已删除节点隐藏
        if (child.sync === '异常' || child.sync === '已删除') return;
        if (child.type === '部门') {
          html += '<div class="chart-row"><div class="chart-node dept-node"><div class="node-name" style="font-size:var(--font-size-12);">' + child.name + '</div><div class="node-info">' + child.code + '</div></div></div>';
        } else {
          var isExpanded = chartExpanded.has(child.id);
          html += '<div class="chart-row">';
          html += '<div class="chart-node" data-action="toggleChartNode" data-param="' + child.id + '">';
          html += '<div class="node-name" style="font-size:var(--font-size-12);">' + child.name + '</div>';
          html += '<div class="node-info">' + child.code + '</div>';
          if (child.children && child.children.length) {
            html += '<div class="chart-expand-hint">' + (isExpanded ? '点击收起' : '点击展开下属部门') + '</div>';
          }
          html += '</div>';
          // 二级部门
          if (child.children && child.children.length && isExpanded) {
            html += '<div class="chart-connector-v"></div>';
            html += '<div class="chart-sub">';
            child.children.forEach(function(sub) {
              if (sub.sync === '异常' || sub.sync === '已删除') return;
              html += '<div class="chart-node dept-node" style="min-width:100px;"><div class="node-name" style="font-size:var(--font-size-11);">' + sub.name + '</div></div>';
            });
            html += '</div>';
          }
          html += '</div>';
        }
      });
      html += '</div>';
      document.getElementById('chart-container').innerHTML = html;
    }

    function toggleChartNode(id) {
      if (chartExpanded.has(id)) chartExpanded.delete(id); else chartExpanded.add(id);
      renderChart();
    }

    // ===== 通用 =====
    function switchTab(name, evt) {
      document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      evt.target.classList.add('active');
      document.getElementById('tab-' + name).classList.add('active');
      if (name === 'chart') renderChart();
    }

    function openModal(id) { document.getElementById(id).classList.add('show'); }

    // ===== 上级组织树形选择器 =====
    var treeSelectExpanded = new Set(['group']);
    var treeSelectValue = '';

    function toggleTreeSelect(target) {
      var dd = document.getElementById('tree-select-dropdown');
      var trigger = document.getElementById('add-parent-trigger');
      if (dd.classList.contains('show')) {
        dd.classList.remove('show');
        trigger.classList.remove('open');
      } else {
        var rect = trigger.getBoundingClientRect();
        var ddHeight = 340;
        var top = rect.bottom + 4;
        if (window.innerHeight - rect.bottom < ddHeight && rect.top > ddHeight) {
          top = rect.top - ddHeight - 4;
        }
        dd.style.top = top + 'px';
        dd.style.left = rect.left + 'px';
        dd.style.width = Math.max(rect.width, 280) + 'px';
        dd.classList.add('show');
        trigger.classList.add('open');
        document.getElementById('tree-select-search-input').value = '';
        renderTreeSelect();
        document.getElementById('tree-select-search-input').focus();
      }
    }

    function renderTreeSelect(filter) {
      var html = '';
      (function walk(nodes, depth) {
        nodes.forEach(function(n) {
          var nameMatch = !filter || n.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
          var hasCh = n.children && n.children.length;
          var childHasMatch = false;
          if (filter && hasCh) {
            (function check(arr) { arr.forEach(function(c) { if (c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) childHasMatch = true; if (c.children) check(c.children); }); })(n.children);
          }
          if (filter && !nameMatch && !childHasMatch) return;
          var arrowClass = hasCh ? (treeSelectExpanded.has(n.id) ? 'open' : '') : 'empty';
          var icon = n.type === '单位' ? '单' : '部';
          var iconClass = n.type === '单位' ? 'unit' : 'dept';
          var isSelected = treeSelectValue === n.name;
          var hlName = filter && nameMatch ? n.name.replace(new RegExp('(' + filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>') : n.name;
          html += '<div class="tree-select-node' + (isSelected ? ' selected' : '') + '" style="padding-left:' + (12 + depth * 16) + 'px;" data-action="selectTreeParent" data-param="' + n.name.replace(/'/g, "\\'") + '">';
          html += '<span class="ts-arrow ' + arrowClass + '" data-action="toggleTreeSelectNode" data-param="' + n.id + '">&#9654;</span>';
          html += '<span class="node-icon ' + iconClass + '">' + icon + '</span> ' + hlName;
          html += '</div>';
          if (hasCh) {
            html += '<div class="tree-select-children' + (treeSelectExpanded.has(n.id) ? '' : ' collapsed') + '">';
            walk(n.children, depth + 1);
            html += '</div>';
          }
        });
      })(orgList, 0);
      if (!html) html = '<div style="padding:20px; text-align:center; color:var(--text-description); font-size:var(--font-size-13);">无匹配结果</div>';
      document.getElementById('tree-select-list').innerHTML = html;
    }

    function toggleTreeSelectNode(id) {
      if (treeSelectExpanded.has(id)) treeSelectExpanded.delete(id); else treeSelectExpanded.add(id);
      var filter = document.getElementById('tree-select-search-input').value;
      renderTreeSelect(filter || undefined);
    }

    function selectTreeParent(name) {
      treeSelectValue = name;
      var textEl = document.getElementById('add-parent-text');
      textEl.textContent = name;
      textEl.classList.remove('placeholder');
      // close dropdown
      document.getElementById('tree-select-dropdown').classList.remove('show');
      document.getElementById('add-parent-trigger').classList.remove('open');
      renderTreeSelect();
    }

    function filterTreeSelect(kw) {
      renderTreeSelect(kw.trim() || undefined);
    }

    // close tree select on outside click
    document.addEventListener('click', function(e) {
      var dd = document.getElementById('tree-select-dropdown');
      var trigger = document.getElementById('add-parent-trigger');
      if (dd && dd.classList.contains('show') && !trigger.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.remove('show');
        trigger.classList.remove('open');
      }
    });

    // ===== 地图选点 =====
    var mapPickerTarget = 'add'; // 'add' or 'edit'
    var mapSelectedAddr = '';


    function openMapPicker(target) {
      mapPickerTarget = target;
      mapSelectedAddr = '';
      document.getElementById('map-search').value = '';
      document.getElementById('map-search-results').innerHTML = '';
      document.getElementById('map-selected-info').style.display = 'none';
      var pin = document.getElementById('map-center-pin');
      pin.className = 'map-center-pin';
      openModal('modal-map');
    }

    function searchMapAddress() {
      var kw = document.getElementById('map-search').value.trim();
      var results = kw ? mapAddrData.filter(function(d) {
        return d.name.indexOf(kw) > -1 || d.addr.indexOf(kw) > -1;
      }) : mapAddrData;
      var html = '';
      results.forEach(function(d, i) {
        html += '<div class="map-result-item" data-idx="' + i + '" data-action="selectMapResult" data-param="' + i + '">' +
          '<div class="result-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>' +
          '<div class="result-info"><div class="result-name">' + d.name + '</div><div class="result-addr">' + d.addr + '</div></div></div>';
      });
      if (!results.length) {
        html = '<div style="text-align:center; padding:24px 0; color:var(--text-description); font-size:var(--font-size-13);">未找到匹配地址</div>';
      }
      document.getElementById('map-search-results').innerHTML = html;
      // 临时存储搜索结果供选择用
      window._mapSearchResults = results;
    }

    function selectMapResult(idx, ev) {
      idx = parseInt(idx, 10);
      document.querySelectorAll('.map-result-item').forEach(function(item) { item.classList.remove('selected'); });
      var el = ev.target.closest('.map-result-item');
      if (el) el.classList.add('selected');
      var d = window._mapSearchResults[idx];
      mapSelectedAddr = d.addr;
      // 更新底部已选信息
      document.getElementById('map-selected-text').textContent = d.addr;
      document.getElementById('map-selected-info').style.display = 'flex';
      // 地图标记弹跳动画
      var pin = document.getElementById('map-center-pin');
      pin.className = 'map-center-pin bounce';
      setTimeout(function() { pin.className = 'map-center-pin'; }, 500);
    }

    function confirmMapAddress() {
      if (!mapSelectedAddr) return;
      var inputId = mapPickerTarget === 'add' ? 'add-addr' : 'edit-addr';
      document.getElementById(inputId).value = mapSelectedAddr;
      closeModal('modal-map');
    }

    // 回车搜索
    document.getElementById('map-search').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') searchMapAddress();
    });

    // ===== 同步弹窗 =====
    function syncOrg() {
      showConfirm('同步组织数据', '将从统一身份认证平台拉取最新组织架构数据，是否继续？', function() {
        showToast('组织数据同步成功');
      }, '<div style="margin-top:8px; font-size:var(--font-size-12); color:var(--text-secondary); line-height:1.8;">同步规则说明：<br>• 已本地修改的字段同步时将保留本地值（跳过）<br>• 源端新增的二级企业将自动纳入本系统<br>• 三级及以下企业仍需手动新增后映射<br>• 源端已删除/停用的组织将标记为异常</div>');
    }

    // ===== 通用确认弹窗 =====
    function showConfirm(title, message, onOk, extraHtml) {
      document.getElementById('delete-title').textContent = title;
      var html = '<p>' + message + '</p>';
      if (extraHtml) html += extraHtml;
      document.getElementById('delete-content').innerHTML = html;
      var btn = document.getElementById('delete-confirm-btn');
      btn.textContent = '确定';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.onclick = function() { closeModal('modal-delete'); btn.onclick = null; if (onOk) onOk(); };
      openModal('modal-delete');
    }

    // ===== Toast 提示 =====

    // ===== 删除引用检查 =====
    function getRefSummary(d) {
      var refs = [];
      if (d.id === 'u01') { refs.push('<li>关联 3 条隐患记录</li><li>关联 2 个危险源</li><li>关联 1 个培训任务</li>'); }
      else if (d.id === 'u02') { refs.push('<li>关联 1 条隐患记录</li>'); }
      else if (d.id === 'group') { refs.push('<li>关联 12 条隐患记录</li><li>关联 8 个危险源</li><li>关联 5 个培训任务</li><li>关联 2 份安全生产责任书</li>'); }
      return refs.join('');
    }

    // ===== 组织类型切换→管控级别动态必填 =====
    document.querySelectorAll('input[name="add-type"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        var req = document.getElementById('add-level-required');
        if (req) req.style.display = this.value === '单位' ? 'inline' : 'none';
        var levelSelect = document.getElementById('add-level');
        if (this.value === '部门' && levelSelect) levelSelect.value = '';
      });
    });

    // 初始化
    renderTable();
    renderSourceTree('');

    // backdrop click to close modals
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.classList.remove('show');
      });
    });
    document.addEventListener('input', function(e) {
      var el = e.target.closest('[data-action="filterSrcTree"]');
      if (el) filterSrcTree(el.value);
    });