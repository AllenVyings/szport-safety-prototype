    var orgList = [
      { id:'group', name:'深圳港集团', code:'ORG', type:'单位', parent:'—（根节点）', level:'A级管控', levelClass:'tag tag-error', sort:0, sync:'正常', syncClass:'tag-success', mapping:['深圳港集团'], region:'广东省 / 深圳市 / 南山区', addr:'深圳市南山区妈湾港大道1号', dirty:{name:false,level:false,sort:false,region:false,addr:false}, children:[
        { id:'d01', name:'安全管理与环保部', code:'ORG-D01', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理与环保部（一类考核部室）'], dirty:{name:false} },
        { id:'d02', name:'办公室', code:'ORG-D02', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:2, sync:'正常', syncClass:'tag-success', mapping:['办公室'], dirty:{} },
        { id:'d03', name:'党群工作部', code:'ORG-D03', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:3, sync:'正常', syncClass:'tag-success', mapping:['党群工作部（企业文化部）'], dirty:{name:true} },
        { id:'d04', name:'纪检监察室', code:'ORG-D04', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:4, sync:'正常', syncClass:'tag-success', mapping:['纪检监察室'], dirty:{} },
        { id:'d05', name:'人力资源部', code:'ORG-D05', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:5, sync:'正常', syncClass:'tag-success', mapping:['人力资源部'], dirty:{} },
        { id:'d06', name:'财务管理部', code:'ORG-D06', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:6, sync:'正常', syncClass:'tag-success', mapping:['财务管理部'], dirty:{} },
        { id:'d07', name:'审计部', code:'ORG-D07', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:7, sync:'正常', syncClass:'tag-success', mapping:['审计部'], dirty:{} },
        { id:'d08', name:'战略发展部', code:'ORG-D08', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:8, sync:'正常', syncClass:'tag-success', mapping:['战略发展部'], dirty:{} },
        { id:'d09', name:'投资与资本运营部', code:'ORG-D09', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:9, sync:'正常', syncClass:'tag-success', mapping:['投资与资本运营部'], dirty:{} },
        { id:'d10', name:'企业管理部', code:'ORG-D10', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:10, sync:'正常', syncClass:'tag-success', mapping:['企业管理部'], dirty:{} },
        { id:'d11', name:'合规部', code:'ORG-D11', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:11, sync:'正常', syncClass:'tag-success', mapping:['合规部（董事会秘书处）'], dirty:{} },
        { id:'d12', name:'建设管理部', code:'ORG-D12', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:12, sync:'正常', syncClass:'tag-success', mapping:['建设管理部'], dirty:{} },
        { id:'d13', name:'数字化创新中心', code:'ORG-D13', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:13, sync:'正常', syncClass:'tag-success', mapping:['数字化创新中心'], dirty:{} },
        { id:'d14', name:'港航事业部', code:'ORG-D14', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:14, sync:'正常', syncClass:'tag-success', mapping:['港航事业部'], dirty:{} },
        { id:'d15', name:'海洋产业事业部', code:'ORG-D15', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:15, sync:'正常', syncClass:'tag-success', mapping:['海洋产业事业部'], dirty:{} },
        { id:'d16', name:'盐田港建设指挥部办公室', code:'ORG-D16', type:'部门', parent:'深圳港集团', level:'—', levelClass:'', sort:16, sync:'正常', syncClass:'tag-success', mapping:['盐田港建设指挥部办公室'], dirty:{} },
        { id:'u01', name:'深圳市盐田港股份有限公司', code:'ORG-U01', type:'单位', parent:'深圳港集团', level:'A级管控', levelClass:'tag tag-error', sort:1, sync:'正常', syncClass:'tag-success', mapping:['深圳市盐田港股份有限公司'], region:'广东省 / 深圳市 / 盐田区', addr:'深圳市盐田区深盐路', dirty:{region:true}, children:[
          { id:'u01-d01', name:'安全管理与环保部', code:'ORG-U01-D01', type:'部门', parent:'深圳市盐田港股份有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部','运营管理部'], dirty:{} }
        ]},
        { id:'u02', name:'深圳市深圳港海洋发展有限公司', code:'ORG-U02', type:'单位', parent:'深圳港集团', level:'A级管控', levelClass:'tag tag-error', sort:2, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港海洋发展有限公司'], region:'广东省 / 深圳市 / 宝安区', addr:'深圳市宝安区大铲湾蓝色未来科技园', dirty:{}, children:[
          { id:'u02-d01', name:'安全管理与环保部', code:'ORG-U02-D01', type:'部门', parent:'深圳市深圳港海洋发展有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u03', name:'深圳市深圳港物流集团有限公司', code:'ORG-U03', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:3, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港物流集团有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u03-d01', name:'安全管理与环保部', code:'ORG-U03-D01', type:'部门', parent:'深圳市深圳港物流集团有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u04', name:'深圳市华舟海洋发展股份有限公司', code:'ORG-U04', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:4, sync:'正常', syncClass:'tag-success', mapping:['深圳市华舟海洋发展股份有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u04-d01', name:'安全管理与环保部', code:'ORG-U04-D01', type:'部门', parent:'深圳市华舟海洋发展股份有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u05', name:'深圳市深圳港能源发展有限公司', code:'ORG-U05', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:5, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港能源发展有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u05-d01', name:'安全管理与环保部', code:'ORG-U05-D01', type:'部门', parent:'深圳市深圳港能源发展有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u06', name:'深圳市深圳港资本有限公司', code:'ORG-U06', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:6, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港资本有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u06-d01', name:'安全管理与环保部', code:'ORG-U06-D01', type:'部门', parent:'深圳市深圳港资本有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u07', name:'深圳市深圳港港口服务集团有限公司', code:'ORG-U07', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:7, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港港口服务集团有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u07-d01', name:'安全管理与环保部', code:'ORG-U07-D01', type:'部门', parent:'深圳市深圳港港口服务集团有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u08', name:'盐田港国际资讯有限公司', code:'ORG-U08', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:8, sync:'正常', syncClass:'tag-success', mapping:['盐田港国际资讯有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u08-d01', name:'安全管理与环保部', code:'ORG-U08-D01', type:'部门', parent:'盐田港国际资讯有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u09', name:'深圳市深圳港港口联运有限公司', code:'ORG-U09', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:9, sync:'正常', syncClass:'tag-success', mapping:['深圳市深圳港港口联运有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u09-d01', name:'安全管理与环保部', code:'ORG-U09-D01', type:'部门', parent:'深圳市深圳港港口联运有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u10', name:'深圳市平盐疏港铁路有限公司', code:'ORG-U10', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:10, sync:'正常', syncClass:'tag-success', mapping:['深圳市平盐疏港铁路有限公司'], region:'广东省 / 深圳市', dirty:{}, children:[
          { id:'u10-d01', name:'安全管理与环保部', code:'ORG-U10-D01', type:'部门', parent:'深圳市平盐疏港铁路有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u11', name:'深圳市深汕海洋发展有限公司', code:'ORG-U11', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:11, sync:'正常', syncClass:'tag-success', mapping:['深圳市深汕海洋发展有限公司'], region:'广东省 / 汕尾市 / 深汕特别合作区', dirty:{}, children:[
          { id:'u11-d01', name:'安全管理与环保部', code:'ORG-U11-D01', type:'部门', parent:'深圳市深汕海洋发展有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u12', name:'深圳市盐田港保税产业发展有限公司', code:'ORG-U12', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:12, sync:'正常', syncClass:'tag-success', mapping:['深圳市盐田港保税产业发展有限公司'], region:'广东省 / 深圳市 / 盐田区', addr:'深圳市盐田港保税区', dirty:{}, children:[
          { id:'u12-d01', name:'安全管理与环保部', code:'ORG-U12-D01', type:'部门', parent:'深圳市盐田港保税产业发展有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u13', name:'深圳市盐田东港区码头有限公司', code:'ORG-U13', type:'单位', parent:'深圳港集团', level:'B级管控', levelClass:'tag tag-warning', sort:13, sync:'异常', syncClass:'tag-error', mapping:['深圳市盐田东港区码头有限公司'], dirty:{}, children:[
          { id:'u13-d01', name:'安全管理与环保部', code:'ORG-U13-D01', type:'部门', parent:'深圳市盐田东港区码头有限公司', level:'—', levelClass:'', sort:1, sync:'异常', syncClass:'tag-error', mapping:['安全管理部'], dirty:{} }
        ]},
        { id:'u14', name:'江西省深赣港产城发展有限公司', code:'ORG-U14', type:'单位', parent:'深圳港集团', level:'C级管控', levelClass:'tag tag-info', sort:14, sync:'正常', syncClass:'tag-success', mapping:['江西省深赣港产城发展有限公司'], region:'江西省 / 赣州市', dirty:{}, children:[
          { id:'u14-d01', name:'安全管理与环保部', code:'ORG-U14-D01', type:'部门', parent:'江西省深赣港产城发展有限公司', level:'—', levelClass:'', sort:1, sync:'正常', syncClass:'tag-success', mapping:['安全管理部'], dirty:{} }
        ]}
      ]}
    ];

    var srcOrgData = [
      { id:'src-group', name:'深圳港集团', type:'单位', children:[
        { id:'src-d01', name:'安全管理与环保部', type:'部门' },
        { id:'src-d02', name:'办公室', type:'部门' },
        { id:'src-d03', name:'党群工作部', type:'部门' },
        { id:'src-d04', name:'纪检监察室', type:'部门' },
        { id:'src-d05', name:'人力资源部', type:'部门' },
        { id:'src-d06', name:'财务管理部', type:'部门' },
        { id:'src-d07', name:'审计部', type:'部门' },
        { id:'src-d08', name:'战略发展部', type:'部门' },
        { id:'src-d09', name:'投资与资本运营部', type:'部门' },
        { id:'src-d10', name:'企业管理部', type:'部门' },
        { id:'src-d11', name:'合规部', type:'部门' },
        { id:'src-d12', name:'建设管理部', type:'部门' },
        { id:'src-d13', name:'数字化创新中心', type:'部门' },
        { id:'src-d14', name:'港航事业部', type:'部门' },
        { id:'src-d15', name:'海洋产业事业部', type:'部门' },
        { id:'src-d16', name:'盐田港建设指挥部办公室', type:'部门' },
        { id:'src-d17', name:'法律事务部', type:'部门', unmapped:true },
        { id:'src-u01', name:'深圳市盐田港股份有限公司', type:'单位', children:[
          { id:'src-u01-d01', name:'安全管理部', type:'部门' },
          { id:'src-u01-d02', name:'运营管理部', type:'部门' },
          { id:'src-u01-d03', name:'行政综合部', type:'部门', unmapped:true }
        ]},
        { id:'src-u02', name:'深圳市深圳港海洋发展有限公司', type:'单位', children:[{id:'src-u02-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u03', name:'深圳市深圳港物流集团有限公司', type:'单位', children:[{id:'src-u03-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u04', name:'深圳市华舟海洋发展股份有限公司', type:'单位', children:[{id:'src-u04-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u05', name:'深圳市深圳港能源发展有限公司', type:'单位', children:[{id:'src-u05-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u06', name:'深圳市深圳港资本有限公司', type:'单位', children:[{id:'src-u06-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u07', name:'深圳市深圳港港口服务集团有限公司', type:'单位', children:[{id:'src-u07-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u08', name:'盐田港国际资讯有限公司', type:'单位', children:[{id:'src-u08-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u09', name:'深圳市深圳港港口联运有限公司', type:'单位', children:[{id:'src-u09-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u10', name:'深圳市平盐疏港铁路有限公司', type:'单位', children:[{id:'src-u10-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u11', name:'深圳市深汕海洋发展有限公司', type:'单位', children:[{id:'src-u11-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u12', name:'深圳市盐田港保税产业发展有限公司', type:'单位', children:[{id:'src-u12-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u13', name:'深圳市盐田东港区码头有限公司', type:'单位', children:[{id:'src-u13-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u14', name:'江西省深赣港产城发展有限公司', type:'单位', children:[{id:'src-u14-d01',name:'安全管理部',type:'部门'}] },
        { id:'src-u15', name:'物业管理公司', type:'单位', unmapped:true, children:[{id:'src-u15-d01',name:'安全管理部',type:'部门',unmapped:true}] }
      ]}
    ];

    // ===== 渲染组织列表 =====
    var expandedSet = new Set(['group']);

    // #10 fix: 全局筛选状态
    var filterState = { keyword:'', level:'', type:'', sync:'' };

    // ===== 源组织树展开状态 =====
    var srcExpanded = new Set(['src-group']);

    // ===== 地图地址数据 =====
    var mapAddrData = [
      { name:'妈湾港大厦', addr:'深圳市南山区妈湾港大道1号妈湾港大厦' },
      { name:'深圳港集团总部', addr:'深圳市南山区妈湾港大道1号深圳港集团总部大楼' },
      { name:'蛇口码头', addr:'深圳市南山区蛇口港湾大道蛇口码头' },
      { name:'赤湾港务', addr:'深圳市南山区赤湾二路赤湾港务大厦' },
      { name:'盐田国际集装箱码头', addr:'深圳市盐田区盐田港国际集装箱码头' },
      { name:'大铲湾码头', addr:'深圳市宝安区大铲湾港区大铲湾码头' },
      { name:'前海湾保税港区', addr:'深圳市南山区前海湾保税港区管理大厦' },
      { name:'深圳港物流中心', addr:'深圳市南山区兴海大道深圳港物流中心' },
      { name:'东角头港务', addr:'深圳市南山区望海路东角头港务大楼' },
      { name:'太子湾邮轮母港', addr:'深圳市南山区太子湾邮轮母港' },
      { name:'南山港务大厦', addr:'深圳市南山区工业八路南山港务大厦' },
      { name:'深圳港油品码头', addr:'深圳市南山区赤湾一路深圳港油品码头' },
    ];
