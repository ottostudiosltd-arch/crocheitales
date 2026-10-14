import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, GraduationCap, TrendingUp, RefreshCw } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { minorToMajor } from '../lib/supabase';
import { fetchProducts } from '../services/productService';
import { fetchUserOrders } from '../services/orderService';
import { useAuthStore } from '../stores/authStore';

export const AdminPage: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const [productsCount, setProductsCount] = useState(8);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        fetchProducts(),
        fetchUserOrders(),
      ]);
      setProductsCount(prods.length || 8);
      setOrders(ords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount_minor || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-burgundy text-white uppercase">
            {isAdmin ? '👑 Verified Store Admin' : 'Admin Preview'}
          </span>
          <h1 className="text-3xl font-serif text-brand-burgundy font-bold mt-1">
            Crochei Tales Boutique Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </Button>
          <a
            href="https://supabase.com/dashboard/project/rclxmrnzqpcdnojxahem/editor"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="primary" size="sm">
              Open Supabase Table Editor ↗
            </Button>
          </a>
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
          <span className="text-[10px] text-brand-text-muted">Shiprocket pipeline</span>
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

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-brand-burgundy">
            Recent Store Orders (Fulfillment Queue)
          </h2>
          <span className="text-xs text-brand-text-muted">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} in database
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center text-sm text-brand-text-muted">
            No orders placed yet. Place an order from checkout to see it live here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/50 border-b border-brand-border text-xs uppercase text-brand-text-muted">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-cream/20 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-brand-burgundy">
                      #{ord.order_number}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-brand-text-muted">
                      {ord.order_items?.length || 1} item(s)
                    </td>
                    <td className="px-4 py-3.5 font-semibold">
                      ₹{minorToMajor(ord.total_amount_minor).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className="uppercase">
                        {ord.payment_method || 'COD'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="bestseller" className="capitalize">
                        {ord.status || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-brand-text-muted">
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
