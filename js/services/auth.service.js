import supabaseService from './supabase.service.js';
import auditService from './audit.service.js';

class AuthService {
    constructor() {
        this.LOCKOUT_KEY = 'auth_lockout';
        this.ATTEMPTS_KEY = 'auth_attempts';
        this.MAX_ATTEMPTS = 3;
        this.LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get current session.
     * @returns {Promise<object>}
     */
    async getSession() {
        const { data: { session }, error } = await supabaseService.auth.getSession();
        if (error) throw error;
        return session;
    }

    /**
     * Get current user.
     * @returns {Promise<object>}
     */
    async getUser() {
        const { data: { user }, error } = await supabaseService.auth.getUser();
        if (error) throw error;
        return user;
    }

    /**
     * Get profile of the current user.
     * @returns {Promise<object>}
     */
    async getProfile() {
        const user = await this.getUser();
        if (!user) return null;
        
        const { data, error } = await supabaseService.from('profiles').select('*').eq('id', user.id).single();
        if (error) throw error;
        return data;
    }

    /**
     * Get role of the current user.
     * @returns {Promise<string>}
     */
    async getUserRole() {
        const profile = await this.getProfile();
        return profile?.role || 'guest';
    }

    /**
     * Check if authenticated.
     * @returns {Promise<boolean>}
     */
    async isAuthenticated() {
        const session = await this.getSession();
        return !!session;
    }

    /**
     * Sign in with User ID or email and password.
     * @param {string} userIdOrEmail 
     * @param {string} password 
     * @returns {Promise<object>}
     */
    async login(userIdOrEmail, password) {
        if (this.isLockedOut()) {
            throw new Error(`Account locked. Try again in ${this.getLockoutRemaining()} seconds.`);
        }

        let email = (userIdOrEmail || '').trim();

        // If User ID is entered (no @), look up the email
        if (!email.includes('@')) {
            try {
                // 1. Check profiles
                const { data: profileData } = await supabaseService.from('profiles').select('email').eq('user_id', email).maybeSingle();
                if (profileData?.email) {
                    email = profileData.email;
                } else {
                    // 2. Check admins
                    const { data: adminData } = await supabaseService.from('admins').select('email').eq('user_id', email).maybeSingle();
                    if (adminData?.email) {
                        email = adminData.email;
                    } else {
                        // 3. Check students
                        const { data: stuData } = await supabaseService.from('students').select('email').eq('user_id', email).maybeSingle();
                        if (stuData?.email) {
                            email = stuData.email;
                        }
                    }
                }
            } catch (lookupErr) {
                console.warn('User ID lookup error:', lookupErr);
            }
        }

        const { data, error } = await supabaseService.auth.signInWithPassword({ email, password });
        
        if (error) {
            this._incrementAttempts();
            throw error;
        }

        this._resetAttempts();
        try {
            await auditService.log('LOGIN', 'user', data.user.id, { email });
        } catch (auditErr) {}
        
        return data;
    }

    /**
     * Sign in with Google.
     */
    async loginWithGoogle() {
        const { data, error } = await supabaseService.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
        return data;
    }

    /**
     * Log out the current user.
     */
    async logout() {
        const user = await this.getUser();
        if (user) {
            await auditService.log('LOGOUT', 'user', user.id, {});
        }
        const { error } = await supabaseService.auth.signOut();
        if (error) throw error;
        localStorage.clear();
        sessionStorage.clear();
    }

    /**
     * Listen to auth state changes.
     * @param {function} callback 
     */
    onAuthStateChange(callback) {
        supabaseService.auth.onAuthStateChange(callback);
    }

    /**
     * Check if lockout is active.
     * @returns {boolean}
     */
    isLockedOut() {
        const lockoutTime = localStorage.getItem(this.LOCKOUT_KEY);
        if (!lockoutTime) return false;
        
        if (Date.now() > parseInt(lockoutTime, 10)) {
            localStorage.removeItem(this.LOCKOUT_KEY);
            this._resetAttempts();
            return false;
        }
        return true;
    }

    /**
     * Get remaining lockout time in seconds.
     * @returns {number}
     */
    getLockoutRemaining() {
        const lockoutTime = localStorage.getItem(this.LOCKOUT_KEY);
        if (!lockoutTime) return 0;
        const remaining = Math.ceil((parseInt(lockoutTime, 10) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    }

    _incrementAttempts() {
        let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0', 10);
        attempts++;
        localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());
        
        if (attempts >= this.MAX_ATTEMPTS) {
            localStorage.setItem(this.LOCKOUT_KEY, (Date.now() + this.LOCKOUT_DURATION).toString());
        }
    }

    _resetAttempts() {
        localStorage.removeItem(this.ATTEMPTS_KEY);
        localStorage.removeItem(this.LOCKOUT_KEY);
    }

    /**
     * Enforce authentication and specific role.
     * @param {string|string[]} requiredRole 
     */
    async requireAuth(requiredRole = null) {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = '/login.html';
            return;
        }

        if (requiredRole) {
            const userRole = await this.getUserRole();
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            if (!roles.includes(userRole)) {
                window.location.href = '/unauthorized.html';
            }
        }
    }
}

const authService = new AuthService();
export default authService;
