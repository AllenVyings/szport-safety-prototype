// basic-config-modals.js — 基础配置弹窗
(function() {
  'use strict';

  var BasicConfigModals = {

    createTypeModal: function(editData, groupName) {
      var isEdit = !!editData;
      var title = isEdit ? '编辑配置项类型' : '新增配置项类型';
      var d = editData || { name: '', code: '', desc: '' };

      return '<div class="modal-overlay" id="modal-type-form">' +
        '<div class="modal" style="width:460px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + title + '</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-type-form\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">类型名称 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="bc-type-name" value="' + (d.name || '') + '" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">类型编码 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="bc-type-code" value="' + (d.code || '') + '" placeholder="全局唯一英文编码" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">描述</div>' +
              '<div class="form-content"><textarea class="form-input" id="bc-type-desc" style="height:72px;width:100%">' + (d.desc || '') + '</textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-type-form\'">取消</button>' +
            '<button class="btn btn-primary" data-action="saveConfigType">确定</button>' +
          '</div>' +
        '</div></div>';
    },

    createOptionModal: function(typeName, editData) {
      var isEdit = !!editData;
      var title = isEdit ? '编辑选项' : '新增选项';
      var d = editData || { name: '', code: '', sort: 1 };

      return '<div class="modal-overlay" id="modal-option-form">' +
        '<div class="modal" style="width:460px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + title + '</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-option-form\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">所属类型</div>' +
              '<div class="form-content"><input class="form-input" value="' + typeName + '" readonly style="width:100%;background:var(--bg-page)"></div></div>' +
            '<div class="form-group"><div class="form-label">选项名称 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="bc-opt-name" value="' + (d.name || '') + '" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">选项编码 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="bc-opt-code" value="' + (d.code || '') + '" placeholder="全局唯一" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">排序号</div>' +
              '<div class="form-content"><input type="number" class="form-input" id="bc-opt-sort" value="' + (d.sort || 1) + '" style="width:80px"></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-option-form\'">取消</button>' +
            '<button class="btn btn-primary" data-action="saveConfigOption">确定</button>' +
          '</div>' +
        '</div></div>';
    },

    createGroupModal: function() {
      return '<div class="modal-overlay" id="modal-group-form">' +
        '<div class="modal" style="width:400px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>新增模块分组</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-group-form\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">分组名称 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="bc-group-name" placeholder="如：综合管理" style="width:100%"></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-group-form\'">取消</button>' +
            '<button class="btn btn-primary" data-action="saveGroup">确定</button>' +
          '</div>' +
        '</div></div>';
    }

  };

  window.BasicConfigModals = BasicConfigModals;
})();
