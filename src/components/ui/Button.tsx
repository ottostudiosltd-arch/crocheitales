import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-brand-burgundy text-white hover:bg-brand-burgundy-dark shadow-sm hover:shadow-soft active:bg-brand-burgundy-dark',
      secondary:
        'bg-brand-dustyRose text-white hover:bg-brand-dustyRose/90 shadow-sm',
      outline:
        'border-2 border-brand-burgundy text-brand-burgundy hover:bg-brand-softPink/60 active:bg-brand-softPink',
      ghost:
        'text-brand-burgundy hover:bg-brand-softPink/40 active:bg-brand-softPink/70',
      soft:
        'bg-brand-softPink text-brand-burgundy hover:bg-brand-blush/60 active:bg-brand-blush',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-full gap-2',
      lg: 'text-base px-7 py-3 rounded-full gap-2.5',
      icon: 'p-2.5 rounded-full aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
