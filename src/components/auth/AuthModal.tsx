import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Sparkles, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, signIn, signUp } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode === 'signup' ? 'signup' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode if changed from store
  React.useEffect(() => {
    if (authModalMode === 'signup' || authModalMode === 'signin') {
      setMode(authModalMode);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          closeAuthModal();
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName, phone);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Account created successfully! Welcome to Crochie Tales ♡');
          setTimeout(() => {
            closeAuthModal();
          }, 1200);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F2DCD1] p-6 sm:p-8 shadow-xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#FDE8EE]/60 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#F2DCD1] flex items-center justify-center text-[#79002F] hover:bg-[#FCEAEB] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FCEAEB] text-[#79002F] mb-1">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#5C0024]">
            {mode === 'signin' ? 'Welcome Back ♡' : 'Join Crochie Tales ♡'}
          </h2>
          <p className="text-xs text-[#79002F]/75">
            {mode === 'signin'
              ? 'Sign in to access your orders, saved addresses & wishlist'
              : 'Create an account for personalized handmade crochet shopping'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-full bg-[#FFF8F3] p-1 border border-[#F2DCD1] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              mode === 'signin'
                ? 'bg-[#79002F] text-white shadow-xs'
                : 'text-[#79002F]/75 hover:text-[#79002F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              mode === 'signup'
                ? 'bg-[#79002F] text-white shadow-xs'
                : 'text-[#79002F]/75 hover:text-[#79002F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#FFF0F3] border border-[#FAD3DC] text-[#79002F] text-xs leading-snug">
            {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs leading-snug flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-green-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-[#79002F] text-white text-xs sm:text-sm font-semibold hover:bg-[#5C0024] active:scale-98 transition-all shadow-md disabled:opacity-50 mt-2"
          >
            {isSubmitting
              ? mode === 'signin'
                ? 'Signing In...'
                : 'Creating Account...'
              : mode === 'signin'
              ? 'Sign In'
              : 'Create My Account'}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-[#F2DCD1]/60 text-center text-[10px] text-[#79002F]/60">
          Handcrafted with pure love by Crochie Tales 🧶
        </div>
      </div>
    </div>
  );
};
