// permission-logic.js — 权限管理 交互逻辑
(function() {
  'use strict';

  var PermissionLogic = {
    currentTab: 'menu',
    rolePage: 1,
    rolePageSize: 10,

    init: function() {
      this.bindTabSwitch();
      this.bindFilters();
      this.bindActions();
      this.renderMenuTable();
      this.renderRoleTable();
    },

    // Tab 切换
    bindTabSwitch: function() {
      var self = this;
      var tabBar = document.querySelector('.tab-bar');
      if (!tabBar) return;
      tabBar.addEventListener('click', function(e) {
        var item = e.target.closest('.tab-item');
        if (!item) return;
        var name = item.getAttribute('data-param');
        if (!name) return;
        self.switchTab(name, item);
      });
    },

    switchTab: function(name, item) {
      document.querySelectorAll('.tab-bar .tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (item) item.classList.add('active');
      var panel = document.getElementById('tab-' + name);
      if (panel) panel.classList.add('active');
      this.currentTab = name;
    },

    // 筛选绑定
    bindFilters: function() {
      var self = this;
      // Tab1 菜单筛选
      var menuQuery = document.querySelector('#tab-menu .filter-bar-actions .btn-primary');
      if (menuQuery) menuQuery.addEventListener('click', function() { self.queryMenuTable(); });
      var menuReset = document.querySelector('#tab-menu .filter-bar-actions .btn-default');
      if (menuReset) menuReset.addEventListener('click', function() { self.resetMenuQuery(); });
      // Tab2 角色筛选
      var roleQuery = document.querySelector('#tab-role .filter-bar-actions .btn-primary');
      if (roleQuery) roleQuery.addEventListener('click', function() { self.queryRoleTable(); });
      var roleReset = document.querySelector('#tab-role .filter-bar-actions .btn-default');
      if (roleReset) roleReset.addEventListener('click', function() { self.resetRoleQuery(); });
    },

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'switchTab':
            self.switchTab(param, btn);
            break;
          case 'addMenu':
            PermissionModals.showAddMenu();
            break;
          case 'editMenu':
            PermissionModals.showAddMenu(param);
            break;
          case 'toggleMenu':
            self.toggleMenuRow(btn, param);
            break;
          case 'expandAllMenu':
            self.expandAllMenu();
            break;
          case 'collapseAllMenu':
            self.collapseAllMenu();
            break;
          case 'addRole':
            PermissionModals.showAddRole();
            break;
          case 'editRole':
            self.openEditRole(param);
            break;
          case 'openPermConfig':
            PermissionModals.showPermConfig(param);
            break;
          case 'toggleRole':
            self.confirmToggleRole(param);
            break;
          case 'deleteRole':
            self.confirmDeleteRole(param);
            break;
          case 'togglePermNode':
            self.togglePermNode(btn);
            break;
          case 'checkAllPerm':
            document.querySelectorAll('#pm-perm-tree input[type="checkbox"]').forEach(function(cb) { cb.checked = true; });
            break;
          case 'uncheckAllPerm':
            document.querySelectorAll('#pm-perm-tree input[type="checkbox"]').forEach(function(cb) { cb.checked = false; });
            break;
          case 'expandAllPerm':
            document.querySelectorAll('.perm-tree-children').forEach(function(el) { el.style.display = 'block'; });
            document.querySelectorAll('#modal-perm-config .tree-expand').forEach(function(el) { el.classList.add('open'); });
            break;
          case 'collapseAllPerm':
            document.querySelectorAll('.perm-tree-children').forEach(function(el) { el.style.display = 'none'; });
            document.querySelectorAll('#modal-perm-config .tree-expand').forEach(function(el) { el.classList.remove('open'); });
            break;
        }
      });

      // 数据权限面板：角色选择联动
      var orgPermSelect = document.getElementById('org-perm-role-select');
      if (orgPermSelect) {
        orgPermSelect.addEventListener('change', function() { self.updateOrgPerm(this.value); });
      }
    },

    // ========== 渲染菜单管理表格 ==========
    renderMenuTable: function() {
      var html = '';
      PermissionData.menus.forEach(function(dir, di) {
        var hasChildren = dir.children && dir.children.length > 0;
        var isSimpleMenu = !hasChildren;
        html += '<tr style="background:var(--bg-table-header);font-weight:500;">';
        html += '<td>';
        if (hasChildren) {
          html += '<span class="tree-expand" data-action="toggleMenu" data-param="menu-' + dir.id + '">&#9654;</span>';
        } else {
          html += '<span class="tree-indent"></span>';
        }
        html += dir.name + '</td>';
        if (isSimpleMenu) {
          html += '<td><span class="tag tag-menu">菜单</span></td>';
          html += '<td style="font-family:monospace;font-size:var(--font-size-12);color:var(--primary);">' + dir.path + '</td>';
        } else {
          html += '<td><span class="tag tag-dir">目录</span></td>';
          html += '<td style="color:var(--text-description);">—</td>';
        }
        html += '<td>' + ((di + 1) * 10) + '</td>';
        html += '<td><span class="tag tag-success">启用</span></td>';
        html += '<td><span class="cell-actions">';
        html += '<button class="btn btn-text btn-sm" data-action="editMenu" data-param="' + dir.name + '">编辑</button>';
        if (hasChildren) html += '<button class="btn btn-text btn-sm" data-action="addMenu">新增</button>';
        html += '<button class="btn btn-text btn-sm" data-action="toggleMenu" data-param="toggle-' + dir.name + '">停用</button>';
        html += '</span></td></tr>';

        if (hasChildren) {
          dir.children.forEach(function(menu, mi) {
            var menuDisabled = menu.disabled || false;
            var hasBtns = menu.buttons && menu.buttons.length > 0;
            var rowClass = 'menu-child-row menu-' + dir.id;
            if (menuDisabled) rowClass += ' stopped';
            html += '<tr class="' + rowClass + '">';
            html += '<td><span class="tree-indent"></span>';
            if (hasBtns) {
              html += '<span class="tree-expand" data-action="toggleMenu" data-param="btn-' + dir.id + '-' + mi + '">&#9654;</span>';
            } else {
              html += '<span class="tree-indent"></span>';
            }
            html += menu.name + '</td>';
            html += '<td><span class="tag tag-menu">菜单</span></td>';
            html += '<td style="font-family:monospace;font-size:var(--font-size-12);color:var(--primary);">' + menu.path + '</td>';
            html += '<td>' + ((mi + 1) * 10) + '</td>';
            html += '<td>' + (menuDisabled ? '<span class="tag tag-default">停用</span>' : '<span class="tag tag-success">启用</span>') + '</td>';
            html += '<td><span class="cell-actions"><button class="btn btn-text btn-sm" data-action="editMenu" data-param="' + menu.name + '">编辑</button>';
            if (hasBtns && !menuDisabled) html += '<button class="btn btn-text btn-sm" data-action="addMenu">新增</button>';
            html += (menuDisabled ? '<button class="btn btn-text btn-sm" data-action="toggleMenu" data-param="toggle-' + menu.name + '">启用</button>' : '<button class="btn btn-text btn-sm" data-action="toggleMenu" data-param="toggle-' + menu.name + '">停用</button>');
            html += '</span></td></tr>';
            if (hasBtns) {
              menu.buttons.forEach(function(btn, bi) {
                html += '<tr class="btn-child-row btn-' + dir.id + '-' + mi + '">';
                html += '<td><span class="tree-indent"></span><span class="tree-indent"></span><span class="tree-indent"></span>' + btn + '</td>';
                html += '<td><span class="tag tag-btn">按钮</span></td>';
                html += '<td style="color:var(--text-description);">—</td>';
                html += '<td>' + ((bi + 1) * 10) + '</td>';
                html += '<td>' + (menuDisabled ? '<span class="tag tag-default">停用</span>' : '<span class="tag tag-success">启用</span>') + '</td>';
                html += '<td><span class="cell-actions"><button class="btn btn-text btn-sm" data-action="editMenu" data-param="' + btn + '">编辑</button>';
                html += (menuDisabled ? '<button class="btn btn-text btn-sm" data-action="toggleMenu" data-param="toggle-' + btn + '">启用</button>' : '<button class="btn btn-text btn-sm" data-action="toggleMenu" data-param="toggle-' + btn + '">停用</button>');
                html += '</span></td></tr>';
              });
            }
          });
        }
      });
      var tbody = document.getElementById('menu-table-body');
      if (tbody) tbody.innerHTML = html;
    },

    // ========== 渲染角色管理表格 ==========
    renderRoleTable: function(filter) {
      var data = PermissionData.roles;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.name.toLowerCase().indexOf(filter.name.toLowerCase()) === -1) return false;
          if (filter.type && r.type !== filter.type) return false;
          if (filter.status && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.getElementById('role-table-body');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var typeTag = r.type === 'level' ? '<span class="tag tag-role-level">层级角色</span>' : '<span class="tag tag-role-common">通用角色</span>';
        var statusTag = r.status === 'enabled' ? '<span class="tag tag-success">启用</span>' : '<span class="tag tag-default">停用</span>';
        var toggleLabel = r.status === 'enabled' ? '停用' : '启用';
        var levelHtml = r.level ? '<span class="tag-level">' + r.level + '</span>' : '全部';
        var ops = '<span class="cell-actions">';
        if (r.name !== '超级管理员') {
          ops += '<button class="btn btn-text btn-sm" data-action="editRole" data-param="' + r.name + '">编辑</button>';
        }
        ops += '<button class="btn btn-text btn-sm" data-action="openPermConfig" data-param="' + r.name + '">权限</button>';
        if (r.name !== '超级管理员') {
          ops += '<button class="btn btn-text btn-sm" data-action="toggleRole" data-param="' + r.name + ':' + toggleLabel + ':' + r.users + '">' + toggleLabel + '</button>';
          ops += '<button class="btn btn-text btn-sm" style="color:var(--danger)" data-action="deleteRole" data-param="' + r.name + ':' + r.users + '">删除</button>';
        }
        ops += '</span>';
        return '<tr' + (r.status === 'disabled' ? ' class="stopped"' : '') + '><td>' + (i + 1) + '</td><td>' + r.name + '</td><td style="font-family:monospace;font-size:var(--font-size-12);">' + r.code + '</td><td>' + typeTag + '</td><td>' + levelHtml + '</td><td>' + r.users + '</td><td>' + statusTag + '</td><td>' + ops + '</td></tr>';
      }).join('');
      var pgn = document.getElementById('role-pagination');
      if (pgn) {
        var info = pgn.querySelector('.pagination-info');
        if (info) info.textContent = '共 ' + data.length + ' 条';
      }
    },

    // ========== 菜单筛选 ==========
    queryMenuTable: function() {
      var name = document.getElementById('menu-query-name').value.trim().toLowerCase();
      var type = document.getElementById('menu-query-type').value;
      var status = document.getElementById('menu-query-status').value;
      var rows = document.querySelectorAll('#menu-table-body tr');
      rows.forEach(function(row) {
        var show = true;
        if (name) {
          var text = row.querySelector('td').textContent.toLowerCase();
          if (text.indexOf(name) === -1) show = false;
        }
        if (show && type) {
          var typeTag = row.querySelector('.tag');
          if (typeTag) {
            var typeMap = { dir: '目录', menu: '菜单', btn: '按钮' };
            if (typeTag.textContent !== typeMap[type]) show = false;
          }
        }
        if (show && status) {
          var statusTag = row.querySelector('.tag-success, .tag-default');
          if (statusTag) {
            var statusMap = { enabled: '启用', disabled: '停用' };
            if (statusTag.textContent !== statusMap[status]) show = false;
          }
        }
        row.style.display = show ? '' : 'none';
      });
    },
    resetMenuQuery: function() {
      document.getElementById('menu-query-name').value = '';
      document.getElementById('menu-query-type').value = '';
      document.getElementById('menu-query-status').value = '';
      document.querySelectorAll('#menu-table-body tr').forEach(function(row) { row.style.display = ''; });
    },

    // ========== 角色筛选 ==========
    queryRoleTable: function() {
      var name = document.getElementById('role-query-name').value.trim().toLowerCase();
      var type = document.getElementById('role-query-type').value;
      var status = document.getElementById('role-query-status').value;
      this.renderRoleTable({
        name: name,
        type: type || undefined,
        status: status || undefined
      });
    },
    resetRoleQuery: function() {
      document.getElementById('role-query-name').value = '';
      document.getElementById('role-query-type').value = '';
      document.getElementById('role-query-status').value = '';
      this.renderRoleTable();
    },

    // ========== 树形展开/折叠 ==========
    toggleMenuRow: function(arrowEl, menuId) {
      // toggle 类型操作
      if (menuId && menuId.indexOf('toggle-') === 0) {
        var itemName = menuId.replace('toggle-', '');
        var currentText = arrowEl.textContent;
        var action = currentText === '停用' ? '停用' : '启用';
        PermissionModals.showConfirm(action + '菜单', '确定' + action + '菜单「' + itemName + '」？' + (action === '停用' ? '停用后该菜单及其子项将隐藏，已分配权限自动暂停' : '启用后权限自动恢复'), function() {
          PermissionLogic.showToast('菜单已' + action);
        });
        return;
      }
      var isOpen = arrowEl.classList.toggle('open');
      document.querySelectorAll('.' + menuId).forEach(function(row) {
        if (isOpen) {
          row.classList.add('open');
        } else {
          row.classList.remove('open');
          if (menuId.startsWith('menu-')) {
            row.querySelectorAll('.tree-expand.open').forEach(function(a) { a.classList.remove('open'); });
            var dirId = menuId.replace('menu-', '');
            document.querySelectorAll('[class*=btn-' + dirId + '-]').forEach(function(br) { br.classList.remove('open'); });
          }
        }
      });
    },
    expandAllMenu: function() {
      document.querySelectorAll('#tab-menu .tree-expand').forEach(function(el) { el.classList.add('open'); });
      document.querySelectorAll('.menu-child-row').forEach(function(row) { row.classList.add('open'); });
      document.querySelectorAll('.btn-child-row').forEach(function(row) { row.classList.add('open'); });
    },
    collapseAllMenu: function() {
      document.querySelectorAll('#tab-menu .tree-expand').forEach(function(el) { el.classList.remove('open'); });
      document.querySelectorAll('.menu-child-row').forEach(function(row) { row.classList.remove('open'); });
      document.querySelectorAll('.btn-child-row').forEach(function(row) { row.classList.remove('open'); });
    },
    togglePermNode: function(arrowEl) {
      arrowEl.classList.toggle('open');
      var sibling = arrowEl.parentElement.nextElementSibling;
      if (sibling && sibling.classList.contains('perm-tree-children')) {
        sibling.style.display = sibling.style.display === 'none' ? 'block' : 'none';
      }
    },

    // ========== 角色操作 ==========
    openEditRole: function(name) {
      var role = PermissionData.roles.find(function(r) { return r.name === name; });
      if (!role) return;
      PermissionModals.showAddRole({ code: role.code, type: role.type, level: role.level });
    },
    confirmToggleRole: function(param) {
      var parts = param.split(':');
      var roleName = parts[0], action = parts[1], userCount = parseInt(parts[2]) || 0;
      var msg = action === '停用'
        ? '确定停用角色「' + roleName + '」？停用后，该角色关联的 ' + userCount + ' 名用户将立即失去对应权限，角色关联关系保留，重新启用后权限自动恢复'
        : '确定启用角色「' + roleName + '」？启用后，该角色关联的 ' + userCount + ' 名用户将立即恢复对应权限';
      PermissionModals.showConfirm(action + '角色', msg, function() {
        PermissionLogic.showToast('角色已' + action);
      });
    },
    confirmDeleteRole: function(param) {
      var parts = param.split(':');
      var roleName = parts[0], userCount = parseInt(parts[1]) || 0;
      var workflowRef = { '集团安全管理员': 3, '公司安全管理员': 5, '下属企业安全员': 2 };
      if (workflowRef[roleName]) {
        PermissionModals.showConfirm('删除角色', '该角色被 ' + workflowRef[roleName] + ' 个审批流程引用，禁止删除。请先修改相关审批流程后再删除。', null);
      } else if (userCount > 0) {
        PermissionModals.showConfirm('删除角色', '该角色下有 ' + userCount + ' 名用户，禁止删除。请先移除所有用户的该角色后再删除。', null);
      } else {
        PermissionModals.showConfirm('删除角色', '确定删除角色「' + roleName + '」？删除后不可恢复。', function() {
          PermissionLogic.showToast('角色已删除');
        });
      }
    },

    // ========== 数据权限联动 ==========
    updateOrgPerm: function(roleId) {
      var hint = document.getElementById('orgScopeHint');
      var radios = document.querySelectorAll('#orgScopeGroup input[type="radio"]');
      if (roleId === '2') {
        radios.forEach(function(r) { r.disabled = false; });
        if (hint) hint.textContent = '';
      } else if (roleId === '3') {
        radios.forEach(function(r) { r.disabled = (r.value === 'all'); });
        if (document.querySelector('#orgScopeGroup input[value="all"]').checked) {
          document.querySelector('#orgScopeGroup input[value="company-sub"]').checked = true;
        }
        if (hint) hint.textContent = '层级角色约束：二级企业层级最多可选"本企业及下属"';
      } else if (roleId === '4') {
        radios.forEach(function(r) { r.disabled = (r.value === 'company-sub' || r.value === 'all'); });
        if (document.querySelector('#orgScopeGroup input[value="company-sub"]').checked || document.querySelector('#orgScopeGroup input[value="all"]').checked) {
          document.querySelector('#orgScopeGroup input[value="company"]').checked = true;
        }
        if (hint) hint.textContent = '层级角色约束：下属企业层级最多可选"本公司"';
      } else {
        radios.forEach(function(r) { r.disabled = false; });
        if (hint) hint.textContent = '';
      }
    },

    // Toast 提示
    showToast: function(msg) {
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 24px;background:var(--success);color:#fff;border-radius:var(--radius-md);font-size:var(--font-size-14);z-index:9999;box-shadow:var(--shadow-lg);';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    }
  };

  window.PermissionLogic = PermissionLogic;

  document.addEventListener('DOMContentLoaded', function() {
    PermissionLogic.init();
  });
})();
