export default class Sidebar {
  constructor({ role, currentPage, container }) {
    this.role = role || 'GUEST';
    this.currentPage = currentPage;
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.isOpen = false;
    this.menus = this.getMenusByRole(this.role);
  }

  getMenusByRole(role) {
    const adminMenus = [
      { icon: 'layout-dashboard', label: 'Dashboard', href: '/admin/dashboard.html' },
      { icon: 'users', label: 'Admissions', href: '#', subItems: [
        { label: 'New Admission', href: '/admin/admissions/new.html' },
        { label: 'View Applications', href: '/admin/admissions/view.html' }
      ]},
      { icon: 'graduation-cap', label: 'Students', href: '/admin/students.html' },
      { icon: 'user-cog', label: 'Faculty', href: '/admin/faculty.html' },
      { icon: 'shield', label: 'Wardens', href: '/admin/wardens.html' },
      { icon: 'wrench', label: 'Technicians', href: '/admin/technicians.html' },
      { icon: 'calendar-check', label: 'Attendance', href: '/admin/attendance.html' },
      { icon: 'calendar-off', label: 'Leave Management', href: '/admin/leave.html' },
      { icon: 'book-open', label: 'Question Bank', href: '/admin/question-bank.html' },
      { icon: 'file-text', label: 'Marksheet', href: '/admin/marksheet.html' },
      { icon: 'laptop', label: 'Online Exams', href: '/admin/online-exams.html' },
      { icon: 'database', label: 'Database', href: '/admin/database.html' },
      { icon: 'history', label: 'Login Activity', href: '/admin/login-activity.html' },
      { icon: 'users-cog', label: 'User Management', href: '/admin/user-management.html' },
      { icon: 'calendar-days', label: 'Faculty Allocation', href: '/admin/faculty-allocation.html' },
      { icon: 'file-badge-2', label: 'Bonafide Generator', href: '/admin/bonafide.html' },
      { icon: 'user-plus', label: 'Visitors', href: '/admin/visitors.html' },
      { icon: 'megaphone', label: 'Announcements', href: '/admin/announcements.html' },
      { icon: 'calendar', label: 'Events', href: '/admin/events.html' },
      { icon: 'image', label: 'Stories', href: '/admin/stories.html' },
      { icon: 'key', label: 'Role Permissions', href: '/admin/role-permissions.html' },
      { icon: 'message-square', label: 'Feedback', href: '/admin/feedback.html' },
      { icon: 'bell', label: 'Notifications', href: '/admin/notifications.html' },
      { icon: 'clock', label: 'Timetable', href: '/admin/timetable.html' },
      { icon: 'folder', label: 'Documents', href: '/admin/documents.html' },
      { icon: 'wallet', label: 'Expenses', href: '/admin/expenses.html' },
      { icon: 'clipboard-list', label: 'Audit Logs', href: '/admin/audit-logs.html' },
      { icon: 'settings', label: 'Settings', href: '/admin/settings.html' }
    ];

    const facultyMenus = [
      { icon: 'layout-dashboard', label: 'Dashboard', href: '/faculty/dashboard.html' },
      { icon: 'users', label: 'My Classes', href: '/faculty/classes.html' },
      { icon: 'graduation-cap', label: 'Students', href: '/faculty/students.html' },
      { icon: 'calendar-check', label: 'Attendance', href: '/faculty/attendance.html' },
      { icon: 'bar-chart', label: 'Attendance Analysis', href: '/faculty/attendance-analysis.html' },
      { icon: 'calendar-off', label: 'Student Leave', href: '/faculty/student-leave.html' },
      { icon: 'calendar-minus', label: 'My Leave', href: '/faculty/my-leave.html' },
      { icon: 'book-open', label: 'Question Bank', href: '/faculty/question-bank.html' },
      { icon: 'file-text', label: 'Marksheet', href: '/faculty/marksheet.html' },
      { icon: 'laptop', label: 'Online Exams', href: '/faculty/online-exams.html' },
      { icon: 'clock', label: 'Timetable', href: '/faculty/timetable.html' },
      { icon: 'megaphone', label: 'Announcements', href: '/faculty/announcements.html' },
      { icon: 'bell', label: 'Notifications', href: '/faculty/notifications.html' },
      { icon: 'user', label: 'Profile', href: '/faculty/profile.html' }
    ];

    const studentMenus = [
      { icon: 'layout-dashboard', label: 'Dashboard', href: '/student/dashboard.html' },
      { icon: 'calendar-check', label: 'My Attendance', href: '/student/attendance.html' },
      { icon: 'file-text', label: 'My Marksheet', href: '/student/marksheet.html' },
      { icon: 'laptop', label: 'Online Exams', href: '/student/online-exams.html' },
      { icon: 'book-open', label: 'Question Bank', href: '/student/question-bank.html' },
      { icon: 'calendar-off', label: 'My Leave', href: '/student/my-leave.html' },
      { icon: 'megaphone', label: 'Announcements', href: '/student/announcements.html' },
      { icon: 'bell', label: 'Notifications', href: '/student/notifications.html' },
      { icon: 'user', label: 'Profile', href: '/student/profile.html' }
    ];

    const wardenMenus = [
      { icon: 'layout-dashboard', label: 'Dashboard', href: '/warden/dashboard.html' },
      { icon: 'users', label: 'Hostel Students', href: '/warden/students.html' },
      { icon: 'calendar-off', label: 'Leave Approval', href: '/warden/leave-approval.html' },
      { icon: 'door-open', label: 'Gate In/Out', href: '/warden/gate.html' },
      { icon: 'history', label: 'Hostel History', href: '/warden/history.html' },
      { icon: 'megaphone', label: 'Announcements', href: '/warden/announcements.html' },
      { icon: 'bell', label: 'Notifications', href: '/warden/notifications.html' },
      { icon: 'user', label: 'Profile', href: '/warden/profile.html' }
    ];

    const technicianMenus = [
      { icon: 'layout-dashboard', label: 'Dashboard', href: '/technician/dashboard.html' },
      { icon: 'blocks', label: 'Allowed Modules', href: '/technician/modules.html' },
      { icon: 'file-plus', label: 'Question Paper Creator', href: '/technician/qpc.html' },
      { icon: 'folder', label: 'Documents', href: '/technician/documents.html' },
      { icon: 'clock', label: 'Timetable', href: '/technician/timetable.html' },
      { icon: 'bell', label: 'Notifications', href: '/technician/notifications.html' },
      { icon: 'user', label: 'Profile', href: '/technician/profile.html' }
    ];

    switch(role.toUpperCase()) {
      case 'ADMIN': return adminMenus;
      case 'FACULTY': return facultyMenus;
      case 'STUDENT': return studentMenus;
      case 'WARDEN': return wardenMenus;
      case 'TECHNICIAN': return technicianMenus;
      default: return [];
    }
  }

  open() {
    this.isOpen = true;
    this.updateVisibility();
  }

  close() {
    this.isOpen = false;
    this.updateVisibility();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.updateVisibility();
  }

  updateVisibility() {
    if (!this.container) return;
    const sidebarEl = this.container.querySelector('aside');
    const backdropEl = this.container.querySelector('.sidebar-backdrop');
    if (this.isOpen) {
      sidebarEl.classList.remove('-translate-x-full');
      if (backdropEl) backdropEl.classList.remove('hidden');
    } else {
      sidebarEl.classList.add('-translate-x-full');
      if (backdropEl) backdropEl.classList.add('hidden');
    }
  }

  renderMenu(menus) {
    return menus.map((menu, index) => {
      const isActive = this.currentPage === menu.href || (menu.subItems && menu.subItems.some(sub => this.currentPage === sub.href));
      const hasSubItems = menu.subItems && menu.subItems.length > 0;
      
      let html = \`
        <li class="mb-1">
          <a href="\${hasSubItems ? '#' : menu.href}" 
             class="flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors \${isActive ? 'bg-[var(--primary)] text-white' : 'text-[var(--text)] hover:bg-[var(--bg)]'} \${hasSubItems ? 'menu-toggle' : ''}"
             \${hasSubItems ? \`data-target="submenu-\${index}"\` : ''}>
            <div class="flex items-center gap-3">
              <i data-lucide="\${menu.icon}" class="w-5 h-5"></i>
              <span class="font-medium">\${menu.label}</span>
            </div>
            \${hasSubItems ? \`<i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200 \${isActive ? 'rotate-180' : ''}"></i>\` : ''}
          </a>
      \`;

      if (hasSubItems) {
        html += \`
          <ul id="submenu-\${index}" class="\${isActive ? 'block' : 'hidden'} pl-11 pr-2 py-2 space-y-1">
            \${menu.subItems.map(sub => \`
              <li>
                <a href="\${sub.href}" class="block px-2 py-1.5 text-sm rounded-md transition-colors \${this.currentPage === sub.href ? 'text-[var(--primary)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'}">\${sub.label}</a>
              </li>
            \`).join('')}
          </ul>
        \`;
      }

      html += \`</li>\`;
      return html;
    }).join('');
  }

  render() {
    if (!this.container) return;

    const html = \`
      <div class="sidebar-backdrop fixed inset-0 bg-black/50 z-40 hidden lg:hidden"></div>
      <aside class="fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--surface)] border-r border-[var(--border)] transform -translate-x-full lg:translate-x-0 transition-transform duration-300 flex flex-col h-screen">
        <div class="flex items-center justify-between h-16 px-6 border-b border-[var(--border)]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xl">K</div>
            <span class="font-bold text-xl text-[var(--text)]">KKDGMS</span>
          </div>
          <button class="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text)] close-sidebar">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <ul class="space-y-1">
            \${this.renderMenu(this.menus)}
          </ul>
        </div>
      </aside>
    \`;

    this.container.innerHTML = html;
    
    if (window.lucide) {
      lucide.createIcons();
    }

    // Event Listeners
    const backdrop = this.container.querySelector('.sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    const closeBtn = this.container.querySelector('.close-sidebar');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    const toggles = this.container.querySelectorAll('.menu-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute('data-target');
        const target = this.container.querySelector(\`#\${targetId}\`);
        const icon = toggle.querySelector('i[data-lucide="chevron-down"]');
        
        if (target.classList.contains('hidden')) {
          target.classList.remove('hidden');
          icon.classList.add('rotate-180');
        } else {
          target.classList.add('hidden');
          icon.classList.remove('rotate-180');
        }
      });
    });
  }
}
