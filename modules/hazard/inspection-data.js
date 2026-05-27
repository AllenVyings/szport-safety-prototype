// inspection-data.js — 安全检查 模拟数据
(function() {
  'use strict';

  var detailData = {
    'plan-1': {
      kind: '检查计划', name: '2026年5月月度安全检查', type: '全面检查', scope: '全集团',
      date: '2026-05-10 ~ 05-20', status: '执行中', statusClass: 'tag-executing',
      desc: '月度例行安全检查，覆盖各下属单位重点区域与关键装置。',
      approval: [
        { name: '发起人', status: 'passed', time: '2026-05-08 09:00' },
        { name: '公司安办', status: 'passed', time: '2026-05-08 15:30' },
        { name: '任务分派', status: 'current', time: '执行中' }
      ]
    },
    'plan-2': {
      kind: '检查计划', name: '节前安全专项检查', type: '专项检查', scope: '集装箱码头公司',
      date: '2026-05-28 ~ 05-30', status: '待审批', statusClass: 'tag-pending',
      desc: '节前重点部位专项检查，含消防、危化、特种设备。',
      approval: [
        { name: '发起人', status: 'passed', time: '2026-05-20 10:00' },
        { name: '部门负责人', status: 'current', time: '审批中' },
        { name: '公司分管领导', status: 'waiting', time: '' }
      ]
    },
    'plan-3': {
      kind: '检查计划', name: '消防安全日常巡查', type: '飞行检查', scope: '油罐区',
      date: '2026-05-16', status: '待提交', statusClass: 'tag-draft',
      desc: '油罐区消防设施与应急通道飞行检查草稿。',
      approval: []
    },
    'plan-4': {
      kind: '检查计划', name: '4月月度安全检查', type: '全面检查', scope: '全集团',
      date: '2026-04-10 ~ 04-20', status: '已完成', statusClass: 'tag-completed',
      desc: '4月检查已闭环，共发现隐患 12 项，整改率 100%。',
      approval: [
        { name: '发起人', status: 'passed', time: '2026-04-08 09:00' },
        { name: '审批', status: 'passed', time: '2026-04-08 16:00' },
        { name: '执行闭环', status: 'passed', time: '2026-04-22 17:00' }
      ]
    },
    'task-1': {
      kind: '检查任务', name: '油罐区防火设施', plan: '5月月度安全检查', type: '全面检查',
      executor: '张安全', date: '2026-05-18', hazards: '3项', status: '已提交', statusClass: 'tag-executing',
      desc: '已提交检查结果，发现 3 项隐患已进入整改治理流程。',
      approval: [
        { name: '任务执行', status: 'passed', time: '2026-05-18 14:20' },
        { name: '隐患录入', status: 'passed', time: '2026-05-18 15:00' },
        { name: '整改跟踪', status: 'current', time: '进行中' }
      ]
    },
    'task-2': {
      kind: '检查任务', name: '码头作业区安全标识', plan: '5月月度安全检查', type: '全面检查',
      executor: '李检查', date: '2026-05-20', hazards: '0项', status: '待提交', statusClass: 'tag-draft',
      desc: '检查任务待现场执行，截止日前需完成检查项填报。',
      approval: [
        { name: '任务分派', status: 'passed', time: '2026-05-10 09:00' },
        { name: '现场执行', status: 'current', time: '待提交' }
      ]
    },
    'task-3': {
      kind: '检查任务', name: '配电间设备检查', plan: '4月月度安全检查', type: '专项检查',
      executor: '王电工', date: '2026-04-20', hazards: '1项', status: '已完成', statusClass: 'tag-completed',
      desc: '任务已完成，1 项一般隐患已整改闭环。',
      approval: [
        { name: '任务执行', status: 'passed', time: '2026-04-18 11:00' },
        { name: '隐患整改', status: 'passed', time: '2026-04-25 16:30' },
        { name: '验收闭环', status: 'passed', time: '2026-04-26 10:00' }
      ]
    }
  };

  window.InspectionData = {
    detailData: detailData
  };
})();
