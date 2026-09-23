export default class ProfileMenu {
  constructor({ user, container }) {
    this.user = user || { name: 'Guest User', role: 'GUEST', id: 'G-001', avatar: '' };
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.isOpen = false;
    
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  open() {
    this.isOpen = true;
    this.render();
    document.addEventListener('click', this.handleOutsideClick);
  }

  close() {
    this.isOpen = false;
    this.render();
    document.removeEventListener('click', this.handleOutsideClick);
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  handleOutsideClick(e) {
    if (this.container && !this.container.contains(e.target)) {
      this.close();
    }
  }

  render() {
    if (!this.container) return;

    if (!this.isOpen) {
      this.container.innerHTML = '';
      return;
    }

    const avatarUrl = this.user.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(this.user.name)}&background=random\`;

    const html = \`
      <div class="absolute right-4 top-16 z-50 w-64 bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--border)] overflow-hidden animate-fade-in-down origin-top-right">
        <!-- Header -->
        <div class="p-4 border-b border-[var(--border)] bg-[var(--bg)]">
          <div class="flex items-center gap-3">
            <img src="\${avatarUrl}" alt="Avatar" class="w-12 h-12 rounded-full border-2 border-[var(--surface)] shadow-sm object-cover">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-[var(--text)] truncate">\${this.user.name}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)]">\${this.user.role}</span>
                <span class="text-xs text-[var(--text-secondary)] truncate">#\${this.user.id}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="p-2">
          <a href="/profile.html" class="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text)] rounded-lg hover:bg-[var(--bg)] transition-colors">
            <i data-lucide="user" class="w-4 h-4 text-[var(--text-secondary)]"></i>
            My Profile
          </a>
          <a href="/notifications.html" class="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text)] rounded-lg hover:bg-[var(--bg)] transition-colors">
            <i data-lucide="bell" class="w-4 h-4 text-[var(--text-secondary)]"></i>
            Notifications
            <span class="ml-auto bg-[var(--primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </a>
          <a href="/settings.html" class="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text)] rounded-lg hover:bg-[var(--bg)] transition-colors">
            <i data-lucide="settings" class="w-4 h-4 text-[var(--text-secondary)]"></i>
            Settings
          </a>
          <div class="h-px bg-[var(--border)] my-2"></div>
          <button id="logout-btn" class="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--danger)] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            Logout
          </button>
        </div>
      </div>
    \`;

    this.container.innerHTML = html;
    
    if (window.lucide) {
      lucide.createIcons();
    }

    const logoutBtn = this.container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Handle logout
        console.log('Logout clicked');
        // Example: window.location.href = '/login.html';
      });
    }
  }
}
