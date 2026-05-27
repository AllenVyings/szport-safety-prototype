// knowledge-logic.js — 培训知识库管理交互逻辑
(function() {
  'use strict';

  var KnowledgeLogic = {

    init: function() {
      this.bindActions();
    },

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'showUploadModal':
            showModal('modal-upload');
            break;
          case 'showImportShareModal':
            showModal('import-share');
            break;
          case 'filterKnowledge':
            self.filterTable();
            break;
          case 'resetKnowledgeFilter':
            self.resetFilter();
            break;
          case 'approveResource':
            showToast('资源已审核通过', 'success');
            break;
          case 'rejectResource':
            showToast('资源已退回', 'info');
            break;
          case 'submitReview':
            var nameEl = document.querySelector('#modal-upload .form-input');
            if (!nameEl || !nameEl.value.trim()) { showToast('请输入资源名称', 'error'); return; }
            hideModal('modal-upload');
            showToast('资源已提交审核', 'success');
            break;
          case 'saveDraft':
            hideModal('modal-upload');
            showToast('草稿已保存', 'success');
            break;
          case 'offlineResource':
            showConfirm('确定下线该资源？', function() { showToast('资源已下线', 'success'); });
            break;
          case 'republishResource':
            showToast('资源已重新发布', 'success');
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
            break;
          case 'hideModal':
            if (param) {
              var mid = String(param).replace(/'/g, '');
              hideModal(mid);
            }
            break;
        }
      });
    },

    filterTable: function() {
      var container = document.querySelector('.filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      var rows = document.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) {
        var show = true;
        inputs.forEach(function(inp) {
          if (!inp.value || inp.value === '全部') return;
          var found = false;
          tr.querySelectorAll('td').forEach(function(td) {
            if (td.textContent.indexOf(inp.value) !== -1) found = true;
          });
          if (!found) show = false;
        });
        tr.style.display = show ? '' : 'none';
      });
      showToast('筛选完成', 'success');
    },

    resetFilter: function() {
      var container = document.querySelector('.filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = document.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    }
  };

  window.KnowledgeLogic = KnowledgeLogic;

  document.addEventListener('DOMContentLoaded', function() {
    KnowledgeLogic.init();
  });
})();
