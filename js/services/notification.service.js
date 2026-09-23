import supabaseService from './supabase.service.js';
import authService from './auth.service.js';

class NotificationService {
    constructor() {
        this.subscription = null;
    }

    /**
     * Fetch user's notifications.
     * @returns {Promise<object[]>}
     */
    async getNotifications() {
        const user = await authService.getUser();
        if (!user) return [];

        const { data, error } = await supabaseService.from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
        return data;
    }

    /**
     * Get count of unread notifications.
     * @returns {Promise<number>}
     */
    async getUnreadCount() {
        const user = await authService.getUser();
        if (!user) return 0;

        const { count, error } = await supabaseService.from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) {
            console.error('Failed to get unread count:', error);
            return 0;
        }
        return count;
    }

    /**
     * Mark a notification as read.
     * @param {string} id 
     */
    async markAsRead(id) {
        const { error } = await supabaseService.from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Mark all notifications as read.
     */
    async markAllRead() {
        const user = await authService.getUser();
        if (!user) return;

        const { error } = await supabaseService.from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
    }

    /**
     * Subscribe to new notifications in real-time.
     */
    async subscribe() {
        const user = await authService.getUser();
        if (!user) return;

        this.subscription = supabaseService.client.channel(`public:notifications:user_id=eq.${user.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
                if (this.newNotificationCallback) {
                    this.newNotificationCallback(payload.new);
                }
            })
            .subscribe();
    }

    /**
     * Register callback for new notifications.
     * @param {function} callback 
     */
    onNewNotification(callback) {
        this.newNotificationCallback = callback;
    }
}

const notificationService = new NotificationService();
export default notificationService;
