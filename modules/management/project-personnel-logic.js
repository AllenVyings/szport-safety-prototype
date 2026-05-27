function initUnitSelect() {
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
  document.getElementById('unit-select').innerHTML = html;
}

function selectPersonnelUnit() {
  var unitId = document.getElementById('unit-select').value;
  currentPersonnelUnitId = unitId;
  currentPersonnelProjectId = '';
  buildProjectTree();
  renderPersonnelTable();
}

function buildProjectTree() {
  var filtered = currentPersonnelUnitId
    ? projectList.filter(function(p) { return p.unitId === currentPersonnelUnitId; })
    : projectList;
  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    html += '<div class="src-node" data-action="selectPersonnelProject" data-param="' + filtered[i].id + '"><span class="node-icon project">项</span><span class="node-label">' + filtered[i].name + '</span></div>';
  }
  if (filtered.length === 0) {
    html = '<div style="font-size:var(--font-size-12); color:var(--text-description); text-align:center; padding:20px;">暂无项目</div>';
  }
  document.getElementById('project-tree').innerHTML = html;
}

function selectPersonnelProject(projId) {
  currentPersonnelProjectId = projId;
  var nodes = document.querySelectorAll('#project-tree .src-node');
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove('active');
  }
  var el = document.querySelector('[data-action="selectPersonnelProject"][data-param="' + projId + '"]');
  if (el) el.classList.add('active');
  var proj = projectList.filter(function(p) { return p.id === projId; })[0];
  document.getElementById('personnel-title').textContent = (proj ? proj.name : '') + ' - 人员台账';
  renderPersonnelTable();
}

function getFilteredPersonnel() {
  if (currentPersonnelProjectId) {
    return personnelList.filter(function(p) { return p.projectId === currentPersonnelProjectId; });
  }
  if (currentPersonnelUnitId) {
    var ids = projectList.filter(function(p) { return p.unitId === currentPersonnelUnitId; }).map(function(p) { return p.id; });
    return personnelList.filter(function(p) { return ids.indexOf(p.projectId) >= 0; });
  }
  return personnelList;
}

function renderPersonnelTable() {
  var list = getFilteredPersonnel();
  updatePersonnelStats(list);

  if (!currentPersonnelProjectId) {
    if (currentPersonnelUnitId) {
      var u = findOrgById(currentPersonnelUnitId);
      document.getElementById('personnel-title').textContent = (u ? u.name : '') + ' - 人员台账';
    } else {
      document.getElementById('personnel-title').textContent = '全部项目 - 人员台账';
    }
  }

  var html = '';
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var certExpiryTag = '';
    if (p.certExpiryDate) {
      if (isCertExpired(p.certExpiryDate)) {
        certExpiryTag = ' <span class="tag tag-cert-expired" style="font-size:var(--font-size-11);">已过期</span>';
      } else if (isCertExpiringSoon(p.certExpiryDate)) {
        certExpiryTag = ' <span class="tag tag-cert-warning" style="font-size:var(--font-size-11);">即将到期</span>';
      }
    }
    var certTag = p.cert ? '<span class="tag tag-success" style="font-size:var(--font-size-11); margin-left:4px;">' + p.cert + '</span>' : '';
    var statusBtn = p.active
      ? '<button class="btn btn-text btn-sm u-text-warning" data-action="togglePersonnelStatus" data-param="' + p.id + '">停用</button>'
      : '<button class="btn btn-text btn-sm u-text-success" data-action="togglePersonnelStatus" data-param="' + p.id + '">启用</button>';
    html += '<tr>' +
      '<td><input type="checkbox" class="personnel-checkbox" value="' + p.id + '"></td>' +
      '<td>' + (i + 1) + '</td>' +
      '<td>' + p.name + '</td>' +
      '<td>' + p.unitName + '</td>' +
      '<td>' + p.position + '</td>' +
      '<td>' + certTag + certExpiryTag + '</td>' +
      '<td>' + (p.entryDate || '-') + '</td>' +
      '<td>' + (p.exitDate || '-') + '</td>' +
      '<td>' +
        '<button class="btn btn-text btn-sm" data-action="viewPersonnel" data-param="' + p.id + '">查看</button>' +
        '<button class="btn btn-text btn-sm" data-action="editPersonnel" data-param="' + p.id + '">编辑</button>' +
        '<button class="btn btn-text btn-sm u-text-error" data-action="deletePersonnel" data-param="' + p.id + '">删除</button>' +
        statusBtn +
      '</td>' +
      '</tr>';
  }
  document.getElementById('personnel-tbody').innerHTML = html;
  document.getElementById('personnel-empty').style.display = list.length === 0 ? '' : 'none';
  if (list.length === 0) {
    document.getElementById('personnel-empty').querySelector('div').textContent = '暂无人员数据';
  }
  document.getElementById('personnel-pagination-info').textContent = '共 ' + list.length + ' 条';
  document.getElementById('personnel-select-all').checked = false;
}

function findPersonnel(id) {
  for (var i = 0; i < personnelList.length; i++) {
    if (personnelList[i].id === id) return personnelList[i];
  }
  return null;
}

function isCertExpiringSoon(expiryDate) {
  if (!expiryDate) return false;
  var now = new Date();
  var expiry = new Date(expiryDate);
  var diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff >= 0;
}

function isCertExpired(expiryDate) {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

function showPersonnelAdd() {
  if (!currentPersonnelProjectId) { alert('请先在左侧选择一个具体项目'); return; }
  document.getElementById('personnel-modal-title').textContent = '新增人员';
  document.getElementById('personnel-edit-id').value = '';
  document.getElementById('personnel-name').value = '';
  document.getElementById('personnel-position').value = '';
  document.getElementById('personnel-cert').value = '';
  document.getElementById('personnel-cert-expiry').value = '';
  document.getElementById('personnel-phone').value = '';
  document.getElementById('personnel-entry').value = '';
  document.getElementById('personnel-exit').value = '';
  document.getElementById('personnel-remark').value = '';
  document.getElementById('personnelFormModal').style.display = 'flex';
}

function editPersonnel(id) {
  var p = findPersonnel(id);
  if (!p) return;
  document.getElementById('personnel-modal-title').textContent = '编辑人员';
  document.getElementById('personnel-edit-id').value = p.id;
  document.getElementById('personnel-name').value = p.name;
  document.getElementById('personnel-position').value = p.position;
  document.getElementById('personnel-cert').value = p.cert;
  document.getElementById('personnel-cert-expiry').value = p.certExpiryDate || '';
  document.getElementById('personnel-phone').value = p.phone;
  document.getElementById('personnel-entry').value = p.entryDate;
  document.getElementById('personnel-exit').value = p.exitDate;
  document.getElementById('personnel-remark').value = p.remark || '';
  document.getElementById('personnelFormModal').style.display = 'flex';
}

function viewPersonnel(id) {
  var p = findPersonnel(id);
  if (!p) return;
  var fields = [
    ['姓名', p.name],
    ['岗位', p.position],
    ['安全资质', p.cert || '-'],
    ['资质到期日', p.certExpiryDate || '-'],
    ['联系电话', p.phone || '-'],
    ['进场日期', p.entryDate || '-'],
    ['退场日期', p.exitDate || '-'],
    ['状态', p.active ? '启用' : '停用'],
    ['备注', p.remark || '-']
  ];
  var html = '';
  for (var i = 0; i < fields.length; i++) {
    html += '<div style="display:flex; padding:6px 0; font-size:var(--font-size-13);"><span style="width:80px;flex-shrink:0;color:var(--text-secondary);">' + fields[i][0] + '</span><span>' + fields[i][1] + '</span></div>';
  }
  document.getElementById('personnel-view-content').innerHTML = html;
  document.getElementById('personnelViewModal').style.display = 'flex';
}

function savePersonnel() {
  var id = document.getElementById('personnel-edit-id').value;
  var name = document.getElementById('personnel-name').value.trim();
  var position = document.getElementById('personnel-position').value.trim();
  if (!name) { alert('请填写姓名'); return; }
  if (!position) { alert('请填写岗位'); return; }
  if (id) {
    var p = findPersonnel(id);
    if (p) {
      p.name = name; p.position = position;
      p.cert = document.getElementById('personnel-cert').value.trim();
      p.certExpiryDate = document.getElementById('personnel-cert-expiry').value;
      p.phone = document.getElementById('personnel-phone').value.trim();
      p.entryDate = document.getElementById('personnel-entry').value;
      p.exitDate = document.getElementById('personnel-exit').value;
      p.remark = document.getElementById('personnel-remark').value.trim();
    }
  } else {
    var proj = projectList.filter(function(x) { return x.id === currentPersonnelProjectId; })[0];
    var maxId = 0;
    for (var i = 0; i < personnelList.length; i++) {
      var num = parseInt(personnelList[i].id.substring(1));
      if (num > maxId) maxId = num;
    }
    personnelList.push({
      id: 'p' + (maxId + 1),
      projectId: currentPersonnelProjectId,
      name: name,
      unitName: proj ? proj.unitName : '',
      position: position,
      cert: document.getElementById('personnel-cert').value.trim(),
      certExpiryDate: document.getElementById('personnel-cert-expiry').value,
      phone: document.getElementById('personnel-phone').value.trim(),
      entryDate: document.getElementById('personnel-entry').value,
      exitDate: document.getElementById('personnel-exit').value,
      active: true,
      remark: document.getElementById('personnel-remark').value.trim()
    });
  }
  closePersonnelModal();
  renderPersonnelTable();
}

function closePersonnelModal() {
  document.getElementById('personnelFormModal').style.display = 'none';
  document.getElementById('personnelViewModal').style.display = 'none';
}

function deletePersonnel(id) {
  if (!confirm('确认删除该人员记录？')) return;
  personnelList = personnelList.filter(function(p) { return p.id !== id; });
  renderPersonnelTable();
}

function togglePersonnelStatus(id) {
  var p = findPersonnel(id);
  if (!p) return;
  p.active = !p.active;
  renderPersonnelTable();
}

function batchDeletePersonnel() {
  var checked = document.querySelectorAll('.personnel-checkbox:checked');
  if (checked.length === 0) { alert('请先勾选人员'); return; }
  if (!confirm('确认删除选中的 ' + checked.length + ' 名人员？')) return;
  var ids = [];
  for (var i = 0; i < checked.length; i++) { ids.push(checked[i].value); }
  personnelList = personnelList.filter(function(p) { return ids.indexOf(p.id) === -1; });
  renderPersonnelTable();
}

function exportPersonnel() {
  alert('导出当前筛选条件下的人员列表（Excel）');
}

function updatePersonnelStats(list) {
  document.getElementById('personnel-stat-total').textContent = list.length;
  document.getElementById('personnel-stat-active').textContent = list.filter(function(p) { return p.active; }).length;
  document.getElementById('personnel-stat-cert').textContent = list.filter(function(p) { return p.cert; }).length;
  document.getElementById('personnel-stat-inactive').textContent = list.filter(function(p) { return !p.active; }).length;
  var expiringCount = list.filter(function(p) { return isCertExpiringSoon(p.certExpiryDate) || isCertExpired(p.certExpiryDate); }).length;
  var statItems = document.querySelectorAll('#personnel-stat-bar .stat-item');
  for (var i = 0; i < statItems.length; i++) { statItems[i].classList.remove('stat-active'); }
  if (expiringCount > 0 && statItems[2]) statItems[2].classList.add('stat-active');
}

document.getElementById('personnel-select-all').addEventListener('change', function() {
  var checked = this.checked;
  var boxes = document.querySelectorAll('.personnel-checkbox');
  for (var i = 0; i < boxes.length; i++) { boxes[i].checked = checked; }
});

document.getElementById('unit-select').addEventListener('change', selectPersonnelUnit);

initUnitSelect();
buildProjectTree();
renderPersonnelTable();
