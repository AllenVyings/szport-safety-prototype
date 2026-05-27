// personnel-logic.js — 应急人员交互逻辑
(function() {
  'use strict';

  var PersonnelLogic = {
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
            self.showAddPersonModal();
            break;
          case 'showAddCaseModal':
            self.showAddCaseModal_();
            break;
          case 'showAbModal':
            self.showAbConfigModal();
            break;
          case 'savePerson':
            self.savePerson();
            break;
          case 'saveCase':
            self.saveCase();
            break;
          case 'saveAbConfig':
            self.saveAbConfig();
            break;
          case 'filterPersonnel':
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
      var d = PersonnelData.detailData[id];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }
      document.getElementById('personnel-detail-title').textContent = d.title;
      document.getElementById('personnel-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('personnel-detail-desc').textContent = d.desc;
      renderApprovalTimeline('personnel-detail-timeline', d.timeline);
      setPageView('view-list', 'view-detail', 'detail');
    },

    showAddPersonModal: function() {
      var existing = document.getElementById('modal-person-add');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-person-add">' +
        '<div class="modal" style="width:640px;">' +
          '<div class="modal-header"><h3>新增应急人员</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-person-add\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>姓名 <span class="u-text-error">*</span></label><input class="form-input" id="person-name" placeholder="请输入姓名" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>岗位 <span class="u-text-error">*</span></label><input class="form-input" id="person-position" placeholder="请输入岗位" style="width:100%;"></div>' +
              '<div class="form-group u-flex-1"><label>联系方式 <span class="u-text-error">*</span></label><input class="form-input" id="person-phone" placeholder="请输入联系方式" style="width:100%;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>所属单位</label><select class="form-input form-select" id="person-unit" style="width:100%;"><option>深圳港集团</option>' + PersonnelData.units.map(function(u) { return '<option>' + u + '</option>'; }).join('') + '</select></div>' +
              '<div class="form-group u-flex-1"><label>专业资质</label><input class="form-input" id="person-cert" placeholder="如：注册安全工程师" style="width:100%;"></div>' +
            '</div>' +
            '<div class="form-group"><label>备岗人员</label><select class="form-input form-select" id="person-backup" style="width:100%;"><option value="">请选择</option><option>张建国</option><option>李卫东</option><option>王海涛</option><option>赵勇</option></select></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-person-add\'">取消</button><button class="btn btn-primary" data-action="savePerson">保存</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-person-add');
    },

    showAddCaseModal_: function() {
      var existing = document.getElementById('modal-case-add');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-case-add">' +
        '<div class="modal" style="width:600px;">' +
          '<div class="modal-header"><h3>新增应急案例</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-case-add\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>案例标题 <span class="u-text-error">*</span></label><input class="form-input" id="case-title" placeholder="请输入案例名称" style="width:100%;"></div>' +
            '<div style="display:flex;gap:12px;">' +
              '<div class="form-group u-flex-1"><label>事件类型 <span class="u-text-error">*</span></label><select class="form-input form-select" id="case-type" style="width:100%;"><option>危化品泄漏</option><option>火灾</option><option>台风</option><option>人员落水</option><option>其他</option></select></div>' +
              '<div class="form-group u-flex-1"><label>发生时间 <span class="u-text-error">*</span></label><input type="date" class="form-input" id="case-date" style="width:100%;"></div>' +
            '</div>' +
            '<div class="form-group"><label>经验教训总结</label><textarea class="form-input" id="case-summary" style="width:100%;min-height:100px;resize:vertical;" placeholder="请输入案例摘要与经验教训..."></textarea></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-case-add\'">取消</button><button class="btn btn-primary" data-action="saveCase">保存</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-case-add');
    },

    showAbConfigModal: function() {
      var existing = document.getElementById('modal-ab-config');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = '<div class="modal-overlay show" id="modal-ab-config">' +
        '<div class="modal" style="width:520px;">' +
          '<div class="modal-header"><h3>AB角配置</h3><button class="btn btn-text" data-action="hideModal" data-param="\'modal-ab-config\'">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label>主岗人员 <span class="u-text-error">*</span></label><select class="form-input form-select" id="ab-primary" style="width:100%;"><option>张建国</option><option>李卫东</option><option>王海涛</option><option>赵勇</option></select></div>' +
            '<div class="form-group"><label>备岗人员 <span class="u-text-error">*</span></label><select class="form-input form-select" id="ab-backup" style="width:100%;"><option>李卫东</option><option>张建国</option><option>赵勇</option><option>王海涛</option></select></div>' +
            '<div class="form-group"><label>自动切换条件</label><div style="display:flex;gap:16px;margin-top:6px;">' +
              '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:var(--font-size-13);"><input type="checkbox" checked> 主岗离岗自动激活</label>' +
              '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:var(--font-size-13);"><input type="checkbox" checked> 超过阈值升级提醒</label>' +
            '</div></div>' +
            '<div style="padding:8px 12px;background:var(--tag-info-bg);border:1px solid var(--tag-info-border);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--tag-info-color);">&#8505; 配置后主岗离岗时系统将自动通知备岗人员激活</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="\'modal-ab-config\'">取消</button><button class="btn btn-primary" data-action="saveAbConfig">保存配置</button></div>' +
        '</div></div>';
      document.body.appendChild(div.firstElementChild);
      showModal('modal-ab-config');
    },

    savePerson: function() {
      var nameEl = document.getElementById('person-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入姓名', 'error'); return; }
      hideModal('modal-person-add');
      showToast('人员已保存', 'success');
    },

    saveCase: function() {
      var titleEl = document.getElementById('case-title');
      if (!titleEl || !titleEl.value.trim()) { showToast('请输入案例标题', 'error'); return; }
      hideModal('modal-case-add');
      showToast('案例已保存', 'success');
    },

    saveAbConfig: function() {
      hideModal('modal-ab-config');
      showToast('AB角配置已保存', 'success');
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

  window.PersonnelLogic = PersonnelLogic;
  document.addEventListener('DOMContentLoaded', function() { PersonnelLogic.init(); });
})();
