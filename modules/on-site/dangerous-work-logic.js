/** dangerous-work.html - 逻辑层（从内联脚本提取） */

function showView(view) {
  if (view === 'list') {
    setPageView('view-list', 'view-detail', 'list');
    return;
  }
  if (view === 'detail') {
    setPageView('view-list', 'view-detail', 'detail');
    return;
  }
  document.querySelectorAll('.page-view').forEach(function(v) { v.classList.remove('active'); });
  var el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
}

function switchTab(name) {
  document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
  var tabItems = document.querySelectorAll('.tab-item');
  if (typeof event !== 'undefined' && event.target) {
    event.target.classList.add('active');
  } else {
    tabItems[TAB_MAP[name]].classList.add('active');
  }
  document.getElementById('tab-' + name).classList.add('active');
  scheduleDwTableCellTitles();
}

var DW_FOCUS_MODES = { approval: 1, close: 1, timeline: 1, review: 1 };

/** 当前详情样例 key，供审批转派/通过等原型状态更新 */
var DW_CURRENT_DETAIL_KEY = '';

function getDwPoolCandidates(poolKey) {
  var pool = DW_APPROVAL_PERSON_POOL || {};
  return pool[poolKey] ? pool[poolKey].slice() : [];
}

function findDwPersonById(id) {
  if (!id || !DW_APPROVAL_PERSON_POOL) return null;
  var keys = Object.keys(DW_APPROVAL_PERSON_POOL);
  for (var i = 0; i < keys.length; i++) {
    var list = DW_APPROVAL_PERSON_POOL[keys[i]];
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === id) return list[j];
    }
  }
  return null;
}

/** 按作业类型 + 动火等级解析审批节点定义 */
function getDwApprovalStageDefs(workType) {
  if (!workType) return [];
  if (workType === '动火作业') {
    var levelSel = document.getElementById('nw-level');
    var level = levelSel ? levelSel.value : '';
    if (level.indexOf('三级') >= 0) {
      return (DW_APPROVAL_CHAIN_FIRE_SIMPLIFIED || []).slice();
    }
  }
  var map = DW_APPROVAL_CHAIN_BY_TYPE || {};
  return (map[workType] || []).slice();
}

function getDwCurrentApprovalStage(flow) {
  if (!flow || !flow.stages) return null;
  for (var i = 0; i < flow.stages.length; i++) {
    if (flow.stages[i].status === 'current') return flow.stages[i];
  }
  return null;
}

function formatDwApproversSummary(stageDefs) {
  if (!stageDefs || !stageDefs.length) return '';
  return stageDefs.map(function(s) {
    var req = s.required ? '' : '（可选）';
    var name = s.assigneeName || '—';
    return s.label + '：' + name + req;
  }).join(' · ');
}

function renderNewWorkApprovalStages() {
  var container = document.getElementById('nw-approval-stages');
  var hint = document.getElementById('nw-approval-chain-hint');
  if (!container) return;

  var typeSel = document.getElementById('nw-type');
  var workType = typeSel ? typeSel.value : '';
  var acc = DW_CURRENT_ACCOUNT || {};
  var unitName = acc.unitParent || '所属单位';

  if (!workType) {
    container.innerHTML = '<div class="nw-approval-empty">请选择作业类型后，系统将按「' + unitName + '」+ 作业类型匹配默认审批链。</div>';
    if (hint) {
      hint.textContent = '请先选择作业类型；将按所属单位在 §3.13.6 配置的默认审批链自动匹配节点与候选人，可调整。审批中支持同节点转派流转。';
    }
    return;
  }

  var defs = getDwApprovalStageDefs(workType);
  if (!defs.length) {
    container.innerHTML = '<div class="nw-approval-empty">未配置该作业类型的审批链，请联系管理员在基础配置中维护。</div>';
    return;
  }

  var chainNote = workType === '动火作业' ? '（动火三级已匹配简化审批链）' : '';
  if (hint) {
    hint.textContent = '已按「' + unitName + '」+「' + workType + '」匹配默认审批链' + chainNote + '，候选人来自本单位职务池；可修改指定人。';
  }

  container.innerHTML = defs.map(function(stage) {
    var candidates = getDwPoolCandidates(stage.poolKey);
    var reqMark = stage.required ? '<span class="required">*</span>' : '';
    var opts = '<option value="">请选择</option>';
    candidates.forEach(function(p) {
      var selected = (stage.defaultId && p.id === stage.defaultId) ? ' selected' : '';
      opts += '<option value="' + p.id + '"' + selected + '>' + p.name + '（' + p.title + '）</option>';
    });
    if (!stage.required) {
      opts += '<option value="__default__"' + (!stage.defaultId ? ' selected' : '') + '>默认按角色匹配</option>';
    }
    return '<div class="form-group" data-dw-approve-stage="' + stage.key + '" data-dw-approve-required="' + (stage.required ? '1' : '0') + '">'
      + '<label class="form-label">' + reqMark + stage.label + '</label>'
      + '<div class="form-content">'
      + '<select class="form-input form-select" name="nw-approve-stage" data-stage-key="' + stage.key + '" data-stage-label="' + stage.label + '">'
      + opts + '</select></div></div>';
  }).join('');
}

function collectNewWorkApproverSelections() {
  var selects = document.querySelectorAll('#nw-approval-stages select[name="nw-approve-stage"]');
  var list = [];
  selects.forEach(function(sel) {
    var val = sel.value;
    if (!val || val === '__default__') {
      list.push({
        key: sel.getAttribute('data-stage-key'),
        label: sel.getAttribute('data-stage-label'),
        personId: '',
        personName: '默认按角色'
      });
      return;
    }
    var person = findDwPersonById(val);
    list.push({
      key: sel.getAttribute('data-stage-key'),
      label: sel.getAttribute('data-stage-label'),
      personId: val,
      personName: person ? person.name : val
    });
  });
  return list;
}

function renderApprovalFlowPanel(sample) {
  var wrap = document.getElementById('dw-approval-flow-wrap');
  var stepsEl = document.getElementById('dw-approval-flow-steps');
  var hintEl = document.getElementById('dw-approval-current-hint');
  if (!wrap || !stepsEl) return;

  var flow = sample && sample.approvalFlow;
  var show = !!(sample && sample.toolbars && sample.toolbars.approve && flow && flow.stages);
  wrap.style.display = show ? '' : 'none';
  if (!show) return;

  stepsEl.innerHTML = flow.stages.map(function(st) {
    var cls = st.status || 'pending';
    var who = st.assignee ? ' · ' + st.assignee : '';
    return '<span class="dw-flow-step ' + cls + '" title="' + st.label + who + '">' + st.label + who + '</span>';
  }).join('');

  var current = getDwCurrentApprovalStage(flow);
  if (hintEl) {
    if (current) {
      hintEl.textContent = '当前待审：' + current.label + ' → 指定审批人「' + (current.assignee || '—') + '」。可「审批通过/退回」或「转派流转」至同节点其他有权限人员。';
    } else {
      hintEl.textContent = '审批流程节点已全部处理完毕（原型状态）。';
    }
  }
}

function getTransferCandidatesForCurrentStage(sample) {
  var flow = sample && sample.approvalFlow;
  var current = getDwCurrentApprovalStage(flow);
  if (!current) return { current: null, candidates: [] };

  var defs = getDwApprovalStageDefs(flow.workType || '');
  var def = null;
  defs.forEach(function(d) {
    if (d.key === current.key) def = d;
  });
  if (!def && flow.workType === '动火作业') {
    defs = (DW_APPROVAL_CHAIN_BY_TYPE && DW_APPROVAL_CHAIN_BY_TYPE['动火作业']) || [];
    defs.forEach(function(d) {
      if (d.key === current.key) def = d;
    });
  }

  var poolKey = def ? def.poolKey : 'dept';
  var all = getDwPoolCandidates(poolKey);
  var candidates = all.filter(function(p) {
    return p.id !== current.assigneeId && p.name !== current.assignee;
  });
  return { current: current, candidates: candidates, poolKey: poolKey };
}

function openApprovalTransferModal() {
  var sample = DW_WORK_SAMPLES[DW_CURRENT_DETAIL_KEY];
  if (!sample || !sample.approvalFlow) {
    showToast('当前作业单无审批流转信息', 'warning');
    return;
  }
  var info = getTransferCandidatesForCurrentStage(sample);
  if (!info.current) {
    showToast('当前无待审节点，无法转派', 'warning');
    return;
  }
  if (!info.candidates.length) {
    showToast('同节点暂无其他可转派人员', 'warning');
    return;
  }

  document.getElementById('at-current-node').value = info.current.label;
  document.getElementById('at-current-assignee').value = info.current.assignee || '';
  var targetSel = document.getElementById('at-target');
  targetSel.innerHTML = '<option value="">请选择</option>';
  info.candidates.forEach(function(p) {
    var opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name + '（' + p.title + '）';
    targetSel.appendChild(opt);
  });
  document.getElementById('at-reason').value = '';
  showModal('modal-approval-transfer');
}

function submitApprovalTransfer() {
  var targetSel = document.getElementById('at-target');
  var reason = document.getElementById('at-reason');
  if (!targetSel || !targetSel.value) {
    showToast('请选择转派对象', 'error');
    return;
  }
  if (!reason || !reason.value.trim()) {
    showToast('请填写转派原因', 'error');
    return;
  }

  var sample = DW_WORK_SAMPLES[DW_CURRENT_DETAIL_KEY];
  var person = findDwPersonById(targetSel.value);
  var current = sample && sample.approvalFlow ? getDwCurrentApprovalStage(sample.approvalFlow) : null;
  if (sample && sample.approvalFlow && current) {
    current.assignee = person ? person.name : targetSel.options[targetSel.selectedIndex].textContent.split('（')[0];
    current.assigneeId = targetSel.value;
    if (!sample.transferLog) sample.transferLog = [];
    sample.transferLog.push({
      node: current.label,
      from: document.getElementById('at-current-assignee').value,
      to: current.assignee,
      reason: reason.value.trim(),
      at: new Date().toLocaleString('zh-CN', { hour12: false })
    });
    updateDwApproversBasicField(sample);
    renderDangerousWorkDetail(DW_CURRENT_DETAIL_KEY);
    applyDetailFocus('approval');
  }

  hideModal('modal-approval-transfer');
  showToast('已转派至「' + (person ? person.name : current.assignee) + '」，由新审批人继续处理当前节点', 'success');
}

function updateDwApproversBasicField(sample) {
  if (!sample || !sample.basic || !sample.approvalFlow) return;
  var text = sample.approvalFlow.stages.map(function(st) {
    var suffix = st.status === 'current' ? '（待审）' : (st.status === 'done' ? '（已通过）' : '');
    return st.label + '：' + (st.assignee || '—') + suffix;
  }).join(' · ');
  sample.basic.forEach(function(row, idx) {
    if (row[0] === '阶段审批人') sample.basic[idx][1] = text;
  });
}

function submitApprovalPass() {
  var sample = DW_WORK_SAMPLES[DW_CURRENT_DETAIL_KEY];
  if (!sample) return;
  if (sample.approvePass === false) {
    showToast(sample.approveBlockReason || '无法审批通过', 'error');
    return;
  }
  var flow = sample.approvalFlow;
  var current = flow ? getDwCurrentApprovalStage(flow) : null;
  if (flow && current) {
    current.status = 'done';
    var advanced = false;
    for (var i = 0; i < flow.stages.length; i++) {
      if (flow.stages[i].status === 'pending') {
        flow.stages[i].status = 'current';
        advanced = true;
        sample.statusDesc = flow.stages[i].label + '审批中 · 指定审批人：' + (flow.stages[i].assignee || '—');
        break;
      }
    }
    if (!advanced) {
      sample.toolbars.approve = false;
      sample.statusLabel = '待交底';
      sample.statusDesc = '审批已全部通过，待作业交底';
      showToast('审批已全部通过，进入待交底（原型演示）', 'success');
    } else {
      showToast('「' + current.label + '」已通过，流转至下一节点', 'success');
    }
    updateDwApproversBasicField(sample);
    renderDangerousWorkDetail(DW_CURRENT_DETAIL_KEY);
    applyDetailFocus('approval');
    return;
  }
  showToast('审批通过（原型演示）', 'success');
}

function submitApprovalReject() {
  var sample = DW_WORK_SAMPLES[DW_CURRENT_DETAIL_KEY];
  if (sample && sample.approvalFlow) {
    var current = getDwCurrentApprovalStage(sample.approvalFlow);
    if (current) {
      showToast('「' + current.label + '」已退回至申请人（原型演示）', 'warning');
      return;
    }
  }
  showToast('审批退回（原型演示）', 'warning');
}

function normalizeDwParam(val) {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/^['"]|['"]$/g, '');
}

function buildDwTimelineItem(node) {
  var tagStyle = node.tagStyle ? ' style="' + node.tagStyle + '"' : '';
  var tagCls = node.tagClass || 'tag-info';
  var html = '<div class="dw-tl-item ' + node.state + '" role="listitem">'
    + '<div class="dw-tl-dot" aria-hidden="true"></div><div class="dw-tl-body">'
    + '<div class="dw-tl-head"><span class="dw-tl-title">' + node.title + '</span>'
    + '<span class="tag ' + tagCls + '"' + tagStyle + ' style="font-size:11px;line-height:18px;padding:0 6px;">' + node.tag + '</span></div>'
    + '<div class="dw-tl-meta">' + node.meta + '</div>';
  if (node.opinion) {
    html += '<div class="dw-tl-opinion">' + node.opinion + '</div>';
  }
  if (node.extra && node.extra.length) {
    html += '<div class="dw-tl-extra">' + node.extra.join('') + '</div>';
  }
  if (node.sub) {
    html += '<div class="dw-tl-meta" style="color:var(--text-description);">' + node.sub + '</div>';
  }
  html += '</div></div>';
  return html;
}

function renderDangerousWorkDetail(workKey) {
  DW_CURRENT_DETAIL_KEY = workKey || DW_DEFAULT_SAMPLE_KEY;
  var sample = DW_WORK_SAMPLES[workKey] || DW_WORK_SAMPLES[DW_DEFAULT_SAMPLE_KEY];
  if (!sample) return;

  var titleEl = document.getElementById('dw-detail-title');
  var subEl = document.getElementById('dw-detail-subtitle');
  var tagEl = document.getElementById('dw-detail-status-tag');
  var descEl = document.getElementById('dw-detail-status-desc');
  if (titleEl) titleEl.textContent = sample.title;
  if (subEl) subEl.textContent = sample.subtitle;
  if (tagEl) {
    tagEl.textContent = sample.statusLabel;
    tagEl.className = 'tag ' + (sample.statusTag || 'tag-info');
  }
  if (descEl) descEl.textContent = sample.statusDesc;

  var tb = sample.toolbars || {};
  var defBar = document.getElementById('dw-toolbar-default');
  var closeBar = document.getElementById('dw-toolbar-close');
  var approveBar = document.getElementById('dw-toolbar-approve');
  var btnReview = document.getElementById('dw-btn-review');
  var btnEdit = document.getElementById('dw-btn-edit');
  var hasDefault = !!(tb.review || tb.edit);
  if (defBar) defBar.style.display = hasDefault ? 'flex' : 'none';
  if (btnReview) btnReview.style.display = tb.review ? '' : 'none';
  if (btnEdit) btnEdit.style.display = tb.edit ? '' : 'none';
  if (closeBar) closeBar.style.display = tb.close ? 'flex' : 'none';
  if (approveBar) approveBar.style.display = tb.approve ? 'flex' : 'none';

  var btnApprove = document.getElementById('btn-approve');
  if (btnApprove) {
    var canPass = sample.approvePass !== false;
    btnApprove.disabled = !canPass;
    btnApprove.style.opacity = canPass ? '1' : '0.5';
    btnApprove.style.cursor = canPass ? 'pointer' : 'not-allowed';
    btnApprove.title = canPass ? '' : (sample.approveBlockReason || '');
  }
  var btnTicket = document.getElementById('btn-gen-ticket');
  if (btnTicket && sample.ticketNo) {
    btnTicket.setAttribute('data-param', '作业票已生成，编号：' + sample.ticketNo);
  }

  renderApprovalFlowPanel(sample);

  var grid = document.getElementById('dw-basic-info-grid');
  if (grid && sample.basic) {
    grid.innerHTML = sample.basic.map(function(row, i) {
      var span = (i >= 9) ? ' span-full' : '';
      return '<div class="dw-info-cell' + span + '"><span class="info-label">' + row[0]
        + '</span><span class="info-value">' + row[1] + '</span></div>';
    }).join('');
  }

  var appendix = document.getElementById('dw-appendix-block');
  var appendixBody = document.getElementById('dw-appendix-body');
  if (appendix) {
    appendix.style.display = sample.showAppendix ? '' : 'none';
    if (appendixBody && sample.showAppendix) appendixBody.textContent = sample.appendixText || '';
  }

  var tl = document.getElementById('dw-lifecycle-timeline');
  if (tl && sample.timeline) {
    tl.innerHTML = sample.timeline.map(buildDwTimelineItem).join('');
  }

  var certBody = document.getElementById('dw-cert-tbody');
  if (certBody && sample.cert) {
    certBody.innerHTML = sample.cert.map(function(row) {
      return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td></tr>';
    }).join('');
  }
}

function applyDetailFocus(focus) {
  var approveBar = document.getElementById('dw-toolbar-approve');
  var closeBar = document.getElementById('dw-toolbar-close');
  if (focus === 'approval') {
    if (approveBar) approveBar.style.display = 'flex';
    var tab0 = document.querySelector('#view-detail .view-tab-item');
    if (tab0) switchDetailTab('overview', tab0);
    return;
  }
  if (focus === 'close') {
    if (closeBar) closeBar.style.display = 'flex';
    var closeTab = document.querySelector('#view-detail .view-tab-item:nth-child(4)');
    if (closeTab) switchDetailTab('close', closeTab);
    return;
  }
  if (focus === 'timeline' || focus === 'review') {
    var overviewTab = document.querySelector('#view-detail .view-tab-item');
    if (overviewTab) switchDetailTab('overview', overviewTab);
    if (focus === 'review') {
      var reviewTab = document.querySelector('#view-detail .view-tab-item:nth-child(4)');
      if (reviewTab) switchDetailTab('close', reviewTab);
    }
    return;
  }
  var firstTab = document.querySelector('#view-detail .view-tab-item');
  if (firstTab) switchDetailTab('overview', firstTab);
}

function showDetail(focusOrKey, ev) {
  var btn = ev && ev.target ? ev.target.closest('[data-action]') : null;
  var workKey = btn && btn.getAttribute('data-dw-id');
  var focus = btn && btn.getAttribute('data-focus');
  var param = normalizeDwParam(focusOrKey);

  if (!workKey && param && !DW_FOCUS_MODES[param]) workKey = param;
  if (!focus && param && DW_FOCUS_MODES[param]) focus = param;
  if (!workKey) workKey = DW_DEFAULT_SAMPLE_KEY;

  renderDangerousWorkDetail(workKey);
  showView('detail');
  applyDetailFocus(focus || '');
}

/** 详情页 Tab 切换（与列表 Tab switchTab 分离） */
function switchDetailTab(name, el) {
  var root = document.getElementById('view-detail');
  if (!root) return;
  root.querySelectorAll('.view-tab-item').forEach(function(t) { t.classList.remove('active'); });
  root.querySelectorAll('.view-tab-content').forEach(function(c) { c.classList.remove('active'); });
  if (el) el.classList.add('active');
  var panel = document.getElementById('detail-tab-' + name);
  if (panel) panel.classList.add('active');
}

function backToLedger() {
  showView('list');
  switchTab('ledger');
}

function addPersonnel() {
  var input = document.getElementById('nw-applicant');
  var name = input.value.trim();
  if (!name) return;
  if (personnelList.indexOf(name) >= 0) { showToast('该人员已添加', 'warning'); return; }
  personnelList.push(name);
  renderPersonnelList();
  input.value = '';
}
function removePersonnel(name) {
  personnelList = personnelList.filter(function(n) { return n !== name; });
  renderPersonnelList();
}
function renderPersonnelList() {
  var container = document.getElementById('nw-personnel-list');
  container.innerHTML = '';
  personnelList.forEach(function(name) {
    var tag = document.createElement('span');
    tag.style.cssText = 'display:inline-flex;align-items:center;gap:4px;background:var(--primary-light,rgba(0,102,204,0.08));color:var(--primary);padding:4px 10px;border-radius:var(--radius-md);font-size:var(--font-size-13);';
    tag.innerHTML = name + ' <span style="cursor:pointer;color:var(--text-secondary);font-size:var(--font-size-14);" data-action="removePersonnel" data-param="' + name + '">&times;</span>';
    container.appendChild(tag);
  });
}

function fillNewWorkAccountContext() {
  var acc = DW_CURRENT_ACCOUNT;
  if (!acc) return;

  var unitEl = document.getElementById('nw-unit-display');
  var hintEl = document.getElementById('nw-unit-hint');
  if (unitEl) {
    unitEl.value = acc.unitParent + (acc.unitDept ? ' · ' + acc.unitDept : '');
  }
  if (hintEl) {
    var extra = acc.unitDisplay && acc.unitDisplay !== acc.unitParent
      ? '台账简称：' + acc.unitDisplay + ' · '
      : '';
    hintEl.textContent = extra + '根据当前登录账号（' + acc.userName + '，' + acc.roleLabel + '）主职自动带出，不可修改';
  }

  var applicantDisplay = document.getElementById('nw-applicant-display');
  if (applicantDisplay) applicantDisplay.value = acc.userName || '';

  var projectSel = document.getElementById('nw-project');
  if (projectSel) {
    projectSel.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '请选择';
    projectSel.appendChild(placeholder);
    if (acc.projects && acc.projects.length) {
      acc.projects.forEach(function(p) {
        var opt = document.createElement('option');
        opt.value = p.id;
        var label = p.name + (p.status ? '（' + p.status + '）' : '');
        if (p.isPrimary) label += ' · 主项目';
        opt.textContent = label;
        projectSel.appendChild(opt);
      });
    }
    projectSel.value = '';
    projectSel.disabled = false;
    projectSel.title = '请手动选择所属项目（不默认选中）';
  }
  renderNewWorkApprovalStages();
}

function openNewWorkModal() {
  NEW_WORK_FIELDS.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el || el.readOnly) return;
    el.value = '';
    if (el.tagName === 'SELECT') el.selectedIndex = 0;
  });
  personnelList = [];
  renderPersonnelList();
  fillNewWorkAccountContext();
  var nwType = document.getElementById('nw-type');
  if (nwType) switchTypeFields();
  renderNewWorkApprovalStages();
  showModal('modal-new-work');
}

function submitNewWork() {
  var name = document.getElementById('nw-name').value.trim();
  var type = document.getElementById('nw-type').value;
  var area = document.getElementById('nw-area').value;
  var projectSel = document.getElementById('nw-project');
  var projectId = projectSel ? projectSel.value : '';
  var start = document.getElementById('nw-start').value;
  var end = document.getElementById('nw-end').value;
  var content = document.getElementById('nw-content').value.trim();
  if (!name || !type || !area || !projectId || !start || !end || !content) {
    showToast('请填写所有必填项', 'error');
    return;
  }
  if (personnelList.length === 0) {
    showToast('请至少添加一名作业人员', 'error');
    return;
  }
  var approvers = collectNewWorkApproverSelections();
  for (var i = 0; i < approvers.length; i++) {
    var stageEl = document.querySelector('[data-dw-approve-stage="' + approvers[i].key + '"]');
    var required = stageEl && stageEl.getAttribute('data-dw-approve-required') === '1';
    if (required && !approvers[i].personId) {
      showToast('请选择「' + approvers[i].label + '」审批人', 'error');
      return;
    }
  }
  if (!approvers.length) {
    showToast('请完善各阶段审批人', 'error');
    return;
  }
  hideModal('modal-new-work');
  var summary = approvers.map(function(a) {
    return a.label + '：' + a.personName;
  }).join(' · ');
  showToast('作业单已提交审批（' + summary + '）', 'success');
}

function toggleDwLedgerCheckAll() {
  var master = document.getElementById('dw-check-all-ledger');
  if (!master) return;
  var checked = master.checked;
  document.querySelectorAll('.dw-ledger-check').forEach(function(cb) {
    cb.checked = checked;
  });
}

function toggleDwMonitorCheckAll() {
  var master = document.getElementById('dw-check-all-monitor');
  if (!master) return;
  var checked = master.checked;
  document.querySelectorAll('.dw-monitor-check').forEach(function(cb) {
    cb.checked = checked;
  });
}

function queryWorkList() {
  showToast('查询功能（原型演示）', 'info');
}
function resetWorkQuery() {
  document.getElementById('dw-query-name').value = '';
  var selects = document.querySelectorAll('.filter-bar select');
  selects.forEach(function(s) { s.selectedIndex = 0; });
}


function switchTypeFields() {
  var sel = document.getElementById('nw-type');
  if (!sel) return;
  var val = sel.value;
  document.querySelectorAll('.type-fields').forEach(function(el) { el.style.display = 'none'; });
  if (TYPE_FIELD_MAP[val]) {
    document.getElementById(TYPE_FIELD_MAP[val]).style.display = 'grid';
  }
  renderNewWorkApprovalStages();
}

function pauseWork() {
  showToast('开始/暂停作业请在移动端由作业人员操作（PC 只读）', 'warning');
}

function openEditWorkModal() {
  showModal('modal-edit-work');
}

function submitEditWork() {
  var reason = document.getElementById('ew-reason');
  if (reason && !reason.value.trim()) {
    showToast('请填写修改原因', 'error');
    return;
  }
  hideModal('modal-edit-work');
  showToast('已提交修改，作业单将重新进入审批', 'success');
}

function openCloseWorkModal() {
  showModal('modal-close-work');
}

function submitCloseWork() {
  hideModal('modal-close-work');
  showToast('关闭材料已提交，状态变为「待复核」', 'success');
}

function openReviewWorkModal() {
  var ta = document.getElementById('rw-opinion');
  if (ta) ta.value = '';
  showModal('modal-review-work');
}

function submitReviewWork(passed) {
  var ta = document.getElementById('rw-opinion');
  if (!ta || !ta.value.trim()) {
    showToast('请填写复核意见', 'error');
    return;
  }
  hideModal('modal-review-work');
  showToast(passed ? '复核通过，作业已关闭' : '已退回待关闭，请现场负责人补充材料', passed ? 'success' : 'warning');
}

/** 列表单元格：仅在被截断时设置 title，悬停显示完整内容 */
function getDwCellTitleText(td) {
  return (td.innerText || td.textContent || '').replace(/\s+/g, ' ').trim();
}

function bindDwTableCellTitles() {
  document.querySelectorAll('.dw-list-table tbody td').forEach(function(td) {
    if (td.classList.contains('col-check') || td.classList.contains('col-actions')) {
      td.removeAttribute('title');
      return;
    }
    var text = getDwCellTitleText(td);
    if (!text) {
      td.removeAttribute('title');
      return;
    }
    if (td.scrollWidth > td.clientWidth + 1) {
      td.setAttribute('title', text);
    } else {
      td.removeAttribute('title');
    }
  });
}

function scheduleDwTableCellTitles() {
  requestAnimationFrame(function() {
    requestAnimationFrame(bindDwTableCellTitles);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleDwTableCellTitles);
} else {
  scheduleDwTableCellTitles();
}
window.addEventListener('resize', scheduleDwTableCellTitles);

/** 事件委托：data-action → 全局函数 */
(function() {
  function handleClick(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var param = btn.getAttribute('data-param');

    switch (action) {
      case 'switchTab':
        switchTab(param);
        break;
      case 'showDetail':
        showDetail(param, e);
        break;
      case 'switchDetailTab':
        switchDetailTab(param, btn);
        break;
      case 'backToLedger':
        backToLedger();
        break;
      case 'openNewWorkModal':
        openNewWorkModal();
        break;
      case 'openEditWorkModal':
        openEditWorkModal();
        break;
      case 'openCloseWorkModal':
        openCloseWorkModal();
        break;
      case 'openReviewWorkModal':
        openReviewWorkModal();
        break;
      case 'openApprovalTransferModal':
        openApprovalTransferModal();
        break;
      case 'submitNewWork':
        submitNewWork();
        break;
      case 'submitEditWork':
        submitEditWork();
        break;
      case 'submitCloseWork':
        submitCloseWork();
        break;
      case 'submitApprovalPass':
        submitApprovalPass();
        break;
      case 'submitApprovalReject':
        submitApprovalReject();
        break;
      case 'submitApprovalTransfer':
        submitApprovalTransfer();
        break;
      case 'submitReviewWork':
        submitReviewWork(param === 'pass');
        break;
      case 'addPersonnel':
        addPersonnel();
        break;
      case 'removePersonnel':
        removePersonnel(param || '');
        break;
      case 'pauseWork':
        pauseWork();
        break;
      case 'triggerFileUpload':
        var fileInput = document.getElementById('nw-file');
        if (fileInput) fileInput.click();
        break;
      case 'toggleDwLedgerCheckAll':
        toggleDwLedgerCheckAll();
        break;
      case 'toggleDwMonitorCheckAll':
        toggleDwMonitorCheckAll();
        break;
      case 'hideModal':
        if (param) hideModal(param);
        break;
      case 'showToast':
        showToast(param || '操作成功');
        break;
    }
  }

  function handleChange(e) {
    var el = e.target;
    var action = el.getAttribute('data-action');
    if (!action) return;
    switch (action) {
      case 'switchTypeFields':
        switchTypeFields();
        renderNewWorkApprovalStages();
        break;
      case 'renderNewWorkApprovalStages':
        renderNewWorkApprovalStages();
        break;
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);

  // Backdrop click to close modals
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      hideModal(e.target.id);
    }
  });
})();
