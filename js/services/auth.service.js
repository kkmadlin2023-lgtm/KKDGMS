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
        try {
            const { data: { session }, error } = await supabaseService.auth.getSession();
            if (error) throw error;
            return session;
        } catch (e) {
            return null;
        }
    }

    /**
     * Get current user.
     * @returns {Promise<object>}
     */
    async getUser() {
        try {
            const { data: { user }, error } = await supabaseService.auth.getUser();
            if (error || !user) {
                const session = await this.getSession();
                return session?.user || null;
            }
            return user;
        } catch (e) {
            return null;
        }
    }

    /**
     * Get profile of the current user.
     * Fail-safe: Never throws PGRST116/single errors.
     * @returns {Promise<object>}
     */
    async getProfile() {
        const user = await this.getUser();
        if (!user) return null;
        
        try {
            // 1. Try finding by user.id
            const { data: byId } = await supabaseService
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
            
            if (byId) return byId;

            // 2. Try finding by email
            if (user.email) {
                const { data: byEmail } = await supabaseService
                    .from('profiles')
                    .select('*')
                    .eq('email', user.email)
                    .maybeSingle();
                
                if (byEmail) return byEmail;
            }
        } catch (e) {
            console.warn('Profile fetch warning (non-fatal):', e);
        }

        // 3. Fallback: construct safe profile from user metadata & email
        const userEmail = (user.email || '').toLowerCase();
        const metaRole = (user.user_metadata?.role || '').toUpperCase();
        
        // Default admin if matches admin email or metadata
        const isAdmin = metaRole === 'ADMIN' || userEmail === 'kkmadlin2023@gmail.com' || userEmail.startsWith('admin');
        const role = metaRole || (isAdmin ? 'ADMIN' : 'STUDENT');

        const fallbackProfile = {
            id: user.id,
            email: user.email,
            user_id: user.user_metadata?.user_id || (isAdmin ? 'ADM001' : userEmail.split('@')[0] || 'USER'),
            role: role,
            full_name: user.user_metadata?.full_name || (isAdmin ? 'Super Administrator' : userEmail.split('@')[0] || 'User'),
            is_active: true
        };

        // Attempt background profile upsert
        try {
            await supabaseService.from('profiles').upsert(fallbackProfile);
        } catch (e) {
            console.warn('Profile auto-insert warning:', e);
        }

        return fallbackProfile;
    }

    /**
     * Get role of the current user.
     * @returns {Promise<string>}
     */
    async getUserRole() {
        const profile = await this.getProfile();
        return (profile?.role || 'STUDENT').toUpperCase();
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

        // If User ID or EMIS is entered (no @), resolve to email
        if (!email.includes('@')) {
            try {
                // Check profiles
                const { data: profileData } = await supabaseService.from('profiles').select('email').eq('user_id', email).maybeSingle();
                if (profileData?.email) {
                    email = profileData.email;
                } else {
                    // Check admins
                    const { data: adminData } = await supabaseService.from('admins').select('email').eq('user_id', email).maybeSingle();
                    if (adminData?.email) {
                        email = adminData.email;
                    } else {
                        // Check students
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
            options: {
                redirectTo: window.location.origin + '/login.html'
            }
        });
        if (error) throw error;
        return data;
    }

    /**
     * Log out the current user.
     */
    async logout() {
        try {
            const user = await this.getUser();
            if (user) {
                await auditService.log('LOGOUT', 'user', user.id);
            }
        } catch (e) {}
        
        const { error } = await supabaseService.auth.signOut();
        if (error) throw error;

        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        window.location.href = '/login.html';
    }

    /**
     * Subscribe to authentication state changes.
     * @param {Function} callback 
     */
    onAuthStateChange(callback) {
        return supabaseService.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    /**
     * Increment failed login attempts.
     * @private
     */
    _incrementAttempts() {
        let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || '0', 10);
        attempts += 1;
        localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());

        if (attempts >= this.MAX_ATTEMPTS) {
            const lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
            localStorage.setItem(this.LOCKOUT_KEY, lockoutUntil.toString());
        }
    }

    /**
     * Reset login attempts.
     * @private
     */
    _resetAttempts() {
        localStorage.removeItem(this.ATTEMPTS_KEY);
        localStorage.removeItem(this.LOCKOUT_KEY);
    }

    /**
     * Check if the user is currently locked out.
     * @returns {boolean}
     */
    isLockedOut() {
        const lockoutUntil = localStorage.getItem(this.LOCKOUT_KEY);
        if (!lockoutUntil) return false;

        const remaining = parseInt(lockoutUntil, 10) - Date.now();
        if (remaining <= 0) {
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
        const lockoutUntil = localStorage.getItem(this.LOCKOUT_KEY);
        if (!lockoutUntil) return 0;

        const remaining = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    }
}

const authService = new AuthService();
export default authService;
