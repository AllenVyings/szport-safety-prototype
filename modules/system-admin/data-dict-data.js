// data-dict-data.js — 数据字典数据
(function() {
  'use strict';

  var DictData = {

    CATEGORIES: [
      { id: 'risk_level', name: '风险等级', icon: '⚠️', builtin: true },
      { id: 'risk_type', name: '风险类型', icon: '📋', builtin: true },
      { id: 'hazard_type', name: '隐患类型', icon: '🔍', builtin: true },
      { id: 'hazard_level', name: '隐患等级', icon: '🔴', builtin: true },
      { id: 'rectify_status', name: '整改状态', icon: '🔄', builtin: true },
      { id: 'check_type', name: '检查类型', icon: '✅', builtin: true },
      { id: 'dangerous_work', name: '危险作业类型', icon: '🔥', builtin: true },
      { id: 'accident_type', name: '事故类型', icon: '💥', builtin: true },
      { id: 'accident_level', name: '事故等级', icon: '📊', builtin: true },
      { id: 'training_type', name: '培训类型', icon: '📚', builtin: true },
      { id: 'drill_type', name: '演练类型', icon: '🚨', builtin: true },
      { id: 'equipment_status', name: '设备状态', icon: '⚙️', builtin: true },
      { id: 'org_level', name: '组织层级', icon: '🏢', builtin: true },
      { id: 'assess_level', name: '考核等级', icon: '📈', builtin: true },
      { id: 'behavior_type', name: '三违类型', icon: '🚫', builtin: true },
      { id: 'emergency_level', name: '应急响应级别', icon: '🆘', builtin: true },
      { id: 'industry_type', name: '行业类别', icon: '🏭', builtin: false },
      { id: 'custom_tag', name: '自定义标签', icon: '🏷️', builtin: false }
    ],

    DICT_DATA: {
      risk_level: [
        { code: 'major', name: '重大风险', sort: 1, status: 'enabled', remark: 'R值≥320，对应红色' },
        { code: 'significant', name: '较大风险', sort: 2, status: 'enabled', remark: '160≤R<320，对应橙色' },
        { code: 'moderate', name: '一般风险', sort: 3, status: 'enabled', remark: '70≤R<160，对应黄色' },
        { code: 'low', name: '低风险', sort: 4, status: 'enabled', remark: 'R<70，对应蓝色' }
      ],
      risk_type: [
        { code: 'mechanical', name: '机械伤害', sort: 1, status: 'enabled', remark: '' },
        { code: 'electrical', name: '触电', sort: 2, status: 'enabled', remark: '' },
        { code: 'fall', name: '高处坠落', sort: 3, status: 'enabled', remark: '' },
        { code: 'fire', name: '火灾', sort: 4, status: 'enabled', remark: '' },
        { code: 'chemical', name: '中毒窒息', sort: 5, status: 'enabled', remark: '' },
        { code: 'collapse', name: '坍塌', sort: 6, status: 'enabled', remark: '' },
        { code: 'drowning', name: '淹溺', sort: 7, status: 'enabled', remark: '' },
        { code: 'explosion', name: '爆炸', sort: 8, status: 'enabled', remark: '' },
        { code: 'vehicle', name: '车辆伤害', sort: 9, status: 'enabled', remark: '' },
        { code: 'other', name: '其他', sort: 10, status: 'enabled', remark: '' }
      ],
      hazard_type: [
        { code: 'management', name: '管理类', sort: 1, status: 'enabled', remark: '制度、培训、持证等' },
        { code: 'equipment', name: '设备设施类', sort: 2, status: 'enabled', remark: '设备缺陷、安全装置失效' },
        { code: 'environment', name: '环境类', sort: 3, status: 'enabled', remark: '作业环境不良' },
        { code: 'behavior', name: '行为类', sort: 4, status: 'enabled', remark: '三违行为' }
      ],
      hazard_level: [
        { code: 'major', name: '重大隐患', sort: 1, status: 'enabled', remark: '需立即整改' },
        { code: 'general', name: '一般隐患', sort: 2, status: 'enabled', remark: '限期整改' },
        { code: 'minor', name: '轻微隐患', sort: 3, status: 'enabled', remark: '即查即改' }
      ],
      rectify_status: [
        { code: 'pending', name: '待整改', sort: 1, status: 'enabled', remark: '' },
        { code: 'rectifying', name: '整改中', sort: 2, status: 'enabled', remark: '' },
        { code: 'acceptance', name: '待验收', sort: 3, status: 'enabled', remark: '' },
        { code: 'completed', name: '已闭环', sort: 4, status: 'enabled', remark: '' },
        { code: 'overdue', name: '已逾期', sort: 5, status: 'enabled', remark: '' }
      ],
      check_type: [
        { code: 'routine', name: '日常检查', sort: 1, status: 'enabled', remark: '' },
        { code: 'special', name: '专项检查', sort: 2, status: 'enabled', remark: '' },
        { code: 'seasonal', name: '季节性检查', sort: 3, status: 'enabled', remark: '' },
        { code: 'festival', name: '节假日前检查', sort: 4, status: 'enabled', remark: '' },
        { code: 'comprehensive', name: '综合大检查', sort: 5, status: 'enabled', remark: '' }
      ],
      dangerous_work: [
        { code: 'hot', name: '动火作业', sort: 1, status: 'enabled', remark: '' },
        { code: 'confined', name: '受限空间作业', sort: 2, status: 'enabled', remark: '' },
        { code: 'height', name: '高处作业', sort: 3, status: 'enabled', remark: '' },
        { code: 'hoisting', name: '吊装作业', sort: 4, status: 'enabled', remark: '' },
        { code: 'temporary', name: '临时用电', sort: 5, status: 'enabled', remark: '' },
        { code: 'excavation', name: '挖土作业', sort: 6, status: 'enabled', remark: '' },
        { code: 'blind', name: '盲板抽堵', sort: 7, status: 'enabled', remark: '' },
        { code: 'road', name: '断路作业', sort: 8, status: 'enabled', remark: '' }
      ],
      accident_type: [
        { code: 'injury', name: '人身伤害', sort: 1, status: 'enabled', remark: '' },
        { code: 'property', name: '财产损失', sort: 2, status: 'enabled', remark: '' },
        { code: 'environmental', name: '环境损害', sort: 3, status: 'enabled', remark: '' },
        { code: 'near_miss', name: '未遂事件', sort: 4, status: 'enabled', remark: '' }
      ],
      accident_level: [
        { code: 'particularly_serious', name: '特别重大事故', sort: 1, status: 'enabled', remark: '死亡≥30人' },
        { code: 'major', name: '重大事故', sort: 2, status: 'enabled', remark: '10≤死亡<30人' },
        { code: 'larger', name: '较大事故', sort: 3, status: 'enabled', remark: '3≤死亡<10人' },
        { code: 'general', name: '一般事故', sort: 4, status: 'enabled', remark: '死亡<3人' }
      ],
      training_type: [
        { code: 'induction', name: '三级安全教育', sort: 1, status: 'enabled', remark: '' },
        { code: 'special', name: '特种作业培训', sort: 2, status: 'enabled', remark: '' },
        { code: 'daily', name: '日常安全培训', sort: 3, status: 'enabled', remark: '' },
        { code: 'retraining', name: '复训/换证', sort: 4, status: 'enabled', remark: '' },
        { code: 'external', name: '外部培训', sort: 5, status: 'enabled', remark: '' }
      ],
      drill_type: [
        { code: 'comprehensive', name: '综合应急演练', sort: 1, status: 'enabled', remark: '' },
        { code: 'single', name: '单项应急演练', sort: 2, status: 'enabled', remark: '' },
        { code: 'desktop', name: '桌面推演', sort: 3, status: 'enabled', remark: '' },
        { code: 'typhoon', name: '防台风演练', sort: 4, status: 'enabled', remark: '' },
        { code: 'fire', name: '消防演练', sort: 5, status: 'enabled', remark: '' }
      ],
      equipment_status: [
        { code: 'normal', name: '正常', sort: 1, status: 'enabled', remark: '' },
        { code: 'inspection', name: '待检验', sort: 2, status: 'enabled', remark: '' },
        { code: 'overdue', name: '检验超期', sort: 3, status: 'enabled', remark: '' },
        { code: 'repair', name: '维修中', sort: 4, status: 'enabled', remark: '' },
        { code: 'scrapped', name: '已报废', sort: 5, status: 'enabled', remark: '' }
      ],
      org_level: [
        { code: 'group', name: '集团', sort: 1, status: 'enabled', remark: '' },
        { code: 'company', name: '二级公司', sort: 2, status: 'enabled', remark: '' },
        { code: 'department', name: '部门', sort: 3, status: 'enabled', remark: '' },
        { code: 'team', name: '班组', sort: 4, status: 'enabled', remark: '' }
      ],
      assess_level: [
        { code: 'a', name: 'A级（重点管控）', sort: 1, status: 'enabled', remark: '' },
        { code: 'b', name: 'B级（常规管控）', sort: 2, status: 'enabled', remark: '' },
        { code: 'c', name: 'C级（自主管理）', sort: 3, status: 'enabled', remark: '' }
      ],
      behavior_type: [
        { code: 'illegal_operation', name: '违章操作', sort: 1, status: 'enabled', remark: '' },
        { code: 'illegal_command', name: '违章指挥', sort: 2, status: 'enabled', remark: '' },
        { code: 'violate_labor', name: '违反劳动纪律', sort: 3, status: 'enabled', remark: '' }
      ],
      emergency_level: [
        { code: 'i', name: 'I级（特别重大）', sort: 1, status: 'enabled', remark: '' },
        { code: 'ii', name: 'II级（重大）', sort: 2, status: 'enabled', remark: '' },
        { code: 'iii', name: 'III级（较大）', sort: 3, status: 'enabled', remark: '' },
        { code: 'iv', name: 'IV级（一般）', sort: 4, status: 'enabled', remark: '' }
      ],
      industry_type: [
        { code: 'port', name: '港口运营', sort: 1, status: 'enabled', remark: '' },
        { code: 'logistics', name: '物流仓储', sort: 2, status: 'enabled', remark: '' },
        { code: 'construction', name: '工程建设', sort: 3, status: 'enabled', remark: '' },
        { code: 'manufacturing', name: '制造加工', sort: 4, status: 'enabled', remark: '' },
        { code: 'service', name: '服务业务', sort: 5, status: 'enabled', remark: '' }
      ],
      custom_tag: [
        { code: 'priority', name: '优先处理', sort: 1, status: 'enabled', remark: '' },
        { code: 'follow_up', name: '需跟进', sort: 2, status: 'enabled', remark: '' },
        { code: 'archived', name: '已归档', sort: 3, status: 'disabled', remark: '不再使用' }
      ]
    }

  };

  window.DictData = DictData;
})();
