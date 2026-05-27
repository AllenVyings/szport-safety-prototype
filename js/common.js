/**
 * 深圳港集团安全综合管理系统 V2.0 - 公共工具库
 * 统一弹窗控制、Toast 提示、遮罩关闭等常用交互
 *
 * 使用方式：在模块 HTML 中引入
 *   <link rel="stylesheet" href="../../css/variables.css">
 *   <link rel="stylesheet" href="../../css/framework.css">
 *   <script src="../../js/common.js"></script>
 */

/**
 * 显示弹窗
 * 兼容两种弹窗模式：
 *   - style.display: 'flex' / 'block'（主流模式）
 *   - classList.add('show')（少数模块）
 */
function showModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  /* .modal-overlay 在 framework.css 中依赖 flex 居中；勿写成 block 否则会顶对齐 */
  if (el.classList.contains('modal-overlay')) {
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
  } else {
    var isFlex = el.style.alignItems || el.style.justifyContent;
    el.style.display = isFlex ? 'flex' : 'block';
  }
  el.classList.add('show');
}

/** 兼容各模块内联 onclick 与 logic 中的 openModal 调用 */
function openModal(id) {
  showModal(id);
}

/**
 * 隐藏弹窗
 * 兼容 style.display 和 classList 两种模式
 */
function closeModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.classList.remove('show');
}

function hideModal(id) {
  closeModal(id);
}

/**
 * 点击遮罩层关闭弹窗
 * 在 DOMContentLoaded 后自动绑定所有 .modal-overlay
 */
function bindOverlayClose() {
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('show');
      }
    });
  });
}

/**
 * Toast 提示
 * @param {string} msg - 提示内容
 * @param {string} type - 类型：success / error / warning / info
 * @param {number} duration - 显示时长(ms)，默认 2000
 */
function showToast(msg, type, duration) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.style.display = 'none';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast toast-' + (type || 'info');
  toast.style.display = 'block';
  setTimeout(function() { toast.style.display = 'none'; }, duration || 2000);
}

/**
 * 确认弹窗（替代 alert/confirm）
 * @param {string} msg - 提示内容
 * @param {function} onConfirm - 确认回调
 */
function showConfirm(msg, onConfirm) {
  var overlay = document.getElementById('modal-confirm');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-confirm';
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = '<div class="modal" style="width:400px;"><div class="modal-header"><h3 class="modal-title">确认</h3><button class="modal-close" onclick="closeModal(\'modal-confirm\')">&times;</button></div><div class="modal-body"><p id="confirm-msg" style="font-size:14px;"></p></div><div class="modal-footer"><button class="btn btn-default btn-sm" onclick="closeModal(\'modal-confirm\')">取消</button><button class="btn btn-primary btn-sm" id="confirm-ok-btn">确定</button></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  }
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-ok-btn').onclick = function() {
    closeModal('modal-confirm');
    if (onConfirm) onConfirm();
  };
  showModal('modal-confirm');
}

// 自动绑定遮罩关闭
document.addEventListener('DOMContentLoaded', bindOverlayClose);

/**
 * 事件委托：data-action 交互模式
 * 新页面推荐使用 data-action="fnName" data-param="xxx" 替代 onclick
 * 自动绑定在 DOMContentLoaded，支持动态内容
 */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-action]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var param = target.getAttribute('data-param');
    if (typeof window[action] === 'function') {
      window[action](param, e);
    }
  });
});

/** L-01：切换列表/详情视图 */
function setPageView(listId, detailId, mode) {
  var listEl = document.getElementById(listId || 'view-list');
  var detailEl = document.getElementById(detailId || 'view-detail');
  if (!listEl || !detailEl) return;
  if (mode === 'detail') {
    listEl.classList.remove('active');
    detailEl.classList.add('active');
  } else {
    detailEl.classList.remove('active');
    listEl.classList.add('active');
  }
  window.scrollTo(0, 0);
}
window.setPageView = setPageView;

/** L-03：渲染办理时间轴 */
function renderApprovalTimeline(containerId, steps, emptyId) {
  var el = document.getElementById(containerId);
  var emptyEl = emptyId ? document.getElementById(emptyId) : null;
  if (!el) return;
  if (!steps || !steps.length) {
    el.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  el.innerHTML = steps.map(function(s) {
    var cls = s.status || 'pending';
    return '<div class="timeline-item ' + cls + '"><div class="time">' + (s.time || '') + '</div><div class="event">' + (s.event || '') + '</div></div>';
  }).join('');
}
window.renderApprovalTimeline = renderApprovalTimeline;

/**
 * 主列表：溢出单元格悬停显示全文（跳过复选框/操作列）
 * @param {Document|Element} [scope]
 */
function bindTableCellTitles(scope) {
  var root = scope || document;
  root.querySelectorAll('.table-wrap .data-table tbody td, .org-table-wrap .data-table tbody td').forEach(function(td) {
    if (td.classList.contains('col-check') || td.classList.contains('col-actions') || td.classList.contains('cell-actions')) {
      td.removeAttribute('title');
      return;
    }
    if (td.querySelector('.cell-actions, .btn-text, button, a')) {
      td.removeAttribute('title');
      return;
    }
    var text = (td.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      td.removeAttribute('title');
      return;
    }
    if (td.scrollWidth > td.clientWidth + 1) {
      td.setAttribute('title', text);
    } else {
      td.removeAttribute('title');
    }
  });
}

var _tableTitleTimer = null;
function scheduleTableCellTitles() {
  if (_tableTitleTimer) clearTimeout(_tableTitleTimer);
  _tableTitleTimer = setTimeout(bindTableCellTitles, 50);
}

function observeTableWraps() {
  document.querySelectorAll('.table-wrap, .org-table-wrap .table-scroll').forEach(function(wrap) {
    if (wrap._titleObserved) return;
    wrap._titleObserved = true;
    try {
      var obs = new MutationObserver(function() {
        scheduleTableCellTitles();
      });
      obs.observe(wrap, { childList: true, subtree: true, characterData: true });
    } catch (e) { /* ignore */ }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  scheduleTableCellTitles();
  observeTableWraps();
});
window.addEventListener('resize', scheduleTableCellTitles);
window.bindTableCellTitles = bindTableCellTitles;
window.scheduleTableCellTitles = scheduleTableCellTitles;