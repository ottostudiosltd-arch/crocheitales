import React from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../../utils/asset';

interface LogoProps {
  variant?: 'burgundy' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'burgundy',
  size = 'md',
  className = '',
}) => {
  const isWhite = variant === 'white';

  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-11 sm:h-12 md:h-13',
    xl: 'h-14 sm:h-16',
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center select-none transition-transform hover:scale-[1.02] ${className}`}
      aria-label="Crochei Tales Home"
    >
      <img
        src={isWhite ? asset('/branding/crochie-tales-logo-white.png') : asset('/branding/crochie-tales-logo-transparent.png')}
        alt="Crochei Tales"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </Link>
  );
};
