/**
 * equipment.html - 页面交互逻辑（自动提取）
 */

// ========== 设备数据 ==========
var equipmentData = [
  { id:'EQ-001', name:'门机MH-01', model:'MQ4035', category:'起重机械', serviceLife:25, installDate:'2012-06-15', unitParent:'深圳市盐田港股份有限公司', unitDept:'安全管理与环保部', project:'盐田港区集装箱码头扩建工程', responsible:'张建国', lastInspection:'2026-05-18', nextMaint:'2026-05-20', status:'正常使用', isSpecial:true, inspFreq:'每日', inspItems:12, maintCycle:'每月', maintOrg:'中集维保', location:'1号泊位' },
  { id:'EQ-002', name:'岸桥QC-01', model:'ZPMC-65T', category:'起重机械', serviceLife:30, installDate:'2015-03-20', unitParent:'深圳市盐田港股份有限公司', unitDept:'安全管理与环保部', project:'盐田港区集装箱码头扩建工程', responsible:'李明华', lastInspection:'2026-05-20', nextMaint:'2026-06-15', status:'正常使用', isSpecial:true, inspFreq:'每日', inspItems:15, maintCycle:'每季度', maintOrg:'振华维保', location:'2号泊位' },
  { id:'EQ-003', name:'门机MH-03', model:'MQ2533', category:'起重机械', serviceLife:20, installDate:'2008-09-10', unitParent:'深圳市华舟海洋发展股份有限公司', unitDept:'安全管理与环保部', project:'华舟海洋装备修造项目', responsible:'王海涛', lastInspection:'2026-05-19', nextMaint:'2026-05-22', status:'维修中', isSpecial:true, inspFreq:'每日', inspItems:12, maintCycle:'每月', maintOrg:'自维保', location:'修造车间' },
  { id:'EQ-004', name:'集卡YT-012', model:'SITRAK C7H', category:'场内机动车辆', serviceLife:10, installDate:'2021-08-05', unitParent:'深圳市深圳港物流集团有限公司', unitDept:'安全管理与环保部', project:'前海综合枢纽运营项目', responsible:'赵志强', lastInspection:'2026-05-17', nextMaint:'2026-06-05', status:'正常使用', isSpecial:false, inspFreq:'每周', inspItems:8, maintCycle:'每季度', maintOrg:'重汽服务', location:'堆场A区' },
  { id:'EQ-005', name:'QT-001 桥式起重机', model:'QD50/10T', category:'起重机械', serviceLife:20, installDate:'2010-04-22', unitParent:'深圳市深圳港港口服务集团有限公司', unitDept:'安全管理与环保部', project:'蛇口港区旧码头改造工程', responsible:'陈国栋', lastInspection:'2026-05-20', nextMaint:'2026-06-15', status:'正常使用', isSpecial:true, inspFreq:'每周', inspItems:10, maintCycle:'每季度', maintOrg:'自维保', location:'仓库B' },
  { id:'EQ-006', name:'QT-003 电梯', model:'OTIS 3200', category:'电梯', serviceLife:15, installDate:'2018-11-30', unitParent:'深圳市深圳港港口服务集团有限公司', unitDept:'安全管理与环保部', project:'港口大厦物业管理项目', responsible:'林小燕', lastInspection:'2026-05-10', nextMaint:'2026-05-22', status:'正常使用', isSpecial:true, inspFreq:'每月', inspItems:20, maintCycle:'每半年', maintOrg:'奥的斯维保', location:'港口大厦' },
  { id:'EQ-007', name:'消防水泵组FP-01', model:'XBD12/30', category:'消防设施', serviceLife:15, installDate:'2016-07-18', unitParent:'深圳市盐田港股份有限公司', unitDept:'安全管理与环保部', project:'盐田港区智能闸口改造项目', responsible:'周伟', lastInspection:'2026-05-15', nextMaint:'2026-07-01', status:'正常使用', isSpecial:false, inspFreq:'每月', inspItems:6, maintCycle:'每半年', maintOrg:'自维保', location:'消防泵房' },
  { id:'EQ-008', name:'视频监控阵列VS-01', model:'HK-DS2CD', category:'安防设备', serviceLife:8, installDate:'2022-03-10', unitParent:'深圳市深圳港港口服务集团有限公司', unitDept:'安全管理与环保部', project:'港口大厦物业管理项目', responsible:'杨帆', lastInspection:'2026-05-16', nextMaint:'2026-08-10', status:'正常使用', isSpecial:false, inspFreq:'每周', inspItems:5, maintCycle:'每年', maintOrg:'海康服务', location:'监控中心' },
  { id:'EQ-009', name:'储气罐PV-002', model:'2m³/1.0MPa', category:'压力容器', serviceLife:10, installDate:'2019-05-25', unitParent:'深圳市深圳港能源发展有限公司', unitDept:'安全管理与环保部', project:'大鹏LNG接收站配套工程', responsible:'吴海', lastInspection:'2026-05-20', nextMaint:'2026-06-25', status:'正常使用', isSpecial:true, inspFreq:'每日', inspItems:8, maintCycle:'每月', maintOrg:'特检院', location:'LNG站区' },
  { id:'EQ-010', name:'正面吊RS-03', model:'KALMAR DCE80', category:'场内机动车辆', serviceLife:12, installDate:'2020-01-15', unitParent:'深圳市盐田港股份有限公司', unitDept:'安全管理与环保部', project:'盐田港区集装箱码头扩建工程', responsible:'孙磊', lastInspection:'2026-05-18', nextMaint:'2026-06-18', status:'停用', isSpecial:false, inspFreq:'每周', inspItems:10, maintCycle:'每季度', maintOrg:'卡尔玛服务', location:'堆场C区' },
  { id:'EQ-011', name:'门机MH-05', model:'MQ4027', category:'起重机械', serviceLife:25, installDate:'2011-02-28', unitParent:'深圳市深圳港海洋发展有限公司', unitDept:'安全管理与环保部', project:'大铲湾蓝色未来科技园运营项目', responsible:'刘强', lastInspection:'2026-05-19', nextMaint:'2026-06-20', status:'正常使用', isSpecial:true, inspFreq:'每日', inspItems:12, maintCycle:'每月', maintOrg:'中集维保', location:'大铲湾码头' },
  { id:'EQ-012', name:'消防炮塔FT-02', model:'PS40D', category:'消防设施', serviceLife:20, installDate:'2014-10-08', unitParent:'深圳市盐田港股份有限公司', unitDept:'安全管理与环保部', project:'盐田港区集装箱码头扩建工程', responsible:'黄志远', lastInspection:'2026-05-12', nextMaint:'2026-08-08', status:'正常使用', isSpecial:false, inspFreq:'每月', inspItems:4, maintCycle:'每半年', maintOrg:'自维保', location:'码头前沿' }
];

// ========== 巡检/维保模拟数据 ==========
var inspRecords = [
  { date:'2026-05-18', type:'日常巡检', person:'张建国', items:12, abnormal:0, result:'正常' },
  { date:'2026-05-17', type:'日常巡检', person:'张建国', items:12, abnormal:1, result:'异常' },
  { date:'2026-05-16', type:'日常巡检', person:'李明华', items:12, abnormal:0, result:'正常' },
  { date:'2026-05-15', type:'专项巡检', person:'张建国', items:12, abnormal:2, result:'异常' },
  { date:'2026-05-14', type:'日常巡检', person:'张建国', items:12, abnormal:0, result:'正常' },
  { date:'2026-05-13', type:'日常巡检', person:'王海涛', items:12, abnormal:0, result:'正常' }
];

var maintRecords = [
  { date:'2026-04-20', type:'常规保养', person:'中集维保组', content:'钢丝绳润滑、制动器调整、限位开关检查', cost:3500 },
  { date:'2026-03-20', type:'常规保养', person:'中集维保组', content:'液压系统检测、电气线路检查', cost:2800 },
  { date:'2026-02-20', type:'故障维修', person:'中集维保组', content:'回转减速箱异响处理、更换轴承', cost:12000 },
  { date:'2026-01-20', type:'常规保养', person:'中集维保组', content:'润滑保养、安全装置检查', cost:2500 }
];

// ========== 分页状态 ==========
var eqPage = 1;
var eqPageSize = 10;
var eqFilteredData = equipmentData.slice();
var currentDetailIndex = -1;

// ========== 视图切换 ==========
function showView(view) {
  document.querySelectorAll('.page-view').forEach(function(v) { v.classList.remove('active'); });
  var el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  if (view === 'list') renderTable();
}

function showForm(mode) {
  showView('form');
  var heading = document.getElementById('formHeading');
  if (heading) heading.textContent = mode === 'edit' ? '编辑设备' : '新增设备';
}

function switchViewTab(el, tab) {
  el.parentElement.querySelectorAll('.view-tab-item').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('.view-tab-content').forEach(function(c) { c.classList.remove('active'); });
  var content = document.getElementById('vtab-' + tab);
  if (content) content.classList.add('active');
}

// ========== 查询/重置 ==========
function queryEquipment() {
  var name = document.getElementById('eq-query-name').value.trim().toLowerCase();
  var category = document.getElementById('eq-query-category').value;
  var unitParent = document.getElementById('eq-query-unit-parent').value;
  var status = document.getElementById('eq-query-status').value;

  eqFilteredData = equipmentData.filter(function(eq) {
    if (name && eq.name.toLowerCase().indexOf(name) === -1) return false;
    if (category && category !== '全部' && eq.category !== category) return false;
    if (unitParent && unitParent !== '全部' && eq.unitParent !== unitParent) return false;
    if (status && status !== '全部' && eq.status !== status) return false;
    return true;
  });
  eqPage = 1;
  renderTable();
}

function resetEquipmentQuery() {
  document.getElementById('eq-query-name').value = '';
  document.getElementById('eq-query-category').selectedIndex = 0;
  document.getElementById('eq-query-unit-parent').selectedIndex = 0;
  document.getElementById('eq-query-unit-dept').selectedIndex = 0;
  document.getElementById('eq-query-unit-dept').disabled = true;
  document.getElementById('eq-query-project').selectedIndex = 0;
  document.getElementById('eq-query-project').disabled = true;
  document.getElementById('eq-query-status').selectedIndex = 0;
  eqFilteredData = equipmentData.slice();
  eqPage = 1;
  renderTable();
}

// ========== 表格渲染 ==========
function renderTable() {
  var tbody = document.getElementById('equipmentTableBody');
  if (!tbody) return;
  var start = (eqPage - 1) * eqPageSize;
  var pageData = eqFilteredData.slice(start, start + eqPageSize);
  var html = '';
  pageData.forEach(function(eq, i) {
    var idx = equipmentData.indexOf(eq);
    var years = new Date().getFullYear() - new Date(eq.installDate).getFullYear();
    var lifeClass = years >= eq.serviceLife ? 'life-danger' : (years >= eq.serviceLife * 0.8 ? 'life-warn' : '');
    var categoryClass = { '起重机械':'crane', '场内机动车辆':'vehicle', '压力容器':'vessel', '电梯':'elevator', '消防设施':'fire', '安防设备':'security' }[eq.category] || '';
    var statusClass = { '正常使用':'tag-success', '维修中':'tag-warning', '停用':'tag-error', '拆除报废':'tag-info' }[eq.status] || 'tag-info';
    html += '<tr>'
      + '<td class="col-check"><input type="checkbox" class="eq-check" data-idx="' + idx + '"></td>'
      + '<td class="col-index">' + (start + i + 1) + '</td>'
      + '<td><a href="javascript:void(0)" data-action="renderDetail" data-param="' + idx + '" style="color:var(--primary);">' + eq.name + '</a></td>'
      + '<td>' + eq.model + '</td>'
      + '<td><span class="category-tag category-tag-' + categoryClass + '">' + eq.category + '</span></td>'
      + '<td>' + eq.unitParent + '</td>'
      + '<td>' + (eq.project || '-') + '</td>'
      + '<td><span class="tag ' + statusClass + '">' + eq.status + '</span></td>'
      + '<td>' + eq.responsible + '</td>'
      + '<td>' + eq.serviceLife + '年</td>'
      + '<td class="' + lifeClass + '">' + eq.installDate + '</td>'
      + '<td>' + eq.lastInspection + '</td>'
      + '<td>' + eq.nextMaint + '</td>'
      + '<td class="col-actions"><div class="cell-actions">'
      + '<button class="btn btn-text btn-sm" data-action="renderDetail" data-param="' + idx + '">查看</button>'
      + '<button class="btn btn-text btn-sm" data-action="editEquipment" data-param="' + idx + '">编辑</button>'
      + '<button class="btn btn-text btn-sm" style="color:var(--warning);" data-action="openStatusChange" data-param="' + idx + '">状态</button>'
      + '</div></td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
  renderEqPagination(eqFilteredData.length);
  scheduleEqTableCellTitles();
}

function getEqCellTitleText(td) {
  var clone = td.cloneNode(true);
  clone.querySelectorAll('input,button,.cell-actions').forEach(function(el) { el.remove(); });
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function bindEqTableCellTitles() {
  var table = document.querySelector('.eq-list-table');
  if (!table) return;
  table.querySelectorAll('tbody td').forEach(function(td) {
    if (td.classList.contains('col-check') || td.classList.contains('col-actions')) {
      td.removeAttribute('title');
      return;
    }
    var text = getEqCellTitleText(td);
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

function scheduleEqTableCellTitles() {
  requestAnimationFrame(function() {
    requestAnimationFrame(bindEqTableCellTitles);
  });
}

function editEquipment(idx) {
  var eq = equipmentData[idx];
  if (!eq) return;
  showForm('edit');
  document.getElementById('cfgName').value = eq.name;
  document.getElementById('cfgModel').value = eq.model;
  document.getElementById('cfgCategory').value = eq.category;
  document.getElementById('cfgServiceLife').value = eq.serviceLife;
  document.getElementById('cfgInstallDate').value = eq.installDate;
  document.getElementById('cfgResponsible').value = eq.responsible;
  document.getElementById('cfgLocation').value = eq.location || '';
  document.getElementById('cfgIsSpecial').checked = eq.isSpecial;
  document.getElementById('cfgUnitParent').value = eq.unitParent;
  onUnitParentChange(document.getElementById('cfgUnitParent'), 'cfgUnitDept');
  setTimeout(function() {
    document.getElementById('cfgUnitDept').value = eq.unitDept || '';
    var projSel = document.getElementById('cfgProject');
    if (eq.project && projSel) {
      for (var i = 0; i < projSel.options.length; i++) {
        if (projSel.options[i].value === eq.project) { projSel.selectedIndex = i; break; }
      }
    }
  }, 0);
  document.getElementById('cfgInspFreq').value = eq.inspFreq;
  document.getElementById('cfgInspItems').value = eq.inspItems;
  document.getElementById('cfgInspPerson').value = eq.inspPerson || eq.responsible;
  document.getElementById('cfgInspContent').value = eq.inspContent || '';
  document.getElementById('cfgMaintCycle').value = eq.maintCycle;
  document.getElementById('cfgMaintNextDate').value = eq.nextMaint;
  document.getElementById('cfgMaintOrg').value = eq.maintOrg || '';
  document.getElementById('cfgMaintContent').value = eq.maintContent || '';
  document.getElementById('cfgRemark').value = eq.remark || '';
  currentDetailIndex = idx;
}

// ========== 详情渲染 ==========
function renderDetail(index) {
  currentDetailIndex = index;
  var eq = equipmentData[index];
  if (!eq) return;
  showView('detail');

  // 基本信息
  var years = new Date().getFullYear() - new Date(eq.installDate).getFullYear();
  var lifeClass = years >= eq.serviceLife ? 'life-danger' : (years >= eq.serviceLife * 0.8 ? 'life-warn' : '');
  document.getElementById('detailBasicInfo').innerHTML = ''
    + '<div class="detail-field"><div class="label">设备编号</div><div class="value">' + eq.id + '</div></div>'
    + '<div class="detail-field"><div class="label">设备名称</div><div class="value">' + eq.name + '</div></div>'
    + '<div class="detail-field"><div class="label">设备型号</div><div class="value">' + eq.model + '</div></div>'
    + '<div class="detail-field"><div class="label">设备类别</div><div class="value">' + eq.category + '</div></div>'
    + '<div class="detail-field"><div class="label">使用年限</div><div class="value">' + eq.serviceLife + '年</div></div>'
    + '<div class="detail-field"><div class="label">已使用年数</div><div class="value ' + lifeClass + '">' + years + '年</div></div>'
    + '<div class="detail-field"><div class="label">投入使用日期</div><div class="value">' + eq.installDate + '</div></div>'
    + '<div class="detail-field"><div class="label">所属单位</div><div class="value">' + eq.unitParent + '</div></div>'
    + '<div class="detail-field"><div class="label">所属项目</div><div class="value">' + (eq.project || '-') + '</div></div>'
    + '<div class="detail-field"><div class="label">责任人</div><div class="value">' + eq.responsible + '</div></div>'
    + '<div class="detail-field"><div class="label">安装位置</div><div class="value">' + (eq.location || '-') + '</div></div>'
    + '<div class="detail-field"><div class="label">设备状态</div><div class="value">' + eq.status + '</div></div>'
    + '<div class="detail-field"><div class="label">特种设备</div><div class="value">' + (eq.isSpecial ? '是' : '否') + '</div></div>';

  // 二维码区域
  document.getElementById('detailQrArea').innerHTML = ''
    + '<div class="qr-right-qrbox"><svg viewBox="0 0 100 100" width="100" height="100"><rect x="5" y="5" width="30" height="30" fill="#000"/><rect x="65" y="5" width="30" height="30" fill="#000"/><rect x="5" y="65" width="30" height="30" fill="#000"/><rect x="10" y="10" width="20" height="20" fill="#fff"/><rect x="70" y="10" width="20" height="20" fill="#fff"/><rect x="10" y="70" width="20" height="20" fill="#fff"/><rect x="14" y="14" width="12" height="12" fill="#000"/><rect x="74" y="14" width="12" height="12" fill="#000"/><rect x="14" y="74" width="12" height="12" fill="#000"/><rect x="40" y="40" width="8" height="8" fill="#000"/><rect x="52" y="40" width="8" height="8" fill="#000"/><rect x="40" y="52" width="8" height="8" fill="#000"/><rect x="52" y="52" width="8" height="8" fill="#000"/></svg></div>'
    + '<div class="qr-right-label">设备安全码</div>'
    + '<div class="qr-right-name">' + eq.id + '</div>'
    + '<div class="qr-right-actions">'
    + '<button class="btn btn-text btn-sm" data-action="showToastMsg" data-param="二维码已下载">下载</button>'
    + '<button class="btn btn-text btn-sm" data-action="showToastMsg" data-param="已发送至打印机">打印</button>'
    + '</div>';

  // 巡检计划
  document.getElementById('detailInspPlan').innerHTML = ''
    + '<div class="plan-row"><div class="plan-label">巡检频次</div><div class="plan-value">' + eq.inspFreq + '</div></div>'
    + '<div class="plan-row"><div class="plan-label">检查项数</div><div class="plan-value">' + eq.inspItems + '项</div></div>'
    + '<div class="plan-row"><div class="plan-label">最近巡检</div><div class="plan-value">' + eq.lastInspection + '</div></div>';

  // 维保计划
  document.getElementById('detailMaintPlan').innerHTML = ''
    + '<div class="plan-row"><div class="plan-label">维保周期</div><div class="plan-value">' + eq.maintCycle + '</div></div>'
    + '<div class="plan-row"><div class="plan-label">维保单位</div><div class="plan-value">' + (eq.maintOrg || '-') + '</div></div>'
    + '<div class="plan-row"><div class="plan-label">下次维保</div><div class="plan-value">' + eq.nextMaint + '</div></div>';

  // 巡检统计
  renderInspStats();
  renderInspCalendar();
  renderInspRecords();
  renderScanPanel();

  // 维保统计
  renderMaintStats();
  renderMaintAlert();
  renderMaintTimeline();
  renderMaintRecords();
}

// ========== 统计卡片 ==========
function renderStatCards() {
  var total = equipmentData.length;
  var normal = equipmentData.filter(function(e) { return e.status === '正常使用'; }).length;
  var repair = equipmentData.filter(function(e) { return e.status === '维修中'; }).length;
  var stopped = equipmentData.filter(function(e) { return e.status === '停用'; }).length;
  var el = document.getElementById('eq-stat-cards');
  if (!el) return;
  el.innerHTML = ''
    + '<div class="stat-card"><div class="stat-card-label">设备总数</div><div class="stat-card-value">' + total + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">正常使用</div><div class="stat-card-value" style="color:var(--success);">' + normal + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">维修中</div><div class="stat-card-value" style="color:var(--warning);">' + repair + '</div></div>'
    + '<div class="stat-card error"><div class="stat-card-label">停用/报废</div><div class="stat-card-value">' + stopped + '</div></div>';
}

// ========== 巡检相关 ==========
function renderInspStats() {
  var el = document.getElementById('inspStats');
  if (!el) return;
  var total = inspRecords.length;
  var abnormal = inspRecords.filter(function(r) { return r.result === '异常'; }).length;
  el.innerHTML = ''
    + '<div class="stat-card"><div class="stat-card-label">巡检总次数</div><div class="stat-card-value">' + total + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">异常次数</div><div class="stat-card-value" style="color:var(--warning);">' + abnormal + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">异常率</div><div class="stat-card-value">' + (total ? Math.round(abnormal/total*100) : 0) + '%</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">最近巡检</div><div class="stat-card-value" style="font-size:var(--font-size-16);">' + (inspRecords[0] ? inspRecords[0].date : '-') + '</div></div>';
}

function renderInspCalendar() {
  var el = document.getElementById('inspCalendar');
  if (!el) return;
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = now.getDate();
  var headers = ['日','一','二','三','四','五','六'];
  var html = '';
  headers.forEach(function(h) { html += '<div class="calendar-cell header">' + h + '</div>'; });
  for (var i = 0; i < firstDay; i++) { html += '<div class="calendar-cell"></div>'; }
  for (var d = 1; d <= daysInMonth; d++) {
    var isToday = d === today;
    var hasInsp = d <= 20 && d % 2 === 0;
    var isOverdue = d < today && d % 3 === 0;
    var isAbnormal = d === 15 || d === 17;
    html += '<div class="calendar-cell' + (isToday ? ' today' : '') + '">'
      + '<div style="font-weight:' + (isToday ? '600' : '400') + ';">' + d + '</div>';
    if (hasInsp || isOverdue || isAbnormal) {
      html += '<div>';
      if (d <= today && !isAbnormal) html += '<span class="task-dot done"></span>';
      if (isAbnormal) html += '<span class="task-dot abnormal"></span>';
      if (isOverdue) html += '<span class="task-dot overdue"></span>';
      if (d > today) html += '<span class="task-dot pending"></span>';
      html += '</div>';
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

function renderInspRecords() {
  var tbody = document.getElementById('inspRecordBody');
  if (!tbody) return;
  var html = '';
  inspRecords.forEach(function(r, i) {
    var resultClass = r.result === '正常' ? 'tag-success' : 'tag-warning';
    html += '<tr>'
      + '<td><input type="checkbox"></td>'
      + '<td>' + (i + 1) + '</td>'
      + '<td>' + r.date + '</td>'
      + '<td>' + r.type + '</td>'
      + '<td>' + r.person + '</td>'
      + '<td>' + r.items + '</td>'
      + '<td>' + r.abnormal + '</td>'
      + '<td><span class="tag ' + resultClass + '">' + r.result + '</span></td>'
      + '<td><button class="btn btn-text btn-sm" data-action="showToastMsg" data-param="巡检报告详情">详情</button></td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
}

function renderScanPanel() {
  var el = document.getElementById('inspScanPanel');
  if (!el) return;
  var checkItems = [
    { name:'金属结构检查', status:'ok', result:'正常' },
    { name:'制动系统检查', status:'ok', result:'正常' },
    { name:'钢丝绳检查', status:'warn', result:'轻微磨损' },
    { name:'电气系统检查', status:'wait', result:'待检' },
    { name:'安全装置检查', status:'wait', result:'待检' }
  ];
  var html = '<div class="scan-panel">'
    + '<div class="scan-panel-header">'
    + '<div class="scan-qr-box" data-action="showToastMsg" data-param="请使用手机扫码">扫码巡检</div>'
    + '<div class="scan-info">'
    + '<div>设备：' + (currentDetailIndex >= 0 ? equipmentData[currentDetailIndex].name : '-') + '</div>'
    + '<div>巡检人：' + (currentDetailIndex >= 0 ? equipmentData[currentDetailIndex].responsible : '-') + '</div>'
    + '<div>日期：' + new Date().toISOString().slice(0,10) + '</div>'
    + '</div></div>';
  checkItems.forEach(function(item) {
    html += '<div class="check-item">'
      + '<div class="check-icon ' + item.status + '">' + (item.status === 'ok' ? '✓' : item.status === 'warn' ? '!' : '…') + '</div>'
      + '<span>' + item.name + '</span>'
      + '<span class="check-result" style="color:' + (item.status === 'ok' ? 'var(--success)' : item.status === 'warn' ? 'var(--warning)' : 'var(--text-description)') + ';">' + item.result + '</span>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ========== 维保相关 ==========
function renderMaintStats() {
  var el = document.getElementById('maintStats');
  if (!el) return;
  var total = maintRecords.length;
  var totalCost = maintRecords.reduce(function(sum, r) { return sum + r.cost; }, 0);
  var fault = maintRecords.filter(function(r) { return r.type === '故障维修'; }).length;
  el.innerHTML = ''
    + '<div class="stat-card"><div class="stat-card-label">维保总次数</div><div class="stat-card-value">' + total + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">累计费用</div><div class="stat-card-value" style="color:var(--warning);">¥' + totalCost.toLocaleString() + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">故障维修</div><div class="stat-card-value" style="color:var(--error);">' + fault + '</div></div>'
    + '<div class="stat-card"><div class="stat-card-label">最近维保</div><div class="stat-card-value" style="font-size:var(--font-size-16);">' + (maintRecords[0] ? maintRecords[0].date : '-') + '</div></div>';
}

function renderMaintAlert() {
  var el = document.getElementById('maintAlertPanel');
  if (!el) return;
  el.innerHTML = '<h4>维保到期提醒</h4>'
    + '<div class="alert-item"><span>门机MH-01 — 下次维保 2026-05-20</span><span class="tag tag-error">已逾期</span></div>'
    + '<div class="alert-item"><span>QT-003 电梯 — 下次维保 2026-05-22</span><span class="tag tag-warning">1天内</span></div>';
}

function renderMaintTimeline() {
  var el = document.getElementById('maintTimeline');
  if (!el) return;
  var html = '';
  maintRecords.forEach(function(r) {
    var itemClass = r.type === '故障维修' ? ' error' : '';
    html += '<div class="timeline-item' + itemClass + '">'
      + '<div class="timeline-date">' + r.date + '</div>'
      + '<div class="timeline-title">' + r.type + ' — ' + r.person + '</div>'
      + '<div class="timeline-desc">' + r.content + '（¥' + r.cost.toLocaleString() + '）</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

function renderMaintRecords() {
  var tbody = document.getElementById('maintRecordBody');
  if (!tbody) return;
  var html = '';
  maintRecords.forEach(function(r, i) {
    html += '<tr>'
      + '<td><input type="checkbox"></td>'
      + '<td>' + (i + 1) + '</td>'
      + '<td>' + r.date + '</td>'
      + '<td>' + r.type + '</td>'
      + '<td>' + r.person + '</td>'
      + '<td>' + r.content + '</td>'
      + '<td>¥' + r.cost.toLocaleString() + '</td>'
      + '<td><button class="btn btn-text btn-sm" data-action="showToastMsg" data-param="维保报告详情">详情</button></td>'
      + '</tr>';
  });
  tbody.innerHTML = html;
}

// ========== 表单提交 ==========
function submitEquipmentForm() {
  var name = document.getElementById('cfgName').value.trim();
  var model = document.getElementById('cfgModel').value.trim();
  var category = document.getElementById('cfgCategory').value;
  var serviceLife = document.getElementById('cfgServiceLife').value;
  var installDate = document.getElementById('cfgInstallDate').value;
  var responsible = document.getElementById('cfgResponsible').value.trim();

  if (!name) { showToast('请输入设备名称', 'warning'); return; }
  if (!model) { showToast('请输入设备型号', 'warning'); return; }
  if (!category) { showToast('请选择设备类别', 'warning'); return; }
  if (!serviceLife) { showToast('请输入使用年限', 'warning'); return; }
  if (!installDate) { showToast('请选择投入使用日期', 'warning'); return; }
  if (!responsible) { showToast('请输入设备责任人', 'warning'); return; }

  if (currentDetailIndex >= 0) {
    var eq = equipmentData[currentDetailIndex];
    eq.name = name;
    eq.model = model;
    eq.category = category;
    eq.serviceLife = parseInt(serviceLife);
    eq.installDate = installDate;
    eq.responsible = responsible;
    eq.location = document.getElementById('cfgLocation').value.trim();
    eq.isSpecial = document.getElementById('cfgIsSpecial').checked;
    eq.inspFreq = document.getElementById('cfgInspFreq').value;
    eq.inspItems = parseInt(document.getElementById('cfgInspItems').value) || 0;
    eq.maintCycle = document.getElementById('cfgMaintCycle').value;
    eq.nextMaint = document.getElementById('cfgMaintNextDate').value;
    eq.maintOrg = document.getElementById('cfgMaintOrg').value.trim();
    showToast('设备信息已更新', 'success');
  } else {
    var newId = 'EQ-' + String(equipmentData.length + 1).padStart(3, '0');
    equipmentData.push({
      id: newId, name: name, model: model, category: category,
      serviceLife: parseInt(serviceLife), installDate: installDate,
      unitParent: document.getElementById('cfgUnitParent').value || '深圳港集团',
      unitDept: '', project: '', responsible: responsible,
      lastInspection: '-', nextMaint: document.getElementById('cfgMaintNextDate').value || '-',
      status: '正常使用', isSpecial: document.getElementById('cfgIsSpecial').checked,
      inspFreq: document.getElementById('cfgInspFreq').value,
      inspItems: parseInt(document.getElementById('cfgInspItems').value) || 0,
      maintCycle: document.getElementById('cfgMaintCycle').value,
      maintOrg: document.getElementById('cfgMaintOrg').value.trim() || '',
      location: document.getElementById('cfgLocation').value.trim()
    });
    showToast('设备已添加', 'success');
  }
  eqFilteredData = equipmentData.slice();
  currentDetailIndex = -1;
  showView('list');
  renderStatCards();
}

// ========== 弹窗操作 ==========
function openAddInspRecord() {
  document.getElementById('insp-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('insp-type').value = '';
  document.getElementById('insp-person').value = '';
  document.getElementById('insp-items').value = '12';
  document.getElementById('insp-abnormal').value = '0';
  document.getElementById('insp-note').value = '';
  openModal('modal-insp');
}

function openAddMaintRecord() {
  document.getElementById('maint-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('maint-type').value = '';
  document.getElementById('maint-person').value = '';
  document.getElementById('maint-cost').value = '';
  document.getElementById('maint-content').value = '';
  document.getElementById('maint-remark').value = '';
  openModal('modal-maint');
}

function submitInspRecord() {
  var date = document.getElementById('insp-date').value;
  var type = document.getElementById('insp-type').value;
  var person = document.getElementById('insp-person').value.trim();
  if (!date || !type || !person) { showToast('请填写完整巡检信息', 'warning'); return; }
  var abnormal = parseInt(document.getElementById('insp-abnormal').value) || 0;
  inspRecords.unshift({ date: date, type: type, person: person, items: parseInt(document.getElementById('insp-items').value) || 0, abnormal: abnormal, result: abnormal > 0 ? '异常' : '正常' });
  closeModal('modal-insp');
  showToast('巡检记录已保存', 'success');
  if (currentDetailIndex >= 0) {
    renderInspStats();
    renderInspRecords();
  }
}

function submitMaintRecord() {
  var date = document.getElementById('maint-date').value;
  var type = document.getElementById('maint-type').value;
  var person = document.getElementById('maint-person').value.trim();
  var content = document.getElementById('maint-content').value.trim();
  if (!date || !type || !person || !content) { showToast('请填写完整维保信息', 'warning'); return; }
  var cost = parseInt(document.getElementById('maint-cost').value) || 0;
  maintRecords.unshift({ date: date, type: type, person: person, content: content, cost: cost });
  closeModal('modal-maint');
  showToast('维保记录已保存', 'success');
  if (currentDetailIndex >= 0) {
    renderMaintStats();
    renderMaintTimeline();
    renderMaintRecords();
  }
}

function openStatusChange(idx) {
  var eq = equipmentData[idx];
  if (!eq) return;
  document.getElementById('status-eq-name').textContent = eq.name + '（' + eq.id + '）';
  document.getElementById('status-new').value = '';
  document.getElementById('status-reason').value = '';
  currentDetailIndex = idx;
  openModal('modal-status');
}

function submitStatusChange() {
  var newStatus = document.getElementById('status-new').value;
  var reason = document.getElementById('status-reason').value.trim();
  if (!newStatus) { showToast('请选择变更后状态', 'warning'); return; }
  if (!reason) { showToast('请输入变更原因', 'warning'); return; }
  if (currentDetailIndex >= 0) {
    equipmentData[currentDetailIndex].status = newStatus;
    showToast('设备状态已变更为：' + newStatus, 'success');
  }
  closeModal('modal-status');
  renderTable();
  renderStatCards();
}

// ========== 到期提醒Tab切换 ==========
function switchExpiryTab(tab) {
  document.getElementById('expiry-tab-insp').classList.toggle('active', tab === 'insp');
  document.getElementById('expiry-tab-maint').classList.toggle('active', tab === 'maint');
  document.getElementById('expiry-content-insp').classList.toggle('active', tab === 'insp');
  document.getElementById('expiry-content-maint').classList.toggle('active', tab === 'maint');
}

// ========== 组织级联选择 ==========
function onUnitParentChange(parentSel, projectSelId) {
  var parentName = parentSel.value;
  var projectSel = document.getElementById(projectSelId);
  if (!projectSel) return;

  // 下属部门联动
  var deptSel = null;
  if (projectSelId === 'eq-query-unit-dept') {
    deptSel = document.getElementById('eq-query-unit-dept');
  } else if (projectSelId === 'cfgUnitDept') {
    deptSel = document.getElementById('cfgUnitDept');
  }
  if (deptSel) {
    deptSel.disabled = !parentName || parentName === '全部';
    deptSel.innerHTML = '<option value="">全部</option>';
    if (parentName && parentName !== '全部') {
      var unit = findOrgUnit(orgUnits, parentName);
      if (unit && unit.children) {
        unit.children.forEach(function(child) {
          var opt = document.createElement('option');
          opt.value = child.name;
          opt.textContent = child.name;
          deptSel.appendChild(opt);
        });
      }
    }
  }

  // 项目联动
  projectSel.disabled = !parentName || parentName === '全部';
  projectSel.innerHTML = '<option value="">全部</option>';
  if (parentName && parentName !== '全部' && projectList[parentName]) {
    projectList[parentName].forEach(function(p) {
      var opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      projectSel.appendChild(opt);
    });
  }
}

function findOrgUnit(units, name) {
  for (var i = 0; i < units.length; i++) {
    if (units[i].name === name) return units[i];
    if (units[i].children) {
      var found = findOrgUnit(units[i].children, name);
      if (found) return found;
    }
  }
  return null;
}

// ========== 分页 ==========
function changeEqPageSize() {
  eqPageSize = parseInt(document.getElementById('eq-page-size').value) || 10;
  eqPage = 1;
  renderTable();
}

function goEqPage() {
  var val = parseInt(document.getElementById('eq-jump-page').value) || 1;
  var total = Math.ceil(eqFilteredData.length / eqPageSize);
  eqPage = Math.max(1, Math.min(val, total));
  renderTable();
}

function renderEqPagination(total) {
  var el = document.getElementById('eq-pagination');
  var info = document.getElementById('eq-page-info');
  if (!el) return;
  var pages = Math.ceil(total / eqPageSize);
  if (info) info.textContent = '共 ' + total + ' 条';
  var html = '';
  html += '<button class="pagination-btn"' + (eqPage <= 1 ? ' disabled' : '') + ' data-action="eqPagePrev">&laquo;</button>';
  for (var i = 1; i <= pages; i++) {
    if (pages > 7 && Math.abs(i - eqPage) > 2 && i !== 1 && i !== pages) {
      if (i === eqPage - 3 || i === eqPage + 3) html += '<span class="pagination-ellipsis">...</span>';
      continue;
    }
    html += '<button class="pagination-btn' + (i === eqPage ? ' active' : '') + '" data-action="eqPageGoto" data-param="' + i + '">' + i + '</button>';
  }
  html += '<button class="pagination-btn"' + (eqPage >= pages ? ' disabled' : '') + ' data-action="eqPageNext">&raquo;</button>';
  el.innerHTML = html;
}

// ========== 全选 ==========
function toggleCheckAll() {
  var checked = document.getElementById('checkAll').checked;
  document.querySelectorAll('.eq-check').forEach(function(cb) { cb.checked = checked; });
}
function toggleInspCheckAll() {
  var checked = event.target.checked;
  document.querySelectorAll('#inspRecordBody input[type=checkbox]').forEach(function(cb) { cb.checked = checked; });
}
function toggleMaintCheckAll() {
  var checked = event.target.checked;
  document.querySelectorAll('#maintRecordBody input[type=checkbox]').forEach(function(cb) { cb.checked = checked; });
}

// ========== 初始化 ==========
function initOrgCascade() {
  // 填充查询区所属单位下拉
  var parentSels = [document.getElementById('eq-query-unit-parent'), document.getElementById('cfgUnitParent')];
  parentSels.forEach(function(sel) {
    if (!sel) return;
    var existing = {};
    for (var i = 0; i < sel.options.length; i++) existing[sel.options[i].value] = true;
    orgUnits[0].children.forEach(function(child) {
      if (!existing[child.name]) {
        var opt = document.createElement('option');
        opt.value = child.name;
        opt.textContent = child.name;
        sel.appendChild(opt);
      }
    });
  });
}

// 页面加载
window.addEventListener('resize', scheduleEqTableCellTitles);

document.addEventListener('DOMContentLoaded', function() {
  initOrgCascade();
  renderStatCards();
  eqFilteredData = equipmentData.slice();
  renderTable();

  // data-action 委托
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var param = btn.getAttribute('data-param');
    switch (action) {
      case 'queryEquipment': queryEquipment(); break;
      case 'resetEquipmentQuery': resetEquipmentQuery(); break;
      case 'showForm':
        var mode = String(param || '').replace(/'/g, '');
        showForm(mode);
        break;
      case 'showView':
        var view = String(param || '').replace(/'/g, '');
        showView(view);
        break;
      case 'switchViewTab':
        var tab = String(param || '').replace(/'/g, '');
        switchViewTab(btn, tab);
        break;
      case 'openAddInspRecord': openAddInspRecord(); break;
      case 'openAddMaintRecord': openAddMaintRecord(); break;
      case 'submitEquipmentForm': submitEquipmentForm(); break;
      case 'renderDetail': renderDetail(parseInt(param)); break;
      case 'editEquipment': editEquipment(parseInt(param)); break;
      case 'openStatusChange': openStatusChange(parseInt(param)); break;
      case 'showToastMsg': showToast(param); break;
      case 'eqPagePrev': eqPage--; renderTable(); break;
      case 'eqPageNext': eqPage++; renderTable(); break;
      case 'eqPageGoto': eqPage = parseInt(param); renderTable(); break;
    }
  });
});
