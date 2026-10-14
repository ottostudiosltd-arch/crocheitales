import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your crochet basket is empty',
  description = 'Looks like you haven\'t added any handmade wonders to your bag yet.',
  icon,
  actionText = 'Start Exploring',
  actionHref = '/shop',
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto space-y-4 bg-white/70 backdrop-blur-sm rounded-3xl border border-brand-border/70 shadow-soft my-8',
        className
      )}
    >
      {/* Decorative Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-softPink/60 text-brand-burgundy flex items-center justify-center shadow-inner">
        {icon || <ShoppingBag className="w-8 h-8 stroke-[1.5]" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl text-brand-burgundy font-normal">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && (
        <div className="pt-2">
          {onActionClick ? (
            <Button
              variant="primary"
              onClick={onActionClick}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {actionText}
            </Button>
          ) : (
            <a href={actionHref}>
              <Button
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {actionText}
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
