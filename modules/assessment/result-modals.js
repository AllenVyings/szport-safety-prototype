// result-modals.js — 绩效评定与执行 弹窗逻辑
(function() {
  'use strict';

  var ResultModals = {

    // ============================================================
    // Tab1 考核计划 — 指标配置弹窗
    // ============================================================

    showIndicatorConfig: function(type) {
      var title, configs;
      if (type === 'veto') {
        title = '否决指标配置';
        configs = ResultData.vetoConfigs;
      } else if (type === 'deduction') {
        title = '扣分指标配置';
        configs = ResultData.deductionConfigs;
      } else {
        title = '加分指标配置';
        configs = ResultData.bonusConfigs;
      }

      var tableHtml = '<table class="data-table" style="width:100%;font-size:12px;"><thead><tr>' +
        '<th style="width:30px;">序号</th>' +
        '<th>指标名称</th>' +
        '<th>来源模块</th>' +
        '<th>取数条件</th>' +
        (type === 'veto' ? '' : '<th>分值</th>') +
        '<th>触发规则</th>' +
        '</tr></thead><tbody>';

      configs.forEach(function(c, i) {
        tableHtml += '<tr><td>' + (i + 1) + '</td>' +
          '<td>' + c.name + '</td>' +
          '<td>' + (c.sourceModule || c.source) + '</td>' +
          '<td>' + c.condition + '</td>' +
          (type === 'veto' ? '' : '<td>' + (c.score || '—') + '</td>') +
          (function(){ var t = c.triggerRule || c.trigger; var cls = t === '自动触发' ? 'tag-success' : t === '连带触发' ? 'tag-warning' : 'tag-info'; return '<td><span class="tag ' + cls + '">' + t + '</span></td></tr>'; })();
      });
      tableHtml += '</tbody></table>';

      var countLabel = type === 'veto' ? '共12项' : type === 'deduction' ? '共7项' : '共8项（3自动+5人工）';

      var html = '<div class="modal-overlay show" id="modal-indicator-config">' +
        '<div class="modal-box" style="width:820px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-indicator-config"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
              '<span style="font-size:13px;color:var(--text-secondary);">' + countLabel + '</span>' +
              '<button class="btn btn-primary btn-sm" data-action="showIndicatorConfigForm" data-param="' + type + '">新增配置</button>' +
            '</div>' +
            '<div style="max-height:400px;overflow-y:auto;">' + tableHtml + '</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-indicator-config">关闭</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // 指标配置新增表单弹窗
    showIndicatorConfigForm: function(type) {
      var title = type === 'veto' ? '新增否决指标配置' : type === 'deduction' ? '新增扣分指标配置' : '新增加分指标配置';
      var indicatorOptions = type === 'veto' ?
        '<option>较大及以上生产安全责任事故</option><option>重大火灾事故</option><option>危化品重大泄漏事故</option><option>其他</option>' :
        type === 'deduction' ?
        '<option>一般生产安全责任事故</option><option>一般火灾事故</option><option>重大隐患未按期整改</option><option>其他</option>' :
        '<option>安全标准化评级提升</option><option>隐患排查数量超目标</option><option>安全创新成果</option><option>其他</option>';

      var html = '<div class="modal-overlay show" id="modal-indicator-config-form">' +
        '<div class="modal-box" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + title + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-indicator-config-form"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">指标名称<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="mic-name"><option value="">请选择</option>' + indicatorOptions + '</select></div></div>' +
            '<div class="form-group"><label class="form-label">来源模块<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="mic-source"><option value="">请选择</option><option>事故管理</option><option>隐患排查</option><option>危险源管理</option><option>培训管理</option><option>监督检查</option><option>应急管理</option><option>证照管理</option><option>人工申请</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">取数条件<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" id="mic-condition" placeholder="请输入取数条件表达式"></div></div>' +
            '<div class="form-group"><label class="form-label">触发规则<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="mic-trigger"><option value="">请选择</option><option>自动触发</option><option>连带触发</option><option>人工申请</option></select></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-indicator-config-form">取消</button><button class="btn btn-primary" data-action="confirmIndicatorConfig">确定</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab2 考核执行 — 提交评定确认弹窗
    // ============================================================

    showSubmitRating: function(unitId) {
      var data = ResultData.executionCycles.find(function(r) { return r.id === unitId; });
      if (!data) return;
      var previewGrade = data.scorePreview >= 90 ? '优秀达标' : data.scorePreview >= 80 ? '达标' : '不达标';
      var previewGradeCls = data.scorePreview >= 90 ? 'grade-tag-excellent' : data.scorePreview >= 80 ? 'grade-tag-qualified' : 'grade-tag-unqualified';
      var isVetoTriggered = data.vetoStatus === '已触发' || data.vetoStatus === '已触发(连带否决)';
      if (isVetoTriggered) {
        previewGrade = '不达标（否决项触发）';
        previewGradeCls = 'grade-tag-unqualified';
      }

      var html = '<div class="modal-overlay show" id="modal-submit-rating">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>提交评定</h3><button class="modal-close" data-action="hideModal" data-param="modal-submit-rating"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div style="margin-bottom:16px;">' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">考核单位</span><span>' + data.unit + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">否决状态</span><span class="tag ' + (data.vetoStatus === '已触发' ? 'tag-error' : data.vetoStatus === '已触发(连带否决)' ? 'veto-linked' : data.vetoStatus === '待确认连带' ? 'tag-warning' : 'tag-success') + '">' + data.vetoStatus + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">扣分合计</span><span>' + data.deductions + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">加分合计</span><span>' + data.bonus + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">得分预览</span><span style="font-weight:bold;font-size:16px;color:var(--primary);">' + data.scorePreview + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">预判等级</span><span class="grade-tag ' + previewGradeCls + '">' + previewGrade + '</span></div>' +
            '</div>' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:12px;color:var(--primary);">确认提交后将进入结果评定环节，按管控级别分组排名并提交集团领导审批。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-submit-rating">取消</button><button class="btn btn-primary" data-action="confirmSubmitRating" data-param="' + unitId + '">确认提交</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab2 考核执行 — 单位考核卡侧面板
    // ============================================================

    showUnitCardPanel: function(unitId) {
      var data = ResultData.executionCycles.find(function(r) { return r.id === unitId; });
      if (!data) return;
      var previewGrade = data.scorePreview >= 90 ? '优秀达标' : data.scorePreview >= 80 ? '达标' : '不达标';
      var previewGradeCls = data.scorePreview >= 90 ? 'grade-tag-excellent' : data.scorePreview >= 80 ? 'grade-tag-qualified' : 'grade-tag-unqualified';
      var isVetoTriggered2 = data.vetoStatus === '已触发' || data.vetoStatus === '已触发(连带否决)';
      if (isVetoTriggered2) {
        previewGrade = '不达标（否决项触发）';
        previewGradeCls = 'grade-tag-unqualified';
      }

      var vetoItems = ResultData.indicatorCards.filter(function(c) { return c.status !== '正常'; });
      var vetoHtml = vetoItems.length > 0 ?
        vetoItems.map(function(c) {
          return '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;"><span>' + c.name + '</span><span class="tag ' + (c.status === '已触发' ? 'tag-error' : c.status === '已触发(连带否决)' ? 'veto-linked' : 'tag-warning') + '">' + c.status + '</span></div>';
        }).join('') :
        '<div style="color:var(--success);font-size:12px;">全部正常</div>';

      var html = '<div class="modal-overlay show" id="modal-unit-card" style="justify-content:flex-end;">' +
        '<div class="modal-box" style="width:420px;height:100vh;border-radius:0;overflow-y:auto;background:var(--bg-card);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + data.unit + ' 考核卡</h3><button class="modal-close" data-action="hideModal" data-param="modal-unit-card"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div style="text-align:center;padding:20px 0;border-bottom:1px solid var(--border-color);">' +
              '<div style="font-size:36px;font-weight:bold;color:var(--primary);">' + data.scorePreview + '</div>' +
              '<div style="margin-top:4px;"><span class="grade-tag ' + previewGradeCls + '">' + previewGrade + '</span></div>' +
              '<div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">得分预览 / 预判等级</div>' +
            '</div>' +
            '<div style="padding:16px 0;border-bottom:1px solid var(--border-color);">' +
              '<h4 style="font-size:14px;margin-bottom:8px;">否决状态</h4>' +
              vetoHtml +
            '</div>' +
            '<div style="padding:16px 0;border-bottom:1px solid var(--border-color);">' +
              '<h4 style="font-size:14px;margin-bottom:8px;">扣分明细</h4>' +
              '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;"><span>一般安全事故</span><span style="color:var(--error);">-8分</span></div>' +
              '<div style="font-weight:bold;text-align:right;padding-top:4px;font-size:13px;">合计：<span style="color:var(--error);">' + data.deductions + '</span></div>' +
            '</div>' +
            '<div style="padding:16px 0;border-bottom:1px solid var(--border-color);">' +
              '<h4 style="font-size:14px;margin-bottom:8px;">加分明细</h4>' +
              '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;"><span>安全标准化评级提升</span><span style="color:var(--success);">+3分</span></div>' +
              '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:12px;"><span>隐患排查超目标</span><span style="color:var(--success);">+2分</span></div>' +
              '<div style="font-weight:bold;text-align:right;padding-top:4px;font-size:13px;">合计：<span style="color:var(--success);">' + data.bonus + '</span></div>' +
            '</div>' +
            '<div style="padding:16px 0;">' +
              '<h4 style="font-size:14px;margin-bottom:8px;">计算公式</h4>' +
              '<div style="padding:8px 12px;background:var(--bg-page);border-radius:var(--radius-sm);font-size:12px;color:var(--text-secondary);">K = 100 - &Sigma;K<sub>i</sub> + K<sub>j</sub> = 100 + (' + data.deductions + ') + (' + data.bonus + ') = ' + data.scorePreview + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-unit-card">关闭</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 整改验证弹窗
    // ============================================================

    showVerifyRectification: function(id) {
      var row = ResultData.rectifications.find(function(r) { return r.id === id; });
      if (!row) return;
      var html = '<div class="modal-overlay show" id="modal-verify-rectification">' +
        '<div class="modal-box" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>整改验证</h3><button class="modal-close" data-action="hideModal" data-param="modal-verify-rectification"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">整改单位</label><div class="form-content"><input class="form-input" value="' + row.unit + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">触发原因</label><div class="form-content"><input class="form-input" value="' + row.reason + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">截止日期</label><div class="form-content"><input class="form-input" value="' + row.deadline + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">验证意见<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="vr-opinion" rows="4" placeholder="请输入验证意见" style="resize:vertical;"></textarea></div></div>' +
            '<div class="form-group"><label class="form-label">验证结果<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="vr-result"><option value="">请选择</option><option value="pass">验证通过</option><option value="fail">验证不通过</option></select></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-verify-rectification">取消</button><button class="btn btn-primary" data-action="confirmVerifyRectification" data-param="' + id + '">确认验证</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab3 结果评定 — 发起评定弹窗
    // ============================================================

    showInitAssessment: function() {
      var html = '<div class="modal-overlay show" id="modal-init-assessment">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>发起评定</h3><button class="modal-close" data-action="hideModal" data-param="modal-init-assessment"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">评定周期<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="ma-period"><option value="">请选择</option><option>2026年Q1</option><option>2026年Q2</option><option>2026年Q3</option><option>2026年Q4</option><option>2026年度</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">评定说明</label>' +
              '<div class="form-content"><textarea class="form-input" id="ma-desc" rows="4" placeholder="请输入评定说明（选填）" style="resize:vertical;"></textarea></div></div>' +
            '<div style="padding:8px 12px;background:var(--tag-warning-bg);border:1px solid var(--tag-warning-border);border-radius:var(--radius-sm);font-size:12px;color:var(--chart-gold-text);line-height:1.6;">' +
              '<strong>说明：</strong>发起评定后，系统将按 K=100-&Sigma;Ki+Kj 公式自动计算各考核对象得分，按管控级别分组排名，生成评定结果提交集团领导审批。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-init-assessment">取消</button><button class="btn btn-primary" data-action="confirmInit">确认发起</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 发布通报弹窗
    // ============================================================

    showPublishNotice: function() {
      var html = '<div class="modal-overlay show" id="modal-publish-notice">' +
        '<div class="modal-box" style="width:640px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>发布集团通报</h3><button class="modal-close" data-action="hideModal" data-param="modal-publish-notice"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">通报标题<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" id="mn-title" placeholder="请输入通报标题"></div></div>' +
            '<div class="form-group"><label class="form-label">通报内容<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="mn-content" rows="6" placeholder="请输入通报内容" style="resize:vertical;"></textarea></div></div>' +
            '<div class="form-group"><label class="form-label">附件</label>' +
              '<div class="form-content"><input type="file" class="form-input" style="padding:4px 0;" id="mn-file"></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-publish-notice">取消</button><button class="btn btn-primary" data-action="confirmNotice">发布</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 发起公示弹窗
    // ============================================================

    showPublish: function(id) {
      var row = ResultData.publish.find(function(r) { return r.id === id; });
      if (!row) return;
      var gm = ResultData.gradeMap[row.grade];
      var lm = ResultData.levelMap;
      var levelInfo = lm[row.level] || { text: row.level, cls: 'level-tag-a' };
      var html = '<div class="modal-overlay show" id="modal-publish">' +
        '<div class="modal-box" style="width:480px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>发布公示</h3><button class="modal-close" data-action="hideModal" data-param="modal-publish"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div style="margin-bottom:12px;">' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">单位名称</span><span>' + row.name + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">管控级别</span><span class="level-tag ' + levelInfo.cls + '">' + levelInfo.text + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">综合得分</span><span>' + row.score + '</span></div>' +
              '<div class="detail-row" style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:var(--text-secondary);">等级</span><span class="grade-tag ' + gm.cls + '">' + gm.text + '</span></div>' +
            '</div>' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:12px;color:var(--primary);">确认后将在集团系统内公示该单位考核结果。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-publish">取消</button><button class="btn btn-primary" data-action="confirmPublish" data-param="' + id + '">确认公示</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 新增表彰弹窗
    // ============================================================

    showAddHonor: function() {
      var html = '<div class="modal-overlay show" id="modal-add-honor">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>新增表彰</h3><button class="modal-close" data-action="hideModal" data-param="modal-add-honor"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">表彰类型<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="mh-type"><option value="">请选择</option><option>先进单位</option><option>先进个人</option><option>先进集体</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">表彰对象<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="mh-target"><option value="">请选择</option><option>集装箱码头公司</option><option>港航建设公司</option><option>物业运营公司</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">表彰日期<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" type="date" id="mh-date"></div></div>' +
            '<div style="padding:8px 12px;background:var(--tag-warning-bg);border:1px solid var(--tag-warning-border);border-radius:var(--radius-sm);font-size:12px;color:var(--chart-gold-text);line-height:1.6;">' +
              '<strong>限额提示：</strong>先进个人不超过安全管理及一线人员总数5%；安全管理岗位人员表彰不超过安全管理人员总数3%。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-add-honor">取消</button><button class="btn btn-primary" data-action="confirmAddHonor">确定</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 执行约谈弹窗
    // ============================================================

    showExecuteAdmonition: function(id) {
      var row = ResultData.admonitions.find(function(r) { return r.id === id; });
      if (!row) return;
      var html = '<div class="modal-overlay show" id="modal-execute-admonition">' +
        '<div class="modal-box" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>执行诫勉约谈</h3><button class="modal-close" data-action="hideModal" data-param="modal-execute-admonition"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">约谈单位</label><div class="form-content"><input class="form-input" value="' + row.name + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">约谈对象</label><div class="form-content"><input class="form-input" value="' + row.target + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">触发原因</label><div class="form-content"><input class="form-input" value="' + row.reason + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">约谈日期<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" type="date" id="ea-date"></div></div>' +
            '<div class="form-group"><label class="form-label">约谈记录<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="ea-record" rows="4" placeholder="请填写约谈记录" style="resize:vertical;"></textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-execute-admonition">取消</button><button class="btn btn-primary" data-action="confirmAdmonition" data-param="' + id + '">确认执行</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 执行奖惩弹窗
    // ============================================================

    showExecuteReward: function(id) {
      var row = ResultData.rewards ? ResultData.rewards.find(function(r) { return r.id === id; }) : null;
      var unitName = row ? (row.unit || row.name) : '';
      var type = row ? (row.type || '奖惩') : '';
      var html = '<div class="modal-overlay show" id="modal-execute-reward">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>执行奖惩</h3><button class="modal-close" data-action="hideModal" data-param="modal-execute-reward"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">单位名称</label><div class="form-content"><input class="form-input" value="' + unitName + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">奖惩类型</label><div class="form-content"><input class="form-input" value="' + type + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">执行结果<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="er-result"><option value="">请选择</option><option value="executed">已执行</option><option value="pending">暂缓执行</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">备注</label>' +
              '<div class="form-content"><textarea class="form-input" id="er-remark" rows="2" style="resize:vertical;" placeholder="请输入执行备注"></textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-execute-reward">取消</button><button class="btn btn-primary" data-action="confirmExecuteReward" data-param="' + id + '">确认</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // Tab4 公示与奖惩 — 审核表彰弹窗
    // ============================================================

    showReviewHonor: function(id) {
      var row = ResultData.honors ? ResultData.honors.find(function(r) { return r.id === id; }) : null;
      var name = row ? row.name : '';
      var html = '<div class="modal-overlay show" id="modal-review-honor">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>审核表彰</h3><button class="modal-close" data-action="hideModal" data-param="modal-review-honor"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">表彰名称</label><div class="form-content"><input class="form-input" value="' + name + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">审核意见<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="rh-result"><option value="approve">通过</option><option value="reject">驳回</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">备注</label>' +
              '<div class="form-content"><textarea class="form-input" id="rh-remark" rows="2" style="resize:vertical;" placeholder="请输入审核备注"></textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-review-honor">取消</button><button class="btn btn-primary" data-action="confirmReviewHonor">确认</button></div>' +
        '</div></div>';
      ResultModals._appendModal(html);
    },

    // ============================================================
    // 确认操作
    // ============================================================

    confirmInit: function() {
      var period = document.getElementById('ma-period');
      if (!period || !period.value) { alert('请选择评定周期'); return; }
      ResultModals.close('modal-init-assessment');
      ResultLogic.showToast('评定已发起，系统正在自动计算得分...');
    },

    confirmNotice: function() {
      var title = document.getElementById('mn-title');
      if (!title || !title.value) { alert('请输入通报标题'); return; }
      ResultModals.close('modal-publish-notice');
      ResultLogic.showToast('集团通报已发布');
    },

    confirmPublish: function(id) {
      ResultModals.close('modal-publish');
      ResultLogic.showToast('公示已发布');
    },

    confirmAddHonor: function() {
      var type = document.getElementById('mh-type');
      if (!type || !type.value) { alert('请选择表彰类型'); return; }
      ResultModals.close('modal-add-honor');
      ResultLogic.showToast('表彰记录已新增');
    },

    confirmAdmonition: function(id) {
      var record = document.getElementById('ea-record');
      if (!record || !record.value) { alert('请填写约谈记录'); return; }
      ResultModals.close('modal-execute-admonition');
      ResultLogic.showToast('约谈已执行完成');
    },

    confirmExecuteReward: function(id) {
      var result = document.getElementById('er-result');
      if (!result || !result.value) {
        ResultLogic.showToast('请选择执行结果', 'warning');
        return;
      }
      ResultModals.close('modal-execute-reward');
      ResultLogic.showToast('奖惩执行完成');
    },

    confirmReviewHonor: function() {
      ResultModals.close('modal-review-honor');
      ResultLogic.showToast('表彰审核完成');
    },

    confirmSubmitRating: function(unitId) {
      ResultModals.close('modal-submit-rating');
      // 更新执行状态
      var cycle = ResultData.executionCycles.find(function(r) { return r.id === unitId; });
      if (cycle) {
        cycle.status = '已评定';
        if (ResultData.executionSteps[unitId]) {
          ResultData.executionSteps[unitId].current = 4;
          ResultData.executionSteps[unitId].label = '已评定';
        }
      }
      ResultLogic.renderExecutionTable();
      ResultLogic.showToast('已提交至结果评定');
    },

    confirmVerifyRectification: function(id) {
      var opinion = document.getElementById('vr-opinion');
      var result = document.getElementById('vr-result');
      if (!opinion || !opinion.value) { alert('请输入验证意见'); return; }
      if (!result || !result.value) { alert('请选择验证结果'); return; }
      ResultModals.close('modal-verify-rectification');
      // 更新整改状态
      var rect = ResultData.rectifications.find(function(r) { return r.id === id; });
      if (rect) {
        rect.status = result.value === 'pass' ? '已验证' : '待整改';
      }
      ResultLogic.renderRectificationTable();
      ResultLogic.showToast(result.value === 'pass' ? '整改验证通过' : '整改验证未通过，已退回');
    },

    confirmIndicatorConfig: function() {
      var name = document.getElementById('mic-name');
      if (!name || !name.value) { alert('请选择指标名称'); return; }
      ResultModals.close('modal-indicator-config-form');
      ResultLogic.showToast('指标配置已保存');
    },

    // ============================================================
    // 单位考核画像侧滑面板
    // ============================================================

    showUnitCardPanel: function(unitId) {
      var id = String(unitId || '').replace(/'/g, '');
      var data = ResultData.executionCycles.find(function(r) { return r.id === id; });
      if (!data) {
        data = { unit: '未知单位', level: '—', vetoStatus: '正常', deductions: 0, bonus: 0, scorePreview: 100, status: '未开始', tenure: '—' };
      }

      var titleEl = document.getElementById('unit-card-title');
      if (titleEl) titleEl.textContent = data.unit + ' 考核画像';

      var vetoCls = data.vetoStatus === '已触发' ? 'veto-triggered' : data.vetoStatus === '待确认连带' ? 'veto-pending' : data.vetoStatus === '已触发(连带否决)' ? 'veto-linked' : 'veto-normal';
      var vetoTag = '<span class="veto-tag ' + vetoCls + '">' + data.vetoStatus + '</span>';
      var score = data.scorePreview || 100;
      var gradeText = score >= 90 ? '优秀达标' : score >= 80 ? '达标' : '不达标';
      var gradeCls = score >= 90 ? 'grade-tag-excellent' : score >= 80 ? 'grade-tag-qualified' : 'grade-tag-unqualified';
      var isVeto = data.vetoStatus === '已触发' || data.vetoStatus === '已触发(连带否决)';
      if (isVeto) { gradeText = '不达标(否决)'; gradeCls = 'grade-tag-unqualified'; }

      var levelTag = '';
      var lmap = { 'A': 'level-tag-a', 'B': 'level-tag-b', 'C': 'level-tag-c' };
      levelTag = lmap[data.level] ? '<span class="level-tag ' + lmap[data.level] + '">' + data.level + '级管控</span>' : data.level;

      var html = '' +
        '<div class="unit-card-section">' +
          '<div class="unit-card-row"><span class="label">管控级别</span><span>' + levelTag + '</span></div>' +
          '<div class="unit-card-row"><span class="label">纳管时长</span><span>' + (data.tenure || '—') + '</span></div>' +
          '<div class="unit-card-row"><span class="label">执行状态</span><span class="tag ' + (data.status === '执行中' ? 'tag-warning' : data.status === '已评定' ? 'tag-info' : 'tag-default') + '">' + data.status + '</span></div>' +
        '</div>' +

        '<div class="unit-card-section">' +
          '<div class="unit-card-section-title">否决状态</div>' +
          '<div style="text-align:center;padding:8px 0;">' + vetoTag + '</div>' +
          (isVeto ? '<div style="font-size:var(--font-size-12);color:var(--error);text-align:center;">否决项已触发，评定等级强制为不达标</div>' : '<div style="font-size:var(--font-size-12);color:var(--success);text-align:center;">9项否决指标全部正常</div>') +
        '</div>' +

        '<div class="unit-card-section">' +
          '<div class="unit-card-section-title">扣分明细</div>' +
          '<div class="unit-card-row"><span class="label">重大扣分</span><span style="color:var(--error);font-weight:600;">' + (data.majorDeduction || 0) + '</span></div>' +
          '<div class="unit-card-row"><span class="label">一般扣分</span><span style="color:var(--warning);font-weight:600;">' + (data.minorDeduction || 0) + '</span></div>' +
          '<div class="unit-card-row"><span class="label">扣分合计 &Sigma;K<sub>i</sub></span><span style="color:var(--error);font-weight:700;font-size:15px;">' + data.deductions + '</span></div>' +
        '</div>' +

        '<div class="unit-card-section">' +
          '<div class="unit-card-section-title">加分明细</div>' +
          '<div class="unit-card-row"><span class="label">标准加分</span><span style="color:var(--success);font-weight:600;">' + (data.stdBonus || 0) + '</span></div>' +
          '<div class="unit-card-row"><span class="label">举报加分</span><span style="color:var(--success);font-weight:600;">' + (data.reportBonus || 0) + '</span></div>' +
          '<div class="unit-card-row"><span class="label">加分合计 K<sub>j</sub></span><span style="color:var(--success);font-weight:700;font-size:15px;">' + data.bonus + '</span></div>' +
        '</div>' +

        '<div class="unit-card-section" style="background:var(--bg-page);border-radius:var(--radius-md);padding:16px;">' +
          '<div class="unit-card-formula">K = 100 - &Sigma;K<sub>i</sub> + K<sub>j</sub></div>' +
          '<div class="unit-card-score">' + score + '</div>' +
          '<div class="unit-card-grade"><span class="grade-tag ' + gradeCls + '">' + gradeText + '</span></div>' +
        '</div>';

      var bodyEl = document.getElementById('unit-card-body');
      if (bodyEl) bodyEl.innerHTML = html;

      var overlay = document.getElementById('unit-card-overlay');
      var panel = document.getElementById('unit-card-panel');
      if (overlay) overlay.classList.add('show');
      if (panel) panel.classList.add('show');

      overlay.onclick = function() { ResultModals.closeUnitCardPanel(); };
    },

    closeUnitCardPanel: function() {
      var overlay = document.getElementById('unit-card-overlay');
      var panel = document.getElementById('unit-card-panel');
      if (overlay) overlay.classList.remove('show');
      if (panel) panel.classList.remove('show');
    },

    // ============================================================
    // 工具方法
    // ============================================================

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

  window.ResultModals = ResultModals;
})();
