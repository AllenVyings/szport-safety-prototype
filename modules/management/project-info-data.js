var CERT_EXPIRY_WARN_DAYS = 30;

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getUnitsFromOrg(nodes) {
  var units = [];
  for (var i = 0; nodes && i < nodes.length; i++) {
    var n = nodes[i];
    if (n.type === '单位') { units.push(n); }
  }
  return units;
}

function findOrgById(id) {
  function find(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
      if (nodes[i].children) {
        var found = find(nodes[i].children);
        if (found) return found;
      }
    }
    return null;
  }
  return find(orgList);
}

var projectList = [
  { id: 'proj-1', name: '盐田港区集装箱码头扩建工程', unitId: 'u01', unitName: '深圳市盐田港股份有限公司', type: '在建', status: '在建', manager: '刘工程', safetyOfficer: '赵安全', address: '深圳市盐田区深盐路128号', startDate: '2025-03-01', endDate: '2027-06-30', remark: '项目规划建设3个10万吨级集装箱泊位，配套后方堆场及附属设施。' },
  { id: 'proj-2', name: '前海综合枢纽运营项目', unitId: 'u02', unitName: '深圳市深圳港海洋发展有限公司', type: '在营', status: '运营', manager: '孙管理', safetyOfficer: '钱安全', address: '深圳市宝安区大铲湾港区', startDate: '2022-01-01', endDate: '', remark: '前海综合枢纽商业运营及物业管理项目。' },
  { id: 'proj-3', name: '大铲湾危化品仓储基地建设', unitId: 'u02', unitName: '深圳市深圳港海洋发展有限公司', type: '在建', status: '筹建', manager: '周规划', safetyOfficer: '吴安全', address: '深圳市宝安区大铲湾三期', startDate: '2026-07-01', endDate: '2028-12-31', remark: '新建危化品仓储基地，含甲类仓库2座、乙类仓库3座。' },
  { id: 'proj-4', name: '蛇口港区旧码头改造工程', unitId: 'u03', unitName: '深圳市深圳港物流集团有限公司', type: '在建', status: '在建', manager: '郑项目', safetyOfficer: '冯安全', address: '深圳市南山区蛇口港区', startDate: '2023-06-01', endDate: '2026-04-30', remark: '旧码头结构加固及装卸设备更新改造。' },
  { id: 'proj-5', name: '盐田港东港区一期工程', unitId: 'u01', unitName: '深圳市盐田港股份有限公司', type: '在建', status: '在建', manager: '李工程', safetyOfficer: '王安全', address: '深圳市盐田区盐田港东港区', startDate: '2025-09-01', endDate: '2028-06-30', remark: '新建5万吨级多用途泊位2个。' },
  { id: 'proj-6', name: '华舟拖轮基地运营项目', unitId: 'u04', unitName: '深圳市华舟海洋发展股份有限公司', type: '在营', status: '运营', manager: '陈运营', safetyOfficer: '林安全', address: '深圳市南山区妈湾港区', startDate: '2021-06-01', endDate: '', remark: '拖轮调度基地日常运营及安全管理。' }
];

var currentUnitId = '';
var currentStatFilter = '';
