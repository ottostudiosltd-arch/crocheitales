import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'center',
  viewAllLink,
  viewAllText = 'View All',
  className = '',
}) => {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'relative mb-8 md:mb-12',
        isCentered ? 'text-center' : 'flex flex-col md:flex-row md:items-end justify-between gap-4',
        className
      )}
    >
      <div className={cn('relative', isCentered && 'inline-block')}>
        {/* Decorative Delicate Hearts and Flower Flourish (Authentic to Client Mockup) */}
        <div className={cn('flex items-center gap-2.5', isCentered && 'justify-center')}>
          {/* Left heart flourish */}
          <span className="text-brand-dustyRose font-handwriting text-2xl select-none" aria-hidden="true">
            ♡
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-brand-burgundy tracking-tight">
            {title}
          </h2>

          {/* Right heart flourish */}
          <span className="text-brand-dustyRose font-handwriting text-2xl select-none" aria-hidden="true">
            ♡
          </span>
        </div>

        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-brand-text-muted font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <div className={cn(isCentered ? 'mt-4' : 'mt-2 md:mt-0')}>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-burgundy hover:text-brand-burgundy-dark transition-colors group px-3.5 py-1.5 rounded-full border border-brand-border hover:border-brand-burgundy/40 bg-white/60 hover:bg-white"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
};
