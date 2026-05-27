// work-logic.js — 工作指标与扣分规则 交互逻辑
(function() {
  'use strict';

  var WorkLogic = {
    currentTab: 'rules',

    init: function() {
      this.bindActions();
      this.renderRulesTable();
      this.renderRecordsTable();
      this.renderWarningPanel();
    },

    // Tab 切换

    switchTab: function(name, item) {
      var scope = document.getElementById('tab-work') || document;
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
          case 'openAssessmentWorkDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showAssessmentWorkList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'editRule':
            WorkModals.showEditRule(String(param || '').replace(/'/g, ''));
            break;
          case 'addDeductionRule':
            WorkModals.showEditRule(null);
            break;
          case 'deleteRule':
            if (confirm('确认删除该扣分规则？')) {
              self.showToast('规则已删除（原型演示）');
            }
            break;
          case 'confirmWorkDeduction':
            WorkModals.showConfirmDeduction(String(param || '').replace(/'/g, ''));
            break;
          case 'excludeWorkDeduction':
            self.showToast('已排除该扣分记录');
            break;
          case 'exportWork':
            self.showToast('导出功能开发中');
            break;
          case 'filterWork':
            self.filterRecords();
            break;
          case 'resetWork':
            var wInputs = document.querySelectorAll('#tab-work-records .filter-field .form-input');
            wInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderRecordsTable();
            break;
          case 'goToAdmonition':
            self.showToast('请前往「绩效评定→公示与奖惩」进行诫勉约谈执行');
            var resultMenu = document.querySelector('[data-id="assessment-result"]');
            if (resultMenu) resultMenu.click();
            break;
          case 'filterWorkByCard':
            self.filterByCard(param);
            break;
        }
      });
    },

    // 渲染扣分规则表（Tab1）
    renderRulesTable: function() {
      var data = WorkData.rules;
      var tbody = document.querySelector('#tab-work-rules .data-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        return '<tr><td>' + (i + 1) + '</td><td><span class="tag ' + r.levelTag + '">' + r.level + '</span></td><td>' + r.situation + '</td><td><strong class="' + r.scoreClass + '">' + r.score + '</strong></td><td>' + r.condition + '</td><td>' + r.method + '</td><td><button class="btn btn-text btn-sm" data-action="openAssessmentWorkDetail" data-param="\'' + r.id + '\'">查看</button><button class="btn btn-text btn-sm" data-action="editRule" data-param="\'' + r.id + '\'">编辑</button><button class="btn btn-text btn-sm" style="color:var(--error)" data-action="deleteRule" data-param="\'' + r.id + '\'">删除</button></td></tr>';
      }).join('');
    },

    // 渲染扣分记录表（Tab2）
    renderRecordsTable: function(filter) {
      var data = WorkData.records;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.unit.indexOf(filter.name) === -1) return false;
          if (filter.period && filter.period !== '全部' && r.period !== filter.period) return false;
          if (filter.category && filter.category !== '全部') {
            if (r.item.indexOf(filter.category) === -1 && r.item.indexOf(filter.category.replace('（逾期）', '')) === -1) return false;
          }
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#tab-work-records .data-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var scoreHtml = r.selfCheck ? '<span class="self-check-deduction" data-tooltip="企业自查发现的隐患不触发绩效考核扣分">' + r.score + '</span>' : '<strong class="' + r.scoreClass + '">' + r.score + '</strong>';
        var statusHtml = r.statusStyle ? '<span class="tag" style="' + r.statusStyle + '">' + r.status + '</span>' : '<span class="tag ' + r.statusTag + '">' + r.status + '</span>';
        var methodHtml = r.selfCheck ? '<span class="tag tag-success">企业自查</span>' : r.method;
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentWorkDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.status === '待确认' && !r.selfCheck) {
          ops += '<button class="btn btn-text btn-sm" data-action="confirmWorkDeduction" data-param="\'' + r.id + '\'">确认</button>';
          ops += '<button class="btn btn-default btn-sm" data-action="excludeWorkDeduction" data-param="' + "'" + r.id + "'" + '">排除</button>';
        }
        // 承包商连带行额外展示"连带"标签
        var itemHtml = r.isContractor ? r.item + ' <span class="tag tag-warning">连带</span>' : r.item;
        return '<tr><td>' + (i + 1) + '</td><td>' + r.unit + '</td><td>' + itemHtml + '</td><td>' + scoreHtml + '</td><td>' + r.source + '</td><td>' + methodHtml + '</td><td>' + statusHtml + '</td><td>' + r.period + '</td><td>' + ops + '</td></tr>';
      }).join('');
      var pgn = document.querySelector('#tab-work-records .pagination');
      if (pgn) pgn.querySelector('span').textContent = '共 ' + data.length + ' 条';
    },

    filterRecords: function() {
      var filterBar = document.querySelector('#tab-work-records .filter-bar');
      if (!filterBar) return;
      var inputs = filterBar.querySelectorAll('.form-input');
      this.renderRecordsTable({
        name: inputs[0] ? inputs[0].value : '',
        period: inputs[1] ? inputs[1].value : '全部',
        category: inputs[2] ? inputs[2].value : '全部',
        status: inputs[3] ? inputs[3].value : '全部'
      });
    },

    filterByCard: function(param) {
      var filterBar = document.querySelector('#tab-work-records .filter-bar');
      if (!filterBar) return;
      var inputs = filterBar.querySelectorAll('.form-input');
      // Reset filters first
      inputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
      if (param === 'worst') {
        var nameInput = inputs[0];
        if (nameInput) nameInput.value = '物流运输公司';
      }
      this.renderRecordsTable({
        name: inputs[0] ? inputs[0].value : '',
        period: inputs[1] ? inputs[1].value : '全部',
        category: inputs[2] ? inputs[2].value : '全部',
        status: inputs[3] ? inputs[3].value : '全部'
      });
    },

    // 渲染诫勉约谈预警
    renderWarningPanel: function() {
      var panel = document.querySelector('.warning-panel');
      if (!panel) return;
      var items = WorkData.warnings.map(function(w) {
        return '<div class="warning-item"><span>' + w.unit + ' - ' + w.desc + '</span><span class="tag ' + w.tagCls + '">' + w.tag + '</span></div>';
      }).join('');
      panel.innerHTML = '<div class="panel-title">诫勉约谈预警</div>' + items;
    },

    // 详情查看
    openDetail: function(id) {
      var d = WorkData.details[id];
      if (!d) {
        d = { title: '记录详情', basic: [['状态', '进行中']], desc: '原型样例数据。', timeline: [{ status: 'done', time: '2026-05-01', event: '登记' }] };
      }
      document.getElementById('asses-detail-title').textContent = d.title;
      document.getElementById('asses-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('asses-detail-desc').textContent = d.desc;
      if (typeof renderApprovalTimeline === 'function') {
        renderApprovalTimeline('asses-detail-timeline', d.timeline);
      }
      setPageView('view-list', 'view-detail', 'detail');
    },

    // Toast 提示
    showToast: function(msg, type) {
      var bg = type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : 'var(--success)';
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 24px;background:' + bg + ';color:#fff;border-radius:var(--radius-md);font-size:var(--font-size-14);z-index:9999;box-shadow:var(--shadow-lg);';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    }
  };

  window.WorkLogic = WorkLogic;

  document.addEventListener('DOMContentLoaded', function() {
    WorkLogic.init();
  });
})();
