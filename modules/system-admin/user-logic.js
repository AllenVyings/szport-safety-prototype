/** user.html - 逻辑层（从内联脚本提取） */

// ===== 一人多岗检测 =====
function getMultiAccountMap() {
  var map = {};
  userList.forEach(function(u) {
    if (!map[u.name]) map[u.name] = [];
    map[u.name].push(u);
  });
  return map;
}

// ===== 获取节点及所有子节点 ID =====
function getDescendantIds(nodes, id) {
  var ids = [id];
  function find(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        collect(nodes[i], ids);
        return;
      }
      if (nodes[i].children) find(nodes[i].children);
    }
  }
  function collect(node, ids) {
    if (node.children) {
      node.children.forEach(function(c) {
        ids.push(c.id);
        collect(c, ids);
      });
    }
  }
  find(nodes);
  return ids;
}

// ===== 左侧组织树 =====
var treeExpanded = new Set(['group']);
var selectedOrgId = '';

function renderLeftTree(filter) {
  var html = buildLeftTreeHTML(orgList, 0, filter);
  if (!html) html = '<div style="padding:20px; text-align:center; color:var(--text-description); font-size:var(--font-size-13);">无匹配结果</div>';
  document.getElementById('org-tree-container').innerHTML = html;
}

function buildLeftTreeHTML(nodes, depth, filter) {
  var html = '';
  nodes.forEach(function(n) {
    var nameMatch = !filter || n.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    var hasCh = n.children && n.children.length;
    var childHasMatch = false;
    if (filter && hasCh) {
      (function check(arr) { arr.forEach(function(c) { if (c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) childHasMatch = true; if (c.children) check(c.children); }); })(n.children);
    }
    if (filter && !nameMatch && !childHasMatch) return;
    var arrowClass = hasCh ? (treeExpanded.has(n.id) ? 'open' : '') : 'empty';
    var icon = n.type === '单位' ? '单' : '部';
    var iconClass = n.type === '单位' ? 'unit' : 'dept';
    var selectedClass = selectedOrgId === n.id ? ' selected' : '';
    var hlName = filter && nameMatch ? n.name.replace(new RegExp('(' + filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>') : n.name;
    var nodeIds = getDescendantIds(orgList, n.id);
    var userCount = userList.filter(function(u) { return nodeIds.indexOf(u.orgId) > -1; }).length;
    var countBadge = userCount > 0 ? '<span style="margin-left:auto; font-size:var(--font-size-10); color:var(--text-description); flex-shrink:0;">' + userCount + '</span>' : '';
    html += '<div class="src-node' + selectedClass + '" style="padding-left:' + (6 + depth * 14) + 'px;" data-action="selectOrgNode" data-param="' + n.id + '">';
    html += '<span class="arrow ' + arrowClass + '" data-action="toggleTreeNode" data-param="' + n.id + '">&#9654;</span>';
    html += '<span class="node-icon ' + iconClass + '">' + icon + '</span> ' + hlName + countBadge;
    html += '</div>';
    if (hasCh) {
      html += '<div class="src-children' + (treeExpanded.has(n.id) ? '' : ' collapsed') + '">';
      html += buildLeftTreeHTML(n.children, depth + 1, filter);
      html += '</div>';
    }
  });
  return html;
}

function toggleTreeNode(id) {
  if (treeExpanded.has(id)) treeExpanded.delete(id); else treeExpanded.add(id);
  var filter = document.getElementById('org-tree-search').value.trim();
  renderLeftTree(filter || undefined);
}

function selectOrgNode(id) {
  if (selectedOrgId === id) {
    selectedOrgId = '';
  } else {
    selectedOrgId = id;
  }
  currentPage = 1;
  var filter = document.getElementById('org-tree-search').value.trim();
  renderLeftTree(filter || undefined);
  applyFilters();
}

function filterLeftTree(val) {
  if (val) {
    (function expandAll(nodes) { nodes.forEach(function(n) { if (n.children && n.children.length) { treeExpanded.add(n.id); expandAll(n.children); } }); })(orgList);
  }
  renderLeftTree(val || undefined);
}

// ===== 分页 =====
var currentPage = 1;
var pageSize = 10;

function changePageSize() {
  var sizeEl = document.getElementById('page-size');
  if (!sizeEl) return;
  pageSize = parseInt(sizeEl.value, 10) || 10;
  currentPage = 1;
  applyFilters();
}

function goToPage(p) {
  currentPage = p;
  applyFilters();
}

function jumpToPage() {
  var input = document.getElementById('jump-page');
  if (!input) return;
  var p = parseInt(input.value, 10);
  var totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  if (isNaN(p) || p < 1) p = 1;
  if (p > totalPages) p = totalPages;
  input.value = '';
  goToPage(p);
}

function renderPagination(total) {
  var totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  var jumpInput = document.getElementById('jump-page');
  if (jumpInput) jumpInput.max = totalPages;
  var html = '';
  if (totalPages > 1) {
    html += '<div class="pagination-page' + (currentPage === 1 ? '" style="opacity:0.4;pointer-events:none;' : '" data-action="goToPage" data-param="' + (currentPage - 1) + '"') + '">‹</div>';
  }
  var startP = Math.max(1, currentPage - 2);
  var endP = Math.min(totalPages, currentPage + 2);
  if (startP > 1) { html += '<div class="pagination-page" data-action="goToPage" data-param="1">1</div>'; if (startP > 2) html += '<span style="color:var(--text-description);font-size:var(--font-size-12);">...</span>'; }
  for (var i = startP; i <= endP; i++) {
    html += '<div class="pagination-page' + (i === currentPage ? ' active' : '') + '" data-action="goToPage" data-param="' + i + '">' + i + '</div>';
  }
  if (endP < totalPages) { if (endP < totalPages - 1) html += '<span style="color:var(--text-description);font-size:var(--font-size-12);">...</span>'; html += '<div class="pagination-page" data-action="goToPage" data-param="' + totalPages + '">' + totalPages + '</div>'; }
  if (totalPages > 1) {
    html += '<div class="pagination-page' + (currentPage === totalPages ? '" style="opacity:0.4;pointer-events:none;' : '" data-action="goToPage" data-param="' + (currentPage + 1) + '"') + '">›</div>';
  }
  var paginationEl = document.getElementById('pagination');
  if (paginationEl) paginationEl.innerHTML = html;
}

// ===== 筛选并渲染 =====
var filteredList = [];

function applyFilters() {
  var keyword = document.getElementById('filter-keyword').value.toLowerCase();
  var status = document.getElementById('filter-status').value;
  var role = document.getElementById('filter-role').value;
  var localOnly = document.getElementById('local-only-toggle').checked;
  var orgIds = selectedOrgId ? (localOnly ? [selectedOrgId] : getDescendantIds(orgList, selectedOrgId)) : [];

  filteredList = userList.filter(function(u) {
    if (keyword && u.name.toLowerCase().indexOf(keyword) === -1 && u.login.toLowerCase().indexOf(keyword) === -1) return false;
    if (selectedOrgId && orgIds.indexOf(u.orgId) === -1) return false;
    if (status && u.status !== status) return false;
    if (role && u.roles.indexOf(role) === -1) return false;
    return true;
  });

  var total = filteredList.length;
  var totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * pageSize;
  var pageData = filteredList.slice(start, start + pageSize);

  renderPage(pageData, start);
  renderPagination(total);

  var startNum = total > 0 ? start + 1 : 0;
  var endNum = Math.min(start + pageSize, total);
  var pageInfo = document.getElementById('page-info');
  if (pageInfo) {
    pageInfo.textContent = total > 0
      ? '共 ' + total + ' 条，第 ' + startNum + '-' + endNum + ' 条'
      : '共 0 条';
  }

  var emptyEl = document.getElementById('empty-state');
  if (total === 0) { emptyEl.classList.add('show'); } else { emptyEl.classList.remove('show'); }
}

function renderPage(list, offset) {
  var html = '';
  var multiMap = getMultiAccountMap();
  list.forEach(function(u, i) {
    var idx = offset + i;
    var statusClass = u.status === '启用' ? 'tag-enabled' : (u.status === '停用' ? 'tag-disabled' : 'tag-pending');
    var roleHtml = u.roles.map(function(r) { return '<span class="role-pill">' + r + '</span>'; }).join('');
    var isMulti = multiMap[u.name] && multiMap[u.name].length > 1;
    var multiBadge = isMulti ? ' <span class="multi-account-badge" title="一人多岗，点击查看关联账号" data-action="showAccounts" data-param="' + u.name.replace(/'/g, "\\'") + '">' + multiMap[u.name].length + '个账号</span>' : '';

    html += '<tr data-name="' + u.name + '" data-login="' + u.login + '" data-orgid="' + u.orgId + '" data-status="' + u.status + '" data-roles="' + u.roles.join(',') + '">';
    html += '<td>' + (idx + 1) + '</td>';
    html += '<td style="font-size:var(--font-size-12); color:var(--text-secondary);">' + (u.userNo || '-') + '</td>';
    html += '<td style="font-family:monospace; font-size:var(--font-size-13); color:var(--text-secondary);">' + u.login + '</td>';
    html += '<td>' + u.name + multiBadge + '</td>';
    html += '<td style="font-size:var(--font-size-12);">' + (u.phone || '-') + '</td>';
    html += '<td>' + u.org + '</td>';
    html += '<td style="font-size:var(--font-size-12); color:var(--text-description);">' + (u.oaOrg || '-') + '</td>';
    html += '<td><span class="tag ' + statusClass + '">' + u.status + '</span></td>';
    html += '<td><div class="role-pills">' + roleHtml + '</div></td>';
    html += '<td><div class="action-btns">';
    html += '<button class="btn btn-text btn-sm" data-action="openUserModal" data-param="' + u.id + '">编辑</button>';
    if (u.status === '启用') {
      html += '<button class="btn btn-text btn-sm" style="color:var(--warning);" data-action="toggleStatus" data-param="' + u.id + '">停用</button>';
    } else if (u.status === '停用') {
      html += '<button class="btn btn-text btn-sm" style="color:var(--success);" data-action="toggleStatus" data-param="' + u.id + '">启用</button>';
    } else {
      html += '<button class="btn btn-text btn-sm" style="color:var(--primary);" data-action="activateUser" data-param="' + u.id + '">激活</button>';
    }
    html += '<button class="btn btn-text btn-sm" style="color:var(--error);" data-action="resetPwd" data-param="' + u.id + '">重置密码</button>';
    html += '</div></td>';
    html += '</tr>';
  });
  document.getElementById('user-tbody').innerHTML = html;
}

function resetFilters() {
  document.getElementById('filter-keyword').value = '';
  document.getElementById('filter-status').selectedIndex = 0;
  document.getElementById('filter-role').selectedIndex = 0;
  selectedOrgId = '';
  currentPage = 1;
  var filter = document.getElementById('org-tree-search').value.trim();
  renderLeftTree(filter || undefined);
  applyFilters();
}

// ===== 新增/编辑弹窗 =====
var editingUserId = null;

function openUserModal(id) {
  editingUserId = id || null;
  var u = userList.find(function(x) { return x.id === editingUserId; });
  if (!u) return;

  var title = document.getElementById('modal-user-title').querySelector('h3');
  title.textContent = '编辑';

  document.getElementById('user-no').textContent = u.userNo || '-';
  document.getElementById('user-login-display').textContent = u.login;
  document.getElementById('user-org-display').textContent = u.org;
  document.getElementById('user-oa-org').textContent = u.oaOrg || '-';

  document.getElementById('user-name').value = u.name;
  document.getElementById('user-phone').value = u.phone || '';
  var genderRadios = document.querySelectorAll('input[name="user-gender"]');
  genderRadios.forEach(function(r) { r.checked = r.value === (u.gender || '男'); });
  var statusToggle = document.getElementById('user-status-toggle');
  statusToggle.checked = u.status === '启用';
  document.getElementById('user-current-status').textContent = u.status;
  document.getElementById('user-status-hint').textContent = statusToggle.checked ? '关闭则停用' : '开启则启用';
  document.querySelectorAll('#user-roles input[type="checkbox"]').forEach(function(cb) {
    cb.checked = u.roles.indexOf(cb.value) > -1;
  });
  document.getElementById('user-hire-date-display').textContent = u.hireDate || '-';
  document.getElementById('user-remark').value = u.remark || '';

  openModal('modal-user');
}

// ===== 状态切换（含确认弹窗） =====
function toggleStatus(id) {
  var u = userList.find(function(x) { return x.id === id; });
  if (!u) return;
  var action = u.status === '启用' ? '停用' : '启用';
  var msg = action === '停用' ? '确定停用用户「' + u.name + '」？停用后该用户将无法登录系统。' : '确定启用用户「' + u.name + '」？';
  showConfirm('操作确认', msg, function() {
    u.status = action;
    applyFilters();
  });
}

function activateUser(id) {
  var u = userList.find(function(x) { return x.id === id; });
  if (!u) return;
  showConfirm('操作确认', '确定激活用户「' + u.name + '」？激活后该用户可正常登录系统。', function() {
    u.status = '启用';
    applyFilters();
  });
}

function resetPwd(id) {
  var u = userList.find(function(x) { return x.id === id; });
  if (!u) return;
  showConfirm('重置密码', '确定重置用户「' + u.name + '」的密码？重置后将恢复为默认密码。', function() {
    showToast('已重置 ' + u.name + ' 的密码为默认密码');
  });
}

// ===== 多账号查看 =====
function showAccounts(name) {
  var multiMap = getMultiAccountMap();
  var accounts = multiMap[name] || [];
  document.getElementById('accounts-title').querySelector('h3').textContent = name + ' 的关联账号';
  var html = '';
  accounts.forEach(function(u) {
    var statusClass = u.status === '启用' ? 'tag-enabled' : (u.status === '停用' ? 'tag-disabled' : 'tag-pending');
    html += '<div class="account-item">';
    html += '<span class="acc-login">' + u.login + '</span>';
    html += '<span class="acc-org">' + u.org + '</span>';
    html += '<span class="tag ' + statusClass + '">' + u.status + '</span>';
    html += '</div>';
  });
  document.getElementById('accounts-list').innerHTML = html;
  openModal('modal-accounts');
}

// ===== 同步 =====
function syncUsers() {
  showConfirm('同步用户数据', '将从统一身份认证平台拉取最新用户数据，是否继续？', function() {
    showToast('用户数据同步成功');
  });
}

// ===== 弹窗内-机构树形选择器 =====
var userOrgExpanded = new Set(['group']);
var userOrgValue = '';

function toggleUserOrg() {
  var dd = document.getElementById('user-org-dropdown');
  var trigger = document.getElementById('user-org-trigger');
  if (dd.classList.contains('show')) {
    dd.classList.remove('show');
    trigger.classList.remove('open');
  } else {
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + 4;
    if (window.innerHeight - rect.bottom < 340 && rect.top > 340) top = rect.top - 340 - 4;
    dd.style.top = top + 'px';
    dd.style.left = rect.left + 'px';
    dd.style.width = Math.max(rect.width, 280) + 'px';
    dd.classList.add('show');
    trigger.classList.add('open');
    document.getElementById('user-org-search').value = '';
    renderUserOrgTree();
    document.getElementById('user-org-search').focus();
  }
}

function renderUserOrgTree(filter) {
  var html = buildModalOrgTreeHTML(orgList, 0, filter);
  if (!html) html = '<div style="padding:20px; text-align:center; color:var(--text-description); font-size:var(--font-size-13);">无匹配结果</div>';
  document.getElementById('user-org-list').innerHTML = html;
}

function selectUserOrg(id, name) {
  userOrgValue = name;
  var textEl = document.getElementById('user-org-text');
  textEl.textContent = name;
  textEl.classList.remove('placeholder');
  document.getElementById('user-org-dropdown').classList.remove('show');
  document.getElementById('user-org-trigger').classList.remove('open');
}

function buildModalOrgTreeHTML(nodes, depth, filter) {
  var html = '';
  nodes.forEach(function(n) {
    var nameMatch = !filter || n.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    var hasCh = n.children && n.children.length;
    var childHasMatch = false;
    if (filter && hasCh) {
      (function check(arr) { arr.forEach(function(c) { if (c.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) childHasMatch = true; if (c.children) check(c.children); }); })(n.children);
    }
    if (filter && !nameMatch && !childHasMatch) return;
    var arrowClass = hasCh ? (userOrgExpanded.has(n.id) ? 'open' : '') : 'empty';
    var icon = n.type === '单位' ? '单' : '部';
    var iconClass = n.type === '单位' ? 'unit' : 'dept';
    var hlName = filter && nameMatch ? n.name.replace(new RegExp('(' + filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>') : n.name;
    html += '<div class="tree-select-node" style="padding-left:' + (12 + depth * 16) + 'px;" data-action="selectUserOrg" data-param="' + n.id + '" data-name="' + n.name.replace(/"/g, '&quot;') + '">';
    html += '<span class="ts-arrow ' + arrowClass + '" data-action="toggleModalOrgNode" data-param="' + n.id + '">&#9654;</span>';
    html += '<span class="node-icon ' + iconClass + '">' + icon + '</span> ' + hlName;
    html += '</div>';
    if (hasCh) {
      html += '<div class="tree-select-children' + (userOrgExpanded.has(n.id) ? '' : ' collapsed') + '">';
      html += buildModalOrgTreeHTML(n.children, depth + 1, filter);
      html += '</div>';
    }
  });
  return html;
}

function toggleModalOrgNode(id) {
  if (userOrgExpanded.has(id)) userOrgExpanded.delete(id); else userOrgExpanded.add(id);
  var filter = document.getElementById('user-org-search').value.trim();
  renderUserOrgTree(filter || undefined);
}

// ===== 通用弹窗 =====
function openModal(id) { document.getElementById(id).classList.add('show'); }

// ===== 确认弹窗 =====
function showConfirm(title, message, onOk) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  var okBtn = document.getElementById('confirm-ok');
  var newBtn = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newBtn, okBtn);
  newBtn.id = 'confirm-ok';
  newBtn.addEventListener('click', function() {
    closeModal('modal-confirm');
    if (onOk) onOk();
  });
  openModal('modal-confirm');
}

// 外部点击关闭树形下拉
document.addEventListener('click', function(e) {
  var dd = document.getElementById('user-org-dropdown');
  var trigger = document.getElementById('user-org-trigger');
  if (dd && dd.classList.contains('show') && !trigger.contains(e.target) && !dd.contains(e.target)) {
    dd.classList.remove('show');
    trigger.classList.remove('open');
  }
});

// 状态开关交互
document.getElementById('user-status-toggle').addEventListener('change', function() {
  document.getElementById('user-current-status').textContent = this.checked ? '启用' : '停用';
  document.getElementById('user-status-hint').textContent = this.checked ? '关闭则停用' : '开启则启用';
});

function submitUserForm() {
  var valid = true;
  var nameVal = document.getElementById('user-name').value.trim();
  var hasRole = document.querySelector('#user-roles input:checked') !== null;

  if (!nameVal) {
    document.getElementById('user-name').style.borderColor = 'var(--error)';
    valid = false;
  } else {
    document.getElementById('user-name').style.borderColor = '';
  }
  if (!hasRole) {
    document.getElementById('user-roles').style.outline = '1px solid var(--error)';
    valid = false;
  } else {
    document.getElementById('user-roles').style.outline = '';
  }

  if (!valid) return;

  var u = userList.find(function(x) { return x.id === editingUserId; });
  if (u) {
    u.name = nameVal;
    u.phone = document.getElementById('user-phone').value.trim();
    var genderRadio = document.querySelector('input[name="user-gender"]:checked');
    u.gender = genderRadio ? genderRadio.value : u.gender;
    u.status = document.getElementById('user-status-toggle').checked ? '启用' : '停用';
    u.roles = [];
    document.querySelectorAll('#user-roles input[type="checkbox"]:checked').forEach(function(cb) { u.roles.push(cb.value); });
    u.remark = document.getElementById('user-remark').value.trim();
  }

  closeModal('modal-user');
  applyFilters();
  showToast('用户信息已更新');
}

// 初始化
renderLeftTree();
applyFilters();
