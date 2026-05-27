/**
 * contractor.html - 弹窗模板（自动提取）
 */
(function() {
  var html = `
  <!-- ==================== 新增相关方单位弹窗 ==================== -->
  <div id="modal-new-unit" class="modal-overlay">
    <div class="modal" style="width:640px;">
      <div class="modal-header">
        <div>新增相关方单位</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-new-unit">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>单位名称</label>
            <div class="form-content"><input class="form-input" id="nu-name" placeholder="请输入单位全称"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>统一社会信用代码</label>
            <div class="form-content"><input class="form-input" id="nu-credit" placeholder="18位信用代码"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>服务类型</label>
            <div class="form-content">
              <select class="form-input form-select" id="nu-type">
                <option value="">请选择</option>
                <option>工程施工</option>
                <option>安保服务</option>
                <option>设备检修</option>
                <option>物业管理</option>
                <option>其他</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>法定代表人</label>
            <div class="form-content"><input class="form-input" id="nu-legal" placeholder="法定代表人姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>安全负责人</label>
            <div class="form-content"><input class="form-input" id="nu-safety" placeholder="安全负责人姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label">联系电话</label>
            <div class="form-content"><input class="form-input" id="nu-phone" placeholder="联系电话"></div>
          </div>
          <div class="form-group">
            <label class="form-label">合同起始日期</label>
            <div class="form-content"><input class="form-input" id="nu-contract-start" type="date"></div>
          </div>
          <div class="form-group">
            <label class="form-label">合同结束日期</label>
            <div class="form-content"><input class="form-input" id="nu-contract-end" type="date"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">资质附件</label>
          <div class="form-content">
            <div style="border:1px dashed var(--border);border-radius:var(--radius-md);padding:16px;text-align:center;cursor:pointer;" data-action="triggerFileUpload" data-param="nu-file">
              <div style="font-size:var(--font-size-13);color:var(--text-secondary);">点击上传营业执照、资质证书等</div>
              <input type="file" id="nu-file" style="display:none" accept=".pdf,.jpg,.png">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-new-unit">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitNewUnit">提交审批</button>
      </div>
    </div>
  </div>

  <!-- ==================== 审批弹窗 ==================== -->
  <div id="modal-approval" class="modal-overlay">
    <div class="modal" style="width:480px;">
      <div class="modal-header">
        <div>准入审批</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-approval">&times;</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:16px;font-size:var(--font-size-13);color:var(--text-secondary);">审批单位：<strong style="color:var(--text-primary);">鹏程建设工程</strong></div>
        <div class="form-group">
          <label class="form-label"><span class="required">*</span>审批意见</label>
          <div class="form-content">
            <select class="form-input form-select" id="approval-result">
              <option value="">请选择</option>
              <option>通过</option>
              <option>退回</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">审批说明</label>
          <div class="form-content"><textarea class="form-input" id="approval-note" style="height:80px;padding:8px 12px;resize:vertical;" placeholder="填写审批说明（退回时必填）"></textarea></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-approval">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitApproval">确认</button>
      </div>
    </div>
  </div>

  <!-- ==================== 批量导入弹窗 ==================== -->
  <div id="modal-import" class="modal-overlay">
    <div class="modal" style="width:480px;">
      <div class="modal-header">
        <div>批量导入人员</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-import">&times;</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:16px;">
          <button class="btn btn-default btn-sm" data-action="showToastMsg" data-param="下载导入模板（原型演示）">下载导入模板</button>
        </div>
        <div class="form-group">
          <label class="form-label">选择所属单位</label>
          <div class="form-content">
            <select class="form-input form-select" id="import-unit">
              <option>中交二航局</option>
              <option>海盾安防</option>
              <option>华能检修公司</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">上传文件</label>
          <div class="form-content">
            <div style="border:1px dashed var(--border);border-radius:var(--radius-md);padding:16px;text-align:center;cursor:pointer;" data-action="triggerFileUpload" data-param="import-file">
              <div style="font-size:var(--font-size-13);color:var(--text-secondary);">点击上传 Excel 文件</div>
              <div style="font-size:var(--font-size-12);color:var(--text-description);margin-top:4px;">支持 .xlsx 格式，单次最多 200 条</div>
              <input type="file" id="import-file" style="display:none" accept=".xlsx,.xls">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-import">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitImport">开始导入</button>
      </div>
    </div>
  </div>

  <!-- ==================== 退场确认弹窗 ==================== -->
  <div id="modal-exit-confirm" class="modal-overlay">
    <div class="modal" style="width:480px;">
      <div class="modal-header">
        <div>退场确认</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-exit-confirm">&times;</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:16px;font-size:var(--font-size-13);color:var(--text-secondary);">退场单位：<strong style="color:var(--text-primary);" id="exit-unit-name">-</strong></div>
        <div class="form-group">
          <label class="form-label"><span class="required">*</span>退场原因</label>
          <div class="form-content"><textarea class="form-input" id="exit-reason" style="height:100px;padding:8px 12px;resize:vertical;" placeholder="请填写退场原因"></textarea></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-exit-confirm">取消</button>
        <button class="btn btn-primary btn-sm" data-action="confirmExit">确认退场</button>
      </div>
    </div>
  </div>

  <!-- ==================== 新增人员弹窗 ==================== -->
  <div id="modal-new-person" class="modal-overlay">
    <div class="modal" style="width:640px;">
      <div class="modal-header">
        <div>新增人员</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-new-person">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>姓名</label>
            <div class="form-content"><input class="form-input" id="np-pname" placeholder="请输入姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>岗位</label>
            <div class="form-content"><input class="form-input" id="np-position" placeholder="请输入岗位"></div>
          </div>
          <div class="form-group">
            <label class="form-label">所属单位</label>
            <div class="form-content">
              <select class="form-input form-select" id="np-unit">
                <option value="">请选择</option>
                <option>中交二航局</option>
                <option>海盾安防</option>
                <option>华能检修公司</option>
                <option>鹏程建设工程</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">联系电话</label>
            <div class="form-content"><input class="form-input" id="np-phone" placeholder="联系电话"></div>
          </div>
          <div class="form-group">
            <label class="form-label">证书类型</label>
            <div class="form-content"><input class="form-input" id="np-cert-type" placeholder="如：焊接作业证"></div>
          </div>
          <div class="form-group">
            <label class="form-label">证书编号</label>
            <div class="form-content"><input class="form-input" id="np-cert-no" placeholder="证书编号"></div>
          </div>
          <div class="form-group">
            <label class="form-label">证书有效期</label>
            <div class="form-content"><input class="form-input" id="np-cert-expire" type="date"></div>
          </div>
          <div class="form-group">
            <label class="form-label">关联项目</label>
            <div class="form-content">
              <select class="form-input form-select" id="np-project">
                <option value="">请选择</option>
                <option>3号泊位改造工程</option>
                <option>散货码头扩建项目</option>
                <option>港区道路修复工程</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">账号到期日</label>
            <div class="form-content"><input class="form-input" id="np-account-expire" type="date"></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-new-person">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitNewPerson">提交审批</button>
      </div>
    </div>
  </div>

  <!-- ==================== 新建代管项目弹窗 ==================== -->
  <div id="modal-new-project" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <div>新建代管项目</div>
        <button class="modal-close" data-action="hideModal" data-param="modal-new-project">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px;">
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>项目名称</label>
            <div class="form-content"><input class="form-input" id="np-name" placeholder="代管项目名称"></div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>甲方（建设单位）</label>
            <div class="form-content">
              <select class="form-input form-select" id="np-owner">
                <option value="">请选择</option>
                <option>集团本部</option>
                <option>集装箱码头公司</option>
                <option>散货码头公司</option>
                <option>物流运输公司</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><span class="required">*</span>代管方（物业单位）</label>
            <div class="form-content">
              <select class="form-input form-select" id="np-property">
                <option value="">请选择</option>
                <option>海盾安保物业</option>
                <option>深港物业</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">项目负责人</label>
            <div class="form-content"><input class="form-input" id="np-manager" placeholder="项目负责人姓名"></div>
          </div>
          <div class="form-group">
            <label class="form-label">项目起始日期</label>
            <div class="form-content"><input class="form-input" id="np-start-date" type="date"></div>
          </div>
          <div class="form-group">
            <label class="form-label">项目结束日期</label>
            <div class="form-content"><input class="form-input" id="np-end-date" type="date"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">项目描述</label>
          <div class="form-content"><textarea class="form-input" id="np-desc" style="height:80px;padding:8px 12px;resize:vertical;" placeholder="请输入项目描述"></textarea></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default btn-sm" data-action="hideModal" data-param="modal-new-project">取消</button>
        <button class="btn btn-primary btn-sm" data-action="submitNewProject">创建项目</button>
      </div>
    </div>
  </div>

  <!-- Toast 容器 -->
  <div class="toast-container" id="toastContainer"></div>
`;
  var container = document.createElement("div");
  container.innerHTML = html;
  while (container.firstElementChild) {
    document.body.appendChild(container.firstElementChild);
  }
})();
