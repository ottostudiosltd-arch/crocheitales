import React from 'react';
import { MapPin, Package, Heart, LogOut, Phone, Mail, MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-6">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left relative overflow-hidden">
        {/* Soft Background Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#FDE8EE]/50 pointer-events-none" />

        {/* User Avatar */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold border-2 border-[#F3CDD5] shadow-xs shrink-0 mx-auto sm:mx-0">
          T
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#5C0024] tracking-wide">
              Tausif Shaikh
            </h1>
            <span className="inline-flex items-center gap-1 mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#79002F] text-[11px] font-semibold border border-[#FAD3DC] w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span>Valued Crochet Lover</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-[#79002F]/80 pt-0.5">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#8C5D67]" />
              <span>tausif@example.com</span>
            </span>
            <span className="hidden sm:inline text-[#F3CDD5]">•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#8C5D67]" />
              <span>+91 744 724 6150</span>
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => alert('Signed out successfully')}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#F3CDD5] text-[#79002F] text-xs font-semibold hover:bg-[#FCEAEB] active:scale-95 transition-all shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Link
          to="/orders"
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs hover:shadow-xs hover:border-[#79002F]/40 transition-all"
        >
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">1</p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">Active Order</p>
        </Link>

        <Link
          to="/shop"
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs hover:shadow-xs hover:border-[#79002F]/40 transition-all"
        >
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">3</p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">Wishlist Items</p>
        </Link>

        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs">
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">1</p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">Saved Address</p>
        </div>
      </div>

      {/* 3. Navigation Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* My Orders */}
        <Link
          to="/orders"
          className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#F2DCD1] shadow-2xs hover:shadow-sm hover:border-[#79002F]/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCEAEB] text-[#79002F] flex items-center justify-center shrink-0 group-hover:bg-[#79002F] group-hover:text-white transition-colors">
              <Package className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024] tracking-wide">My Orders</h3>
              <p className="text-[11px] text-[#79002F]/70">Track & view history</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C5D67] group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Saved Addresses */}
        <div className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#F2DCD1] shadow-2xs flex items-center justify-between cursor-pointer hover:border-[#79002F]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] text-[#79002F] flex items-center justify-center shrink-0 border border-[#F2DCD1]">
              <MapPin className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024] tracking-wide">Addresses</h3>
              <p className="text-[11px] text-[#79002F]/70">1 saved location</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C5D67]" />
        </div>

        {/* Wishlist */}
        <Link
          to="/shop"
          className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#F2DCD1] shadow-2xs hover:shadow-sm hover:border-[#79002F]/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#79002F] flex items-center justify-center shrink-0 border border-[#FAD3DC] group-hover:bg-[#79002F] group-hover:text-white transition-colors">
              <Heart className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024] tracking-wide">Wishlist</h3>
              <p className="text-[11px] text-[#79002F]/70">3 saved favorites</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C5D67] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4. WhatsApp Support Shortcut */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDE8EE] to-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-between shadow-2xs">
        <div>
          <h4 className="font-serif font-bold text-sm text-[#5C0024]">Need Help or Custom Piece?</h4>
          <p className="text-[11px] text-[#79002F]/80 mt-0.5">Instant WhatsApp support at +91 744 724 6150</p>
        </div>
        <a
          href="https://wa.me/917447246150"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-xs hover:bg-[#20BA5A] active:scale-95 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat</span>
        </a>
      </div>
    </div>
  );
};
