// typhoon-logic.js — 防台风应急响应交互逻辑
(function() {
  'use strict';

  var TyphoonLogic = {

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
          case 'openTyphoonDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'openTyphoonHistDetail':
            var hid = String(param || '').replace(/'/g, '');
            self.openDetail(hid);
            break;
          case 'openTyphoonReportDetail':
            var rid = String(param || '').replace(/'/g, '');
            self.openDetail(rid);
            break;
          case 'showTyphoonList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'issueWarning':
            self.openIssueWarningModal();
            break;
          case 'confirmIssueWarning':
            self.confirmIssueWarning();
            break;
          case 'triggerWarning':
            showToast('已模拟触发橙色预警，各单位将收到通知', 'info');
            break;
          case 'openSubmitReport':
            self.openSubmitReportModal();
            break;
          case 'confirmSubmitReport':
            self.confirmSubmitReport();
            break;
          case 'editConfig':
            var level = String(param || '').replace(/'/g, '');
            self.openEditConfigModal(level);
            break;
          case 'saveConfig':
            self.saveConfig();
            break;
          case 'filterWarning':
            self.filterWarning();
            break;
          case 'resetWarningFilter':
            self.resetWarningFilter();
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

    openDetail: function(id) {
      var d = TyphoonData.detailData[id];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }

      document.getElementById('typhoon-detail-title').textContent = d.title;
      document.getElementById('typhoon-detail-basic').innerHTML = d.basic.map(function(row) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + row[0] + '</span><span style="font-weight:500;">' + row[1] + '</span></div>';
      }).join('');
      document.getElementById('typhoon-detail-desc').textContent = d.desc;
      renderApprovalTimeline('typhoon-detail-timeline', d.timeline, 'typhoon-detail-timeline-empty');
      setPageView('view-list', 'view-detail', 'detail');
    },

    // Issue warning modal
    openIssueWarningModal: function() {
      var existing = document.getElementById('modal-issue-warning');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = TyphoonModals.issueWarningModal();
      document.body.appendChild(div.firstElementChild);
      showModal('modal-issue-warning');
    },

    confirmIssueWarning: function() {
      var nameEl = document.getElementById('tw-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入台风名称', 'error'); return; }
      hideModal('modal-issue-warning');
      showToast('预警已下发至各二级企业', 'success');
    },

    // Submit report modal
    openSubmitReportModal: function() {
      var existing = document.getElementById('modal-submit-report');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = TyphoonModals.submitReportModal();
      document.body.appendChild(div.firstElementChild);
      showModal('modal-submit-report');
    },

    confirmSubmitReport: function() {
      var unitEl = document.getElementById('tw-rpt-unit');
      var personEl = document.getElementById('tw-rpt-person');
      var measureEl = document.getElementById('tw-rpt-measure');
      if (!personEl || !personEl.value.trim()) { showToast('请输入值班负责人', 'error'); return; }
      if (!measureEl || !measureEl.value.trim()) { showToast('请输入处置措施', 'error'); return; }
      hideModal('modal-submit-report');
      showToast('处置上报已提交', 'success');
    },

    // Edit config modal
    openEditConfigModal: function(level) {
      var existing = document.getElementById('modal-edit-config');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = TyphoonModals.editConfigModal(level);
      document.body.appendChild(div.firstElementChild);
      showModal('modal-edit-config');
    },

    saveConfig: function() {
      hideModal('modal-edit-config');
      showToast('配置已保存', 'success');
    },

    // Filter
    filterWarning: function() {
      var unitInput = document.querySelector('#tab-warning .filter-field .form-input');
      var statusSel = document.querySelector('#tab-warning .filter-field .form-select');
      var unit = unitInput ? unitInput.value.trim() : '';
      var status = statusSel ? statusSel.value : '';
      var rows = document.querySelectorAll('#tab-warning .data-table tbody tr');
      rows.forEach(function(tr) {
        var show = true;
        if (unit) {
          var nameCell = tr.children[1] ? tr.children[1].textContent : '';
          if (nameCell.indexOf(unit) === -1) show = false;
        }
        if (status && status !== '全部') {
          var statusCell = tr.children[2] ? tr.children[2].textContent.trim() : '';
          if (statusCell !== status) show = false;
        }
        tr.style.display = show ? '' : 'none';
      });
      showToast('筛选完成', 'success');
    },

    resetWarningFilter: function() {
      var fields = document.querySelectorAll('#tab-warning .filter-field .form-input, #tab-warning .filter-field .form-select');
      fields.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = document.querySelectorAll('#tab-warning .data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    }
  };

  window.TyphoonLogic = TyphoonLogic;

  document.addEventListener('DOMContentLoaded', function() {
    TyphoonLogic.init();
  });
})();
