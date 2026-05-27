/** 组织保障 — 数据层（§3.13.1 全量读取后仅展示单位） */

var SB_DUTY_TO_POST = {
  '主任': '安全生产第一责任人',
  '副主任': '安全生产分管领导',
  '委员': '安委会委员',
  '干事': '安全管理人员',
  '安全员': '安全管理人员'
};

/** 从 §3.13.1 全量树中筛出仅「单位」节点（保留单位层级，剔除部门） */
function sbFilterUnitsOnly(nodes) {
  var result = [];
  (nodes || []).forEach(function(n) {
    if (n.type === '单位') {
      var u = { id: n.id, name: n.name, type: '单位' };
      var kids = sbFilterUnitsOnly(n.children);
      if (kids.length) u.children = kids;
      result.push(u);
    } else if (n.children && n.children.length) {
      result = result.concat(sbFilterUnitsOnly(n.children));
    }
  });
  return result;
}

function sbPickOrgFields(nodes) {
  return (nodes || []).map(function(n) {
    var o = { id: n.id, name: n.name, type: n.type };
    if (n.children && n.children.length) o.children = sbPickOrgFields(n.children);
    return o;
  });
}

/** 左侧单位树：读取组织架构全量数据（与 system-admin/user-data.js orgList 同源） */
var sbOrgSourceFull = typeof orgList !== 'undefined'
  ? sbPickOrgFields(orgList)
  : sbPickOrgFields([
    { id: 'group', name: '深圳港集团', type: '单位', children: [
      { id: 'd01', name: '安全管理与环保部', type: '部门' },
      { id: 'u01', name: '深圳市盐田港股份有限公司', type: '单位' },
      { id: 'u03', name: '深圳市深圳港物流集团有限公司', type: '单位' },
      { id: 'u05', name: '深圳市深圳港能源发展有限公司', type: '单位' }
    ]}
  ]);

var sbOrgTree = sbFilterUnitsOnly(sbOrgSourceFull);

var sbSafetyOrgByUnit = {
  group: {
    unitName: '深圳港集团（集团本部）',
    isGroupLevel: true,
    publishStatus: 'effective',
    pendingApproval: false,
    committee: {
      name: '集团安全生产委员会',
      duty: '负责集团安全生产工作的统筹规划、组织协调和监督管理，研究决定安全生产重大事项。',
      members: [
        { userId: 'u001', name: '张董事长', duty: '主任' },
        { userId: 'u002', name: '刘副总经理', duty: '副主任' },
        { userId: 'u003', name: '赵部长', duty: '委员' }
      ]
    },
    office: {
      name: '集团安全生产委员会办公室',
      duty: '承担安委会日常工作，组织实施检查、培训、应急与隐患治理。',
      attachNote: '挂靠集团安全管理与环保部（文字说明，不绑定组织节点）',
      members: [
        { userId: 'u003', name: '赵部长', duty: '主任' },
        { userId: 'u010', name: '孙主管', duty: '干事' }
      ]
    }
  },
  u03: {
    unitName: '深圳市深圳港物流集团有限公司',
    isGroupLevel: false,
    publishStatus: 'effective',
    pendingApproval: true,
    pendingHint: '2026-05-20 已提交变更，待集团安全管理部审批',
    committee: {
      name: '物流集团安全生产委员会',
      duty: '负责本单位安全生产决策与重大事项协调。',
      members: [
        { userId: 'u101', name: '李总经理', duty: '主任' },
        { userId: 'u102', name: '钱副总经理', duty: '副主任' }
      ]
    },
    office: {
      name: '物流集团安全生产委员会办公室',
      duty: '落实安委会决议，组织现场管理与隐患排查。',
      attachNote: '挂靠本单位安全管理与环保部',
      members: [
        { userId: 'u102', name: '钱副总经理', duty: '主任' },
        { userId: 'u103', name: '周安全员', duty: '安全员' }
      ]
    }
  },
  u05: {
    unitName: '深圳市深圳港能源发展有限公司',
    isGroupLevel: false,
    publishStatus: 'effective',
    pendingApproval: false,
    committee: {
      name: '能源公司安全生产委员会',
      duty: '负责危化品与能源板块安全生产管理。',
      members: [{ userId: 'u201', name: '王总经理', duty: '主任' }]
    },
    office: {
      name: '能源公司安全生产委员会办公室',
      duty: '承担安委会日常办事机构职能。',
      attachNote: '挂靠本单位安全管理与环保部',
      members: [{ userId: 'u202', name: '吴主任', duty: '主任' }]
    }
  },
  u01: {
    unitName: '深圳市盐田港股份有限公司',
    isGroupLevel: false,
    publishStatus: 'none',
    pendingApproval: false,
    committee: null,
    office: null
  }
};

var sbUserPickerOptions = [
  { id: 'u001', label: '张董事长' },
  { id: 'u002', label: '刘副总经理' },
  { id: 'u003', label: '赵部长' },
  { id: 'u010', label: '孙主管' },
  { id: 'u101', label: '李总经理' },
  { id: 'u102', label: '钱副总经理' },
  { id: 'u103', label: '周安全员' },
  { id: 'u201', label: '王总经理' },
  { id: 'u202', label: '吴主任' }
];

var SB_DUTY_OPTIONS = ['主任', '副主任', '委员', '干事', '安全员'];
