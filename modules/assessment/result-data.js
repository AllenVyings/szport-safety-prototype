// result-data.js — 绩效评定与执行 模拟数据
(function() {
  'use strict';

  window.ResultData = {

    // ============================================================
    // Tab1 考核计划
    // ============================================================

    // 考核计划列表
    plans: [
      { id: 'plan-1', level: 'A', frequency: '每月检查+每季度考核', unitCount: 5, nextDate: '2026-07-01', status: '执行中' },
      { id: 'plan-2', level: 'B', frequency: '季度', unitCount: 5, nextDate: '2026-07-01', status: '未开始' },
      { id: 'plan-3', level: 'C', frequency: '半年', unitCount: 4, nextDate: '2027-01-01', status: '未开始' },
      { id: 'plan-4', level: '二类', frequency: '年底', unitCount: 3, nextDate: '2026-07-01', status: '执行中' },
      { id: 'plan-5', level: '一类', frequency: '直接考评', unitCount: 8, nextDate: '2027-01-01', status: '已完成' }
    ],

    // 指标下达流程
    indicatorFlow: {
      1: { name: '提出方案', status: 'done', operator: '张建国' },
      2: { name: '征求意见', status: 'done', operator: '李明辉' },
      3: { name: '报审', status: 'active', operator: '—' },
      4: { name: '审定', status: 'pending', operator: '—' },
      5: { name: '签订责任书', status: 'pending', operator: '—' }
    },

    // 否决指标配置明细（12项，按PRD定义）
    vetoConfigs: [
      { id: 'vc-1', name: '死亡事故', sourceModule: '事故管理', condition: '事故类型=死亡事故', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+伤亡人数' },
      { id: 'vc-2', name: '重伤事故', sourceModule: '事故管理', condition: '事故类型=重伤事故', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+重伤人数' },
      { id: 'vc-3', name: '火灾事故(A级)', sourceModule: '事故管理', condition: '事故类型=火灾 AND 管控级别=A AND 经济损失>100万', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+管控级别+经济损失' },
      { id: 'vc-4', name: '火灾事故(B级)', sourceModule: '事故管理', condition: '事故类型=火灾 AND 管控级别=B AND 经济损失≥50万', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+管控级别+经济损失' },
      { id: 'vc-5', name: '火灾事故(C级)', sourceModule: '事故管理', condition: '事故类型=火灾 AND 管控级别=C AND 经济损失≥10万', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+管控级别+经济损失' },
      { id: 'vc-6', name: '重大社会影响事故', sourceModule: '事故管理', condition: '社会影响等级=重大', triggerRule: '自动触发', dataMapping: '事故管理.社会影响等级' },
      { id: 'vc-7', name: '职业病危害事故', sourceModule: '事故管理', condition: '事故类型=职业病危害', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+职业病诊断' },
      { id: 'vc-8', name: '环境污染事故', sourceModule: '事故管理', condition: '事故类型=环境污染', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+污染等级' },
      { id: 'vc-9', name: '道路交通安全事故', sourceModule: '事故管理', condition: '事故类型=道路交通安全', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+责任认定+伤亡情况' },
      { id: 'vc-10', name: '内部治安事件', sourceModule: '事故管理', condition: '事件等级=重大 AND 类型=内部治安', triggerRule: '自动触发', dataMapping: '事故管理.事件等级+事件类型' },
      { id: 'vc-11', name: '自然灾害责任事故', sourceModule: '事故管理', condition: '事故类型=自然灾害 AND 责任认定=有责任', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+责任认定' },
      { id: 'vc-12', name: '水上交通安全事故', sourceModule: '事故管理', condition: '事故类型=水上交通安全', triggerRule: '自动触发', dataMapping: '事故管理.事故类型+水域+伤亡损失' }
    ],

    // 扣分指标配置明细（7项，按PRD定义）
    deductionConfigs: [
      { id: 'dc-1', name: '重大事故隐患', source: '隐患排查', condition: '隐患等级=重大 AND 发现来源=外部检查', score: '10分/项', trigger: '自动触发' },
      { id: 'dc-2', name: '较大事故隐患', source: '隐患排查', condition: '隐患等级=较大 AND 发现来源=外部检查', score: '2~5分/项', trigger: '自动触发' },
      { id: 'dc-3', name: '一般事故隐患', source: '隐患排查', condition: '隐患等级=一般 AND 发现来源=外部检查', score: '0.5~2分/项', trigger: '自动触发' },
      { id: 'dc-4', name: '一般逾期', source: '隐患排查', condition: '隐患等级=一般 AND 发现来源=外部检查 AND 整改状态=逾期', score: '0.5~2分/项', trigger: '自动触发' },
      { id: 'dc-5', name: '不配合工作', source: '工作督办', condition: '配合状态=不配合', score: '1分/人次', trigger: '自动触发' },
      { id: 'dc-6', name: '安全检查发现问题', source: '安全检查', condition: '检查结果=不合格 AND 检查类型=外部检查', score: '按情形', trigger: '自动触发' },
      { id: 'dc-7', name: '承包商连带', source: '隐患排查', condition: '关联单位类型=承包商 AND 发现来源=外部检查', score: '按情形', trigger: '连带触发' }
    ],

    // 加分指标配置明细（3自动+5人工=8项，按PRD定义）
    bonusConfigs: [
      { id: 'bc-1', name: '举报加分', source: '隐患排查治理', condition: '核查结论=真实', score: '按制度', trigger: '自动触发' },
      { id: 'bc-2', name: '注册安全工程师在岗', source: '人力资源管理', condition: '岗位=注册安全工程师 AND 在岗状态=在岗', score: '按制度', trigger: '自动触发' },
      { id: 'bc-3', name: '安全生产标准化评级', source: '安全生产标准化', condition: '评级等级=一级/二级', score: '按制度', trigger: '自动触发' },
      { id: 'bc-4', name: '安全工程师在岗履职', source: '人工申请', condition: '经集团认定', score: '按制度', trigger: '人工申请' },
      { id: 'bc-5', name: 'ISO认证', source: '人工申请', condition: 'ISO45001认证', score: '按制度', trigger: '人工申请' },
      { id: 'bc-6', name: '安全技术成果', source: '人工申请', condition: '经集团认定', score: '按制度', trigger: '人工申请' },
      { id: 'bc-7', name: '安全类表彰', source: '人工申请', condition: '省级及以上', score: '按制度', trigger: '人工申请' },
      { id: 'bc-8', name: '其他加分', source: '人工申请', condition: '经集团认定', score: '按制度', trigger: '人工申请' }
    ],

    // ============================================================
    // Tab2 考核执行
    // ============================================================

    // 考核执行周期
    executionCycles: [
      { id: 'exe-1', unit: '集装箱码头公司', level: 'A', tenure: '满1年', vetoStatus: '已触发', deductions: '-8', bonus: '+5', scorePreview: 97, vetoMark: true, status: '已评定', isDirectEval: false, majorDeduction: -8, minorDeduction: 0, stdBonus: 3, reportBonus: 2 },
      { id: 'exe-2', unit: '散货码头公司', level: 'A', tenure: '满1年', vetoStatus: '正常', deductions: '-12', bonus: '+3', scorePreview: 91, vetoMark: false, status: '已评定', isDirectEval: false, majorDeduction: -8, minorDeduction: -4, stdBonus: 2, reportBonus: 1 },
      { id: 'exe-3', unit: '港口运营公司', level: 'A', tenure: '满1年', vetoStatus: '正常', deductions: '-15', bonus: '+4', scorePreview: 89, vetoMark: false, status: '执行中', isDirectEval: false, majorDeduction: -10, minorDeduction: -5, stdBonus: 3, reportBonus: 1 },
      { id: 'exe-4', unit: '油气码头公司', level: 'A', tenure: '满1年', vetoStatus: '正常', deductions: '-10', bonus: '+2', scorePreview: 92, vetoMark: false, status: '执行中', isDirectEval: false, majorDeduction: -10, minorDeduction: 0, stdBonus: 2, reportBonus: 0 },
      { id: 'exe-5', unit: '航运服务公司', level: 'A', tenure: '满1年', vetoStatus: '已触发(连带否决)', deductions: '-22', bonus: '+1', scorePreview: 79, vetoMark: true, status: '已评定', isDirectEval: false, majorDeduction: -10, minorDeduction: -12, stdBonus: 1, reportBonus: 0 },
      { id: 'exe-6', unit: '港航建设公司', level: 'B', tenure: '满1年', vetoStatus: '待确认连带', deductions: '-6', bonus: '+2', scorePreview: 96, vetoMark: false, status: '执行中', isDirectEval: false, majorDeduction: 0, minorDeduction: -6, stdBonus: 2, reportBonus: 0 },
      { id: 'exe-7', unit: '物流运输公司', level: 'B', tenure: '不满1年', vetoStatus: '正常', deductions: '-18', bonus: '+3', scorePreview: 85, vetoMark: false, status: '执行中', isDirectEval: false, majorDeduction: -5, minorDeduction: -13, stdBonus: 2, reportBonus: 1 },
      { id: 'exe-8', unit: '仓储服务公司', level: 'B', tenure: '满1年', vetoStatus: '正常', deductions: '-24', bonus: '+0', scorePreview: 76, vetoMark: false, status: '已评定', isDirectEval: false, majorDeduction: -10, minorDeduction: -14, stdBonus: 0, reportBonus: 0 },
      { id: 'exe-9', unit: '船舶修造公司', level: 'B', tenure: '满1年', vetoStatus: '正常', deductions: '-9', bonus: '+5', scorePreview: 96, vetoMark: false, status: '执行中', isDirectEval: false, majorDeduction: -5, minorDeduction: -4, stdBonus: 3, reportBonus: 2 },
      { id: 'exe-10', unit: '拖轮作业公司', level: 'B', tenure: '不满1年', vetoStatus: '正常', deductions: '-14', bonus: '+2', scorePreview: 88, vetoMark: false, status: '未开始', isDirectEval: false, majorDeduction: 0, minorDeduction: -14, stdBonus: 2, reportBonus: 0 },
      { id: 'exe-11', unit: '物业运营公司', level: 'C', tenure: '满1年', vetoStatus: '正常', deductions: '-5', bonus: '+3', scorePreview: 98, vetoMark: false, status: '已评定', isDirectEval: false, majorDeduction: 0, minorDeduction: -5, stdBonus: 2, reportBonus: 1 },
      { id: 'exe-12', unit: '商务服务公司', level: 'C', tenure: '满1年', vetoStatus: '正常', deductions: '-8', bonus: '+1', scorePreview: 93, vetoMark: false, status: '已通报', isDirectEval: false, majorDeduction: -5, minorDeduction: -3, stdBonus: 1, reportBonus: 0 },
      { id: 'exe-13', unit: '安全管理部', level: '一类', tenure: '—', vetoStatus: '正常', deductions: '-3', bonus: '+2', scorePreview: 99, vetoMark: false, status: '已评定', isDirectEval: true, majorDeduction: 0, minorDeduction: -3, stdBonus: 1, reportBonus: 1 },
      { id: 'exe-14', unit: '应急救援中心', level: '二类', tenure: '—', vetoStatus: '正常', deductions: '-7', bonus: '+1', scorePreview: 94, vetoMark: false, status: '执行中', isDirectEval: true, majorDeduction: 0, minorDeduction: -7, stdBonus: 1, reportBonus: 0 }
    ],

    // 否决指标监控小卡片（9项，12条配置合并为9项监控维度）
    indicatorCards: [
      { id: 'ic-1', name: '伤亡事故', status: '已触发(连带否决)', triggerUnit: '航运服务公司（承包商事故连带）' },
      { id: 'ic-2', name: '火灾事故', status: '正常' },
      { id: 'ic-3', name: '重大社会影响事故', status: '正常' },
      { id: 'ic-4', name: '职业病危害事故', status: '正常' },
      { id: 'ic-5', name: '环境污染事故', status: '正常' },
      { id: 'ic-6', name: '道路交通安全事故', status: '正常' },
      { id: 'ic-7', name: '内部治安事件', status: '正常' },
      { id: 'ic-8', name: '水上交通安全事故', status: '已触发', triggerUnit: '集装箱码头公司' },
      { id: 'ic-9', name: '自然灾害责任事故', status: '待确认连带', triggerUnit: '港航建设公司' }
    ],

    // 各单位执行步骤进度
    executionSteps: {
      'exe-1': { current: 4, label: '已评定' },
      'exe-2': { current: 4, label: '已评定' },
      'exe-3': { current: 2, label: '扣分汇总中' },
      'exe-4': { current: 2, label: '扣分汇总中' },
      'exe-5': { current: 4, label: '已评定' },
      'exe-6': { current: 1, label: '待确认连带' },
      'exe-7': { current: 3, label: '加分汇总中' },
      'exe-8': { current: 4, label: '已评定' },
      'exe-9': { current: 2, label: '扣分汇总中' },
      'exe-10': { current: 1, label: '未开始' },
      'exe-11': { current: 4, label: '已评定' },
      'exe-12': { current: 4, label: '已通报' },
      'exe-13': { current: 4, label: '已评定' },
      'exe-14': { current: 2, label: '扣分汇总中' }
    },

    // ============================================================
    // Tab3 结果评定
    // ============================================================

    // 绩效评定排名数据（按管控级别分组）
    ranking: {
      A: [
        { id: 'res-4a', rank: 1, name: '油气码头公司', tenure: '满1年', indicatorScore: 100, deduction: -10, bonus: +2, score: 92, grade: 'excellent', veto: false, vetoMark: false },
        { id: 'res-2', rank: 2, name: '散货码头公司', tenure: '满1年', indicatorScore: 100, deduction: -12, bonus: +3, score: 91, grade: 'excellent', veto: false, vetoMark: false },
        { id: 'res-3', rank: 3, name: '港口运营公司', tenure: '满1年', indicatorScore: 100, deduction: -15, bonus: +4, score: 89, grade: 'qualified', veto: false, vetoMark: false },
        { id: 'res-1', rank: 4, name: '集装箱码头公司', tenure: '满1年', indicatorScore: 100, deduction: -8, bonus: +5, score: 97, grade: 'unqualified', veto: true, vetoMark: true },
        { id: 'res-4b', rank: 5, name: '航运服务公司', tenure: '满1年', indicatorScore: 92, deduction: -22, bonus: +1, score: 79, grade: 'unqualified', veto: true, vetoMark: true }
      ],
      B: [
        { id: 'res-6a', rank: 1, name: '船舶修造公司', tenure: '满1年', indicatorScore: 96, deduction: -9, bonus: +5, score: 96, grade: 'excellent', veto: false, vetoMark: false },
        { id: 'res-4', rank: 2, name: '港航建设公司', tenure: '满1年', indicatorScore: 96, deduction: -6, bonus: +2, score: 96, grade: 'pending', veto: false, vetoMark: false },
        { id: 'res-6b', rank: 3, name: '拖轮作业公司', tenure: '不满1年', indicatorScore: 88, deduction: -14, bonus: +2, score: 88, grade: 'qualified', veto: false, vetoMark: false },
        { id: 'res-5', rank: 4, name: '物流运输公司', tenure: '不满1年', indicatorScore: 85, deduction: -18, bonus: +3, score: 85, grade: 'qualified', veto: false, vetoMark: false },
        { id: 'res-6', rank: 5, name: '仓储服务公司', tenure: '满1年', indicatorScore: 76, deduction: -24, bonus: +0, score: 76, grade: 'unqualified', veto: false, vetoMark: false }
      ],
      C: [
        { id: 'res-7', rank: 1, name: '物业运营公司', tenure: '满1年', indicatorScore: 95, deduction: -5, bonus: +3, score: 98, grade: 'excellent', veto: false, vetoMark: false },
        { id: 'res-8', rank: 2, name: '商务服务公司', tenure: '满1年', indicatorScore: 93, deduction: -8, bonus: +1, score: 93, grade: 'qualified', veto: false, vetoMark: false },
        { id: 'res-9', rank: 3, name: '新设子公司', tenure: '不满1年', indicatorScore: 88, deduction: -12, bonus: +0, score: 88, grade: 'qualified', veto: false, vetoMark: false },
        { id: 'res-9a', rank: 4, name: '信息技术公司', tenure: '不满1年', indicatorScore: 100, deduction: -3, bonus: +4, score: 101, displayScore: 100, grade: 'qualified', veto: false, vetoMark: false }
      ],
      '二类': [
        { id: 'res-11', rank: 1, name: '应急救援中心', tenure: '—', indicatorScore: 94, deduction: -7, bonus: +1, score: 94, grade: 'excellent', veto: false, vetoMark: false, directEval: true }
      ],
      '一类': [
        { id: 'res-12', rank: 1, name: '安全管理部', tenure: '—', indicatorScore: 99, deduction: -3, bonus: +2, score: 99, grade: 'excellent', veto: false, vetoMark: false, directEval: true }
      ]
    },

    // 等级标签映射
    gradeMap: {
      excellent: { text: '优秀达标', cls: 'grade-tag-excellent' },
      qualified: { text: '达标', cls: 'grade-tag-qualified' },
      unqualified: { text: '不达标', cls: 'grade-tag-unqualified' },
      pending: { text: '待评定（连带待确认）', cls: 'grade-tag-qualified' }
    },

    levelMap: {
      A: { text: 'A级管控', cls: 'level-tag-a' },
      B: { text: 'B级管控', cls: 'level-tag-b' },
      C: { text: 'C级管控', cls: 'level-tag-c' },
      '二类': { text: '二类单位', cls: 'level-tag-erlei' },
      '一类': { text: '一类单位', cls: 'level-tag-yilei' }
    },

    // 详情数据
    details: {
      'res-1': { title: '集装箱码头公司 — 2026Q1 评定', basic: [['管控级别', 'A级管控'], ['综合得分', '97'], ['等级', '优秀达标'], ['扣分合计', '-8'], ['加分合计', '+5']], desc: '季度绩效自动计算结果。A级管控单位，每季度考核。', timeline: [{ status: 'done', time: '2026-04-01', event: '自动计算得分' }, { status: 'done', time: '2026-04-05', event: '安全管理人员确认' }, { status: 'done', time: '2026-04-10', event: '集团领导审批通过' }, { status: 'active', time: '已审批', event: '等待公示' }] },
      'res-6': { title: '仓储服务公司 — 2026年度评定', basic: [['管控级别', 'B级管控'], ['综合得分', '76'], ['等级', '不达标'], ['扣分合计', '-24'], ['加分合计', '0']], desc: '不达标单位，按制度执行绩效工资扣发和集团通报批评。主要负责人扣发一个月绩效工资。', timeline: [{ status: 'done', time: '2026-04-01', event: '自动计算得分' }, { status: 'done', time: '2026-04-05', event: '安全管理人员确认' }, { status: 'done', time: '2026-04-10', event: '集团领导审批通过' }, { status: 'done', time: '2026-04-15', event: '结果公示' }, { status: 'active', time: '执行中', event: '奖惩执行' }] },
      'pub-1': { title: '集装箱码头公司 — 2026年度公示', basic: [['管控级别', 'A级管控'], ['综合得分', '97'], ['等级', '优秀达标'], ['审批状态', '已审批'], ['公示状态', '已公示'], ['通报状态', '已通报']], desc: '已通过集团领导审批并完成公示，已发布通报。', timeline: [{ status: 'done', time: '2026-04-10', event: '审批通过' }, { status: 'done', time: '2026-04-15', event: '发布公示' }, { status: 'done', time: '2026-04-22', event: '公示期满' }, { status: 'active', time: '2026-04-23', event: '发布通报' }] },
      'rw-2': { title: '仓储服务公司 — 绩效工资扣发', basic: [['执行类型', '绩效工资扣发'], ['执行对象', '仓储服务公司全体员工'], ['扣发金额', '每人1000元'], ['执行状态', '执行中']], desc: '不达标部室扣发全体员工每人1000元绩效工资，不达标二级企业主要负责人/分管安全负责人/安全部门负责人/安全管理人员扣发一个月绩效工资。', timeline: [{ status: 'done', time: '2026-04-15', event: '公示完成' }, { status: 'done', time: '2026-04-16', event: '系统自动生成惩戒记录' }, { status: 'active', time: '执行中', event: '人力资源部执行扣发' }] },
      'adm-1': { title: '物流运输公司 — 诫勉约谈', basic: [['约谈单位', '物流运输公司'], ['约谈对象', '主要负责人、分管安全负责人'], ['触发原因', 'Q1扣分累计25分(>20分)'], ['约谈日期', '2026-04-20']], desc: '季度扣分超过20分触发诫勉约谈。', timeline: [{ status: 'done', time: '2026-04-01', event: 'Q1扣分汇总' }, { status: 'done', time: '2026-04-05', event: '系统自动生成约谈记录' }, { status: 'active', time: '待执行', event: '等待集团安全管理人员安排约谈' }] },
      'hon-2': { title: '先进集体推荐审核', basic: [['表彰类型', '先进集体'], ['推荐对象', '集装箱码头公司安全部'], ['推荐依据', '2026年度优秀达标'], ['限额校验', '安全管理人员总数3%以内']], desc: '安全管理岗位人员表彰不超过安全管理人员总数3%。', timeline: [{ status: 'done', time: '2026-05-10', event: '提交推荐' }, { status: 'active', time: '审核中', event: '集团审核' }] },
      'rect-1': { title: '仓储服务公司 — 整改追踪', basic: [['整改单位', '仓储服务公司'], ['触发原因', '年度总分76分(<80分)'], ['整改要求', '提交安全管理体系整改方案'], ['截止日期', '2026-06-30'], ['当前状态', '整改中（重新整改）']], desc: '不达标单位须在评定公示后30日内完成整改并提交验证。首次提交整改方案未通过验证，需重新整改。', timeline: [{ status: 'done', time: '2026-04-15', event: '公示完成' }, { status: 'done', time: '2026-04-16', event: '系统生成整改任务' }, { status: 'done', time: '2026-05-10', event: '提交整改报告' }, { status: 'rejected', time: '2026-05-15', event: '整改验证不通过：方案缺少关键管控措施' }, { status: 'active', time: '2026-05-16', event: '重新整改中' }] },
      'exe-5': { title: '航运服务公司 — 考核执行详情', basic: [['管控级别', 'A级管控'], ['否决状态', '已触发(连带否决)'], ['连带来源', '航运服务公司辖区承包商事故'], ['扣分合计', '-22'], ['加分合计', '+1'], ['得分预览', '79'], ['预判等级', '不达标']], desc: '因承包商事故连带触发否决项，综合得分79分，预判等级为不达标。', timeline: [{ status: 'done', time: '2026-03-15', event: '否决项触发(承包商事故连带)' }, { status: 'done', time: '2026-04-01', event: '扣分汇总完成' }, { status: 'done', time: '2026-04-05', event: '加分汇总完成' }, { status: 'active', time: '评定中', event: '提交结果评定' }] },
      'exe-4': { title: '油气码头公司 — 2026Q1 评定（已驳回）', basic: [['管控级别', 'A级管控'], ['扣分合计', '-10'], ['加分合计', '+2'], ['得分预览', '92'], ['当前状态', '执行中（已驳回，重新汇总）']], desc: '首次提交评定因扣分项证据不完整被驳回，需补充材料后重新提交。', timeline: [{ status: 'done', time: '2026-04-01', event: '扣分汇总完成' }, { status: 'done', time: '2026-04-03', event: '加分汇总完成' }, { status: 'done', time: '2026-04-05', event: '提交评定' }, { status: 'rejected', time: '2026-04-08', event: '集团领导驳回：扣分项证据不完整' }, { status: 'active', time: '2026-04-09', event: '回到执行中，重新汇总扣分项' }] }
    },

    // ============================================================
    // Tab4 公示与奖惩
    // ============================================================

    // 结果公示列表
    publish: [
      { id: 'pub-1', name: '集装箱码头公司', level: 'A', year: '2026', period: '2026年Q1', score: 97, grade: 'excellent', approvalStatus: '已审批', publishStatus: '已通报', publicityPeriod: '2026-04-01 ~ 2026-04-07' },
      { id: 'pub-2', name: '散货码头公司', level: 'A', year: '2026', period: '2026年Q1', score: 91, grade: 'excellent', approvalStatus: '已审批', publishStatus: '公示中', publicityPeriod: '2026-05-20 ~ 2026-05-27' },
      { id: 'pub-3', name: '物流运输公司', level: 'B', year: '2026', period: '2026年Q1', score: 85, grade: 'qualified', approvalStatus: '已审批', publishStatus: '未公示', publicityPeriod: '—' },
      { id: 'pub-4', name: '仓储服务公司', level: 'B', year: '2026', period: '2026年Q1', score: 76, grade: 'unqualified', approvalStatus: '评定中', publishStatus: '未公示', publicityPeriod: '—' },
      { id: 'pub-5', name: '港航建设公司', level: 'B', year: '2026', period: '2026年Q1', score: 96, grade: 'excellent', approvalStatus: '已审批', publishStatus: '已通报', publicityPeriod: '2026-04-01 ~ 2026-04-07' },
      { id: 'pub-6', name: '物业运营公司', level: 'C', year: '2026', period: '2026年Q1', score: 98, grade: 'excellent', approvalStatus: '已审批', publishStatus: '公示中', publicityPeriod: '2026-05-20 ~ 2026-05-27' },
      { id: 'pub-7', name: '航运服务公司', level: 'A', year: '2026', period: '2026年Q1', score: 79, grade: 'unqualified', approvalStatus: '已审批', publishStatus: '未公示', publicityPeriod: '—' },
      { id: 'pub-8', name: '拖轮作业公司', level: 'B', year: '2026', period: '2026年Q1', score: 88, grade: 'qualified', approvalStatus: '已审批', publishStatus: '已公示', publicityPeriod: '2026-04-10 ~ 2026-04-17' },
      { id: 'pub-9', name: '安全管理部', level: '一类', year: '2026', period: '2026年度', score: 99, grade: 'excellent', approvalStatus: '已审批', publishStatus: '已通报', publicityPeriod: '2026-04-01 ~ 2026-04-07' },
      { id: 'pub-10', name: '商务服务公司', level: 'C', year: '2026', period: '2026年Q1', score: 93, grade: 'qualified', approvalStatus: '已审批', publishStatus: '公示中', publicityPeriod: '2026-05-20 ~ 2026-05-27' }
    ],

    // 奖惩记录
    rewards: [
      { id: 'rw-1', name: '集装箱码头公司', type: '奖状颁发', typeTag: 'success', basis: '2026年度优秀达标', content: '颁发安全生产先进奖状', status: '已执行', statusTag: 'success', execTime: '2026-04-15' },
      { id: 'rw-2', name: '仓储服务公司', type: '绩效工资扣发', typeTag: 'error', basis: '2026年度不达标', content: '扣发全体员工每人1000元绩效工资', status: '执行中', statusTag: 'info', execTime: '2026-05-01' },
      { id: 'rw-3', name: '仓储服务公司', type: '通报批评', typeTag: 'error', basis: '2026年度不达标', content: '集团通报批评', status: '已执行', statusTag: 'success', execTime: '2026-04-20' },
      { id: 'rw-4', name: '物流运输公司', type: '诫勉约谈', typeTag: 'warning', basis: 'Q1扣分累计25分(>20分)', content: '对主要负责人进行诫勉约谈', status: '待执行', statusTag: 'warning', execTime: '—' },
      { id: 'rw-5', name: '航运服务公司', type: '绩效工资扣发', typeTag: 'error', basis: '2026年度不达标(否决项)', content: '主要负责人扣发一个月绩效工资', status: '待执行', statusTag: 'warning', execTime: '—' }
    ],

    // 诫勉约谈记录
    admonitions: [
      { id: 'adm-1', name: '物流运输公司', target: '主要负责人、分管安全负责人', reason: 'Q1扣分累计25分，超过20分预警线', date: '2026-04-20', status: '待执行', statusTag: 'warning', interviewer: '集团分管安全领导' },
      { id: 'adm-2', name: '仓储服务公司', target: '主要负责人、安全部门负责人', reason: '年度总分76分(<80分)', date: '2026-01-15', status: '已执行', statusTag: 'success', interviewer: '集团安全总监' }
    ],

    // 先进表彰
    honors: [
      { id: 'hon-1', type: '先进个人', typeTag: 'success', name: '王安全', unit: '集装箱码头公司', year: '2026年', honorTime: '2026-04-10', honorContent: '王安全 — 年度安全生产先进个人', status: '已表彰', statusTag: 'success' },
      { id: 'hon-2', type: '先进集体', typeTag: 'info', name: '集装箱码头公司安全部', unit: '集装箱码头公司', year: '2026年', honorTime: '2026-04-10', honorContent: '集装箱码头公司安全部 — 年度安全生产先进集体', status: '审核中', statusTag: 'info' },
      { id: 'hon-3', type: '先进个人', typeTag: 'success', name: '李守规', unit: '港航建设公司', year: '2026年', honorTime: '2026-04-10', honorContent: '李守规 — 安全管理创新贡献先进个人', status: '已表彰', statusTag: 'success' }
    ],

    // 整改追踪
    rectifications: [
      { id: 'rect-1', unit: '仓储服务公司', status: '整改中', deadline: '2026-06-30', remainingDays: 37, reason: '年度总分76分(<80分)，须提交安全管理体系整改方案' },
      { id: 'rect-2', unit: '航运服务公司', status: '待整改', deadline: '2026-07-15', remainingDays: 52, reason: '否决项触发+年度不达标，须提交事故防范与整改方案' },
      { id: 'rect-3', unit: '物流运输公司', status: '整改中', deadline: '2026-06-15', remainingDays: 22, reason: 'Q1扣分累计25分(>20分)，须提交扣分整改方案' },
      { id: 'rect-4', unit: '新设子公司', status: '已验证', deadline: '2026-05-01', remainingDays: 0, reason: '上年度扣分超标，已完成整改方案并验证通过' },
      { id: 'rect-5', unit: '商务服务公司', status: '逾期', deadline: '2026-05-10', remainingDays: -14, reason: '上年度扣分整改方案未按期提交' }
    ]
  };
})();
