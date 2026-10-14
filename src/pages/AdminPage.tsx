import React from 'react';
import { Package, ShoppingBag, GraduationCap, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AdminPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-burgundy text-white uppercase">
            Admin Management
          </span>
          <h1 className="text-3xl font-serif text-brand-burgundy font-bold mt-1">
            Crochei Tales Boutique Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Add New Product</Button>
          <Button variant="primary" size="sm">Create Workshop</Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">₹48,290</p>
          <span className="text-[10px] text-emerald-600 font-medium">↑ +18% this month</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Orders Pending</span>
            <Package className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">6</p>
          <span className="text-[10px] text-brand-text-muted">Shiprocket sync active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Live Products</span>
            <ShoppingBag className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">24</p>
          <span className="text-[10px] text-brand-text-muted">6 categories</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft">
          <div className="flex items-center justify-between text-brand-text-muted text-xs">
            <span>Workshop Registrations</span>
            <GraduationCap className="w-4 h-4 text-brand-burgundy" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-burgundy mt-2 font-sans">24 / 42</p>
          <span className="text-[10px] text-emerald-600 font-medium">3 active sessions</span>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-burgundy">
          Recent Store Orders (Fulfillment Queue)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-brand-border text-xs uppercase text-brand-text-muted">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Shiprocket Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              <tr>
                <td className="px-4 py-3.5 font-bold text-brand-burgundy">#CT-82914</td>
                <td className="px-4 py-3.5">Priya Sharma</td>
                <td className="px-4 py-3.5 font-semibold">₹1,148</td>
                <td className="px-4 py-3.5"><Badge variant="outline">COD</Badge></td>
                <td className="px-4 py-3.5"><Badge variant="bestseller">AWB Assigned</Badge></td>
                <td className="px-4 py-3.5">
                  <button className="text-xs text-brand-burgundy font-semibold hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
