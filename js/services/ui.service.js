class UiService {
    showToast(message, type = 'info', duration = 3000) {
        const containerId = 'toast-container';
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        let bgColor = 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]';
        if (type === 'success') bgColor = 'bg-[var(--success)] text-white';
        if (type === 'error') bgColor = 'bg-[var(--danger)] text-white';
        if (type === 'warning') bgColor = 'bg-[var(--warning)] text-white';
        if (type === 'info') bgColor = 'bg-[var(--primary)] text-white';

        toast.className = `${bgColor} px-4 py-3 rounded shadow-lg transition-opacity duration-300 opacity-0`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    }

    showConfirm(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const dialog = document.createElement('div');
        dialog.className = 'bg-[var(--surface)] p-6 rounded-lg shadow-xl max-w-sm w-full mx-4';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'text-lg font-bold text-[var(--text)] mb-2';
        titleEl.textContent = title;
        
        const msgEl = document.createElement('p');
        msgEl.className = 'text-[var(--text-secondary)] mb-6';
        msgEl.textContent = message;
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'flex justify-end gap-3';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'px-4 py-2 border border-[var(--border)] rounded text-[var(--text)] hover:bg-[var(--bg)]';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => document.body.removeChild(overlay);
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-blue-700';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.onclick = () => {
            document.body.removeChild(overlay);
            onConfirm();
        };
        
        btnContainer.append(cancelBtn, confirmBtn);
        dialog.append(titleEl, msgEl, btnContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    showAlert(title, message) {
        this.showConfirm(title, message, () => {});
    }

    showLoading(container) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader animate-pulse bg-[var(--border)] rounded w-full h-32 flex items-center justify-center';
        skeleton.textContent = 'Loading...';
        container.appendChild(skeleton);
    }

    hideLoading(container) {
        const skeletons = container.querySelectorAll('.skeleton-loader');
        skeletons.forEach(s => s.remove());
    }

    showPageLoader() {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.className = 'fixed inset-0 bg-[var(--bg)] z-[100] flex items-center justify-center';
            const spinner = document.createElement('div');
            spinner.className = 'animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent';
            loader.appendChild(spinner);
            document.body.appendChild(loader);
        }
    }

    hidePageLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.remove();
    }

    showEmptyState(container, message, icon = 'folder-open') {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
                <i data-lucide="${icon}" class="w-16 h-16 mb-4 opacity-50"></i>
                <p class="text-lg">${this.escapeHtml(message)}</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }

    showErrorState(container, message, retryFn) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <i data-lucide="alert-circle" class="w-16 h-16 text-[var(--danger)] mb-4"></i>
                <p class="text-[var(--text)] mb-4">${this.escapeHtml(message)}</p>
                <button id="retry-btn" class="px-4 py-2 bg-[var(--primary)] text-white rounded">Retry</button>
            </div>
        `;
        container.querySelector('#retry-btn').onclick = retryFn;
        if (window.lucide) window.lucide.createIcons();
    }

    showOfflineBanner() {
        let banner = document.getElementById('offline-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'offline-banner';
            banner.className = 'fixed bottom-0 w-full bg-[var(--warning)] text-white text-center py-2 z-50 shadow-lg';
            banner.textContent = 'You are currently offline. Changes will be saved locally and synced when you return online.';
            document.body.appendChild(banner);
        }
    }

    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) banner.remove();
    }

    formatNumber(n) {
        return new Intl.NumberFormat('en-IN').format(n);
    }

    formatDate(date, format = 'medium') {
        const d = new Date(date);
        if (format === 'short') return d.toLocaleDateString('en-IN');
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(d);
    }

    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }

    truncate(str, max) {
        return str.length > max ? str.substring(0, max - 3) + '...' : str;
    }

    debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    throttle(fn, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return fn.apply(this, args);
        };
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

const uiService = new UiService();
export default uiService;
