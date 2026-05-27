// bonus-data.js — 加分项与举报奖励 模拟数据
(function() {
  'use strict';

  window.BonusData = {

    // 加分项申请列表（Tab1）
    bonusList: [
      { id: 'bon-1', name: '取得省级安全生产标准化二级达标', type: '4.省级标准化二级', score: '+5', scoreNum: 5, scoreClass: 'u-text-success', unit: '集装箱码头公司', status: '已生效', statusTag: 'tag-success', materials: ['安全生产标准化二级证书.pdf', '评审报告.pdf'], reviewStep: 1 },
      { id: 'bon-2', name: '新增1名持证注册安全工程师', type: '1.持证注册安全工程师', score: '+2', scoreNum: 2, scoreClass: 'u-text-success', unit: '散货码头公司', status: '已生效', statusTag: 'tag-success', materials: ['注册安全工程师资格证书.jpg'], reviewStep: 1 },
      { id: 'bon-3', name: '通过ISO45001体系认证', type: '6.ISO体系认证', score: '+5', scoreNum: 5, scoreClass: 'u-text-success', unit: '物流运输公司', status: '审核中', statusTag: 'tag-info', materials: ['ISO45001认证证书.pdf', '审核报告.pdf'], reviewStep: 2 },
      { id: 'bon-4', name: '采用新型安全监控技术改善作业环境', type: '7.安全技术改善', score: '+2', scoreNum: 2, scoreClass: 'u-text-success', unit: '港航建设公司', status: '审核中', statusTag: 'tag-info', materials: ['技术方案报告.pdf'], reviewStep: 1 },
      { id: 'bon-5', name: '获得市级安全表彰', type: '8.安全表彰', score: '+2', scoreNum: 2, scoreClass: 'u-text-success', unit: '仓储服务公司', status: '已提交', statusTag: 'tag-warning', materials: ['市级安全表彰决定.pdf'], reviewStep: 1 },
      { id: 'bon-6', name: '工程师在专职安全岗位注册', type: '2.工程师在岗注册', score: '+3', scoreNum: 3, scoreClass: 'u-text-success', unit: '集装箱码头公司', status: '已驳回', statusTag: 'tag-error', materials: [], reviewStep: 1 },
      { id: 'bon-7', name: '取得市级安全生产标准化三级达标', type: '3.市级标准化三级', score: '+2', scoreNum: 2, scoreClass: 'u-text-success', unit: '航运服务公司', status: '已生效', statusTag: 'tag-success', materials: ['市级标准化三级证书.pdf'], reviewStep: 1 },
      { id: 'bon-8', name: '安全设施技术改善项目', type: '7.安全技术改善', score: '+2', scoreNum: 2, scoreClass: 'u-text-success', unit: '拖轮作业公司', status: '审核中', statusTag: 'tag-info', materials: ['安全技术改善方案.docx', '效果评估报告.pdf'], reviewStep: 1 }
    ],

    // 加分类型选项
    bonusTypes: [
      '1.持证注册安全工程师+2分',
      '2.工程师在岗注册+3分',
      '3.市级标准化三级+2分',
      '4.省级标准化二级+5分',
      '5.国家级标准化一级+10分',
      '6.ISO体系认证+5分/项',
      '7.安全技术改善+2分/项',
      '8.安全表彰+2-10分',
      '9.其他(安委会审定)'
    ],

    // 加分额度配置
    config: [
      { level: '一般', levelTag: 'tag-info', score: 1, desc: '举报一般隐患经核实确认' },
      { level: '较大', levelTag: 'tag-warning', score: 2, desc: '举报较大隐患经核实确认' },
      { level: '重大', levelTag: 'tag-error', score: 3, desc: '举报重大隐患经核实确认' }
    ],

    // 举报奖励记录列表（Tab2）
    reportList: [
      { id: 'rpt-1', reporter: '张某某', level: '重大', levelTag: 'tag-error', score: '+3', scoreClass: 'u-text-success', confirmLevel: '终审', unit: '集装箱码头公司', period: '2026年Q1', status: '已生效', statusTag: 'tag-success' },
      { id: 'rpt-2', reporter: '李某某', level: '较大', levelTag: 'tag-warning', score: '+2', scoreClass: 'u-text-success', confirmLevel: '复核', unit: '散货码头公司', period: '2026年Q1', status: '已确认', statusTag: 'tag-success' },
      { id: 'rpt-3', reporter: '王某某', level: '一般', levelTag: 'tag-info', score: '+1', scoreClass: 'u-text-success', confirmLevel: '初核', unit: '物流运输公司', period: '2026年Q2', status: '待确认', statusTag: 'tag-warning' },
      { id: 'rpt-4', reporter: '赵某某', level: '较大', levelTag: 'tag-warning', score: '+2', scoreClass: 'u-text-success', confirmLevel: '复核', unit: '集装箱码头公司', period: '2026年Q2', status: '待确认', statusTag: 'tag-warning' },
      { id: 'rpt-5', reporter: '陈某某', level: '重大', levelTag: 'tag-error', score: '+3', scoreClass: 'u-text-success', confirmLevel: '终审', unit: '散货码头公司', period: '2026年Q1', status: '已生效', statusTag: 'tag-success' }
    ],

    // 详情数据
    details: {
      'bon-1': { title: '取得省级安全生产标准化二级达标', basic: [['加分类型', '4.省级标准化二级'], ['加分值', '+5'], ['申请单位', '集装箱码头公司'], ['状态', '已生效']], desc: '集装箱码头公司取得省级安全生产标准化二级达标，按规则加5分。', timeline: [{ status: 'done', time: '2026-03-10', event: '提交申请' }, { status: 'done', time: '2026-03-20', event: '集团审批通过' }, { status: 'done', time: '2026-04-01', event: '加分生效' }] },
      'bon-2': { title: '新增1名持证注册安全工程师', basic: [['加分类型', '1.持证注册安全工程师'], ['加分值', '+2'], ['申请单位', '散货码头公司'], ['状态', '已生效']], desc: '散货码头公司新增1名持证注册安全工程师，按规则加2分。', timeline: [{ status: 'done', time: '2026-02-15', event: '材料审核' }, { status: 'done', time: '2026-02-28', event: '生效' }] },
      'bon-3': { title: '通过ISO45001体系认证', basic: [['加分类型', '6.ISO体系认证'], ['加分值', '+5'], ['申请单位', '物流运输公司'], ['状态', '审核中']], desc: '物流运输公司通过ISO45001体系认证，按规则加5分，正在审核中。', timeline: [{ status: 'done', time: '2026-05-01', event: '提交' }, { status: 'active', time: '进行中', event: '安委会审定' }] },
      'bon-4': { title: '采用新型安全监控技术改善作业环境', basic: [['加分类型', '7.安全技术改善'], ['加分值', '+2'], ['申请单位', '港航建设公司'], ['状态', '审核中']], desc: '港航建设公司采用新型安全监控技术改善作业环境，按规则加2分，正在审核中。', timeline: [{ status: 'done', time: '2026-05-12', event: '提交' }, { status: 'active', time: '—', event: '技术审核' }] },
      'bon-5': { title: '获得市级安全表彰', basic: [['加分类型', '8.安全表彰'], ['加分值', '+2'], ['申请单位', '仓储服务公司'], ['状态', '已提交']], desc: '仓储服务公司获得市级安全表彰，按规则加2分，待受理。', timeline: [{ status: 'active', time: '2026-05-16', event: '待受理' }] },
      'bon-6': { title: '工程师在专职安全岗位注册', basic: [['加分类型', '2.工程师在岗注册'], ['加分值', '+3'], ['申请单位', '集装箱码头公司'], ['状态', '已驳回']], desc: '工程师在专职安全岗位注册申请被驳回，原因为材料不全，可重新提交。', timeline: [{ status: 'done', time: '2026-04-01', event: '提交' }, { status: 'done', time: '2026-04-10', event: '驳回 — 材料不全' }] },
      'rpt-1': { title: '张某某 — 举报加分', basic: [['隐患等级', '重大'], ['加分', '+3'], ['确认层级', '集团'], ['归属单位', '集装箱码头公司'], ['状态', '已生效']], desc: '举报重大隐患经集团核实确认，加分已入账。', timeline: [{ status: 'done', time: '2026-Q1', event: '隐患核实' }, { status: 'done', time: '2026-Q1', event: '加分入账' }] },
      'rpt-2': { title: '李某某 — 举报加分', basic: [['隐患等级', '较大'], ['加分', '+2'], ['确认层级', '二级企业'], ['归属单位', '散货码头公司'], ['状态', '已确认']], desc: '二级企业已确认，待集团确认加分。', timeline: [{ status: 'done', time: '2026-05-10', event: '二级企业确认' }, { status: 'active', time: '—', event: '待集团确认加分' }] },
      'rpt-3': { title: '王某某 — 举报加分', basic: [['隐患等级', '一般'], ['加分', '+1'], ['确认层级', '二级企业'], ['归属单位', '物流运输公司'], ['状态', '待确认']], desc: '举报一般隐患，待二级企业确认。', timeline: [{ status: 'active', time: '—', event: '待二级企业确认' }] },
      'rpt-4': { title: '赵某某 — 举报加分', basic: [['隐患等级', '较大'], ['加分', '+2'], ['确认层级', '集团'], ['归属单位', '集装箱码头公司'], ['状态', '待确认']], desc: '举报较大隐患，集团确认中。', timeline: [{ status: 'active', time: '—', event: '集团确认中' }] },
      'rpt-5': { title: '陈某某 — 举报加分', basic: [['隐患等级', '重大'], ['加分', '+3'], ['确认层级', '集团'], ['归属单位', '散货码头公司'], ['状态', '已生效']], desc: '举报重大隐患经集团核实确认，加分已入账。', timeline: [{ status: 'done', time: '2026-Q1', event: '已生效' }] }
    }
  };
})();
