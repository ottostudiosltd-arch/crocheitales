import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went awry in the stitches',
  message = 'We encountered an unexpected error while loading this content. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto space-y-4 bg-white/80 rounded-3xl border border-brand-border shadow-soft my-8',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-50 text-brand-burgundy flex items-center justify-center">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl text-brand-burgundy font-normal">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
