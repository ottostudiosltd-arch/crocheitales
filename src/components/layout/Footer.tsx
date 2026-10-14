import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../brand/Logo';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* 1. Mobile Small Minimal Footer Strip (Always displayed on mobile screens < lg) */}
      <footer className="block lg:hidden relative bg-[#6E0A29] text-white border-t border-white/15 pb-20 pt-4 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center text-[11px] text-white/80 gap-1.5">
          <p>© 2025 Crochei Tales. All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Made with <span className="text-white">♡</span> for all the handmade lovers.
          </p>
        </div>
      </footer>

      {/* 2. Desktop Minimal Footer Strip for non-home pages */}
      {!isHomePage && (
        <footer className="hidden lg:block relative bg-[#6E0A29] text-white mt-auto border-t border-white/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-white/70 gap-2">
            <p>© 2025 Crochei Tales. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-white">♡</span> for all the handmade lovers.
            </p>
          </div>
        </footer>
      )}

      {/* 3. Full Rich Desktop Footer for Home page (hidden on mobile) */}
      {isHomePage && (
        <footer className="hidden lg:block relative bg-[#6E0A29] text-white mt-12 pb-8">
          {/* Signature Scalloped Wave Decorative Border */}
          <div className="scalloped-divider -mt-3.5" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 10px 0, transparent 0, transparent 10px, #6E0A29 11px)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand Logo & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="white" size="md" />
            <p className="text-sm text-white/85 max-w-sm leading-relaxed font-normal">
              Handmade Crochet Pieces <br />
              for Brighter Days
            </p>

            {/* Social Channels (SVG Icons) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.224-.174.271-.4.165-1.49-.693-2.42-2.872-2.42-4.621 0-3.763 2.734-7.221 7.88-7.221 4.195 0 7.455 2.989 7.455 6.985 0 4.167-2.628 7.522-6.275 7.522-1.226 0-2.379-.637-2.774-1.39l-.756 2.878c-.274 1.055-1.018 2.377-1.518 3.19C9.284 23.834 10.609 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-base tracking-wide text-white font-bold">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/#contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Info */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-base tracking-wide text-white font-bold">
              Help & Info
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/80">
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/return-exchange" className="hover:text-white transition-colors">Return & Exchange</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-center space-y-2">
            <span className="font-handwriting text-2xl sm:text-3xl text-white">
              Let's stay connected
            </span>
            <div className="text-white/80">
              <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M24 38C24 38 10 26 10 16C10 10.5 14.5 6 20 6C23 6 23.5 8 24 9C24.5 8 25 6 28 6C33.5 6 38 10.5 38 16C38 26 24 38 24 38Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-10 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-white/70 gap-2">
          <p>© 2025 Crochei Tales. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-white">♡</span> for all the handmade lovers.
          </p>
        </div>
      </div>
    </footer>
  )}
</>
  );
};

