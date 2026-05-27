function getStatusTag(status) {
  var map = { '筹建': 'tag-prepare', '在建': 'tag-building', '运营': 'tag-operating', '已结束': 'tag-ended' };
  return map[status] || '';
}

var treeExpanded = new Set(['group']);

function filterUnitTree(val) {
  if ((val || '').trim()) {
    treeExpanded.add('group');
    (function expandAll(nodes) {
      nodes.forEach(function(n) {
        if (n.type === '单位' && n.children && n.children.length) {
          treeExpanded.add(n.id);
          expandAll(n.children);
        }
      });
    })(orgList[0].children);
  }
  renderUnitTree();
}

function buildUnitTreeHTML(nodes, depth, filter) {
  var html = '';
  var q = (filter || '').trim().toLowerCase();
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    var nameMatch = !q || n.name.toLowerCase().indexOf(q) >= 0;
    var hasCh = n.children && n.children.some(function(c) { return c.type === '单位'; });
    var childMatch = false;
    if (q && hasCh) {
      (function walk(arr) {
        arr.forEach(function(c) {
          if (c.name.toLowerCase().indexOf(q) >= 0) childMatch = true;
          if (c.children) walk(c.children);
        });
      })(n.children);
    }
    if (q && !nameMatch && !childMatch) continue;

    var arrowClass = hasCh ? (treeExpanded.has(n.id) ? 'open' : '') : 'empty';
    var selected = currentUnitId === n.id ? ' active' : '';
    var hl = n.name;
    if (q && nameMatch) {
      hl = n.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    }

    html += '<div class="src-node' + selected + '" style="padding-left:' + (4 + depth * 14) + 'px;" data-action="selectUnit" data-param="' + n.id + '">';
    html += '<span class="arrow ' + arrowClass + '" data-action="toggleUnitNode" data-param="' + n.id + '">&#9654;</span>';
    html += '<span class="node-icon unit">单</span>';
    html += '<span class="node-label">' + hl + '</span>';
    html += '</div>';
    if (hasCh) {
      html += '<div class="src-children' + (treeExpanded.has(n.id) ? '' : ' collapsed') + '" id="unit-children-' + n.id + '">';
      html += buildUnitTreeHTML(n.children, depth + 1, filter);
      html += '</div>';
    }
  }
  return html;
}

function renderUnitTree() {
  var root = orgList[0];
  var filter = document.getElementById('unit-tree-search');
  var q = filter ? filter.value.trim() : '';
  var rootNode = { id: root.id, name: root.name, type: '单位', children: getUnitsFromOrg(root.children) };
  var html = buildUnitTreeHTML([rootNode], 0, q);
  document.getElementById('unit-tree').innerHTML = html || '<div class="sb-tree-empty">无匹配单位</div>';
}

function loadUnitChildren(parentId) {
  var parent = findOrgById(parentId);
  if (!parent || !parent.children) return;
  var childUnits = getUnitsFromOrg(parent.children);
  var container = document.getElementById('unit-children-' + parentId);
  if (!container) return;
  var filter = document.getElementById('unit-tree-search');
  var q = filter ? filter.value.trim() : '';
  var depth = 1;
  container.innerHTML = buildUnitTreeHTML(childUnits, 1, q);
}

function toggleUnitNode(id) {
  if (treeExpanded.has(id)) treeExpanded.delete(id);
  else treeExpanded.add(id);
  var container = document.getElementById('unit-children-' + id);
  if (!container) return;
  var isCollapsed = container.classList.contains('collapsed');
  var arrow = document.querySelector('[data-action="toggleUnitNode"][data-param="' + id + '"] .arrow, [data-action="toggleUnitNode"][data-param="' + id + '"].arrow');
  if (isCollapsed) {
    container.classList.remove('collapsed');
    if (arrow) arrow.classList.add('open');
    loadUnitChildren(id);
  } else {
    container.classList.add('collapsed');
    if (arrow) arrow.classList.remove('open');
  }
}

function selectUnit(id) {
  currentUnitId = id;
  var nodes = document.querySelectorAll('.src-node');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove('active');
  }
  var el = document.querySelector('[data-action="selectUnit"][data-param="' + id + '"]');
  if (el) el.classList.add('active');
  renderTable();
}

function getFilteredProjects() {
  var list = projectList;
  if (currentUnitId) {
    list = list.filter(function(p) { return p.unitId === currentUnitId; });
  }
  var typeFilter = document.getElementById('filter-type').value;
  if (typeFilter) {
    list = list.filter(function(p) { return p.type === typeFilter; });
  }
  var statusFilter = document.getElementById('filter-status').value;
  if (statusFilter) {
    list = list.filter(function(p) { return p.status === statusFilter; });
  }
  var nameFilter = document.getElementById('filter-name').value.trim();
  if (nameFilter) {
    list = list.filter(function(p) { return p.name.indexOf(nameFilter) !== -1; });
  }
  if (currentStatFilter) {
    if (currentStatFilter === '在建') {
      list = list.filter(function(p) { return p.type === '在建'; });
    } else if (currentStatFilter === '在营') {
      list = list.filter(function(p) { return p.type === '在营'; });
    } else if (currentStatFilter === '已结束') {
      list = list.filter(function(p) { return p.status === '已结束'; });
    }
  }
  return list;
}

function updateStats(list) {
  var allInUnit = currentUnitId ? projectList.filter(function(p) { return p.unitId === currentUnitId; }) : projectList;
  document.getElementById('stat-total').textContent = allInUnit.length;
  document.getElementById('stat-building').textContent = allInUnit.filter(function(p) { return p.type === '在建'; }).length;
  document.getElementById('stat-operating').textContent = allInUnit.filter(function(p) { return p.type === '在营'; }).length;
  document.getElementById('stat-ended').textContent = allInUnit.filter(function(p) { return p.status === '已结束'; }).length;

  var statItems = document.querySelectorAll('#stat-bar .stat-item');
  for (var i = 0; i < statItems.length; i++) {
    statItems[i].classList.remove('stat-active');
  }
  var activeIdx = 0;
  if (currentStatFilter === '在建') activeIdx = 1;
  else if (currentStatFilter === '在营') activeIdx = 2;
  else if (currentStatFilter === '已结束') activeIdx = 3;
  statItems[activeIdx].classList.add('stat-active');
}

function renderTable() {
  var list = getFilteredProjects();
  updateStats(list);

  var html = '';
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var statusTag = getStatusTag(p.status);
    html += '<tr>' +
      '<td><input type="checkbox" class="row-checkbox" value="' + escapeHtml(p.id) + '"></td>' +
      '<td>' + (i + 1) + '</td>' +
      '<td class="col-name">' + escapeHtml(p.name) + '</td>' +
      '<td class="col-unit">' + escapeHtml(p.unitName) + '</td>' +
      '<td class="col-type">' + escapeHtml(p.type) + '</td>' +
      '<td class="col-status"><span class="tag ' + statusTag + '">' + escapeHtml(p.status) + '</span></td>' +
      '<td class="col-person">' + escapeHtml(p.manager) + '</td>' +
      '<td class="col-person">' + escapeHtml(p.safetyOfficer || '-') + '</td>' +
      '<td class="col-actions"><button class="btn btn-text btn-sm" data-action="viewProject" data-param="' + escapeHtml(p.id) + '">查看</button>' +
      '<button class="btn btn-text btn-sm" data-action="editProject" data-param="' + escapeHtml(p.id) + '">编辑</button></td>' +
      '</tr>';
  }
  document.getElementById('project-tbody').innerHTML = html;
  document.getElementById('empty-state').style.display = list.length === 0 ? '' : 'none';
  document.getElementById('pagination-info').textContent = '共 ' + list.length + ' 条';
  document.getElementById('pagination-pages').innerHTML = '<div class="pagination-page active">1</div>';
  document.getElementById('select-all').checked = false;
}

function applyFilters() {
  currentStatFilter = '';
  renderTable();
}

function resetFilters() {
  document.getElementById('filter-name').value = '';
  document.getElementById('filter-type').value = '';
  document.getElementById('filter-status').value = '';
  currentStatFilter = '';
  renderTable();
}

function filterByStat(filter) {
  if (currentStatFilter === filter) {
    currentStatFilter = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
  } else {
    currentStatFilter = filter;
    document.getElementById('filter-type').value = (filter === '在建' || filter === '在营') ? filter : '';
    document.getElementById('filter-status').value = (filter === '已结束') ? filter : '';
  }
  renderTable();
}

function viewProject(id) {
  var p = findProject(id);
  if (!p) return;
  document.getElementById('detail-title').textContent = p.name + ' - 项目详情';
  var fields = [
    ['项目名称', p.name],
    ['所属单位', p.unitName],
    ['项目分类', p.type],
    ['状态', p.status],
    ['项目负责人', p.manager],
    ['安全负责人', p.safetyOfficer || '-'],
    ['项目地址', p.address || '-'],
    ['开始日期', p.startDate],
    ['预计结束日期', p.endDate || '-']
  ];
  var html = '';
  for (var i = 0; i < fields.length; i++) {
    html += '<div class="detail-field"><span class="field-label">' + escapeHtml(fields[i][0]) + '</span><span class="field-value">' + escapeHtml(fields[i][1]) + '</span></div>';
  }
  document.getElementById('detail-fields').innerHTML = html;
  document.getElementById('detail-remark').textContent = p.remark || '-';
  document.getElementById('view-list').classList.remove('active');
  document.getElementById('view-detail').classList.add('active');
}

function showForm(mode, projectId) {
  populateUnitSelect('form-unit');
  document.getElementById('form-mode').value = mode;
  var isEdit = mode === 'edit';
  document.getElementById('form-title').textContent = isEdit ? '编辑项目' : '新增项目';
  document.getElementById('form-status-group').style.display = isEdit ? '' : 'none';
  document.getElementById('form-status-placeholder').style.display = isEdit ? 'none' : '';
  if (isEdit) {
    var p = findProject(projectId);
    if (!p) return;
    document.getElementById('form-edit-id').value = projectId;
    document.getElementById('form-name').value = p.name;
    document.getElementById('form-type').value = p.type;
    document.getElementById('form-unit').value = p.unitId;
    document.getElementById('form-unit').disabled = false;
    document.getElementById('form-status').value = p.status;
    document.getElementById('form-manager').value = p.manager;
    document.getElementById('form-safety').value = p.safetyOfficer || '';
    document.getElementById('form-address').value = p.address || '';
    document.getElementById('form-start').value = p.startDate;
    document.getElementById('form-end').value = p.endDate || '';
    document.getElementById('form-remark').value = p.remark || '';
  } else {
    document.getElementById('form-edit-id').value = '';
    document.getElementById('form-name').value = '';
    document.getElementById('form-type').value = '在建';
    document.getElementById('form-unit').value = currentUnitId || '';
    document.getElementById('form-unit').disabled = !!currentUnitId;
    document.getElementById('form-manager').value = '';
    document.getElementById('form-safety').value = '';
    document.getElementById('form-address').value = '';
    document.getElementById('form-start').value = '';
    document.getElementById('form-end').value = '';
    document.getElementById('form-remark').value = '';
  }
  document.getElementById('view-list').classList.remove('active');
  document.getElementById('view-detail').classList.remove('active');
  document.getElementById('view-form').classList.add('active');
}

function editProject(id) {
  showForm('edit', id);
}

function showAddPage() {
  showForm('add');
}

function saveForm() {
  var mode = document.getElementById('form-mode').value;
  var name = document.getElementById('form-name').value.trim();
  var unitId = document.getElementById('form-unit').value;
  var type = document.getElementById('form-type').value;
  var manager = document.getElementById('form-manager').value.trim();
  var startDate = document.getElementById('form-start').value;
  var endDate = document.getElementById('form-end').value;
  if (!name) { alert('请填写项目名称'); return; }
  if (!unitId) { alert('请选择所属单位'); return; }
  if (!manager) { alert('请填写项目负责人'); return; }
  if (!startDate) { alert('请选择开始日期'); return; }
  if (endDate && startDate > endDate) { alert('预计结束日期不能早于开始日期'); return; }
  var editId = document.getElementById('form-edit-id').value;
  var dup = projectList.filter(function(p) { return p.name === name && p.id !== editId; });
  if (dup.length > 0) { alert('项目名称已存在，请使用不同的名称'); return; }
  var unit = findOrgById(unitId);
  if (mode === 'edit') {
    var p = findProject(editId);
    if (!p) { alert('项目数据异常，请刷新页面后重试'); return; }
    p.name = name;
    p.type = type;
    p.unitId = unitId;
    p.unitName = unit ? unit.name : '';
    p.status = document.getElementById('form-status').value;
    p.manager = manager;
    p.safetyOfficer = document.getElementById('form-safety').value.trim();
    p.address = document.getElementById('form-address').value.trim();
    p.startDate = startDate;
    p.endDate = endDate;
    p.remark = document.getElementById('form-remark').value.trim();
  } else {
    var maxNum = 0;
    for (var i = 0; i < projectList.length; i++) {
      var parts = projectList[i].id.split('-');
      var num = parseInt(parts[parts.length - 1]);
      if (num > maxNum) maxNum = num;
    }
    var newId = 'proj-' + (maxNum + 1);
    projectList.push({
      id: newId,
      name: name,
      unitId: unitId,
      unitName: unit ? unit.name : '',
      type: type,
      status: '筹建',
      manager: manager,
      safetyOfficer: document.getElementById('form-safety').value.trim(),
      address: document.getElementById('form-address').value.trim(),
      startDate: startDate,
      endDate: endDate,
      remark: document.getElementById('form-remark').value.trim()
    });
  }
  showListView();
  renderTable();
}

function backToList() {
  showListView();
}

function showListView() {
  document.getElementById('view-detail').classList.remove('active');
  document.getElementById('view-form').classList.remove('active');
  document.getElementById('view-list').classList.add('active');
}

function batchDelete() {
  var checked = document.querySelectorAll('.row-checkbox:checked');
  if (checked.length === 0) { alert('请先勾选项目'); return; }
  if (!confirm('确认删除选中的 ' + checked.length + ' 个项目？')) return;
  var ids = [];
  for (var i = 0; i < checked.length; i++) {
    ids.push(checked[i].value);
  }
  projectList = projectList.filter(function(p) { return ids.indexOf(p.id) === -1; });
  renderTable();
}

function changeStatus(id) {
  var p = findProject(id);
  if (!p) return;
  var nextStatus = { '筹建': '在建', '在建': '运营', '运营': '已结束', '已结束': '在建' };
  var next = nextStatus[p.status] || '在建';
  if (confirm('确认将「' + p.name + '」状态从「' + p.status + '」变更为「' + next + '」？')) {
    p.status = next;
    if (next === '已结束' && !p.endDate) {
      p.endDate = new Date().toISOString().slice(0, 10);
    }
    renderTable();
  }
}

function exportProjects() {
  alert('导出当前筛选条件下的项目列表（Excel）');
}

function populateUnitSelect(elId) {
  var units = getUnitsFromOrg(orgList[0].children);
  var allUnits = [];
  function collect(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      allUnits.push(nodes[i]);
      if (nodes[i].children) collect(nodes[i].children);
    }
  }
  collect(units);
  var html = '';
  for (var i = 0; i < allUnits.length; i++) {
    html += '<option value="' + allUnits[i].id + '">' + allUnits[i].name + '</option>';
  }
  document.getElementById(elId).innerHTML = html;
}

function findProject(id) {
  for (var i = 0; i < projectList.length; i++) {
    if (projectList[i].id === id) return projectList[i];
  }
  return null;
}

document.getElementById('select-all').addEventListener('change', function() {
  var checked = this.checked;
  var boxes = document.querySelectorAll('.row-checkbox');
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = checked;
  }
});

renderUnitTree();
renderTable();
