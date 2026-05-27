/**
 * equipment.html - 弹窗模板（自动提取）
 */
(function() {
  var html = `
  <!-- ==================== 到期提醒弹窗（巡检+维保统一） ==================== -->
  <div id="modal-expiry-alert" class="modal-overlay">
    <div class="modal" style="width:720px;">
      <div class="modal-header">
        <div>到期提醒</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-expiry-alert">&times;</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <div style="display:flex;gap:0;border-bottom:1px solid var(--border-light);">
          <div id="expiry-tab-insp" class="expiry-tab active" data-action="switchExpiryTab" data-param="insp">巡检到期 <span class="tag tag-warning" style="font-size:var(--font-size-11);margin-left:4px;">3</span></div>
          <div id="expiry-tab-maint" class="expiry-tab" data-action="switchExpiryTab" data-param="maint">维保到期 <span class="tag tag-error" style="font-size:var(--font-size-11);margin-left:4px;">3</span></div>
        </div>
        <div id="expiry-content-insp" class="expiry-content active">
          <table class="data-table">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>巡检类型</th>
                <th>应检日期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>门机MH-01</td>
                <td>每日巡检</td>
                <td>2026-05-21</td>
                <td><span class="tag tag-error">已逾期</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToInsp">去巡检</button></td>
              </tr>
              <tr>
                <td>岸桥QC-01</td>
                <td>每日巡检</td>
                <td>2026-05-21</td>
                <td><span class="tag tag-warning">待执行</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToInsp">去巡检</button></td>
              </tr>
              <tr>
                <td>门机MH-03</td>
                <td>每日巡检</td>
                <td>2026-05-21</td>
                <td><span class="tag tag-warning">待执行</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToInsp">去巡检</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="expiry-content-maint" class="expiry-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>维保周期</th>
                <th>下次维保日期</th>
                <th>剩余天数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>门机MH-01</td>
                <td>每月</td>
                <td>2026-05-20</td>
                <td><span class="tag tag-error">已逾期1天</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToMaint">去维保</button></td>
              </tr>
              <tr>
                <td>QT-003 电梯</td>
                <td>每半年</td>
                <td>2026-05-22</td>
                <td><span class="tag tag-error">1天</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToMaint">去维保</button></td>
              </tr>
              <tr>
                <td>QT-001 桥式起重机</td>
                <td>每季度</td>
                <td>2026-06-15</td>
                <td><span class="tag tag-warning">25天</span></td>
                <td><button class="btn btn-text btn-sm" data-action="goToMaint">去维保</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-expiry-alert">关闭</button>
      </div>
    </div>
  </div>

  <!-- ==================== 状态变更弹窗 ==================== -->
  <div id="modal-status" class="modal-overlay">
    <div class="modal" style="width:480px;">
      <div class="modal-header">
        <div>变更设备状态</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-status">&times;</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:16px;"><span style="color:var(--text-secondary);font-size:var(--font-size-13);">当前设备：</span><span id="status-eq-name" style="font-weight:600;"></span></div>
        <div class="form-group">
          <label class="form-label"><span class="required">*</span>变更后状态</label>
          <div class="form-content">
            <select class="form-input form-select" id="status-new">
              <option value="">请选择</option>
              <option>正常使用</option>
              <option>维修中</option>
              <option>停用</option>
              <option>拆除报废</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label"><span class="required">*</span>变更原因</label>
          <div class="form-content"><textarea class="form-input" id="status-reason" style="height:80px;padding:8px 12px;resize:vertical;" placeholder="请输入状态变更原因"></textarea></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-status">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitStatusChange">确认变更</button>
      </div>
    </div>
  </div>

  <!-- ==================== 新增维保记录弹窗 ==================== -->
  <div id="modal-maint" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div>新增维保记录</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-maint">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>维保日期</label>
            <div class="form-content"><input class="form-input" id="maint-date" type="date"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>维保类型</label>
            <div class="form-content">
              <select class="form-input form-select" id="maint-type">
                <option value="">请选择</option>
                <option>常规保养</option>
                <option>故障维修</option>
                <option>年度大修</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>维保人员</label>
            <div class="form-content"><input class="form-input" id="maint-person" placeholder="维保人员姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label">费用(元)</label>
            <div class="form-content"><input class="form-input" id="maint-cost" type="number" placeholder="0"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label"><span class="required">*</span>维保内容</label>
          <div class="form-content"><textarea class="form-input" id="maint-content" style="height:80px;padding:8px 12px;resize:vertical;" placeholder="维保项目说明"></textarea></div>
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <div class="form-content"><textarea class="form-input" id="maint-remark" style="height:60px;padding:8px 12px;resize:vertical;" placeholder="其他补充说明"></textarea></div>
        </div>
        <div class="form-group">
          <label class="form-label">附件上传</label>
          <div class="form-content">
            <div style="border:1px dashed var(--border);border-radius:var(--radius-md);padding:16px;text-align:center;cursor:pointer;" data-action="triggerFileUpload" data-param="maint-file">
              <div style="font-size:var(--font-size-13);color:var(--text-secondary);">点击上传维保报告</div>
              <input type="file" id="maint-file" style="display:none" accept=".pdf,.doc,.docx,.jpg,.png">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-maint">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitMaintRecord">保存</button>
      </div>
    </div>
  </div>

  <!-- ==================== 新增巡检记录弹窗 ==================== -->
  <div id="modal-insp" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div>新增巡检记录</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-insp">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>巡检日期</label>
            <div class="form-content"><input class="form-input" id="insp-date" type="date"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>巡检类型</label>
            <div class="form-content">
              <select class="form-input form-select" id="insp-type">
                <option value="">请选择</option>
                <option>日常巡检</option>
                <option>专项巡检</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>巡检人员</label>
            <div class="form-content"><input class="form-input" id="insp-person" placeholder="巡检人员姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label">检查项数</label>
            <div class="form-content"><input class="form-input" id="insp-items" type="number" value="12" placeholder="检查项目数"></div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">异常项数</label>
            <div class="form-content"><input class="form-input" id="insp-abnormal" type="number" value="0" placeholder="0"></div>
          </div>
          <div class="form-group"></div>
        </div>
        <div class="form-group">
          <label class="form-label">巡检说明</label>
          <div class="form-content"><textarea class="form-input" id="insp-note" style="height:60px;padding:8px 12px;resize:vertical;" placeholder="巡检情况说明"></textarea></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-insp">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitInspRecord">保存</button>
      </div>
    </div>
  </div>
`;
  var container = document.createElement("div");
  container.innerHTML = html;
  while (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
})();
