import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 shadow-lg shadow-red-500/10">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
        Access Denied
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        You do not have the required role permissions to view this resource. If you believe this is an error, please contact the School Administrator.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button size="sm" leftIcon={<Home className="w-4 h-4" />} onClick={() => navigate('/app')}>
          Dashboard
        </Button>
      </div>
    </div>
  );
};
