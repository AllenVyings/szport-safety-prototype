// permission-data.js — 权限管理 模拟数据
(function() {
  'use strict';

  // 菜单数据
  var menus = [
    { id:'home', name:'系统首页', icon:'🏠', path:'/home', children:null },
    { id:'dashboard', name:'数据看板', icon:'📊', path:'/dashboard', children:null },
    { id:'objective', name:'目标职责', icon:'🎯', children:[
      { id:'objective-target', name:'安全目标', path:'/objective/safety-target', buttons:['新增','编辑','删除','导出'] },
      { id:'objective-responsibility', name:'安全生产责任书', path:'/objective/responsibility', buttons:['签订','查看','导出'] },
      { id:'objective-evaluation', name:'安全履职评价', path:'/objective/evaluation', buttons:['评价','查看','导出'] },
      { id:'objective-meeting', name:'安全会议', path:'/objective/meeting', buttons:['新增','编辑','删除'] }
    ]},
    { id:'training', name:'教育培训', icon:'📚', children:[
      { id:'training-knowledge', name:'培训知识库管理', path:'/training/knowledge', buttons:['新增','编辑','删除','发布'] },
      { id:'training-education', name:'安全教育培训', path:'/training/education', buttons:['新增','编辑','删除','导出'] },
      { id:'training-competition', name:'知识竞赛中心', path:'/training/competition', buttons:['新增','编辑','删除','发布'] },
      { id:'training-external', name:'外来人员培训', path:'/training/external', buttons:['登记','查看','导出'] },
      { id:'training-archive', name:'培训档案与持证管理', path:'/training/archive', buttons:['查看','导出','提醒'] }
    ]},
    { id:'on-site', name:'现场管理', icon:'🏭', children:[
      { id:'on-site-equipment', name:'设备设施管理', path:'/on-site/equipment', buttons:['新增','编辑','删除','导出'] },
      { id:'on-site-dangerous-work', name:'危险作业管理', path:'/on-site/dangerous-work', buttons:['申请','审批','监控','导出'] },
      { id:'on-site-contractor', name:'相关方管理', path:'/on-site/contractor', buttons:['准入','评价','查看'] },
      { id:'on-site-behavior', name:'行为管控', path:'/on-site/behavior', buttons:['登记','处理','统计'] },
      { id:'on-site-occupational', name:'职业健康管理', path:'/on-site/occupational', buttons:['新增','编辑','查看','导出'] }
    ]},
    { id:'risk', name:'安全风险管控', icon:'⚠️', children:[
      { id:'risk-guide', name:'风险指引库', path:'/risk/guide', buttons:['新增','编辑','删除','发布'] },
      { id:'risk-identification', name:'危险源辨识', path:'/risk/identification', buttons:['新增','编辑','删除','导出'] },
      { id:'risk-check', name:'动态核查', path:'/risk/check', buttons:['核查','审批','查看'] },
      { id:'risk-map', name:'风险清单与四色图', path:'/risk/map', buttons:['查看','导出'] },
      { id:'risk-analysis', name:'风险统计分析', path:'/risk/analysis', buttons:['查看','导出'], disabled:true }
    ]},
    { id:'hazard', name:'隐患排查治理', icon:'🔍', children:[
      { id:'hazard-guide', name:'隐患指引库', path:'/hazard/guide', buttons:['新增','编辑','删除','发布'] },
      { id:'hazard-inspection', name:'安全检查', path:'/hazard/inspection', buttons:['新增','编辑','删除','导出'] },
      { id:'hazard-rectification', name:'隐患整改治理', path:'/hazard/rectification', buttons:['新增','审批','验收','导出'] },
      { id:'hazard-analysis', name:'隐患统计分析', path:'/hazard/analysis', buttons:['查看','导出'], disabled:true }
    ]},
    { id:'emergency', name:'应急管理', icon:'🚨', children:[
      { id:'emergency-personnel', name:'应急人员', path:'/emergency/personnel', buttons:['新增','编辑','删除'] },
      { id:'emergency-plan', name:'应急预案', path:'/emergency/plan', buttons:['新增','编辑','备案','删除'] },
      { id:'emergency-resource', name:'应急资源', path:'/emergency/resource', buttons:['新增','出库','调拨','盘点'] },
      { id:'emergency-drill', name:'应急演练', path:'/emergency/drill', buttons:['新增','编辑','评估','导出'] },
      { id:'emergency-response', name:'应急处置', path:'/emergency/response', buttons:['启动','处置','结束'] },
      { id:'emergency-typhoon', name:'防台风应急响应', path:'/emergency/typhoon', buttons:['预警','响应','解除'] }
    ]},
    { id:'accident', name:'事故管理', icon:'🔴', children:[
      { id:'accident-report', name:'事故上报', path:'/accident/report', buttons:['上报','续报','结案'] },
      { id:'accident-investigation', name:'事故调查与归档', path:'/accident/investigation', buttons:['新增','编辑','归档','导出'] }
    ]},
    { id:'assessment', name:'绩效考核', icon:'📈', children:[
      { id:'assessment-target', name:'考核对象与管控分级', path:'/assessment/target', buttons:['新增','编辑','删除','导出'] },
      { id:'assessment-control', name:'控制指标', path:'/assessment/control', buttons:['新增','编辑','删除'] },
      { id:'assessment-work', name:'工作指标与扣分规则', path:'/assessment/work', buttons:['新增','编辑','删除'] },
      { id:'assessment-bonus', name:'加分项与举报奖励', path:'/assessment/bonus', buttons:['新增','编辑','删除'] },
      { id:'assessment-result', name:'绩效评定与结果应用', path:'/assessment/result', buttons:['评定','查看','导出'] },
      { id:'assessment-frequency', name:'考核频次与执行', path:'/assessment/frequency', buttons:['执行','查看','导出'] }
    ]},
    { id:'management', name:'综合管理', icon:'📋', children:[
      { id:'management-ledger', name:'公司台账', path:'/management/ledger', buttons:['新增','编辑','删除','导出'] },
      { id:'management-project', name:'项目信息', path:'/management/project', children:[
        { id:'management-project-info', name:'项目基本信息', path:'/management/project-info', buttons:['新增','编辑','删除','导出','变更状态'] },
        { id:'management-project-personnel', name:'项目人员管理', path:'/management/project-personnel', buttons:['新增','编辑','删除','导出','启用','停用'] },
        { id:'management-project-safety', name:'项目安全记录', path:'/management/project-safety', buttons:['查看'] }
      ] },
      { id:'management-publish', name:'信息发布', path:'/management/publish', buttons:['新增','编辑','发布','撤回'] },
      { id:'management-supervision', name:'工作督办', path:'/management/supervision', buttons:['督办','反馈','查看'] },
      { id:'management-report', name:'安全报表', path:'/management/report', buttons:['生成','查看','导出'] }
    ]},
    { id:'security-basics', name:'基础保障', icon:'🛡️', children:[
      { id:'security-basics-org', name:'组织保障', path:'/security-basics/org', buttons:['新增','编辑','删除'] },
      { id:'security-basics-regulation', name:'制度保障', path:'/security-basics/regulation', buttons:['新增','编辑','删除','发布'] },
      { id:'security-basics-fund', name:'资金保障', path:'/security-basics/fund', buttons:['新增','编辑','查看','导出'] }
    ]},
    { id:'system-admin', name:'系统管理', icon:'⚙️', children:[
      { id:'system-org', name:'组织架构', path:'/system/org', buttons:['新增','编辑','删除','同步'] },
      { id:'system-user', name:'用户管理', path:'/system/user', buttons:['新增','编辑','删除','导出'] },
      { id:'system-permission', name:'权限管理', path:'/system/permission', buttons:['新增','编辑','删除'] },
      { id:'system-workflow', name:'流程管理', path:'/system/workflow', buttons:['新增','配置','停用','删除'] }
    ]},
    { id:'mobile', name:'安全移动端', icon:'📱', path:'/mobile', children:null }
  ];

  // 角色数据
  var roles = [
    { name:'超级管理员', code:'SUPER_ADMIN', type:'common', level:'', users:3, status:'enabled' },
    { name:'集团安全管理员', code:'GROUP_SAFETY_ADMIN', type:'level', level:'集团', users:5, status:'enabled' },
    { name:'公司安全管理员', code:'COMPANY_SAFETY_ADMIN', type:'level', level:'二级企业', users:12, status:'enabled' },
    { name:'下属企业安全员', code:'SUB_SAFETY_OFFICER', type:'level', level:'下属企业', users:26, status:'enabled' },
    { name:'检查员', code:'INSPECTOR', type:'common', level:'', users:28, status:'enabled' },
    { name:'培训管理员', code:'TRAINING_ADMIN', type:'common', level:'', users:8, status:'enabled' },
    { name:'普通员工', code:'EMPLOYEE', type:'common', level:'', users:0, status:'disabled' }
  ];

  // 角色编码映射
  var roleMap = {
    '超级管理员': 'SUPER_ADMIN',
    '集团安全管理员': 'GROUP_SAFETY_ADMIN',
    '公司安全管理员': 'COMPANY_SAFETY_ADMIN',
    '下属企业安全员': 'SUB_SAFETY_OFFICER',
    '检查员': 'INSPECTOR',
    '培训管理员': 'TRAINING_ADMIN',
    '普通员工': 'EMPLOYEE'
  };

  // 数据权限配置
  var dataPermConfig = {
    '2': { orgScope: 'all', businessTypes: ['目标职责数据','教育培训数据','现场管理数据','危险源数据','隐患数据','安全检查数据','风险管控数据','作业数据','应急数据','事故数据','考核数据','综合管理数据','基础保障数据','报表数据'] },
    '3': { orgScope: 'company-sub', businessTypes: ['目标职责数据','教育培训数据','现场管理数据','危险源数据','隐患数据','安全检查数据','风险管控数据','作业数据','应急数据','事故数据','考核数据','综合管理数据'] },
    '4': { orgScope: 'company', businessTypes: ['目标职责数据','教育培训数据','现场管理数据','危险源数据','隐患数据','安全检查数据'] },
    '5': { orgScope: 'dept', businessTypes: ['隐患数据','安全检查数据'] },
    '6': { orgScope: 'self', businessTypes: ['教育培训数据'] }
  };

  window.PermissionData = {
    menus: menus,
    roles: roles,
    roleMap: roleMap,
    dataPermConfig: dataPermConfig
  };
})();
