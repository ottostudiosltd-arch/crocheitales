import React, { useState } from 'react';
import {
  MapPin,
  Package,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Check,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerStore } from '../stores/customerStore';

export const ProfilePage: React.FC = () => {
  const { profile, setProfile, recentOrderNumbers } = useCustomerStore();

  const [fullName, setFullName] = useState(profile.fullName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [addressLine1, setAddressLine1] = useState(profile.addressLine1 || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(profile.postalCode || '');

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      fullName,
      phone,
      email,
      addressLine1,
      city,
      state,
      postalCode,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2600);
  };

  const hasSavedInfo = Boolean(fullName && phone && addressLine1);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-6">
      {/* 1. Header Card with Saved Status */}
      <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#FDE8EE]/50 pointer-events-none" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold border-2 border-[#F3CDD5] shadow-xs shrink-0 mx-auto sm:mx-0">
          {fullName ? fullName[0].toUpperCase() : '♡'}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#5C0024] tracking-wide">
              {fullName || 'Hello, Crochet Lover ♡'}
            </h1>
            <span className="inline-flex items-center gap-1 mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#79002F] text-[11px] font-semibold border border-[#FAD3DC] w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span>{hasSavedInfo ? '1-Click Checkout Ready' : 'Guest Shopper'}</span>
            </span>
          </div>

          <p className="text-xs text-[#79002F]/80 pt-0.5 max-w-lg">
            No password or login needed! Save your delivery details once below so every order is ready for instant 1-click checkout.
          </p>
        </div>
      </div>

      {/* 2. Quick Stat Counters */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Link
          to="/orders"
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs hover:shadow-xs hover:border-[#79002F]/40 transition-all"
        >
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">
            {recentOrderNumbers.length}
          </p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">My Orders</p>
        </Link>

        <Link
          to="/shop"
          className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs hover:shadow-xs hover:border-[#79002F]/40 transition-all"
        >
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">8</p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">Boutique Pieces</p>
        </Link>

        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F2DCD1] text-center shadow-2xs">
          <p className="text-lg sm:text-xl font-serif font-bold text-[#79002F]">
            {hasSavedInfo ? '1' : '0'}
          </p>
          <p className="text-[10px] sm:text-xs text-[#79002F]/75 mt-0.5 font-medium">Saved Address</p>
        </div>
      </div>

      {/* 3. Delivery Details Form (Pre-fills Checkout) */}
      <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2DCD1]">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#5C0024] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#79002F]" />
              <span>My Saved Delivery Information</span>
            </h2>
            <p className="text-[11px] text-[#79002F]/75">
              These details will automatically pre-fill at checkout.
            </p>
          </div>

          {savedToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                Phone Number (for Courier & Tracking Updates) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
              Email Address (Optional, for invoices)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
              Delivery Address (House / Flat No., Street, Landmark) *
            </label>
            <input
              type="text"
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat 302, Lavender Heights, MG Road"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 411001"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#79002F] text-white text-xs font-semibold hover:bg-[#5C0024] active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save Details for 1-Click Checkout</span>
            </button>

            {hasSavedInfo && (
              <span className="text-[11px] text-green-700 font-medium hidden sm:inline">
                ✓ Ready for fast checkout
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 4. Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          to="/orders"
          className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#F2DCD1] shadow-2xs hover:shadow-sm hover:border-[#79002F]/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCEAEB] text-[#79002F] flex items-center justify-center shrink-0 group-hover:bg-[#79002F] group-hover:text-white transition-colors">
              <Package className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024] tracking-wide">
                Track My Orders
              </h3>
              <p className="text-[11px] text-[#79002F]/70">
                View tracking code & iThink Logistics courier status
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C5D67] group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <a
          href="https://wa.me/917447246150"
          target="_blank"
          rel="noreferrer"
          className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#F2DCD1] shadow-2xs hover:shadow-sm hover:border-[#25D366]/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#25D366] flex items-center justify-center shrink-0 border border-green-200">
              <MessageCircle className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024] tracking-wide">
                WhatsApp Support
              </h3>
              <p className="text-[11px] text-[#79002F]/70">
                Chat with artisan directly (+91 744 724 6150)
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C5D67] group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* 5. Discrete Admin Portal Link */}
      <div className="pt-4 border-t border-[#F2DCD1]/60 text-center">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-[#79002F]/60 hover:text-[#79002F] font-medium transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Store Administrator? Sign in to Admin Portal →</span>
        </Link>
      </div>
    </div>
  );
};
