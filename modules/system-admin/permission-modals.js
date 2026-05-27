// permission-modals.js — 权限管理 弹窗逻辑
(function() {
  'use strict';

  var PermissionModals = {
    _confirmCallback: null,

    // 新增菜单弹窗
    showAddMenu: function(editName) {
      var isEdit = !!editName;
      var parentOptions = PermissionData.menus.map(function(dir) {
        var hasChildren = dir.children && dir.children.length > 0;
        var opts = '';
        if (hasChildren) {
          opts += '<option value="' + dir.id + '">' + dir.name + '（目录）</option>';
          dir.children.forEach(function(menu) {
            opts += '<option value="' + menu.id + '">' + menu.name + '（菜单）— 仅可新增按钮</option>';
          });
        }
        return opts;
      }).join('');

      var html = '<div class="modal-overlay show" id="modal-add-menu">' +
        '<div class="modal-box" style="width:560px;">' +
          '<div class="modal-header"><h3>' + (isEdit ? '编辑菜单' : '新增菜单') + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-add-menu">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>上级菜单</label><div class="form-content"><select class="form-input form-select" id="pm-menu-parent" onchange="PermissionModals.updateMenuTypeOptions()"><option value="">根级目录</option>' + parentOptions + '</select></div></div>' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>菜单类型</label><div class="form-content"><div class="radio-group"><label class="radio-item"><input type="radio" name="pmMenuType" value="dir" id="pmMenuType-dir"> 目录</label><label class="radio-item"><input type="radio" name="pmMenuType" value="menu" id="pmMenuType-menu" checked> 菜单</label><label class="radio-item"><input type="radio" name="pmMenuType" value="btn" id="pmMenuType-btn"> 按钮</label></div><div style="font-size:var(--font-size-12);color:var(--text-description);margin-top:4px;" id="pm-menu-type-hint">根级可建目录或菜单（根级菜单不可有子按钮），目录下可建菜单，菜单下可建按钮</div></div></div>' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>菜单名称</label><div class="form-content"><input class="form-input" id="pm-menu-name" placeholder="请输入菜单名称" value="' + (editName || '') + '"></div></div>' +
            '<div class="form-group" id="pm-menu-route-group"><label class="form-label"><span style="color:var(--error)">*</span>路由地址</label><div class="form-content"><input class="form-input" id="pm-menu-route" placeholder="请输入前端路由路径" style="font-family:monospace;"></div></div>' +
            '<div class="form-group" id="pm-menu-icon-group"><label class="form-label">图标</label><div class="form-content"><input class="form-input" placeholder="选择图标（目录/菜单类型适用）"></div></div>' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>排序</label><div class="form-content"><input class="form-input" type="number" value="1"></div></div>' +
            '<div class="form-group"><label class="form-label">状态</label><div class="form-content"><div class="radio-group"><label class="radio-item"><input type="radio" name="pmMenuStatus" value="enabled" checked> 启用</label><label class="radio-item"><input type="radio" name="pmMenuStatus" value="disabled"> 停用</label></div></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-add-menu">取消</button><button class="btn btn-primary" data-action="submitAddMenu">确定</button></div>' +
        '</div></div>';
      PermissionModals._appendModal(html);
      if (isEdit) PermissionModals.updateMenuTypeOptions();
    },

    updateMenuTypeOptions: function() {
      var parent = document.getElementById('pm-menu-parent');
      if (!parent) return;
      var val = parent.value;
      var dirRadio = document.getElementById('pmMenuType-dir');
      var menuRadio = document.getElementById('pmMenuType-menu');
      var btnRadio = document.getElementById('pmMenuType-btn');
      var iconGroup = document.getElementById('pm-menu-icon-group');
      var routeGroup = document.getElementById('pm-menu-route-group');
      var hint = document.getElementById('pm-menu-type-hint');

      var selectedIsDir = false, selectedIsMenu = false;
      PermissionData.menus.forEach(function(dir) {
        if (dir.id === val && dir.children) selectedIsDir = true;
        if (dir.children) dir.children.forEach(function(menu) {
          if (menu.id === val) selectedIsMenu = true;
        });
      });

      if (!val) {
        dirRadio.disabled = false; menuRadio.disabled = false; btnRadio.disabled = true;
        iconGroup.style.display = 'flex';
        routeGroup.style.display = dirRadio.checked ? 'none' : 'flex';
        hint.textContent = '根级可建目录或菜单（根级菜单不可有子按钮）';
      } else if (selectedIsDir) {
        menuRadio.checked = true;
        dirRadio.disabled = true; menuRadio.disabled = false; btnRadio.disabled = true;
        iconGroup.style.display = 'flex'; routeGroup.style.display = 'flex';
        hint.textContent = '目录下仅可建菜单';
      } else if (selectedIsMenu) {
        btnRadio.checked = true;
        dirRadio.disabled = true; menuRadio.disabled = true; btnRadio.disabled = false;
        iconGroup.style.display = 'none'; routeGroup.style.display = 'none';
        hint.textContent = '菜单下仅可建按钮';
      }
    },

    // 新增/编辑角色弹窗
    showAddRole: function(editData) {
      var isEdit = !!editData;
      var code = editData ? editData.code : '';
      var type = editData ? editData.type : 'common';
      var level = editData ? editData.level : '';

      var levelChecked = { group: '', secondary: '', subordinate: '' };
      if (level === '集团') levelChecked.group = ' checked';
      else if (level === '二级企业') levelChecked.secondary = ' checked';
      else if (level === '下属企业') levelChecked.subordinate = ' checked';

      var html = '<div class="modal-overlay show" id="modal-add-role">' +
        '<div class="modal-box" style="width:560px;">' +
          '<div class="modal-header"><h3>' + (isEdit ? '编辑角色' : '新增角色') + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-add-role">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>角色名称</label><div class="form-content"><input class="form-input" id="pm-role-name" placeholder="请输入角色名称"></div></div>' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>角色编码</label><div class="form-content"><input class="form-input" id="pm-role-code" placeholder="大写字母+下划线" style="font-family:monospace;' + (isEdit ? 'background:var(--bg-page);cursor:not-allowed;' : '') + '" ' + (isEdit ? 'readonly' : '') + ' value="' + code + '"><span id="pm-role-code-hint" style="display:block;font-size:var(--font-size-12);color:var(--text-description);margin-top:4px;">' + (isEdit ? '角色编码创建后不可修改' : '大写字母+下划线，4-40字符') + '</span></div></div>' +
            '<div class="form-group"><label class="form-label"><span style="color:var(--error)">*</span>角色类型</label><div class="form-content"><div class="radio-group"><label class="radio-item"><input type="radio" name="pmRoleType" value="common"' + (type === 'common' ? ' checked' : '') + (isEdit ? ' disabled' : '') + '> 通用角色</label><label class="radio-item"><input type="radio" name="pmRoleType" value="level"' + (type === 'level' ? ' checked' : '') + (isEdit ? ' disabled' : '') + '> 层级角色</label></div></div></div>' +
            '<div class="form-group" id="pm-level-group" style="display:' + (type === 'level' ? 'flex' : 'none') + ';"><label class="form-label"><span style="color:var(--error)">*</span>关联层级</label><div class="form-content"><div class="radio-group"><label class="radio-item"><input type="radio" name="pmRoleLevel" value="group"' + levelChecked.group + (isEdit ? ' disabled' : '') + '> 集团</label><label class="radio-item"><input type="radio" name="pmRoleLevel" value="secondary"' + levelChecked.secondary + (isEdit ? ' disabled' : '') + '> 二级企业</label><label class="radio-item"><input type="radio" name="pmRoleLevel" value="subordinate"' + levelChecked.subordinate + (isEdit ? ' disabled' : '') + '> 下属企业</label></div></div></div>' +
            '<div class="form-group"><label class="form-label">角色描述</label><div class="form-content"><textarea class="form-input" rows="3" style="resize:vertical;" placeholder="请输入角色描述"></textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-add-role">取消</button><button class="btn btn-primary" data-action="submitRole">确定</button></div>' +
        '</div></div>';
      PermissionModals._appendModal(html);

      // 角色类型切换联动
      document.querySelectorAll('input[name="pmRoleType"]').forEach(function(r) {
        r.addEventListener('change', function() {
          var lg = document.getElementById('pm-level-group');
          if (lg) lg.style.display = this.value === 'level' ? 'flex' : 'none';
        });
      });
    },

    // 权限配置弹窗
    showPermConfig: function(roleName) {
      var code = PermissionData.roleMap[roleName] || '';
      var isSuperAdmin = (roleName === '超级管理员');
      var treeHtml = PermissionModals._buildPermTree(isSuperAdmin);

      var html = '<div class="modal-overlay show" id="modal-perm-config">' +
        '<div class="modal-box" style="width:640px;">' +
          '<div class="modal-header"><h3>权限配置 — ' + (code ? roleName + '（' + code + '）' : roleName) + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-perm-config">&times;</button></div>' +
          '<div class="modal-body" style="padding:0;">' +
            '<div style="padding:12px 20px;background:var(--bg-table-header);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">' +
              '<span style="font-size:var(--font-size-13);color:var(--text-secondary);">勾选该角色可访问的菜单和按钮权限</span>' +
              '<div style="display:flex;gap:8px;"><button class="btn btn-text btn-sm" data-action="checkAllPerm">全选</button><button class="btn btn-text btn-sm" data-action="uncheckAllPerm">取消全选</button><button class="btn btn-text btn-sm" data-action="expandAllPerm">展开</button><button class="btn btn-text btn-sm" data-action="collapseAllPerm">折叠</button></div>' +
            '</div>' +
            '<div class="perm-tree" style="margin:16px 20px;" id="pm-perm-tree">' + treeHtml + '</div>' +
          '</div>' +
          '<div class="modal-footer">' + (isSuperAdmin ? '' : '<button class="btn btn-primary" data-action="savePermConfig">保存</button>') + '<button class="btn btn-default" data-action="hideModal" data-param="modal-perm-config">关闭</button></div>' +
        '</div></div>';
      PermissionModals._appendModal(html);
      PermissionModals._setupPermCheckboxes();
    },

    _buildPermTree: function(isSuperAdmin) {
      var html = '';
      PermissionData.menus.forEach(function(dir) {
        var hasChildren = dir.children && dir.children.length > 0;
        html += '<div class="perm-tree-node perm-tree-dir" style="display:flex;align-items:center;gap:6px;">';
        if (hasChildren) html += '<span class="tree-expand open" data-action="togglePermNode" style="font-size:var(--font-size-11);cursor:pointer;">&#9654;</span>';
        html += '<label class="checkbox-item"><input type="checkbox" checked class="perm-check-dir"' + (isSuperAdmin ? ' disabled' : '') + '> <strong>' + dir.name + '</strong></label></div>';
        if (hasChildren) {
          html += '<div class="perm-tree-children open">';
          dir.children.forEach(function(menu) {
            if (!menu.disabled) {
              html += '<div class="perm-tree-node perm-tree-menu" style="display:flex;align-items:center;gap:6px;">';
              if (menu.buttons && menu.buttons.length > 0) html += '<span class="tree-expand open" data-action="togglePermNode" style="font-size:var(--font-size-11);cursor:pointer;">&#9654;</span>';
              html += '<label class="checkbox-item"><input type="checkbox" checked class="perm-check-menu"' + (isSuperAdmin ? ' disabled' : '') + '> ' + menu.name + '</label></div>';
              if (menu.buttons && menu.buttons.length > 0) {
                html += '<div class="perm-tree-children open">';
                menu.buttons.forEach(function(btn) {
                  html += '<div class="perm-tree-node perm-tree-btn" style="display:flex;align-items:center;gap:6px;"><label class="checkbox-item"><input type="checkbox" checked class="perm-check-btn"' + (isSuperAdmin ? ' disabled' : '') + '> ' + btn + '</label></div>';
                });
                html += '</div>';
              }
            }
          });
          html += '</div>';
        }
      });
      return html;
    },

    _setupPermCheckboxes: function() {
      var tree = document.getElementById('pm-perm-tree');
      if (!tree) return;
      tree.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
          var node = this.closest('.perm-tree-node');
          var children = node.nextElementSibling;
          if (children && children.classList.contains('perm-tree-children')) {
            children.querySelectorAll('input[type="checkbox"]').forEach(function(childCb) { childCb.checked = cb.checked; });
          }
          if (cb.checked) {
            var parent = node.parentElement;
            if (parent && parent.classList.contains('perm-tree-children')) {
              var parentCb = parent.previousElementSibling.querySelector('input[type="checkbox"]');
              if (parentCb && !parentCb.checked) parentCb.checked = true;
            }
          }
        });
      });
    },

    // 确认弹窗
    showConfirm: function(title, message, onOk) {
      var html = '<div class="modal-overlay show" id="modal-confirm">' +
        '<div class="modal-box" style="width:420px;">' +
          '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-confirm">&times;</button></div>' +
          '<div class="modal-body"><p style="font-size:var(--font-size-14);line-height:1.6;">' + message + '</p></div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-confirm">取消</button><button class="btn btn-primary" data-action="doConfirm">确定</button></div>' +
        '</div></div>';
      PermissionModals._confirmCallback = onOk;
      PermissionModals._appendModal(html);
    },

    doConfirm: function() {
      if (PermissionModals._confirmCallback) PermissionModals._confirmCallback();
      PermissionModals.close('modal-confirm');
    },

    // 确认操作
    submitAddMenu: function() {
      var name = document.getElementById('pm-menu-name');
      if (name && !name.value.trim()) { PermissionLogic.showToast('请输入菜单名称'); return; }
      var isEdit = document.querySelector('#modal-add-menu .modal-header h3').textContent === '编辑菜单';
      PermissionLogic.showToast(isEdit ? '菜单编辑成功' : '菜单新增成功');
      PermissionModals.close('modal-add-menu');
    },
    submitRole: function() {
      var name = document.getElementById('pm-role-name');
      if (name && !name.value.trim()) { PermissionLogic.showToast('请输入角色名称'); return; }
      var isEdit = document.querySelector('#modal-add-role .modal-header h3').textContent === '编辑角色';
      PermissionLogic.showToast((isEdit ? '编辑' : '新增') + '角色成功');
      PermissionModals.close('modal-add-role');
    },
    savePermConfig: function() {
      PermissionLogic.showToast('权限配置已保存');
      PermissionModals.close('modal-perm-config');
    },

    // 工具方法
    close: function(id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    },
    _appendModal: function(html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper.firstElementChild);
    }
  };

  window.PermissionModals = PermissionModals;
})();
