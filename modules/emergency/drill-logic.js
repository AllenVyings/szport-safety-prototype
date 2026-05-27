// drill-logic.js — 应急演练交互逻辑
(function() {
  'use strict';

  var DrillLogic = {

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
          case 'switchTab':
            var name = String(param || '').replace(/'/g, '');
            self.switchTab(name, btn);
            break;
          case 'openDrillDetail':
            setPageView('view-list', 'view-detail', 'detail');
            break;
          case 'showDrillList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'showAddPlanModal':
            showModal('modal-drill-plan-add');
            break;
          case 'saveDrillPlan':
            hideModal('modal-drill-plan-add');
            showToast('演练计划已保存', 'success');
            break;
          case 'executeDrill':
            showToast('演练执行功能开发中', 'info');
            break;
          case 'filterPlan':
            self.filterTable('tab-plan');
            break;
          case 'resetPlanFilter':
            self.resetFilter('tab-plan');
            break;
          case 'filterRecord':
            self.filterTable('tab-record');
            break;
          case 'resetRecordFilter':
            self.resetFilter('tab-record');
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

    switchTab: function(name, clickedTab) {
      document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var tab = document.getElementById('tab-' + name);
      if (tab) tab.classList.add('active');
    },

    filterTable: function(tabId) {
      var container = document.getElementById(tabId);
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      var rows = container.querySelectorAll('.data-table tbody tr');
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

    resetFilter: function(tabId) {
      var container = document.getElementById(tabId);
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    }
  };

  window.DrillLogic = DrillLogic;

  document.addEventListener('DOMContentLoaded', function() {
    DrillLogic.init();
  });
})();
