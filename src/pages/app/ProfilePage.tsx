import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatUserRole } from '@/lib/utils';
import { uploadAvatar } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import {
  User,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  Upload,
  Camera,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Calendar,
  Clock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, role, updateProfile } = useAuth();
  const toast = useToast();

  // Personal Info Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state if profile loads/updates
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingAvatar(true);
    const result = await uploadAvatar(file, user.id);
    setIsUploadingAvatar(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.url) {
      setAvatarUrl(result.url);
      await updateProfile({ avatar_url: result.url });
      toast.success('Avatar uploaded and updated successfully!');
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSaving(true);
    await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
      avatar_url: avatarUrl,
    });
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password';
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getStatusBadge = () => {
    const status = profile?.status || 'ACTIVE';
    if (status === 'ACTIVE') return <Badge variant="success">Active</Badge>;
    if (status === 'SUSPENDED') return <Badge variant="danger">Suspended</Badge>;
    return <Badge variant="warning">Inactive</Badge>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
          Account Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details, account preferences, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Identity Summary */}
        <div className="space-y-6">
          <Card className="text-center p-6 flex flex-col items-center">
            {/* Avatar with Upload Trigger */}
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-slate-100 dark:border-slate-800">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (fullName || user?.email || 'U').slice(0, 2).toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 rounded-3xl bg-slate-950/60 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                aria-label="Upload new photo"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Change Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>

            {isUploadingAvatar && (
              <p className="text-xs text-brand-600 font-semibold mb-2 animate-pulse flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Uploading image...
              </p>
            )}

            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {fullName || 'School User'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{user?.email}</p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="role" roleType={role}>
                {formatUserRole(role)}
              </Badge>
              {getStatusBadge()}
            </div>

            {profile?.status === 'SUSPENDED' && profile.suspension_reason && (
              <div className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 text-left mb-4">
                <div className="font-semibold flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Suspension Reason:</span>
                </div>
                <p className="text-[11px]">{profile.suspension_reason}</p>
              </div>
            )}

            {/* Read-Only Identity Specs */}
            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-500">
                <span>User ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {profile?.user_id || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Login
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active Session'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Columns: Edit Personal Information & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Form */}
          <Card>
            <form onSubmit={handlePersonalSubmit}>
              <CardHeader>
                <CardTitle className="text-base">Personal Details</CardTitle>
                <CardDescription>
                  Update your contact details and display name visible to authorized school staff.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  />

                  <Input
                    label="Contact Phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />
                </div>

                <Input
                  label="Registered Email (Account Identity)"
                  value={user?.email || ''}
                  disabled
                  helperText="Email identity is managed via Supabase Auth"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Role & Access Level: </span>
                    Assigned <span className="font-semibold text-brand-600">{formatUserRole(role)}</span>. System permissions and account statuses are managed centrally by the School Administration.
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" isLoading={isSaving} size="sm">
                  Save Personal Details
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security / Change Password Form */}
          <Card>
            <form onSubmit={handleChangePassword}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-brand-600" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Update your authentication password using Supabase Auth encryption.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  isLoading={isChangingPassword}
                  disabled={!newPassword || !confirmPassword}
                >
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
