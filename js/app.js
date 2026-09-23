// Main App Initialization Module

class App {
  constructor() {
    this.theme = 'system';
    this.isOnline = navigator.onLine;
  }

  init() {
    this.initTheme();
    this.initNetworkMonitoring();
    this.registerServiceWorker();
    
    // Make app instance available globally for components
    window.app = this;
    
    console.log('KKDGMS App Initialized');
  }

  // --- Theme Management ---
  
  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('system');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (this.theme === 'system') {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(isSystemDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  }

  getTheme() {
    return this.theme;
  }

  applyTheme(actualTheme) {
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Dispatch event so components (like charts) can update
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: actualTheme } }));
  }

  // --- Network Monitoring ---

  initNetworkMonitoring() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
    
    // Initial check
    if (!this.isOnline) {
      this.showOfflineBanner();
    }
  }

  updateOnlineStatus(isOnline) {
    this.isOnline = isOnline;
    if (isOnline) {
      this.hideOfflineBanner();
      // Optional: show a quick "back online" toast
    } else {
      this.showOfflineBanner();
    }
  }

  showOfflineBanner() {
    let banner = document.getElementById('offline-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--danger)] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up text-sm font-medium';
      banner.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l22 22"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
        You are currently offline. Some features may not be available.
      \`;
      document.body.appendChild(banner);
    }
  }

  hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
      banner.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => banner.remove(), 300);
    }
  }

  // --- Service Worker ---

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Assuming sw.js is at root
        // navigator.serviceWorker.register('/sw.js').then(...)
        // Commented out to prevent errors if file doesn't exist yet
        // console.log('Service Worker registration disabled in template');
      });
    }
  }
}

const appInstance = new App();
// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
  appInstance.init();
});

export default appInstance;
