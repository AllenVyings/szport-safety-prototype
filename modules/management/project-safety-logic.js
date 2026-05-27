function initSafetyUnitSelect() {
  var units = getUnitsFromOrg(orgList[0].children);
  var allUnits = [];
  function collect(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      allUnits.push(nodes[i]);
      if (nodes[i].children) collect(nodes[i].children);
    }
  }
  collect(units);
  var html = '<option value="">全部单位</option>';
  for (var i = 0; i < allUnits.length; i++) {
    html += '<option value="' + allUnits[i].id + '">' + allUnits[i].name + '</option>';
  }
  document.getElementById('safety-unit-select').innerHTML = html;
}

function selectSafetyUnit() {
  var unitId = document.getElementById('safety-unit-select').value;
  currentSafetyUnitId = unitId;
  currentSafetyProjectId = '';
  buildSafetyProjectTree();
  renderSafetyTable();
}

function buildSafetyProjectTree() {
  var filtered = currentSafetyUnitId
    ? projectList.filter(function(p) { return p.unitId === currentSafetyUnitId; })
    : projectList;
  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    html += '<div class="src-node" data-action="selectSafetyProject" data-param="' + filtered[i].id + '"><span class="node-icon project">项</span><span class="node-label">' + filtered[i].name + '</span></div>';
  }
  if (filtered.length === 0) {
    html = '<div style="font-size:var(--font-size-12); color:var(--text-description); text-align:center; padding:20px;">暂无项目</div>';
  }
  document.getElementById('safety-project-tree').innerHTML = html;
}

function selectSafetyProject(projId) {
  currentSafetyProjectId = projId;
  var nodes = document.querySelectorAll('#safety-project-tree .src-node');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove('active');
  }
  var el = document.querySelector('[data-action="selectSafetyProject"][data-param="' + projId + '"]');
  if (el) el.classList.add('active');
  var proj = projectList.filter(function(p) { return p.id === projId; })[0];
  document.getElementById('safety-title').textContent = (proj ? proj.name : '') + ' - 安全记录';
  renderSafetyTable();
}

function getFilteredSafety() {
  if (currentSafetyProjectId) {
    return safetyRecordList.filter(function(r) { return r.projectId === currentSafetyProjectId; });
  }
  if (currentSafetyUnitId) {
    var ids = projectList.filter(function(p) { return p.unitId === currentSafetyUnitId; }).map(function(p) { return p.id; });
    return safetyRecordList.filter(function(r) { return ids.indexOf(r.projectId) >= 0; });
  }
  return safetyRecordList;
}

function renderSafetyTable() {
  var list = getFilteredSafety();
  updateSafetyStats(list);

  if (!currentSafetyProjectId) {
    if (currentSafetyUnitId) {
      var u = findOrgById(currentSafetyUnitId);
      document.getElementById('safety-title').textContent = (u ? u.name : '') + ' - 安全记录';
    } else {
      document.getElementById('safety-title').textContent = '全部项目 - 安全记录';
    }
  }

  var html = '';
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    html += '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td><span class="tag ' + r.typeClass + '" style="font-size:var(--font-size-11);">' + r.type + '</span></td>' +
      '<td>' + r.time + '</td>' +
      '<td>' + r.desc + '</td>' +
      '<td><span class="tag ' + r.statusTag + '">' + r.status + '</span></td>' +
      '<td><button class="btn btn-text btn-sm u-text-primary" data-action="jumpToSource" data-param="' + r.id + '">跳转查看</button></td>' +
      '</tr>';
  }
  document.getElementById('safety-tbody').innerHTML = html;
  document.getElementById('safety-empty').style.display = list.length === 0 ? '' : 'none';
  if (list.length === 0) {
    document.getElementById('safety-empty').querySelector('div').textContent = '暂无安全记录';
  }
  document.getElementById('safety-pagination-info').textContent = '共 ' + list.length + ' 条';
}

function jumpToSource(id) {
  var r = safetyRecordList.filter(function(x) { return x.id === id; })[0];
  if (!r) return;
  var pathMap = {
    '隐患排查治理': 'modules/hazard/rectification.html',
    '危险作业管理': 'modules/on-site/dangerous-work.html',
    '安全检查': 'modules/hazard/inspection.html'
  };
  var targetPath = pathMap[r.sourceModule];
  if (targetPath) {
    if (window.parent && window.parent.app && window.parent.app.navigate) {
      window.parent.app.navigate(targetPath);
    } else {
      alert('跳转至「' + r.sourceModule + '」→ ' + targetPath + '?recordId=' + r.id + '\n（原型演示：实际部署后将跳转至源模块对应记录）');
    }
  } else {
    alert('跳转至「' + r.sourceModule + '」模块查看详情（原型演示）');
  }
}

function updateSafetyStats(list) {
  document.getElementById('safety-stat-total').textContent = list.length;
  document.getElementById('safety-stat-hazard').textContent = list.filter(function(r) { return r.type === '隐患'; }).length;
  document.getElementById('safety-stat-work').textContent = list.filter(function(r) { return r.type === '危险作业'; }).length;
  document.getElementById('safety-stat-check').textContent = list.filter(function(r) { return r.type === '安全检查'; }).length;
}

document.getElementById('safety-unit-select').addEventListener('change', selectSafetyUnit);

initSafetyUnitSelect();
buildSafetyProjectTree();
renderSafetyTable();
