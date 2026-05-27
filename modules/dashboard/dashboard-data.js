// dashboard-data.js — 看板数据层
(function() {
  'use strict';

  var DashboardData = {

    kpi: [
      { key: 'training', label: '安全培训完成率', value: '87.3%', change: '↑ 较上月 +2.1%', changeDir: 'up', alert: false },
      { key: 'risk', label: '风险受控率', value: '94.6%', change: '↑ 较上月 +0.8%', changeDir: 'up', alert: false },
      { key: 'hazard', label: '隐患整改闭环率', value: '72.1%', change: '↓ 较上月 -5.3%', changeDir: 'down', alert: true },
      { key: 'work', label: '安全作业合规率', value: '96.2%', change: '→ 持平', changeDir: 'flat', alert: false },
      { key: 'drill', label: '应急演练完成率', value: '65.8%', change: '↓ 较上月 -8.1%', changeDir: 'down', alert: true }
    ],

    alerts: [
      { level: 'danger', text: '隐患整改闭环率 72.1%，低于 80% 合格线' },
      { level: 'danger', text: '应急演练完成率 65.8%，低于 80% 合格线' },
      { level: 'warning', text: '海星港口安全评分 78，低于合格线' },
      { level: 'warning', text: '妈湾港务安全评分 73，低于合格线' }
    ],

    drillDown: {
      training: {
        title: '安全培训完成率 - 明细',
        columns: ['分类', '完成率'],
        items: [
          { name: '消防安全培训', rate: '95%', status: 'normal' },
          { name: '危化品安全培训', rate: '88%', status: 'normal' },
          { name: '高处作业培训', rate: '72%', status: 'warning' },
          { name: '特种作业培训', rate: '90%', status: 'normal' },
          { name: '新员工入职培训', rate: '100%', status: 'normal' }
        ]
      },
      risk: {
        title: '风险受控率 - 明细',
        columns: ['分类', '完成率'],
        items: [
          { name: '重大风险', rate: '100%', status: 'normal' },
          { name: '较大风险', rate: '96%', status: 'normal' },
          { name: '一般风险', rate: '92%', status: 'warning' },
          { name: '低风险', rate: '90%', status: 'normal' }
        ]
      },
      hazard: {
        title: '隐患整改闭环率 - 明细',
        columns: ['分类', '完成率'],
        items: [
          { name: '重大隐患', rate: '60%', status: 'danger' },
          { name: '较大隐患', rate: '70%', status: 'warning' },
          { name: '一般隐患', rate: '80%', status: 'warning' },
          { name: '轻微隐患', rate: '78%', status: 'warning' }
        ]
      },
      work: {
        title: '安全作业合规率 - 明细',
        columns: ['分类', '完成率'],
        items: [
          { name: '动火作业', rate: '98%', status: 'normal' },
          { name: '高处作业', rate: '95%', status: 'normal' },
          { name: '受限空间作业', rate: '94%', status: 'normal' },
          { name: '临时用电', rate: '97%', status: 'normal' }
        ]
      },
      drill: {
        title: '应急演练完成率 - 明细',
        columns: ['分类', '完成率'],
        items: [
          { name: '综合应急演练', rate: '50%', status: 'danger' },
          { name: '专项应急演练', rate: '70%', status: 'warning' },
          { name: '现场处置演练', rate: '78%', status: 'warning' },
          { name: '桌面推演', rate: '65%', status: 'warning' }
        ]
      }
    },

    lastRefresh: '2026-05-17 08:30'

  };

  window.DashboardData = DashboardData;
})();
