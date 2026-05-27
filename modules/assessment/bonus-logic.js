// bonus-logic.js — 加分项与举报奖励 交互逻辑
(function() {
  'use strict';

  var BonusLogic = {
    currentTab: 'bonus',

    init: function() {
      this.bindActions();
      this.renderStatCards();
      this.renderProgressBar();
      this.renderBonusTable();
      this.renderReportTable();
      this.renderConfigTable();
    },

    // Tab 切换

    switchTab: function(name, item) {
      var scope = document.getElementById('tab-bonus') || document;
      scope.querySelectorAll('.tab-bar .tab-item').forEach(function(t) { t.classList.remove('active'); });
      scope.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (item) item.classList.add('active');
      var panel = document.getElementById('tab-' + name);
      if (panel) panel.classList.add('active');
      this.currentTab = name;
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
            self.switchTab(param, btn);
            break;
          case 'openBonusDetail':
          case 'openBonusReportDetail':
            var id = String(param || '');
            self.openDetail(id);
            break;
          case 'showBonusList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'addBonus':
            BonusModals.showAddBonus();
            break;
          case 'reviewBonus':
            BonusModals.showReviewBonus(String(param || ''));
            break;
          case 'resubmitBonus':
            BonusModals.showResubmit(String(param || ''));
            break;
          case 'confirmReport':
            BonusModals.showConfirmReport(String(param || ''));
            break;
          case 'saveBonusConfig':
            BonusLogic.showToast('配置已保存');
            break;
          case 'resetBonusConfig':
            BonusLogic.renderConfigTable();
            BonusLogic.showToast('已恢复默认配置');
            break;
          case 'filterBonus':
            self.filterBonus();
            break;
          case 'resetBonus':
            var bInputs = document.querySelectorAll('#tab-bonus-bonus .filter-field .form-input');
            bInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderBonusTable();
            break;
          case 'filterReport':
            self.filterReport();
            break;
          case 'resetReport':
            var rInputs = document.querySelectorAll('#tab-bonus-report .filter-field .form-input');
            rInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderReportTable();
            break;
          case 'exportBonus':
            self.showToast('导出功能开发中');
            break;
          case 'filterReportByCard':
            self.filterReportByCard(param);
            break;
        }
      });
    },

    

    // 动态渲染统计卡片
    renderStatCards: function() {
      var list = BonusData.bonusList;
      var total = list.length;
      var activeScore = 0;
      var pendingCount = 0;
      var reportCount = BonusData.reportList.length;
      list.forEach(function(r) {
        if (r.status === '已生效') activeScore += r.scoreNum;
        if (r.status === '审核中') pendingCount++;
      });
      var el;
      el = document.getElementById('bs-total');
      if (el) el.textContent = total;
      el = document.getElementById('bs-active');
      if (el) el.textContent = '+' + activeScore;
      el = document.getElementById('bs-pending');
      if (el) el.textContent = pendingCount;
      el = document.getElementById('bs-report');
      if (el) el.textContent = reportCount;
    },

    // 动态渲染年度加分进度条
    renderProgressBar: function() {
      var list = BonusData.bonusList;
      var activeScore = 0;
      var pendingScore = 0;
      list.forEach(function(r) {
        if (r.status === '已生效') activeScore += r.scoreNum;
        if (r.status === '审核中') pendingScore += r.scoreNum;
      });
      var cap = 10;
      var combinedScore = activeScore + pendingScore;
      var pct = Math.min((combinedScore / cap) * 100, 100);
      var fill = document.getElementById('bonus-progress-fill');
      if (fill) fill.style.width = pct + '%';
      var text = document.getElementById('bonus-progress-text');
      if (text) {
        text.innerHTML = '<span>已生效：' + activeScore + '分 + 审核中：' + pendingScore + '分 / 上限' + cap + '分</span>' + (combinedScore >= cap ? '<span style="color:var(--error)">已超上限</span>' : '<span>剩余可用：' + (cap - combinedScore) + '分</span>');
      }
    },

    // 渲染加分项表格（Tab1）
    renderBonusTable: function(filter) {
      var data = BonusData.bonusList;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.name.indexOf(filter.name) === -1) return false;
          if (filter.type && filter.type !== '全部' && r.type.indexOf(filter.type.split('+')[0]) === -1) return false;
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#tab-bonus-bonus .data-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var ops = '<button class="btn btn-text btn-sm" data-action="openBonusDetail" data-param="' + r.id + '">查看</button>';
        if (r.status === '审核中') {
          ops += '<button class="btn btn-text btn-sm" data-action="reviewBonus" data-param="' + r.id + '">审核</button>';
        }
        if (r.status === '已驳回') {
          ops += '<button class="btn btn-text btn-sm" data-action="resubmitBonus" data-param="' + r.id + '">重新提交</button>';
        }
        return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + r.type + '</td><td><strong class="' + r.scoreClass + '">' + r.score + '</strong></td><td>' + r.unit + '</td><td><span class="tag ' + r.statusTag + '">' + r.status + '</span></td><td>' + ops + '</td></tr>';
      }).join('');
      var pgn = document.querySelector('#tab-bonus-bonus .pagination');
      if (pgn) pgn.querySelector('span').textContent = '共 ' + data.length + ' 条';
    },

    filterBonus: function() {
      var fields = document.querySelectorAll('#tab-bonus-bonus .filter-field .form-input');
      this.renderBonusTable({
        name: fields[0] ? fields[0].value : '',
        type: fields[1] ? fields[1].value : '全部',
        status: fields[2] ? fields[2].value : '全部'
      });
    },

    // 渲染举报奖励表格（Tab2）
    renderReportTable: function(filter) {
      var data = BonusData.reportList;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.reporter && (r.reporter.indexOf(filter.reporter) === -1 && r.unit.indexOf(filter.reporter) === -1)) return false;
          if (filter.level && filter.level !== '全部' && r.level !== filter.level) return false;
          if (filter.confirmLevel && filter.confirmLevel !== '全部' && r.confirmLevel !== filter.confirmLevel) return false;
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#tab-bonus-report .data-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var ops = '<button class="btn btn-text btn-sm" data-action="openBonusReportDetail" data-param="' + r.id + '">查看</button>';
        if (r.status === '待确认') {
          ops += '<button class="btn btn-text btn-sm" data-action="confirmReport" data-param="' + r.id + '">确认</button>';
        }
        return '<tr><td>' + (i + 1) + '</td><td>' + r.reporter + '</td><td><span class="tag ' + r.levelTag + '">' + r.level + '</span></td><td><strong class="' + r.scoreClass + '">' + r.score + '</strong></td><td>' + r.confirmLevel + '</td><td>' + r.unit + '</td><td>' + r.period + '</td><td><span class="tag ' + r.statusTag + '">' + r.status + '</span></td><td>' + ops + '</td></tr>';
      }).join('');
      var pgn = document.querySelector('#tab-bonus-report .pagination');
      if (pgn) pgn.querySelector('span').textContent = '共 ' + data.length + ' 条';
    },

    filterReport: function() {
      var fields = document.querySelectorAll('#tab-bonus-report .filter-field .form-input');
      this.renderReportTable({
        reporter: fields[0] ? fields[0].value : '',
        level: fields[1] ? fields[1].value : '全部',
        confirmLevel: fields[2] ? fields[2].value : '全部',
        status: fields[3] ? fields[3].value : '全部'
      });
    },

    filterReportByCard: function(param) {
      var fields = document.querySelectorAll('#tab-bonus-report .filter-field .form-input');
      fields.forEach(function(el) { el.value = el.options ? '全部' : ''; });
      var status = '全部';
      if (param === 'pending') status = '待确认';
      if (param === 'confirmed') status = '已确认';
      if (fields[3]) fields[3].value = status;
      this.renderReportTable({
        reporter: '',
        level: '全部',
        confirmLevel: '全部',
        status: status
      });
    },

    // 渲染加分额度配置表格
    renderConfigTable: function() {
      var tbody = document.querySelector('.bonus-config-panel .data-table tbody');
      if (!tbody) return;
      tbody.innerHTML = BonusData.config.map(function(r) {
        return '<tr><td><span class="tag ' + r.levelTag + '">' + r.level + '</span></td><td><input class="form-input" type="number" value="' + r.score + '" style="width:80px;"> 分</td><td>' + r.desc + '</td></tr>';
      }).join('');
    },

    // 详情查看
    openDetail: function(id) {
      var d = BonusData.details[id];
      if (!d) {
        d = { title: '记录详情', basic: [['状态', '进行中']], desc: '原型样例数据。', timeline: [{ status: 'done', time: '2026-05-01', event: '登记' }] };
      }
      document.getElementById('bonus-detail-title').textContent = d.title;
      document.getElementById('bonus-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      if (typeof renderApprovalTimeline === 'function') {
        renderApprovalTimeline('bonus-detail-timeline', d.timeline);
      }
      setPageView('view-list', 'view-detail', 'detail');
    },

    // Toast 提示
    showToast: function(msg, type) {
      var bgColor = type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : 'var(--success)';
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 24px;background:' + bgColor + ';color:#fff;border-radius:var(--radius-md);font-size:var(--font-size-14);z-index:9999;box-shadow:var(--shadow-lg);';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    }
  };

  window.BonusLogic = BonusLogic;

  document.addEventListener('DOMContentLoaded', function() {
    BonusLogic.init();
  });
})();
