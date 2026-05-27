// data-dict-logic.js — 数据字典 交互逻辑
(function() {
  'use strict';

  var currentCategory = 'risk_level';
  var deleteTarget = null;

  var DictLogic = {

    init: function() {
      this.bindActions();
      this.renderCategories();
      this.renderDictItems();
    },

    bindActions: function() {
      var self = this;

      // Click delegation
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'selectCategory':
            var catId = String(param || '').replace(/'/g, '');
            self.selectCategory(catId);
            break;
          case 'editDictItem':
            var idx = parseInt(String(param || '').replace(/'/g, ''), 10);
            self.editDictItem(idx);
            break;
          case 'toggleStatus':
            var tIdx = parseInt(String(param || '').replace(/'/g, ''), 10);
            self.toggleStatus(tIdx);
            break;
          case 'deleteDictItem':
            var dIdx = parseInt(String(param || '').replace(/'/g, ''), 10);
            self.deleteDictItem(dIdx);
            break;
          case 'filterDictItems':
            self.filterDictItems();
            break;
          case 'resetFilter':
            self.resetFilter();
            break;
          case 'saveCategory':
            self.saveCategory();
            break;
          case 'saveDictItem':
            self.saveDictItem();
            break;
          case 'confirmDelete':
            self.confirmDelete();
            break;
          case 'hideModal':
            var modalId = String(param || '').replace(/'/g, '');
            hideModal(modalId);
            break;
        }
      });

      // Input delegation for category search
      document.addEventListener('input', function(e) {
        var el = e.target;
        if (el.matches('[data-action="filterCategory"]')) {
          self.filterCategory(el.value);
        }
      });

      // showModal override — reset dict-add form on open
      var origShowModal = window.showModal;
      window.showModal = function(id) {
        if (id === 'modal-dict-add' && document.getElementById('dict-modal-title').textContent !== '编辑字典项') {
          document.getElementById('dict-modal-title').textContent = '新增字典项';
          var cat = DictData.CATEGORIES.find(function(c) { return c.id === currentCategory; });
          document.getElementById('dict-category').value = cat ? cat.name : '';
          document.getElementById('dict-code').value = '';
          document.getElementById('dict-name').value = '';
          document.getElementById('dict-sort').value = '';
          document.getElementById('dict-status').value = 'enabled';
          document.getElementById('dict-remark').value = '';
        }
        origShowModal(id);
      };
    },

    // ---------- 渲染分类列表 ----------

    renderCategories: function() {
      var html = '';
      DictData.CATEGORIES.forEach(function(cat) {
        var count = (DictData.DICT_DATA[cat.id] || []).length;
        var active = cat.id === currentCategory ? ' active' : '';
        html += '<div class="category-item' + active + '" data-id="' + cat.id + '" data-action="selectCategory" data-param="\'' + cat.id + '\'">';
        html += '<span class="cat-icon">' + cat.icon + '</span>';
        html += '<span>' + cat.name + '</span>';
        if (cat.builtin) html += '<span class="builtin-badge">系统</span>';
        html += '<span class="cat-count">' + count + '</span>';
        html += '</div>';
      });
      document.getElementById('category-list').innerHTML = html;
    },

    // ---------- 渲染字典项表格 ----------

    renderDictItems: function() {
      var items = DictData.DICT_DATA[currentCategory] || [];
      var cat = DictData.CATEGORIES.find(function(c) { return c.id === currentCategory; });
      document.getElementById('dict-title').textContent = cat ? cat.name : '';

      var html = '';
      items.forEach(function(item, idx) {
        var statusTag = item.status === 'enabled'
          ? '<span class="tag tag-enabled">启用</span>'
          : '<span class="tag tag-disabled">停用</span>';
        html += '<tr>';
        html += '<td>' + (idx + 1) + '</td>';
        html += '<td style="font-family:monospace; font-size:var(--font-size-12); color:var(--text-secondary);">' + item.code + '</td>';
        html += '<td>' + item.name + '</td>';
        html += '<td>' + item.sort + '</td>';
        html += '<td>' + statusTag + '</td>';
        html += '<td style="color:var(--text-tertiary);">' + (item.remark || '-') + '</td>';
        html += '<td class="action-btns">';
        html += '<button class="btn btn-text btn-sm" data-action="editDictItem" data-param="\'' + idx + '\'">编辑</button>';
        if (item.status === 'enabled') {
          html += '<button class="btn btn-text btn-sm" data-action="toggleStatus" data-param="\'' + idx + '\'">停用</button>';
        } else {
          html += '<button class="btn btn-text btn-sm" data-action="toggleStatus" data-param="\'' + idx + '\'">启用</button>';
        }
        html += '<button class="btn btn-text btn-sm u-text-error" data-action="deleteDictItem" data-param="\'' + idx + '\'">删除</button>';
        html += '</td>';
        html += '</tr>';
      });

      document.getElementById('dict-tbody').innerHTML = html;
      document.getElementById('page-info').textContent = '共 ' + items.length + ' 条记录';
    },

    // ---------- 选择分类 ----------

    selectCategory: function(catId) {
      currentCategory = catId;
      this.renderCategories();
      this.renderDictItems();
    },

    // ---------- 搜索分类 ----------

    filterCategory: function(keyword) {
      var items = document.querySelectorAll('.category-item');
      keyword = keyword.toLowerCase();
      for (var i = 0; i < items.length; i++) {
        var text = items[i].textContent.toLowerCase();
        items[i].style.display = text.indexOf(keyword) >= 0 ? '' : 'none';
      }
    },

    // ---------- 编辑字典项 ----------

    editDictItem: function(idx) {
      var items = DictData.DICT_DATA[currentCategory] || [];
      var item = items[idx];
      if (!item) return;
      var cat = DictData.CATEGORIES.find(function(c) { return c.id === currentCategory; });

      document.getElementById('dict-modal-title').textContent = '编辑字典项';
      document.getElementById('dict-category').value = cat ? cat.name : '';
      document.getElementById('dict-code').value = item.code;
      document.getElementById('dict-name').value = item.name;
      document.getElementById('dict-sort').value = item.sort;
      document.getElementById('dict-status').value = item.status;
      document.getElementById('dict-remark').value = item.remark || '';

      showModal('modal-dict-add');
    },

    // ---------- 保存字典项 ----------

    saveDictItem: function() {
      var code = document.getElementById('dict-code').value.trim();
      var name = document.getElementById('dict-name').value.trim();
      if (!code || !name) {
        showToast('编码和名称不能为空', 'error');
        return;
      }
      var sort = parseInt(document.getElementById('dict-sort').value) || 1;
      var status = document.getElementById('dict-status').value;
      var remark = document.getElementById('dict-remark').value.trim();

      if (!DictData.DICT_DATA[currentCategory]) DictData.DICT_DATA[currentCategory] = [];

      var existing = DictData.DICT_DATA[currentCategory].findIndex(function(d) { return d.code === code; });
      if (existing >= 0) {
        DictData.DICT_DATA[currentCategory][existing] = { code: code, name: name, sort: sort, status: status, remark: remark };
        showToast('字典项已更新', 'success');
      } else {
        DictData.DICT_DATA[currentCategory].push({ code: code, name: name, sort: sort, status: status, remark: remark });
        showToast('字典项已新增', 'success');
      }

      hideModal('modal-dict-add');
      this.renderDictItems();
      this.renderCategories();
    },

    // ---------- 切换状态 ----------

    toggleStatus: function(idx) {
      var items = DictData.DICT_DATA[currentCategory] || [];
      if (!items[idx]) return;
      items[idx].status = items[idx].status === 'enabled' ? 'disabled' : 'enabled';
      showToast('状态已更新', 'success');
      this.renderDictItems();
    },

    // ---------- 删除字典项 ----------

    deleteDictItem: function(idx) {
      var items = DictData.DICT_DATA[currentCategory] || [];
      if (!items[idx]) return;
      deleteTarget = { category: currentCategory, index: idx };
      document.getElementById('delete-msg').textContent = '确定要删除字典项【' + items[idx].name + '】吗？';
      showModal('modal-delete');
    },

    confirmDelete: function() {
      if (!deleteTarget) return;
      var items = DictData.DICT_DATA[deleteTarget.category] || [];
      items.splice(deleteTarget.index, 1);
      deleteTarget = null;
      hideModal('modal-delete');
      showToast('字典项已删除', 'success');
      this.renderDictItems();
      this.renderCategories();
    },

    // ---------- 保存分类 ----------

    saveCategory: function() {
      var code = document.getElementById('cat-code').value.trim();
      var name = document.getElementById('cat-name').value.trim();
      if (!code || !name) {
        showToast('编码和名称不能为空', 'error');
        return;
      }
      var exists = DictData.CATEGORIES.find(function(c) { return c.id === code; });
      if (exists) {
        showToast('分类编码已存在', 'error');
        return;
      }
      DictData.CATEGORIES.push({ id: code, name: name, icon: '📁', builtin: false });
      DictData.DICT_DATA[code] = [];
      hideModal('modal-category-add');
      showToast('分类已新增', 'success');
      this.renderCategories();
    },

    // ---------- 筛选 ----------

    filterDictItems: function() {
      var name = document.getElementById('filter-name').value.trim().toLowerCase();
      var status = document.getElementById('filter-status').value;
      var items = DictData.DICT_DATA[currentCategory] || [];
      var filtered = items.filter(function(item) {
        if (name && item.name.toLowerCase().indexOf(name) < 0 && item.code.toLowerCase().indexOf(name) < 0) return false;
        if (status && item.status !== status) return false;
        return true;
      });
      this.renderFilteredItems(filtered);
    },

    resetFilter: function() {
      document.getElementById('filter-name').value = '';
      document.getElementById('filter-status').value = '';
      this.renderDictItems();
    },

    renderFilteredItems: function(items) {
      var html = '';
      items.forEach(function(item, idx) {
        var statusTag = item.status === 'enabled'
          ? '<span class="tag tag-enabled">启用</span>'
          : '<span class="tag tag-disabled">停用</span>';
        html += '<tr>';
        html += '<td>' + (idx + 1) + '</td>';
        html += '<td style="font-family:monospace; font-size:var(--font-size-12); color:var(--text-secondary);">' + item.code + '</td>';
        html += '<td>' + item.name + '</td>';
        html += '<td>' + item.sort + '</td>';
        html += '<td>' + statusTag + '</td>';
        html += '<td style="color:var(--text-tertiary);">' + (item.remark || '-') + '</td>';
        html += '<td class="action-btns"><button class="btn btn-text btn-sm">编辑</button></td>';
        html += '</tr>';
      });
      document.getElementById('dict-tbody').innerHTML = html;
      document.getElementById('page-info').textContent = '共 ' + items.length + ' 条记录（筛选结果）';
    }
  };

  window.DictLogic = DictLogic;

  document.addEventListener('DOMContentLoaded', function() {
    DictLogic.init();
  });
})();
