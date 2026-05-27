// basic-config-logic.js — 基础配置交互逻辑
(function() {
  'use strict';

  var _currentGroup = 'risk';
  var _currentType = null;
  var _typePage = 1;
  var _optPage = 1;
  var _typePageSize = 10;
  var _optPageSize = 10;

  var BasicConfigLogic = {

    init: function() {
      this.bindActions();
      this.renderGroups();
      this.renderTypes();
    },

    bindActions: function() {
      var self = this;
      // Change delegation for select elements
      document.addEventListener('change', function(e) {
        var el = e.target;
        var action = el.getAttribute('data-action');
        if (!action) return;
        if (action === 'changeTypePageSize') {
          self.changeTypePageSize();
        } else if (action === 'changeOptPageSize') {
          self.changeOptPageSize();
        }
      });

      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'selectGroup':
            var gid = String(param || '').replace(/'/g, '');
            self.selectGroup(gid);
            break;
          case 'openOptions':
            var tid = String(param || '').replace(/'/g, '');
            self.openOptions(tid);
            break;
          case 'showTypesView':
            self.showTypesView();
            break;
          case 'filterTypes':
            self.filterTypes();
            break;
          case 'resetTypeFilter':
            self.resetTypeFilter();
            break;
          case 'filterOptions':
            self.filterOptions();
            break;
          case 'resetOptionFilter':
            self.resetOptionFilter();
            break;
          case 'openCreateType':
            self.openCreateType();
            break;
          case 'openEditType':
            var eid = String(param || '').replace(/'/g, '');
            self.openEditType(eid);
            break;
          case 'saveConfigType':
            self.saveType();
            break;
          case 'deleteType':
            var did = String(param || '').replace(/'/g, '');
            self.deleteType(did);
            break;
          case 'openCreateOption':
            self.openCreateOption();
            break;
          case 'openEditOption':
            var oidx = String(param || '').replace(/'/g, '');
            self.openEditOption(oidx);
            break;
          case 'saveConfigOption':
            self.saveOption();
            break;
          case 'toggleOptionStatus':
            var oiid = String(param || '').replace(/'/g, '');
            self.toggleOptionStatus(oiid);
            break;
          case 'deleteOption':
            var odid = String(param || '').replace(/'/g, '');
            self.deleteOption(odid);
            break;
          case 'openCreateGroup':
            self.openCreateGroup();
            break;
          case 'saveGroup':
            self.saveGroup();
            break;
          case 'changeTypePageSize':
            self.changeTypePageSize();
            break;
          case 'goToTypePage':
            self.goToTypePage(parseInt(param) || 1);
            break;
          case 'jumpTypePage':
            self.jumpTypePage();
            break;
          case 'changeOptPageSize':
            self.changeOptPageSize();
            break;
          case 'goToOptPage':
            self.goToOptPage(parseInt(param) || 1);
            break;
          case 'jumpOptPage':
            self.jumpOptPage();
            break;
          case 'hideModal':
            if (param) {
              var mid = String(param).replace(/'/g, '');
              hideModal(mid);
            }
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

    renderGroups: function() {
      var list = document.getElementById('group-list');
      if (!list) return;
      list.innerHTML = BasicConfigData.groups.map(function(g) {
        var cls = 'bc-group-item' + (g.id === _currentGroup ? ' active' : '') + (g.enabled ? '' : ' disabled');
        return '<div class="' + cls + '" data-action="selectGroup" data-param="\'' + g.id + '\'">' +
          '<span>' + g.name + '</span><span class="bc-group-count">' + g.count + '</span></div>';
      }).join('');
    },

    selectGroup: function(id) {
      var g = BasicConfigData.groups.find(function(x) { return x.id === id; });
      if (!g || !g.enabled) {
        this.showToast('该模块分组将在后续版本开放', 'info');
        return;
      }
      _currentGroup = id;
      _currentType = null;
      this.renderGroups();
      this.showTypesView();
    },

    renderTypes: function(filter) {
      var types = BasicConfigData.configTypes[_currentGroup] || [];
      if (filter && filter.name) {
        types = types.filter(function(t) { return t.name.indexOf(filter.name) !== -1; });
      }
      var tbody = document.getElementById('types-tbody');
      if (!tbody) return;

      var groupName = (BasicConfigData.groups.find(function(g) { return g.id === _currentGroup; }) || {}).name || '';
      var title = document.getElementById('types-title');
      if (title) title.textContent = groupName + ' — 配置项类型';

      if (types.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-description)">暂无配置项类型</td></tr>';
        this.renderTypePagination(0);
        return;
      }

      var start = (_typePage - 1) * _typePageSize;
      var pageData = types.slice(start, start + _typePageSize);

      tbody.innerHTML = pageData.map(function(t, i) {
        return '<tr><td>' + (start + i + 1) + '</td>' +
          '<td><button class="btn btn-text btn-sm" data-action="openOptions" data-param="\'' + t.id + '\'">' + t.name + '</button></td>' +
          '<td>' + t.code + '</td><td>' + t.count + '</td><td>' + t.desc + '</td>' +
          '<td><div>' +
            '<button class="btn btn-text btn-sm" data-action="openOptions" data-param="\'' + t.id + '\'">管理选项</button>' +
            '<button class="btn btn-text btn-sm" data-action="openEditType" data-param="\'' + t.id + '\'">编辑</button>' +
            '<button class="btn btn-text btn-sm" style="color:var(--danger)" data-action="deleteType" data-param="\'' + t.id + '\'">删除</button>' +
          '</div></td></tr>';
      }).join('');

      this.renderTypePagination(types.length);
    },

    renderTypePagination: function(total) {
      var info = document.getElementById('bc-type-page-info');
      if (info) info.textContent = '共 ' + total + ' 条';
      var totalPages = Math.ceil(total / _typePageSize) || 1;
      var pgn = document.getElementById('bc-type-pagination');
      if (pgn) {
        var html = '';
        if (totalPages <= 1) {
          html = '<div class="pagination-page active">1</div>';
        } else {
          html += '<div class="pagination-page' + (_typePage === 1 ? ' disabled' : '') + '" data-action="goToTypePage" data-param="' + (_typePage - 1) + '">&lsaquo;</div>';
          for (var p = 1; p <= totalPages; p++) {
            html += '<div class="pagination-page' + (p === _typePage ? ' active' : '') + '" data-action="goToTypePage" data-param="' + p + '">' + p + '</div>';
          }
          html += '<div class="pagination-page' + (_typePage === totalPages ? ' disabled' : '') + '" data-action="goToTypePage" data-param="' + (_typePage + 1) + '">&rsaquo;</div>';
        }
        pgn.innerHTML = html;
      }
    },

    showTypesView: function() {
      _currentType = null;
      _typePage = 1;
      var vt = document.getElementById('view-types');
      var vo = document.getElementById('view-options');
      if (vt) vt.classList.remove('u-none');
      if (vo) vo.classList.add('u-none');
      this.renderTypes();
    },

    openOptions: function(typeId) {
      var types = BasicConfigData.configTypes[_currentGroup] || [];
      var t = types.find(function(x) { return x.id === typeId; });
      if (!t) return;
      _currentType = t;
      _optPage = 1;

      var vt = document.getElementById('view-types');
      var vo = document.getElementById('view-options');
      if (vt) vt.classList.add('u-none');
      if (vo) vo.classList.remove('u-none');

      var bt = document.getElementById('breadcrumb-type');
      if (bt) bt.textContent = t.name;
      var ot = document.getElementById('options-title');
      if (ot) ot.textContent = t.name + ' — 配置选项';

      this.renderOptions();
    },

    renderOptions: function(filter) {
      if (!_currentType) return;
      var opts = BasicConfigData.options[_currentType.id] || [];
      if (filter) {
        if (filter.name) opts = opts.filter(function(o) { return o.name.indexOf(filter.name) !== -1; });
        if (filter.status && filter.status !== '全部') opts = opts.filter(function(o) { return o.status === filter.status; });
      }

      var tbody = document.getElementById('options-tbody');
      if (!tbody) return;

      if (opts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-description)">暂无选项</td></tr>';
        this.renderOptPagination(0);
        return;
      }

      var start = (_optPage - 1) * _optPageSize;
      var pageData = opts.slice(start, start + _optPageSize);

      tbody.innerHTML = pageData.map(function(o, i) {
        var tagCls = o.status === '启用' ? 'tag-success' : 'tag-default';
        var toggleText = o.status === '启用' ? '停用' : '启用';
        var toggleAction = o.status === '启用' ? '停用' : '启用';
        return '<tr><td>' + (start + i + 1) + '</td>' +
          '<td>' + o.name + '</td><td>' + o.code + '</td><td>' + o.sort + '</td>' +
          '<td><span class="tag ' + tagCls + '">' + o.status + '</span></td>' +
          '<td><div>' +
            '<button class="btn btn-text btn-sm" data-action="openEditOption" data-param="\'' + o.code + '\'">编辑</button>' +
            '<button class="btn btn-text btn-sm" data-action="toggleOptionStatus" data-param="\'' + o.code + '\'">' + toggleText + '</button>' +
            '<button class="btn btn-text btn-sm" style="color:var(--danger)" data-action="deleteOption" data-param="\'' + o.code + '\'">删除</button>' +
          '</div></td></tr>';
      }).join('');

      this.renderOptPagination(opts.length);
    },

    renderOptPagination: function(total) {
      var info = document.getElementById('bc-opt-page-info');
      if (info) info.textContent = '共 ' + total + ' 条';
      var totalPages = Math.ceil(total / _optPageSize) || 1;
      var pgn = document.getElementById('bc-opt-pagination');
      if (pgn) {
        var html = '';
        if (totalPages <= 1) {
          html = '<div class="pagination-page active">1</div>';
        } else {
          html += '<div class="pagination-page' + (_optPage === 1 ? ' disabled' : '') + '" data-action="goToOptPage" data-param="' + (_optPage - 1) + '">&lsaquo;</div>';
          for (var p = 1; p <= totalPages; p++) {
            html += '<div class="pagination-page' + (p === _optPage ? ' active' : '') + '" data-action="goToOptPage" data-param="' + p + '">' + p + '</div>';
          }
          html += '<div class="pagination-page' + (_optPage === totalPages ? ' disabled' : '') + '" data-action="goToOptPage" data-param="' + (_optPage + 1) + '">&rsaquo;</div>';
        }
        pgn.innerHTML = html;
      }
    },

    // Filter types
    filterTypes: function() {
      var input = document.querySelector('#view-types .filter-field .form-input');
      this.renderTypes({ name: input ? input.value.trim() : '' });
    },

    resetTypeFilter: function() {
      var input = document.querySelector('#view-types .filter-field .form-input');
      if (input) input.value = '';
      _typePage = 1;
      this.renderTypes();
    },

    // Filter options
    filterOptions: function() {
      var fields = document.querySelectorAll('#view-options .filter-field .form-input');
      this.renderOptions({
        name: fields[0] ? fields[0].value.trim() : '',
        status: fields[1] ? fields[1].value : '全部'
      });
    },

    resetOptionFilter: function() {
      var fields = document.querySelectorAll('#view-options .filter-field .form-input');
      if (fields[0]) fields[0].value = '';
      if (fields[1]) fields[1].selectedIndex = 0;
      _optPage = 1;
      this.renderOptions();
    },

    // Create/edit type modal
    openCreateType: function() {
      this._showTypeModal(null);
    },

    openEditType: function(id) {
      var types = BasicConfigData.configTypes[_currentGroup] || [];
      var t = types.find(function(x) { return x.id === id; });
      this._showTypeModal(t);
    },

    _showTypeModal: function(editData) {
      var existing = document.getElementById('modal-type-form');
      if (existing) existing.remove();
      var div = document.createElement('div');
      var groupName = (BasicConfigData.groups.find(function(g) { return g.id === _currentGroup; }) || {}).name || '';
      div.innerHTML = BasicConfigModals.createTypeModal(editData, groupName);
      document.body.appendChild(div.firstElementChild);
      if (editData) {
        var modal = document.getElementById('modal-type-form');
        if (modal) modal.setAttribute('data-edit-id', editData.id);
      }
      showModal('modal-type-form');
    },

    saveType: function() {
      var nameEl = document.getElementById('bc-type-name');
      var codeEl = document.getElementById('bc-type-code');
      var descEl = document.getElementById('bc-type-desc');
      if (!nameEl || !nameEl.value.trim()) { this.showToast('请输入类型名称', 'error'); return; }
      if (!codeEl || !codeEl.value.trim()) { this.showToast('请输入类型编码', 'error'); return; }

      var modal = document.getElementById('modal-type-form');
      var editId = modal ? modal.getAttribute('data-edit-id') : null;
      var types = BasicConfigData.configTypes[_currentGroup] || [];

      if (editId) {
        var t = types.find(function(x) { return x.id === editId; });
        if (t) { t.name = nameEl.value.trim(); t.code = codeEl.value.trim(); t.desc = descEl.value; }
        this.showToast('类型已更新', 'success');
      } else {
        types.push({ id: 't' + Date.now(), name: nameEl.value.trim(), code: codeEl.value.trim(), count: 0, desc: descEl.value });
        this.showToast('类型已创建', 'success');
      }
      hideModal('modal-type-form');
      this.renderTypes();
    },

    deleteType: function(id) {
      var self = this;
      var types = BasicConfigData.configTypes[_currentGroup] || [];
      var t = types.find(function(x) { return x.id === id; });
      if (!t) return;
      showConfirm('确定删除配置项类型「' + t.name + '」？关联的选项也将被删除。', function() {
        var idx = types.indexOf(t);
        if (idx !== -1) types.splice(idx, 1);
        self.renderTypes();
        self.showToast('类型已删除', 'success');
      });
    },

    // Create/edit option modal
    openCreateOption: function() {
      this._showOptionModal(null);
    },

    openEditOption: function(code) {
      if (!_currentType) return;
      var opts = BasicConfigData.options[_currentType.id] || [];
      var o = opts.find(function(x) { return x.code === code; });
      if (o) this._showOptionModal(o);
    },

    _showOptionModal: function(editData) {
      if (!_currentType) return;
      var existing = document.getElementById('modal-option-form');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = BasicConfigModals.createOptionModal(_currentType.name, editData);
      document.body.appendChild(div.firstElementChild);
      if (editData) {
        var modal = document.getElementById('modal-option-form');
        if (modal) modal.setAttribute('data-edit-code', editData.code);
      }
      showModal('modal-option-form');
    },

    saveOption: function() {
      var nameEl = document.getElementById('bc-opt-name');
      var codeEl = document.getElementById('bc-opt-code');
      var sortEl = document.getElementById('bc-opt-sort');
      if (!nameEl || !nameEl.value.trim()) { this.showToast('请输入选项名称', 'error'); return; }
      if (!codeEl || !codeEl.value.trim()) { this.showToast('请输入选项编码', 'error'); return; }

      var modal = document.getElementById('modal-option-form');
      var editCode = modal ? modal.getAttribute('data-edit-code') : null;
      var opts = BasicConfigData.options[_currentType.id] || [];

      if (editCode) {
        var o = opts.find(function(x) { return x.code === editCode; });
        if (o) { o.name = nameEl.value.trim(); o.code = codeEl.value.trim(); o.sort = parseInt(sortEl.value) || 1; }
        this.showToast('选项已更新', 'success');
      } else {
        opts.push({ name: nameEl.value.trim(), code: codeEl.value.trim(), sort: parseInt(sortEl.value) || 1, status: '启用' });
        _currentType.count = opts.length;
        this.showToast('选项已创建', 'success');
      }
      hideModal('modal-option-form');
      this.renderOptions();
    },

    toggleOptionStatus: function(code) {
      if (!_currentType) return;
      var opts = BasicConfigData.options[_currentType.id] || [];
      var o = opts.find(function(x) { return x.code === code; });
      if (!o) return;
      o.status = o.status === '启用' ? '已停用' : '启用';
      this.renderOptions();
      this.showToast('状态已更新', 'success');
    },

    deleteOption: function(code) {
      if (!_currentType) return;
      var self = this;
      var opts = BasicConfigData.options[_currentType.id] || [];
      var o = opts.find(function(x) { return x.code === code; });
      if (!o) return;
      showConfirm('确定删除选项「' + o.name + '」？', function() {
        var idx = opts.indexOf(o);
        if (idx !== -1) opts.splice(idx, 1);
        _currentType.count = opts.length;
        self.renderOptions();
        self.showToast('选项已删除', 'success');
      });
    },

    // Group modal
    openCreateGroup: function() {
      var existing = document.getElementById('modal-group-form');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.innerHTML = BasicConfigModals.createGroupModal();
      document.body.appendChild(div.firstElementChild);
      showModal('modal-group-form');
    },

    saveGroup: function() {
      var nameEl = document.getElementById('bc-group-name');
      if (!nameEl || !nameEl.value.trim()) { this.showToast('请输入分组名称', 'error'); return; }
      var id = 'g' + Date.now();
      BasicConfigData.groups.push({ id: id, name: nameEl.value.trim(), count: 0, enabled: true });
      BasicConfigData.configTypes[id] = [];
      hideModal('modal-group-form');
      this.renderGroups();
      this.showToast('分组已创建', 'success');
    },

    // Pagination helpers
    changeTypePageSize: function() {
      var sel = document.getElementById('bc-type-page-size');
      if (sel) _typePageSize = parseInt(sel.value) || 10;
      _typePage = 1;
      this.renderTypes();
    },

    goToTypePage: function(page) { _typePage = page; this.renderTypes(); },

    jumpTypePage: function() {
      var input = document.getElementById('bc-type-jump');
      if (input) { var p = parseInt(input.value); if (p) this.goToTypePage(p); input.value = ''; }
    },

    changeOptPageSize: function() {
      var sel = document.getElementById('bc-opt-page-size');
      if (sel) _optPageSize = parseInt(sel.value) || 10;
      _optPage = 1;
      this.renderOptions();
    },

    goToOptPage: function(page) { _optPage = page; this.renderOptions(); },

    jumpOptPage: function() {
      var input = document.getElementById('bc-opt-jump');
      if (input) { var p = parseInt(input.value); if (p) this.goToOptPage(p); input.value = ''; }
    },

    showToast: function(msg, type) {
      showToast(msg, type || 'success');
    }
  };

  window.BasicConfigLogic = BasicConfigLogic;

  document.addEventListener('DOMContentLoaded', function() {
    BasicConfigLogic.init();
  });
})();
