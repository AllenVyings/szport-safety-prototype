var currentSafetyUnitId = '';
var currentSafetyProjectId = '';

var safetyRecordList = [
  { id: 's1', projectId: 'proj-1', type: '隐患', typeClass: 'safety-type-hazard', time: '2026-05-08', desc: '2号泊位临时用电线路老化，存在漏电风险', status: '整改中', statusTag: 'tag-pending', sourceModule: '隐患排查治理', sourceUrl: '#/hazard/rectification' },
  { id: 's2', projectId: 'proj-1', type: '危险作业', typeClass: 'safety-type-work', time: '2026-04-22', desc: '高处作业安全防护网设置不规范', status: '已闭环', statusTag: 'tag-success', sourceModule: '危险作业管理', sourceUrl: '#/on-site/dangerous-work' },
  { id: 's3', projectId: 'proj-1', type: '安全检查', typeClass: 'safety-type-check', time: '2026-05-15', desc: '月度安全检查发现3项一般隐患，已下达整改通知', status: '整改中', statusTag: 'tag-pending', sourceModule: '安全检查', sourceUrl: '#/hazard/inspection' },
  { id: 's4', projectId: 'proj-2', type: '隐患', typeClass: 'safety-type-hazard', time: '2026-04-10', desc: '商业区域消防通道被占用，影响紧急疏散', status: '已闭环', statusTag: 'tag-success', sourceModule: '隐患排查治理', sourceUrl: '#/hazard/rectification' },
  { id: 's5', projectId: 'proj-2', type: '安全检查', typeClass: 'safety-type-check', time: '2026-05-20', desc: '季度安全综合检查，发现消防设施维护记录缺失', status: '整改中', statusTag: 'tag-pending', sourceModule: '安全检查', sourceUrl: '#/hazard/inspection' },
  { id: 's6', projectId: 'proj-4', type: '隐患', typeClass: 'safety-type-hazard', time: '2026-03-15', desc: '旧码头结构加固区域脚手架搭设不规范', status: '已闭环', statusTag: 'tag-success', sourceModule: '隐患排查治理', sourceUrl: '#/hazard/rectification' },
  { id: 's7', projectId: 'proj-4', type: '危险作业', typeClass: 'safety-type-work', time: '2026-02-28', desc: '码头改造区域动火作业审批手续不全', status: '已闭环', statusTag: 'tag-success', sourceModule: '危险作业管理', sourceUrl: '#/on-site/dangerous-work' },
  { id: 's8', projectId: 'proj-5', type: '安全检查', typeClass: 'safety-type-check', time: '2026-05-10', desc: '东港区一期工程月度安全检查', status: '整改中', statusTag: 'tag-pending', sourceModule: '安全检查', sourceUrl: '#/hazard/inspection' }
];
