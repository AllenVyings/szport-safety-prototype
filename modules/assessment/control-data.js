// control-data.js — 控制指标（否决项） 模拟数据
(function() {
  'use strict';

  window.ControlData = {

    // 控制指标卡片数据
    indicators: [
      { id: 1, name: '1. 不发生死亡或重伤（含急性中毒）', status: 'linked-triggered', statusText: '已触发(连带否决)', scope: '全部二级企业 + 一类考核部室', threshold: '发生即触发', unit: '关联单位：航运服务公司（承包商事故连带）', time: '触发时间：2026-03-15 09:00' },
      { id: 2, name: '2. 不发生直接经济损失超过阈值的火灾事故', status: 'normal', statusText: '正常', scope: '全部二级企业 + 一类考核部室', threshold: 'A级 >100万 / B级 50-100万 / C级 10万', unit: '', time: '' },
      { id: 3, name: '3. 不发生造成重大社会影响的生产安全责任事故', status: 'normal', statusText: '正常', scope: '全部二级企业 + 一类考核部室', threshold: '发生即触发', unit: '', time: '' },
      { id: 4, name: '4. 不发生职业病危害事故', status: 'normal', statusText: '正常', scope: '全部二级企业 + 一类考核部室', threshold: '发生即触发', unit: '', time: '' },
      { id: 5, name: '5. 不发生一般及以上环境污染责任事故', status: 'normal', statusText: '正常', scope: '全部二级企业 + 一类考核部室', threshold: '一般及以上即触发', unit: '', time: '' },
      { id: 6, name: '6. 不发生一般及以上道路交通安全责任事故', status: 'normal', statusText: '正常', scope: '涉及交通运营单位', threshold: '一般及以上即触发', unit: '', time: '' },
      { id: 7, name: '7. 不发生严重影响办公秩序或重大社会影响的内部治安保卫事件', status: 'normal', statusText: '正常', scope: '全部考核对象', threshold: '严重影响或重大社会影响', unit: '', time: '' },
      { id: 8, name: '8. 不发生造成人员伤亡或重大社会影响的森林火灾等责任事故', status: 'pending', statusText: '待确认连带', scope: '涉及林区作业单位', threshold: '人员伤亡或重大社会影响', unit: '关联单位：港航建设公司', time: '触发时间：2026-05-10 14:00', triggerUnit: '港航建设公司辖区承包商事故待确认' },
      { id: 9, name: '9. 不发生一般及以上水上交通安全责任事故', status: 'triggered', statusText: '已触发 - 一票否决', scope: '水上交通相关单位', threshold: '仅适用于水上交通相关单位', unit: '关联单位：集装箱码头公司', time: '触发时间：2026-04-12 09:30' }
    ],

    // 历史触发记录
    history: [
      { id: 'actl-1', indicator: '9.一般及以上水上交通安全责任事故', unit: '集装箱码头公司', level: 'A级管控', levelCls: 'tag-risk-major', time: '2026-04-12 09:30', result: '全年考核不达标', resultTag: 'tag-error' },
      { id: 'actl-2', indicator: '2.直接经济损失超过阈值的火灾事故', unit: '仓储服务公司', level: 'C级管控', levelCls: 'tag-risk-low', time: '2025-09-18 14:20', result: '全年考核不达标', resultTag: 'tag-error' },
      { id: 'actl-3', indicator: '6.一般及以上道路交通安全责任事故', unit: '物流运输公司', level: 'B级管控', levelCls: 'tag-risk-significant', time: '2025-06-22 08:15', result: '全年考核不达标', resultTag: 'tag-error' },
      { id: 'actl-4', indicator: '5.一般及以上环境污染责任事故', unit: '散货码头公司', level: 'A级管控', levelCls: 'tag-risk-major', time: '2024-11-30 16:40', result: '全年考核不达标', resultTag: 'tag-error' }
    ],

    // 待确认连带列表
    pending: [
      { id: 'ap-1', contractor: 'XX建设工程有限公司', accident: '高处坠落事故（2026-04-08）', unit: '港航建设公司', deduction: -8, highlighted: true },
      { id: 'ap-2', contractor: 'YY劳务派遣公司', accident: '机械伤害事故（2026-05-03）', unit: '集装箱码头公司', deduction: -10, highlighted: true },
      { id: 'ap-3', contractor: 'ZZ保洁服务公司', accident: '触电事故（2026-03-20，已排除责任）', unit: '物业运营公司', deduction: -5, highlighted: false }
    ],

    // 阈值配置数据
    thresholds: [
      { level: 'A级管控', levelCls: 'level-tag-a', fireLoss: 100, accidentCount: 1 },
      { level: 'B级管控', levelCls: 'level-tag-b', fireLoss: 50, accidentCount: 1 },
      { level: 'C级管控', levelCls: 'level-tag-c', fireLoss: 10, accidentCount: 1 }
    ],

    // 详情数据
    details: {
      'actl-1': { title: '否决项触发记录 — 水上交通安全责任事故', basic: [['触发指标', '9.一般及以上水上交通安全责任事故'], ['关联单位', '集装箱码头公司'], ['管控级别', 'A级管控'], ['触发时间', '2026-04-12 09:30'], ['否决结果', '全年考核不达标']], desc: '集装箱码头公司于2026年4月12日发生一般水上交通安全责任事故，触发控制指标第9项。根据制度规定，触发任一项控制指标，全年安全绩效考核自动判定为不达标，不得评为优秀达标或达标等级。', timeline: [{ status: 'done', time: '2026-04-12 09:30', event: '事故发生' }, { status: 'done', time: '2026-04-12 10:00', event: '系统自动触发否决项' }, { status: 'done', time: '2026-04-12 10:05', event: '通知集团领导及安全管理部' }, { status: 'active', time: '执行中', event: '绩效考核自动判定为不达标' }] },
      'actl-2': { title: '否决项触发记录 — 火灾事故经济损失超标', basic: [['触发指标', '2.直接经济损失超过阈值的火灾事故'], ['关联单位', '仓储服务公司'], ['管控级别', 'C级管控'], ['触发时间', '2025-09-18 14:20'], ['经济损失', '15万元（阈值10万元）'], ['否决结果', '全年考核不达标']], desc: '仓储服务公司（C级管控）于2025年9月18日发生火灾事故，直接经济损失15万元，超过C级管控阈值10万元，触发控制指标第2项。', timeline: [{ status: 'done', time: '2025-09-18 14:20', event: '事故发生' }, { status: 'done', time: '2025-09-18 15:00', event: '系统自动触发否决项' }, { status: 'active', time: '2025年度', event: '全年考核不达标' }] },
      'actl-3': { title: '否决项触发记录 — 道路交通安全责任事故', basic: [['触发指标', '6.一般及以上道路交通安全责任事故'], ['关联单位', '物流运输公司'], ['触发时间', '2025-06-22 08:15']], desc: '物流运输公司于2025年6月22日发生一般道路交通安全责任事故，触发控制指标第6项。', timeline: [{ status: 'done', time: '2025-06-22', event: '触发' }, { status: 'active', time: '2025年度', event: '考核不达标' }] },
      'actl-4': { title: '否决项触发记录 — 环境污染责任事故', basic: [['触发指标', '5.一般及以上环境污染责任事故'], ['关联单位', '散货码头公司'], ['触发时间', '2024-11-30 16:40']], desc: '散货码头公司于2024年11月30日发生一般环境污染责任事故。', timeline: [{ status: 'done', time: '2024-11-30', event: '触发' }, { status: 'active', time: '2024年度', event: '考核不达标' }] }
    }
  };
})();
