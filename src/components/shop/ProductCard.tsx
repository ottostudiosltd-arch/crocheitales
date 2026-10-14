import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../stores/cartStore';

export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number; // in INR e.g. 899
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  category?: string;
  tag?: 'Bestseller' | 'Sale' | 'New';
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

// Crown icon for Bestseller badge
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = '',
}) => {
  const [wishlistActive, setWishlistActive] = useState(isWishlisted);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistActive(!wishlistActive);
    onToggleWishlist?.(product.id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      useCartStore.getState().addItem(product, 1);
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-white rounded-3xl border border-[#F4E8E9] p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-card hover:-translate-y-1 shadow-[0_4px_20px_rgba(121,0,47,0.03)]',
        className
      )}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF3F4] mb-2.5">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Tag / Badge */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5 z-10 max-w-[calc(100%-42px)]">
            {product.tag === 'Bestseller' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#79002F] text-white shadow-xs whitespace-nowrap">
                <CrownIcon className="w-2.5 h-2.5 shrink-0" />
                <span>Bestseller</span>
              </span>
            )}
            {product.tag === 'Sale' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF758F] text-white shadow-xs whitespace-nowrap">
                Sale
              </span>
            )}
            {product.tag === 'New' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D96B7A] text-white shadow-xs whitespace-nowrap">
                New
              </span>
            )}
          </div>
        )}

        {/* Floating Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlistActive ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#79002F] transition-all hover:scale-110 active:scale-90 shadow-xs"
        >
          <Heart
            className={cn(
              'w-3.5 h-3.5 transition-colors',
              wishlistActive
                ? 'fill-[#79002F] text-[#79002F]'
                : 'text-[#79002F]'
            )}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${product.slug}`}
            className="block font-medium text-xs sm:text-sm text-[#2E1820] hover:text-[#79002F] transition-colors truncate"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] h-4">
            {product.rating !== undefined ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-bold text-[#2E1820]">
                  {product.rating.toFixed(1)}
                </span>
                {product.reviewCount !== undefined && (
                  <span className="text-[#8C7A80]">({product.reviewCount})</span>
                )}
              </>
            ) : (
              <span className="text-transparent">Rating</span>
            )}
          </div>
        </div>

        {/* Pricing & Cart Action Row (Equalized across all cards) */}
        <div className="flex items-end justify-between mt-2 pt-1.5 border-t border-[#F2DCD1]/50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-[#2E1820] font-sans">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-[#9B8C90] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Consistent height slot for discount tag */}
            <div className="h-4.5 flex items-center mt-0.5">
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="bg-[#FDF0F2] text-[#D9536F] text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border border-[#FADDE3] leading-none">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              ) : (
                <span className="text-[9.5px] text-transparent select-none leading-none">No discount</span>
              )}
            </div>
          </div>

          {/* Circular Burgundy Cart Button */}
          <button
            onClick={handleCartClick}
            aria-label={`Add ${product.title} to cart`}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#79002F] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#5C0024] hover:scale-105 active:scale-95 shadow-xs shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
