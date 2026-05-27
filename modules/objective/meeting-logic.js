// meeting-logic.js — 安全会议交互逻辑
(function() {
  'use strict';

  var MeetingLogic = {

    detailTitles: {
      'meeting-1': '集团安委会季度会议',
      'meeting-2': '5月安全例会',
      'meeting-3': '危化品安全管理专题会',
      'meeting-4': '新员工安全培训会'
    },

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
          case 'openMeetingDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showMeetingList':
            setPageView('view-list', 'view-detail', 'list');
            self.hideAllPanels();
            break;
          case 'showAddMeetingModal':
            showModal('modal-add');
            break;
          case 'archiveMeeting':
            showConfirm('确定归档该会议？', function() { showToast('会议已归档', 'success'); });
            break;
          case 'markHeld':
            showConfirm('确定标记该会议为已召开？', function() { showToast('已标记为已召开', 'success'); });
            break;
          case 'filterMeeting':
            self.filterTable();
            break;
          case 'resetMeetingFilter':
            self.resetFilter();
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

    openDetail: function(id) {
      var title = this.detailTitles[id] || '会议详情';
      document.getElementById('meeting-detail-title').textContent = title;
      this.hideAllPanels();
      var panel = document.getElementById('panel-' + id);
      if (panel) panel.style.display = 'block';
      setPageView('view-list', 'view-detail', 'detail');
    },

    hideAllPanels: function() {
      document.querySelectorAll('.meeting-detail-panel').forEach(function(p) {
        p.style.display = 'none';
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

  window.MeetingLogic = MeetingLogic;

  document.addEventListener('DOMContentLoaded', function() {
    MeetingLogic.init();
  });
})();
