// bonus-modals.js — 加分项与举报奖励 弹窗逻辑
(function() {
  'use strict';

  var BonusModals = {

    // 新增加分申请弹窗
    showAddBonus: function() {
      var typeOptions = BonusData.bonusTypes.map(function(t) {
        return '<option>' + t + '</option>';
      }).join('');
      var html = '<div class="modal-overlay show" id="modal-add-bonus">' +
        '<div class="modal-box" style="width:600px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>新增加分申请</h3><button class="modal-close" data-action="closeModal" data-param="modal-add-bonus"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">加分类型<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="ab-type" onchange="BonusModals._onTypeChange()"><option value="">请选择</option>' + typeOptions + '</select></div></div>' +
            '<div class="form-group"><label class="form-label">项目名称<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" id="ab-name" placeholder="请输入项目名称"></div></div>' +
            '<div class="form-group"><label class="form-label">申请单位</label>' +
              '<div class="form-content"><input class="form-input" id="ab-unit" placeholder="请输入申请单位"></div></div>' +
            '<div class="form-group"><label class="form-label">加分值</label>' +
              '<div class="form-content"><input class="form-input" id="ab-score" type="number" placeholder="根据类型自动填写"></div></div>' +
            '<div class="form-group"><label class="form-label">说明</label>' +
              '<div class="form-content"><textarea class="form-input" id="ab-desc" rows="3" style="resize:vertical;" placeholder="请输入说明"></textarea></div></div>' +
            '<div class="form-group"><label class="form-label">证明材料 <span style="color:var(--error)">*</span></label>' +
              '<div class="form-content">' +
                '<div id="ab-materials-list" style="margin-bottom:8px;"></div>' +
                '<div style="border:1px dashed var(--border-color);border-radius:var(--radius-sm);padding:16px;text-align:center;cursor:pointer;background:var(--bg-page);color:var(--text-secondary);" data-action="triggerUpload" data-param="ab-file" data-param2="ab-materials-list">' +
                  '<div style="font-size:24px;margin-bottom:4px;">+</div>' +
                  '<div style="font-size:var(--font-size-12);">点击上传证明材料（证书、报告等）</div>' +
                '</div>' +
                '<input type="file" id="ab-file" multiple style="display:none;" onchange="BonusModals._onFileSelected(this,\'ab-materials-list\')">' +
              '</div></div>' +
            '<div id="ab-review-hint" style="display:none;padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);margin-top:4px;"></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="closeModal" data-param="modal-add-bonus">取消</button><button class="btn btn-primary" data-action="confirmAddBonus">提交申请</button></div>' +
        '</div></div>';
      BonusModals._appendModal(html);
    },

    // 审核加分弹窗
    showReviewBonus: function(id) {
      var row = BonusData.bonusList.find(function(r) { return r.id === id; });
      if (!row) return;

      // 判断单步/双步审核
      var scoreNum = row.scoreNum || parseInt(row.score) || 0;
      var isDualStep = row.reviewStep === 2;
      var currentStep = isDualStep ? 1 : 1; // 默认显示初核
      // 审核中的双步项目，如果状态是审核中且已在集团终审阶段，显示2/2
      if (isDualStep && row.status === '集团终审中') { currentStep = 2; }
      var totalSteps = isDualStep ? 2 : 1;
      var stepLabel = '审核（' + currentStep + '/' + totalSteps + '）';
      var stepRole = isDualStep
        ? (currentStep === 1 ? '集团安全管理人员初核' : '集团领导集团终审')
        : '集团安全管理人员审核';

      // 证明材料列表
      var materialsHtml = '';
      if (row.materials && row.materials.length > 0) {
        materialsHtml = row.materials.map(function(f) {
          return '<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg-page);border-radius:var(--radius-sm);margin-bottom:4px;">' +
            '<span style="color:var(--primary);font-size:var(--font-size-14);">&#128196;</span>' +
            '<span style="font-size:var(--font-size-13);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + f + '</span>' +
            '<a style="font-size:var(--font-size-12);color:var(--primary);cursor:pointer;white-space:nowrap;">下载</a>' +
          '</div>';
        }).join('');
      } else {
        materialsHtml = '<div style="color:var(--text-placeholder);font-size:var(--font-size-13);padding:6px 0;">未上传证明材料</div>';
      }

      var html = '<div class="modal-overlay show" id="modal-review-bonus">' +
        '<div class="modal-box" style="width:620px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + stepLabel + '</h3><button class="modal-close" data-action="closeModal" data-param="modal-review-bonus"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            // 审核角色提示
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);margin-bottom:12px;">' +
              stepRole + (isDualStep ? '（加分值 &gt;5 分，需双步审核）' : '（加分值 &le;5 分，单步审核即生效）') +
            '</div>' +
            // 申请信息摘要
            '<div style="background:var(--bg-page);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;">' +
              '<div style="font-size:var(--font-size-13);font-weight:600;margin-bottom:8px;color:var(--text-primary);">申请信息</div>' +
              '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;font-size:var(--font-size-13);">' +
                '<div><span style="color:var(--text-secondary);">项目名称：</span>' + row.name + '</div>' +
                '<div><span style="color:var(--text-secondary);">加分类型：</span>' + row.type + '</div>' +
                '<div><span style="color:var(--text-secondary);">申请单位：</span>' + row.unit + '</div>' +
                '<div><span style="color:var(--text-secondary);">加分值：</span><span style="font-weight:600;color:var(--success);">' + row.score + '分</span></div>' +
              '</div>' +
            '</div>' +
            // 证明材料
            '<div class="form-group"><label class="form-label">证明材料</label>' +
              '<div class="form-content">' +
                materialsHtml +
                '<div style="border:1px dashed var(--border-color);border-radius:var(--radius-sm);padding:12px;text-align:center;cursor:pointer;background:var(--bg-page);color:var(--text-secondary);margin-top:4px;" data-action="triggerUpload" data-param="rb-file" data-param2="rb-materials-list">' +
                  '<div style="font-size:18px;">+</div>' +
                  '<div style="font-size:var(--font-size-12);">补充上传证明材料</div>' +
                '</div>' +
                '<div id="rb-materials-list" style="margin-top:4px;"></div>' +
                '<input type="file" id="rb-file" multiple style="display:none;" onchange="BonusModals._onFileSelected(this,\'rb-materials-list\')">' +
              '</div>' +
            '</div>' +
            // 审核意见
            '<div class="form-group"><label class="form-label">审核意见<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="rb-opinion" rows="3" style="resize:vertical;" placeholder="请输入审核意见"></textarea></div></div>' +
            // 审核结果
            '<div class="form-group"><label class="form-label">审核结果<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="rb-result"><option value="">请选择</option><option value="approve">通过</option><option value="reject">驳回</option></select></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="closeModal" data-param="modal-review-bonus">取消</button><button class="btn btn-primary" data-action="confirmReviewBonus" data-param="' + id + '">确认审核</button></div>' +
        '</div></div>';
      BonusModals._appendModal(html);
    },

    // 重新提交弹窗
    showResubmit: function(id) {
      var row = BonusData.bonusList.find(function(r) { return r.id === id; });
      if (!row) return;
      var html = '<div class="modal-overlay show" id="modal-resubmit">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>重新提交申请</h3><button class="modal-close" data-action="closeModal" data-param="modal-resubmit"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">项目名称</label><div class="form-content"><input class="form-input" value="' + row.name + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">补充说明<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="rs-desc" rows="3" style="resize:vertical;" placeholder="请补充说明或上传补充材料"></textarea></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="closeModal" data-param="modal-resubmit">取消</button><button class="btn btn-primary" data-action="confirmResubmit" data-param="' + id + '">重新提交</button></div>' +
        '</div></div>';
      BonusModals._appendModal(html);
    },

    // 确认举报加分弹窗
    showConfirmReport: function(id) {
      var row = BonusData.reportList.find(function(r) { return r.id === id; });
      if (!row) return;
      var html = '<div class="modal-overlay show" id="modal-confirm-report">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>确认举报加分</h3><button class="modal-close" data-action="closeModal" data-param="modal-confirm-report"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">举报人</label><div class="form-content"><input class="form-input" value="' + row.reporter + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">隐患等级</label><div class="form-content"><input class="form-input" value="' + row.level + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">加分值</label><div class="form-content"><span style="font-size:var(--font-size-16);font-weight:600;color:var(--success);">' + row.score + '分</span></div></div>' +
            '<div class="form-group"><label class="form-label">确认层级<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="cr-level"><option value="">请选择确认层级</option><option value="初核">初核（属地单位确认）</option><option value="复核">复核（安全管理部确认）</option><option value="集团终审">集团终审（集团领导确认）</option></select></div></div>' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);">确认后加分将计入归属单位当期绩效考核。集团终审通过后加分正式生效。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="closeModal" data-param="modal-confirm-report">取消</button><button class="btn btn-primary" data-action="confirmReport" data-param="' + id + '">确认加分</button></div>' +
        '</div></div>';
      BonusModals._appendModal(html);
    },

    // 确认操作
    confirmAddBonus: function() {
      var name = document.getElementById('ab-name');
      var type = document.getElementById('ab-type');
      var scoreInput = document.getElementById('ab-score');
      if (!name || !name.value.trim()) { BonusLogic.showToast('请输入项目名称'); return; }
      if (!type || !type.value) { BonusLogic.showToast('请选择加分类型'); return; }
      var materialsList = document.getElementById('ab-materials-list');
      if (!materialsList || !materialsList.children.length) { BonusLogic.showToast('请上传证明材料'); return; }
      var newScore = scoreInput ? parseFloat(scoreInput.value) || 0 : 0;
      var currentTotal = 0;
      if (typeof BonusData !== 'undefined' && BonusData.bonusList) {
        BonusData.bonusList.forEach(function(r) {
          if (r.status === '已生效' || r.status === '审核中') {
            currentTotal += parseFloat(r.score) || 0;
          }
        });
      }
      if (currentTotal + newScore > 10) {
        BonusLogic.showToast('加分申请超出年度上限（当前累计' + currentTotal + '分 + 本次' + newScore + '分 > 10分上限），请调整后重新提交');
        return;
      }
      BonusModals.close('modal-add-bonus');
      BonusLogic.showToast('加分申请已提交');
    },
    confirmReviewBonus: function(id) {
      var result = document.getElementById('rb-result');
      var opinion = document.getElementById('rb-opinion');
      if (!result || !result.value) { BonusLogic.showToast('请选择审核结果'); return; }
      if (!opinion || !opinion.value.trim()) { BonusLogic.showToast('请输入审核意见'); return; }
      var row = BonusData.bonusList.find(function(r) { return r.id === id; });
      var isDualStep = row && row.reviewStep === 2;
      BonusModals.close('modal-review-bonus');
      if (isDualStep && result.value === 'approve') {
        BonusLogic.showToast('初核通过，已提交集团领导集团终审');
      } else if (result.value === 'approve') {
        BonusLogic.showToast('审核通过，加分已生效');
      } else {
        BonusLogic.showToast('已驳回申请');
      }
    },
    confirmResubmit: function(id) {
      var desc = document.getElementById('rs-desc');
      if (desc && !desc.value.trim()) { BonusLogic.showToast('请输入补充说明'); return; }
      BonusModals.close('modal-resubmit');
      BonusLogic.showToast('申请已重新提交');
    },
    confirmReport: function(id) {
      var levelEl = document.getElementById('cr-level');
      if (!levelEl || !levelEl.value) { BonusLogic.showToast('请选择确认层级'); return; }
      var level = levelEl.value;
      BonusModals.close('modal-confirm-report');
      if (level === '集团终审') {
        BonusLogic.showToast('集团终审通过，举报加分已正式生效');
      } else if (level === '复核') {
        BonusLogic.showToast('复核通过，待集团领导集团终审');
      } else {
        BonusLogic.showToast('初核通过，待安全管理部复核');
      }
    },

    // 加分类型变更时自动填写分值 + 提示审核流程
    _onTypeChange: function() {
      var sel = document.getElementById('ab-type');
      var scoreInput = document.getElementById('ab-score');
      var hintEl = document.getElementById('ab-review-hint');
      if (!sel) return;
      var val = sel.value;
      // 从类型名称中提取分值
      var match = val.match(/\+(\d+)/);
      if (match && scoreInput) { scoreInput.value = match[1]; }
      // 提示审核流程
      if (hintEl) {
        var scoreNum = match ? parseInt(match[1]) : 0;
        if (val.indexOf('ISO') > -1 || scoreNum > 5) {
          hintEl.style.display = 'block';
          hintEl.innerHTML = '该加分项需双步审核：安全管理人员初核 → 集团领导集团终审';
        } else if (val) {
          hintEl.style.display = 'block';
          hintEl.innerHTML = '该加分项为单步审核：集团安全管理人员审核即生效';
        } else {
          hintEl.style.display = 'none';
        }
      }
    },

    // 触发文件选择
    _triggerUpload: function(fileInputId, listId) {
      var fileInput = document.getElementById(fileInputId);
      if (fileInput) fileInput.click();
    },

    // 文件选择后显示文件列表
    _onFileSelected: function(input, listId) {
      var listEl = document.getElementById(listId);
      if (!listEl || !input.files) return;
      for (var i = 0; i < input.files.length; i++) {
        var f = input.files[i];
        var item = document.createElement('div');
        item.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg-page);border-radius:var(--radius-sm);margin-bottom:4px;';
        item.innerHTML = '<span style="color:var(--success);font-size:var(--font-size-14);">&#10003;</span>' +
          '<span style="font-size:var(--font-size-13);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + f.name + '</span>' +
          '<span style="font-size:var(--font-size-12);color:var(--text-placeholder);">' + (f.size / 1024).toFixed(1) + 'KB</span>';
        listEl.appendChild(item);
      }
      input.value = '';
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

  window.BonusModals = BonusModals;

  // Event delegation for data-action attributes
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (btn) {
      var action = btn.getAttribute('data-action');
      var param = btn.getAttribute('data-param');
      switch (action) {
        case 'closeModal':
          BonusModals.close(param);
          break;
        case 'triggerUpload':
          var param2 = btn.getAttribute('data-param2');
          BonusModals._triggerUpload(param, param2);
          break;
        case 'confirmAddBonus':
          BonusModals.confirmAddBonus();
          break;
        case 'confirmReviewBonus':
          BonusModals.confirmReviewBonus(param);
          break;
        case 'confirmResubmit':
          BonusModals.confirmResubmit(param);
          break;
        case 'confirmReport':
          BonusModals.confirmReport(param);
          break;
      }
    }
    // Backdrop click handler
    var overlay = e.target.closest('.modal-overlay');
    if (overlay && e.target === overlay) {
      overlay.remove();
    }
  });
})();
