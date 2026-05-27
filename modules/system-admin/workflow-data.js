// workflow-data.js — 流程管理数据
(function() {
  'use strict';

  var WorkflowData = {

    flows: [
      { id: 'f01', name: '危险源等级确认审批', module: '风险管控', nodeCount: 5, functions: ['会签', '驳回'], status: '已启用', desc: '用于危险源辨识后等级确认的审批流程，涉及会签和驳回功能。' },
      { id: 'f02', name: '隐患整改验收审批', module: '隐患治理', nodeCount: 4, functions: ['驳回', '转派'], status: '已启用', desc: '隐患整改完成后验收审批流程，支持驳回和转派。' },
      { id: 'f03', name: '培训计划审批', module: '教育培训', nodeCount: 3, functions: ['驳回', '废弃'], status: '已启用', desc: '年度培训计划提交后的审批流程。' },
      { id: 'f04', name: '信息发布审批', module: '综合管理', nodeCount: 2, functions: ['驳回', '跳转'], status: '草稿', desc: '信息发布前的审核流程，草稿状态待完善。' },
      { id: 'f05', name: '应急预案备案审批', module: '应急管理', nodeCount: 6, functions: ['会签', '驳回', '转派'], status: '已启用', desc: '应急预案备案审批流程，涉及多级会签。' },
      { id: 'f06', name: '安全事故上报审批', module: '事故管理', nodeCount: 4, functions: ['驳回', '跳转'], status: '已启用', desc: '安全事故信息上报的审批流程。' },
      { id: 'f07', name: '设备报废审批', module: '现场管理', nodeCount: 3, functions: ['驳回'], status: '已停用', desc: '设备报废申请审批，已停用待修订。' },
      { id: 'f08', name: '相关方准入审批', module: '现场管理', nodeCount: 5, functions: ['会签', '驳回', '废弃'], status: '待配置', desc: '相关方单位准入审批流程，节点待配置。' }
    ],

    modules: ['风险管控', '隐患治理', '教育培训', '综合管理', '应急管理', '事故管理', '现场管理'],

    functionTypes: {
      '会签': 'tag-func-sign',
      '驳回': 'tag-func-reject',
      '跳转': 'tag-func-jump',
      '废弃': 'tag-func-abandon',
      '转派': 'tag-func-transfer'
    },

    statusTags: {
      '已启用': 'tag-enabled',
      '草稿': 'tag-draft',
      '已停用': 'tag-stopped',
      '待配置': 'tag-warning'
    },

    // 流程设计器节点数据
    designerNodes: {
      f01: [
        { name: '开始', type: '开始节点', assigneeType: '', assignee: '' },
        { name: '项目负责人审批', type: '审批节点', assigneeType: '按角色', assignee: '项目安全负责人' },
        { name: '公司安办审批', type: '审批节点', assigneeType: '按组织', assignee: '公司安全管理部' },
        { name: '风险等级判断', type: '条件节点', assigneeType: '', assignee: '' },
        { name: '上级企业审批', type: '审批节点', assigneeType: '按组织', assignee: '集团安全管理部' },
        { name: '结束', type: '结束节点', assigneeType: '', assignee: '' }
      ]
    },

    // 新建流程表单默认值
    newFlowDefaults: {
      name: '', module: '风险管控', functions: [], desc: ''
    }

  };

  window.WorkflowData = WorkflowData;
})();
