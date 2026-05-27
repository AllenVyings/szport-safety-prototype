// regulation-logic.js — 制度保障交互逻辑
(function() {
  'use strict';

  var RegulationLogic = {

    init: function() {
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
          case 'switchTab':
            var name = String(param || '').replace(/'/g, '');
            self.switchTab(name, btn);
            break;
          case 'showAddRegModal':
            self.openFormModal();
            break;
          case 'editReg':
            self.openFormModal(param);
            break;
          case 'viewReg':
            self.openDetailModal(param);
            break;
          case 'showSecurityBasicsRegulationList':
            setPageView('view-list', 'view-detail', 'list');
            break;
          case 'switchPreviewTab':
            self.switchPreviewTab(param);
            break;
          case 'saveRegulation':
            self.saveRegulation();
            break;
          case 'filterLaw':
            self.filterLaw();
            break;
          case 'resetLawFilter':
            self.resetLawFilter();
            break;
          case 'filterRule':
            self.filterRule();
            break;
          case 'resetRuleFilter':
            self.resetRuleFilter();
            break;
          case 'exportData':
            showToast('导出功能开发中', 'info');
            break;
          case 'triggerUpload':
            showToast('请选择文件上传', 'info');
            break;
          case 'removeUploadFile':
            self.removeUploadFile(btn, param);
            break;
          case 'deleteReg':
            self.deleteReg(param);
            break;
          case 'batchDeleteReg':
            self.batchDeleteReg(param);
            break;
          case 'toggleAllCheck':
            self.toggleAllCheck(param);
            break;
          case 'hideModal':
            if (param) hideModal(param);
            break;
        }
      });
    },

    switchTab: function(name, clickedTab) {
      document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      if (clickedTab) clickedTab.classList.add('active');
      var tab = document.getElementById('tab-' + name);
      if (tab) tab.classList.add('active');
    },

    _findRecord: function(id) {
      var key = String(id || '').replace(/'/g, '');
      var law = RegulationData.lawList.find(function(r) { return r.id === key; });
      if (law) return { type: 'law', data: law };
      var rule = RegulationData.ruleList.find(function(r) { return r.id === key; });
      if (rule) return { type: 'rule', data: rule };
      return null;
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
      var list = document.getElementById('reg-file-list');
      if (!list) return;
      if (!files || files.length === 0) { list.innerHTML = ''; return; }
      var html = '';
      files.forEach(function(f, i) {
        html += this._fileItemHtml(f.name, f.size, i);
      }.bind(this));
      list.innerHTML = html;
    },

    openFormModal: function(editId) {
      var isEdit = !!editId;
      var titleEl = document.getElementById('reg-form-title');
      var nameInput = document.getElementById('reg-name');
      var categorySelect = document.getElementById('reg-category');
      var publisherInput = document.getElementById('reg-publisher');
      var scopeSelect = document.getElementById('reg-scope');
      var dateInput = document.getElementById('reg-date');
      var statusSelect = document.getElementById('reg-status');
      var versionInput = document.getElementById('reg-version');
      var descInput = document.getElementById('reg-desc');
      var publisherGroup = document.getElementById('reg-publisher-group');
      var scopeGroup = document.getElementById('reg-scope-group');
      var versionGroup = document.getElementById('reg-version-group');

      nameInput.value = '';
      categorySelect.selectedIndex = 0;
      publisherInput.value = '';
      scopeSelect.selectedIndex = 0;
      dateInput.value = '';
      statusSelect.selectedIndex = 0;
      versionInput.value = '';
      descInput.value = '';

      if (isEdit) {
        var rec = this._findRecord(editId);
        if (!rec) { showToast('记录不存在', 'info'); return; }
        titleEl.textContent = '编辑' + (rec.type === 'law' ? '法律法规' : '规章制度');
        nameInput.value = rec.data.name;

        var catOptions = categorySelect.options;
        for (var i = 0; i < catOptions.length; i++) {
          if (catOptions[i].text === (rec.data.category || rec.data.type)) {
            categorySelect.selectedIndex = i; break;
          }
        }

        if (rec.type === 'law') {
          publisherGroup.style.display = '';
          scopeGroup.style.display = 'none';
          versionGroup.style.display = 'none';
          publisherInput.value = rec.data.publisher || '';
        } else {
          publisherGroup.style.display = 'none';
          scopeGroup.style.display = '';
          versionGroup.style.display = '';
          for (var j = 0; j < scopeSelect.options.length; j++) {
            if (scopeSelect.options[j].text === rec.data.scope) {
              scopeSelect.selectedIndex = j; break;
            }
          }
          versionInput.value = rec.data.version || '';
        }

        dateInput.value = rec.data.effectDate || '';
        for (var k = 0; k < statusSelect.options.length; k++) {
          if (statusSelect.options[k].text === rec.data.status) {
            statusSelect.selectedIndex = k; break;
          }
        }

        var detail = RegulationData.detailData[rec.data.id];
        if (detail) descInput.value = detail.desc || '';
        this._renderFileList(rec.data.files || []);
      } else {
        titleEl.textContent = '新增法律法规';
        publisherGroup.style.display = '';
        scopeGroup.style.display = 'none';
        versionGroup.style.display = 'none';
        this._renderFileList([]);
      }

      showModal('modal-reg-form');
    },

    openDetailModal: function(id) {
      var key = String(id || '').replace(/'/g, '');
      var d = RegulationData.detailData[key];
      if (!d) { showToast('详情数据暂未配置', 'info'); return; }

      document.getElementById('reg-detail-title').textContent = d.title;
      var allFields = d.basic.concat([['说明', d.desc || '—']]);
      document.getElementById('reg-detail-basic').innerHTML = allFields.map(function(r) {
        var isDesc = r[0] === '说明';
        return '<div style="padding:8px 0;border-bottom:1px solid var(--border-light);' + (isDesc ? 'grid-column:1/-1;' : '') + '"><div style="font-size:var(--font-size-12);color:var(--text-description);margin-bottom:2px;">' + r[0] + '</div><div style="font-size:var(--font-size-14);color:var(--text-primary);' + (isDesc ? 'line-height:1.8;' : '') + '">' + r[1] + '</div></div>';
      }).join('');

      var rec = this._findRecord(key);
      this._currentDetailRecord = rec;
      var files = rec && rec.data ? (rec.data.files || []) : [];
      var tabsEl = document.getElementById('reg-detail-file-tabs');
      var previewEl = document.getElementById('reg-detail-preview-content');

      if (files.length === 0) {
        tabsEl.innerHTML = '';
        previewEl.innerHTML = '<div class="preview-empty"><svg class="preview-empty-icon" viewBox="0 0 56 56" fill="none"><rect x="8" y="4" width="40" height="48" rx="4" stroke="var(--text-description)" stroke-width="2"/><path d="M20 20h16M20 28h12" stroke="var(--text-description)" stroke-width="1.5" stroke-linecap="round"/></svg><div class="preview-empty-text">暂无附件</div></div>';
      } else {
        tabsEl.innerHTML = files.map(function(f, i) {
          return '<button class="preview-file-tab' + (i === 0 ? ' active' : '') + '" data-action="switchPreviewTab" data-param="' + i + '">' + f.name + '</button>';
        }).join('');
        this._renderPreview(files[0], 0);
      }

      setPageView('view-list', 'view-detail', 'detail');
    },

    _renderPreview: function(file, idx) {
      var previewEl = document.getElementById('reg-detail-preview-content');
      var ext = file.name.split('.').pop().toLowerCase();
      var name = file.name.replace(/\.[^.]+$/, '');
      if (ext === 'pdf') {
        previewEl.innerHTML = '<div class="preview-doc"><h4>' + name + '</h4><p>本文档为 PDF 格式，包含制度全文内容及附件材料。</p><p>文件大小：' + file.size + '</p><div style="margin-top:16px;padding:16px;background:var(--bg-page);border-radius:var(--radius-sm);text-align:center;"><svg viewBox="0 0 48 48" fill="none" style="width:32px;height:32px;margin-bottom:8px;"><rect x="6" y="4" width="36" height="40" rx="3" stroke="var(--error)" stroke-width="2"/><path d="M16 18h16M16 24h12M16 30h8" stroke="var(--error)" stroke-width="1.2" stroke-linecap="round"/></svg><div style="font-size:var(--font-size-12);color:var(--text-description);">PDF 文档预览区域</div></div></div>';
      } else {
        previewEl.innerHTML = '<div class="preview-doc"><h4>' + name + '</h4><p>本文档为 Word 格式，可下载后编辑。</p><p>文件大小：' + file.size + '</p><div style="margin-top:16px;padding:16px;background:var(--bg-page);border-radius:var(--radius-sm);text-align:center;"><svg viewBox="0 0 48 48" fill="none" style="width:32px;height:32px;margin-bottom:8px;"><rect x="6" y="4" width="36" height="40" rx="3" stroke="var(--primary)" stroke-width="2"/><path d="M8 8h8M8 16h6M8 24h10" stroke="var(--primary)" stroke-width="1.2" stroke-linecap="round"/></svg><div style="font-size:var(--font-size-12);color:var(--text-description);">Word 文档预览区域</div></div></div>';
      }
    },

    switchPreviewTab: function(param) {
      var idx = parseInt(param, 10);
      var tabs = document.querySelectorAll('#reg-detail-file-tabs .preview-file-tab');
      tabs.forEach(function(t, i) {
        t.classList.toggle('active', i === idx);
      });
      var activeTab = tabs[idx];
      if (!activeTab) return;
      var fileName = activeTab.textContent;
      var rec = this._currentDetailRecord;
      if (!rec) return;
      var files = rec.data.files || [];
      if (files[idx]) this._renderPreview(files[idx], idx);
    },

    saveRegulation: function() {
      var nameEl = document.getElementById('reg-name');
      if (!nameEl || !nameEl.value.trim()) { showToast('请输入名称', 'error'); return; }
      var catEl = document.getElementById('reg-category');
      if (catEl && catEl.value === '请选择') { showToast('请选择类别', 'error'); return; }
      hideModal('modal-reg-form');
      showToast('保存成功', 'success');
    },

    _filterTable: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) {
        var show = true;
        inputs.forEach(function(inp) {
          if (!inp.value || inp.value === '全部') return;
          var found = false;
          tr.querySelectorAll('td').forEach(function(td) {
            if (td.textContent.indexOf(inp.value) !== -1) found = true;
          });
          if (!found) show = false;
        });
        tr.style.display = show ? '' : 'none';
      });
      showToast('筛选完成', 'success');
    },

    _resetFilter: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var inputs = container.querySelectorAll('.filter-field .form-input');
      inputs.forEach(function(el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      });
      var rows = container.querySelectorAll('.data-table tbody tr');
      rows.forEach(function(tr) { tr.style.display = ''; });
      showToast('筛选已重置', 'success');
    },

    filterLaw: function() { this._filterTable('tab-law'); },
    resetLawFilter: function() { this._resetFilter('tab-law'); },
    filterRule: function() { this._filterTable('tab-rule'); },
    resetRuleFilter: function() { this._resetFilter('tab-rule'); },

    toggleAllCheck: function(tableId) {
      var table = document.getElementById(tableId);
      if (!table) return;
      var headerCb = table.querySelector('thead input[type="checkbox"]');
      var rows = table.querySelectorAll('tbody .row-check');
      rows.forEach(function(cb) { cb.checked = headerCb.checked; });
    },

    deleteReg: function(id) {
      var key = String(id || '').replace(/'/g, '');
      showConfirm('确定删除该记录？', function() {
        var rows = document.querySelectorAll('tbody tr');
        for (var i = 0; i < rows.length; i++) {
          var cb = rows[i].querySelector('.row-check');
          if (cb && cb.value === key) { rows[i].remove(); break; }
        }
        showToast('已删除', 'success');
      });
    },

    batchDeleteReg: function(tab) {
      var tableId = tab === 'rule' ? 'rule-table' : 'law-table';
      var table = document.getElementById(tableId);
      if (!table) return;
      var checked = table.querySelectorAll('tbody .row-check:checked');
      if (checked.length === 0) { showToast('请先选择记录', 'info'); return; }
      showConfirm('确定删除选中的 ' + checked.length + ' 条记录？', function() {
        checked.forEach(function(cb) { cb.closest('tr').remove(); });
        var headerCb = table.querySelector('thead input[type="checkbox"]');
        if (headerCb) headerCb.checked = false;
        showToast('已删除 ' + checked.length + ' 条记录', 'success');
      });
    },

    removeUploadFile: function(btn, param) {
      var item = btn.closest('.upload-file-item');
      if (item) item.remove();
    }
  };

  window.RegulationLogic = RegulationLogic;

  document.addEventListener('DOMContentLoaded', function() {
    RegulationLogic.init();
  });
})();
