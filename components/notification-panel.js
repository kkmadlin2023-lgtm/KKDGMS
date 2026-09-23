import { timeAgo } from '../js/utils/date.utils.js';

export default class NotificationPanel {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.isOpen = false;
    this.notifications = [];
    this.unreadCount = 0;
  }

  setNotifications(notifications) {
    this.notifications = notifications;
    this.updateCount();
    if (this.isOpen) this.renderPanel();
  }

  addNotification(notif) {
    this.notifications.unshift(notif);
    this.updateCount();
    if (this.isOpen) this.renderPanel();
  }

  updateCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    // Notify external badge if needed
  }

  markAsRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.updateCount();
      this.renderPanel();
    }
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.updateCount();
    this.renderPanel();
  }

  open() {
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    this.render();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  renderPanel() {
    const panel = this.container.querySelector('.notification-panel-content');
    if (!panel) return;

    if (this.notifications.length === 0) {
      panel.innerHTML = \`
        <div class="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] p-8">
          <i data-lucide="bell-off" class="w-12 h-12 mb-4 opacity-50"></i>
          <p class="text-sm font-medium">No notifications yet</p>
          <p class="text-xs mt-1">We'll notify you when something arrives.</p>
        </div>
      \`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const listHtml = this.notifications.map(n => {
      const priorityColors = {
        high: 'bg-[var(--danger)]',
        medium: 'bg-[var(--warning)]',
        low: 'bg-[var(--primary)]',
        success: 'bg-[var(--success)]'
      };
      const pColor = priorityColors[n.priority || 'low'] || priorityColors.low;

      return \`
        <div class="p-4 border-b border-[var(--border)] hover:bg-[var(--bg)] transition-colors cursor-pointer \${!n.read ? 'bg-[var(--bg)]/50' : ''}" data-id="\${n.id}">
          <div class="flex gap-3">
            <div class="flex-shrink-0 mt-1">
              <div class="w-2 h-2 rounded-full \${pColor} \${!n.read ? '' : 'opacity-0'}"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[var(--text)]">\${n.sender}</p>
              <p class="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">\${n.message}</p>
              <p class="text-xs text-[var(--text-secondary)] mt-1.5 flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i>
                \${timeAgo(new Date(n.timestamp))}
              </p>
            </div>
          </div>
        </div>
      \`;
    }).join('');

    panel.innerHTML = listHtml;
    
    if (window.lucide) lucide.createIcons();

    const items = panel.querySelectorAll('[data-id]');
    items.forEach(item => {
      item.addEventListener('click', () => {
        this.markAsRead(item.getAttribute('data-id'));
      });
    });
  }

  render() {
    if (!this.container) return;

    if (!this.isOpen) {
      this.container.innerHTML = '';
      return;
    }

    const html = \`
      <div class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm notification-backdrop"></div>
      <div class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[var(--surface)] shadow-2xl border-l border-[var(--border)] flex flex-col transform transition-transform duration-300">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-[var(--text)]">Notifications</h2>
            \${this.unreadCount > 0 ? \`<span class="bg-[var(--primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">\${this.unreadCount}</span>\` : ''}
          </div>
          <div class="flex items-center gap-2">
            \${this.unreadCount > 0 ? \`<button class="text-xs font-medium text-[var(--primary)] hover:underline mark-all-read">Mark all as read</button>\` : ''}
            <button class="text-[var(--text-secondary)] hover:text-[var(--text)] close-panel p-1 rounded-md hover:bg-[var(--bg)]">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto notification-panel-content custom-scrollbar">
          <!-- Populated by renderPanel -->
        </div>
        
        <!-- Footer -->
        <div class="p-3 border-t border-[var(--border)] bg-[var(--bg)]">
          <a href="/notifications.html" class="block w-full text-center text-sm font-medium text-[var(--primary)] hover:underline py-1">View all notifications</a>
        </div>
      </div>
    \`;

    this.container.innerHTML = html;

    const backdrop = this.container.querySelector('.notification-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    const closeBtn = this.container.querySelector('.close-panel');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const markAllBtn = this.container.querySelector('.mark-all-read');
    if (markAllBtn) markAllBtn.addEventListener('click', () => this.markAllRead());

    this.renderPanel();
  }
}
