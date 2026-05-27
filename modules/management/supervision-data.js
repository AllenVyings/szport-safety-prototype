// supervision-data.js — 工作督办数据
(function() {
  'use strict';

  var SupervisionData = {

    stats: { total: 24, pending: 3, executing: 8, feedback: 6, overdue: 2 },

    taskList: [
      { id: 'sup-1', title: '落实集团安全生产大检查整改要求', priority: '紧急', priorityCls: 'priority-urgent', target: '集装箱码头公司', source: '上级', sourceCls: 'source-upper', deadline: '2026-05-20', status: '执行中', statusCls: 'tag-executing' },
      { id: 'sup-2', title: '危化品仓库消防隐患整改', priority: '重要', priorityCls: 'priority-high', target: '危化品储运公司', source: '本企业', sourceCls: 'source-local', deadline: '2026-05-25', status: '待接收', statusCls: 'tag-pending' },
      { id: 'sup-3', title: '安全生产标准化建设达标验收', priority: '一般', priorityCls: 'priority-normal', target: '物流运输公司', source: '本企业', sourceCls: 'source-local', deadline: '2026-05-18', status: '已反馈', statusCls: 'tag-feedback' },
      { id: 'sup-4', title: '上级安全督导检查问题整改', priority: '紧急', priorityCls: 'priority-urgent', target: '物业管理公司', source: '上级', sourceCls: 'source-upper', deadline: '2026-05-10', status: '已逾期', statusCls: 'tag-overdue' },
      { id: 'sup-5', title: '特种设备定期检验整改落实', priority: '重要', priorityCls: 'priority-high', target: '集装箱码头公司', source: '本企业', sourceCls: 'source-local', deadline: '2026-05-30', status: '已确认', statusCls: 'tag-confirmed' }
    ],

    unitStats: [
      { name: '集装箱码头公司', total: 8, done: 5, executing: 2, overdue: 1, doneRate: '62.5%', overdueRate: '12.5%', doneCls: 'u-text-success', overdueCls: 'u-text-error' },
      { name: '危化品储运公司', total: 6, done: 4, executing: 1, overdue: 1, doneRate: '66.7%', overdueRate: '16.7%', doneCls: 'u-text-success', overdueCls: 'u-text-error' },
      { name: '物流运输公司', total: 5, done: 4, executing: 1, overdue: 0, doneRate: '80.0%', overdueRate: '0%', doneCls: 'u-text-success', overdueCls: 'u-text-success' },
      { name: '物业管理公司', total: 5, done: 2, executing: 2, overdue: 1, doneRate: '40.0%', overdueRate: '20.0%', doneCls: 'u-text-warning', overdueCls: 'u-text-error' }
    ],

    units: ['集装箱码头公司', '危化品储运公司', '物流运输公司', '物业管理公司'],

    detailData: {
      'sup-1': { title: '落实集团安全生产大检查整改要求', basic: [['督办对象', '集装箱码头公司'], ['来源', '上级'], ['截止日期', '2026-05-20'], ['状态', '执行中']], desc: '责任单位已提交阶段性整改方案，3项措施已完成。', timeline: [{ status: 'done', time: '2026-05-08', event: '集团下发督办' }, { status: 'done', time: '2026-05-09', event: '单位接收' }, { status: 'active', time: '进行中', event: '整改执行' }] },
      'sup-2': { title: '危化品仓库消防隐患整改', basic: [['督办对象', '危化品储运公司'], ['来源', '本企业'], ['截止日期', '2026-05-25'], ['状态', '待接收']], desc: '待责任单位确认接收后开始执行。', timeline: [{ status: 'done', time: '2026-05-15', event: '督办派发' }, { status: 'active', time: '待接收', event: '等待确认' }] },
      'sup-3': { title: '安全生产标准化建设达标验收', basic: [['督办对象', '物流运输公司'], ['状态', '已反馈']], desc: '已提交验收材料，待发起方确认闭环。', timeline: [{ status: 'done', time: '2026-05-01', event: '派发' }, { status: 'done', time: '2026-05-17', event: '提交反馈' }, { status: 'active', time: '待确认', event: '确认闭环' }] },
      'sup-4': { title: '上级安全督导检查问题整改', basic: [['督办对象', '物业管理公司'], ['状态', '已逾期']], desc: '逾期已触发升级提醒，集团督办中。', timeline: [{ status: 'done', time: '2026-05-01', event: '上级督办' }, { status: 'active', time: '已逾期', event: '催办+升级' }] },
      'sup-5': { title: '特种设备定期检验整改落实', basic: [['督办对象', '集装箱码头公司'], ['状态', '已确认']], desc: '整改完成并经确认归档。', timeline: [{ status: 'done', time: '2026-04-20', event: '派发' }, { status: 'done', time: '2026-05-28', event: '反馈' }, { status: 'done', time: '2026-05-30', event: '确认闭环' }] }
    }
  };

  window.SupervisionData = SupervisionData;
})();
