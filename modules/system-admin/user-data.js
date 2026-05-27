/** user.html - 数据层（从内联脚本提取） */

// ===== 组织架构数据（与组织架构模块一致） =====
var orgList = [
  { id:'group', name:'深圳港集团', type:'单位', children:[
    { id:'d01', name:'安全管理与环保部', type:'部门' },
    { id:'d02', name:'办公室', type:'部门' },
    { id:'d03', name:'党群工作部', type:'部门' },
    { id:'d04', name:'纪检监察室', type:'部门' },
    { id:'d05', name:'人力资源部', type:'部门' },
    { id:'d06', name:'财务管理部', type:'部门' },
    { id:'d07', name:'审计部', type:'部门' },
    { id:'d08', name:'战略发展部', type:'部门' },
    { id:'d09', name:'投资与资本运营部', type:'部门' },
    { id:'d10', name:'企业管理部', type:'部门' },
    { id:'d11', name:'合规部', type:'部门' },
    { id:'d12', name:'建设管理部', type:'部门' },
    { id:'d13', name:'数字化创新中心', type:'部门' },
    { id:'d14', name:'港航事业部', type:'部门' },
    { id:'d15', name:'海洋产业事业部', type:'部门' },
    { id:'d16', name:'盐田港建设指挥部办公室', type:'部门' },
    { id:'u01', name:'深圳市盐田港股份有限公司', type:'单位', children:[
      { id:'u01-d01', name:'安全管理与环保部', type:'部门' },
      { id:'u01-d02', name:'运营管理部', type:'部门' }
    ]},
    { id:'u02', name:'深圳市深圳港海洋发展有限公司', type:'单位', children:[
      { id:'u02-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u03', name:'深圳市深圳港物流集团有限公司', type:'单位', children:[
      { id:'u03-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u04', name:'深圳市华舟海洋发展股份有限公司', type:'单位', children:[
      { id:'u04-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u05', name:'深圳市深圳港能源发展有限公司', type:'单位', children:[
      { id:'u05-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u06', name:'深圳市深圳港资本有限公司', type:'单位', children:[
      { id:'u06-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u07', name:'深圳市深圳港港口服务集团有限公司', type:'单位', children:[
      { id:'u07-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u08', name:'盐田港国际资讯有限公司', type:'单位', children:[
      { id:'u08-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u09', name:'深圳市深圳港港口联运有限公司', type:'单位', children:[
      { id:'u09-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u10', name:'深圳市平盐疏港铁路有限公司', type:'单位', children:[
      { id:'u10-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u11', name:'深圳市深汕海洋发展有限公司', type:'单位', children:[
      { id:'u11-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u12', name:'深圳市盐田港保税产业发展有限公司', type:'单位', children:[
      { id:'u12-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u13', name:'深圳市盐田东港区码头有限公司', type:'单位', children:[
      { id:'u13-d01', name:'安全管理与环保部', type:'部门' }
    ]},
    { id:'u14', name:'江西省深赣港产城发展有限公司', type:'单位', children:[
      { id:'u14-d01', name:'安全管理与环保部', type:'部门' }
    ]}
  ]}
];

// ===== 用户数据 =====
var userList = [
  { id:1, userNo:'U20230001', name:'陈国安', login:'chenga', org:'安全管理与环保部', orgId:'d01', oaOrg:'集团安全管理与环保部', gender:'男', hireDate:'2019-03-15', roles:['系统管理员','安全管理员'], status:'启用', phone:'13800138001', remark:'' },
  { id:2, userNo:'U20230002', name:'林检查', login:'linjc', org:'安全管理与环保部', orgId:'d01', oaOrg:'集团安全管理与环保部', gender:'男', hireDate:'2020-06-01', roles:['安全主管'], status:'启用', phone:'', remark:'' },
  { id:3, userNo:'U20230003', name:'王海波', login:'wanghb', org:'深圳市盐田港股份有限公司', orgId:'u01', oaOrg:'盐田港股份公司', gender:'男', hireDate:'2018-09-10', roles:['安全管理员'], status:'启用', phone:'13900139002', remark:'' },
  { id:4, userNo:'U20230004', name:'赵明远', login:'zhaomy', org:'深圳市深圳港海洋发展有限公司', orgId:'u02', oaOrg:'海洋发展公司', gender:'男', hireDate:'2021-01-20', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:5, userNo:'U20230005', name:'刘安全', login:'liuaq', org:'深圳市盐田港股份有限公司', orgId:'u01', oaOrg:'盐田港股份公司', gender:'男', hireDate:'2022-04-12', roles:['检查员'], status:'启用', phone:'13700137003', remark:'' },
  { id:6, userNo:'U20230006', name:'张建设', login:'zhangjs', org:'建设管理部', orgId:'d12', oaOrg:'集团建设管理部', gender:'男', hireDate:'2017-11-08', roles:['安全主管'], status:'启用', phone:'', remark:'' },
  { id:7, userNo:'U20230007', name:'李培训', login:'lipx', org:'人力资源部', orgId:'d05', oaOrg:'集团人力资源部', gender:'女', hireDate:'2019-07-22', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:8, userNo:'U20230008', name:'孙物流', login:'sunwl', org:'深圳市深圳港物流集团有限公司', orgId:'u03', oaOrg:'物流集团公司', gender:'男', hireDate:'2020-03-05', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:9, userNo:'U20230009', name:'周审计', login:'zhousj', org:'审计部', orgId:'d07', oaOrg:'集团审计部', gender:'男', hireDate:'2018-05-18', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:10, userNo:'U20230010', name:'吴能源', login:'wuny', org:'深圳市深圳港能源发展有限公司', orgId:'u05', oaOrg:'能源发展公司', gender:'男', hireDate:'2021-08-30', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:11, userNo:'U20230011', name:'郑船舶', login:'zhengcb', org:'深圳市华舟海洋发展股份有限公司', orgId:'u04', oaOrg:'华舟海洋公司', gender:'男', hireDate:'2020-12-01', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:12, userNo:'U20230012', name:'钱资本', login:'qianzb', org:'深圳市深圳港资本有限公司', orgId:'u06', oaOrg:'资本公司', gender:'男', hireDate:'2019-02-14', roles:['普通用户'], status:'停用', phone:'', remark:'已调离' },
  { id:13, userNo:'U20230013', name:'冯港口', login:'fenggk', org:'深圳市深圳港港口服务集团有限公司', orgId:'u07', oaOrg:'港口服务集团', gender:'男', hireDate:'2017-06-20', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:14, userNo:'U20230014', name:'陈国安', login:'chenga2', org:'深圳市盐田港股份有限公司', orgId:'u01', oaOrg:'盐田港股份公司', gender:'男', hireDate:'2019-03-15', roles:['安全主管'], status:'启用', phone:'', remark:'一人多岗-兼任盐田港安全主管' },
  { id:15, userNo:'U20230015', name:'何铁路', login:'hetl', org:'深圳市平盐疏港铁路有限公司', orgId:'u10', oaOrg:'疏港铁路公司', gender:'男', hireDate:'2021-10-11', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:16, userNo:'U20230016', name:'陆深汕', login:'luss', org:'深圳市深汕海洋发展有限公司', orgId:'u11', oaOrg:'深汕海洋公司', gender:'男', hireDate:'2022-01-15', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:17, userNo:'U20230017', name:'方保税', login:'fangbs', org:'深圳市盐田港保税产业发展有限公司', orgId:'u12', oaOrg:'保税产业公司', gender:'男', hireDate:'2020-09-08', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:18, userNo:'U20230018', name:'黄东港', login:'huangdg', org:'深圳市盐田东港区码头有限公司', orgId:'u13', oaOrg:'东港区码头公司', gender:'男', hireDate:'2021-05-20', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:19, userNo:'U20230019', name:'杨赣', login:'yangg', org:'江西省深赣港产城发展有限公司', orgId:'u14', oaOrg:'深赣港产城公司', gender:'男', hireDate:'2022-07-01', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:20, userNo:'U20230020', name:'徐资讯', login:'xuzx', org:'盐田港国际资讯有限公司', orgId:'u08', oaOrg:'国际资讯公司', gender:'男', hireDate:'2018-04-16', roles:['普通用户'], status:'停用', phone:'', remark:'已离职' },
  { id:21, userNo:'U20230021', name:'马联运', login:'maly', org:'深圳市深圳港港口联运有限公司', orgId:'u09', oaOrg:'港口联运公司', gender:'男', hireDate:'2020-11-25', roles:['安全管理员'], status:'启用', phone:'', remark:'' },
  { id:22, userNo:'U20240001', name:'朱新员', login:'zhuxy', org:'港航事业部', orgId:'d14', oaOrg:'集团港航事业部', gender:'男', hireDate:'2024-02-26', roles:['普通用户'], status:'待激活', phone:'', remark:'新入职，待激活' },
  { id:23, userNo:'U20230023', name:'韩办公', login:'hanbg', org:'办公室', orgId:'d02', oaOrg:'集团办公室', gender:'女', hireDate:'2016-08-10', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:24, userNo:'U20230024', name:'曹党群', login:'caodq', org:'党群工作部', orgId:'d03', oaOrg:'集团党群工作部', gender:'男', hireDate:'2017-03-22', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:25, userNo:'U20230025', name:'魏纪检', login:'weijj', org:'纪检监察室', orgId:'d04', oaOrg:'集团纪检监察室', gender:'男', hireDate:'2018-12-05', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:26, userNo:'U20230026', name:'许财务', login:'xucw', org:'财务管理部', orgId:'d06', oaOrg:'集团财务管理部', gender:'女', hireDate:'2019-06-18', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:27, userNo:'U20230027', name:'蒋战略', login:'jiangzl', org:'战略发展部', orgId:'d08', oaOrg:'集团战略发展部', gender:'男', hireDate:'2020-02-10', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:28, userNo:'U20230028', name:'沈投资', login:'shentz', org:'投资与资本运营部', orgId:'d09', oaOrg:'集团投资与资本运营部', gender:'男', hireDate:'2019-09-01', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:29, userNo:'U20230029', name:'曾企管', login:'zengqg', org:'企业管理部', orgId:'d10', oaOrg:'集团企业管理部', gender:'男', hireDate:'2021-04-15', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:30, userNo:'U20230030', name:'彭合规', login:'penghg', org:'合规部', orgId:'d11', oaOrg:'集团合规部', gender:'男', hireDate:'2022-06-08', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:31, userNo:'U20230031', name:'胡数创', login:'husc', org:'数字化创新中心', orgId:'d13', oaOrg:'集团数字化创新中心', gender:'男', hireDate:'2020-08-20', roles:['系统管理员'], status:'启用', phone:'', remark:'' },
  { id:32, userNo:'U20230032', name:'邓海洋', login:'denghy', org:'海洋产业事业部', orgId:'d15', oaOrg:'集团海洋产业事业部', gender:'男', hireDate:'2021-12-01', roles:['普通用户'], status:'启用', phone:'', remark:'' },
  { id:33, userNo:'U20230033', name:'任盐建', login:'renyj', org:'盐田港建设指挥部办公室', orgId:'d16', oaOrg:'集团盐田港建设指挥部办公室', gender:'男', hireDate:'2018-10-15', roles:['安全主管'], status:'启用', phone:'', remark:'' },
  { id:34, userNo:'U20230034', name:'范安环', login:'fanah', org:'安全管理与环保部', orgId:'u01-d01', oaOrg:'盐田港股份安环部', gender:'男', hireDate:'2020-05-12', roles:['安全主管'], status:'启用', phone:'', remark:'盐田港股份安环部' },
  { id:35, userNo:'U20230035', name:'苏运营', login:'suyy', org:'运营管理部', orgId:'u01-d02', oaOrg:'盐田港股份运营管理部', gender:'女', hireDate:'2019-11-20', roles:['普通用户'], status:'启用', phone:'', remark:'盐田港股份运营部' },
  { id:36, userNo:'U20230036', name:'鲁安环', login:'luah', org:'安全管理与环保部', orgId:'u02-d01', oaOrg:'海洋发展安环部', gender:'男', hireDate:'2021-07-05', roles:['安全主管'], status:'启用', phone:'', remark:'海洋发展安环部' },
  { id:37, userNo:'U20230037', name:'汪安环', login:'wangah', org:'安全管理与环保部', orgId:'u03-d01', oaOrg:'物流集团安环部', gender:'男', hireDate:'2020-01-15', roles:['安全管理员'], status:'启用', phone:'', remark:'物流集团安环部' },
  { id:38, userNo:'U20230038', name:'贺安环', login:'heah', org:'安全管理与环保部', orgId:'u04-d01', oaOrg:'华舟海洋安环部', gender:'男', hireDate:'2022-03-18', roles:['安全管理员'], status:'启用', phone:'', remark:'华舟海洋安环部' },
  { id:39, userNo:'U20230039', name:'尹安环', login:'yinah', org:'安全管理与环保部', orgId:'u05-d01', oaOrg:'能源发展安环部', gender:'女', hireDate:'2021-09-22', roles:['安全管理员'], status:'启用', phone:'', remark:'能源发展安环部' },
  { id:40, userNo:'U20230040', name:'卢安环', login:'luah2', org:'安全管理与环保部', orgId:'u06-d01', oaOrg:'资本公司安环部', gender:'男', hireDate:'2020-06-30', roles:['安全管理员'], status:'启用', phone:'', remark:'资本公司安环部' },
  { id:41, userNo:'U20230041', name:'姚安环', login:'yaoah', org:'安全管理与环保部', orgId:'u07-d01', oaOrg:'港口服务安环部', gender:'男', hireDate:'2019-04-10', roles:['安全管理员'], status:'启用', phone:'', remark:'港口服务安环部' },
  { id:42, userNo:'U20230042', name:'崔安环', login:'cuiah', org:'安全管理与环保部', orgId:'u08-d01', oaOrg:'国际资讯安环部', gender:'男', hireDate:'2022-08-15', roles:['安全管理员'], status:'启用', phone:'', remark:'国际资讯安环部' },
  { id:43, userNo:'U20230043', name:'廖安环', login:'liaoah', org:'安全管理与环保部', orgId:'u09-d01', oaOrg:'港口联运安环部', gender:'男', hireDate:'2021-02-28', roles:['安全管理员'], status:'启用', phone:'', remark:'港口联运安环部' },
  { id:44, userNo:'U20230044', name:'田安环', login:'tianah', org:'安全管理与环保部', orgId:'u10-d01', oaOrg:'疏港铁路安环部', gender:'男', hireDate:'2020-10-12', roles:['安全主管'], status:'启用', phone:'', remark:'疏港铁路安环部' },
  { id:45, userNo:'U20230045', name:'石安环', login:'shiah', org:'安全管理与环保部', orgId:'u11-d01', oaOrg:'深汕海洋安环部', gender:'男', hireDate:'2022-05-20', roles:['安全管理员'], status:'启用', phone:'', remark:'深汕海洋安环部' },
  { id:46, userNo:'U20230046', name:'龚安环', login:'gongah', org:'安全管理与环保部', orgId:'u12-d01', oaOrg:'保税产业安环部', gender:'女', hireDate:'2021-11-08', roles:['安全管理员'], status:'启用', phone:'', remark:'保税产业安环部' },
  { id:47, userNo:'U20230047', name:'罗安环', login:'luoah', org:'安全管理与环保部', orgId:'u13-d01', oaOrg:'东港区码头安环部', gender:'男', hireDate:'2019-08-25', roles:['安全管理员'], status:'启用', phone:'', remark:'东港区码头安环部' },
  { id:48, userNo:'U20230048', name:'覃安环', login:'qinah', org:'安全管理与环保部', orgId:'u14-d01', oaOrg:'深赣港产城安环部', gender:'男', hireDate:'2023-01-10', roles:['安全管理员'], status:'待激活', phone:'', remark:'深赣港产城安环部-待激活' }
];
