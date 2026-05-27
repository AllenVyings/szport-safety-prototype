/** dangerous-work.html - 数据层（从内联脚本提取） */

var personnelList = [];

var TAB_MAP = {'ledger':0, 'monitor':1};

var TYPE_FIELD_MAP = {
  '动火作业': 'fields-fire',
  '受限空间': 'fields-confined',
  '吊装作业': 'fields-hoist',
  '登高作业': 'fields-height',
  '临时用电': 'fields-electric',
  '动土作业': 'fields-excavate'
};

var NEW_WORK_FIELDS = ['nw-name','nw-type','nw-area','nw-applicant','nw-start','nw-end','nw-guardian','nw-project','nw-content','nw-camera'];

/**
 * §3.13.6 默认审批链：按发起单位职务池 + 作业类型（及动火等级）匹配节点
 * 正式环境由基础配置「默认审批链」+ 单位组织树接口下发
 */
var DW_APPROVAL_PERSON_POOL = {
  dept: [
    { id: 'li-safe', name: '李安全', title: '部门负责人' },
    { id: 'chen-safe', name: '陈安全', title: '安全管理人员' },
    { id: 'zhao-safe', name: '赵安全', title: '现场安全员' }
  ],
  company: [
    { id: 'wang-super', name: '王安监', title: '公司安办' },
    { id: 'zhou-super', name: '周安监', title: '公司安办' }
  ],
  safetyMgmt: [
    { id: 'wang-super', name: '王安监', title: '安全管理部门' },
    { id: 'zhou-super', name: '周安监', title: '安全管理部门' }
  ],
  review: [
    { id: 'li-safe', name: '李安全', title: '安全工程师' },
    { id: 'wang-gong', name: '王工', title: '安全工程师' },
    { id: 'chen-safe', name: '陈安全', title: '安全工程师' }
  ]
};

/** 作业类型 → 审批节点（同一单位下按类型区分，与 PRD D-1～D-7 对齐） */
var DW_APPROVAL_CHAIN_BY_TYPE = {
  '动火作业': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'zhao-safe' },
    { key: 'company', label: '公司安办审批', poolKey: 'company', required: true, defaultId: 'wang-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: 'li-safe' }
  ],
  '受限空间': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'chen-safe' },
    { key: 'safety', label: '安全管理部门', poolKey: 'safetyMgmt', required: true, defaultId: 'wang-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: 'li-safe' }
  ],
  '登高作业': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'chen-safe' },
    { key: 'company', label: '公司安办审批', poolKey: 'company', required: true, defaultId: 'wang-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: 'chen-safe' }
  ],
  '临时用电': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'li-safe' },
    { key: 'company', label: '公司安办审批', poolKey: 'company', required: true, defaultId: 'wang-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: '' }
  ],
  '吊装作业': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'li-safe' },
    { key: 'safety', label: '安全管理部门', poolKey: 'safetyMgmt', required: true, defaultId: 'wang-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: 'li-safe' }
  ],
  '动土作业': [
    { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'li-safe' },
    { key: 'company', label: '公司安办审批', poolKey: 'company', required: true, defaultId: 'zhou-super' },
    { key: 'review', label: '安全复核', poolKey: 'review', required: false, defaultId: '' }
  ]
};

/** 动火三级（二级动火）— 对应基础配置「简化审批」 */
var DW_APPROVAL_CHAIN_FIRE_SIMPLIFIED = [
  { key: 'dept', label: '部门审批', poolKey: 'dept', required: true, defaultId: 'zhao-safe' },
  { key: 'company', label: '公司安办审批', poolKey: 'company', required: true, defaultId: 'wang-super' }
];

/**
 * 原型：当前登录账号主职（数据范围 = 所属单位本级及下属；作业单归属该单位/项目）
 * 正式环境由会话接口返回 unitId / projectId 等
 */
var DW_CURRENT_ACCOUNT = {
  userName: '周建华',
  roleLabel: '现场负责人',
  unitParent: '深圳市盐田港股份有限公司',
  unitDept: '安全管理与环保部',
  unitDisplay: '散货码头公司',
  projects: [
    { id: 'proj-dw-1', name: '散货码头改造工程', status: '在建', isPrimary: true },
    { id: 'proj-dw-2', name: '盐田港区集装箱码头扩建工程', status: '在建', isPrimary: false }
  ]
};

/** 台账行 → 详情样例（data-dw-id） */
var DW_WORK_SAMPLES = {
  impl: {
    title: '3号泊位受限空间作业',
    subtitle: '作业单号 SZP-DW-20260516-003 · 受限空间 · 3号泊位',
    statusLabel: '实施中',
    statusTag: 'tag-warning',
    statusDesc: '作业交底已完成 · 实施中（开工/暂停请在移动端操作）· 已持续 9 小时',
    ticketNo: 'SZP-DW-20260516-003',
    toolbars: { review: false, edit: true, close: false, approve: false },
    approvePass: true,
    showAppendix: false,
    appendixText: '',
    basic: [
      ['作业名称', '3号泊位受限空间作业'],
      ['作业类型', '受限空间'],
      ['作业区域', '3号泊位'],
      ['作业单号', 'SZP-DW-20260516-003'],
      ['作业人员', '张明、王磊'],
      ['监护人', '李安全'],
      ['计划开始', '2026-05-16 08:00'],
      ['计划结束', '2026-05-16 17:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '3号泊位检修工程'],
      ['阶段审批人', '部门审批：李安全 · 公司安办：王安监 · 安全复核：李安全'],
      ['关联视频', '<span class="u-text-primary">CAM-03（受限空间作业面）</span>']
    ],
    cert: [
      ['张明', '受限空间作业证', '有效', '2027-03'],
      ['王磊', '受限空间作业证', '有效', '2027-06'],
      ['李安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '张明 · 2026-05-14 09:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动 · 2026-05-14 09:01' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '李安全 · 2026-05-14 11:00', opinion: '意见：通风与气体检测方案已落实。' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-14 15:30' },
      { state: 'done', title: '作业交底', tag: '已完成', tagClass: 'tag-success', meta: '现场负责人 李安全 · 2026-05-15 16:00' },
      { state: 'current', title: '实施', tag: '进行中', tagClass: 'tag-warning', meta: '作业人员 张明等 · 2026-05-16 08:00 起' },
      { state: 'pending', title: '作业关闭', tag: '待处理', tagClass: 'tag-info', meta: '现场负责人提交关闭材料' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '安全工程师 李安全' }
    ]
  },
  'approval-bad': {
    title: '3号泊位动火作业',
    subtitle: '作业单号 SZP-DW-20260517-002 · 动火作业 · 3号泊位 · 二级',
    statusLabel: '待审批',
    statusTag: 'tag-info',
    statusDesc: '持证不符阻断审批通过 · 已等待 28 小时 · 作业时间 2026-05-17 09:00~16:00',
    ticketNo: 'SZP-DW-20260517-002',
    toolbars: { review: false, edit: true, close: false, approve: true },
    approvePass: false,
    approveBlockReason: '存在持证不符，无法审批通过',
    approvalFlow: {
      workType: '动火作业',
      stages: [
        { key: 'dept', label: '部门审批', status: 'current', assignee: '赵安全', assigneeId: 'zhao-safe' },
        { key: 'company', label: '公司安办审批', status: 'pending', assignee: '王安监', assigneeId: 'wang-super' }
      ]
    },
    showAppendix: false,
    appendixText: '',
    basic: [
      ['作业名称', '3号泊位动火作业'],
      ['作业类型', '动火作业 · 二级'],
      ['作业区域', '3号泊位'],
      ['作业单号', 'SZP-DW-20260517-002'],
      ['作业人员', '王强、李明'],
      ['监护人', '赵安全'],
      ['计划开始', '2026-05-17 09:00'],
      ['计划结束', '2026-05-17 16:00'],
      ['持证校验', '<span class="tag" style="background:rgba(209,0,0,0.1);color:var(--error);">存在持证不符</span>'],
      ['关联项目', '—'],
      ['阶段审批人', '部门审批：赵安全 · 公司安办：王安监'],
      ['关联视频', '—']
    ],
    cert: [
      ['王强', '动火作业证', '<span class="u-text-error">已过期</span>', '2026-04'],
      ['李明', '动火作业证', '有效', '2027-06'],
      ['赵安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '王强 · 2026-05-16 14:00' },
      { state: 'done', title: '持证校验', tag: '不通过', tagClass: 'tag', tagStyle: 'background:rgba(209,0,0,0.1);color:var(--error);', meta: '王强动火证已过期 · 2026-05-16 14:01' },
      { state: 'current', title: '部门审批', tag: '待审批', tagClass: 'tag-info', meta: '赵安全 · 待处理' },
      { state: 'pending', title: '公司安办', tag: '待处理', tagClass: 'tag-info', meta: '王安监' },
      { state: 'pending', title: '作业交底', tag: '待处理', tagClass: 'tag-info', meta: '审批通过后' },
      { state: 'pending', title: '实施', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业关闭', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '' }
    ]
  },
  approval: {
    title: '油罐区动火作业',
    subtitle: '作业单号 SZP-DW-20260518-001 · 动火作业 · 油罐区 · 一级',
    statusLabel: '待审批',
    statusTag: 'tag-info',
    statusDesc: '公司安办审批中 · 已等待 5 小时 · 作业时间 2026-05-18 09:00~16:00',
    ticketNo: 'SZP-DW-20260518-001',
    toolbars: { review: false, edit: true, close: false, approve: true },
    approvePass: true,
    approvalFlow: {
      workType: '动火作业',
      stages: [
        { key: 'dept', label: '部门审批', status: 'done', assignee: '赵安全', assigneeId: 'zhao-safe' },
        { key: 'company', label: '公司安办审批', status: 'current', assignee: '王安监', assigneeId: 'wang-super' },
        { key: 'review', label: '安全复核', status: 'pending', assignee: '李安全', assigneeId: 'li-safe' }
      ]
    },
    showAppendix: true,
    appendixText: '本作业为动火一级（特殊动火），部门/公司安办通过后可触发集团安委办提级批复；提级节点不进主流程时间轴。',
    basic: [
      ['作业名称', '油罐区动火作业'],
      ['作业类型', '动火作业 · 一级'],
      ['作业区域', '油罐区'],
      ['作业单号', 'SZP-DW-20260518-001'],
      ['作业人员', '李明'],
      ['监护人', '赵安全'],
      ['计划开始', '2026-05-18 09:00'],
      ['计划结束', '2026-05-18 16:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '油罐区年度检修'],
      ['阶段审批人', '部门审批：赵安全（已通过）· 公司安办：王安监（待审）'],
      ['关联视频', '<span class="u-text-primary">CAM-12（油罐区）</span>']
    ],
    cert: [
      ['李明', '动火作业证', '有效', '2027-06'],
      ['赵安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '李明 · 2026-05-17 10:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动 · 2026-05-17 10:01' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '赵安全 · 2026-05-17 14:20', opinion: '意见：动火方案与监护安排符合要求。' },
      { state: 'current', title: '公司安办', tag: '待审批', tagClass: 'tag-info', meta: '王安监 · 待处理' },
      { state: 'pending', title: '作业交底', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '实施', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业关闭', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '' }
    ]
  },
  closed: {
    title: '主楼外立面登高作业',
    subtitle: '作业单号 SZP-DW-20260514-004 · 登高作业 · 主楼工地',
    statusLabel: '已关闭',
    statusTag: 'tag-success',
    statusDesc: '复核已通过 · 作业时间 2026-05-14 07:30~15:30',
    ticketNo: 'SZP-DW-20260514-004',
    toolbars: { review: false, edit: false, close: false, approve: false },
    approvePass: true,
    showAppendix: false,
    basic: [
      ['作业名称', '主楼外立面登高作业'],
      ['作业类型', '登高作业'],
      ['作业区域', '主楼工地'],
      ['作业单号', 'SZP-DW-20260514-004'],
      ['作业人员', '刘工'],
      ['监护人', '陈安全'],
      ['计划开始', '2026-05-14 07:30'],
      ['计划结束', '2026-05-14 15:30'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '主楼外立面维护'],
      ['阶段审批人', '部门审批：陈安全 · 公司安办：王安监 · 安全复核：陈安全'],
      ['关联视频', '—']
    ],
    cert: [
      ['刘工', '高处作业证', '有效', '2027-05'],
      ['陈安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '刘工 · 2026-05-12 09:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '陈安全 · 2026-05-12 11:00' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-12 15:00' },
      { state: 'done', title: '作业交底', tag: '已完成', tagClass: 'tag-success', meta: '陈安全 · 2026-05-13 16:00' },
      { state: 'done', title: '实施', tag: '已结束', tagClass: 'tag-success', meta: '2026-05-14 07:30~15:30' },
      { state: 'done', title: '作业关闭', tag: '已完成', tagClass: 'tag-success', meta: '陈安全 · 2026-05-14 15:40' },
      { state: 'done', title: '作业复核', tag: '已通过', tagClass: 'tag-success', meta: '陈安全 · 2026-05-14 16:10', opinion: '意见：现场恢复检查合格，同意关闭。' }
    ]
  },
  review: {
    title: '散货码头吊装作业',
    subtitle: '作业单号 SZP-DW-20260515-001 · 吊装作业 · 散货码头',
    statusLabel: '待复核',
    statusTag: 'tag-warning',
    statusDesc: '关闭材料已提交 · 待安全工程师李安全复核 · 作业时间 2026-05-15 08:00~14:00',
    ticketNo: 'SZP-DW-20260515-001',
    toolbars: { review: true, edit: true, close: false, approve: false },
    approvePass: true,
    showAppendix: false,
    basic: [
      ['作业名称', '散货码头吊装作业'],
      ['作业类型', '吊装作业'],
      ['作业区域', '散货码头'],
      ['作业单号', 'SZP-DW-20260515-001'],
      ['作业人员', '周建、赵强'],
      ['监护人', '陈安全'],
      ['计划开始', '2026-05-15 08:00'],
      ['计划结束', '2026-05-15 14:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '散货码头改造工程'],
      ['阶段审批人', '部门审批：李安全 · 公司安办：王安监 · 安全复核：李安全'],
      ['关联视频', '<span class="u-text-primary">CAM-07（吊装作业面）</span>']
    ],
    cert: [
      ['周建', '起重作业证', '有效', '2026-12'],
      ['赵强', '起重作业证', '有效', '2027-02'],
      ['陈安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '周建 · 2026-05-20 08:30' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动 · 2026-05-20 08:31' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '李安全 · 2026-05-20 10:15', opinion: '意见：现场条件具备，同意作业。' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-20 14:00' },
      { state: 'done', title: '作业交底', tag: '已完成', tagClass: 'tag-success', meta: '现场负责人 陈安全 · 2026-05-20 16:00' },
      { state: 'done', title: '实施', tag: '已结束', tagClass: 'tag-success', meta: '作业人员 周建等 · 2026-05-15 08:00~14:00' },
      { state: 'current', title: '作业关闭', tag: '材料已提交', tagClass: 'tag-warning', meta: '现场负责人 陈安全 · 2026-05-15 14:20', extra: ['<div class="record-item"><span class="icon-ok">&#10003;</span> 现场照片（3张）</div>', '<div class="record-item"><span class="icon-ok">&#10003;</span> 恢复安全检查清单（8/8）</div>', '<div class="record-item"><span class="icon-pending">&#9675;</span> 撤离签字（1人待签）</div>'] },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '安全工程师 李安全', sub: '复核不通过将退回「待关闭」' }
    ]
  },
  approved: {
    title: '仓储区临时用电',
    subtitle: '作业单号 SZP-DW-20260518-005 · 临时用电 · 仓储区A',
    statusLabel: '已批准',
    statusTag: 'tag-info',
    statusDesc: '审批已通过 · 待现场负责人作业交底后实施 · 作业时间 2026-05-18 09:00~17:00',
    ticketNo: 'SZP-DW-20260518-005',
    toolbars: { review: false, edit: true, close: false, approve: false },
    approvePass: true,
    showAppendix: false,
    basic: [
      ['作业名称', '仓储区临时用电'],
      ['作业类型', '临时用电'],
      ['作业区域', '仓储区A'],
      ['作业单号', 'SZP-DW-20260518-005'],
      ['作业人员', '孙磊'],
      ['监护人', '赵安全'],
      ['计划开始', '2026-05-18 09:00'],
      ['计划结束', '2026-05-18 17:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '—'],
      ['阶段审批人', '部门审批：赵安全 · 公司安办：王安监 · 安全复核：李安全'],
      ['关联视频', '—']
    ],
    cert: [
      ['孙磊', '电工操作证', '有效', '2027-08'],
      ['赵安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '孙磊 · 2026-05-17 09:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '赵安全 · 2026-05-17 11:00' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-17 16:00' },
      { state: 'current', title: '作业交底', tag: '待完成', tagClass: 'tag-info', meta: '现场负责人 赵安全' },
      { state: 'pending', title: '实施', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业关闭', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '' }
    ]
  },
  paused: {
    title: '动火作业-油罐区焊接',
    subtitle: '作业单号 SZP-DW-20260515-006 · 动火作业 · 油罐区 · 二级',
    statusLabel: '已暂停',
    statusTag: 'tag-warning',
    statusDesc: '实施已暂停（移动端操作）· 暂停超过 24 小时将提醒负责人 · 作业时间 2026-05-15~16',
    ticketNo: 'SZP-DW-20260515-006',
    toolbars: { review: false, edit: true, close: false, approve: false },
    approvePass: true,
    showAppendix: false,
    basic: [
      ['作业名称', '动火作业-油罐区焊接'],
      ['作业类型', '动火作业 · 二级'],
      ['作业区域', '油罐区'],
      ['作业单号', 'SZP-DW-20260515-006'],
      ['作业人员', '王磊'],
      ['监护人', '陈安全'],
      ['计划开始', '2026-05-15 08:00'],
      ['计划结束', '2026-05-16 18:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '油罐区管道焊接'],
      ['阶段审批人', '部门审批：陈安全 · 公司安办：王安监'],
      ['关联视频', '<span class="u-text-primary">CAM-12（油罐区）</span>']
    ],
    cert: [
      ['王磊', '动火作业证', '有效', '2027-03'],
      ['陈安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '王磊 · 2026-05-13 10:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '陈安全 · 2026-05-13 14:00' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-13 17:00' },
      { state: 'done', title: '作业交底', tag: '已完成', tagClass: 'tag-success', meta: '陈安全 · 2026-05-14 08:30' },
      { state: 'current', title: '实施', tag: '已暂停', tagClass: 'tag-warning', meta: '王磊 · 2026-05-15 10:20 暂停', opinion: '暂停原因：天气突变，待风力降低后恢复（移动端记录）。' },
      { state: 'pending', title: '作业关闭', tag: '待处理', tagClass: 'tag-info', meta: '' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '' }
    ]
  },
  close: {
    title: '西港2号仓动火焊接',
    subtitle: '作业单号 SZP-DW-20260518-007 · 动火作业 · 西港区 · 一级',
    statusLabel: '待关闭',
    statusTag: 'tag-info',
    statusDesc: '实施已结束 · 待现场负责人提交关闭材料 · 作业时间 2026-05-18 08:00~22:00',
    ticketNo: 'SZP-DW-20260518-007',
    toolbars: { review: false, edit: true, close: true, approve: false },
    approvePass: true,
    showAppendix: true,
    appendixText: '本作业为动火一级（特殊动火），集团安委办提级批复已完成（附录节点，不进主时间轴）。',
    basic: [
      ['作业名称', '西港2号仓动火焊接'],
      ['作业类型', '动火作业 · 一级'],
      ['作业区域', '西港区'],
      ['作业单号', 'SZP-DW-20260518-007'],
      ['作业人员', '张建国'],
      ['监护人', '李安全'],
      ['计划开始', '2026-05-18 08:00'],
      ['计划结束', '2026-05-18 22:00'],
      ['持证校验', '<span class="tag tag-success">作业人员有效</span>'],
      ['关联项目', '西港仓储改造'],
      ['阶段审批人', '部门审批：李安全 · 公司安办：王安监 · 安全复核：李安全'],
      ['关联视频', '<span class="u-text-primary">CAM-18（西港区）</span>']
    ],
    cert: [
      ['张建国', '动火作业证', '有效', '2027-01'],
      ['李安全', '安全管理人员证', '有效', '2027-01']
    ],
    timeline: [
      { state: 'done', title: '作业申请', tag: '已完成', tagClass: 'tag-success', meta: '张建国 · 2026-05-16 09:00' },
      { state: 'done', title: '持证校验', tag: '通过', tagClass: 'tag-success', meta: '系统自动' },
      { state: 'done', title: '部门审批', tag: '已通过', tagClass: 'tag-success', meta: '李安全 · 2026-05-16 11:00' },
      { state: 'done', title: '公司安办', tag: '已通过', tagClass: 'tag-success', meta: '王安监 · 2026-05-16 15:00' },
      { state: 'done', title: '作业交底', tag: '已完成', tagClass: 'tag-success', meta: '李安全 · 2026-05-17 08:00' },
      { state: 'done', title: '实施', tag: '已结束', tagClass: 'tag-success', meta: '2026-05-18 08:00~20:30' },
      { state: 'current', title: '作业关闭', tag: '待提交', tagClass: 'tag-info', meta: '现场负责人 李安全 · 待上传关闭材料' },
      { state: 'pending', title: '作业复核', tag: '待处理', tagClass: 'tag-info', meta: '安全工程师 李安全' }
    ]
  }
};

var DW_DEFAULT_SAMPLE_KEY = 'review';
