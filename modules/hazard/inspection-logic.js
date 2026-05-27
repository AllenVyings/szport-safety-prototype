// inspection-logic.js — 安全检查 交互逻辑
(function() {
  'use strict';

  var InspectionLogic = {

    init: function() {
      this.bindActions();
    },

    bindActions: function() {
      var self = this;
      // Change delegation for select elements
      document.addEventListener('change', function(e) {
        var el = e.target;
        var action = el.getAttribute('data-action');
        if (!action) return;
        if (action === 'onTemplateChange') {
          self.onTemplateChange();
        }
      });

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'switchTab':
            var tabName = String(param || '').replace(/'/g, '');
            self.switchTab(tabName, btn);
            break;
          case 'openInspectionDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showInspectionList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'showAddPlanModal':
            showModal('modal-plan-add');
            break;
          case 'filterPlans':
            self.filterPlans();
            break;
          case 'resetPlanFilter':
            self.resetPlanFilter();
            break;
          case 'filterTasks':
            self.filterTasks();
            break;
          case 'resetTaskFilter':
            self.resetTaskFilter();
            break;
          case 'submitTask':
            hideModal('modal-execute');
            showToast('检查结果已提交', 'success');
            break;
          case 'submitHazard':
            hideModal('modal-hazard');
            showToast('隐患已录入，自动进入整改治理流程', 'success');
            break;
          case 'savePlanDraft':
            hideModal('modal-plan-add');
            showToast('草稿已保存', 'success');
            break;
          case 'submitPlan':
            hideModal('modal-plan-add');
            showToast('检查计划已提交审批', 'success');
            break;
          case 'onTemplateChange':
            self.onTemplateChange();
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
            break;
          case 'hideModal':
            var modalId = String(param || '').replace(/'/g, '');
            hideModal(modalId);
            break;
        }
      });
    },

    // ---------- 详情查看 ----------

    openDetail: function(id) {
      var d = InspectionData.detailData[id];
      if (!d) return;
      document.getElementById('insp-detail-title').textContent = d.name;
      document.getElementById('insp-timeline-title').textContent = d.kind === '检查任务' ? '办理进度' : '审批进度';
      var basic = '';
      basic += '<div class="detail-row"><span class="label">类型</span><span class="value">' + d.kind + '</span></div>';
      if (d.plan) basic += '<div class="detail-row"><span class="label">所属计划</span><span class="value">' + d.plan + '</span></div>';
      basic += '<div class="detail-row"><span class="label">检查类型</span><span class="value">' + d.type + '</span></div>';
      if (d.scope) basic += '<div class="detail-row"><span class="label">检查范围</span><span class="value">' + d.scope + '</span></div>';
      if (d.executor) basic += '<div class="detail-row"><span class="label">执行人</span><span class="value">' + d.executor + '</span></div>';
      if (d.date) basic += '<div class="detail-row"><span class="label">' + (d.kind === '检查任务' ? '截止日期' : '计划日期') + '</span><span class="value">' + d.date + '</span></div>';
      if (d.hazards) basic += '<div class="detail-row"><span class="label">发现隐患</span><span class="value">' + d.hazards + '</span></div>';
      basic += '<div class="detail-row"><span class="label">状态</span><span class="value"><span class="tag ' + d.statusClass + '">' + d.status + '</span></span></div>';
      document.getElementById('insp-detail-basic').innerHTML = basic;
      document.getElementById('insp-detail-desc').textContent = d.desc;
      var timelineEl = document.getElementById('insp-detail-timeline');
      var emptyEl = document.getElementById('insp-detail-timeline-empty');
      if (!d.approval || d.approval.length === 0) {
        timelineEl.innerHTML = '';
        timelineEl.style.display = 'none';
        emptyEl.style.display = 'block';
      } else {
        timelineEl.innerHTML = this.renderTimeline(d.approval);
        timelineEl.style.display = 'block';
        emptyEl.style.display = 'none';
      }
      setPageView('view-list', 'view-detail', 'detail');
    },

    renderTimeline: function(approval) {
      var html = '';
      for (var i = 0; i < approval.length; i++) {
        var node = approval[i];
        var cls = node.status === 'passed' ? 'done' : (node.status === 'current' ? 'active' : '');
        var event = node.name;
        if (node.status === 'passed') event += ' — 已完成';
        else if (node.status === 'current') event += ' — 进行中';
        else event += ' — 待处理';
        var time = node.time || '—';
        html += '<div class="timeline-item ' + cls + '"><div class="time">' + time + '</div><div class="event">' + event + '</div></div>';
      }
      return html;
    },

    // ---------- Tab 切换 ----------

    switchTab: function(name, clickedTab) {
      document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var tabEl = document.getElementById('tab-' + name);
      if (tabEl) tabEl.classList.add('active');
    },

    // ---------- 筛选：检查计划 ----------

    filterPlans: function() {
      var container = document.getElementById('tab-plans');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      var keyword = inputs[0] ? inputs[0].value.trim().toLowerCase() : '';
      var typeVal = inputs[1] ? inputs[1].value : '全部';
      var statusVal = inputs[2] ? inputs[2].value : '全部';
      var rows = container.querySelectorAll('.data-table tbody tr');
      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll('td');
        var match = true;
        if (keyword && cells[1] && cells[1].textContent.toLowerCase().indexOf(keyword) === -1) match = false;
        if (typeVal !== '全部' && cells[2] && cells[2].textContent.trim() !== typeVal) match = false;
        if (statusVal !== '全部' && cells[5] && cells[5].textContent.trim() !== statusVal) match = false;
        rows[i].style.display = match ? '' : 'none';
      }
    },

    resetPlanFilter: function() {
      var container = document.getElementById('tab-plans');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].tagName === 'SELECT') {
          inputs[i].selectedIndex = 0;
        } else {
          inputs[i].value = '';
        }
      }
      var rows = container.querySelectorAll('.data-table tbody tr');
      for (var j = 0; j < rows.length; j++) {
        rows[j].style.display = '';
      }
    },

    // ---------- 筛选：检查任务 ----------

    filterTasks: function() {
      var container = document.getElementById('tab-tasks');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      var keyword = inputs[0] ? inputs[0].value.trim().toLowerCase() : '';
      var statusVal = inputs[1] ? inputs[1].value : '全部';
      var rows = container.querySelectorAll('.data-table tbody tr');
      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].querySelectorAll('td');
        var match = true;
        if (keyword && cells[3] && cells[3].textContent.toLowerCase().indexOf(keyword) === -1) match = false;
        if (statusVal !== '全部' && cells[7] && cells[7].textContent.trim() !== statusVal) match = false;
        rows[i].style.display = match ? '' : 'none';
      }
    },

    resetTaskFilter: function() {
      var container = document.getElementById('tab-tasks');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].tagName === 'SELECT') {
          inputs[i].selectedIndex = 0;
        } else {
          inputs[i].value = '';
        }
      }
      var rows = container.querySelectorAll('.data-table tbody tr');
      for (var j = 0; j < rows.length; j++) {
        rows[j].style.display = '';
      }
    },

    // ---------- 模板切换 ----------

    onTemplateChange: function() {
      var select = document.getElementById('templateSelect');
      var area = document.getElementById('customTemplateArea');
      if (!select || !area) return;
      area.style.display = (select.value === 'custom') ? 'block' : 'none';
    }
  };

  window.InspectionLogic = InspectionLogic;

  document.addEventListener('DOMContentLoaded', function() {
    InspectionLogic.init();
  });
})();
