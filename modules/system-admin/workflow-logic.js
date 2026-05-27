// workflow-logic.js — 流程管理交互逻辑
(function() {
  'use strict';

  var _currentPage = 1;
  var _pageSize = 10;
  var _filteredData = [];

  var WorkflowLogic = {

    init: function() {
      this.bindActions();
      this.renderTable();
    },

    bindActions: function() {
      var self = this;
      // Change delegation for select elements
      document.addEventListener('change', function(e) {
        var el = e.target;
        var action = el.getAttribute('data-action');
        if (!action) return;
        if (action === 'changeWorkflowPageSize') {
          self.changePageSize();
        }
      });

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'switchTab':
            var tabName = String(param || '').replace(/'/g, '');
            window.switchTab(tabName);
            break;
          case 'filterWorkflows':
            self.filterFlows();
            break;
          case 'resetWorkflowFilter':
            self.resetFilters();
            break;
          case 'openCreateFlow':
            self.openCreateFlow();
            break;
          case 'openEditFlow':
            var id = String(param || '').replace(/'/g, '');
            self.openEditFlow(id);
            break;
          case 'saveFlow':
            self.saveFlow();
            break;
          case 'configureFlow':
            var cid = String(param || '').replace(/'/g, '');
            self.configureFlow(cid);
            break;
          case 'toggleFlowStatus':
            var tid = String(param || '').replace(/'/g, '');
            self.toggleStatus(tid);
            break;
          case 'deleteFlow':
            var did = String(param || '').replace(/'/g, '');
            self.deleteFlow(did);
            break;
          case 'exportWorkflows':
            self.showToast('导出功能开发中');
            break;
          case 'selectFlowNode':
            var nodeParam = String(param || '').replace(/'/g, '');
            self.selectFlowNode(nodeParam);
            break;
          case 'changeWorkflowPageSize':
            self.changePageSize();
            break;
          case 'goToWorkflowPage':
            self.goToPage(parseInt(param) || 1);
            break;
          case 'jumpWorkflowPage':
            self.jumpToPage();
            break;
          case 'hideModal':
            if (param) {
              var mid = String(param).replace(/'/g, '');
              hideModal(mid);
            }
            break;
          case 'toggleAllFlows':
            self.toggleAll(e.target.checked);
            break;
        }
      });

      // Backdrop click to close modals
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
          hideModal(e.target.id);
        }
      });
    },

    // 渲染表格
    renderTable: function() {
      _filteredData = WorkflowData.flows.slice();
      _currentPage = 1;
      this.renderPage();
      this.updateStats();
    },

    renderPage: function() {
      var start = (_currentPage - 1) * _pageSize;
      var pageData = _filteredData.slice(start, start + _pageSize);

      var tbody = document.querySelector('#tab-list .data-table tbody');
      if (!tbody) return;

      if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-description)">暂无数据</td></tr>';
        this.renderPagination(0);
        return;
      }

      tbody.innerHTML = pageData.map(function(r, i) {
        var funcTags = r.functions.map(function(f) {
          var cls = WorkflowData.functionTypes[f] || 'tag-func tag-func-abandon';
          return '<span class="tag-func ' + cls + '">' + f + '</span>';
        }).join('');

        var statusCls = WorkflowData.statusTags[r.status] || 'tag-default';
        var statusTag = '<span class="tag ' + statusCls + '">' + r.status + '</span>';

        var actionBtns = '<button class="btn btn-text btn-sm" data-action="configureFlow" data-param="\'' + r.id + '\'">配置</button>';

        if (r.status === '已启用') {
          actionBtns += '<button class="btn btn-text btn-sm" data-action="toggleFlowStatus" data-param="\'' + r.id + '\'">停用</button>';
        } else if (r.status === '已停用') {
          actionBtns += '<button class="btn btn-text btn-sm" data-action="toggleFlowStatus" data-param="\'' + r.id + '\'">启用</button>';
        } else if (r.status === '草稿') {
          actionBtns += '<button class="btn btn-text btn-sm" data-action="toggleFlowStatus" data-param="\'' + r.id + '\'">启用</button>';
          actionBtns += '<button class="btn btn-text btn-sm" style="color:var(--danger)" data-action="deleteFlow" data-param="\'' + r.id + '\'">删除</button>';
        } else if (r.status === '待配置') {
          actionBtns += '<button class="btn btn-text btn-sm" data-action="toggleFlowStatus" data-param="\'' + r.id + '\'">启用</button>';
          actionBtns += '<button class="btn btn-text btn-sm" data-action="openEditFlow" data-param="\'' + r.id + '\'">编辑</button>';
          actionBtns += '<button class="btn btn-text btn-sm" style="color:var(--danger)" data-action="deleteFlow" data-param="\'' + r.id + '\'">删除</button>';
        }

        return '<tr>' +
          '<td><input type="checkbox" class="flow-checkbox" data-id="' + r.id + '"></td>' +
          '<td>' + (start + i + 1) + '</td>' +
          '<td>' + r.name + '</td>' +
          '<td>' + r.module + '</td>' +
          '<td>' + r.nodeCount + '</td>' +
          '<td>' + funcTags + '</td>' +
          '<td>' + statusTag + '</td>' +
          '<td><div>' + actionBtns + '</div></td>' +
        '</tr>';
      }).join('');

      this.renderPagination(_filteredData.length);
    },

    renderPagination: function(total) {
      var info = document.getElementById('wf-page-info');
      if (info) info.textContent = '共 ' + total + ' 条';

      var sizeSelect = document.getElementById('wf-page-size');
      var totalPages = Math.ceil(total / _pageSize) || 1;

      var pgn = document.getElementById('wf-pagination');
      if (pgn) {
        var html = '';
        if (totalPages <= 1) {
          html = '<div class="pagination-page active">1</div>';
        } else {
          html += '<div class="pagination-page' + (_currentPage === 1 ? ' disabled' : '') + '" data-action="goToWorkflowPage" data-param="' + (_currentPage - 1) + '">&lsaquo;</div>';
          for (var p = 1; p <= totalPages; p++) {
            html += '<div class="pagination-page' + (p === _currentPage ? ' active' : '') + '" data-action="goToWorkflowPage" data-param="' + p + '">' + p + '</div>';
          }
          html += '<div class="pagination-page' + (_currentPage === totalPages ? ' disabled' : '') + '" data-action="goToWorkflowPage" data-param="' + (_currentPage + 1) + '">&rsaquo;</div>';
        }
        pgn.innerHTML = html;
      }
    },

    updateStats: function() {
      var total = WorkflowData.flows.length;
      var enabled = WorkflowData.flows.filter(function(f) { return f.status === '已启用'; }).length;
      var pending = WorkflowData.flows.filter(function(f) { return f.status === '待配置'; }).length;
      var nums = document.querySelectorAll('.stat-item .stat-num');
      if (nums[0]) nums[0].textContent = total;
      if (nums[1]) nums[1].textContent = enabled;
      if (nums[2]) nums[2].textContent = pending;
    },

    // 筛选
    filterFlows: function() {
      var fields = document.querySelectorAll('#tab-list .filter-field .form-input');
      var nameVal = fields[0] ? fields[0].value.trim() : '';
      var statusVal = fields[1] ? fields[1].value : '全部';
      var moduleVal = fields[2] ? fields[2].value : '全部';

      _filteredData = WorkflowData.flows.filter(function(r) {
        if (nameVal && r.name.indexOf(nameVal) === -1) return false;
        if (statusVal !== '全部' && r.status !== statusVal) return false;
        if (moduleVal !== '全部' && r.module !== moduleVal) return false;
        return true;
      });

      _currentPage = 1;
      this.renderPage();
    },

    resetFilters: function() {
      var fields = document.querySelectorAll('#tab-list .filter-field .form-input');
      fields.forEach(function(el) {
        if (el.tagName === 'SELECT') {
          el.selectedIndex = 0;
        } else {
          el.value = '';
        }
      });
      this.renderTable();
    },

    // 新建流程
    openCreateFlow: function() {
      var existing = document.getElementById('modal-flow-form');
      if (existing) existing.remove();

      var div = document.createElement('div');
      div.innerHTML = WorkflowModals.createFlowModal(null);
      document.body.appendChild(div.firstElementChild);
      showModal('modal-flow-form');
    },

    // 编辑流程
    openEditFlow: function(id) {
      var flow = WorkflowData.flows.find(function(f) { return f.id === id; });
      if (!flow) return;

      var existing = document.getElementById('modal-flow-form');
      if (existing) existing.remove();

      var div = document.createElement('div');
      div.innerHTML = WorkflowModals.createFlowModal(flow);
      document.body.appendChild(div.firstElementChild);

      // 存储编辑ID
      var modal = document.getElementById('modal-flow-form');
      if (modal) modal.setAttribute('data-edit-id', id);

      showModal('modal-flow-form');
    },

    // 保存流程
    saveFlow: function() {
      var nameEl = document.getElementById('flow-name');
      var moduleEl = document.getElementById('flow-module');
      var descEl = document.getElementById('flow-desc');

      if (!nameEl || !nameEl.value.trim()) {
        this.showToast('请输入流程名称', 'error');
        return;
      }

      var funcs = [];
      document.querySelectorAll('input[name="flow-func"]:checked').forEach(function(cb) {
        funcs.push(cb.value);
      });

      var modal = document.getElementById('modal-flow-form');
      var editId = modal ? modal.getAttribute('data-edit-id') : null;

      if (editId) {
        var flow = WorkflowData.flows.find(function(f) { return f.id === editId; });
        if (flow) {
          flow.name = nameEl.value.trim();
          flow.module = moduleEl.value;
          flow.functions = funcs;
          flow.desc = descEl.value;
        }
        this.showToast('流程已更新', 'success');
      } else {
        var newId = 'f' + String(WorkflowData.flows.length + 1).padStart(2, '0');
        WorkflowData.flows.push({
          id: newId,
          name: nameEl.value.trim(),
          module: moduleEl.value,
          nodeCount: 2,
          functions: funcs,
          status: '草稿',
          desc: descEl.value
        });
        this.showToast('流程已创建', 'success');
      }

      hideModal('modal-flow-form');
      this.renderTable();
    },

    // 配置流程
    configureFlow: function(id) {
      switchTab('designer');
      this.showToast('已加载流程配置：' + (WorkflowData.flows.find(function(f) { return f.id === id; }) || {}).name);
    },

    // 停用/启用
    toggleStatus: function(id) {
      var flow = WorkflowData.flows.find(function(f) { return f.id === id; });
      if (!flow) return;
      var self = this;

      if (flow.status === '已启用') {
        showConfirm('确定停用流程「' + flow.name + '」？停用后相关审批将暂停。', function() {
          flow.status = '已停用';
          self.renderTable();
          self.showToast('流程已停用', 'success');
        });
      } else {
        flow.status = '已启用';
        this.renderTable();
        this.showToast('流程已启用', 'success');
      }
    },

    // 删除
    deleteFlow: function(id) {
      var flow = WorkflowData.flows.find(function(f) { return f.id === id; });
      if (!flow) return;
      var self = this;

      showConfirm('确定删除流程「' + flow.name + '」？此操作不可恢复。', function() {
        var idx = WorkflowData.flows.indexOf(flow);
        if (idx !== -1) WorkflowData.flows.splice(idx, 1);
        self.renderTable();
        self.showToast('流程已删除', 'success');
      });
    },

    // 设计器节点选择
    selectFlowNode: function(param) {
      var parts = param.split('|');
      var name = parts[0] || '';
      var type = parts[1] || '';

      document.querySelectorAll('.flow-node-box').forEach(function(n) { n.classList.remove('selected'); });

      // 找到点击的节点并高亮
      document.querySelectorAll('.flow-node-box').forEach(function(n) {
        var title = n.querySelector('.node-title');
        if (title && title.textContent === name) {
          n.classList.add('selected');
        }
      });

      var propName = document.getElementById('prop-name');
      var propType = document.getElementById('prop-type');
      if (propName) propName.textContent = name;
      if (propType) propType.textContent = type;
    },

    // 全选/取消全选
    toggleAll: function(checked) {
      document.querySelectorAll('.flow-checkbox').forEach(function(cb) {
        cb.checked = checked;
      });
    },

    // 分页
    changePageSize: function() {
      var sel = document.getElementById('wf-page-size');
      if (!sel) return;
      _pageSize = parseInt(sel.value) || 10;
      _currentPage = 1;
      this.renderPage();
    },

    goToPage: function(page) {
      var totalPages = Math.ceil(_filteredData.length / _pageSize) || 1;
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      _currentPage = page;
      this.renderPage();
    },

    jumpToPage: function() {
      var input = document.getElementById('wf-jump-input');
      if (!input) return;
      var page = parseInt(input.value);
      if (isNaN(page) || page < 1) return;
      this.goToPage(page);
      input.value = '';
    },

    // Toast
    showToast: function(msg, type) {
      showToast(msg, type || 'success');
    }
  };

  window.WorkflowLogic = WorkflowLogic;

  // 全局 switchTab（供 data-action 委托调用）
  window.switchTab = function(param) {
    var name = String(param || '').replace(/'/g, '');
    document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-item').forEach(function(t) {
      var tParam = String(t.getAttribute('data-param') || '').replace(/'/g, '');
      if (tParam === name) {
        t.classList.add('active');
      }
    });
    var tab = document.getElementById('tab-' + name);
    if (tab) tab.classList.add('active');
  };

  document.addEventListener('DOMContentLoaded', function() {
    WorkflowLogic.init();
  });
})();
