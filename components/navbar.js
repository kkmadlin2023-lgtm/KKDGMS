export default class Navbar {
  constructor({ title = 'Dashboard', breadcrumbs = [], container }) {
    this.title = title;
    this.breadcrumbs = breadcrumbs;
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    // Callbacks
    this.onMenuToggle = () => {};
    this.onSearch = () => {};
    this.onNotificationClick = () => {};
    this.onProfileClick = () => {};
  }

  renderBreadcrumbs() {
    if (!this.breadcrumbs || this.breadcrumbs.length === 0) return '';
    
    return \`
      <nav class="hidden sm:flex text-sm font-medium text-[var(--text-secondary)] mb-1" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
          \${this.breadcrumbs.map((crumb, idx) => \`
            <li class="inline-flex items-center">
              \${idx > 0 ? '<i data-lucide="chevron-right" class="w-4 h-4 mx-1"></i>' : ''}
              <a href="\${crumb.href || '#'}" class="inline-flex items-center hover:text-[var(--text)] transition-colors \${idx === this.breadcrumbs.length - 1 ? 'text-[var(--text)]' : ''}">
                \${crumb.label}
              </a>
            </li>
          \`).join('')}
        </ol>
      </nav>
    \`;
  }

  render() {
    if (!this.container) return;

    const html = \`
      <header class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 shadow-sm">
        <div class="flex items-center gap-4">
          <button id="navbar-menu-toggle" class="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] rounded-lg p-1">
            <span class="sr-only">Open sidebar</span>
            <i data-lucide="menu" class="w-6 h-6"></i>
          </button>
          
          <div class="flex flex-col">
            \${this.renderBreadcrumbs()}
            <h1 class="text-xl font-bold text-[var(--text)] tracking-tight leading-none">\${this.title}</h1>
          </div>
        </div>
        
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Search Box -->
          <div class="hidden md:flex relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i data-lucide="search" class="w-4 h-4 text-[var(--text-secondary)]"></i>
            </div>
            <input type="text" id="navbar-search" class="bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full pl-10 p-2" placeholder="Search...">
          </div>
          
          <button class="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--bg)] rounded-full">
            <i data-lucide="search" class="w-5 h-5"></i>
          </button>

          <!-- Notification Bell -->
          <button id="navbar-notification-btn" class="relative p-2 text-[var(--text-secondary)] hover:bg-[var(--bg)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
            <span class="sr-only">View notifications</span>
            <i data-lucide="bell" class="w-5 h-5"></i>
            <div class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--danger)] rounded-full border-2 border-[var(--surface)]"></div>
          </button>

          <!-- Theme Toggle (Optional, can be placed here) -->
          
          <!-- Profile Menu Trigger -->
          <button id="navbar-profile-btn" class="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
            <img class="w-8 h-8 rounded-full object-cover border border-[var(--border)]" src="https://ui-avatars.com/api/?name=User&background=random" alt="User avatar">
            <i data-lucide="chevron-down" class="w-4 h-4 text-[var(--text-secondary)] hidden sm:block"></i>
          </button>
        </div>
      </header>
    \`;

    this.container.innerHTML = html;
    
    if (window.lucide) {
      lucide.createIcons();
    }

    // Attach Event Listeners
    const menuToggle = this.container.querySelector('#navbar-menu-toggle');
    if (menuToggle) menuToggle.addEventListener('click', (e) => this.onMenuToggle(e));

    const searchInput = this.container.querySelector('#navbar-search');
    if (searchInput) searchInput.addEventListener('input', (e) => this.onSearch(e.target.value));

    const notifBtn = this.container.querySelector('#navbar-notification-btn');
    if (notifBtn) notifBtn.addEventListener('click', (e) => this.onNotificationClick(e));

    const profileBtn = this.container.querySelector('#navbar-profile-btn');
    if (profileBtn) profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onProfileClick(e);
    });
  }
}
