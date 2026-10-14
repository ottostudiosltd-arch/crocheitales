import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'bestseller' | 'sale' | 'new' | 'subtle' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'bestseller',
  children,
  ...props
}) => {
  const variants = {
    bestseller: 'bg-brand-burgundy text-white font-medium',
    sale: 'bg-brand-dustyRose text-white font-medium',
    new: 'bg-brand-blush text-brand-burgundy font-semibold',
    subtle: 'bg-brand-softPink text-brand-burgundy font-medium',
    outline: 'border border-brand-burgundy/40 text-brand-burgundy font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wide select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
