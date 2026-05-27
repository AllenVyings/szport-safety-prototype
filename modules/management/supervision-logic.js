// supervision-logic.js — 工作督办交互逻辑
(function() {
  'use strict';

  var SupervisionLogic = {

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
          case 'openSupervisionDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showSupervisionList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'showAddTaskModal':
            self.showModal('modal-add-task');
            break;
          case 'showFeedbackModal':
            self.showModal('modal-feedback');
            break;
          case 'showUrgeModal':
            self.showModal('modal-urge');
            break;
          case 'saveTask':
            self.saveTask();
            break;
          case 'saveFeedback':
            self.saveFeedback();
            break;
          case 'saveUrge':
            self.saveUrge();
            break;
          case 'acceptTask':
            showToast('已接收督办任务', 'success');
            break;
          case 'confirmTask':
            showConfirm('确认该督办任务闭环？', function() { showToast('已确认闭环', 'success'); });
            break;
          case 'escalateTask':
            showConfirm('确定升级该督办至上级？', function() { showToast('已升级至上级', 'success'); });
            break;
          case 'filterTasks':
            self.filterTasks();
            break;
          case 'resetTaskFilter':
            self.resetTaskFilter();
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
            break;
          case 'hideModal':
            if (param) {
              var mid = String(param).replace(/'/g, '');
              hideModal(mid);
            }
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
      var d = SupervisionData.detailData[id];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }
      document.getElementById('supervision-detail-title').textContent = d.title;
      document.getElementById('supervision-detail-basic').innerHTML = d.basic.map(function(r) {
        return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
      }).join('');
      document.getElementById('supervision-detail-desc').textContent = d.desc;
      renderApprovalTimeline('supervision-detail-timeline', d.timeline);
      setPageView('view-list', 'view-detail', 'detail');
    },

    showModal: function(id) {
      var existing = document.getElementById(id);
      if (existing) existing.remove();
      var div = document.createElement('div');
      if (id === 'modal-add-task') {
        div.innerHTML = '<div class="modal-overlay" id="modal-add-task">' +
          '<div class="modal" style="width:640px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
            '<div class="modal-header"><h3>新增督办任务</h3>' +
              '<button class="modal-close" data-action="hideModal" data-param="\'modal-add-task\'">' +
                '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
            '<div class="modal-body">' +
              '<div class="form-group"><div class="form-label">督办主题 <span style="color:var(--danger)">*</span></div>' +
                '<div class="form-content"><input class="form-input" id="sup-topic" placeholder="请输入督办主题" style="width:100%"></div></div>' +
              '<div style="display:flex;gap:12px;">' +
                '<div class="form-group" style="flex:1;"><div class="form-label">督办对象 <span style="color:var(--danger)">*</span></div>' +
                  '<div class="form-content"><select class="form-input form-select" id="sup-target" style="width:100%">' +
                    '<option value="">请选择</option>' + SupervisionData.units.map(function(u) { return '<option>' + u + '</option>'; }).join('') + '</select></div></div>' +
                '<div class="form-group" style="flex:1;"><div class="form-label">优先级 <span style="color:var(--danger)">*</span></div>' +
                  '<div class="form-content"><select class="form-input form-select" id="sup-priority" style="width:100%">' +
                    '<option value="">请选择</option><option>紧急</option><option>重要</option><option>一般</option></select></div></div></div>' +
              '<div class="form-group"><div class="form-label">截止日期 <span style="color:var(--danger)">*</span></div>' +
                '<div class="form-content"><input class="form-input" id="sup-deadline" type="date" style="width:100%"></div></div>' +
              '<div class="form-group"><div class="form-label">督办内容 <span style="color:var(--danger)">*</span></div>' +
                '<div class="form-content"><textarea class="form-input" id="sup-content" rows="4" placeholder="请输入督办内容..." style="width:100%;resize:vertical"></textarea></div></div>' +
              '<div style="padding:8px 12px;background:var(--tag-warning-bg);border:1px solid var(--tag-warning-border);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--tag-warning-color);">' +
                '&#9888; 督办任务派发后，到期前3天/1天自动提醒责任人；逾期1天自动催办（短信/企微）；逾期7天升级至上级；上级任务逾期1天升级至集团</div>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-add-task\'">取消</button>' +
              '<button class="btn btn-primary" data-action="saveTask">派发督办</button></div>' +
          '</div></div>';
      } else if (id === 'modal-feedback') {
        div.innerHTML = '<div class="modal-overlay" id="modal-feedback">' +
          '<div class="modal" style="width:600px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
            '<div class="modal-header"><h3>提交执行反馈</h3>' +
              '<button class="modal-close" data-action="hideModal" data-param="\'modal-feedback\'">' +
                '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
            '<div class="modal-body">' +
              '<div class="form-group"><div class="form-label">执行情况说明 <span style="color:var(--danger)">*</span></div>' +
                '<div class="form-content"><textarea class="form-input" id="fb-desc" rows="5" placeholder="请详细描述执行情况..." style="width:100%;resize:vertical"></textarea></div></div>' +
              '<div class="form-group"><div class="form-label">佐证材料</div>' +
                '<div class="form-content"><div class="upload-area">点击或拖拽上传佐证材料（图片/文档）<div style="font-size:var(--font-size-11);margin-top:4px;">支持 JPG、PNG、PDF 格式</div></div></div></div>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-feedback\'">取消</button>' +
              '<button class="btn btn-primary" data-action="saveFeedback">提交反馈</button></div>' +
          '</div></div>';
      } else if (id === 'modal-urge') {
        div.innerHTML = '<div class="modal-overlay" id="modal-urge">' +
          '<div class="modal" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
            '<div class="modal-header"><h3>催办</h3>' +
              '<button class="modal-close" data-action="hideModal" data-param="\'modal-urge\'">' +
                '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
            '<div class="modal-body">' +
              '<div style="padding:8px 12px;background:var(--tag-warning-bg);border:1px solid var(--tag-warning-border);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--tag-warning-color);margin-bottom:16px;">&#9888; 催办将同时通过所选方式通知责任人</div>' +
              '<div class="form-group"><div class="form-label">催办方式 <span style="color:var(--danger)">*</span></div>' +
                '<div class="form-content" style="display:flex;gap:16px;margin-top:6px;">' +
                  '<label style="display:flex;align-items:center;gap:6px;font-size:var(--font-size-13);cursor:pointer;"><input type="radio" name="urgeMethod" value="sms" checked> 短信</label>' +
                  '<label style="display:flex;align-items:center;gap:6px;font-size:var(--font-size-13);cursor:pointer;"><input type="radio" name="urgeMethod" value="wechat"> 企业微信</label>' +
                  '<label style="display:flex;align-items:center;gap:6px;font-size:var(--font-size-13);cursor:pointer;"><input type="radio" name="urgeMethod" value="all"> 全部</label></div></div>' +
              '<div class="form-group"><div class="form-label">催办说明</div>' +
                '<div class="form-content"><textarea class="form-input" id="urge-note" rows="4" placeholder="请输入催办说明（选填，不填则发送默认催办提醒）..." style="width:100%;resize:vertical"></textarea></div></div>' +
              '<div style="padding:8px 12px;background:var(--tag-info-bg);border:1px solid var(--tag-info-border);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--tag-info-color);">' +
                '&#128279; 系统已自动在逾期1天时发送催办，此次为手动追加催办</div>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-urge\'">取消</button>' +
              '<button class="btn btn-primary" data-action="saveUrge">确认催办</button></div>' +
          '</div></div>';
      }
      document.body.appendChild(div.firstElementChild);
      showModal(id);
    },

    saveTask: function() {
      var topicEl = document.getElementById('sup-topic');
      if (!topicEl || !topicEl.value.trim()) { showToast('请输入督办主题', 'error'); return; }
      hideModal('modal-add-task');
      showToast('督办任务已派发', 'success');
    },

    saveFeedback: function() {
      var descEl = document.getElementById('fb-desc');
      if (!descEl || !descEl.value.trim()) { showToast('请输入执行情况说明', 'error'); return; }
      hideModal('modal-feedback');
      showToast('反馈已提交', 'success');
    },

    saveUrge: function() {
      hideModal('modal-urge');
      showToast('催办通知已发送', 'success');
    },

    filterTasks: function() {
      var container = document.getElementById('tab-tasks');
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

    resetTaskFilter: function() {
      var container = document.getElementById('tab-tasks');
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

  window.SupervisionLogic = SupervisionLogic;

  document.addEventListener('DOMContentLoaded', function() {
    SupervisionLogic.init();
  });
})();
