import config from '../config.js';
import supabaseService from './supabase.service.js';
import authService from './auth.service.js';

class FcmService {
    constructor() {
        this.messaging = null;
        this.app = null;
    }

    /**
     * Initialize Firebase app and messaging.
     */
    async init() {
        if (!window.firebase || !window.firebase.messaging) {
            console.error('Firebase SDK not loaded.');
            return;
        }
        if (!this.app) {
            this.app = window.firebase.initializeApp(config.firebase);
            this.messaging = window.firebase.messaging(this.app);
        }
    }

    /**
     * Request notification permission.
     * @returns {Promise<boolean>}
     */
    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (e) {
            console.error('Permission request failed', e);
            return false;
        }
    }

    /**
     * Get FCM Token.
     * @returns {Promise<string|null>}
     */
    async getToken() {
        await this.init();
        if (!this.messaging) return null;

        try {
            const token = await window.firebase.messaging().getToken({ vapidKey: config.firebase.vapidKey });
            if (token) {
                await this.saveToken(token);
                return token;
            }
            return null;
        } catch (err) {
            console.error('Failed to get FCM token', err);
            return null;
        }
    }

    /**
     * Save token to device_tokens table.
     * @param {string} token 
     */
    async saveToken(token) {
        const user = await authService.getUser();
        if (!user) return;

        const { error } = await supabaseService.from('device_tokens').upsert({
            user_id: user.id,
            token: token,
            device_info: navigator.userAgent,
            updated_at: new Date().toISOString()
        }, { onConflict: 'token' });
        
        if (error) console.error('Error saving device token:', error);
    }

    /**
     * Register callback for foreground messages.
     * @param {function} callback 
     */
    async onMessage(callback) {
        await this.init();
        if (!this.messaging) return;
        window.firebase.messaging().onMessage(callback);
    }

    /**
     * Get current permission status.
     * @returns {string}
     */
    getPermissionStatus() {
        return Notification.permission;
    }

    /**
     * Send test notification (via edge function or RPC in reality, here mocked).
     */
    async sendTestNotification() {
        console.log('FCM test notification triggered (requires backend integration).');
    }
}

const fcmService = new FcmService();
export default fcmService;
