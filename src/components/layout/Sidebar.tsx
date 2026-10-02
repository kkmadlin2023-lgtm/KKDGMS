import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPermittedNavItems } from '@/config/navigation';
import {
  LayoutDashboard,
  User,
  Users,
  GraduationCap,
  BookOpen,
  BookMarked,
  Building2,
  Wrench,
  X,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  Users,
  GraduationCap,
  BookOpen,
  BookMarked,
  Building2,
  Wrench,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const navItems = getPermittedNavItems(role);

  // Group navigation items by section
  const sections: { title?: string; items: typeof navItems }[] = [];
  const sectionMap = new Map<string, typeof navItems>();

  navItems.forEach((item) => {
    const sec = item.section || 'General';
    if (!sectionMap.has(sec)) {
      sectionMap.set(sec, []);
    }
    sectionMap.get(sec)!.push(item);
  });

  sectionMap.forEach((items, title) => {
    sections.push({ title, items });
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-800">
          <NavLink to="/app" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-amber-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white font-black text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-black tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                KKDGMS CORE
              </span>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Model School ERP
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              {sec.title && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = iconMap[item.iconName] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.path === '/app'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800/60'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-brand-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
          <p className="font-semibold text-slate-600 dark:text-slate-400">Phase 1 Foundation</p>
          <p className="text-[10px]">Auth & Security Active</p>
        </div>
      </aside>
    </>
  );
};
