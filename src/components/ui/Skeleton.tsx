import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Shimmer Skeleton primitive
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'shimmer-effect rounded-2xl animate-pulse bg-[#FCEEF1]',
        className
      )}
      {...props}
    />
  );
};

/**
 * Product Card Skeleton matching boutique ProductCard layout
 */
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#F4E8E9] p-3 sm:p-3.5 flex flex-col justify-between shadow-[0_4px_20px_rgba(121,0,47,0.03)]',
        className
      )}
    >
      {/* Image Skeleton with badge slot */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2.5">
        <Skeleton className="w-full h-full rounded-2xl" />
        <div className="absolute top-2.5 left-2.5 w-16 h-4 rounded-full bg-white/70" />
      </div>

      {/* Info Skeleton */}
      <div className="space-y-2 pt-1">
        <Skeleton className="w-4/5 h-3.5 rounded-md" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="w-10 h-3 rounded-md" />
        </div>

        {/* Price & Action Row */}
        <div className="flex items-end justify-between pt-2 border-t border-[#F2DCD1]/40">
          <div className="space-y-1">
            <Skeleton className="w-14 h-4 rounded-md" />
            <Skeleton className="w-10 h-2.5 rounded-md" />
          </div>
          <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Responsive Product Grid Skeleton
 */
export const ProductGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Category Card Skeleton
 */
export const CategoryCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#FAD3DC]/90 overflow-hidden shadow-2xs flex flex-col justify-between',
        className
      )}
    >
      <div className="w-full aspect-[4/3] relative">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-4 sm:p-4.5 flex items-center justify-between">
        <div className="space-y-1.5 flex-1 pr-2">
          <Skeleton className="w-2/3 h-4 rounded-md" />
          <Skeleton className="w-full h-3 rounded-md" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      </div>
    </div>
  );
};

/**
 * Category Grid Skeleton
 */
export const CategoryGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Product Detail Page Skeleton
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <Skeleton className="w-36 h-4 rounded-md" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Image Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <Skeleton className="w-full aspect-square rounded-3xl" />
          <div className="flex gap-2">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <Skeleton className="w-16 h-16 rounded-xl" />
            <Skeleton className="w-16 h-16 rounded-xl" />
          </div>
        </div>

        {/* Right Product Info */}
        <div className="lg:col-span-6 space-y-4 pt-2">
          <Skeleton className="w-24 h-5 rounded-full" />
          <Skeleton className="w-3/4 h-8 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-4 rounded-md" />
            <Skeleton className="w-20 h-4 rounded-md" />
          </div>
          <Skeleton className="w-28 h-7 rounded-lg" />
          <Skeleton className="w-full h-20 rounded-2xl" />
          <div className="pt-4 flex gap-3">
            <Skeleton className="w-28 h-11 rounded-full" />
            <Skeleton className="flex-1 h-11 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
