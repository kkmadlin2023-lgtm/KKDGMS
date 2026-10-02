import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatUserRole } from '@/lib/utils';
import { User, Mail, Shield, CheckCircle, Image as ImageIcon } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, role, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ full_name: fullName, avatar_url: avatarUrl });
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
          My Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 text-center p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg mb-4 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (fullName || user?.email || 'U').slice(0, 2).toUpperCase()
            )}
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {fullName || profile?.full_name || 'School User'}
          </h3>
          <p className="text-xs text-slate-500 mb-3">{user?.email}</p>
          <Badge variant="role" roleType={role}>
            {formatUserRole(role)}
          </Badge>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span>Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>User ID</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {profile?.user_id || '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Edit Details Form */}
        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>
                Update your display name and profile picture URL. Role and permissions are managed by administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Email Address (Read-only)"
                value={user?.email || ''}
                disabled
                helperText="Email is managed via Supabase Authentication"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Avatar URL (Optional)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                leftIcon={<ImageIcon className="w-4 h-4 text-slate-400" />}
              />

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Role Authority: </span>
                  Your account has <span className="font-semibold text-brand-600">{formatUserRole(role)}</span> privileges. To request role alterations, please submit a request to the Super Administrator.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" isLoading={isSaving} size="sm">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
