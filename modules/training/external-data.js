// external-data.js — 外来人员培训数据
(function() {
  'use strict';

  var ExternalData = {

    manageStats: { total: 86, passed: 52, learning: 18, notLearned: 10, failed: 6 },

    recordStats: { total: 124, passed: 96, failed: 28, validCert: 78, expiring: 12 },

    manageList: [
      { id: 'train-1', name: '陈建国', unit: '中建三局', project: '集装箱码头扩建工程', courses: '3门', learnStatus: '已通过', learnCls: 'tag-passed', examStatus: '已通过', examCls: 'tag-passed', certStatus: '有效', certCls: 'tag-valid' },
      { id: 'train-2', name: '赵伟', unit: '华泰建设', project: '油罐区检修工程', courses: '4门', learnStatus: '学习中', learnCls: 'tag-learning', examStatus: '未考试', examCls: 'tag-notlearned', certStatus: '—', certCls: '' },
      { id: 'train-3', name: '刘洋', unit: '港务工程公司', project: '散货码头改造工程', courses: '3门', learnStatus: '已通过', learnCls: 'tag-passed', examStatus: '未通过', examCls: 'tag-failed', certStatus: '—', certCls: '' },
      { id: 'train-4', name: '王海', unit: '中建三局', project: '集装箱码头扩建工程', courses: '3门', learnStatus: '未学习', learnCls: 'tag-notlearned', examStatus: '未考试', examCls: 'tag-notlearned', certStatus: '—', certCls: '' },
      { id: 'train-5', name: '李明', unit: '华泰建设', project: '油罐区检修工程', courses: '4门', learnStatus: '已通过', learnCls: 'tag-passed', examStatus: '已通过', examCls: 'tag-passed', certStatus: '即将到期', certCls: 'tag-expiring' },
      { id: 'train-6', name: '张磊', unit: '恒通劳务', project: '散货码头改造工程', courses: '2门', learnStatus: '已通过', learnCls: 'tag-passed', examStatus: '已通过', examCls: 'tag-passed', certStatus: '已过期', certCls: 'tag-expired' }
    ],

    certList: [
      { id: 'train-7', holder: '陈建国', unit: '中建三局', type: '安全培训合格证', issueDate: '2026-05-12', expireDate: '2027-05-12', status: '有效', statusCls: 'tag-valid' },
      { id: 'train-8', holder: '李明', unit: '华泰建设', type: '安全培训合格证', issueDate: '2025-06-20', expireDate: '2026-06-20', status: '即将到期', statusCls: 'tag-expiring' },
      { id: 'train-9', holder: '张磊', unit: '恒通劳务', type: '安全培训合格证', issueDate: '2025-03-10', expireDate: '2026-03-10', status: '已过期', statusCls: 'tag-expired' },
      { id: 'train-10', holder: '赵伟', unit: '华泰建设', type: '特种作业培训证', issueDate: '2026-01-15', expireDate: '2027-01-15', status: '有效', statusCls: 'tag-valid' }
    ],

    recordList: [
      { id: 'train-11', name: '陈建国', unit: '中建三局', course: '入场安全教育培训', date: '2026-05-12', score: 92, result: '已通过', resultCls: 'tag-passed' },
      { id: 'train-12', name: '刘洋', unit: '港务工程公司', course: '危化品安全专项培训', date: '2026-05-14', score: 48, result: '未通过', resultCls: 'tag-failed' },
      { id: 'train-13', name: '赵伟', unit: '华泰建设', course: '入场安全教育培训', date: '2026-05-16', score: '—', result: '学习中', resultCls: 'tag-learning' }
    ],

    detailData: {
      'train-1': { title: '陈建国 — 培训详情', basic: [['姓名', '陈建国'], ['所属单位', '中建三局'], ['关联项目', '集装箱码头扩建工程'], ['学习状态', '已通过'], ['考试状态', '已通过'], ['证书状态', '有效']], desc: '已完成所有必修课程并通过考试，培训合格证在有效期内。', timeline: [{ status: 'done', time: '2026-05-10', event: '准入登记' }, { status: 'done', time: '2026-05-11', event: '完成在线学习' }, { status: 'done', time: '2026-05-12', event: '考试通过' }] },
      'train-2': { title: '赵伟 — 培训详情', basic: [['姓名', '赵伟'], ['所属单位', '华泰建设'], ['学习状态', '学习中'], ['考试状态', '未考试']], desc: '正在学习必修课程中，尚未参加考试。', timeline: [{ status: 'done', time: '2026-05-13', event: '准入登记' }, { status: 'active', time: '进行中', event: '在线学习' }] },
      'train-3': { title: '刘洋 — 培训详情', basic: [['姓名', '刘洋'], ['所属单位', '港务工程公司'], ['学习状态', '已通过'], ['考试状态', '未通过']], desc: '学习已完成但考试未通过，需安排补考。', timeline: [{ status: 'done', time: '2026-05-12', event: '准入登记' }, { status: 'done', time: '2026-05-13', event: '完成学习' }, { status: 'done', time: '2026-05-14', event: '考试未通过' }] },
      'train-7': { title: '陈建国 — 安全培训合格证', basic: [['证书类型', '安全培训合格证'], ['发证日期', '2026-05-12'], ['到期日期', '2027-05-12'], ['状态', '有效']], desc: '培训合格证书在有效期内。', timeline: [{ status: 'done', time: '2026-05-12', event: '发证' }] },
      'train-11': { title: '入场安全教育培训记录', basic: [['人员姓名', '陈建国'], ['所属单位', '中建三局'], ['培训课程', '入场安全教育培训'], ['考试成绩', '92'], ['结果', '已通过']], desc: '入场安全教育培训，考试成绩92分，通过。', timeline: [{ status: 'done', time: '2026-05-12', event: '完成培训' }] }
    },

    fallback: { title: '记录详情', basic: [['状态', '进行中']], desc: '原型样例：展示业务基本信息与办理/处置进度。', timeline: [{ status: 'done', time: '2026-05-01', event: '登记' }, { status: 'active', time: '进行中', event: '办理' }] }
  };

  window.ExternalData = ExternalData;
})();
