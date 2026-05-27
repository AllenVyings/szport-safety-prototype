// typhoon-data.js — 防台风应急响应数据
(function() {
  'use strict';

  var TyphoonData = {

    stats: [
      { value: 1, label: '当前预警' },
      { value: 3, label: '已通知未响应', cls: 'u-text-warning' },
      { value: 8, label: '已响应', cls: 'u-text-primary' },
      { value: 3, label: '已闭环', cls: 'u-text-success' }
    ],

    warningList: [
      { id: 'ty-1', name: '集装箱码头公司', status: '已响应', statusCls: 'tag-handling', confirmTime: '2026-07-14 10:15', feedbackTime: '--', overtime: null, actions: ['查看', '催办反馈'] },
      { id: 'ty-2', name: '油品码头公司', status: '已响应', statusCls: 'tag-handling', confirmTime: '2026-07-14 10:08', feedbackTime: '2026-07-14 16:30', overtime: null, actions: ['查看', '处置上报'] },
      { id: 'ty-3', name: '散货码头公司', status: '已通知', statusCls: 'tag-reported', confirmTime: '--', feedbackTime: '--', overtime: '已超时30分钟', actions: ['查看', '升级提醒'] },
      { id: 'ty-4', name: '港口物流公司', status: '已通知', statusCls: 'tag-reported', confirmTime: '--', feedbackTime: '--', overtime: '已超时1小时', actions: ['查看', '升级提醒'] },
      { id: 'ty-5', name: '港航建设公司', status: '已闭环', statusCls: 'tag-archived', confirmTime: '2026-07-14 09:50', feedbackTime: '2026-07-14 14:20', overtime: null, actions: ['查看'] },
      { id: 'ty-6', name: '物业管理公司', status: '已闭环', statusCls: 'tag-archived', confirmTime: '2026-07-14 09:45', feedbackTime: '2026-07-14 13:50', overtime: null, actions: ['查看'] }
    ],

    reportList: [
      { id: 'ty-rpt-1', unit: '油品码头公司', person: '张安全', measure: '已加固储罐区，停止装卸作业', casualty: '无', loss: '0', time: '2026-07-14 16:30', status: '已反馈', statusCls: 'tag-archived' },
      { id: 'ty-rpt-2', unit: '港航建设公司', person: '李建设', measure: '工地停工，人员撤离至安置点', casualty: '无', loss: '2.5', time: '2026-07-14 14:20', status: '已闭环', statusCls: 'tag-archived' }
    ],

    histList: [
      { id: 'ty-hist-1', name: '台风"银杏"', level: '橙色', levelCls: 'var(--risk-significant)', triggerTime: '2026-07-14 09:30', closeTime: '--', responseRate: '6/14' },
      { id: 'ty-hist-2', name: '台风"海棠"', level: '黄色', levelCls: 'var(--risk-moderate)', triggerTime: '2026-06-20 08:00', closeTime: '2026-06-22 16:00', responseRate: '14/14' },
      { id: 'ty-hist-3', name: '台风"杜鹃"', level: '红色', levelCls: 'var(--risk-major)', triggerTime: '2025-09-05 06:00', closeTime: '2025-09-07 12:00', responseRate: '14/14' }
    ],

    configLevels: [
      { level: '蓝色', levelCls: 'blue', grade: 'IV级', measures: '1. 通知各二级企业关注台风动态\n2. 检查排水系统、应急物资储备\n3. 安排值班人员，保持通讯畅通', staff: 8, push: '企微' },
      { level: '黄色', levelCls: 'yellow', grade: 'III级', measures: '1. 启动防台值班制度，24小时值班\n2. 停止露天高空作业，加固临时设施\n3. 检查应急物资到位情况，通知救援队伍待命', staff: 15, push: '企微+短信' },
      { level: '橙色', levelCls: 'orange', grade: 'II级', measures: '1. 集团防台指挥部就位，启动应急指挥\n2. 停止港口作业，船舶离港避风\n3. 人员撤离危险区域，安置转移人员\n4. 每小时报告一次防台情况', staff: 28, push: '企微+短信+电话' },
      { level: '红色', levelCls: 'red', grade: 'I级', measures: '1. 全面启动应急预案，集团领导坐镇指挥\n2. 全员停工，全部人员撤离至安全区域\n3. 持续监测风情雨情，每30分钟报告一次\n4. 启动灾后恢复预案准备', staff: 42, push: '企微+短信+电话+广播' }
    ],

    detailData: {
      'ty-1': { title: '集装箱码头公司 — 防台响应', basic: [['当前预警', '台风"银杏" 橙色'], ['响应状态', '已响应'], ['确认时间', '2026-07-14 10:15'], ['反馈时间', '—']], desc: '已停止露天作业，加固堆场集装箱，值班人员24小时在岗。', timeline: [{ status: 'done', time: '2026-07-14 09:30', event: '集团下发橙色预警' }, { status: 'done', time: '2026-07-14 10:15', event: '单位确认响应' }, { status: 'active', time: '待反馈', event: '处置结果上报' }] },
      'ty-2': { title: '油品码头公司 — 防台响应', basic: [['当前预警', '台风"银杏" 橙色'], ['响应状态', '已响应'], ['确认时间', '2026-07-14 10:08'], ['反馈时间', '2026-07-14 16:30']], desc: '已加固储罐区，停止装卸作业，无人员伤亡。', timeline: [{ status: 'done', time: '2026-07-14 09:30', event: '预警下发' }, { status: 'done', time: '2026-07-14 10:08', event: '确认响应' }, { status: 'done', time: '2026-07-14 16:30', event: '处置上报 — 已反馈' }] },
      'ty-3': { title: '散货码头公司 — 防台响应', basic: [['响应状态', '已通知'], ['确认时间', '—'], ['超时', '已超时30分钟']], desc: '尚未确认响应，系统已自动升级提醒至单位负责人。', timeline: [{ status: 'done', time: '2026-07-14 09:30', event: '预警通知' }, { status: 'active', time: '—', event: '待确认响应（超时）' }] },
      'ty-4': { title: '港口物流公司 — 防台响应', basic: [['响应状态', '已通知'], ['超时', '已超时1小时']], desc: '物流堆场防风措施待确认，已触发升级提醒。', timeline: [{ status: 'done', time: '2026-07-14 09:30', event: '预警通知' }, { status: 'active', time: '—', event: '升级提醒 — 集团督办' }] },
      'ty-5': { title: '港航建设公司 — 防台响应', basic: [['响应状态', '已闭环'], ['确认', '2026-07-14 09:50'], ['反馈', '2026-07-14 14:20']], desc: '工地停工，人员撤离至安置点，财产损失2.5万元。', timeline: [{ status: 'done', time: '2026-07-14 09:50', event: '确认响应' }, { status: 'done', time: '2026-07-14 14:20', event: '上报并闭环' }] },
      'ty-6': { title: '物业管理公司 — 防台响应', basic: [['响应状态', '已闭环'], ['确认', '2026-07-14 09:45'], ['反馈', '2026-07-14 13:50']], desc: '物业区域排水检查完成，地下车库已封堵。', timeline: [{ status: 'done', time: '2026-07-14 09:45', event: '确认' }, { status: 'done', time: '2026-07-14 13:50', event: '闭环' }] },
      'ty-hist-1': { title: '台风"银杏" — 集团响应记录', basic: [['预警级别', '橙色 II级'], ['触发时间', '2026-07-14 09:30'], ['响应单位', '6/14 已响应'], ['闭环', '进行中']], desc: '当前进行中，6家单位已响应，2家超时督办。', timeline: [{ status: 'done', time: '2026-07-14 09:30', event: '触发橙色预警' }, { status: 'active', time: '—', event: '各单位处置与反馈' }] },
      'ty-hist-2': { title: '台风"海棠" — 历史记录', basic: [['预警级别', '黄色'], ['触发', '2026-06-20 08:00'], ['闭环', '2026-06-22 16:00']], desc: '全集团14家单位全部闭环。', timeline: [{ status: 'done', time: '2026-06-20', event: '黄色预警' }, { status: 'done', time: '2026-06-22', event: '全部闭环' }] },
      'ty-hist-3': { title: '台风"杜鹃" — 历史记录', basic: [['预警级别', '红色 I级'], ['触发', '2025-09-05 06:00'], ['闭环', '2025-09-07 12:00']], desc: '红色预警期间全员停工撤离，灾后恢复有序完成。', timeline: [{ status: 'done', time: '2025-09-05', event: '红色预警启动' }, { status: 'done', time: '2025-09-07', event: '解除并归档' }] },
      'ty-rpt-1': { title: '油品码头公司 — 处置上报', basic: [['值班人员', '张安全'], ['人员伤亡', '无'], ['财产损失', '0 万元']], desc: '已加固储罐区，停止装卸作业。', timeline: [{ status: 'done', time: '2026-07-14 16:30', event: '提交上报 — 已反馈' }] },
      'ty-rpt-2': { title: '港航建设公司 — 处置上报', basic: [['值班人员', '李建设'], ['人员伤亡', '无'], ['财产损失', '2.5 万元']], desc: '工地停工，人员撤离至安置点。', timeline: [{ status: 'done', time: '2026-07-14 14:20', event: '提交上报 — 已闭环' }] }
    },

    units: ['集装箱码头公司', '油品码头公司', '散货码头公司', '港口物流公司', '港航建设公司', '物业管理公司']
  };

  window.TyphoonData = TyphoonData;
})();
