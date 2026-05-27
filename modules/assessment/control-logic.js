// control-logic.js — 控制指标（否决项） 交互逻辑
(function() {
  'use strict';

  var ControlLogic = {

    init: function() {
      this.bindActions();
      this.renderHistoryTable();
      this.renderPendingTable();
      this.renderIndicatorCards();
    },

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'openAssessmentControlDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showAssessmentControlList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'showThresholdConfig':
            // 阈值配置已改为只读展示，此操作不再触发弹窗
            self.showToast('阈值配置来源：考核计划→指标下达');
            break;
          case 'hideModal':
            ControlModals.close('modal-' + param);
            break;
          case 'confirmPending':
          case 'excludePending':
            // 已废弃：连带确认统一入口已迁移至扣分管理页面
            self.showToast('请前往「扣分管理」页面进行连带确认操作');
            break;
          case 'goToDeductionConfirm':
            self.showToast('请前往「扣分管理」页面进行连带确认操作');
            // 原型中模拟菜单跳转：触发侧边栏扣分管理菜单点击
            var workMenu = document.querySelector('[data-id="assessment-work"]');
            if (workMenu) workMenu.click();
            break;
          case 'filterControlHistory':
            self.filterHistory();
            break;
          case 'resetControlHistory':
            var inputs = document.querySelectorAll('.filter-field .form-input');
            inputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderHistoryTable();
            break;
          case 'exportControlHistory':
            self.showToast('导出功能开发中');
            break;
        }
      });
    },

    // 渲染指标卡片
    renderIndicatorCards: function() {
      var grid = document.querySelector('.indicator-grid');
      if (!grid) return;
      grid.innerHTML = ControlData.indicators.map(function(r) {
        var cls = 'indicator-card';
        var statusCls = 'ind-status';
        if (r.status === 'triggered') { cls += ' triggered'; statusCls += ' triggered'; }
        else if (r.status === 'linked-triggered') { cls += ' linked-triggered'; statusCls += ' linked-triggered'; }
        else if (r.status === 'pending') { cls += ' pending'; statusCls += ' pending'; }
        else { statusCls += ' normal'; }
        var unitText = (r.status === 'triggered' || r.status === 'pending' || r.status === 'linked-triggered') ? r.unit : '关联：' + r.scope;
        var html = '<div class="' + cls + '">' +
          '<div class="ind-name">' + r.name + '</div>' +
          '<div class="' + statusCls + '">' + r.statusText + '</div>' +
          '<div class="ind-unit">' + unitText + '</div>';
        if (r.time) html += '<div class="ind-time">' + r.time + '</div>';
        html += '<div class="ind-threshold">阈值：' + r.threshold + '</div></div>';
        return html;
      }).join('');
    },

    // 渲染历史触发记录
    renderHistoryTable: function(filter) {
      var data = ControlData.history;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.unit.indexOf(filter.name) === -1) return false;
          if (filter.indicator && filter.indicator !== '全部') {
            var idx = filter.indicator.charAt(0);
            if (r.indicator.charAt(0) !== idx) return false;
          }
          if (filter.year && filter.year !== '全部' && r.time.indexOf(filter.year.replace('年', '')) === -1) return false;
          return true;
        });
      }
      var tbody = document.querySelector('.data-table:first-of-type tbody');
      if (!tbody) {
        var tables = document.querySelectorAll('.data-table');
        for (var t = 0; t < tables.length; t++) {
          var parent = tables[t].closest('.pending-list');
          if (!parent) { tbody = tables[t].querySelector('tbody'); break; }
        }
      }
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        return '<tr><td>' + (i + 1) + '</td><td>' + r.indicator + '</td><td>' + r.unit + '</td><td><span class="tag ' + r.levelCls + '">' + r.level + '</span></td><td>' + r.time + '</td><td><span class="tag ' + r.resultTag + '">' + r.result + '</span></td><td><button class="btn btn-text btn-sm" data-action="openAssessmentControlDetail" data-param="\'' + r.id + '\'">查看详情</button></td></tr>';
      }).join('');
      var pgn = document.querySelector('.pagination');
      if (pgn) pgn.querySelector('span').textContent = '共 ' + data.length + ' 条';
    },

    filterHistory: function() {
      var fields = document.querySelectorAll('.filter-field .form-input');
      this.renderHistoryTable({
        name: fields[0] ? fields[0].value : '',
        indicator: fields[1] ? fields[1].value : '全部',
        year: fields[2] ? fields[2].value : '全部'
      });
    },

    // 渲染待确认连带列表
    renderPendingTable: function() {
      var data = ControlData.pending;
      var tables = document.querySelectorAll('.pending-list .data-table');
      var tbody = tables.length > 0 ? tables[0].querySelector('tbody') : null;
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var bgStyle = r.highlighted ? ' style="background:rgba(233,124,0,0.05);"' : '';
        return '<tr' + bgStyle + '><td>' + (i + 1) + '</td><td>' + r.contractor + '</td><td>' + r.accident + '</td><td>' + r.unit + '</td><td><strong class="u-text-error">' + r.deduction + '</strong></td><td><span class="tag tag-warning">待确认连带</span> <button class="btn btn-text btn-sm" data-action="goToDeductionConfirm" style="color:var(--primary)">去确认 &rarr;</button></td></tr>';
      }).join('');
    },

    // 详情查看
    openDetail: function(id) {
      var d = ControlData.details[id];
      if (!d) {
        d = { title: '记录详情', basic: [['状态', '正常']], desc: '原型样例数据。', timeline: [{ status: 'done', time: '2026-05-01', event: '登记' }] };
      }
      document.getElementById('actl-detail-title').textContent = d.title;
      document.getElementById('actl-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('actl-detail-desc').textContent = d.desc;
      if (typeof renderApprovalTimeline === 'function') {
        renderApprovalTimeline('actl-detail-timeline', d.timeline);
      }
      setPageView('view-list', 'view-detail', 'detail');
    },

    // Toast 提示
    showToast: function(msg) {
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 24px;background:var(--success);color:#fff;border-radius:var(--radius-md);font-size:var(--font-size-14);z-index:9999;box-shadow:var(--shadow-lg);';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    }
  };

  window.ControlLogic = ControlLogic;

  document.addEventListener('DOMContentLoaded', function() {
    ControlLogic.init();
  });
})();
