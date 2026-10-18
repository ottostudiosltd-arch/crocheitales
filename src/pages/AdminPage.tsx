import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Lock,
  Mail,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { minorToMajor } from '../lib/supabase';
import { fetchProducts } from '../services/productService';
import { fetchAllAdminOrders } from '../services/orderService';
import { useAuthStore } from '../stores/authStore';
import { ImageOptimizerUpload } from '../components/admin/ImageOptimizerUpload';
import { ProductManager } from '../components/admin/ProductManager';
import { OrderManager } from '../components/admin/OrderManager';
import {
  checkAdminLockout,
  recordFailedAdminAttempt,
  resetAdminAttempts,
} from '../utils/security';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, signIn, signOut } = useAuthStore();

  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard data state
  const [productsCount, setProductsCount] = useState(8);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'storage'>('orders');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        fetchProducts(),
        fetchAllAdminOrders(),
      ]);
      setProductsCount(prods.length || 8);
      setOrders(ords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // 1. Check brute-force lockout
    const lockout = checkAdminLockout();
    if (lockout.locked) {
      setLoginError(`Security Lockout: Too many failed attempts. Please wait ${lockout.remainingSec}s before retrying.`);
      return;
    }

    setIsAuthenticating(true);

    try {
      const { error } = await signIn(adminEmail, adminPassword);
      if (error) {
        const attemptResult = recordFailedAdminAttempt();
        if (attemptResult.locked) {
          setLoginError('Security Lockout: Maximum failed attempts exceeded. Form locked for 3 minutes.');
        } else {
          setLoginError(`${error} (${attemptResult.remainingAttempts} attempts remaining before temporary lockout)`);
        }
      } else {
        resetAdminAttempts();
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // If NOT authenticated, show the secure Admin Portal login screen
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#F2DCD1] p-6 sm:p-8 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#FDE8EE]/50 pointer-events-none" />

          <div className="w-14 h-14 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center mx-auto border border-[#FAD3DC]">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#79002F] text-white">
              Restricted Area
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#5C0024] pt-1">
              Admin Portal
            </h1>
            <p className="text-xs text-[#79002F]/75 max-w-xs mx-auto">
              Please authenticate with your verified store administrator credentials.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@crochietales.in"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5C0024] mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C5D67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-full bg-[#79002F] text-white text-xs sm:text-sm font-semibold hover:bg-[#5C0024] active:scale-98 transition-all shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAuthenticating ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </button>
          </form>

          <p className="text-[10px] text-[#79002F]/60">
            Protected by Supabase PostgreSQL Row Level Security (RLS)
          </p>
        </div>
      </div>
    );
  }

  // If authenticated as a customer but NOT an administrator, block access
  if (user && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-red-200 p-6 sm:p-8 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
              Access Restricted
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#5C0024]">
              Admin Privileges Required
            </h1>
            <p className="text-xs text-[#79002F]/75 max-w-xs mx-auto">
              Your account ({user.email}) does not possess verified boutique administrator privileges.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Button variant="primary" onClick={() => signOut()} className="w-full">
              Sign In with Authorized Admin Account
            </Button>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount_minor || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-burgundy text-white uppercase">
              {isAdmin ? '👑 Verified Store Administrator' : 'Admin Session'}
            </span>
            <span className="text-xs text-brand-text-muted">
              {user.email}
            </span>
          </div>
          <h1 className="text-3xl font-serif text-brand-burgundy font-bold mt-1">
            Crochei Tales Boutique Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <a
            href="https://supabase.com/dashboard/project/rclxmrnzqpcdnojxahem/editor"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Supabase Editor
            </Button>
          </a>

          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-1 text-red-600" />
            <span className="text-red-600">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Total Orders Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">
            ₹{minorToMajor(totalRevenue).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Live Supabase sync</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Orders Queue</span>
            <Package className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">
            {orders.length}
          </p>
          <span className="text-[10px] text-brand-text-muted">iThink Logistics pipeline</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Live Products</span>
            <ShoppingBag className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">
            {productsCount}
          </p>
          <span className="text-[10px] text-brand-text-muted">Database catalog active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Workshops Active</span>
            <GraduationCap className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">
            1 Session
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Beginners Masterclass</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-brand-border/70 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-brand-burgundy text-brand-burgundy bg-brand-cream/30'
              : 'border-transparent text-brand-text-muted hover:text-brand-burgundy hover:bg-brand-cream/10'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders Queue</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy font-bold">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-brand-burgundy text-brand-burgundy bg-brand-cream/30'
              : 'border-transparent text-brand-text-muted hover:text-brand-burgundy hover:bg-brand-cream/10'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Catalog & Stock</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cream text-brand-burgundy font-bold">
            {productsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all border-b-2 ${
            activeTab === 'storage'
              ? 'border-brand-burgundy text-brand-burgundy bg-brand-cream/30'
              : 'border-transparent text-brand-text-muted hover:text-brand-burgundy hover:bg-brand-cream/10'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Free-Tier Storage Optimizer</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            1 GB Safe
          </span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'orders' && (
        <OrderManager orders={orders} onOrderUpdated={loadData} />
      )}

      {activeTab === 'products' && (
        <ProductManager />
      )}

      {activeTab === 'storage' && (
        <ImageOptimizerUpload />
      )}

    </div>
  );
};
