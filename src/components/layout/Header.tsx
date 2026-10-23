import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Truck, Heart, Gift, Search, User, ShoppingBag } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../stores/cartStore';

interface HeaderProps {
  cartCount?: number;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount: propCartCount,
  onOpenSearch,
  onOpenCart,
}) => {
  const storeCartCount = useCartStore((s) => s.getTotalItems());
  const cartCount = propCartCount !== undefined ? propCartCount : storeCartCount;
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
    } else if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF1E8]/98 backdrop-blur-md border-b border-[#F2DCD1]/80 transition-all">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#79002F] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 font-normal">
        <div className="max-w-7xl mx-auto flex items-center justify-between tracking-wide">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span>Free Shipping on orders above ₹999</span>
          </div>

          <span className="hidden sm:inline text-white/40">|</span>

          <div className="hidden sm:flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-white/90 fill-white/90 shrink-0" />
            <span>Handmade with Love</span>
          </div>

          <span className="hidden md:inline text-white/40">|</span>

          <div className="hidden md:flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span>Made for your special moments ♡</span>
          </div>

          {/* Heart icon on mobile right */}
          <div className="sm:hidden flex items-center">
            <Heart className="w-3.5 h-3.5 text-white/90 shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 shrink-0">
          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            if (isHash) {
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[15px] font-medium transition-colors hover:text-[#79002F] text-[#4A202A] relative py-1 tracking-normal"
                >
                  {link.name}
                </Link>
              );
            }
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-[15px] font-medium transition-colors hover:text-[#79002F] relative py-1 tracking-normal',
                    isActive
                      ? 'text-[#79002F] font-semibold after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#79002F]'
                      : 'text-[#4A202A]'
                  )
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Search Bar Pill (Directly embedded in header on mobile and desktop as in reference) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center flex-1 max-w-[210px] xs:max-w-[250px] sm:max-w-xs relative mx-1 sm:mx-2"
        >
          <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#8C5D67] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search handmade treasures..."
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm bg-[#FCEAEB]/90 border border-[#F3CDD5] text-[#50242E] placeholder:text-[#9A707A] focus:outline-none focus:border-[#79002F] focus:bg-white transition-all shadow-2xs"
          />
        </form>

        {/* Header Action Icons (User Profile & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Account */}
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-[#FCEAEB] flex items-center justify-center text-[#79002F] hover:bg-[#F8D2DA] hover:scale-105 active:scale-95 transition-all shadow-2xs"
            aria-label="Account"
          >
            <User className="w-4 h-4 stroke-[1.9]" />
          </Link>

          {/* Shopping Cart Bag with Little Badge 2 */}
          <button
            onClick={onOpenCart}
            className="relative w-8 h-8 rounded-full bg-[#FCEAEB] flex items-center justify-center text-[#79002F] hover:bg-[#F8D2DA] hover:scale-105 active:scale-95 transition-all shadow-2xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.9]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#79002F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
