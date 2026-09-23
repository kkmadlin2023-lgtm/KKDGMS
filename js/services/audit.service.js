import supabaseService from './supabase.service.js';
import authService from './auth.service.js';

class AuditService {
    /**
     * Log an audit event.
     * @param {string} action 
     * @param {string} entity 
     * @param {string} entityId 
     * @param {object} details 
     */
    async log(action, entity, entityId, details = {}) {
        try {
            const user = await authService.getUser();
            const role = await authService.getUserRole();
            
            const payload = {
                user_id: user ? user.id : null,
                role: role,
                action: action,
                entity: entity,
                entity_id: entityId,
                details: details,
                user_agent: navigator.userAgent,
                created_at: new Date().toISOString()
            };

            const { error } = await supabaseService.from('audit_logs').insert([payload]);
            if (error) console.error('Failed to write audit log:', error);
        } catch (err) {
            console.error('Audit log exception:', err);
        }
    }

    /**
     * Fetch audit logs with optional filters (Admin only).
     * @param {object} filters 
     * @returns {Promise<object[]>}
     */
    async getAuditLogs(filters = {}) {
        let query = supabaseService.from('audit_logs').select('*', { count: 'exact' });

        if (filters.action) query = query.eq('action', filters.action);
        if (filters.entity) query = query.eq('entity', filters.entity);
        if (filters.userId) query = query.eq('user_id', filters.userId);
        
        if (filters.startDate) query = query.gte('created_at', filters.startDate);
        if (filters.endDate) query = query.lte('created_at', filters.endDate);

        const limit = filters.limit || 50;
        const offset = filters.offset || 0;

        query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

        const { data, count, error } = await query;
        if (error) throw error;

        return { data, count };
    }
}

const auditService = new AuditService();
export default auditService;
