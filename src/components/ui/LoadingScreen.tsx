import React from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading KKDGMS CORE...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 transition-all">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-700 to-amber-500 flex items-center justify-center shadow-xl shadow-brand-500/20 animate-pulse">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-3 text-brand-700 dark:text-brand-400 font-semibold text-base mb-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>{message}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
        Kanyakumari Dist Government Model School
      </p>
    </div>
  );
};
