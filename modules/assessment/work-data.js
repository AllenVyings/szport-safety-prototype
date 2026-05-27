// work-data.js — 工作指标与扣分规则 模拟数据
(function() {
  'use strict';

  window.WorkData = {

    // 扣分规则配置（Tab1）
    rules: [
      { id: 'asses-1', level: '重大', levelTag: 'tag-error', situation: '重大事故隐患', score: '-10分/项', scoreClass: 'u-text-error', condition: '达到法规处罚标准，或严重威胁员工人身安全，或被政府相关部门处罚', method: '外部检查' },
      { id: 'asses-2', level: '重大', levelTag: 'tag-error', situation: '被县级以上政府/应急管理部门/行业主管部门/市国资委通报批评或会议点名批评', score: '-8分/项', scoreClass: 'u-text-error', condition: '被通报批评或点名批评', method: '外部检查' },
      { id: 'asses-3', level: '较大', levelTag: 'tag-warning', situation: '较大事故隐患', score: '-2~5分/项', scoreClass: 'u-text-warning', condition: '未完成集团部署年度安全生产重点工作；类似隐患反复出现或拒不整改', method: '外部检查' },
      { id: 'asses-4', level: '一般', levelTag: 'tag-info', situation: '一般事故隐患', score: '-0.5~2分/项', scoreClass: 'u-text-primary', condition: '检查中发现隐患数量大于季度周报表中自查发现隐患数量', method: '外部检查' },
      { id: 'asses-5', level: '一般', levelTag: 'tag-info', situation: '一般事故隐患（逾期）', score: '-0.5~2分/项', scoreClass: 'u-text-primary', condition: '隐患列入整改计划但未在整改时间内报送整改回复', method: '外部检查' },
      { id: 'asses-6', level: '其他', levelTag: 'tag-warning', situation: '不配合工作', score: '-1分/人次', scoreClass: 'u-text-warning', condition: '不配合安全检查、督办等工作', method: '外部检查' }
    ],

    // 扣分记录（Tab2）
    records: [
      { id: 'asses-7', unit: '集装箱码头公司', item: '重大事故隐患 - 消防通道堵塞', score: -10, scoreClass: 'u-text-error', source: '集团季度检查', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q1' },
      { id: 'asses-8', unit: '散货码头公司', item: '被通报批评 - 被市应急管理局通报', score: -8, scoreClass: 'u-text-error', source: '政府通报', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q1' },
      { id: 'asses-9', unit: '物流运输公司', item: '较大事故隐患 - 类似隐患反复出现', score: -5, scoreClass: 'u-text-warning', source: '集团专项检查', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q2' },
      { id: 'asses-10', unit: '集装箱码头公司', item: '一般事故隐患 - 安全标识缺失', score: -1.5, scoreClass: 'u-text-primary', source: '集团月度检查', method: '外部检查', status: '待确认', statusTag: 'tag-warning', period: '2026年Q2' },
      { id: 'asses-11', unit: '港航建设公司', item: '一般事故隐患（逾期）- 隐患超期未整改', score: -2, scoreClass: 'u-text-primary', source: '集团季度检查', method: '外部检查', status: '待确认', statusTag: 'tag-warning', period: '2026年Q2' },
      { id: 'asses-12', unit: '散货码头公司', item: '安全培训记录缺失', score: -3, scoreClass: '', selfCheck: true, source: '企业自查', method: '企业自查', status: '不扣分', statusTag: '', statusStyle: 'color:var(--tag-success-color);background:var(--tag-success-bg)', period: '2026年Q2' },
      { id: 'asses-13', unit: '仓储服务公司', item: '重大事故隐患 - 危化品存储违规', score: -10, scoreClass: 'u-text-error', source: '集团专项检查', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q1' },
      { id: 'asses-17', unit: '集装箱码头公司', item: '承包商连带 - 外部检查发现承包商消防隐患', score: -5, scoreClass: 'u-text-error', source: '集团季度检查', method: '外部检查', status: '待确认', statusTag: 'tag-warning', period: '2026年Q2', isContractor: true },
      { id: 'asses-18', unit: '散货码头公司', item: '承包商连带 - 承包商高处作业违规', score: -3, scoreClass: 'u-text-warning', source: '集团专项检查', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q1', isContractor: true },
      { id: 'asses-14', unit: '航运服务公司', item: '较大事故隐患 - 安全设施未定期检测', score: -3, scoreClass: 'u-text-warning', source: '集团季度检查', method: '外部检查', status: '已生效', statusTag: 'tag-success', period: '2026年Q2' },
      { id: 'asses-15', unit: '拖轮作业公司', item: '一般事故隐患 - 防护用品佩戴不规范', score: -1, scoreClass: 'u-text-primary', source: '集团月度检查', method: '外部检查', status: '待确认', statusTag: 'tag-warning', period: '2026年Q2' },
      { id: 'asses-16', unit: '物业运营公司', item: '消防器材自查发现过期', score: -2, scoreClass: '', selfCheck: true, source: '企业自查', method: '企业自查', status: '不扣分', statusTag: '', statusStyle: 'color:var(--tag-success-color);background:var(--tag-success-bg)', period: '2026年Q2' },
      { id: 'asses-19', unit: '港航建设公司', item: '一般事故隐患 - 临时用电不规范', score: -1, scoreClass: 'u-text-primary', source: '集团月度检查', method: '外部检查', status: '已排除', statusTag: 'tag-default', period: '2026年Q1', excludedReason: '经核实该隐患为非我司责任范围' }
    ],

    // 诫勉约谈预警
    warnings: [
      { unit: '集装箱码头公司', desc: 'Q1扣分累计 18分', tag: '接近预警线(20分)', tagCls: 'tag-warning' },
      { unit: '物流运输公司', desc: 'Q1扣分累计 25分', tag: '已触发诫勉约谈(>20分)', tagCls: 'tag-error' },
      { unit: '仓储服务公司', desc: '年度累计扣分导致总分 76分', tag: '已触发诫勉约谈(年度<80分)', tagCls: 'tag-error' }
    ],

    // 详情数据
    details: {
      'asses-1': { title: '扣分规则 — 重大事故隐患', basic: [['扣分等级', '重大'], ['扣分值', '-10分/项'], ['发现方式', '外部检查'], ['触发条件', '达到法规处罚标准，或严重威胁员工人身安全，或被政府相关部门处罚']], desc: '重大事故隐患一经发现即按-10分/项扣分，适用于所有考核对象。扣分由外部检查触发，企业自查发现的不扣分。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-2': { title: '扣分规则 — 被通报批评', basic: [['扣分等级', '重大'], ['扣分值', '-8分/项'], ['触发条件', '被县级以上政府/应急管理部门/行业主管部门/市国资委通报批评或会议点名批评']], desc: '被政府或上级主管部门通报批评即触发扣分。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-3': { title: '扣分规则 — 较大事故隐患', basic: [['扣分等级', '较大'], ['扣分值', '-2~5分/项'], ['触发条件', '未完成集团部署年度安全生产重点工作；类似隐患反复出现或拒不整改']], desc: '较大事故隐患根据严重程度扣2-5分/项。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-4': { title: '扣分规则 — 一般事故隐患', basic: [['扣分等级', '一般'], ['扣分值', '-0.5~2分/项'], ['触发条件', '检查中发现隐患数量大于季度周报表中自查发现隐患数量']], desc: '一般事故隐患根据严重程度扣0.5-2分/项。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-5': { title: '扣分规则 — 一般事故隐患（逾期）', basic: [['扣分等级', '一般'], ['扣分值', '-0.5~2分/项'], ['触发条件', '隐患列入整改计划但未在整改时间内报送整改回复']], desc: '逾期未整改的一般隐患额外扣分。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-6': { title: '扣分规则 — 不配合工作', basic: [['扣分等级', '其他'], ['扣分值', '-1分/人次'], ['触发条件', '不配合安全检查、督办等工作']], desc: '不配合安全检查等工作按人次扣分。', timeline: [{ status: 'active', time: '当前', event: '规则生效中' }] },
      'asses-7': { title: '集装箱码头公司 — 重大事故隐患扣分', basic: [['考核单位', '集装箱码头公司'], ['扣分项', '重大事故隐患 - 消防通道堵塞'], ['扣分值', '-10分'], ['来源', '集团季度检查'], ['发现方式', '外部检查'], ['确认状态', '已生效'], ['归属季度', '2026年Q1']], desc: '集团季度检查发现消防通道堵塞，属于重大事故隐患，按规则扣10分。', timeline: [{ status: 'done', time: '2026-03-15', event: '集团季度检查发现隐患' }, { status: 'done', time: '2026-03-16', event: '系统自动生成扣分记录' }, { status: 'done', time: '2026-03-20', event: '扣分确认' }, { status: 'active', time: '已生效', event: '计入Q1考核' }] },
      'asses-8': { title: '散货码头公司 — 被通报批评扣分', basic: [['考核单位', '散货码头公司'], ['扣分项', '被市应急管理局通报批评'], ['扣分值', '-8分'], ['来源', '政府通报'], ['确认状态', '已生效']], desc: '被市应急管理局通报批评，按规则扣8分。', timeline: [{ status: 'done', time: '2026-02-10', event: '收到政府通报' }, { status: 'done', time: '2026-02-11', event: '系统自动扣分' }, { status: 'active', time: '已生效', event: '计入Q1考核' }] },
      'asses-9': { title: '物流运输公司 — 较大事故隐患扣分', basic: [['考核单位', '物流运输公司'], ['扣分项', '较大事故隐患 - 类似隐患反复出现'], ['扣分值', '-5分'], ['来源', '集团专项检查'], ['确认状态', '已生效']], desc: '集团专项检查发现类似隐患反复出现，属于较大事故隐患，扣5分。', timeline: [{ status: 'done', time: '2026-04-20', event: '集团专项检查发现' }, { status: 'done', time: '2026-04-21', event: '扣分确认' }, { status: 'active', time: '已生效', event: '计入Q2考核' }] },
      'asses-10': { title: '集装箱码头公司 — 一般事故隐患扣分', basic: [['考核单位', '集装箱码头公司'], ['扣分项', '一般事故隐患 - 安全标识缺失'], ['扣分值', '-1.5分'], ['来源', '集团月度检查'], ['确认状态', '待确认']], desc: '集团月度检查发现安全标识缺失，属于一般事故隐患，扣1.5分，待确认。', timeline: [{ status: 'done', time: '2026-05-10', event: '集团月度检查发现' }, { status: 'active', time: '待确认', event: '等待扣分确认' }] },
      'asses-11': { title: '港航建设公司 — 一般事故隐患逾期扣分', basic: [['考核单位', '港航建设公司'], ['扣分项', '一般事故隐患（逾期）- 隐患超期未整改'], ['扣分值', '-2分'], ['来源', '集团季度检查'], ['确认状态', '待确认']], desc: '隐患列入整改计划但超期未报送整改回复，按逾期扣2分，待确认。', timeline: [{ status: 'done', time: '2026-04-01', event: '隐患整改到期' }, { status: 'done', time: '2026-04-15', event: '系统标记逾期' }, { status: 'active', time: '待确认', event: '等待扣分确认' }] },
      'asses-12': { title: '散货码头公司 — 企业自查（不扣分）', basic: [['考核单位', '散货码头公司'], ['扣分项', '安全培训记录缺失'], ['发现方式', '企业自查'], ['扣分结果', '不扣分']], desc: '企业自查发现的隐患不触发绩效考核扣分。仅外部检查发现的隐患才触发扣分。', timeline: [{ status: 'done', time: '2026-05-05', event: '企业自查发现' }, { status: 'active', time: '—', event: '不触发扣分' }] },
      'asses-17': { title: '集装箱码头公司 — 承包商连带扣分', basic: [['考核单位', '集装箱码头公司'], ['扣分项', '承包商连带 - 外部检查发现承包商消防隐患'], ['扣分值', '-5分'], ['来源', '集团季度检查'], ['发现方式', '外部检查'], ['确认状态', '待确认'], ['是否连带', '是（待确认连带）']], desc: '集团季度检查发现承包商在集装箱码头公司作业区域存在消防隐患，系统自动生成连带扣分待确认记录。需由考核管理员确认是否追究被考核单位连带责任：确认连带的，否决指标状态自动同步为"已触发/连带否决"；排除连带的，否决指标恢复为正常监测，扣分记录标记为已排除。', timeline: [{ status: 'done', time: '2026-04-12', event: '集团季度检查发现承包商消防隐患' }, { status: 'done', time: '2026-04-13', event: '系统生成连带待确认记录' }, { status: 'active', time: '待确认', event: '等待确认连带或排除连带' }] }
    }
  };
})();
