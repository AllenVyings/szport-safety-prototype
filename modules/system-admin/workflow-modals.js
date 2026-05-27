// workflow-modals.js — 流程管理弹窗
(function() {
  'use strict';

  var WorkflowModals = {

    // 创建/编辑流程弹窗
    createFlowModal: function(editData) {
      var isEdit = !!editData;
      var title = isEdit ? '编辑流程' : '新建流程';
      var d = editData || WorkflowData.newFlowDefaults;

      var funcs = Object.keys(WorkflowData.functionTypes);
      var funcChecks = funcs.map(function(f) {
        var checked = isEdit && d.functions && d.functions.indexOf(f) !== -1 ? ' checked' : '';
        return '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:16px;font-size:var(--font-size-13);cursor:pointer;">' +
          '<input type="checkbox" name="flow-func" value="' + f + '"' + checked + '> ' + f + '</label>';
      }).join('');

      var moduleOptions = WorkflowData.modules.map(function(m) {
        var sel = d.module === m ? ' selected' : '';
        return '<option' + sel + '>' + m + '</option>';
      }).join('');

      return '<div class="modal-overlay" id="modal-flow-form">' +
        '<div class="modal" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header">' +
            '<h3>' + title + '</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-flow-form\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">流程名称 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="flow-name" placeholder="请输入流程名称" value="' + (d.name || '') + '" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">适用模块 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><select class="form-input form-select" id="flow-module" style="width:100%">' + moduleOptions + '</select></div></div>' +
            '<div class="form-group"><div class="form-label">流程功能</div>' +
              '<div class="form-content" style="padding-top:6px">' + funcChecks + '</div></div>' +
            '<div class="form-group"><div class="form-label">流程说明</div>' +
              '<div class="form-content"><textarea class="form-input" id="flow-desc" placeholder="请输入流程说明" rows="3" style="width:100%;resize:vertical">' + (d.desc || '') + '</textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-flow-form\'">取消</button>' +
            '<button class="btn btn-primary" data-action="saveFlow">确定</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

  };

  window.WorkflowModals = WorkflowModals;
})();
