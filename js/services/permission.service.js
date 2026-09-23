import supabaseService from './supabase.service.js';
import authService from './auth.service.js';

class PermissionService {
    constructor() {
        this.permissionsCache = null;
    }

    /**
     * Load permissions for the current role from DB.
     */
    async loadPermissions() {
        const cached = sessionStorage.getItem('role_permissions');
        if (cached) {
            this.permissionsCache = JSON.parse(cached);
            return this.permissionsCache;
        }

        const role = await authService.getUserRole();
        if (!role) return [];

        const { data, error } = await supabaseService.from('role_permissions').select('permission').eq('role', role);
        
        if (error) {
            console.error('Failed to load permissions:', error);
            return [];
        }

        this.permissionsCache = data.map(p => p.permission);
        sessionStorage.setItem('role_permissions', JSON.stringify(this.permissionsCache));
        return this.permissionsCache;
    }

    /**
     * Check if admin.
     * @returns {Promise<boolean>}
     */
    async isAdmin() {
        const role = await authService.getUserRole();
        return role === 'admin';
    }

    /**
     * Check if the user has a specific permission.
     * @param {string} page 
     * @param {string} action 
     * @returns {Promise<boolean>}
     */
    async hasPermission(page, action) {
        if (await this.isAdmin()) return true;
        
        if (!this.permissionsCache) {
            await this.loadPermissions();
        }

        const permissionString = `${page}.${action}`;
        return this.permissionsCache.includes(permissionString);
    }

    /**
     * Get list of pages user can view.
     * @returns {Promise<string[]>}
     */
    async getPermittedPages() {
        if (await this.isAdmin()) {
            return ['dashboard', 'students', 'attendance', 'leave', 'questionbank', 'marks', 'onlineexam', 'database', 'users', 'notifications', 'stories', 'visitors', 'announcements', 'events', 'feedback', 'timetable', 'documents', 'expenses', 'bonafide', 'audit', 'permissions', 'faculty', 'settings'];
        }

        if (!this.permissionsCache) {
            await this.loadPermissions();
        }

        const pages = new Set();
        for (const perm of this.permissionsCache) {
            const [page, action] = perm.split('.');
            if (action === 'view' || action === 'manage') {
                pages.add(page);
            }
        }
        return Array.from(pages);
    }

    /**
     * Check access to page and redirect if denied.
     * @param {string} pageId 
     */
    async checkPageAccess(pageId) {
        const hasAccess = await this.hasPermission(pageId, 'view') || await this.hasPermission(pageId, 'manage');
        if (!hasAccess) {
            window.location.href = '/unauthorized.html';
        }
    }
}

const permissionService = new PermissionService();
export default permissionService;
