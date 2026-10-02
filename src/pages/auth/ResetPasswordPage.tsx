import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Password updated successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-slate-100">
      <Card className="w-full max-w-md bg-slate-900/90 border-slate-800 shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400 mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl text-white">Create New Password</CardTitle>
          <CardDescription className="text-slate-400">
            Please choose a strong password for your KKDGMS CORE account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              className="bg-slate-950/60 border-slate-700 text-white"
            />

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              className="bg-slate-950/60 border-slate-700 text-white"
            />

            <Button type="submit" className="w-full py-2.5 font-bold mt-2" isLoading={isLoading}>
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
