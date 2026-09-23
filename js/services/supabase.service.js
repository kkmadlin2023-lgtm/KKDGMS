import config from '../config.js';

class SupabaseService {
    constructor() {
        if (!window.supabase) {
            console.error('Supabase library is not loaded. Please include the Supabase CDN script.');
        }
        this.client = window.supabase?.createClient(config.supabase.url, config.supabase.anonKey);
    }

    /**
     * Get the auth module of the Supabase client.
     */
    get auth() {
        return this.client.auth;
    }

    /**
     * Query a table.
     * @param {string} table 
     * @returns 
     */
    from(table) {
        return this.client.from(table);
    }

    /**
     * Call a database function.
     * @param {string} fn 
     * @param {object} params 
     * @returns 
     */
    rpc(fn, params) {
        return this.client.rpc(fn, params);
    }

    /**
     * Check if the database connection is active.
     * @returns {Promise<boolean>}
     */
    async checkConnection() {
        try {
            const { error } = await this.client.from('profiles').select('id').limit(1);
            return !error;
        } catch (err) {
            return false;
        }
    }
}

const supabaseService = new SupabaseService();
export default supabaseService;
