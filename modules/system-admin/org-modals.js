/**
 * org.html - 弹窗模板（自动提取）
 */
(function() {
  var html = `
  <!-- 新增组织弹窗 -->
  <div class="modal-overlay" id="modal-add">
    <div class="modal" style="width:640px;">
      <div class="modal-header">新增组织</div>
      <div class="modal-body">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0 20px;">
          <div class="form-group">
            <div class="form-label"><span class="required">*</span>组织类型</div>
            <div class="form-content" style="display:flex; gap:20px; height:32px; align-items:center;">
              <label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-13); cursor:pointer;"><input type="radio" name="add-type" value="单位" checked> 单位</label>
              <label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-13); cursor:pointer;"><input type="radio" name="add-type" value="部门"> 部门</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label"><span class="required">*</span>上级组织</div>
            <div class="form-content">
              <div class="tree-select-trigger" id="add-parent-trigger" data-action="toggleTreeSelect" data-param="add">
                <span class="tree-select-text" id="add-parent-text">请选择上级组织</span>
                <svg width="12" height="12" viewBox="0 0 12 12" style="flex-shrink:0; color:var(--text-tertiary);"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label"><span class="required">*</span>组织名称</div>
            <div class="form-content"><input class="form-input" id="add-name" placeholder="请输入组织名称"></div>
          </div>
          <div class="form-group">
            <div class="form-label">组织编码</div>
            <div class="form-content"><input class="form-input" id="add-code" placeholder="保存后自动生成" disabled style="background:var(--bg-page); color:var(--text-description);"></div>
          </div>
          <div class="form-group">
            <div class="form-label"><span class="required" id="add-level-required" style="display:inline;">*</span>管控级别</div>
            <div class="form-content"><select class="form-input form-select" id="add-level"><option value="">请选择</option><option value="A级管控">A级管控</option><option value="B级管控">B级管控</option><option value="C级管控">C级管控</option></select></div>
          </div>
          <div class="form-group">
            <div class="form-label"><span class="required">*</span>排序</div>
            <div class="form-content"><input class="form-input" type="number" id="add-sort" min="0" placeholder="请输入排序号"></div>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <div class="form-label">所属区划</div>
            <div class="form-content">
              <div style="display:flex; gap:8px;">
                <select class="form-input form-select" style="flex:1;"><option value="">请选择</option><option>广东省</option></select>
                <select class="form-input form-select" style="flex:1;"><option value="">请选择</option><option>深圳市</option><option>汕尾市</option><option>赣州市</option></select>
                <select class="form-input form-select" style="flex:1;"><option value="">请选择</option><option>南山区</option><option>盐田区</option><option>宝安区</option><option>深汕特别合作区</option></select>
              </div>
            </div>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <div class="form-label">详细地址</div>
            <div class="form-content">
              <div style="display:flex; gap:8px;">
                <input class="form-input" id="add-addr" placeholder="请输入详细地址" style="flex:1;">
                <button class="btn btn-default btn-sm map-pin-btn" data-action="openMapPicker" data-param="add" title="地图选点">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-action="hideModal" data-param="modal-add">取消</button>
        <button class="btn btn-primary">确认新增</button>
      </div>
    </div>
  </div>

  <!-- 编辑组织弹窗（含映射配置 + 脏标记） -->
  <div class="modal-overlay" id="modal-edit">
    <div class="modal" style="width:640px;">
      <div class="modal-header">编辑组织信息</div>
      <div class="modal-body">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0 20px;">
          <div class="form-group">
            <div class="form-label">组织类型</div>
            <div class="form-content" style="display:flex; gap:20px; height:32px; align-items:center;">
              <label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-13); cursor:default; opacity:0.85;"><input type="radio" name="edit-type" value="单位" disabled> 单位</label>
              <label style="display:flex; align-items:center; gap:4px; font-size:var(--font-size-13); cursor:default; opacity:0.85;"><input type="radio" name="edit-type" value="部门" disabled> 部门</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label">上级组织</div>
            <div class="form-content"><input class="form-input" id="edit-parent" disabled style="background:var(--bg-page); color:var(--text-description);"></div>
          </div>
          <div class="form-group">
            <div class="form-label">组织名称 <span class="dirty-dot" id="dirty-name" title="已本地修改"></span></div>
            <div class="form-content"><input class="form-input" id="edit-name"></div>
          </div>
          <div class="form-group">
            <div class="form-label">组织编码</div>
            <div class="form-content"><input class="form-input" id="edit-code" disabled style="background:var(--bg-page); color:var(--text-description);"></div>
          </div>
          <div class="form-group">
            <div class="form-label">管控级别 <span class="dirty-dot" id="dirty-level" title="已本地修改"></span></div>
            <div class="form-content"><select class="form-input form-select" id="edit-level"><option value="">无</option><option value="A级管控">A级管控</option><option value="B级管控">B级管控</option><option value="C级管控">C级管控</option></select></div>
          </div>
          <div class="form-group">
            <div class="form-label">排序 <span class="dirty-dot" id="dirty-sort" title="已本地修改"></span></div>
            <div class="form-content"><input class="form-input" type="number" id="edit-sort" min="0"></div>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <div class="form-label">所属区划 <span class="dirty-dot" id="dirty-region" title="已本地修改"></span></div>
            <div class="form-content">
              <div style="display:flex; gap:8px;">
                <select class="form-input form-select" style="flex:1;"><option>广东省</option></select>
                <select class="form-input form-select" style="flex:1;"><option>深圳市</option></select>
                <select class="form-input form-select" style="flex:1;"><option>南山区</option></select>
              </div>
            </div>
          </div>
          <div class="form-group" style="grid-column:span 2;">
            <div class="form-label">详细地址 <span class="dirty-dot" id="dirty-addr" title="已本地修改"></span></div>
            <div class="form-content">
              <div style="display:flex; gap:8px;">
                <input class="form-input" id="edit-addr" style="flex:1;">
                <button class="btn btn-default btn-sm map-pin-btn" data-action="openMapPicker" data-param="edit" title="地图选点">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-action="hideModal" data-param="modal-edit">取消</button>
        <button class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>

  <!-- 映射配置弹窗 -->
  <div class="modal-overlay" id="modal-mapping" style="z-index:1001;">
    <div class="modal" style="width:560px;">
      <div class="modal-header">源组织映射</div>
      <div class="modal-body">
        <div class="form-group">
          <div class="form-label">组织名称</div>
          <div class="form-content"><input class="form-input" id="mapping-org-name" disabled style="background:var(--bg-page); color:var(--text-primary); font-weight:500;"></div>
        </div>
        <div class="form-group">
          <div class="form-label">源组织机构</div>
          <div class="form-content">
            <div style="position:relative;">
              <div class="mapping-select-trigger" id="mapping-select-trigger" data-action="toggleMappingDropdown">
                <div class="mapping-trigger-tags" id="mapping-trigger-tags"><span class="mapping-placeholder" id="mapping-placeholder">请选择源组织机构</span></div>
                <svg width="12" height="12" viewBox="0 0 12 12" style="flex-shrink:0; color:var(--text-tertiary); margin-top:2px;"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
              </div>
              <div class="mapping-dropdown" id="mapping-dropdown">
                <div class="mapping-dropdown-search">
                  <input class="form-input" id="mapping-search-input" placeholder="搜索源组织..." style="height:28px; font-size:var(--font-size-12);" oninput="filterMappingOptions(this.value)">
                </div>
                <div class="mapping-dropdown-list" id="mapping-dropdown-list"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-action="hideModal" data-param="modal-mapping">取消</button>
        <button class="btn btn-primary" data-action="saveMapping">保存</button>
      </div>
    </div>
  </div>

  <!-- 地图选点弹窗 -->
  <div class="modal-overlay" id="modal-map" style="z-index:1001;">
    <div class="modal" style="width:720px;">
      <div class="modal-header">地图选点</div>
      <div class="modal-body">
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <input class="form-input" id="map-search" placeholder="搜索地址..." style="flex:1; height:32px;">
          <button class="btn btn-primary btn-sm" data-action="searchMapAddress">搜索</button>
        </div>
        <div class="map-container" id="map-container">
          <div class="map-placeholder">
            <div class="map-grid-lines"></div>
            <div class="map-center-pin" id="map-center-pin">
              <svg width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="var(--error)"/><circle cx="14" cy="13" r="5" fill="white"/></svg>
            </div>
            <div class="map-watermark">深圳港区域</div>
          </div>
        </div>
        <div class="map-search-results" id="map-search-results"></div>
        <div class="map-selected-info" id="map-selected-info" style="display:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span id="map-selected-text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-action="hideModal" data-param="modal-map">取消</button>
        <button class="btn btn-primary" data-action="confirmMapAddress">确认选点</button>
      </div>
    </div>
  </div>

  <!-- 删除确认弹窗 -->
  <div class="modal-overlay" id="modal-delete">
    <div class="modal" style="width:480px;">
      <div class="modal-header" id="delete-title">确认删除</div>
      <div class="modal-body" id="delete-content"></div>
      <div class="modal-footer">
        <button class="btn btn-default" data-action="hideModal" data-param="modal-delete">取消</button>
        <button class="btn btn-primary" style="background:var(--error); border-color:var(--error);" id="delete-confirm-btn">确认删除</button>
      </div>
    </div>
  </div>

  <!-- 上级组织树形选择下拉 -->
  <div class="tree-select-dropdown" id="tree-select-dropdown">
    <div class="tree-select-search">
      <input class="form-input" id="tree-select-search-input" placeholder="搜索组织..." style="height:28px; font-size:var(--font-size-12);" oninput="filterTreeSelect(this.value)">
    </div>
    <div class="tree-select-list" id="tree-select-list"></div>
  </div>
`;
  var container = document.createElement("div");
  container.innerHTML = html;
  while (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
})();
