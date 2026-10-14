import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cream' | 'white' | 'softPink' | 'burgundy';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'white',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      white: 'bg-white border border-brand-border/60 shadow-soft',
      cream: 'bg-brand-cream border border-brand-border/80 shadow-soft',
      softPink: 'bg-brand-softPink/60 border border-brand-border shadow-soft',
      burgundy: 'bg-brand-burgundy text-white shadow-card',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          variants[variant],
          hoverable && 'hover:-translate-y-1 hover:shadow-card cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
