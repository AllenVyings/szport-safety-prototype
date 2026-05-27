/**
 * iframe 通信桥接 — 子页面使用
 *
 * 消息协议：
 *   子→父 { type: 'navigate', menuId: 'xxx' }        — 请求父页面跳转
 *   子→父 { type: 'setTitle', title: '页面标题' }     — 更新浏览器标题
 *   子→父 { type: 'setBreadcrumb', items: [...] }     — 更新面包屑
 *   子→父 { type: 'notify', msg: '...', level: '...' } — 请求父页面通知
 *   父→子 { type: 'navigate', menuId: 'xxx' }        — 父页面导航指令
 *   父→子 { type: 'theme', mode: 'light'|'dark' }    — 主题切换
 *
 * 用法：模块 HTML 中引入
 *   <script src="../../js/iframe-bridge.js"></script>
 */

var IFrameBridge = {
  _handlers: {},

  /** 向父窗口发送消息 */
  send: function(type, data) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(Object.assign({ type: type }, data || {}), '*');
    }
  },

  /** 请求父页面导航到指定菜单 */
  navigate: function(menuId) {
    this.send('navigate', { menuId: menuId });
  },

  /** 更新浏览器标题 */
  setTitle: function(title) {
    this.send('setTitle', { title: title });
  },

  /** 更新面包屑 */
  setBreadcrumb: function(items) {
    this.send('setBreadcrumb', { items: items });
  },

  /** 请求父页面显示通知 */
  notify: function(msg, level) {
    this.send('notify', { msg: msg, level: level || 'info' });
  },

  /** 注册父页面消息处理器 */
  on: function(type, handler) {
    if (!this._handlers[type]) this._handlers[type] = [];
    this._handlers[type].push(handler);
  },

  /** 移除消息处理器 */
  off: function(type, handler) {
    if (!this._handlers[type]) return;
    this._handlers[type] = this._handlers[type].filter(function(h) { return h !== handler; });
  }
};

// 自动监听来自父页面的消息
window.addEventListener('message', function(e) {
  if (!e.data || !e.data.type) return;
  var handlers = IFrameBridge._handlers[e.data.type];
  if (handlers) {
    handlers.forEach(function(h) { h(e.data); });
  }
});
