import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickCategories = [
    { name: 'Flower Bouquets', path: '/categories/flower-bouquets' },
    { name: 'Hair Accessories', path: '/categories/hair-accessories' },
    { name: 'Keychains', path: '/categories/keychains' },
    { name: 'Wearables', path: '/categories/wearables' },
    { name: 'Plushies', path: '/categories/plushies' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-card border border-brand-border p-6 space-y-6">
        {/* Header with Search Input & Close button */}
        <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
          <Search className="w-5 h-5 text-brand-burgundy shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crochet flowers, keychains, plushies..."
            className="w-full text-base sm:text-lg bg-transparent focus:outline-none text-brand-text-primary placeholder:text-brand-text-muted"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-burgundy hover:bg-brand-softPink/50 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions / Popular Categories */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
            Popular Categories
          </span>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={onClose}
                className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-brand-cream hover:bg-brand-softPink text-brand-burgundy transition-colors font-medium border border-brand-border/60"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Action / Full Results Link */}
        <div className="pt-2 flex justify-between items-center text-xs text-brand-text-muted">
          <span>Press ESC or click outside to dismiss</span>
          <Link
            to={`/shop?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="inline-flex items-center gap-1 font-semibold text-brand-burgundy hover:underline"
          >
            <span>View All Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
