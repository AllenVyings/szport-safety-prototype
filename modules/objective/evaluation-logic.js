// evaluation-logic.js — 安全履职评价交互逻辑
(function() {
  'use strict';

  var EvaluationLogic = {

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
          case 'openEvalDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showEvalList':
            setPageView('view-list', 'view-detail', 'list');
            self.hideAllPanels();
            break;
          case 'filterList':
            self.filterTable('tab-list');
            break;
          case 'resetListFilter':
            self.resetFilter('tab-list');
            break;
          case 'filterReport':
            self.filterTable('tab-report');
            break;
          case 'resetReportFilter':
            self.resetFilter('tab-report');
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
      var title = EvaluationData.detailTitles[id] || '履职详情';
      document.getElementById('detail-page-title').textContent = title;

      this.hideAllPanels();

      var panel = document.getElementById('panel-' + id);
      if (panel) {
        panel.style.display = 'block';
      } else {
        this.renderPanel(id);
      }

      setPageView('view-list', 'view-detail', 'detail');
    },

    hideAllPanels: function() {
      document.querySelectorAll('.detail-panel-content').forEach(function(p) {
        p.style.display = 'none';
      });
    },

    renderPanel: function(id) {
      var container = document.querySelector('#view-detail .card > div:last-child');
      if (!container) return;

      var items = EvaluationData.dutyItems[id];
      if (items) {
        var html = '<div id="panel-' + id + '" class="detail-panel-content">' +
          '<div class="detail-section-title">' + (EvaluationData.detailTitles[id] || '履职项明细') + '</div>' +
          '<div class="table-wrap"><table class="data-table">' +
          '<thead><tr><th>履职项名称</th><th>频率</th><th>完成次数</th><th>应完成次数</th><th>状态</th><th>来源</th></tr></thead><tbody>';
        items.forEach(function(item) {
          html += '<tr><td>' + item.name + '</td><td>' + item.freq + '</td><td>' + item.done + '</td><td>' + item.required + '</td>' +
            '<td><span class="tag ' + item.statusCls + '">' + item.status + '</span></td>' +
            '<td><span class="source-tag ' + item.sourceCls + '">' + item.source + '</span></td></tr>';
        });
        html += '</tbody></table></div></div>';
        container.insertAdjacentHTML('beforeend', html);
        return;
      }

      var scores = EvaluationData.scoreBreakdown;
      if (scores && id.indexOf('eval') === 0) {
        var html = '<div id="panel-' + id + '" class="detail-panel-content">' +
          '<div class="detail-section-title">' + (EvaluationData.detailTitles[id] || '履职得分数据溯源') + '</div>' +
          '<p style="font-size:var(--font-size-12);color:var(--text-tertiary);margin-bottom:12px;">得分由下级单位填报数据自动汇总，公式：K = 100 - Σ扣分 + Σ加分</p>' +
          '<div class="table-wrap"><table class="data-table" style="font-size:var(--font-size-13);">' +
          '<thead><tr><th>考核维度</th><th>权重</th><th>扣分项</th><th>扣分</th><th>加分项</th><th>加分</th><th>小计</th></tr></thead><tbody>';
        scores.forEach(function(s) {
          var deductCls = s.deduct < 0 ? ' class="u-text-error"' : '';
          var bonusCls = s.bonus > 0 ? ' class="u-text-success"' : '';
          html += '<tr><td>' + s.dimension + '</td><td>' + s.weight + '</td><td>' + s.deductItem + '</td>' +
            '<td' + deductCls + '>' + s.deduct + '</td><td>' + s.bonusItem + '</td>' +
            '<td' + bonusCls + '>' + s.bonus + '</td><td>' + s.subtotal + '</td></tr>';
        });
        html += '</tbody></table></div>' +
          '<p style="margin-top:8px;font-size:var(--font-size-12);color:var(--text-tertiary);">合计：95分 → 优秀</p></div>';
        container.insertAdjacentHTML('beforeend', html);
      }
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

  window.EvaluationLogic = EvaluationLogic;

  document.addEventListener('DOMContentLoaded', function() {
    EvaluationLogic.init();
  });
})();
