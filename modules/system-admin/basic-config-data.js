// basic-config-data.js — 基础配置数据
(function() {
  'use strict';

  var BasicConfigData = {

    groups: [
      { id: 'risk', name: '风险管控', count: 4, enabled: true },
      { id: 'dangerous-work', name: '现场管理-危险作业', count: 4, enabled: true },
      { id: 'hazard', name: '隐患排查', count: 3, enabled: true },
      { id: 'emergency', name: '应急管理', count: 2, enabled: true },
      { id: 'accident', name: '事故管理', count: 1, enabled: false }
    ],

    configTypes: {
      risk: [
        { id: 'cat', name: '分类名称', code: 'RISK_CATEGORY', count: 8, desc: '风险分类维度' },
        { id: 'unit', name: '评估单元', code: 'EVAL_UNIT', count: 12, desc: '评估单元划分' },
        { id: 'point', name: '风险点', code: 'RISK_POINT', count: 25, desc: '风险辨识点位' },
        { id: 'accident', name: '事故类型', code: 'ACCIDENT_TYPE', count: 15, desc: '可能发生的事故类型' }
      ],
      'dangerous-work': [
        { id: 'dw-type', name: '作业类型', code: 'DW_WORK_TYPE', count: 6, desc: '动火/受限空间/登高/临时用电/吊装/动土等' },
        { id: 'dw-cert', name: '所需持证', code: 'DW_CERT_REQ', count: 8, desc: '按作业类型关联持证要求' },
        { id: 'dw-permit', name: '许可模板', code: 'DW_PERMIT_TMPL', count: 4, desc: '作业票/许可单模板（上传）' },
        { id: 'dw-approval', name: '默认审批链', code: 'DW_APPROVAL_DEF', count: 3, desc: '发起时可覆盖的阶段审批人默认模板' }
      ],
      hazard: [
        { id: 'h-level', name: '隐患等级', code: 'HAZARD_LEVEL', count: 4, desc: '隐患分级标准' },
        { id: 'h-type', name: '隐患类型', code: 'HAZARD_TYPE', count: 6, desc: '隐患分类方式' },
        { id: 'h-source', name: '排查来源', code: 'HAZARD_SOURCE', count: 5, desc: '隐患发现渠道' }
      ],
      emergency: [
        { id: 'e-type', name: '应急类型', code: 'EMERGENCY_TYPE', count: 4, desc: '应急事件分类' },
        { id: 'e-level', name: '响应级别', code: 'RESPONSE_LEVEL', count: 4, desc: '应急响应等级' }
      ]
    },

    options: {
      accident: [
        { name: '物体打击', code: 'ACC_01', sort: 1, status: '启用' },
        { name: '车辆伤害', code: 'ACC_02', sort: 2, status: '启用' },
        { name: '机械伤害', code: 'ACC_03', sort: 3, status: '启用' },
        { name: '起重伤害', code: 'ACC_04', sort: 4, status: '启用' },
        { name: '触电', code: 'ACC_05', sort: 5, status: '已停用' },
        { name: '淹溺', code: 'ACC_06', sort: 6, status: '启用' },
        { name: '灼烫', code: 'ACC_07', sort: 7, status: '启用' },
        { name: '火灾', code: 'ACC_08', sort: 8, status: '启用' },
        { name: '高处坠落', code: 'ACC_09', sort: 9, status: '启用' },
        { name: '坍塌', code: 'ACC_10', sort: 10, status: '启用' },
        { name: '冒顶片帮', code: 'ACC_11', sort: 11, status: '启用' },
        { name: '透水', code: 'ACC_12', sort: 12, status: '已停用' },
        { name: '放炮', code: 'ACC_13', sort: 13, status: '启用' },
        { name: '瓦斯爆炸', code: 'ACC_14', sort: 14, status: '启用' },
        { name: '其他伤害', code: 'ACC_15', sort: 15, status: '启用' }
      ],
      cat: [
        { name: '机械伤害类', code: 'RC_01', sort: 1, status: '启用' },
        { name: '电气安全类', code: 'RC_02', sort: 2, status: '启用' },
        { name: '消防安全类', code: 'RC_03', sort: 3, status: '启用' },
        { name: '交通运输类', code: 'RC_04', sort: 4, status: '启用' },
        { name: '化学品类', code: 'RC_05', sort: 5, status: '启用' },
        { name: '高处作业类', code: 'RC_06', sort: 6, status: '启用' },
        { name: '职业健康类', code: 'RC_07', sort: 7, status: '启用' },
        { name: '其他', code: 'RC_08', sort: 8, status: '启用' }
      ],
      unit: [
        { name: '盐田港区', code: 'EU_01', sort: 1, status: '启用' },
        { name: '大铲湾港区', code: 'EU_02', sort: 2, status: '启用' },
        { name: '蛇口港区', code: 'EU_03', sort: 3, status: '启用' },
        { name: '前海港区', code: 'EU_04', sort: 4, status: '启用' },
        { name: '集团本部', code: 'EU_05', sort: 5, status: '启用' },
        { name: '物流园区', code: 'EU_06', sort: 6, status: '启用' },
        { name: '仓储基地', code: 'EU_07', sort: 7, status: '启用' },
        { name: '办公区域', code: 'EU_08', sort: 8, status: '启用' },
        { name: '码头泊位', code: 'EU_09', sort: 9, status: '启用' },
        { name: '堆场', code: 'EU_10', sort: 10, status: '启用' },
        { name: '维修车间', code: 'EU_11', sort: 11, status: '启用' },
        { name: '其他', code: 'EU_12', sort: 12, status: '启用' }
      ],
      point: [
        { name: '起重机械作业区', code: 'RP_01', sort: 1, status: '启用' },
        { name: '场内机动车辆通道', code: 'RP_02', sort: 2, status: '启用' },
        { name: '压力容器存储区', code: 'RP_03', sort: 3, status: '启用' },
        { name: '配电设施', code: 'RP_04', sort: 4, status: '启用' },
        { name: '消防设施', code: 'RP_05', sort: 5, status: '启用' },
        { name: '临边洞口', code: 'RP_06', sort: 6, status: '启用' },
        { name: '化学品存储区', code: 'RP_07', sort: 7, status: '启用' },
        { name: '密闭空间', code: 'RP_08', sort: 8, status: '启用' },
        { name: '码头前沿', code: 'RP_09', sort: 9, status: '启用' },
        { name: '堆场作业面', code: 'RP_10', sort: 10, status: '启用' }
      ],
      'h-level': [
        { name: '一般隐患', code: 'HL_01', sort: 1, status: '启用' },
        { name: '重大隐患', code: 'HL_02', sort: 2, status: '启用' },
        { name: '特别重大隐患', code: 'HL_03', sort: 3, status: '启用' },
        { name: '挂牌督办', code: 'HL_04', sort: 4, status: '启用' }
      ],
      'h-type': [
        { name: '设备设施类', code: 'HT_01', sort: 1, status: '启用' },
        { name: '作业行为类', code: 'HT_02', sort: 2, status: '启用' },
        { name: '安全管理类', code: 'HT_03', sort: 3, status: '启用' },
        { name: '环境条件类', code: 'HT_04', sort: 4, status: '启用' },
        { name: '职业健康类', code: 'HT_05', sort: 5, status: '启用' },
        { name: '其他', code: 'HT_06', sort: 6, status: '启用' }
      ],
      'dw-type': [
        { name: '动火作业', code: 'DW_T01', sort: 1, status: '启用' },
        { name: '受限空间', code: 'DW_T02', sort: 2, status: '启用' },
        { name: '登高作业', code: 'DW_T03', sort: 3, status: '启用' },
        { name: '临时用电', code: 'DW_T04', sort: 4, status: '启用' },
        { name: '吊装作业', code: 'DW_T05', sort: 5, status: '启用' },
        { name: '动土作业', code: 'DW_T06', sort: 6, status: '启用' }
      ],
      'dw-cert': [
        { name: '动火作业证', code: 'DW_C01', sort: 1, status: '启用' },
        { name: '受限空间作业证', code: 'DW_C02', sort: 2, status: '启用' },
        { name: '登高作业证', code: 'DW_C03', sort: 3, status: '启用' },
        { name: '起重作业证', code: 'DW_C04', sort: 4, status: '启用' }
      ],
      'dw-permit': [
        { name: '动火作业票模板', code: 'DW_P01', sort: 1, status: '启用' },
        { name: '受限空间作业票模板', code: 'DW_P02', sort: 2, status: '启用' },
        { name: '吊装作业票模板', code: 'DW_P03', sort: 3, status: '启用' },
        { name: '通用危险作业票', code: 'DW_P04', sort: 4, status: '启用' }
      ],
      'dw-approval': [
        { name: '部门+公司安办（默认）', code: 'DW_A01', sort: 1, status: '启用' },
        { name: '部门+安办+集团安委办', code: 'DW_A02', sort: 2, status: '启用' },
        { name: '简化审批（二级动火）', code: 'DW_A03', sort: 3, status: '启用' }
      ],
      'h-source': [
        { name: '日常巡查', code: 'HS_01', sort: 1, status: '启用' },
        { name: '专项检查', code: 'HS_02', sort: 2, status: '启用' },
        { name: '上级督查', code: 'HS_03', sort: 3, status: '启用' },
        { name: '员工举报', code: 'HS_04', sort: 4, status: '启用' },
        { name: '智能监测', code: 'HS_05', sort: 5, status: '启用' }
      ],
      'e-type': [
        { name: '自然灾害', code: 'ET_01', sort: 1, status: '启用' },
        { name: '事故灾难', code: 'ET_02', sort: 2, status: '启用' },
        { name: '公共卫生', code: 'ET_03', sort: 3, status: '启用' },
        { name: '社会安全', code: 'ET_04', sort: 4, status: '启用' }
      ],
      'e-level': [
        { name: 'I级响应', code: 'EL_01', sort: 1, status: '启用' },
        { name: 'II级响应', code: 'EL_02', sort: 2, status: '启用' },
        { name: 'III级响应', code: 'EL_03', sort: 3, status: '启用' },
        { name: 'IV级响应', code: 'EL_04', sort: 4, status: '启用' }
      ]
    }

  };

  window.BasicConfigData = BasicConfigData;
})();
