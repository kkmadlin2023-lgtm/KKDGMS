import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { formatUserRole } from '@/lib/utils';
import { User, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfileMenu: React.FC = () => {
  const { profile, role, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="User profile menu"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-xl" />
          ) : (
            initials
          )}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {profile?.full_name || profile?.email}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {formatUserRole(role)}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {profile?.full_name || 'School User'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">
              {profile?.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="role" roleType={role} className="text-[10px]">
                {formatUserRole(role)}
              </Badge>
              {profile?.user_id && (
                <span className="text-[10px] font-mono text-slate-400">ID: {profile.user_id}</span>
              )}
            </div>
          </div>

          <div className="p-1 space-y-0.5">
            <Link
              to="/app/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>My Profile</span>
            </Link>

            {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Admin Authority</span>
              </div>
            )}
          </div>

          <div className="p-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
