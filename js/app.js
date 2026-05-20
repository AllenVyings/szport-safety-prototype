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
          const sub = document.createElement('div');
          sub.className = 'sidebar-sub-item';
          sub.dataset.menuId = child.id;
          sub.textContent = child.name;
          sub.addEventListener('click', (e) => {
            e.stopPropagation();
            this.navigate(child.id);
          });
          childrenWrap.appendChild(sub);
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

  navigate(menuId) {
    const item = findMenuItem(menuId);
    if (!item) return;

    this.currentModule = menuId;

    // 更新侧边栏选中状态
    document.querySelectorAll('.sidebar-item.active, .sidebar-sub-item.active').forEach(el => {
      el.classList.remove('active');
    });

    const subEl = document.querySelector(`.sidebar-sub-item[data-menu-id="${menuId}"]`);
    if (subEl) {
      subEl.classList.add('active');
      // 确保父组展开
      const group = subEl.closest('.sidebar-group');
      if (group) {
        const children = group.querySelector('.sidebar-group-children');
        const parent = group.querySelector('.sidebar-item');
        if (!children.classList.contains('open')) {
          // 关闭其他组
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
    const sep = item.path.includes('?') ? '&' : '?';
    contentFrame.src = item.path + sep + '_t=' + Date.now();
  },

  bindEvents() {
    // iframe 加载完成
    const contentFrame = document.getElementById('contentFrame');
    contentFrame.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
