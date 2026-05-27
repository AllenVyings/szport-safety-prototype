// regulation-data.js — 制度保障数据
(function() {
  'use strict';

  var RegulationData = {

    lawList: [
      { id: 'secu1-1', name: '安全生产法', category: '法律', categoryCls: 'tag-info', publisher: '全国人大常委会', effectDate: '2021-09-01', status: '现行有效', statusCls: 'tag-effective', files: [{ name: '安全生产法全文.pdf', size: '1.8 MB' }] },
      { id: 'secu1-2', name: '港口危险货物安全管理规定', category: '部门规章', categoryCls: 'tag-warning', publisher: '交通运输部', effectDate: '2023-03-01', status: '已修订', statusCls: 'tag-revised', files: [{ name: '港口危货管理规定.pdf', size: '2.1 MB' }] },
      { id: 'secu1-3', name: '广东省安全生产条例', category: '地方性法规', categoryCls: 'tag-success', publisher: '广东省人大常委会', effectDate: '2023-10-01', status: '现行有效', statusCls: 'tag-effective', files: [] },
      { id: 'secu1-4', name: '深圳经济特区安全生产监督管理条例', category: '地方性法规', categoryCls: 'tag-success', publisher: '深圳市人大常委会', effectDate: '2023-07-01', status: '现行有效', statusCls: 'tag-effective', files: [] }
    ],

    ruleList: [
      { id: 'secu1-5', name: '安全生产管理办法', type: '管理制度', scope: '全集团', effectDate: '2026-01-01', version: 'V3.0', status: '现行有效', statusCls: 'tag-effective', files: [{ name: '安全生产管理办法V3.0.pdf', size: '2.4 MB' }, { name: '附件-考核评分表.docx', size: '560 KB' }] },
      { id: 'secu1-6', name: '安全检查管理规定', type: '管理规定', scope: '本单位', effectDate: '2026-01-01', version: 'V2.1', status: '现行有效', statusCls: 'tag-effective', files: [{ name: '安全检查管理规定V2.1.pdf', size: '1.2 MB' }] },
      { id: 'secu1-7', name: '隐患排查治理制度', type: '管理制度', scope: '全集团', effectDate: '2025-07-01', version: 'V2.0', status: '待修订', statusCls: 'tag-pending-revise', files: [] }
    ],

    detailData: {
      'secu1-1': { title: '安全生产法', basic: [['法规类别', '法律'], ['发布机关', '全国人大常委会'], ['生效日期', '2021-09-01'], ['状态', '现行有效']], desc: '《中华人民共和国安全生产法》是我国安全生产领域的基础性法律，规定了生产经营单位的安全生产保障、从业人员的权利义务、安全生产监督管理等内容。', timeline: [{ status: 'done', time: '2021-09-01', event: '正式生效' }, { status: 'done', time: '2026-01-15', event: '组织全员学习' }] },
      'secu1-2': { title: '港口危险货物安全管理规定', basic: [['法规类别', '部门规章'], ['发布机关', '交通运输部'], ['生效日期', '2023-03-01'], ['状态', '已修订']], desc: '规定了港口危险货物的储存、装卸、运输等环节的安全管理要求。最新修订版增加了危险货物集装箱作业安全要求。', timeline: [{ status: 'done', time: '2023-03-01', event: '生效实施' }, { status: 'done', time: '2025-06-01', event: '修订版发布' }] },
      'secu1-3': { title: '广东省安全生产条例', basic: [['法规类别', '地方性法规'], ['发布机关', '广东省人大常委会'], ['生效日期', '2023-10-01'], ['状态', '现行有效']], desc: '结合广东省实际情况，对安全生产法进行了细化补充。', timeline: [{ status: 'done', time: '2023-10-01', event: '生效' }] },
      'secu1-4': { title: '深圳经济特区安全生产监督管理条例', basic: [['法规类别', '地方性法规'], ['发布机关', '深圳市人大常委会'], ['生效日期', '2023-07-01'], ['状态', '现行有效']], desc: '深圳经济特区特有的安全生产监督法规，强化了港口危化品监管要求。', timeline: [{ status: 'done', time: '2023-07-01', event: '生效' }] },
      'secu1-5': { title: '安全生产管理办法', basic: [['制度类型', '管理制度'], ['适用范围', '全集团'], ['版本', 'V3.0'], ['状态', '现行有效']], desc: '集团安全生产管理的核心制度，涵盖目标管理、责任分工、检查考核等。', timeline: [{ status: 'done', time: '2026-01-01', event: 'V3.0发布' }] },
      'secu1-6': { title: '安全检查管理规定', basic: [['制度类型', '管理规定'], ['适用范围', '本单位'], ['版本', 'V2.1'], ['状态', '现行有效']], desc: '规定了安全检查的频次、内容、标准及整改跟踪要求。', timeline: [{ status: 'done', time: '2026-01-01', event: 'V2.1发布' }] },
      'secu1-7': { title: '隐患排查治理制度', basic: [['制度类型', '管理制度'], ['适用范围', '全集团'], ['版本', 'V2.0'], ['状态', '待修订']], desc: '制度修订中，需适配最新发布的隐患排查国标要求。', timeline: [{ status: 'done', time: '2025-07-01', event: 'V2.0发布' }, { status: 'active', time: '待修订', event: '适配国标修订' }] }
    }
  };

  window.RegulationData = RegulationData;
})();
