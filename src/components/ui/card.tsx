import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-blue-100/90 bg-white shadow-2xs dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHead: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-blue-100/80 dark:border-slate-800/80 px-5 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        'text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  );
};
