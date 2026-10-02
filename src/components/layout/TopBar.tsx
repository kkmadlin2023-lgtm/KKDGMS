import React from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

interface TopBarProps {
  onMenuToggle: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, title }) => {
  const [isDark, setIsDark] = React.useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('kkdgms-theme', nextDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white line-clamp-1">
            {title || 'KKDGMS CORE'}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            Kanyakumari Dist Government Model School
          </p>
        </div>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* In-App Notification Bell Placeholder */}
        <div className="relative">
          <button
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Profile Menu */}
        <ProfileMenu />
      </div>
    </header>
  );
};
