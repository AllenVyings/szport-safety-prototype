var currentPersonnelUnitId = '';
var currentPersonnelProjectId = '';

var personnelList = [
  { id: 'p1', projectId: 'proj-1', name: '张建国', unitName: '深圳市盐田港股份有限公司', position: '项目经理', cert: '注册安全工程师', certExpiryDate: '2026-08-15', phone: '13900139001', entryDate: '2025-03-01', exitDate: '', active: true, remark: '' },
  { id: 'p2', projectId: 'proj-1', name: '李施工', unitName: '深圳市盐田港股份有限公司', position: '现场施工员', cert: '安全员证', certExpiryDate: '2026-06-10', phone: '13900139002', entryDate: '2025-04-15', exitDate: '', active: true, remark: '' },
  { id: 'p3', projectId: 'proj-1', name: '王操作', unitName: '深圳市盐田港股份有限公司', position: '塔吊操作员', cert: '起重机操作证', certExpiryDate: '2026-05-20', phone: '13900139003', entryDate: '2025-05-01', exitDate: '2026-02-28', active: false, remark: '资质到期' },
  { id: 'p4', projectId: 'proj-2', name: '孙管理', unitName: '深圳市深圳港海洋发展有限公司', position: '项目负责人', cert: '', certExpiryDate: '', phone: '13900139004', entryDate: '2022-01-01', exitDate: '', active: true, remark: '' },
  { id: 'p5', projectId: 'proj-2', name: '钱安全', unitName: '深圳市深圳港海洋发展有限公司', position: '安全员', cert: '注册安全工程师', certExpiryDate: '2027-03-01', phone: '13900139005', entryDate: '2022-02-01', exitDate: '', active: true, remark: '' },
  { id: 'p6', projectId: 'proj-3', name: '周规划', unitName: '深圳市深圳港海洋发展有限公司', position: '项目经理', cert: '一级建造师', certExpiryDate: '2026-06-30', phone: '13900139006', entryDate: '2026-07-01', exitDate: '', active: true, remark: '' },
  { id: 'p7', projectId: 'proj-3', name: '吴安全', unitName: '深圳市深圳港海洋发展有限公司', position: '安全总监', cert: '注册安全工程师', certExpiryDate: '2028-01-15', phone: '13900139007', entryDate: '2026-07-01', exitDate: '', active: true, remark: '' },
  { id: 'p8', projectId: 'proj-4', name: '冯安全', unitName: '深圳市深圳港物流集团有限公司', position: '安全工程师', cert: '安全工程师证', certExpiryDate: '2026-04-15', phone: '13900139008', entryDate: '2023-06-01', exitDate: '2026-04-30', active: false, remark: '' },
  { id: 'p9', projectId: 'proj-5', name: '李工程', unitName: '深圳市盐田港股份有限公司', position: '项目负责人', cert: '一级建造师', certExpiryDate: '2027-09-01', phone: '13900139009', entryDate: '2025-09-01', exitDate: '', active: true, remark: '' },
  { id: 'p10', projectId: 'proj-5', name: '王安全', unitName: '深圳市盐田港股份有限公司', position: '安全总监', cert: '注册安全工程师', certExpiryDate: '2026-06-01', phone: '13900139010', entryDate: '2025-09-01', exitDate: '', active: true, remark: '' },
  { id: 'p11', projectId: 'proj-6', name: '陈运营', unitName: '深圳市华舟海洋发展股份有限公司', position: '运营经理', cert: '', certExpiryDate: '', phone: '13900139011', entryDate: '2021-06-01', exitDate: '', active: true, remark: '' },
  { id: 'p12', projectId: 'proj-6', name: '林安全', unitName: '深圳市华舟海洋发展股份有限公司', position: '安全主管', cert: '安全管理人员证', certExpiryDate: '2026-07-20', phone: '13900139012', entryDate: '2021-06-01', exitDate: '', active: true, remark: '' }
];
