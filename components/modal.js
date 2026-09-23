export default class Modal {
  constructor({ title, content, size = 'md', container }) {
    this.title = title || '';
    this.content = content || '';
    this.size = size; // sm, md, lg, xl, full
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.footer = null;
    this.isOpen = false;
    
    // Default config
    this.closeOnBackdrop = true;

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getSizeClass() {
    switch (this.size) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-7xl';
      case 'full': return 'max-w-full m-4 h-[calc(100vh-2rem)]';
      case 'md':
      default: return 'max-w-2xl';
    }
  }

  setContent(html) {
    this.content = html;
    if (this.isOpen) this.render();
  }

  setTitle(title) {
    this.title = title;
    if (this.isOpen) this.render();
  }

  setFooter(html) {
    this.footer = html;
    if (this.isOpen) this.render();
  }

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    document.addEventListener('keydown', this.handleKeyDown);
    this.render();
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.container) this.container.innerHTML = '';
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  render() {
    if (!this.container || !this.isOpen) return;

    const html = \`
      <div class="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity modal-backdrop"></div>
        
        <!-- Modal Panel -->
        <div class="relative w-full \${this.getSizeClass()} mx-auto my-6 z-50 animate-fade-in-up">
          <div class="relative flex flex-col w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl outline-none focus:outline-none \${this.size === 'full' ? 'h-full' : 'max-h-[90vh]'}">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-[var(--border)] rounded-t-2xl">
              <h3 class="text-xl font-semibold text-[var(--text)]">
                \${this.title}
              </h3>
              <button class="modal-close-btn p-1 ml-auto bg-transparent border-0 text-[var(--text-secondary)] hover:text-[var(--text)] float-right text-3xl leading-none font-semibold outline-none focus:outline-none rounded-lg hover:bg-[var(--bg)] transition-colors">
                <i data-lucide="x" class="w-6 h-6"></i>
              </button>
            </div>
            
            <!-- Body -->
            <div class="relative p-6 flex-auto overflow-y-auto custom-scrollbar \${this.size === 'full' ? 'h-full' : ''}">
              \${this.content}
            </div>
            
            <!-- Footer -->
            \${this.footer ? \`
              <div class="flex items-center justify-end p-5 border-t border-[var(--border)] rounded-b-2xl bg-[var(--bg)]/50 gap-3">
                \${this.footer}
              </div>
            \` : ''}
          </div>
        </div>
      </div>
    \`;

    this.container.innerHTML = html;

    if (window.lucide) {
      lucide.createIcons();
    }

    // Events
    if (this.closeOnBackdrop) {
      const backdrop = this.container.querySelector('.modal-backdrop');
      if (backdrop) backdrop.addEventListener('click', () => this.close());
    }

    const closeBtn = this.container.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
  }

  // Static helpers
  static confirm(title, message) {
    return new Promise((resolve) => {
      // Create a temporary container
      const container = document.createElement('div');
      document.body.appendChild(container);

      const modal = new Modal({
        title,
        content: \`<p class="text-[var(--text)] text-base">\${message}</p>\`,
        size: 'sm',
        container
      });

      modal.setFooter(\`
        <button id="modal-cancel" class="px-4 py-2 text-sm font-medium text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg)] focus:ring-4 focus:outline-none focus:ring-[var(--border)] transition-colors">Cancel</button>
        <button id="modal-confirm" class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors">Confirm</button>
      \`);

      modal.open();

      // Bind events after open
      setTimeout(() => {
        const cancelBtn = container.querySelector('#modal-cancel');
        const confirmBtn = container.querySelector('#modal-confirm');
        
        const cleanup = () => {
          modal.close();
          setTimeout(() => container.remove(), 300);
        };

        if (cancelBtn) cancelBtn.addEventListener('click', () => { cleanup(); resolve(false); });
        if (confirmBtn) confirmBtn.addEventListener('click', () => { cleanup(); resolve(true); });
        
        // Handle modal close via X or backdrop
        const originalClose = modal.close.bind(modal);
        modal.close = () => {
          originalClose();
          setTimeout(() => container.remove(), 300);
          resolve(false);
        };
      }, 0);
    });
  }

  static alert(title, message) {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const modal = new Modal({
        title,
        content: \`<p class="text-[var(--text)] text-base">\${message}</p>\`,
        size: 'sm',
        container
      });

      modal.setFooter(\`
        <button id="modal-ok" class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors">OK</button>
      \`);

      modal.open();

      setTimeout(() => {
        const okBtn = container.querySelector('#modal-ok');
        
        const cleanup = () => {
          modal.close();
          setTimeout(() => container.remove(), 300);
          resolve(true);
        };

        if (okBtn) okBtn.addEventListener('click', cleanup);
        
        const originalClose = modal.close.bind(modal);
        modal.close = () => {
          originalClose();
          setTimeout(() => container.remove(), 300);
          resolve(true);
        };
      }, 0);
    });
  }
}
