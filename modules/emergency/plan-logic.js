// plan-logic.js — 应急预案交互逻辑
(function() {
  'use strict';

  var PlanLogic = {
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
          case 'openDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'showAddModal':
            self.showAddPlanModal();
            break;
          case 'savePlan':
            self.savePlan();
            break;
          case 'filterPlan':
            self.filterTable();
            break;
          case 'resetFilter':
            self.resetFilter();
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
            break;
          case 'hideModal':
            if (param) { var mid = String(param).replace(/'/g, ''); hideModal(mid); }
            break;
        }
      });
    },

    openDetail: function(id) {
      var d = PlanData.detailData[id];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }
      document.getElementById('plan-detail-title').textContent = d.title;
      document.getElementById('plan-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('plan-detail-desc').textContent = d.desc;
      renderApprovalTimeline('plan-detail-timeline', d.timeline);
      setPageView('view-list', 'view-detail', 'detail');
    },

    showAddPlanModal: function() {
      var existing = document.getElementById('modal-plan-add');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-plan-add">' +
        '<div class="modal" style="width:680px;">' +
          '<div class="modal-header"><h3>新增应急预案</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-plan-add\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>预案名称 <span class="u-text-error">*</span></label><input class="form-input" id="plan-name" placeholder="请输入预案名称" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>预案类型 <span class="u-text-error">*</span></label><select class="form-input form-select" id="plan-type" style="width:100%;"><option>综合预案</option><option>专项预案</option><option>现场处置方案</option></select></div>' +
              '<div class="form-group u-flex-1"><label>版本</label><input class="form-input" id="plan-version" placeholder="如：V1.0" style="width:100%;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>备案日期</label><input type="date" class="form-input" id="plan-filing" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>到期日期</label><input type="date" class="form-input" id="plan-expiry" style="width:100%;"></div>' +
            '</div>' +
            '<div class="form-group"><label>预案内容摘要 <span class="u-text-error">*</span></label><textarea class="form-input" id="plan-desc" style="width:100%;min-height:100px;resize:vertical;" placeholder="请输入预案内容摘要..."></textarea></div>' +
            '<div class="form-group"><label>关联应急资源</label><select class="form-input form-select" style="width:100%;" multiple size="4"><option>防毒面具（30件）</option><option>空气呼吸器（15件）</option><option>急救箱（8个）</option><option>对讲机（20台）</option><option>液压剪（5把）</option><option>救生绳（12条）</option></select></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-plan-add\'">取消</button><button class="btn btn-primary" data-action="savePlan">保存</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-plan-add');
    },

    savePlan: function() {
      var nameEl = document.getElementById('plan-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入预案名称', 'error'); return; }
      hideModal('modal-plan-add');
      showToast('预案已保存', 'success');
    },

    filterTable: function() {
      var container = document.getElementById('view-list');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-bar .filter-field .form-input');
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

    resetFilter: function() {
      var container = document.getElementById('view-list');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-bar .filter-field .form-input');
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    }
  };

  window.PlanLogic = PlanLogic;
  document.addEventListener('DOMContentLoaded', function() { PlanLogic.init(); });
})();
