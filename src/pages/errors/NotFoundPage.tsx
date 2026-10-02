import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-xl">
        <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
      </div>
      <h1 className="text-6xl font-display font-black text-brand-600 mb-2">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        The page you are looking for does not exist, has been moved, or belongs to a future development phase.
      </p>
      <Link to="/app">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Return to Portal
        </Button>
      </Link>
    </div>
  );
};
