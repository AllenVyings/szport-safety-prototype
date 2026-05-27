// evaluation-data.js — 安全履职评价数据
(function() {
  'use strict';

  var EvaluationData = {

    stats: { positions: 12, avgRate: '78%', overdue: 3, pending: 5 },

    positionList: [
      { id: 'detail-1', name: '安全管理部负责人', total: 12, done: 10, executing: 1, overdue: 1, rate: '83%', rateStyle: 'background:var(--success);width:83%' },
      { id: 'detail-2', name: '港口物流公司安全主管', total: 10, done: 8, executing: 2, overdue: 0, rate: '80%', rateStyle: 'background:var(--success);width:80%' },
      { id: 'detail-3', name: '危化品仓储公司安全员', total: 8, done: 7, executing: 1, overdue: 0, rate: '88%', rateStyle: '' },
      { id: 'detail-4', name: '港口运营公司安全总监', total: 15, done: 9, executing: 3, overdue: 3, rate: '60%', rateStyle: '' }
    ],

    reportList: [
      { id: 'eval-1', person: '张明', position: '安全管理部负责人', period: '2026年Q1', score: 95, scoreStyle: '', grade: '优秀', gradeCls: 'tag-success' },
      { id: 'eval-2', person: '李强', position: '港口物流公司安全主管', period: '2026年Q1', score: 82, scoreStyle: '', grade: '达标', gradeCls: 'tag-info' },
      { id: 'eval-3', person: '王磊', position: '港口运营公司安全总监', period: '2026年Q1', score: 58, scoreStyle: 'color:var(--error);', grade: '不达标', gradeCls: 'tag-error' }
    ],

    detailTitles: {
      'detail-1': '安全管理部负责人 — 履职项明细',
      'detail-2': '港口物流公司安全主管 — 履职项明细',
      'eval-1': '履职得分数据溯源 — 张明'
    },

    dutyItems: {
      'detail-1': [
        { name: '组织安全检查', freq: '每月1次', done: 5, required: 5, status: '已完成', statusCls: 'tag-success', source: '检查记录', sourceCls: 'source-check' },
        { name: '参加安全培训', freq: '每季度1次', done: 2, required: 2, status: '已完成', statusCls: 'tag-success', source: '培训记录', sourceCls: 'source-train' },
        { name: '参与应急演练', freq: '每半年1次', done: 1, required: 1, status: '已完成', statusCls: 'tag-success', source: '演练记录', sourceCls: 'source-drill' },
        { name: '提交安全月报', freq: '每月1次', done: 4, required: 5, status: '进行中', statusCls: 'tag-info', source: '手动填报', sourceCls: 'source-manual' },
        { name: '隐患整改督办', freq: '按需', done: 2, required: 3, status: '逾期', statusCls: 'tag-error', source: '检查记录', sourceCls: 'source-check' }
      ],
      'detail-2': [
        { name: '组织安全检查', freq: '每月2次', done: 9, required: 10, status: '进行中', statusCls: 'tag-info', source: '检查记录', sourceCls: 'source-check' },
        { name: '参加安全培训', freq: '每季度1次', done: 2, required: 2, status: '已完成', statusCls: 'tag-success', source: '培训记录', sourceCls: 'source-train' },
        { name: '提交安全周报', freq: '每周1次', done: 18, required: 20, status: '进行中', statusCls: 'tag-info', source: '手动填报', sourceCls: 'source-manual' }
      ]
    },

    scoreBreakdown: [
      { dimension: '安全检查履职', weight: '30%', deductItem: '1项逾期', deduct: -3, bonusItem: '超额完成2次', bonus: 2, subtotal: 29 },
      { dimension: '培训完成率', weight: '20%', deductItem: '—', deduct: 0, bonusItem: '组织专项培训', bonus: 3, subtotal: 23 },
      { dimension: '隐患整改督办', weight: '25%', deductItem: '1项超期', deduct: -5, bonusItem: '重大隐患提前闭环', bonus: 5, subtotal: 25 },
      { dimension: '应急演练参与', weight: '15%', deductItem: '—', deduct: 0, bonusItem: '—', bonus: 0, subtotal: 15 },
      { dimension: '信息报送时效', weight: '10%', deductItem: '1次延迟', deduct: -2, bonusItem: '—', bonus: 0, subtotal: 8 }
    ]
  };

  window.EvaluationData = EvaluationData;
})();
