import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Crafting with love...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <div className="relative flex items-center justify-center">
        {/* Spinning yarn-colored ring */}
        <div
          className={cn(
            'rounded-full border-brand-softPink border-t-brand-burgundy animate-spin',
            sizeClasses[size]
          )}
        />
        {/* Tiny yarn heart in center for lg */}
        {size === 'lg' && (
          <span className="absolute text-brand-burgundy text-xs font-handwriting select-none">
            ♡
          </span>
        )}
      </div>
      {label && (
        <p className="text-xs sm:text-sm font-medium text-brand-text-muted animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};
