// work-modals.js — 工作指标与扣分规则 弹窗逻辑
(function() {
  'use strict';

  var WorkModals = {

    // 编辑扣分规则弹窗
    showEditRule: function(id) {
      var isNew = !id;
      var row = isNew ? { level: '', situation: '', score: '', condition: '' } : WorkData.rules.find(function(r) { return r.id === id; });
      if (!row) return;
      var levelOptions = ['重大', '较大', '一般', '其他'].map(function(l) {
        return '<option' + (row.level === l ? ' selected' : '') + '>' + l + '</option>';
      }).join('');
      var html = '<div class="modal-overlay show" id="modal-edit-rule">' +
        '<div class="modal-box" style="width:560px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + (isNew ? '新增扣分规则' : '编辑扣分规则') + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-edit-rule"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">扣分等级<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><select class="form-input form-select" id="er-level"><option value="">请选择</option>' + levelOptions + '</select></div></div>' +
            '<div class="form-group"><label class="form-label">扣分情形<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="er-situation" rows="3" style="resize:vertical;">' + row.situation + '</textarea></div></div>' +
            '<div class="form-group"><label class="form-label">扣分值<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><input class="form-input" id="er-score" value="' + row.score + '"></div></div>' +
            '<div class="form-group"><label class="form-label">触发条件</label>' +
              '<div class="form-content"><textarea class="form-input" id="er-condition" rows="2" style="resize:vertical;">' + row.condition + '</textarea></div></div>' +
            '<div class="form-group"><label class="form-label">发现方式</label>' +
              '<div class="form-content"><select class="form-input form-select" id="er-method"><option value="">请选择</option><option' + (row.method === '外部检查' ? ' selected' : '') + '>外部检查</option><option' + (row.method === '企业自查' ? ' selected' : '') + '>企业自查</option></select></div></div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-edit-rule">取消</button><button class="btn btn-primary" data-action="confirmEditRule">保存</button></div>' +
        '</div></div>';
      WorkModals._appendModal(html);
    },

    // 确认扣分弹窗
    showConfirmDeduction: function(id) {
      var row = WorkData.records.find(function(r) { return r.id === id; });
      if (!row) return;
      var isContractor = row.isContractor;
      var syncNotice = isContractor
        ? '<div style="padding:8px 12px;background:rgba(233,124,0,0.08);border:1px solid rgba(233,124,0,0.2);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--warning);margin-top:8px;">&#9888; 此为承包商连带扣分，确认后系统将自动同步否决指标状态（待确认连带 → 已触发/连带否决）。排除连带请选择"排除连带"。</div>'
        : '';
      var footerButtons = isContractor
        ? '<button class="btn btn-default" data-action="hideModal" data-param="modal-confirm-deduction">取消</button><button class="btn btn-warning" data-action="excludeContractor" data-param="' + id + '">排除连带</button><button class="btn btn-primary" data-action="confirmDeduction" data-param="' + id + '">确认连带</button>'
        : '<button class="btn btn-default" data-action="hideModal" data-param="modal-confirm-deduction">取消</button><button class="btn btn-primary" data-action="confirmDeduction" data-param="' + id + '">确认扣分</button>';
      var html = '<div class="modal-overlay show" id="modal-confirm-deduction">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>' + (isContractor ? '确认连带扣分' : '确认扣分') + '</h3><button class="modal-close" data-action="hideModal" data-param="modal-confirm-deduction"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">考核单位</label><div class="form-content"><input class="form-input" value="' + row.unit + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">扣分项</label><div class="form-content"><input class="form-input" value="' + row.item + '" readonly style="background:var(--bg-page);"></div></div>' +
            (isContractor ? '<div class="form-group"><label class="form-label">扣分类型</label><div class="form-content"><span class="tag tag-warning">承包商连带</span></div></div>' : '') +
            '<div class="form-group"><label class="form-label">扣分值</label><div class="form-content"><span style="font-size:var(--font-size-16);font-weight:600;color:var(--error);">' + row.score + '分</span></div></div>' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);">确认后扣分将计入该单位当期绩效考核。</div>' +
            syncNotice +
          '</div>' +
          '<div class="modal-footer">' + footerButtons + '</div>' +
        '</div></div>';
      WorkModals._appendModal(html);
    },

    // 确认操作
    confirmEditRule: function() {
      var situation = document.getElementById('er-situation');
      if (situation && !situation.value) { alert('请输入扣分情形'); return; }
      WorkModals.close('modal-edit-rule');
      WorkLogic.showToast('扣分规则已更新');
    },
    confirmDeduction: function(id) {
      var row = WorkData.records.find(function(r) { return r.id === id; });
      WorkModals.close('modal-confirm-deduction');
      // 模拟同步：80% 成功，20% 失败
      var syncFailed = Math.random() < 0.2;
      if (syncFailed) {
        WorkLogic.showToast('同步失败，请稍后重试或联系管理员', 'error');
      } else {
        if (row && row.status === '待确认') {
          row.status = '已生效';
          row.statusTag = 'tag-success';
        }
        if (row && row.isContractor) {
          WorkLogic.showToast('连带扣分已确认，否决指标状态已自动同步');
        } else {
          WorkLogic.showToast('扣分已确认');
        }
      }
    },
    excludeContractor: function(id) {
      var row = WorkData.records.find(function(r) { return r.id === id; });
      if (!row) return;
      WorkModals.close('modal-confirm-deduction');
      var html = '<div class="modal-overlay show" id="modal-exclude-contractor">' +
        '<div class="modal-box" style="width:520px;background:var(--bg-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);">' +
          '<div class="modal-header"><h3>排除连带扣分</h3><button class="modal-close" data-action="hideModal" data-param="modal-exclude-contractor"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></button></div>' +
          '<div class="modal-body">' +
            '<div class="form-group"><label class="form-label">考核单位</label><div class="form-content"><input class="form-input" value="' + row.unit + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">扣分项</label><div class="form-content"><input class="form-input" value="' + row.item + '" readonly style="background:var(--bg-page);"></div></div>' +
            '<div class="form-group"><label class="form-label">排除原因<span style="color:var(--error)">*</span></label>' +
              '<div class="form-content"><textarea class="form-input" id="exc-reason" rows="4" style="resize:vertical;" placeholder="请填写排除连带的原因，如：该隐患与承包商无关、已确认由第三方责任导致等"></textarea></div></div>' +
            '<div style="padding:8px 12px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:var(--font-size-12);color:var(--primary);">排除连带后，否决指标状态恢复为正常监测，扣分记录标记为已排除。</div>' +
          '</div>' +
          '<div class="modal-footer"><button class="btn btn-default" data-action="hideModal" data-param="modal-exclude-contractor">取消</button><button class="btn btn-warning" data-action="confirmExcludeContractor" data-param="' + id + '">确认排除</button></div>' +
        '</div></div>';
      WorkModals._appendModal(html);
    },

    // 确认排除连带
    confirmExcludeContractor: function(id) {
      var reasonEl = document.getElementById('exc-reason');
      if (!reasonEl || !reasonEl.value.trim()) {
        reasonEl.style.borderColor = 'var(--error)';
        reasonEl.focus();
        return;
      }
      WorkModals.close('modal-exclude-contractor');
      // 模拟同步：80% 成功，20% 失败
      var syncFailed = Math.random() < 0.2;
      if (syncFailed) {
        WorkLogic.showToast('同步失败，请稍后重试或联系管理员', 'error');
      } else {
        var row = WorkData.records.find(function(r) { return r.id === id; });
        if (row && row.status === '待确认') {
          row.status = '已排除';
          row.statusTag = 'tag-default';
        }
        WorkLogic.showToast('已排除连带，否决指标状态已恢复为正常监测');
      }
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

  window.WorkModals = WorkModals;
})();
