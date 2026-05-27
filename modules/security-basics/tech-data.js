// tech-data.js — 科技保障数据
(function() {
  'use strict';

  function _filterUnits(nodes) {
    var result = [];
    (nodes || []).forEach(function(n) {
      if (n.type === '单位') {
        var u = { id: n.id, name: n.name, type: '单位' };
        var kids = _filterUnits(n.children);
        if (kids.length) u.children = kids;
        result.push(u);
      } else if (n.children && n.children.length) {
        result = result.concat(_filterUnits(n.children));
      }
    });
    return result;
  }

  function _pickFields(nodes) {
    return (nodes || []).map(function(n) {
      var o = { id: n.id, name: n.name, type: n.type || '单位' };
      if (n.children && n.children.length) o.children = _pickFields(n.children);
      return o;
    });
  }

  var _orgSource = typeof orgList !== 'undefined'
    ? _pickFields(orgList)
    : _pickFields([
        { id: 'group', name: '深圳港集团', type: '单位', children: [
          { id: 'u01', name: '深圳市盐田港股份有限公司', type: '单位' },
          { id: 'u02', name: '深圳市深圳港海洋发展有限公司', type: '单位' },
          { id: 'u03', name: '深圳市深圳港物流集团有限公司', type: '单位' },
          { id: 'u04', name: '深圳市华舟海洋发展股份有限公司', type: '单位' },
          { id: 'u05', name: '深圳市深圳港能源发展有限公司', type: '单位' },
          { id: 'u06', name: '深圳市深圳港资本有限公司', type: '单位' },
          { id: 'u07', name: '深圳市深圳港港口服务集团有限公司', type: '单位' },
          { id: 'u08', name: '盐田港国际资讯有限公司', type: '单位' },
          { id: 'u09', name: '深圳市深圳港港口联运有限公司', type: '单位' },
          { id: 'u10', name: '深圳市平盐疏港铁路有限公司', type: '单位' },
          { id: 'u11', name: '深圳市深汕海洋发展有限公司', type: '单位' },
          { id: 'u12', name: '深圳市盐田港保税产业发展有限公司', type: '单位' },
          { id: 'u13', name: '深圳市盐田东港区码头有限公司', type: '单位' },
          { id: 'u14', name: '江西省深赣港产城发展有限公司', type: '单位' }
        ]}
      ]);

  var TechData = {

    CATEGORIES: [
      { key: 'equipment', name: '先进技术装备与无人值守', cls: 'cat-equipment', tagCls: 'tag-equipment', color: 'var(--primary)' },
      { key: 'digital', name: '数字化信息化智能化', cls: 'cat-digital', tagCls: 'tag-digital', color: 'var(--success)' },
      { key: 'monitor', name: '监测预警系统', cls: 'cat-monitor', tagCls: 'tag-monitor', color: 'var(--warning)' }
    ],

    TYPES: [
      { key: 'device', name: '设备类', tagCls: 'tag-blue' },
      { key: 'system', name: '系统类', tagCls: 'tag-green' },
      { key: 'other', name: '其他类', tagCls: 'tag-default' }
    ],

    STATUSES: [
      { key: 'planned', name: '规划中', tagCls: 'tag-info' },
      { key: 'ongoing', name: '实施中', tagCls: 'tag-warning' },
      { key: 'accepted', name: '已验收', tagCls: 'tag-success' }
    ],

    orgTree: _filterUnits(_orgSource),

    techByUnit: {
      'group': [
        { id: 'secu5-1', name: '集团安全监管数字平台建设', category: 'digital', type: 'system', amount: 860, date: '2026-01-15', status: 'ongoing', handler: '赵部长', desc: '建设集团级安全监管数字平台，集成风险管控、隐患排查、应急管理、安全培训等模块，实现安全管理数据互联互通。', files: [{ name: '数字平台建设方案.pdf', size: '5.2MB' }, { name: '系统架构设计图.pdf', size: '3.1MB' }] },
        { id: 'secu5-2', name: '港口危险品监测预警系统', category: 'monitor', type: 'system', amount: 420, date: '2026-03-01', status: 'ongoing', handler: '钱副主任', desc: '建设港口危险品存储区域监测预警系统，包括气体泄漏检测、温度压力实时监测、超标自动报警等功能。', files: [{ name: '监测预警系统需求规格说明书.pdf', size: '2.8MB' }] }
      ],
      'u01': [
        { id: 'secu5-3', name: '盐田港区无人值守巡检系统', category: 'equipment', type: 'device', amount: 350, date: '2026-02-20', status: 'planned', handler: '孙主管', desc: '在盐田港区部署无人巡检机器人，实现码头区域24小时自动巡检，替代人工夜间巡查。', files: [{ name: '无人巡检机器人技术方案.pdf', size: '4.5MB' }] },
        { id: 'secu5-4', name: '盐田港区智能视频监控系统', category: 'monitor', type: 'system', amount: 280, date: '2026-04-10', status: 'planned', handler: '周安全员', desc: '部署AI智能视频监控系统，实现人员入侵检测、安全帽佩戴识别、违规行为自动抓拍预警等功能。', files: [] }
      ],
      'u03': [
        { id: 'secu5-5', name: '物流园区安全风险监测平台', category: 'monitor', type: 'system', amount: 180, date: '2026-03-15', status: 'ongoing', handler: '吴科长', desc: '建设物流园区安全风险监测平台，实现仓储区域温湿度监测、消防设施状态监测、车辆进出管控等功能。', files: [{ name: '监测平台实施方案.docx', size: '1.6MB' }] }
      ],
      'u05': [
        { id: 'secu5-6', name: '储罐区智能监测预警系统', category: 'monitor', type: 'system', amount: 520, date: '2025-11-01', status: 'accepted', handler: '李副部长', desc: '储罐区液位、温度、压力智能监测预警系统，已通过验收并投入使用。', files: [{ name: '验收报告.pdf', size: '3.4MB' }, { name: '系统操作手册.docx', size: '890KB' }] },
        { id: 'secu5-7', name: '危化品仓储智能管控系统', category: 'digital', type: 'system', amount: 340, date: '2026-05-01', status: 'ongoing', handler: '王主任', desc: '建设危化品仓储智能管控系统，实现入库出库自动登记、库存动态管理、超期预警等功能。', files: [] },
        { id: 'secu5-8', name: '防爆巡检机器人', category: 'equipment', type: 'device', amount: 260, date: '2026-06-15', status: 'planned', handler: '陈科长', desc: '采购防爆巡检机器人用于危化品区域日常巡检，实现危险岗位无人值守。', files: [{ name: '防爆机器人选型报告.pdf', size: '2.1MB' }] }
      ],
      'u02': [
        { id: 'secu5-9', name: '海洋作业智能穿戴设备', category: 'equipment', type: 'device', amount: 95, date: '2026-04-20', status: 'ongoing', handler: '何主管', desc: '为海洋作业人员配备智能安全帽和定位手环，实现人员定位、生命体征监测、落水报警等功能。', files: [] }
      ],
      'u07': [
        { id: 'secu5-10', name: '港口服务区AI行为识别系统', category: 'digital', type: 'system', amount: 150, date: '2025-12-01', status: 'accepted', handler: '吕科长', desc: '利用AI视觉识别技术，对港口服务区域人员进行行为分析，自动识别不安全行为并预警。', files: [{ name: '项目验收报告.pdf', size: '1.8MB' }] }
      ],
      'u12': [
        { id: 'secu5-11', name: '保税区智能门禁与周界防范', category: 'equipment', type: 'device', amount: 120, date: '2026-05-10', status: 'planned', handler: '马主管', desc: '建设保税区智能门禁系统和周界防范系统，实现人员车辆智能识别、非法入侵自动报警。', files: [] }
      ]
    },

    get techList() {
      var all = [];
      var self = this;
      Object.keys(this.techByUnit).forEach(function(unitId) {
        self.techByUnit[unitId].forEach(function(t) {
          all.push(Object.assign({}, t, { unitId: unitId }));
        });
      });
      return all;
    },

    getUnitTechList: function(unitId) {
      return this.techByUnit[unitId] || [];
    },

    getUnitName: function(unitId) {
      var found = null;
      function walk(nodes) {
        (nodes || []).forEach(function(n) {
          if (n.id === unitId) found = n.name;
          if (n.children) walk(n.children);
        });
      }
      walk(this.orgTree);
      return found || unitId;
    },

    getUnitStats: function(unitId) {
      var list = this.techByUnit[unitId] || [];
      var total = 0;
      var planned = 0, ongoing = 0, accepted = 0;
      list.forEach(function(t) {
        total += t.amount;
        if (t.status === 'planned') planned++;
        else if (t.status === 'ongoing') ongoing++;
        else if (t.status === 'accepted') accepted++;
      });
      return {
        count: list.length,
        total: total,
        planned: planned,
        ongoing: ongoing,
        accepted: accepted
      };
    },

    getCategoryName: function(key) {
      var c = this.CATEGORIES.find(function(c) { return c.key === key; });
      return c ? c.name : key;
    },

    getCategoryObj: function(key) {
      return this.CATEGORIES.find(function(c) { return c.key === key; }) || null;
    },

    getTypeObj: function(key) {
      return this.TYPES.find(function(t) { return t.key === key; }) || null;
    },

    getStatusObj: function(key) {
      return this.STATUSES.find(function(s) { return s.key === key; }) || null;
    },

    buildDetailData: function() {
      var detail = {};
      var self = this;
      this.techList.forEach(function(t) {
        var cat = self.getCategoryObj(t.category);
        var type = self.getTypeObj(t.type);
        var status = self.getStatusObj(t.status);
        detail[t.id] = {
          title: t.name,
          basic: [
            ['所属单位', self.getUnitName(t.unitId)],
            ['保障类别', cat ? cat.name : t.category],
            ['项目类型', type ? type.name : t.type],
            ['投入金额', t.amount + '万元'],
            ['实施日期', t.date],
            ['实施状态', status ? status.name : t.status],
            ['责任人', t.handler]
          ],
          desc: t.desc,
          files: t.files || []
        };
      });
      return detail;
    }
  };

  window.TechData = TechData;
})();
