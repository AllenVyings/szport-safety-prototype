// resource-logic.js — 应急资源交互逻辑
(function() {
  'use strict';

  var ResourceLogic = {
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
            self.showAddResourceModal();
            break;
          case 'showOutboundModal':
            self.showOutboundModal();
            break;
          case 'showTransferModal':
            self.showTransferModal_();
            break;
          case 'saveResource':
            self.saveResource();
            break;
          case 'saveOutbound':
            self.saveOutbound();
            break;
          case 'saveTransfer':
            self.saveTransfer();
            break;
          case 'filterResource':
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
      var d = ResourceData.detailData[id];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }
      document.getElementById('resource-detail-title').textContent = d.title;
      document.getElementById('resource-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('resource-detail-desc').textContent = d.desc;
      renderApprovalTimeline('resource-detail-timeline', d.timeline);
      setPageView('view-list', 'view-detail', 'detail');
    },

    showAddResourceModal: function() {
      var existing = document.getElementById('modal-resource-add');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-resource-add">' +
        '<div class="modal" style="width:640px;">' +
          '<div class="modal-header"><h3>新增应急物资</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-resource-add\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>物资名称 <span class="u-text-error">*</span></label><input class="form-input" id="res-name" placeholder="请输入物资名称" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>物资类别 <span class="u-text-error">*</span></label><select class="form-input form-select" id="res-category" style="width:100%;"><option>防护装备类</option><option>救援工具类</option><option>通讯设备类</option><option>医疗急救类</option></select></div>' +
              '<div class="form-group u-flex-1"><label>存放地点 <span class="u-text-error">*</span></label><select class="form-input form-select" id="res-location" style="width:100%;"><option>1号应急物资库</option><option>2号应急物资库</option><option>3号应急物资库</option><option>码头值班室</option></select></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>数量 <span class="u-text-error">*</span></label><input type="number" class="form-input" id="res-qty" placeholder="请输入数量" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>最低保有量 <span class="u-text-error">*</span></label><input type="number" class="form-input" id="res-min" placeholder="最低保有量" style="width:100%;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>有效期</label><input type="date" class="form-input" id="res-expiry" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>责任人 <span class="u-text-error">*</span></label><input class="form-input" id="res-person" placeholder="请输入责任人" style="width:100%;"></div>' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-resource-add\'">取消</button><button class="btn btn-primary" data-action="saveResource">保存</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-resource-add');
    },

    showOutboundModal: function() {
      var existing = document.getElementById('modal-outbound');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-outbound">' +
        '<div class="modal" style="width:520px;">' +
          '<div class="modal-header"><h3>物资出库</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-outbound\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>物资名称</label><input class="form-input" id="ob-name" placeholder="物资名称" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>出库数量 <span class="u-text-error">*</span></label><input type="number" class="form-input" id="ob-qty" placeholder="数量" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>使用单位 <span class="u-text-error">*</span></label><select class="form-input form-select" id="ob-unit" style="width:100%;"><option>集装箱码头公司</option><option>危化品储运公司</option><option>物流运输公司</option></select></div>' +
            '</div>' +
            '<div class="form-group"><label>用途说明</label><textarea class="form-input" id="ob-purpose" style="width:100%;min-height:80px;resize:vertical;" placeholder="请输入出库用途..."></textarea></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-outbound\'">取消</button><button class="btn btn-primary" data-action="saveOutbound">确认出库</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-outbound');
    },

    showTransferModal_: function() {
      var existing = document.getElementById('modal-transfer');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-transfer">' +
        '<div class="modal" style="width:560px;">' +
          '<div class="modal-header"><h3>发起物资调拨</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-transfer\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>物资名称 <span class="u-text-error">*</span></label><input class="form-input" id="tf-name" placeholder="如：空气呼吸器" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>调拨数量 <span class="u-text-error">*</span></label><input type="number" class="form-input" id="tf-qty" placeholder="数量" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>调出单位 <span class="u-text-error">*</span></label><select class="form-input form-select" id="tf-from" style="width:100%;"><option>集团应急库</option><option>集装箱码头公司</option><option>油品码头公司</option></select></div>' +
            '</div>' +
            '<div class="form-group"><label>调入单位 <span class="u-text-error">*</span></label><select class="form-input form-select" id="tf-to" style="width:100%;"><option>集装箱码头公司</option><option>散货码头公司</option><option>物流运输公司</option><option>物业管理公司</option></select></div>' +
            '<div class="form-group"><label>调拨原因</label><textarea class="form-input" id="tf-reason" style="width:100%;min-height:80px;resize:vertical;" placeholder="请输入调拨原因..."></textarea></div>' +
            '<div style="padding:8px 12px;background:var(--tag-info-bg);border:1px solid var(--tag-info-border);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--tag-info-color);">&#8505; 调拨申请提交后将进入审批流程，审批通过后自动生成调拨出库单</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-transfer\'">取消</button><button class="btn btn-primary" data-action="saveTransfer">提交调拨</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-transfer');
    },

    saveResource: function() {
      var nameEl = document.getElementById('res-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入物资名称', 'error'); return; }
      hideModal('modal-resource-add');
      showToast('物资已保存', 'success');
    },

    saveOutbound: function() {
      var qtyEl = document.getElementById('ob-qty');
      if (!qtyEl || !qtyEl.value) { showToast('请输入出库数量', 'error'); return; }
      hideModal('modal-outbound');
      showToast('出库单已生成', 'success');
    },

    saveTransfer: function() {
      var nameEl = document.getElementById('tf-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入物资名称', 'error'); return; }
      hideModal('modal-transfer');
      showToast('调拨申请已提交', 'success');
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

  window.ResourceLogic = ResourceLogic;
  document.addEventListener('DOMContentLoaded', function() { ResourceLogic.init(); });
})();
