// analysis-data.js — 风险统计分析数据
(function() {
  'use strict';

  var AnalysisData = {

    kpi: {
      total: 156,
      major: 8,
      significant: 23,
      controlRate: '93.6%',
      alertCount: 2,
      trends: {
        total: { dir: 'up', text: '↑ 12 较上月' },
        major: { dir: 'up', text: '↑ 1 新增' },
        significant: { dir: 'flat', text: '— 持平' },
        controlRate: { dir: 'up', text: '↑ 2.1%', cls: 'u-text-success' },
        alertCount: { dir: 'up', text: '需关注' }
      }
    },

    riskLevel: [
      { name: '重大风险', value: 8, pct: 5.1, color: 'var(--chart-red)', cls: 'red' },
      { name: '较大风险', value: 23, pct: 14.7, color: 'var(--chart-orange)', cls: 'orange' },
      { name: '一般风险', value: 67, pct: 42.9, color: 'var(--chart-yellow)', cls: 'yellow' },
      { name: '低风险', value: 58, pct: 37.2, color: 'var(--chart-blue)', cls: 'blue' }
    ],

    unitDistribution: [
      { name: '集装箱', total: 42, red: 8, orange: 12, yellow: 32, blue: 28 },
      { name: '油品码头', total: 48, red: 16, orange: 16, yellow: 36, blue: 24 },
      { name: '散货码头', total: 28, red: 0, orange: 8, yellow: 24, blue: 20 },
      { name: '物流公司', total: 15, red: 0, orange: 0, yellow: 12, blue: 16 },
      { name: '物业公司', total: 12, red: 0, orange: 0, yellow: 8, blue: 12 },
      { name: '建筑施工', total: 11, red: 0, orange: 4, yellow: 8, blue: 8 }
    ],

    monthlyTrend: [
      { month: '6月', value: 128 }, { month: '7月', value: 132 },
      { month: '8月', value: 136 }, { month: '9月', value: 134 },
      { month: '10月', value: 138 }, { month: '11月', value: 140 },
      { month: '12月', value: 142 }, { month: '1月', value: 144 },
      { month: '2月', value: 146 }, { month: '3月', value: 148 },
      { month: '4月', value: 152 }, { month: '5月', value: 156 }
    ],

    controlStatus: [
      { name: '受控', value: 98, pct: 62.8, color: 'var(--chart-green)' },
      { name: '管控中', value: 42, pct: 26.9, color: 'var(--chart-blue)' },
      { name: '已消除', value: 16, pct: 10.3, color: 'var(--chart-gray)' }
    ],

    controlMeasures: [
      { name: '工程技术措施', rate: '96.2%' },
      { name: '管理措施', rate: '98.7%' },
      { name: '培训教育措施', rate: '94.5%' },
      { name: '个体防护措施', rate: '91.3%' },
      { name: '应急处置措施', rate: '89.7%' }
    ],

    topRisks: [
      { rank: 1, name: '1号原油储罐区', score: 25, color: 'var(--chart-red)' },
      { rank: 2, name: '3号泊位输油管道', score: 21, pct: 84, color: 'var(--chart-red)' },
      { rank: 3, name: 'LNG接收站', score: 18, pct: 72, color: 'var(--chart-red)' },
      { rank: 4, name: '2号原油储罐区', score: 16, pct: 64, color: 'var(--chart-orange)' },
      { rank: 5, name: '集装箱码头岸桥作业', score: 14, pct: 56, color: 'var(--chart-orange)' },
      { rank: 6, name: '配电间高压设备', score: 12, pct: 48, color: 'var(--chart-orange)' },
      { rank: 7, name: '危化品装卸平台', score: 10, pct: 40, color: 'var(--chart-orange)' },
      { rank: 8, name: '油罐区防火堤', score: 8, pct: 32, color: 'var(--chart-yellow)' }
    ],

    hazardType: [
      { name: '危化品', total: 38, red: 8, orange: 12, yellow: 28, blue: 20 },
      { name: '港口运营', total: 42, red: 0, orange: 8, yellow: 32, blue: 24 },
      { name: '电气安全', total: 26, red: 0, orange: 4, yellow: 20, blue: 16 },
      { name: '消防安全', total: 20, red: 0, orange: 4, yellow: 16, blue: 12 },
      { name: '机械伤害', total: 16, red: 0, orange: 0, yellow: 12, blue: 8 },
      { name: '高处坠落', total: 14, red: 0, orange: 0, yellow: 8, blue: 8 }
    ],

    accidentType: [
      { name: '火灾爆炸', value: 38, pct: 24.4, color: 'var(--chart-red)' },
      { name: '中毒窒息', value: 28, pct: 17.9, color: 'var(--chart-orange)' },
      { name: '起重伤害', value: 32, pct: 20.5, color: 'var(--chart-yellow)' },
      { name: '触电', value: 28, pct: 17.9, color: 'var(--chart-blue)' },
      { name: '高处坠落', value: 16, pct: 10.3, color: 'var(--chart-green)' },
      { name: '其他', value: 14, pct: 9.0, color: 'var(--chart-purple)' }
    ],

    controlLevel: [
      { name: '公司级', total: 31, red: 16, orange: 24 },
      { name: '部门级', total: 56, orange: 12, yellow: 36 },
      { name: '班组级', total: 69, yellow: 20, blue: 28 }
    ],

    unitControlRate: [
      { name: '集装箱码头', rate: 95.2, color: 'var(--color-success)' },
      { name: '油品码头', rate: 89.6, color: 'var(--chart-orange)' },
      { name: '散货码头', rate: 96.4, color: 'var(--color-success)' },
      { name: '物流公司', rate: 93.3, color: 'var(--color-success)' },
      { name: '物业公司', rate: 91.7, color: 'var(--color-success)' }
    ],

    drillDown: {
      riskLevel: {
        title: '风险等级详情',
        columns: ['序号', '风险点名称', '所属单位', '风险等级', '管控状态', '评估日期'],
        data: [
          ['1', '1号原油储罐区', '油品码头公司', '重大风险', '管控中', '2026-04-15'],
          ['2', '3号泊位输油管道', '油品码头公司', '重大风险', '管控中', '2026-04-12'],
          ['3', 'LNG接收站', '油品码头公司', '重大风险', '管控中', '2026-03-28'],
          ['4', '集装箱码头岸桥', '集装箱码头公司', '较大风险', '受控', '2026-04-10'],
          ['5', '配电间高压设备', '散货码头公司', '较大风险', '受控', '2026-04-08'],
          ['6', '危化品装卸平台', '油品码头公司', '较大风险', '管控中', '2026-03-20'],
          ['7', '2号原油储罐区', '油品码头公司', '较大风险', '受控', '2026-03-15'],
          ['8', '油罐区防火堤', '油品码头公司', '一般风险', '受控', '2026-04-05']
        ]
      }
    }

  };

  window.AnalysisData = AnalysisData;
})();
