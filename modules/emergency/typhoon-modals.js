// typhoon-modals.js — 防台风应急响应弹窗
(function() {
  'use strict';

  var TyphoonModals = {

    issueWarningModal: function() {
      return '<div class="modal-overlay" id="modal-issue-warning">' +
        '<div class="modal" style="width:480px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>下发预警通知</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-issue-warning\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">预警级别 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><select class="form-input form-select" id="tw-level" style="width:100%">' +
                '<option value="blue">蓝色预警（IV级）</option>' +
                '<option value="yellow">黄色预警（III级）</option>' +
                '<option value="orange" selected>橙色预警（II级）</option>' +
                '<option value="red">红色预警（I级）</option>' +
              '</select></div></div>' +
            '<div class="form-group"><div class="form-label">台风名称 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="tw-name" value="银杏" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">影响范围</div>' +
              '<div class="form-content"><input class="form-input" id="tw-scope" value="深圳港集团全港区" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">预计影响时间</div>' +
              '<div class="form-content"><input class="form-input" type="datetime-local" id="tw-time" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">通知方式</div>' +
              '<div class="form-content" style="padding-top:6px">' +
                '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:16px;font-size:var(--font-size-13);"><input type="checkbox" checked> 企微</label>' +
                '<label style="display:inline-flex;align-items:center;gap:4px;margin-right:16px;font-size:var(--font-size-13);"><input type="checkbox" checked> 短信</label>' +
                '<label style="display:inline-flex;align-items:center;gap:4px;font-size:var(--font-size-13);"><input type="checkbox"> 电话</label>' +
              '</div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-issue-warning\'">取消</button>' +
            '<button class="btn btn-primary" data-action="confirmIssueWarning">确认下发</button>' +
          '</div>' +
        '</div></div>';
    },

    submitReportModal: function() {
      var unitOpts = TyphoonData.units.map(function(u) {
        return '<option>' + u + '</option>';
      }).join('');
      return '<div class="modal-overlay" id="modal-submit-report">' +
        '<div class="modal" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>处置上报</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-submit-report\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">上报单位 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><select class="form-input form-select" id="tw-rpt-unit" style="width:100%">' + unitOpts + '</select></div></div>' +
            '<div class="form-group"><div class="form-label">值班负责人 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><input class="form-input" id="tw-rpt-person" placeholder="请输入值班负责人" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">值班联系方式</div>' +
              '<div class="form-content"><input class="form-input" id="tw-rpt-phone" placeholder="请输入联系方式" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">处置措施 <span style="color:var(--danger)">*</span></div>' +
              '<div class="form-content"><textarea class="form-input" id="tw-rpt-measure" rows="3" placeholder="请描述已采取的防台风处置措施" style="width:100%;resize:vertical"></textarea></div></div>' +
            '<div class="form-group"><div class="form-label">人员伤亡</div>' +
              '<div class="form-content"><input class="form-input" id="tw-rpt-casualty" placeholder="无" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">财产损失（万元）</div>' +
              '<div class="form-content"><input class="form-input" type="number" id="tw-rpt-loss" placeholder="0" style="width:100%"></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-submit-report\'">取消</button>' +
            '<button class="btn btn-primary" data-action="confirmSubmitReport">提交上报</button>' +
          '</div>' +
        '</div></div>';
    },

    editConfigModal: function(level) {
      var cfg = TyphoonData.configLevels.find(function(c) { return c.level === level; });
      if (!cfg) return '';
      return '<div class="modal-overlay" id="modal-edit-config">' +
        '<div class="modal" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>编辑' + cfg.level + '预警（' + cfg.grade + '）措施</h3>' +
            '<button class="modal-close" data-action="hideModal" data-param="\'modal-edit-config\'">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
            '</button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><div class="form-label">响应措施</div>' +
              '<div class="form-content"><textarea class="form-input" id="tw-cfg-measures" rows="5" style="width:100%;resize:vertical">' + cfg.measures + '</textarea></div></div>' +
            '<div class="form-group"><div class="form-label">响应人员数</div>' +
              '<div class="form-content"><input class="form-input" type="number" id="tw-cfg-staff" value="' + cfg.staff + '" style="width:100%"></div></div>' +
            '<div class="form-group"><div class="form-label">自动推送方式</div>' +
              '<div class="form-content"><input class="form-input" id="tw-cfg-push" value="' + cfg.push + '" style="width:100%"></div></div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button class="btn btn-default" data-action="hideModal" data-param="\'modal-edit-config\'">取消</button>' +
            '<button class="btn btn-primary" data-action="saveConfig">保存</button>' +
          '</div>' +
        '</div></div>';
    }
  };

  window.TyphoonModals = TyphoonModals;
})();
