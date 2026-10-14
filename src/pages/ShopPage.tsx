import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Flower2,
  Shirt,
  Gift,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { ProductCard, type Product } from '../components/shop/ProductCard';
import { asset } from '../utils/asset';

// Custom icons matching client mockup
const BowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 12c-2-2-4-2.5-6-1.5S3 13 4 15s3.5 2 5.5 1l2.5-4zm0 0c2-2 4-2.5 6-1.5s3 2.5 2 4.5-3.5 2-5.5 1l-2.5-4z" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const KeychainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="4.5" />
    <path d="m11.5 11.5 8.5 8.5M16 20l4-4M18 18l2 2" />
  </svg>
);

const PlushieIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="13" r="7.5" />
    <circle cx="6.5" cy="6.5" r="3" />
    <circle cx="17.5" cy="6.5" r="3" />
    <circle cx="9.5" cy="12" r="0.8" fill="currentColor" />
    <circle cx="14.5" cy="12" r="0.8" fill="currentColor" />
    <path d="M10 15.5c1 .5 3 .5 4 0" />
  </svg>
);

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    { label: 'All', icon: LayoutGrid },
    { label: 'Flower Bouquets', icon: Flower2 },
    { label: 'Hair Accessories', icon: BowIcon },
    { label: 'Keychains', icon: KeychainIcon },
    { label: 'Wearables', icon: Shirt },
    { label: 'Plushies', icon: PlushieIcon },
    { label: 'Gift Sets', icon: Gift },
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      slug: 'tulip-crochet-bouquet',
      title: 'Tulip Crochet Bouquet',
      price: 999,
      originalPrice: 1299,
      rating: 4.8,
      reviewCount: 124,
      imageUrl: asset('/images/products/tulip-bouquet.webp'),
      category: 'Flower Bouquets',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-2',
      slug: 'bow-hair-clip',
      title: 'Bow Hair Clip (Pink)',
      price: 149,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 98,
      imageUrl: asset('/images/products/bow-hair-clip.webp'),
      category: 'Hair Accessories',
      tag: 'Sale',
      inStock: true,
    },
    {
      id: 'prod-3',
      slug: 'daisy-keychain',
      title: 'Daisy Charm Keychain',
      price: 199,
      rating: 4.7,
      reviewCount: 76,
      imageUrl: asset('/images/products/daisy-keychain.webp'),
      category: 'Keychains',
      inStock: true,
    },
    {
      id: 'prod-4',
      slug: 'crochet-cherry-charm',
      title: 'Double Cherry Bag Charm',
      price: 299,
      rating: 4.9,
      reviewCount: 45,
      imageUrl: asset('/images/products/cherry-bag-charm.webp'),
      category: 'Keychains',
      tag: 'New',
      inStock: true,
    },
    {
      id: 'prod-5',
      slug: 'crochet-bunny-plushie',
      title: 'Crochet Bunny Plushie',
      price: 799,
      originalPrice: 999,
      rating: 4.9,
      reviewCount: 88,
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      category: 'Plushies',
      tag: 'New',
      inStock: true,
    },
    {
      id: 'prod-6',
      slug: 'sunflower-crochet-bouquet',
      title: 'Sunflower Crochet Bouquet',
      price: 899,
      originalPrice: 1199,
      rating: 4.9,
      reviewCount: 112,
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
      category: 'Flower Bouquets',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-7',
      slug: 'bunny-keychain-charm',
      title: 'Bunny Keychain Charm',
      price: 249,
      originalPrice: 349,
      rating: 4.7,
      reviewCount: 64,
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      category: 'Keychains',
      tag: 'Sale',
      inStock: true,
    },
    {
      id: 'prod-8',
      slug: 'daisy-knit-cardigan',
      title: 'Daisy Knit Cardigan',
      price: 2499,
      originalPrice: 2999,
      rating: 5.0,
      reviewCount: 39,
      imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
      category: 'Wearables',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-9',
      slug: 'pastel-rose-bouquet',
      title: 'Pastel Rose Crochet Bouquet',
      price: 949,
      originalPrice: 1299,
      rating: 4.8,
      reviewCount: 52,
      imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=80',
      category: 'Flower Bouquets',
      tag: 'New',
      inStock: true,
    },
    {
      id: 'prod-10',
      slug: 'floral-hair-scrunchie',
      title: 'Floral Crochet Hair Scrunchie',
      price: 189,
      originalPrice: 269,
      rating: 4.7,
      reviewCount: 41,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      category: 'Hair Accessories',
      tag: 'Sale',
      inStock: true,
    },
    {
      id: 'prod-11',
      slug: 'strawberry-bag-charm',
      title: 'Strawberry Bag Charm',
      price: 229,
      rating: 4.8,
      reviewCount: 85,
      imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
      category: 'Keychains',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-12',
      slug: 'crochet-cozy-gift-box',
      title: 'Crochet Cozy Gift Box',
      price: 1299,
      originalPrice: 1699,
      rating: 4.9,
      reviewCount: 36,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
      category: 'Gift Sets',
      tag: 'Bestseller',
      inStock: true,
    },
  ];

  const handleAddToCart = (product: Product) => {
    setToastMessage(`Added "${product.title}" to cart! ♡`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const filtered = products
    .filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = !urlQuery || p.title.toLowerCase().includes(urlQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return a.tag === 'New' ? -1 : 1;
      return 0; // featured default
    });

  return (
    <div className="bg-[#FAF5F5] min-h-screen pt-2 sm:pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        {/* Boutique Header - Compact & Raised */}
        <div className="relative text-center max-w-xl mx-auto px-4 pt-1">
          {/* Subtle wavy flourish */}
          <svg
            className="absolute -top-2 left-6 w-20 h-8 text-[#F2C2CD] opacity-60 pointer-events-none hidden sm:block"
            viewBox="0 0 120 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 25 C 25 5, 45 35, 75 15 C 95 0, 110 30, 115 15" strokeLinecap="round" />
          </svg>

          {/* Doodled Heart Top Left */}
          <span className="absolute -top-1 left-12 text-[#E28299] text-base font-handwriting select-none hidden sm:inline-block rotate-[-12deg]">
            ♡
          </span>

          {/* Doodled Heart Top Right */}
          <span className="absolute top-1 right-12 text-[#E28299] text-lg font-handwriting select-none hidden sm:inline-block rotate-[15deg]">
            ♡
          </span>

          <div className="inline-flex items-center justify-center gap-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-[#79002F] tracking-tight leading-tight">
              Our Handcrafted Shop
            </h1>
            <span className="text-[#E28299] text-xl sm:text-2xl font-handwriting select-none rotate-[10deg] translate-y-0.5">
              ♡
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-[13px] text-[#7A5B64] font-normal leading-snug max-w-lg mx-auto">
            Explore our complete gallery of custom crochet creations made with love, care and magic ✨
          </p>
        </div>

        {/* Filter Bar (Unified Pill Container - Slim, Search Removed) */}
        <div className="bg-white rounded-full px-3 py-1.5 shadow-[0_2px_15px_rgba(121,0,47,0.04)] border border-[#F4E8E9] flex items-center justify-between gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-0.5 px-0.5">
            {categories.map(({ label, icon: Icon }) => {
              const isActive = selectedCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedCategory(label)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#79002F] text-white shadow-sm'
                      : 'bg-transparent text-[#4A323A] hover:bg-[#FAF0F2] border border-[#F2DEE2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Pill Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by"
              className="appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs sm:text-[13px] bg-[#FAF2F4] border border-[#EEDDE0] text-[#2E1820] font-medium focus:outline-none focus:border-[#79002F] cursor-pointer hover:border-[#79002F]/60 transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronsUpDown className="w-3 h-3 text-[#8C7A80] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sub-header Bar: Product Count & View Switcher */}
        <div className="flex items-center justify-between text-xs text-[#7A5B64] font-medium px-1">
          <p>
            Showing 1–{filtered.length} of {products.length} products
          </p>

          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#F4E8E9]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#79002F] text-white shadow-sm'
                  : 'text-[#8C7A80] hover:bg-[#FAF0F2]'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#79002F] text-white shadow-sm'
                  : 'text-[#8C7A80] hover:bg-[#FAF0F2]'
              }`}
              aria-label="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Grid / List */}
        {filtered.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'
                : 'grid grid-cols-1 md:grid-cols-2 gap-4'
            }
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F4E8E9] p-8 shadow-sm">
            <p className="font-serif text-lg text-[#79002F]">No products found</p>
            <p className="text-xs sm:text-sm text-[#7A5B64] mt-1">
              Try picking another category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-5 py-2 bg-[#79002F] text-white rounded-full text-xs font-semibold hover:bg-[#5C0024] transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Add to Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#79002F] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium animate-bounce">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
