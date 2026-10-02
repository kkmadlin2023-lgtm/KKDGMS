import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('GUEST');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<UserProfile | null> => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.warn('Error fetching profile from DB:', profileError);
      }

      if (data) {
        setProfile(data as UserProfile);
        setRole(data.role || 'GUEST');
        return data as UserProfile;
      }

      // Fallback if trigger hasn't fired yet
      const fallbackRole: UserRole = (userEmail?.toLowerCase() === 'kkmadlin2023@gmail.com') 
        ? 'SUPER_ADMIN' 
        : 'GUEST';

      const tempProfile: UserProfile = {
        id: userId,
        user_id: userEmail?.split('@')[0] || 'user',
        email: userEmail || '',
        full_name: userEmail?.split('@')[0] || 'User',
        role: fallbackRole,
        is_active: true,
      };

      setProfile(tempProfile);
      setRole(fallbackRole);
      return tempProfile;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return await fetchProfile(user.id, user.email);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        setIsLoading(true);
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);

          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id, initialSession.user.email);
          } else {
            setProfile(null);
            setRole('GUEST');
          }
        }
      } catch (err: unknown) {
        console.error('Failed to initialize session:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize session');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user || null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.email);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRole('GUEST');
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          // Token refreshed silently
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authErr) {
        throw authErr;
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id, data.user.email);
        if (userProfile && !userProfile.is_active) {
          await supabase.auth.signOut();
          const inactiveMsg = 'This account has been deactivated. Please contact the administrator.';
          toast.error(inactiveMsg);
          return { success: false, error: inactiveMsg };
        }

        toast.success(`Welcome back, ${userProfile?.full_name || 'User'}!`);
        return { success: true };
      }

      return { success: false, error: 'User not found' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });

      if (oauthErr) throw oauthErr;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      toast.error(msg);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole('GUEST');
      toast.info('You have been signed out.');
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const resetPassword = async (email: string) => {
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetErr) throw resetErr;

      toast.success('Password recovery email sent! Check your inbox.');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password recovery email.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // Update non-sensitive profile info
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      // Clean non-permitted fields to avoid RLS violation
      const safeUpdates: Record<string, unknown> = {};
      if (updates.full_name !== undefined) safeUpdates.full_name = updates.full_name;
      if (updates.avatar_url !== undefined) safeUpdates.avatar_url = updates.avatar_url;

      const { data, error: updateErr } = await supabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      setProfile(data as UserProfile);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isLoading,
        error,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
