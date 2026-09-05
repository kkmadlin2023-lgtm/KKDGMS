// KKDGMS Supabase Configuration & Common Functions
// Centralized database connection and utilities

// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://kymsjrxjfmloibcbages.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bXNqcnhqZm1sb2liY2JhZ2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTg5NzcsImV4cCI6MjA5NDU5NDk3N30.yXqibP86VDsJ0gW48cJ0yjixgYGpljesLsiqe93K4OA'
};

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Database Table Names
const TABLES = {
    ADMINS: 'admins',
    STUDENTS: 'students',
    FACULTY_DETAILS: 'faculty_details',
    WARDENS: 'wardens',
    STUDENT_ATTENDANCE: 'student_attendance',
    STUDENT_LEAVES: 'student_leaves',
    MARKS_ENTRIES: 'marks_entries',
    FACULTY_ASSIGN: 'faculty_assign',
    LOGIN_AUDIT_LOGS: 'login_audit_logs',
    NEWS: 'news',
    VISITOR_LOGS: 'visitor_logs'
};

// Storage Bucket Names
const STORAGE = {
    STUDENT_PHOTOS: 'student-photos',
    DOCUMENTS: 'documents'
};

// Error Handler
class ErrorHandler {
    static handle(error, context = 'Operation') {
        console.error(`${context} Error:`, error);
        
        if (error.code === '23505') {
            return 'A record with this information already exists.';
        } else if (error.code === '23503') {
            return 'Referenced record does not exist.';
        } else if (error.code === 'PGRST116') {
            return 'Record not found.';
        } else if (error.message) {
            return error.message;
        }
        
        return 'An unexpected error occurred. Please try again.';
    }
    
    static log(error, context = 'Operation') {
        console.error(`[${context}]`, {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
    }
}

// Authentication Manager
class AuthManager {
    static async getCurrentSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }
    
    static async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    }
    
    static async getUserRole(email) {
        const normalizedEmail = email.toLowerCase().trim();
        
        const [student, admin, faculty, warden] = await Promise.all([
            supabase.from(TABLES.STUDENTS).select('email').eq('email', normalizedEmail).maybeSingle(),
            supabase.from(TABLES.ADMINS).select('email').eq('email', normalizedEmail).maybeSingle(),
            supabase.from(TABLES.FACULTY_DETAILS).select('email').eq('email', normalizedEmail).maybeSingle(),
            supabase.from(TABLES.WARDENS).select('email').eq('email', normalizedEmail).maybeSingle()
        ]);
        
        if (student.data) return { role: 'student', table: TABLES.STUDENTS };
        if (admin.data) return { role: 'admin', table: TABLES.ADMINS };
        if (faculty.data) return { role: 'faculty', table: TABLES.FACULTY_DETAILS };
        if (warden.data) return { role: 'warden', table: TABLES.WARDENS };
        
        return null;
    }
    
    static async logout() {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    }
    
    static setupAuthListener(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
}

// Database Manager
class DatabaseManager {
    static async fetch(table, options = {}) {
        const { 
            select = '*', 
            filters = {}, 
            orderBy = null, 
            limit = null,
            single = false 
        } = options;
        
        let query = supabase.from(table).select(select);
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query = query.eq(key, value);
            }
        });
        
        // Apply ordering
        if (orderBy) {
            const { column, ascending = true } = orderBy;
            query = query.order(column, { ascending });
        }
        
        // Apply limit
        if (limit) {
            query = query.limit(limit);
        }
        
        // Execute query
        const method = single ? 'maybeSingle' : 'select';
        const { data, error } = await query[method]();
        
        if (error) throw error;
        return data;
    }
    
    static async insert(table, records) {
        const { data, error } = await supabase.from(table).insert(records).select();
        if (error) throw error;
        return data;
    }
    
    static async update(table, updates, filters = {}) {
        let query = supabase.from(table).update(updates);
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data, error } = await query.select();
        if (error) throw error;
        return data;
    }
    
    static async delete(table, filters = {}) {
        let query = supabase.from(table).delete();
        
        Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
        
        const { data, error } = await query.select();
        if (error) throw error;
        return data;
    }
    
    static async upsert(table, records, options = {}) {
        const { onConflict = undefined } = options;
        const { data, error } = await supabase.from(table).upsert(records, { onConflict }).select();
        if (error) throw error;
        return data;
    }
}

// Storage Manager
class StorageManager {
    static async upload(bucket, path, file, options = {}) {
        const { cacheControl = '3600', upsert = true } = options;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { cacheControl, upsert });
        
        if (error) throw error;
        return data;
    }
    
    static async getPublicUrl(bucket, path) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }
    
    static async delete(bucket, paths) {
        const { data, error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw error;
        return data;
    }
}

// UI Utilities
class UIUtils {
    static showLoading(element, message = 'Loading...') {
        if (element) {
            element.innerHTML = `
                <div class="flex items-center justify-center gap-2 p-4">
                    <div class="loading"></div>
                    <span class="text-sm text-muted">${message}</span>
                </div>
            `;
        }
    }
    
    static showError(element, message) {
        if (element) {
            element.innerHTML = `
                <div class="p-4 bg-error-bg text-error rounded-lg text-sm">
                    <div class="flex items-center gap-2">
                        <span class="status-dot error"></span>
                        <span>${message}</span>
                    </div>
                </div>
            `;
        }
    }
    
    static showEmpty(element, message = 'No data found') {
        if (element) {
            element.innerHTML = `
                <div class="p-8 text-center text-muted">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        }
    }
    
    static showToast(message, type = 'info') {
        const container = document.getElementById('toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-success-bg text-success border-success',
            error: 'bg-error-bg text-error border-error',
            warning: 'bg-warning-bg text-warning border-warning',
            info: 'bg-info-bg text-info border-info'
        };
        
        toast.className = `glass card p-4 mb-2 border-l-4 ${colors[type]} fade-in`;
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="status-dot ${type}"></span>
                <span class="text-sm font-medium">${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
        return container;
    }
    
    static formatDate(date, format = 'default') {
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (format === 'time') {
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (format === 'datetime') {
            return d.toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }
        
        return d.toLocaleDateString('en-US');
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Validation Utilities
class Validator {
    static email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static phone(phone) {
        const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        return re.test(phone);
    }
    
    static aadhaar(aadhaar) {
        const re = /^[0-9]{12}$/;
        return re.test(aadhaar);
    }
    
    static required(value) {
        return value !== null && value !== undefined && value !== '';
    }
    
    static minLength(value, min) {
        return value && value.length >= min;
    }
    
    static maxLength(value, max) {
        return value && value.length <= max;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        supabase,
        TABLES,
        STORAGE,
        ErrorHandler,
        AuthManager,
        DatabaseManager,
        StorageManager,
        UIUtils,
        Validator
    };
}