/**
 * 深圳港集团安全综合管理系统 V2.0 - 路由与应用核心
 */

const App = {
  currentModule: null,

  init() {
    this.renderSidebar();
    this.bindEvents();
    // 默认加载第一个菜单
    const first = MENU_CONFIG[0];
    if (first.children) {
      this.navigate(first.children[0].id);
    } else {
      this.navigate(first.id);
    }
  },

  renderSidebar() {
    const container = document.getElementById('sidebarMenu');
    container.innerHTML = '';

    MENU_CONFIG.forEach(item => {
      if (item.children) {
        // 带子菜单的分组
        const group = document.createElement('div');
        group.className = 'sidebar-group';
        group.dataset.groupId = item.id;

        const parent = document.createElement('div');
        parent.className = 'sidebar-item';
        parent.dataset.menuId = item.id;
        parent.innerHTML = `
          <span class="item-icon">${item.icon}</span>
          <span class="item-text">${item.name}</span>
          <span class="item-arrow">▶</span>
        `;

        const childrenWrap = document.createElement('div');
        childrenWrap.className = 'sidebar-group-children';

        item.children.forEach(child => {
          if (child.children) {
            const subGroup = document.createElement('div');
            subGroup.className = 'sidebar-sub-group';

            const subParent = document.createElement('div');
            subParent.className = 'sidebar-sub-item sidebar-sub-parent';
            subParent.innerHTML = `
              <span class="sub-item-text">${child.name}</span>
              <span class="sub-item-arrow">▶</span>
            `;

            const subChildrenWrap = document.createElement('div');
            subChildrenWrap.className = 'sidebar-sub-group-children';

            child.children.forEach(grandchild => {
              const subSub = document.createElement('div');
              subSub.className = 'sidebar-sub-sub-item';
              subSub.dataset.menuId = grandchild.id;
              subSub.textContent = grandchild.name;
              subSub.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigate(grandchild.id);
              });
              subChildrenWrap.appendChild(subSub);
            });

            subParent.addEventListener('click', (e) => {
              e.stopPropagation();
              this.toggleSubGroup(e.currentTarget);
            });

            subGroup.appendChild(subParent);
            subGroup.appendChild(subChildrenWrap);
            childrenWrap.appendChild(subGroup);
          } else {
            const sub = document.createElement('div');
            sub.className = 'sidebar-sub-item';
            sub.dataset.menuId = child.id;
            sub.textContent = child.name;
            sub.addEventListener('click', (e) => {
              e.stopPropagation();
              this.navigate(child.id);
            });
            childrenWrap.appendChild(sub);
          }
        });

        parent.addEventListener('click', () => {
          this.toggleGroup(item.id);
        });

        group.appendChild(parent);
        group.appendChild(childrenWrap);
        container.appendChild(group);
      } else {
        // 无子菜单的单项
        const el = document.createElement('div');
        el.className = 'sidebar-item';
        el.dataset.menuId = item.id;
        el.innerHTML = `
          <span class="item-icon">${item.icon}</span>
          <span class="item-text">${item.name}</span>
          ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
        `;
        el.addEventListener('click', () => this.navigate(item.id));
        container.appendChild(el);
      }
    });
  },

  toggleGroup(groupId) {
    const group = document.querySelector(`[data-group-id="${groupId}"]`);
    if (!group) return;
    const parent = group.querySelector('.sidebar-item');
    const children = group.querySelector('.sidebar-group-children');
    const isOpen = children.classList.contains('open');

    // 关闭其他展开的组
    document.querySelectorAll('.sidebar-group-children.open').forEach(el => {
      el.classList.remove('open');
      el.parentElement.querySelector('.sidebar-item').classList.remove('expanded');
    });

    if (!isOpen) {
      children.classList.add('open');
      parent.classList.add('expanded');
    }
  },

  toggleSubGroup(subParentEl) {
    const subGroup = subParentEl.closest('.sidebar-sub-group');
    if (!subGroup) return;
    const children = subGroup.querySelector('.sidebar-sub-group-children');
    const isOpen = children.classList.contains('open');

    if (!isOpen) {
      children.classList.add('open');
      subParentEl.classList.add('expanded');
    } else {
      children.classList.remove('open');
      subParentEl.classList.remove('expanded');
    }
  },

  navigate(menuId) {
    const item = findMenuItem(menuId);
    if (!item) return;

    this.currentModule = menuId;

    // 更新侧边栏选中状态
    document.querySelectorAll('.sidebar-item.active, .sidebar-sub-item.active, .sidebar-sub-sub-item.active').forEach(el => {
      el.classList.remove('active');
    });

    const subSubEl = document.querySelector(`.sidebar-sub-sub-item[data-menu-id="${menuId}"]`);
    if (subSubEl) {
      subSubEl.classList.add('active');
      // 确保父组和祖组展开
      const subGroup = subSubEl.closest('.sidebar-sub-group');
      if (subGroup) {
        const subChildren = subGroup.querySelector('.sidebar-sub-group-children');
        const subParent = subGroup.querySelector('.sidebar-sub-parent');
        if (!subChildren.classList.contains('open')) {
          subChildren.classList.add('open');
          subParent.classList.add('expanded');
        }
        const parentGroup = subGroup.closest('.sidebar-group');
        if (parentGroup) {
          const parentChildren = parentGroup.querySelector('.sidebar-group-children');
          const parentItem = parentGroup.querySelector('.sidebar-item');
          if (!parentChildren.classList.contains('open')) {
            this.toggleGroup(parentGroup.dataset.groupId);
          }
          parentItem.classList.add('active');
        }
      }
    } else {
      const subEl = document.querySelector(`.sidebar-sub-item[data-menu-id="${menuId}"]`);
      if (subEl) {
        subEl.classList.add('active');
        const group = subEl.closest('.sidebar-group');
        if (group) {
          const children = group.querySelector('.sidebar-group-children');
          const parent = group.querySelector('.sidebar-item');
          if (!children.classList.contains('open')) {
            document.querySelectorAll('.sidebar-group-children.open').forEach(el => {
              el.classList.remove('open');
              el.parentElement.querySelector('.sidebar-item').classList.remove('expanded');
            });
            children.classList.add('open');
            parent.classList.add('expanded');
          }
          parent.classList.add('active');
        }
      } else {
        const el = document.querySelector(`.sidebar-item[data-menu-id="${menuId}"]`);
        if (el) el.classList.add('active');
      }
    }

    // 更新面包屑
    this.updateBreadcrumb(menuId);

    // 加载模块内容
    this.loadModule(item);
  },

  updateBreadcrumb(menuId) {
    const breadcrumb = getBreadcrumb(menuId);
    const container = document.getElementById('breadcrumb');
    container.innerHTML = breadcrumb.map((item, i) => {
      if (i === breadcrumb.length - 1) {
        return `<span class="breadcrumb-current">${item.name}</span>`;
      }
      return `${item.name}<span>/</span>`;
    }).join('');
  },

  async loadModule(item) {
    const contentFrame = document.getElementById('contentFrame');
    if (!contentFrame) return;
    const sep = item.path.includes('?') ? '&' : '?';
    const url = item.path + sep + '_t=' + Date.now();

    /* file:// 下 Chrome 会拦截 iframe 加载本地子页面，改用 fetch + document.write */
    if (location.protocol === 'file:') {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const html = await res.text();
        const doc = contentFrame.contentDocument || contentFrame.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        document.body.classList.add('loaded');
        return;
      } catch (err) {
        console.warn('[原型] file:// 加载模块失败，请用本地 HTTP 服务打开 index.html：', err);
        this.showFileProtocolHint();
      }
    }

    contentFrame.src = url;
  },

  showFileProtocolHint() {
    let el = document.getElementById('file-protocol-hint');
    if (el) return;
    el = document.createElement('div');
    el.id = 'file-protocol-hint';
    el.setAttribute('role', 'alert');
    el.style.cssText = 'margin:12px 20px;padding:10px 14px;font-size:13px;line-height:1.5;color:#ad6800;background:#fffbe6;border:1px solid #ffe58f;border-radius:6px;';
    el.textContent = '当前为本地文件方式打开（file://），浏览器可能禁止 iframe 加载子页面。请在「05-原型V2.0」目录执行：npx --yes serve -p 5173 ，然后访问 http://localhost:5173/index.html';
    const main = document.querySelector('.main-content');
    if (main) main.insertBefore(el, main.firstChild);
  },

  bindEvents() {
    // iframe 加载完成
    const contentFrame = document.getElementById('contentFrame');
    contentFrame.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });

    // 监听子页面 postMessage
    window.addEventListener('message', (e) => {
      if (!e.data || !e.data.type) return;
      switch (e.data.type) {
        case 'navigate':
          if (e.data.menuId) this.navigate(e.data.menuId);
          break;
        case 'setTitle':
          if (e.data.title) document.title = e.data.title + ' - 深圳港集团安全综合管理系统';
          break;
        case 'setBreadcrumb':
          if (e.data.items) {
            const container = document.getElementById('breadcrumb');
            container.innerHTML = e.data.items.map((item, i) => {
              if (i === e.data.items.length - 1) {
                return `<span class="breadcrumb-current">${item}</span>`;
              }
              return `${item}<span>/</span>`;
            }).join('');
          }
          break;
        case 'notify':
          // 原型模式下用 alert 替代，正式开发换为通知组件
          console.log('[notify]', e.data.level, e.data.msg);
          break;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (location.protocol === 'file:') {
    App.showFileProtocolHint();
  }
  App.init();
});

if (typeof window !== 'undefined') {
  window.App = App;
}
