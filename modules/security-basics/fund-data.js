// fund-data.js — 资金保障数据
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

  var FundData = {

    CATEGORIES: [
      { key: 'facility', name: '安全设施', cls: 'cat-facility', tagCls: 'tag-facility', color: 'var(--primary)' },
      { key: 'training', name: '安全培训', cls: 'cat-training', tagCls: 'tag-training', color: 'var(--success)' },
      { key: 'protect',  name: '劳动防护', cls: 'cat-protect',  tagCls: 'tag-protect',  color: 'var(--warning)' },
      { key: 'rectify',  name: '隐患整改', cls: 'cat-rectify',  tagCls: 'tag-rectify',  color: 'var(--error)' },
      { key: 'rescue',   name: '应急救援', cls: 'cat-rescue',   tagCls: 'tag-rescue',   color: 'var(--tag-purple-color)' },
      { key: 'other',    name: '其他',     cls: '',              tagCls: 'tag-other',    color: 'var(--text-description)' }
    ],

    orgTree: _filterUnits(_orgSource),

    fundByUnit: {
      'group': [
        { id: 'secu2-1', name: '集团消防设施升级改造', category: 'facility', amount: 580, date: '2026-03-15', handler: '赵部长', desc: '集团消防设施升级改造，包括消防水管路更新、消防泵房设备更换、消防报警系统升级等。', files: [{ name: '消防设施升级改造方案.pdf', size: '2.3MB' }, { name: '预算明细表.xlsx', size: '156KB' }] },
        { id: 'secu2-2', name: '2026年度安全培训专项经费', category: 'training', amount: 120, date: '2026-01-10', handler: '钱副主任', desc: '年度安全培训专项经费，覆盖全员安全培训、特种作业人员培训、新员工三级安全教育等。', files: [{ name: '2026年度培训计划.pdf', size: '1.1MB' }] }
      ],
      'u01': [
        { id: 'secu2-3', name: '盐田港区消防泵站改造', category: 'facility', amount: 350, date: '2026-02-20', handler: '孙主管', desc: '盐田港区消防泵站设备更新及管路改造工程。', files: [{ name: '消防泵站改造方案.pdf', size: '4.7MB' }, { name: '设备清单.xlsx', size: '89KB' }] },
        { id: 'secu2-4', name: '一线员工劳动防护用品采购', category: 'protect', amount: 85, date: '2026-04-01', handler: '周安全员', desc: '采购安全帽、防护服、安全鞋、防护手套等劳动防护用品，保障一线作业人员安全。', files: [] }
      ],
      'u03': [
        { id: 'secu2-5', name: '3号泊位隐患整改专项', category: 'rectify', amount: 200, date: '2026-02-20', handler: '吴科长', desc: '3号泊位护岸裂缝隐患整改，包括裂缝灌浆加固、护岸结构补强、监测设备安装等。', files: [{ name: '隐患整改报告.pdf', size: '3.2MB' }] },
        { id: 'secu2-6', name: '物流园区应急物资储备', category: 'rescue', amount: 45, date: '2026-05-08', handler: '郑安全员', desc: '物流园区应急物资储备采购，包括堵漏工具、防毒面具、应急照明等。', files: [] }
      ],
      'u05': [
        { id: 'secu2-7', name: '能源公司安全培训专项', category: 'training', amount: 60, date: '2026-03-10', handler: '王主任', desc: '能源公司危化品从业人员安全培训专项经费。', files: [{ name: '培训实施方案.docx', size: '520KB' }] },
        { id: 'secu2-8', name: '储罐区隐患整改', category: 'rectify', amount: 150, date: '2026-04-15', handler: '李副部长', desc: '储罐区防火堤修复及防渗改造工程。', files: [{ name: '储罐区整改设计图.pdf', size: '5.8MB' }, { name: '工程预算表.xlsx', size: '210KB' }] },
        { id: 'secu2-9', name: '应急物资储备采购', category: 'rescue', amount: 65, date: '2026-05-08', handler: '陈科长', desc: '采购应急物资储备，包括消防器材、堵漏工具、防毒面具、应急照明等。', files: [] }
      ],
      'u02': [
        { id: 'secu2-10', name: '海洋公司安全培训专项', category: 'training', amount: 80, date: '2026-01-20', handler: '何主管', desc: '海洋发展有限公司年度安全培训专项经费。', files: [] }
      ],
      'u07': [
        { id: 'secu2-11', name: '港口服务区消防设施维护', category: 'facility', amount: 95, date: '2026-03-05', handler: '吕科长', desc: '港口服务集团所属区域消防设施年度维护保养。', files: [{ name: '设施维护合同.pdf', size: '1.5MB' }] }
      ],
      'u12': [
        { id: 'secu2-12', name: '保税区劳动防护采购', category: 'protect', amount: 42, date: '2026-04-10', handler: '马主管', desc: '盐田港保税区劳动防护用品年度采购。', files: [] }
      ]
    },

    get fundList() {
      var all = [];
      var self = this;
      Object.keys(this.fundByUnit).forEach(function(unitId) {
        self.fundByUnit[unitId].forEach(function(f) {
          all.push(Object.assign({}, f, { unitId: unitId }));
        });
      });
      return all;
    },

    getUnitFundList: function(unitId) {
      return this.fundByUnit[unitId] || [];
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
      var list = this.fundByUnit[unitId] || [];
      var total = 0;
      list.forEach(function(f) { total += f.amount; });
      return {
        count: list.length,
        total: total,
        monthly: this._calcMonthly(list)
      };
    },

    _calcMonthly: function(list) {
      var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      var data = months.map(function(m) {
        return { month: m, facility: 0, training: 0, protect: 0, rectify: 0, rescue: 0 };
      });
      list.forEach(function(f) {
        var mon = parseInt((f.date || '').split('-')[1], 10);
        if (mon >= 1 && mon <= 12 && data[mon - 1]) {
          data[mon - 1][f.category] = (data[mon - 1][f.category] || 0) + f.amount;
        }
      });
      return data.filter(function(m) {
        return m.facility + m.training + m.protect + m.rectify + m.rescue > 0;
      });
    },

    buildDetailData: function() {
      var detail = {};
      this.fundList.forEach(function(f) {
        var cat = this.CATEGORIES.find(function(c) { return c.key === f.category; }.bind(this));
        detail[f.id] = {
          title: f.name,
          basic: [['所属单位', this.getUnitName(f.unitId)], ['类别', cat ? cat.name : f.category], ['金额', f.amount + '万元'], ['投入日期', f.date], ['经办人', f.handler]],
          desc: f.desc,
          files: f.files || []
        };
      }.bind(this));
      return detail;
    }
  };

  window.FundData = FundData;
})();
