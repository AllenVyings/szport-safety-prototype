// result-logic.js — 考核评定 交互逻辑
(function() {
  'use strict';

  var ResultLogic = {
    currentTab: 'plan',
    publishPage: 1,
    publishPageSize: 10,
    selectedUnitId: null,
    currentStep: 1,

    init: function() {
      this.bindActions();
      this.renderPlanTable();
      this.renderIndicatorFlow();
      this.renderVetoCards();
      this.renderExecutionTable();
      this.renderRankingTables();
      this.renderPublishTable();
      this.renderRewardTable();
      this.renderAdmonitionTable();
      this.renderHonorTable();
      this.renderRectificationTable();
    },

    // ============================================================
    // Tab 切换
    // ============================================================

    switchTab: function(name, item) {
      document.querySelectorAll('.tab-bar .tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (item) item.classList.add('active');
      var panel = document.getElementById('tab-' + name);
      if (panel) panel.classList.add('active');
      this.currentTab = name;
    },

    // ============================================================
    // 事件绑定
    // ============================================================

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          // 通用
          case 'switchTab':
            self.switchTab(param, btn);
            break;
          case 'openAssessmentResultDetail':
            var id = String(param || '').replace(/'/g, '');
            self.openDetail(id);
            break;
          case 'showAssessmentResultList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'exportResult':
            showToast('导出功能开发中');
            break;
          case 'generateYearReport':
            showToast('报告生成功能开发中');
            break;

          // Tab1 计划与执行 (考核计划)
          case 'filterPlans':
            self.filterPlans();
            break;
          case 'resetPlanFilter':
            self.resetPlanFilter();
            break;
          case 'filterPlansByCard':
            self.filterPlansByCard(param);
            break;
          case 'openIndicatorConfig':
            ResultModals.showIndicatorConfig(param);
            break;
          case 'advanceFlow':
            self.advanceFlow();
            break;

          // Tab1 考核执行 (merged into 计划与执行)
          case 'filterExecution':
            self.filterExecution();
            break;
          case 'showExecutionPanel':
            self.showExecutionPanel(param);
            break;
          case 'closeExecutionPanel':
            self.closeExecutionPanel();
            break;
          case 'switchStep':
            self.switchStep(parseInt(param, 10));
            break;
          case 'submitForRating':
            ResultModals.showSubmitRating(param);
            break;
          case 'showUnitCard':
            ResultModals.showUnitCardPanel(param);
            break;
          case 'closeUnitCard':
            ResultModals.closeUnitCardPanel();
            break;

          // Tab2 结果评定
          case 'initAssessment':
            ResultModals.showInitAssessment();
            break;

          // Tab3 公示与奖惩
          case 'publishNotice':
            ResultModals.showPublishNotice();
            break;
          case 'publish':
            ResultModals.showPublish(param);
            break;
          case 'addHonor':
            ResultModals.showAddHonor();
            break;
          case 'executeAdmonition':
            ResultModals.showExecuteAdmonition(param);
            break;
          case 'reviewHonor':
            ResultModals.showReviewHonor(param);
            break;
          case 'executeReward':
            ResultModals.showExecuteReward(param);
            break;
          case 'filterPublish':
            self.filterPublish();
            break;
          case 'resetPublish':
            var pInputs = document.querySelectorAll('.publicity-filter-bar .form-input');
            pInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderPublishTable();
            break;
          case 'filterRewards':
            self.filterRewards();
            break;
          case 'resetRewards':
            var rwInputs = document.querySelectorAll('.reward-filter-bar .form-input');
            rwInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderRewardTable();
            self.renderAdmonitionTable();
            self.renderHonorTable();
            break;
          case 'verifyRectification':
            ResultModals.showVerifyRectification(param);
            break;
          case 'viewDutyStatus':
            self.showToast('请前往考核对象页面查看责任书签订状态', 'warning');
            break;
          case 'resetExecution':
            var eInputs = document.querySelectorAll('.execution-filter-bar .form-input');
            eInputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
            self.renderExecutionTable();
            break;
          case 'goDeductManage':
            self.showToast('请前往扣分管理页面进行扣分确认', 'warning');
            break;
          case 'goBonusManage':
            self.showToast('请前往加分管理页面进行加分确认', 'warning');
            break;
          
          case 'publishResult':
            self.showToast('考核结果已公示');
            break;
          case 'submitRectPlan':
            self.showToast('整改方案已提交');
            break;
          case 'urgeRectification':
            self.showToast('催办通知已发送');
            break;
        }
      });

      // 排名分组Tab切换
      document.addEventListener('click', function(e) {
        var tab = e.target.closest('.ranking-tab');
        if (!tab) return;
        var level = tab.getAttribute('data-ranking');
        if (!level) return;
        document.querySelectorAll('.ranking-tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.ranking-panel').forEach(function(p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById('ranking-' + level);
        if (panel) panel.classList.add('active');
      });

      // 二级Tab切换（公示与奖惩内）
      document.addEventListener('click', function(e) {
        var subTab = e.target.closest('.sub-tab');
        if (!subTab) return;
        var tabName = subTab.getAttribute('data-sub-tab');
        if (!tabName) return;
        // 切换二级Tab高亮
        document.querySelectorAll('#tab-publish .sub-tab').forEach(function(t) { t.classList.remove('active'); });
        subTab.classList.add('active');
        // 切换二级内容面板
        document.querySelectorAll('#tab-publish .sub-tab-content').forEach(function(p) { p.classList.remove('active'); });
        var panel = document.getElementById('subtab-' + tabName);
        if (panel) panel.classList.add('active');
      });

      // 三级Tab切换（奖惩执行内）
      document.addEventListener('click', function(e) {
        var thirdTab = e.target.closest('.third-tab');
        if (!thirdTab) return;
        var tabName = thirdTab.getAttribute('data-third-tab');
        if (!tabName) return;
        // 切换三级Tab高亮
        document.querySelectorAll('#tab-publish .third-tab').forEach(function(t) { t.classList.remove('active'); });
        thirdTab.classList.add('active');
        // 切换三级内容面板
        document.querySelectorAll('#tab-publish .third-tab-content').forEach(function(p) { p.classList.remove('active'); });
        var panel = document.getElementById('thirdtab-' + tabName);
        if (panel) panel.classList.add('active');
      });
    },

    // ============================================================
    // Tab1 计划与执行 (考核计划)
    // ============================================================

    renderPlanTable: function(filter) {
      var data = ResultData.plans;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.level && filter.level !== '全部' && r.level !== filter.level) return false;
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#plan-table tbody');
      if (!tbody) return;
      var lm = ResultData.levelMap;
      tbody.innerHTML = data.map(function(r, i) {
        var statusCls = r.status === '已完成' ? 'tag-success' : r.status === '执行中' ? 'tag-info' : 'tag-warning';
        var levelInfo = lm[r.level] || { text: r.level, cls: 'level-tag-a' };
        return '<tr><td>' + (i + 1) + '</td><td><span class="level-tag ' + levelInfo.cls + '">' + levelInfo.text + '</span></td><td>' + r.frequency + '</td><td>' + r.unitCount + '个</td><td>' + r.nextDate + '</td><td><span class="tag ' + statusCls + '">' + r.status + '</span></td><td><button class="btn btn-text btn-sm" data-action="openIndicatorConfig" data-param="veto">否决指标</button><button class="btn btn-text btn-sm" data-action="openIndicatorConfig" data-param="deduction">扣分指标</button><button class="btn btn-text btn-sm" data-action="openIndicatorConfig" data-param="bonus">加分指标</button></td></tr>';
      }).join('');
    },

    renderIndicatorFlow: function() {
      var flow = ResultData.indicatorFlow;
      var container = document.querySelector('#tab-plan .flow-steps');
      if (!container) return;
      var html = '';
      for (var i = 1; i <= 5; i++) {
        var step = flow[i];
        var cls = step.status === 'done' ? 'step-done' : step.status === 'active' ? 'step-active' : 'step-pending';
        html += '<div class="flow-step ' + cls + '">' +
          '<div class="step-num">' + i + '</div>' +
          '<div class="step-name">' + step.name + '</div>' +
          '<div class="step-operator">' + (step.status === 'done' ? step.operator : '—') + '</div>' +
          '</div>';
        if (i < 5) html += '<div class="flow-arrow">&rarr;</div>';
      }
      container.innerHTML = html;
    },

    renderVetoCards: function() {
      var cards = ResultData.indicatorCards;
      var container = document.querySelector('#tab-plan .indicator-grid');
      if (!container) return;
      container.innerHTML = cards.map(function(c) {
        var cls = c.status === '已触发' ? 'card-danger' : c.status === '已触发(连带否决)' ? 'card-linked' : c.status === '待确认连带' ? 'card-warning' : 'card-normal';
        var statusCls = c.status === '已触发' ? 'tag-error' : c.status === '已触发(连带否决)' ? 'veto-linked' : c.status === '待确认连带' ? 'tag-warning' : 'tag-success';
        var extra = c.triggerUnit ? '<div class="card-trigger">涉及：' + c.triggerUnit + '</div>' : '';
        return '<div class="veto-card ' + cls + '">' +
          '<div class="card-name">' + c.name + '</div>' +
          '<div class="card-status"><span class="tag ' + statusCls + '">' + c.status + '</span></div>' +
          extra +
          '</div>';
      }).join('');
    },

    filterPlans: function() {
      var container = document.querySelector('.plan-filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.form-input');
      var level = inputs[0] ? inputs[0].value : '全部';
      var status = inputs[1] ? inputs[1].value : '全部';
      this.renderPlanTable({ level: level, status: status });
    },

    resetPlanFilter: function() {
      var inputs = document.querySelectorAll('.plan-filter-bar .form-input');
      inputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
      this.renderPlanTable();
    },

    filterPlansByCard: function(param) {
      var inputs = document.querySelectorAll('.plan-filter-bar .form-input');
      inputs.forEach(function(el) { el.value = el.options ? '全部' : ''; });
      var statusMap = { running: '执行中', done: '已完成', pending: '待执行' };
      var status = statusMap[param] || '全部';
      var statusSelect = inputs[2];
      if (statusSelect && status !== '全部') statusSelect.value = status;
      this.renderPlanTable({ level: '全部', status: status });
    },

    advanceFlow: function() {
      var flow = ResultData.indicatorFlow;
      for (var i = 1; i <= 5; i++) {
        if (flow[i].status === 'active') {
          flow[i].status = 'done';
          flow[i].operator = '系统自动';
          if (i < 5) {
            flow[i + 1].status = 'active';
          }
          break;
        }
      }
      this.renderIndicatorFlow();
      showToast('流程已推进');
    },

    // ============================================================
    // Tab1 考核执行 (merged into 计划与执行)
    // ============================================================

    renderExecutionTable: function(filter) {
      var data = ResultData.executionCycles;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.level && filter.level !== '全部' && r.level !== filter.level) return false;
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          if (filter.keyword && r.unit.indexOf(filter.keyword) === -1) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#execution-table tbody');
      if (!tbody) return;
      var lm = ResultData.levelMap;
      tbody.innerHTML = data.map(function(r, i) {
        var vetoCls = r.vetoStatus === '已触发' ? 'tag-error' : r.vetoStatus === '已触发(连带否决)' ? 'veto-linked' : r.vetoStatus === '待确认连带' ? 'tag-warning' : 'tag-success';
        var statusCls = r.status === '已公示' ? 'tag-success' : r.status === '已评定' ? 'tag-info' : r.status === '执行中' ? 'tag-warning' : 'tag-default';
        var levelInfo = lm[r.level] || { text: r.level, cls: 'level-tag-a' };
        var tenureCls = r.tenure === '不满1年' ? 'tag-warning' : r.tenure === '—' ? '' : 'tag-info';
        var tenureTag = r.tenure === '—' ? '—' : '<span class="tag ' + tenureCls + '">' + r.tenure + '</span>';
        var vetoMarkTag = r.vetoMark ? '<span class="tag tag-error">否决</span>' : '—';
        var ops = '<button class="btn btn-text btn-sm" data-action="showExecutionPanel" data-param="' + r.id + '">查看</button>';
        ops += '<button class="btn btn-text btn-sm" data-action="showUnitCard" data-param="' + r.id + '">考核卡</button>';
        if (r.status === '执行中' || r.status === '未开始') {
          ops += '<button class="btn btn-text btn-sm" data-action="submitForRating" data-param="' + r.id + '">提交评定</button>';
        }
        if (r.isDirectEval) {
          ops = '<span class="tag tag-info" style="margin-right:4px;">直接评定</span>' + ops;
        }
        var stepInfo = ResultData.executionSteps[r.id] || {};
        return '<tr><td>' + (i + 1) + '</td><td>' + r.unit + '</td><td><span class="level-tag ' + levelInfo.cls + '">' + levelInfo.text + '</span></td><td>' + tenureTag + '</td><td><span class="tag ' + vetoCls + '">' + r.vetoStatus + '</span></td><td>' + r.deductions + '</td><td>' + r.bonus + '</td><td><strong>' + r.scorePreview + '</strong></td><td>' + vetoMarkTag + '</td><td>' + (stepInfo.label || r.status) + '</td><td><span class="tag ' + statusCls + '">' + r.status + '</span></td><td>' + ops + '</td></tr>';
      }).join('');
    },

    filterExecution: function() {
      var container = document.querySelector('.execution-filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.form-input');
      var keyword = inputs[0] ? inputs[0].value : '';
      var level = inputs[1] ? inputs[1].value : '全部';
      var status = inputs[2] ? inputs[2].value : '全部';
      this.renderExecutionTable({ keyword: keyword, level: level, status: status });
    },

    showExecutionPanel: function(unitId) {
      this.selectedUnitId = unitId;
      var stepInfo = ResultData.executionSteps[unitId] || { current: 1 };
      this.currentStep = stepInfo.current;
      this.renderExecutionSteps();
      var panel = document.getElementById('exec-panel-fullscreen');
      if (panel) panel.classList.add('show');
      var data = ResultData.executionCycles.find(function(r) { return r.id === unitId; });
      if (data) {
        var title = panel.querySelector('.panel-title');
        if (title) title.textContent = data.unit + ' — 考核执行';
      }
    },

    closeExecutionPanel: function() {
      var panel = document.getElementById('exec-panel-fullscreen');
      if (panel) panel.classList.remove('show');
    },

    renderExecutionSteps: function() {
      var steps = [
        { num: 1, name: '检查计划' },
        { num: 2, name: '扣分汇总(只读)' },
        { num: 3, name: '加分汇总(只读)' },
        { num: 4, name: '提交评定' }
      ];
      var panel = document.getElementById('exec-panel-fullscreen');
      var container = panel ? panel.querySelector('.step-bar') : null;
      if (!container) return;
      var self = this;
      container.innerHTML = steps.map(function(s) {
        var cls = s.num <= self.currentStep ? 'step-done' : 'step-pending';
        if (s.num === self.currentStep) cls = 'step-active';
        return '<div class="exec-step ' + cls + '" data-action="switchStep" data-param="' + s.num + '">' +
          '<div class="step-num">' + s.num + '</div>' +
          '<div class="step-name">' + s.name + '</div>' +
          '</div>';
      }).join('');
      this.renderStepContent();
    },

    switchStep: function(stepNum) {
      this.currentStep = stepNum;
      this.renderExecutionSteps();
    },

    renderStepContent: function() {
      var panel = document.getElementById('exec-panel-fullscreen');
      var container = panel ? panel.querySelector('.step-content') : null;
      if (!container) return;
      var unitId = this.selectedUnitId;
      var data = ResultData.executionCycles.find(function(r) { return r.id === unitId; });
      if (!data) return;
      var html = '';
      switch (this.currentStep) {
        case 1:
          html = '<div class="step-detail"><h4>检查计划</h4>' +
            '<p>管控级别：' + data.level + '</p>' +
            '<p>考核频率：' + (data.level === 'A' ? '季度' : data.level === 'B' ? '季度' : '年度') + '</p>' +
            '<p>否决指标：9项 | 扣分指标：7项 | 加分指标：8项</p>' +
            '<p>状态：<span class="tag tag-success">已生效</span></p></div>';
          break;
        case 2:
          html = '<div class="step-detail"><h4>扣分汇总</h4>' +
            '<p>扣分指标数据：已汇总</p>' +
            '<p>扣分合计：<strong style="color:var(--error);">' + data.deductions + '</strong></p>' +
            '<p>否决状态：<span class="tag ' + (data.vetoStatus === '已触发' ? 'tag-error' : data.vetoStatus === '待确认连带' ? 'tag-warning' : 'tag-success') + '">' + data.vetoStatus + '</span></p>' +
            (data.vetoStatus === '已触发' ? '<p style="color:var(--error);">否决项已触发，该单位评定等级为不达标。</p>' : '') +
            '</div>';
          break;
        case 3:
          html = '<div class="step-detail"><h4>加分汇总</h4>' +
            '<p>加分指标数据：' + (data.status === '执行中' ? '<span class="tag tag-warning">汇总中</span>' : '<span class="tag tag-success">已汇总</span>') + '</p>' +
            '<p>加分合计：<strong style="color:var(--success);">' + data.bonus + '</strong></p>' +
            '</div>';
          break;
        case 4:
          html = '<div class="step-detail"><h4>提交评定</h4>' +
            '<p>得分计算在结果评定Tab中自动完成（公式：K = S - &Sigma;Ki + Kj，S为指标方案得分）。</p>' +
            '<p>当前预览得分：<strong style="font-size:18px;color:var(--primary);">' + data.scorePreview + '</strong></p>' +
            (data.status === '执行中' || data.status === '未开始' ? '<div style="margin-top:12px;"><button class="btn btn-primary btn-sm" data-action="submitForRating" data-param="' + unitId + '">提交评定</button></div>' : '<p>状态：<span class="tag tag-info">已提交</span></p>') +
            '</div>';
          break;
      }
      container.innerHTML = html;
    },

    // ============================================================
    // Tab2 结果评定
    // ============================================================

    renderRankingTables: function() {
      var data = ResultData.ranking;
      var gm = ResultData.gradeMap;
      var levels = ['A', 'B', 'C', '二类', '一类'];
      levels.forEach(function(level) {
        var rows = data[level];
        if (!rows) return;
        var panel = document.getElementById('ranking-' + level);
        if (!panel) return;
        var tbody = panel.querySelector('.data-table tbody');
        if (!tbody) return;
        var isYilei = level === '一类';
        tbody.innerHTML = rows.map(function(r) {
          var gradeInfo = gm[r.grade] || { text: r.grade, cls: 'grade-tag-qualified' };
          var vetoMarkTag = r.vetoMark ? '<span class="tag tag-error">否决</span>' : '—';
          var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看详情</button>';
          if (isYilei) {
            return '<tr><td>' + r.rank + '</td><td>' + r.name + '</td><td>' + (r.indicatorScore || 100) + '</td><td><span class="tag tag-warning">直接考评</span></td><td><strong>' + (r.displayScore || r.score) + '</strong></td><td><span class="grade-tag ' + gradeInfo.cls + '">' + gradeInfo.text + '</span></td><td>' + vetoMarkTag + '</td><td>' + ops + '</td></tr>';
          }
          var nameCell = r.directEval ? r.name + ' <span class="tag tag-info" style="font-size:11px;margin-left:4px">直接考评</span>' : r.name;
          return '<tr><td>' + r.rank + '</td><td>' + nameCell + '</td><td>' + (r.indicatorScore || 100) + '</td><td>' + r.deduction + '</td><td>' + r.bonus + '</td><td><strong>' + (r.displayScore || r.score) + '</strong></td><td><span class="grade-tag ' + gradeInfo.cls + '">' + gradeInfo.text + '</span></td><td>' + vetoMarkTag + '</td><td>' + ops + '</td></tr>';
        }).join('');
      });
    },

    // ============================================================
    // Tab3 公示与奖惩
    // ============================================================

    renderPublishTable: function(filter) {
      var data = ResultData.publish;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.name.indexOf(filter.name) === -1) return false;
          if (filter.period && filter.period !== '全部' && r.period !== filter.period) return false;
          if (filter.publishStatus && filter.publishStatus !== '全部' && r.publishStatus !== filter.publishStatus) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#tab-publish .publish-table tbody');
      if (!tbody) return;
      var gm = ResultData.gradeMap;
      tbody.innerHTML = data.map(function(r, i) {
        var pubTag = r.publishStatus === '已公示' ? 'tag-success' : r.publishStatus === '公示中' ? 'tag-info' : r.publishStatus === '已通报' ? 'tag-success' : 'tag-warning';
        var period = r.period || (r.year + '年');
        var publicityPeriod = r.publicityPeriod || '—';
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.publishStatus === '未公示' && r.approvalStatus === '已审批') {
          ops += '<button class="btn btn-text btn-sm" data-action="publish" data-param="' + r.id + '">公示</button>';
        }
        if (r.publishStatus === '公示中') {
          ops += '<button class="btn btn-text btn-sm" data-action="publishNotice">发布通报</button>';
        }
        return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + period + '</td><td>' + r.score + '</td><td><span class="grade-tag ' + gm[r.grade].cls + '">' + gm[r.grade].text + '</span></td><td><span class="tag ' + pubTag + '">' + r.publishStatus + '</span></td><td>' + publicityPeriod + '</td><td>' + ops + '</td></tr>';
      }).join('');
    },

    filterPublish: function() {
      var container = document.querySelector('.publicity-filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.form-input');
      var name = inputs[0] ? inputs[0].value : '';
      var period = inputs[1] ? inputs[1].value : '全部';
      var publishStatus = inputs[2] ? inputs[2].value : '全部';
      this.renderPublishTable({
        name: name,
        period: period,
        publishStatus: publishStatus
      });
    },

    renderRewardTable: function(filter) {
      var data = ResultData.rewards;
      if (filter) {
        data = data.filter(function(r) {
          if (filter.name && r.name.indexOf(filter.name) === -1) return false;
          if (filter.type && filter.type !== '全部' && r.type !== filter.type) return false;
          if (filter.status && filter.status !== '全部' && r.status !== filter.status) return false;
          return true;
        });
      }
      var tbody = document.querySelector('#tab-publish .reward-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.status === '待执行') {
          ops += '<button class="btn btn-text btn-sm" data-action="executeReward" data-param="' + r.id + '">执行</button>';
        }
        var execTime = r.execTime || '—';
        return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td><span class="tag tag-' + r.typeTag + '">' + r.type + '</span></td><td>' + r.content + '</td><td><span class="tag tag-' + r.statusTag + '">' + r.status + '</span></td><td>' + execTime + '</td><td>' + ops + '</td></tr>';
      }).join('');
    },

    renderAdmonitionTable: function() {
      var data = ResultData.admonitions;
      var tbody = document.querySelector('#tab-publish .admonition-table tbody');
      if (!tbody) {
        var tables = document.querySelectorAll('#tab-publish .data-table');
        if (tables.length >= 2) tbody = tables[1].querySelector('tbody');
      }
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.status === '待执行') {
          ops += '<button class="btn btn-text btn-sm" data-action="executeAdmonition" data-param="' + r.id + '">执行</button>';
        }
        var interviewer = r.interviewer || '—';
        return '<tr><td>' + (i + 1) + '</td><td>' + r.name + '</td><td>' + r.reason + '</td><td>' + r.date + '</td><td>' + interviewer + '</td><td><span class="tag tag-' + r.statusTag + '">' + r.status + '</span></td><td>' + ops + '</td></tr>';
      }).join('');
    },

    renderHonorTable: function() {
      var data = ResultData.honors;
      var tbody = document.querySelector('#tab-publish .honor-table tbody');
      if (!tbody) {
        var tables = document.querySelectorAll('#tab-publish .data-table');
        if (tables.length >= 3) tbody = tables[2].querySelector('tbody');
      }
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.status === '审核中') {
          ops += '<button class="btn btn-text btn-sm" data-action="reviewHonor" data-param="' + r.id + '">审核</button>';
        }
        var honorTime = r.honorTime || r.year;
        var honorContent = r.honorContent || (r.name + ' — ' + r.type);
        return '<tr><td>' + (i + 1) + '</td><td>' + r.unit + '</td><td><span class="tag tag-' + r.typeTag + '">' + r.type + '</span></td><td>' + honorContent + '</td><td>' + honorTime + '</td><td>' + ops + '</td></tr>';
      }).join('');
    },

    renderRectificationTable: function() {
      var data = ResultData.rectifications;
      var tbody = document.querySelector('#tab-publish .rectification-table tbody');
      if (!tbody) return;
      tbody.innerHTML = data.map(function(r, i) {
        var statusCls = r.status === '已验证' ? 'tag-success' : r.status === '逾期' ? 'tag-error' : r.status === '整改中' ? 'tag-info' : 'tag-warning';
        var remainText = r.remainingDays > 0 ? '剩余' + r.remainingDays + '天' : r.remainingDays === 0 ? '—' : '逾期' + Math.abs(r.remainingDays) + '天';
        var ops = '<button class="btn btn-text btn-sm" data-action="openAssessmentResultDetail" data-param="\'' + r.id + '\'">查看</button>';
        if (r.status === '整改中' || r.status === '待整改') {
          ops += '<button class="btn btn-text btn-sm" data-action="verifyRectification" data-param="' + r.id + '">验证</button>';
        }
        return '<tr><td>' + (i + 1) + '</td><td>' + r.unit + '</td><td>' + r.reason + '</td><td>' + r.deadline + '</td><td>' + remainText + '</td><td><span class="tag ' + statusCls + '">' + r.status + '</span></td><td>' + ops + '</td></tr>';
      }).join('');
    },

    filterRewards: function() {
      var container = document.querySelector('.reward-filter-bar');
      if (!container) return;
      var inputs = container.querySelectorAll('.form-input');
      var name = inputs[0] ? inputs[0].value : '';
      var type = inputs[1] ? inputs[1].value : '全部';
      var status = inputs[2] ? inputs[2].value : '全部';
      this.renderRewardTable({ name: name, type: type, status: status });
    },

    // ============================================================
    // 共享功能
    // ============================================================

    openDetail: function(id) {
      var d = ResultData.details[id];
      if (!d) {
        d = { title: '记录详情', basic: [['状态', '进行中']], desc: '原型样例数据。', timeline: [{ status: 'done', time: '2026-05-01', event: '登记' }] };
      }
      var titleEl = document.getElementById('res-detail-title');
      if (titleEl) titleEl.textContent = d.title;
      var basicEl = document.getElementById('res-detail-basic');
      if (basicEl) {
        basicEl.innerHTML = d.basic.map(function(r) {
          return '<div class="detail-row" style="display:flex;justify-content:space-between;padding:4px 0;font-size:var(--font-size-13);"><span style="color:var(--text-secondary);">' + r[0] + '</span><span>' + r[1] + '</span></div>';
        }).join('');
      }
      var descEl = document.getElementById('res-detail-desc');
      if (descEl) descEl.textContent = d.desc;
      if (typeof renderApprovalTimeline === 'function') {
        renderApprovalTimeline('res-detail-timeline', d.timeline);
      }
      setPageView('view-list', 'view-detail', 'detail');
    },

    showToast: function(msg) {
      if (typeof showToast === 'function') {
        showToast(msg, 'success');
      } else {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 24px;background:#52c41a;color:#fff;border-radius:4px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 2000);
      }
    }
  };

  window.ResultLogic = ResultLogic;

  document.addEventListener('DOMContentLoaded', function() {
    ResultLogic.init();
    // Tree node click handler
    var treeBody = document.getElementById('unitTree');
    if (treeBody) {
      treeBody.addEventListener('click', function(e) {
        var arrow = e.target.closest('[data-action="toggleOrgTreeNode"]');
        if (arrow) return;
        var node = e.target.closest('.tree-node');
        if (!node) return;
        var unitId = node.getAttribute('data-unit');
        if (unitId && typeof selectOrgUnit === 'function') selectOrgUnit('unitTree', unitId);
      });
    }
  });
})();
