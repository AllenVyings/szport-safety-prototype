// external-logic.js — 外来人员培训交互逻辑
(function() {
  'use strict';

  var ExternalLogic = {

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
          case 'openTrainingExternalDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showTrainingExternalList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'arrangeRetest':
            showToast('已安排补考，通知已发送', 'success');
            break;
          case 'urgeLearn':
            showToast('催办通知已发送', 'success');
            break;
          case 'renewReminder':
            showToast('续期提醒已发送', 'success');
            break;
          case 'arrangeRetrain':
            showConfirm('确定安排该人员复训？', function() { showToast('已安排复训', 'success'); });
            break;
          case 'downloadCert':
            showToast('证书下载功能开发中', 'info');
            break;
          case 'filterManage':
            self.filterTable('tab-manage');
            break;
          case 'resetManageFilter':
            self.resetFilter('tab-manage');
            break;
          case 'filterCert':
            self.filterTable('tab-record');
            break;
          case 'resetCertFilter':
            self.resetFilter('tab-record');
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
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

    openDetail: function(id) {
      var d = ExternalData.detailData[id] || ExternalData.fallback;
      document.getElementById('train-detail-title').textContent = d.title;
      document.getElementById('train-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('train-detail-desc').textContent = d.desc;
      renderApprovalTimeline('train-detail-timeline', d.timeline);
      setPageView('view-list', 'view-detail', 'detail');
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

  window.ExternalLogic = ExternalLogic;

  document.addEventListener('DOMContentLoaded', function() {
    ExternalLogic.init();
  });
})();
