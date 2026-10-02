import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import { Button } from './Button';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800', className)}
      {...props}
    />
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}> = ({
  icon = <FolderOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30', className)}>
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200', className)}>
      <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400 mb-3" />
      <h4 className="text-base font-bold mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-red-600/90 dark:text-red-300/80 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
