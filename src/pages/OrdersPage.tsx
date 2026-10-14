import React, { useState, useEffect } from 'react';
import { Truck, ExternalLink, PackageOpen, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useCustomerStore } from '../stores/customerStore';
import { fetchUserOrders, fetchOrderByNumber } from '../services/orderService';
import { minorToMajor } from '../lib/supabase';

export const OrdersPage: React.FC = () => {
  const { recentOrderNumbers } = useCustomerStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search input for order lookup
  const [lookupInput, setLookupInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserOrders({ orderNumbers: recentOrderNumbers }).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [recentOrderNumbers]);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupInput.trim()) return;

    setLookupLoading(true);
    setLookupMessage(null);

    const foundOrder: any = await fetchOrderByNumber(lookupInput.trim());
    setLookupLoading(false);

    if (foundOrder) {
      // Prepend if not already in list
      setOrders((prev) => [
        foundOrder,
        ...prev.filter((o) => o.id !== foundOrder.id),
      ]);
      setLookupMessage(`Found order #${foundOrder.order_number}!`);
    } else {
      setLookupMessage(`No order found matching "${lookupInput.trim()}". Please verify the order number.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-burgundy font-normal">
            Track & View Orders
          </h1>
          <p className="text-xs text-brand-text-muted mt-1">
            Real-time fulfillment tracking via Shiprocket Express
          </p>
        </div>
        <Link to="/shop">
          <Button variant="outline" size="sm">Continue Shopping</Button>
        </Link>
      </div>

      {/* Order Lookup Search Bar */}
      <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#79002F]" />
          <h2 className="font-serif font-bold text-sm sm:text-base text-[#5C0024]">
            Quick Order Lookup
          </h2>
        </div>
        <p className="text-xs text-[#79002F]/75">
          Have an order ID from your confirmation? Enter it below to check current courier status and live Shiprocket tracking.
        </p>

        <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <input
            type="text"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            placeholder="e.g. CT-829140"
            className="flex-1 px-4 py-2.5 text-xs rounded-full border border-[#F2DCD1] bg-[#FFF8F3]/50 focus:bg-white focus:outline-none focus:border-[#79002F]"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={lookupLoading}
            className="rounded-full px-6"
          >
            {lookupLoading ? 'Searching...' : 'Find Order'}
          </Button>
        </form>

        {lookupMessage && (
          <p className="text-xs text-[#79002F] font-medium pt-1">
            {lookupMessage}
          </p>
        )}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center text-brand-burgundy text-sm">
          <div className="w-8 h-8 border-2 border-brand-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading order details...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-border/70 p-12 text-center space-y-4 max-w-lg mx-auto shadow-soft">
          <div className="w-16 h-16 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center mx-auto border border-[#FAD3DC]">
            <PackageOpen className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#5C0024]">No recent orders on this device</h2>
          <p className="text-xs sm:text-sm text-[#79002F]/75 leading-relaxed">
            If you recently placed an order, use the lookup box above with your order confirmation number, or explore our new crochet arrivals.
          </p>
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary">
                Explore Creations →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = order.created_at
              ? new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently placed';

            const awbCode = `SR${order.order_number?.replace(/[^0-9]/g, '') || '992019'}IN`;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-[#F2DCD1] p-6 shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2DCD1]">
                  <div>
                    <span className="text-xs text-brand-text-muted">Order ID:</span>
                    <p className="font-serif font-bold text-brand-burgundy text-lg">
                      #{order.order_number}
                    </p>
                    <span className="text-xs text-brand-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#8C5D67]" />
                      <span>{dateStr}</span>
                      <span className="text-gray-300">•</span>
                      <span className="capitalize">{order.payment_method?.toUpperCase()}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="bestseller" className="capitalize">
                      {order.status || 'Pending'}
                    </Badge>
                    <span className="text-base font-bold text-brand-burgundy font-sans">
                      ₹{minorToMajor(order.total_amount_minor).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-primary">
                        {item.title_snapshot}{' '}
                        <span className="text-brand-text-muted text-xs">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-brand-text-primary">
                        ₹{minorToMajor(item.total_minor).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#F2DCD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-text-muted">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
                    <span>AWB Tracking: <strong>{awbCode}</strong> (Shiprocket Express)</span>
                  </div>
                  <a
                    href={`https://shiprocket.co/tracking/${awbCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-brand-burgundy font-semibold hover:underline"
                  >
                    <span>Track on Shiprocket</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
