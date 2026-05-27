// tech-logic.js — 科技保障交互逻辑
(function() {
  'use strict';

  var _selectedUnit = 'group';
  var _treeExpanded = new Set(['group']);

  var TechLogic = {

    init: function() {
      this.renderOrgTree();
      this.selectUnit('group');
      this.bindActions();
    },

    bindActions: function() {
      var self = this;
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.getAttribute('data-action');
        var param = btn.getAttribute('data-param');

        switch (action) {
          case 'selectTechUnit':
            self.selectUnit(param);
            break;
          case 'toggleTechTree':
            self.toggleTreeNode(param, e);
            break;
          case 'openSecurityBasicsTechDetail':
            self.openDetail(param);
            break;
          case 'showSecurityBasicsTechList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'filterTech':
            self.filterTech();
            break;
          case 'resetTechFilter':
            self.resetTechFilter();
            break;
          case 'showToast':
            showToast(param || '操作成功', 'success');
            break;
          case 'hideModal':
            if (param) hideModal(param);
            break;
          case 'showModal':
            if (param) {
              showModal(param);
              if (param === 'addTechModal') {
                var modal = document.getElementById('addTechModal');
                if (modal) {
                  modal.querySelector('.modal-title').textContent = '新增科技保障项目';
                  modal.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function(el) { if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = ''; });
                }
                self._renderFileList([]);
              }
            }
            break;
          case 'editTech':
            self.editTech(param);
            break;
          case 'deleteTech':
            self.deleteTech(param);
            break;
          case 'batchDeleteTech':
            self.batchDeleteTech();
            break;
          case 'toggleAllCheck':
            self.toggleAllCheck(param);
            break;
          case 'triggerUpload':
            showToast('请选择文件上传', 'info');
            break;
          case 'removeUploadFile':
            self.removeUploadFile(btn, param);
            break;
          case 'switchPreviewTab':
            self.switchPreviewTab(param);
            break;
        }
      });

      var searchEl = document.getElementById('tech-tree-search');
      if (searchEl) {
        searchEl.addEventListener('input', function() {
          TechLogic.renderOrgTree();
        });
      }
    },

    /* ========== 组织树 ========== */

    _buildTreeHtml: function(nodes, depth, filter) {
      var html = '';
      var q = (filter || '').trim().toLowerCase();
      (nodes || []).forEach(function(n) {
        var nameMatch = !q || n.name.toLowerCase().indexOf(q) >= 0;
        var childMatch = false;
        if (n.children) {
          (function walk(arr) {
            arr.forEach(function(c) {
              if (c.name.toLowerCase().indexOf(q) >= 0) childMatch = true;
              if (c.children) walk(c.children);
            });
          })(n.children);
        }
        if (q && !nameMatch && !childMatch) return;

        var hasCh = n.children && n.children.length > 0;
        var arrowCls = hasCh ? (_treeExpanded.has(n.id) ? 'open' : '') : 'empty';
        var sel = _selectedUnit === n.id ? ' selected' : '';
        var unitList = TechData.getUnitTechList(n.id);
        var count = unitList.length;
        var hl = n.name;
        if (q && nameMatch) {
          hl = n.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
        }

        html += '<div class="tree-node' + sel + '" style="padding-left:' + (4 + depth * 14) + 'px;" data-action="selectTechUnit" data-param="' + n.id + '">';
        html += '<span class="arrow ' + arrowCls + '" data-action="toggleTechTree" data-param="' + n.id + '">&#9654;</span>';
        html += '<span class="node-icon">单</span>';
        html += '<span class="node-label">' + hl + '</span>';
        if (count > 0) html += '<span class="node-count">' + count + '</span>';
        html += '</div>';
        if (hasCh) {
          html += '<div class="tree-children' + (_treeExpanded.has(n.id) ? '' : ' collapsed') + '">';
          html += this._buildTreeHtml(n.children, depth + 1, filter);
          html += '</div>';
        }
      }.bind(this));
      return html;
    },

    renderOrgTree: function() {
      var box = document.getElementById('tech-org-tree');
      if (!box) return;
      var f = document.getElementById('tech-tree-search');
      var filter = f ? f.value.trim() : '';
      var html = this._buildTreeHtml(TechData.orgTree, 0, filter);
      box.innerHTML = html || '<div style="padding:16px 8px;text-align:center;color:var(--text-description);font-size:var(--font-size-12);">无匹配单位</div>';
    },

    toggleTreeNode: function(unitId, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      if (_treeExpanded.has(unitId)) _treeExpanded.delete(unitId);
      else _treeExpanded.add(unitId);
      this.renderOrgTree();
    },

    selectUnit: function(unitId) {
      _selectedUnit = unitId;
      this.renderOrgTree();
      this.renderUnitHeader();
      this.renderTable();
    },

    renderUnitHeader: function() {
      var name = TechData.getUnitName(_selectedUnit);
      var stats = TechData.getUnitStats(_selectedUnit);
      var titleEl = document.getElementById('tech-unit-title');
      if (titleEl) titleEl.textContent = name;
      var totalEl = document.getElementById('stat-total');
      if (totalEl) totalEl.textContent = stats.total;
      var countEl = document.getElementById('stat-count');
      if (countEl) countEl.textContent = stats.count;
      var plannedEl = document.getElementById('stat-planned');
      if (plannedEl) plannedEl.textContent = stats.planned;
      var ongoingEl = document.getElementById('stat-ongoing');
      if (ongoingEl) ongoingEl.textContent = stats.ongoing;
      var acceptedEl = document.getElementById('stat-accepted');
      if (acceptedEl) acceptedEl.textContent = stats.accepted;
    },

    /* ========== 表格渲染 ========== */

    renderTable: function() {
      var tbody = document.getElementById('tech-tbody');
      if (!tbody) return;
      var list = TechData.getUnitTechList(_selectedUnit);
      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px 0;color:var(--text-description);">暂无数据</td></tr>';
      } else {
        tbody.innerHTML = list.map(function(t, i) {
          var cat = TechData.getCategoryObj(t.category);
          var type = TechData.getTypeObj(t.type);
          var status = TechData.getStatusObj(t.status);
          return '<tr>' +
            '<td style="text-align:center"><input type="checkbox" class="row-check" value="' + t.id + '"></td>' +
            '<td style="text-align:center">' + (i + 1) + '</td>' +
            '<td data-col="name">' + t.name + '</td>' +
            '<td style="text-align:center" data-col="category"><span class="tag ' + (cat ? cat.tagCls : '') + '">' + (cat ? cat.name : t.category) + '</span></td>' +
            '<td style="text-align:center" data-col="type"><span class="tag ' + (type ? type.tagCls : '') + '">' + (type ? type.name : t.type) + '</span></td>' +
            '<td style="text-align:center;font-weight:var(--font-weight-semibold)">' + t.amount + '</td>' +
            '<td class="u-mono-fs12" style="text-align:center">' + t.date + '</td>' +
            '<td style="text-align:center" data-col="status"><span class="tag ' + (status ? status.tagCls : '') + '">' + (status ? status.name : t.status) + '</span></td>' +
            '<td>' + t.handler + '</td>' +
            '<td><div><button class="btn btn-text btn-sm" data-action="editTech" data-param="\'' + t.id + '\'">编辑</button><button class="btn btn-text btn-sm u-text-error" data-action="deleteTech" data-param="\'' + t.id + '\'">删除</button><button class="btn btn-text btn-sm" data-action="openSecurityBasicsTechDetail" data-param="\'' + t.id + '\'">查看</button></div></td>' +
            '</tr>';
        }).join('');
      }
      var infoEl = document.getElementById('tech-page-info');
      if (infoEl) infoEl.textContent = '共 ' + list.length + ' 条';
    },

    /* ========== 筛选 ========== */

    filterTech: function() {
      var container = document.getElementById('view-list');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input, .filter-field .form-select');
      var colMap = ['name', 'category', 'type', 'status'];
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) {
        var show = true;
        inputs.forEach(function(inp, idx) {
          if (!inp.value || inp.value === '全部') return;
          var col = colMap[idx];
          var td = col ? tr.querySelector('td[data-col="' + col + '"]') : null;
          if (td) {
            if (td.textContent.indexOf(inp.value) === -1) show = false;
          } else {
            var found = false;
            tr.querySelectorAll('td').forEach(function(c) {
              if (c.textContent.indexOf(inp.value) !== -1) found = true;
            });
            if (!found) show = false;
          }
        });
        tr.style.display = show ? '' : 'none';
      });
      showToast('筛选完成', 'success');
    },

    resetTechFilter: function() {
      var container = document.getElementById('view-list');
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input, .filter-field .form-select');
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    },

    /* ========== 详情 ========== */

    openDetail: function(id) {
      var key = String(id || '').replace(/'/g, '');
      var detailData = TechData.buildDetailData();
      var d = detailData[key];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }

      document.getElementById('secu5-detail-title').textContent = d.title;
      var allFields = d.basic.concat([['项目说明', d.desc || '—']]);
      document.getElementById('secu5-detail-basic').innerHTML = allFields.map(function(r) {
        var isDesc = r[0] === '项目说明';
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border-light);' + (isDesc ? 'grid-column:1/-1;' : '') + '"><div style="font-size:var(--font-size-12);color:var(--text-description);margin-bottom:2px;">' + r[0] + '</div><div style="font-size:var(--font-size-14);color:var(--text-primary);' + (isDesc ? 'line-height:1.8;' : '') + '">' + r[1] + '</div></div>';
      }).join('');

      this._currentDetailData = d;
      var files = d.files || [];
      var tabsEl = document.getElementById('tech-detail-file-tabs');
      var previewEl = document.getElementById('tech-detail-preview-content');

      if (files.length === 0) {
        tabsEl.innerHTML = '';
        previewEl.innerHTML = '<div class="preview-empty"><svg class="preview-empty-icon" viewBox="0 0 56 56" fill="none"><rect x="8" y="4" width="40" height="48" rx="4" stroke="var(--text-description)" stroke-width="2"/><path d="M20 20h16M20 28h12" stroke="var(--text-description)" stroke-width="1.5" stroke-linecap="round"/></svg><div class="preview-empty-text">暂无附件</div></div>';
      } else {
        tabsEl.innerHTML = files.map(function(f, i) {
          return '<button class="preview-file-tab' + (i === 0 ? ' active' : '') + '" data-action="switchPreviewTab" data-param="' + i + '">' + f.name + '</button>';
        }).join('');
        this._renderPreview(files[0]);
      }

      setPageView('view-list', 'view-detail', 'detail');
    },

    _renderPreview: function(file) {
      var previewEl = document.getElementById('tech-detail-preview-content');
      var ext = file.name.split('.').pop().toLowerCase();
      var name = file.name.replace(/\.[^.]+$/, '');
      if (ext === 'pdf') {
        previewEl.innerHTML = '<div class="preview-doc"><h4>' + name + '</h4><p>本文档为 PDF 格式，包含项目相关证明材料及附件。</p><p>文件大小：' + file.size + '</p><div style="margin-top:16px;padding:16px;background:var(--bg-page);border-radius:var(--radius-sm);text-align:center;"><svg viewBox="0 0 48 48" fill="none" style="width:32px;height:32px;margin-bottom:8px;"><rect x="6" y="4" width="36" height="40" rx="3" stroke="var(--error)" stroke-width="2"/><path d="M16 18h16M16 24h12M16 30h8" stroke="var(--error)" stroke-width="1.2" stroke-linecap="round"/></svg><div style="font-size:var(--font-size-12);color:var(--text-description);">PDF 文档预览区域</div></div></div>';
      } else if (ext === 'xlsx' || ext === 'xls') {
        previewEl.innerHTML = '<div class="preview-doc"><h4>' + name + '</h4><p>本文档为 Excel 格式，包含项目明细数据。</p><p>文件大小：' + file.size + '</p><div style="margin-top:16px;padding:16px;background:var(--bg-page);border-radius:var(--radius-sm);text-align:center;"><svg viewBox="0 0 48 48" fill="none" style="width:32px;height:32px;margin-bottom:8px;"><rect x="6" y="4" width="36" height="40" rx="3" stroke="var(--success)" stroke-width="2"/><path d="M14 14h8v8h-8zM26 14h8v8h-8zM14 26h8v8h-8zM26 26h8v8h-8z" stroke="var(--success)" stroke-width="1.2"/></svg><div style="font-size:var(--font-size-12);color:var(--text-description);">Excel 文档预览区域</div></div></div>';
      } else {
        previewEl.innerHTML = '<div class="preview-doc"><h4>' + name + '</h4><p>本文档为 Word 格式，可下载后编辑。</p><p>文件大小：' + file.size + '</p><div style="margin-top:16px;padding:16px;background:var(--bg-page);border-radius:var(--radius-sm);text-align:center;"><svg viewBox="0 0 48 48" fill="none" style="width:32px;height:32px;margin-bottom:8px;"><rect x="6" y="4" width="36" height="40" rx="3" stroke="var(--primary)" stroke-width="2"/><path d="M8 8h8M8 16h6M8 24h10" stroke="var(--primary)" stroke-width="1.2" stroke-linecap="round"/></svg><div style="font-size:var(--font-size-12);color:var(--text-description);">Word 文档预览区域</div></div></div>';
      }
    },

    switchPreviewTab: function(param) {
      var idx = parseInt(param, 10);
      var tabs = document.querySelectorAll('#tech-detail-file-tabs .preview-file-tab');
      tabs.forEach(function(t, i) {
        t.classList.toggle('active', i === idx);
      });
      if (!this._currentDetailData) return;
      var files = this._currentDetailData.files || [];
      if (files[idx]) this._renderPreview(files[idx]);
    },

    editTech: function(id) {
      var key = String(id || '').replace(/'/g, '');
      var record = TechData.techList.find(function(t) { return t.id === key; });
      if (!record) { showToast('记录不存在', 'info'); return; }
      var modal = document.getElementById('addTechModal');
      if (!modal) return;
      modal.querySelector('.modal-title').textContent = '编辑科技保障项目';
      var inputs = modal.querySelectorAll('.form-input, .form-select, .form-textarea');
      if (inputs[0]) inputs[0].value = record.name;
      if (inputs[1]) inputs[1].value = record.category;
      if (inputs[2]) inputs[2].value = record.type;
      if (inputs[3]) inputs[3].value = record.amount;
      if (inputs[4]) inputs[4].value = record.date;
      if (inputs[5]) inputs[5].value = record.status;
      if (inputs[6]) inputs[6].value = record.handler;
      if (inputs[7]) inputs[7].value = record.desc || '';
      this._renderFileList(record.files || []);
      showModal('addTechModal');
    },

    deleteTech: function(id) {
      var key = String(id || '').replace(/'/g, '');
      var record = TechData.techList.find(function(t) { return t.id === key; });
      if (!record) { showToast('记录不存在', 'info'); return; }
      showConfirm('确定删除「' + record.name + '」？', function() {
        Object.keys(TechData.techByUnit).forEach(function(unitId) {
          var list = TechData.techByUnit[unitId];
          var idx = -1;
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === key) { idx = i; break; }
          }
          if (idx > -1) list.splice(idx, 1);
        });
        this.renderTable();
        this.renderUnitHeader();
        this.renderOrgTree();
        showToast('已删除', 'success');
      }.bind(this));
    },

    toggleAllCheck: function(tableId) {
      var table = document.getElementById(tableId);
      if (!table) return;
      var headerCb = table.querySelector('thead input[type="checkbox"]');
      var rows = table.querySelectorAll('tbody .row-check');
      rows.forEach(function(cb) { cb.checked = headerCb.checked; });
    },

    batchDeleteTech: function() {
      var table = document.getElementById('tech-table');
      if (!table) return;
      var checked = table.querySelectorAll('tbody .row-check:checked');
      if (checked.length === 0) { showToast('请先选择记录', 'info'); return; }
      showConfirm('确定删除选中的 ' + checked.length + ' 条记录？', function() {
        var ids = [];
        checked.forEach(function(cb) { ids.push(cb.value); });
        ids.forEach(function(key) {
          Object.keys(TechData.techByUnit).forEach(function(unitId) {
            var list = TechData.techByUnit[unitId];
            var idx = -1;
            for (var i = 0; i < list.length; i++) {
              if (list[i].id === key) { idx = i; break; }
            }
            if (idx > -1) list.splice(idx, 1);
          });
        });
        this.renderTable();
        this.renderUnitHeader();
        this.renderOrgTree();
        showToast('已删除 ' + ids.length + ' 条记录', 'success');
      }.bind(this));
    },

    _fileItemHtml: function(name, size, idx) {
      return '<div class="upload-file-item">' +
        '<svg class="upload-file-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="2" stroke="var(--primary)" stroke-width="1.2"/><path d="M5 7h6M5 10h4" stroke="var(--primary)" stroke-width="1" stroke-linecap="round"/></svg>' +
        '<span class="upload-file-name">' + name + '</span>' +
        '<span class="upload-file-size">' + size + '</span>' +
        '<button class="upload-file-remove" data-action="removeUploadFile" data-param="' + idx + '">&times;</button>' +
        '</div>';
    },

    _renderFileList: function(files) {
      var list = document.getElementById('tech-file-list');
      if (!list) return;
      if (!files || files.length === 0) { list.innerHTML = ''; return; }
      var html = '';
      files.forEach(function(f, i) {
        html += this._fileItemHtml(f.name, f.size, i);
      }.bind(this));
      list.innerHTML = html;
    },

    removeUploadFile: function(btn, param) {
      var item = btn.closest('.upload-file-item');
      if (item) item.remove();
    }
  };

  window.openSecurityBasicsTechDetail = function(id) { TechLogic.openDetail(id); };
  window.showSecurityBasicsTechList = function() { setPageView('view-list', 'view-detail', 'list'); };

  document.addEventListener('DOMContentLoaded', function() {
    TechLogic.init();
  });
})();
