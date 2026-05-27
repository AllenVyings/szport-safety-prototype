/**
 * 深圳港集团安全综合管理系统 V2.0 - 菜单配置
 * 基于 PRD V2.0 的 14 个模块，对应侧边栏菜单
 */

const MENU_CONFIG = [
  {
    id: 'home',
    name: '系统首页',
    icon: '🏠',
    module: 'home/home',
    path: 'modules/home/home.html',
    description: '功能导航与个人工作台'
  },
  {
    id: 'dashboard',
    name: '数据看板',
    icon: '📊',
    module: 'dashboard/dashboard',
    path: 'modules/dashboard/dashboard.html',
    description: '安全态势总览与专题数据展示'
  },
  {
    id: 'objective',
    name: '目标职责',
    icon: '🎯',
    children: [
      {
        id: 'objective-target',
        name: '安全目标',
        module: 'objective/safety-target',
        path: 'modules/objective/safety-target.html',
        description: '安全目标制定与考核指标管理'
      },
      {
        id: 'objective-responsibility',
        name: '安全生产责任书',
        module: 'objective/responsibility',
        path: 'modules/objective/responsibility.html',
        description: '责任书线上签订与线下录入'
      },
      {
        id: 'objective-evaluation',
        name: '安全履职评价',
        module: 'objective/evaluation',
        path: 'modules/objective/evaluation.html',
        description: '安全履职评价与考核'
      },
      {
        id: 'objective-meeting',
        name: '安全会议',
        module: 'objective/meeting',
        path: 'modules/objective/meeting.html',
        description: '安全会议管理与记录'
      }
    ]
  },
  {
    id: 'training',
    name: '教育培训',
    icon: '📚',
    children: [
      {
        id: 'training-knowledge',
        name: '培训知识库管理',
        module: 'training/knowledge',
        path: 'modules/training/knowledge.html',
        description: '安全知识、培训课件、考试题库'
      },
      {
        id: 'training-education',
        name: '安全教育培训',
        module: 'training/education',
        path: 'modules/training/education.html',
        description: '培训计划与任务管理'
      },
      {
        id: 'training-competition',
        name: '知识竞赛中心',
        module: 'training/competition',
        path: 'modules/training/competition.html',
        description: '竞赛组织与成绩榜单'
      },
      {
        id: 'training-external',
        name: '外来人员培训',
        module: 'training/external',
        path: 'modules/training/external.html',
        description: '相关方人员安全培训'
      },
      {
        id: 'training-archive',
        name: '培训档案与持证管理',
        module: 'training/archive',
        path: 'modules/training/archive.html',
        description: '培训记录归档与持证管理'
      }
    ]
  },
  {
    id: 'on-site',
    name: '现场管理',
    icon: '🏭',
    children: [
      {
        id: 'on-site-equipment',
        name: '设备设施管理',
        module: 'on-site/equipment',
        path: 'modules/on-site/equipment.html',
        description: '安全设备设施台账与检验'
      },
      {
        id: 'on-site-dangerous-work',
        name: '危险作业管理',
        module: 'on-site/dangerous-work',
        path: 'modules/on-site/dangerous-work.html',
        description: '作业票审批与过程管控'
      },
      {
        id: 'on-site-contractor',
        name: '相关方管理',
        module: 'on-site/contractor',
        path: 'modules/on-site/contractor.html',
        description: '承包商准入与过程管理'
      },
      {
        id: 'on-site-behavior',
        name: '行为管控',
        module: 'on-site/behavior',
        path: 'modules/on-site/behavior.html',
        description: '三违行为管控与积分管理'
      },
      {
        id: 'on-site-occupational',
        name: '职业健康管理',
        module: 'on-site/occupational',
        path: 'modules/on-site/occupational.html',
        description: '职业病危害因素监测与体检'
      }
    ]
  },
  {
    id: 'risk',
    name: '安全风险管控',
    icon: '⚠️',
    children: [
      {
        id: 'risk-guide',
        name: '风险指引库',
        module: 'risk/guide',
        path: 'modules/risk/guide.html',
        description: '行业风险辨识指引'
      },
      {
        id: 'risk-identification',
        name: '危险源辨识',
        module: 'risk/identification',
        path: 'modules/risk/identification.html',
        description: '危险源辨识与风险评估'
      },
      {
        id: 'risk-check',
        name: '动态核查',
        module: 'risk/check',
        path: 'modules/risk/check.html',
        description: '风险管控措施动态核查'
      },
      {
        id: 'risk-map',
        name: '风险清单与四色图',
        module: 'risk/map',
        path: 'modules/risk/map.html',
        description: '风险清单管理与动态四色图'
      },
      {
        id: 'risk-analysis',
        name: '风险统计分析',
        module: 'risk/analysis',
        path: 'modules/risk/analysis.html',
        description: '风险分布与趋势分析'
      }
    ]
  },
  {
    id: 'hazard',
    name: '隐患排查治理',
    icon: '🔍',
    children: [
      {
        id: 'hazard-guide',
        name: '隐患指引库',
        module: 'hazard/guide',
        path: 'modules/hazard/guide.html',
        description: '隐患排查标准指引'
      },
      {
        id: 'hazard-inspection',
        name: '安全检查',
        module: 'hazard/inspection',
        path: 'modules/hazard/inspection.html',
        description: '检查计划与检查执行'
      },
      {
        id: 'hazard-rectification',
        name: '隐患整改治理',
        module: 'hazard/rectification',
        path: 'modules/hazard/rectification.html',
        description: '隐患发现、整改与验收闭环'
      },
      {
        id: 'hazard-analysis',
        name: '隐患统计分析',
        module: 'hazard/analysis',
        path: 'modules/hazard/analysis.html',
        description: '隐患分布与趋势统计'
      }
    ]
  },
  {
    id: 'emergency',
    name: '应急管理',
    icon: '🚨',
    children: [
      {
        id: 'emergency-personnel',
        name: '应急人员',
        module: 'emergency/personnel',
        path: 'modules/emergency/personnel.html',
        description: '应急人员台账与AB角管理'
      },
      {
        id: 'emergency-plan',
        name: '应急预案',
        module: 'emergency/plan',
        path: 'modules/emergency/plan.html',
        description: '应急预案编制与备案管理'
      },
      {
        id: 'emergency-resource',
        name: '应急资源',
        module: 'emergency/resource',
        path: 'modules/emergency/resource.html',
        description: '应急物资与调拨管理'
      },
      {
        id: 'emergency-drill',
        name: '应急演练',
        module: 'emergency/drill',
        path: 'modules/emergency/drill.html',
        description: '演练计划与评估'
      },
      {
        id: 'emergency-response',
        name: '应急处置',
        module: 'emergency/response',
        path: 'modules/emergency/response.html',
        description: '事故应急响应与处置'
      },
      {
        id: 'emergency-typhoon',
        name: '防台风应急响应',
        module: 'emergency/typhoon',
        path: 'modules/emergency/typhoon.html',
        description: '台风预警与应急响应'
      }
    ]
  },
  {
    id: 'accident',
    name: '事故管理',
    icon: '🔴',
    children: [
      {
        id: 'accident-report',
        name: '事故上报',
        module: 'accident/report',
        path: 'modules/accident/report.html',
        description: '事故首报、续报与结案'
      },
      {
        id: 'accident-investigation',
        name: '事故调查与归档',
        module: 'accident/investigation',
        path: 'modules/accident/investigation.html',
        description: '事故调查处理与档案管理'
      }
    ]
  },
  {
    id: 'assessment',
    name: '绩效考核',
    icon: '📈',
    children: [
      {
        id: 'assessment-target',
        name: '考核对象',
        module: 'assessment/target',
        path: 'modules/assessment/target.html',
        description: 'A/B/C级企业管理与考核对象（PRD 3.10.1）'
      },
      {
        id: 'assessment-indicators',
        name: '考核规则',
        module: 'assessment/indicators',
        path: 'modules/assessment/indicators.html',
        description: '否决项/扣分/加分规则管理（PRD 3.10.2）'
      },
      {
        id: 'assessment-result',
        name: '考核评定',
        module: 'assessment/result',
        path: 'modules/assessment/result.html',
        description: '考核计划/执行/评定/公示与奖惩（PRD 3.10.3）'
      }
    ]
  },
  {
    id: 'management',
    name: '综合管理',
    icon: '📋',
    children: [
      {
        id: 'management-ledger',
        name: '公司台账',
        module: 'management/ledger',
        path: 'modules/management/ledger.html',
        description: '企业安全台账管理'
      },
      {
        id: 'management-project',
        name: '项目信息',
        children: [
          {
            id: 'management-project-info',
            name: '项目基本信息',
            module: 'management/project-info',
            path: 'modules/management/project-info.html',
            description: '项目台账管理与状态流转'
          },
          {
            id: 'management-project-personnel',
            name: '项目人员管理',
            module: 'management/project-personnel',
            path: 'modules/management/project-personnel.html',
            description: '按项目维度维护人员台账'
          },
          {
            id: 'management-project-safety',
            name: '项目安全记录',
            module: 'management/project-safety',
            path: 'modules/management/project-safety.html',
            description: '查看项目关联安全业务数据'
          }
        ]
      },
      {
        id: 'management-publish',
        name: '信息发布',
        module: 'management/publish',
        path: 'modules/management/publish.html',
        description: '安全要闻与通知公告'
      },
      {
        id: 'management-supervision',
        name: '工作督办',
        module: 'management/supervision',
        path: 'modules/management/supervision.html',
        description: '工作督办与跟踪'
      },
      {
        id: 'management-report',
        name: '安全报表',
        module: 'management/report',
        path: 'modules/management/report.html',
        description: '周报/月报自动归集'
      }
    ]
  },
  {
    id: 'security-basics',
    name: '基础保障',
    icon: '🛡️',
    children: [
      {
        id: 'security-basics-org',
        name: '组织保障',
        module: 'security-basics/org',
        path: 'modules/security-basics/org.html',
        description: '左侧§3.13.1全量单位树，右侧双Tab：安全架构图与机构职责配置'
      },
      {
        id: 'security-basics-regulation',
        name: '制度保障',
        module: 'security-basics/regulation',
        path: 'modules/security-basics/regulation.html',
        description: '法律法规与规章制度'
      },
      {
        id: 'security-basics-fund',
        name: '资金保障',
        module: 'security-basics/fund',
        path: 'modules/security-basics/fund.html',
        description: '安全费用提取与使用'
      },
      {
        id: 'security-basics-tech',
        name: '科技保障',
        module: 'security-basics/tech',
        path: 'modules/security-basics/tech.html',
        description: '科技保障项目台账管理（GB/T33000-2025 5.5）'
      }
    ]
  },
  {
    id: 'system-admin',
    name: '系统管理',
    icon: '⚙️',
    children: [
      {
        id: 'system-org',
        name: '组织架构',
        module: 'system-admin/org',
        path: 'modules/system-admin/org.html',
        description: '集团-二级企业组织树'
      },
      {
        id: 'system-user',
        name: '用户管理',
        module: 'system-admin/user',
        path: 'modules/system-admin/user.html',
        description: '用户账号与一人多岗'
      },
      {
        id: 'system-permission',
        name: '权限管理',
        module: 'system-admin/permission',
        path: 'modules/system-admin/permission.html',
        description: '角色权限与数据权限'
      },
      {
        id: 'system-workflow',
        name: '流程管理',
        module: 'system-admin/workflow',
        path: 'modules/system-admin/workflow.html',
        description: '审批流程与转派配置'
      },
      {
        id: 'system-operation-log',
        name: '操作日志',
        module: 'system-admin/operation-log',
        path: 'modules/system-admin/operation-log.html',
        description: '全系统操作审计与日志查询'
      },
      {
        id: 'system-basic-config',
        name: '基础配置',
        module: 'system-admin/basic-config',
        path: 'modules/system-admin/basic-config.html',
        description: '业务模块下拉选项来源（风险管控分类/评估单元/风险点/事故类型）'
      },
      {
        id: 'system-data-dict',
        name: '数据字典',
        module: 'system-admin/data-dict',
        path: 'modules/system-admin/data-dict.html',
        description: '业务枚举与字典项维护'
      }
    ]
  },
  {
    id: 'mobile',
    name: '安全移动端',
    icon: '📱',
    module: 'mobile/mobile-home',
    path: 'modules/mobile/mobile-home.html',
    description: '移动端功能入口',
    badge: '移动端'
  }
];

/**
 * 查找菜单项
 */
function findMenuItem(menuId) {
  for (const item of MENU_CONFIG) {
    if (item.id === menuId) return item;
    if (item.children) {
      for (const child of item.children) {
        if (child.id === menuId) return child;
        if (child.children) {
          const grandchild = child.children.find(gc => gc.id === menuId);
          if (grandchild) return grandchild;
        }
      }
    }
  }
  return null;
}

/**
 * 获取面包屑路径
 */
function getBreadcrumb(menuId) {
  for (const item of MENU_CONFIG) {
    if (item.id === menuId) return [{ name: item.name }];
    if (item.children) {
      for (const child of item.children) {
        if (child.id === menuId) return [{ name: item.name }, { name: child.name }];
        if (child.children) {
          const grandchild = child.children.find(gc => gc.id === menuId);
          if (grandchild) return [{ name: item.name }, { name: child.name }, { name: grandchild.name }];
        }
      }
    }
  }
  return [];
}
