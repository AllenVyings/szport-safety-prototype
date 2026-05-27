// control-modals.js — 控制指标（否决项） 弹窗逻辑
(function() {
  'use strict';

  var ControlModals = {

    // 阈值配置 — 只读展示（数据源配置已迁移至考核计划→指标下达流程）
    showThresholdConfig: function() {
      var data = ControlData.thresholds;
      var rows = data.map(function(r) {
        return '<tr><td><span class="level-tag ' + r.levelCls + '">' + r.level + '</span></td>' +
          '<td>' + r.fireLoss + '</td>' +
          '<td>' + r.accidentCount + '</td></tr>';
      }).join('');
      var html = '<div class="modal-overlay show" id="modal-threshold-config">' +
        '<div class="modal-box" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>差异化阈值配置（火灾事故）</h3><button class="modal-close" data-action="hideModal" data-param="modal-threshold-config"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);margin-bottom:12px;">配置来源：考核计划→指标下达（年度内不可变更）</div>' +
            '<div class="table-wrap"><table class="data-table"><thead><tr><th>管控级别</th><th>火灾事故损失阈值（万元）</th><th>其他事故数阈值</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-threshold-config">关闭</button></div>' +
        '</div></div>';
      ControlModals._appendModal(html);
    },

    goToWorkPage: function() {
      // 原型中模拟菜单跳转
      var workMenu = document.querySelector('[data-id="assessment-work"]');
      if (workMenu) workMenu.click();
      else ControlLogic.showToast('请前往「扣分管理」页面进行连带确认操作');
    },

    // 工具方法
    close: function(id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    },
    _appendModal: function(html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper.firstElementChild);
    }
  };

  window.ControlModals = ControlModals;
})();
