class OfflineService {
    constructor() {
        this.DB_NAME = 'KKDGMS_Offline';
        this.DB_VERSION = 1;
        this.db = null;
        this.syncQueueKey = 'sync_queue';
        this.statusCallbacks = [];

        window.addEventListener('online', () => this._handleStatusChange(true));
        window.addEventListener('offline', () => this._handleStatusChange(false));
    }

    /**
     * Initialize IndexedDB.
     */
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
            
            request.onerror = (event) => reject(event.target.error);
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('drafts')) {
                    db.createObjectStore('drafts', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Save draft to IndexedDB.
     * @param {string} key 
     * @param {any} data 
     */
    async saveDraft(key, data) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['drafts'], 'readwrite');
            const store = transaction.objectStore('drafts');
            const request = store.put({ key, data, timestamp: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get draft from IndexedDB.
     * @param {string} key 
     * @returns {any}
     */
    async getDraft(key) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['drafts'], 'readonly');
            const store = transaction.objectStore('drafts');
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete draft from IndexedDB.
     * @param {string} key 
     */
    async deleteDraft(key) {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['drafts'], 'readwrite');
            const store = transaction.objectStore('drafts');
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Queue operation for sync.
     * @param {object} operation 
     */
    addToSyncQueue(operation) {
        const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
        queue.push({ ...operation, timestamp: Date.now() });
        localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
        
        if (this.isOnline()) {
            this.processSyncQueue();
        }
    }

    /**
     * Process queued operations when online.
     */
    async processSyncQueue() {
        if (!this.isOnline()) return;

        const queue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
        if (queue.length === 0) return;

        console.log(`Syncing ${queue.length} items...`);
        // In reality, this would dynamically import services to process operations
        // e.g., if (op.action === 'INSERT') supabaseService.from(op.table).insert(op.data)
        
        // After successful sync:
        localStorage.removeItem(this.syncQueueKey);
    }

    /**
     * Check if online.
     * @returns {boolean}
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * Listen to status changes.
     * @param {function} callback 
     */
    onStatusChange(callback) {
        this.statusCallbacks.push(callback);
    }

    _handleStatusChange(isOnline) {
        this.statusCallbacks.forEach(cb => cb(isOnline));
        if (isOnline) {
            this.processSyncQueue();
        }
    }
}

const offlineService = new OfflineService();
export default offlineService;
