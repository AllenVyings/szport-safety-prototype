// dashboard-logic.js — 看板交互逻辑
(function() {
  'use strict';

  var DashboardLogic = {

    init: function() {
      this.bindActions();
      this.updateRefreshTime();
    },

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'switchMainTab':
            var tab = String(param || '').replace(/'/g, '');
            self.switchMainTab(tab, btn);
            break;
          case 'switchTopicTab':
            var topic = String(param || '').replace(/'/g, '');
            self.switchTopicTab(topic, btn);
            break;
          case 'showDrillDown':
            var key = String(param || '').replace(/'/g, '');
            self.showDrillDown(key);
            break;
          case 'filterDashboard':
            self.filterDashboard();
            break;
          case 'resetDashboardFilter':
            self.resetDashboardFilter();
            break;
          case 'exportDashboard':
            self.showToast('报告导出功能开发中', 'info');
            break;
          case 'refreshData':
            self.refreshData();
            break;
          case 'showAlertPanel':
            self.showAlertPanel();
            break;
          case 'drillToTopic':
            var topic = btn.getAttribute('data-drill-topic') || self.inferTopicFromHint(btn.textContent || '');
            if (topic) {
              self.drillToTopic(topic);
              var drillKeyMap = { training: 'training', risk: 'risk', hazard: 'hazard', work: 'work', emergency: 'drill' };
              var key = drillKeyMap[topic];
              if (key && DashboardData.drillDown[key]) self.showDrillDown(key);
              else self.showToast('已切换至专题视图', 'info');
            } else {
              self.showToast('下钻功能开发中', 'info');
            }
            break;
          case 'hideModal':
            if (param) {
              var mid = String(param).replace(/'/g, '');
              hideModal(mid);
            }
            break;
        }
      });

      // Backdrop click to close modals
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
          hideModal(e.target.id);
        }
      });
    },

    switchMainTab: function(tab, clickedTab) {
      document.querySelectorAll('.dashboard-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var panel = document.getElementById('panel-' + tab);
      if (panel) panel.classList.add('active');
    },

    switchTopicTab: function(topic, clickedTab) {
      document.querySelectorAll('.topic-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.topic-panel').forEach(function(p) { p.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var panel = document.getElementById('topic-' + topic);
      if (panel) panel.classList.add('active');
    },

    showDrillDown: function(key) {
      var data = DashboardData.drillDown[key];
      if (!data) { this.showToast('下钻数据暂未配置', 'info'); return; }

      var existing = document.getElementById('modal-drill-down');
      if (existing) existing.remove();

      var rows = data.items.map(function(item) {
        var cls = item.status === 'danger' ? 'u-text-error' : item.status === 'warning' ? 'u-text-warning' : 'u-text-success';
        return '<tr><td>' + item.name + '</td><td class="' + cls + '" style="font-weight:600">' + item.rate + '</td></tr>';
      }).join('');

      var thCells = data.columns.map(function(c) { return '<th>' + c + '</th>'; }).join('');

      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="modal-drill-down">' +
        '<div class="modal" style="width:480px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + data.title + '</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-drill-down\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body" style="max-height:400px;overflow-y:auto;">' +
            '<table class="data-table"><thead><tr>' + thCells + '</tr></thead><tbody>' + rows + '</tbody></table>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-drill-down\'">关闭</button>' +
          '</div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-drill-down');
    },

    drillToTopic: function(topic) {
      var mainTab = document.querySelector('.dashboard-tab[data-action="switchMainTab"][data-param="\'topic\'"]');
      this.switchMainTab('topic', mainTab);

      var drillKeyMap = { training: 'training', risk: 'risk', hazard: 'hazard', work: 'work', emergency: 'drill' };
      var subTab = document.querySelector('.topic-tab[data-action="switchTopicTab"][data-param="\'' + topic + '\'"]');
      if (subTab) this.switchTopicTab(topic, subTab);
    },

    inferTopicFromHint: function(text) {
      if (!text) return null;
      if (text.indexOf('培训') > -1) return 'training';
      if (text.indexOf('风险') > -1) return 'risk';
      if (text.indexOf('隐患') > -1) return 'hazard';
      if (text.indexOf('作业') > -1) return 'work';
      if (text.indexOf('演练') > -1 || text.indexOf('应急') > -1) return 'emergency';
      return null;
    },

    filterDashboard: function() {
      this.showToast('筛选功能开发中', 'info');
    },

    resetDashboardFilter: function() {
      var fields = document.querySelectorAll('.dashboard-filter .form-input');
      fields.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      this.showToast('筛选已重置', 'success');
    },

    refreshData: function() {
      this.updateRefreshTime();
      this.showToast('数据已刷新', 'success');
    },

    updateRefreshTime: function() {
      var el = document.getElementById('last-refresh');
      if (el) {
        var now = new Date();
        var y = now.getFullYear();
        var m = String(now.getMonth() + 1).padStart(2, '0');
        var d = String(now.getDate()).padStart(2, '0');
        var h = String(now.getHours()).padStart(2, '0');
        var min = String(now.getMinutes()).padStart(2, '0');
        el.textContent = '数据更新时间：' + y + '-' + m + '-' + d + ' ' + h + ':' + min;
      }
    },

    showAlertPanel: function() {
      var existing = document.getElementById('modal-alert-panel');
      if (existing) existing.remove();

      var alerts = DashboardData.alerts;
      var rows = alerts.map(function(a) {
        var cls = a.level === 'danger' ? 'u-text-error' : 'u-text-warning';
        var icon = a.level === 'danger' ? '&#9679;' : '&#9679;';
        return '<tr><td style="padding:8px 12px;border-bottom:1px solid var(--border-light);font-size:var(--font-size-13);" class="' + cls + '">' +
          icon + ' ' + a.text + '</td></tr>';
      }).join('');

      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="modal-alert-panel">' +
        '<div class="modal" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>预警信息</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-alert-panel\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body" style="max-height:400px;overflow-y:auto;">' +
            '<table style="width:100%;border-collapse:collapse;"><tbody>' + rows + '</tbody></table>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-alert-panel\'">关闭</button>' +
          '</div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-alert-panel');
    },

    showToast: function(msg, type) {
      showToast(msg, type || 'success');
    }
  };

  window.DashboardLogic = DashboardLogic;

  document.addEventListener('DOMContentLoaded', function() {
    DashboardLogic.init();
  });
})();
