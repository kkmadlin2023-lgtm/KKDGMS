import config from '../config.js';

class SupabaseService {
    constructor() {
        this.client = null;
        this._initClient();
    }

    _initClient() {
        if (typeof window !== 'undefined' && window.supabase) {
            this.client = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
        }
    }

    getClient() {
        if (!this.client && typeof window !== 'undefined' && window.supabase) {
            this._initClient();
        }
        return this.client;
    }

    /**
     * Get the auth module of the Supabase client.
     */
    get auth() {
        const c = this.getClient();
        if (!c) {
            throw new Error('Supabase client is not loaded. Please ensure @supabase/supabase-js CDN is included.');
        }
        return c.auth;
    }

    /**
     * Query a table.
     * @param {string} table 
     */
    from(table) {
        const c = this.getClient();
        if (!c) {
            throw new Error('Supabase client is not loaded.');
        }
        return c.from(table);
    }

    /**
     * Call a database function.
     * @param {string} fn 
     * @param {object} params 
     */
    rpc(fn, params) {
        const c = this.getClient();
        if (!c) {
            throw new Error('Supabase client is not loaded.');
        }
        return c.rpc(fn, params);
    }

    /**
     * Check if the database connection is active.
     * @returns {Promise<boolean>}
     */
    async checkConnection() {
        try {
            const { error } = await this.from('profiles').select('id').limit(1);
            return !error;
        } catch (err) {
            return false;
        }
    }
}

const supabaseService = new SupabaseService();
export default supabaseService;
