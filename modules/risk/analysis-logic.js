// analysis-logic.js — 风险统计分析交互逻辑
(function() {
  'use strict';

  var AnalysisLogic = {

    init: function() {
      this.bindActions();
      this.renderCharts();
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
          case 'openDrillDown':
            var key = String(param || '').replace(/'/g, '');
            self.openDrillDown(key);
            break;
          case 'filterDimension':
            self.filterDimension();
            break;
          case 'resetDimensionFilter':
            self.resetDimensionFilter();
            break;
          case 'filterGis':
            self.showToast('GIS筛选功能开发中');
            break;
          case 'resetGisFilter':
            self.showToast('GIS筛选重置功能开发中');
            break;
          case 'exportReport':
            self.showToast('报告导出功能开发中');
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

    switchTab: function(name, clickedTab) {
      document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var tab = document.getElementById('tab-' + name);
      if (tab) tab.classList.add('active');
    },

    renderCharts: function() {
      this.renderPieChart();
      this.renderUnitChart();
      this.renderTrendChart();
      this.renderControlPie();
      this.renderRankList();
      this.renderHazardTypeChart();
      this.renderAccidentTypeChart();
      this.renderControlLevelChart();
      this.renderUnitControlRate();
    },

    renderPieChart: function() {
      var el = document.getElementById('risk-level-pie');
      if (!el) return;
      var d = AnalysisData.riskLevel;
      var total = d.reduce(function(s, x) { return s + x.value; }, 0);
      var stops = [];
      var cumPct = 0;
      d.forEach(function(item) {
        var next = cumPct + item.pct;
        stops.push('var(--chart-' + item.cls + ') ' + cumPct.toFixed(1) + '% ' + next.toFixed(1) + '%');
        cumPct = next;
      });
      el.style.background = 'conic-gradient(' + stops.join(', ') + ')';
      var center = el.querySelector('.pie-total');
      if (center) center.textContent = total;
    },

    _renderStackedBar: function(elId, data) {
      var el = document.getElementById(elId);
      if (!el) return;
      var maxTotal = Math.max.apply(null, data.map(function(x) { return x.total; }));
      el.innerHTML = data.map(function(item) {
        var scale = 80 / maxTotal;
        var segs = '';
        ['blue', 'yellow', 'orange', 'red'].forEach(function(c) {
          var h = Math.round((item[c] || 0) * scale);
          if (h > 0) segs += '<div class="bar-segment ' + c + '" style="height:' + h + 'px"></div>';
        });
        return '<div class="bar-group"><div class="bar-stack">' + segs + '</div>' +
          '<div class="bar-label">' + item.name + '</div><div class="bar-value">' + item.total + '</div></div>';
      }).join('');
    },

    renderUnitChart: function() {
      this._renderStackedBar('unit-chart', AnalysisData.unitDistribution);
    },

    renderTrendChart: function() {
      var lineEl = document.getElementById('trend-line');
      var labelsEl = document.getElementById('trend-labels');
      if (!lineEl || !labelsEl) return;
      var data = AnalysisData.monthlyTrend;
      var maxVal = Math.max.apply(null, data.map(function(x) { return x.value; }));
      lineEl.innerHTML = data.map(function(item) {
        var pct = Math.round(item.value / maxVal * 100);
        return '<div class="trend-bar" style="height:' + pct + '%"><div class="trend-tip">' + item.month + ': ' + item.value + '</div></div>';
      }).join('');
      labelsEl.innerHTML = data.map(function(item) {
        return '<span>' + item.month + '</span>';
      }).join('');
    },

    renderControlPie: function() {
      var el = document.getElementById('control-pie');
      if (!el) return;
      var d = AnalysisData.controlStatus;
      var stops = [];
      var cumPct = 0;
      d.forEach(function(item) {
        var next = cumPct + item.pct;
        stops.push(item.color + ' ' + cumPct.toFixed(1) + '% ' + next.toFixed(1) + '%');
        cumPct = next;
      });
      el.style.background = 'conic-gradient(' + stops.join(', ') + ')';
    },

    renderRankList: function() {
      var containers = document.querySelectorAll('.rank-list-dynamic');
      if (containers.length === 0) return;
      var data = AnalysisData.topRisks;
      var half = Math.ceil(data.length / 2);
      var maxScore = data[0].score;
      for (var c = 0; c < 2; c++) {
        var slice = data.slice(c * half, (c + 1) * half);
        containers[c].innerHTML = slice.map(function(item) {
          var numCls = item.rank <= 3 ? ' top' + item.rank : ' normal';
          var pct = Math.round(item.score / maxScore * 100);
          return '<li class="rank-item"><span class="rank-num' + numCls + '">' + item.rank + '</span>' +
            '<span class="rank-name">' + item.name + '</span>' +
            '<div class="rank-bar-bg"><div class="rank-bar-fill" style="width:' + pct + '%; background:' + item.color + '"></div></div>' +
            '<span class="rank-count" style="color:' + item.color + '">' + item.score + '</span></li>';
        }).join('');
      }
    },

    renderHazardTypeChart: function() {
      this._renderStackedBar('hazard-type-chart', AnalysisData.hazardType);
    },

    renderAccidentTypeChart: function() {
      var el = document.getElementById('accident-type-pie');
      if (!el) return;
      var d = AnalysisData.accidentType;
      var stops = [];
      var cumPct = 0;
      d.forEach(function(item) {
        var next = cumPct + item.pct;
        stops.push(item.color + ' ' + cumPct.toFixed(1) + '% ' + next.toFixed(1) + '%');
        cumPct = next;
      });
      el.style.background = 'conic-gradient(' + stops.join(', ') + ')';
    },

    renderControlLevelChart: function() {
      this._renderStackedBar('control-level-chart', AnalysisData.controlLevel);
    },

    renderUnitControlRate: function() {
      var el = document.getElementById('unit-control-rate');
      if (!el) return;
      var data = AnalysisData.unitControlRate;
      el.innerHTML = data.map(function(item) {
        return '<div style="display:flex; align-items:center; margin-bottom:12px;">' +
          '<span style="font-size:var(--font-size-13); width:80px; color:var(--text-secondary)">' + item.name + '</span>' +
          '<div style="flex:1; height:24px; background:var(--bg-page); border-radius:4px; overflow:hidden; margin:0 8px;">' +
            '<div style="width:' + item.rate + '%; height:100%; background:' + item.color + '; border-radius:4px; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; font-size:var(--font-size-11); color:var(--text-inverse);">' + item.rate + '%</div>' +
          '</div></div>';
      }).join('');
    },

    openDrillDown: function(key) {
      var drill = AnalysisData.drillDown[key];
      if (!drill) { this.showToast('下钻数据暂未配置', 'info'); return; }

      var existing = document.getElementById('modal-drill-down');
      if (existing) existing.remove();

      var thCells = drill.columns.map(function(c) { return '<th>' + c + '</th>'; }).join('');
      var trCells = drill.data.map(function(row, i) {
        return '<tr>' + row.map(function(cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>';
      }).join('');

      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay" id="modal-drill-down">' +
        '<div class="modal" style="width:720px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + drill.title + '</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-drill-down\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body" style="max-height:480px;overflow-y:auto;">' +
            '<table class="data-table"><thead><tr>' + thCells + '</tr></thead><tbody>' + trCells + '</tbody></table>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-drill-down\'">关闭</button>' +
          '</div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-drill-down');
    },

    filterDimension: function() {
      this.showToast('多维筛选功能开发中', 'info');
    },

    resetDimensionFilter: function() {
      var fields = document.querySelectorAll('#tab-dimension .filter-field .form-input');
      fields.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      this.showToast('筛选已重置', 'success');
    },

    showToast: function(msg, type) {
      showToast(msg, type || 'success');
    }
  };

  window.AnalysisLogic = AnalysisLogic;

  document.addEventListener('DOMContentLoaded', function() {
    AnalysisLogic.init();
  });
})();
