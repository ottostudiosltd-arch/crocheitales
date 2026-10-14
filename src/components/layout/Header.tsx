import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Truck, Heart, Gift, Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { cn } from '../../utils/cn';

interface HeaderProps {
  cartCount?: number;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 2,
  onOpenSearch,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
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
      {/* 1. Top Announcement Bar (Exact text & dividers from mockup) */}
      <div className="bg-[#79002F] text-white text-[11px] sm:text-xs py-1.5 px-4 font-normal">
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
        </div>
      </div>

      {/* 2. Main Navigation Bar - Slim, sleek and elegant */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-[#79002F] rounded-lg hover:bg-black/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Brand Logo - Prominent & clearly visible */}
        <div className="flex items-center shrink-0">
          <Logo size="lg" />
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

        {/* Header Search Bar Pill (As seen in client screenshot) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-xs relative mx-2"
        >
          <Search className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search handmade treasures..."
            className="w-full pl-9 pr-4 py-2 rounded-full text-xs sm:text-sm bg-[#FCEAEB]/90 border border-[#F3CDD5] text-[#50242E] placeholder:text-[#9A707A] focus:outline-none focus:border-[#79002F] focus:bg-white transition-all"
          />
        </form>

        {/* Header Action Icons */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-1.5 text-[#79002F] hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Account */}
          <Link
            to="/profile"
            className="p-1.5 text-[#79002F] hover:opacity-80 transition-opacity"
            aria-label="Account"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </Link>

          {/* Shopping Cart Bag with Little Badge 2 */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 text-[#79002F] hover:opacity-80 transition-opacity"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#79002F] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FAF1E8]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2DCD1] bg-[#FAF1E8] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const isHash = link.path.startsWith('/#');
            if (isHash) {
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium transition-colors text-[#50242E] hover:bg-white/60"
                >
                  {link.name}
                </Link>
              );
            }
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#FBE0E6] text-[#79002F] font-semibold'
                      : 'text-[#50242E] hover:bg-white/60'
                  )
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
