import React, { useState, useEffect } from 'react';
import { Truck, ExternalLink, PackageOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { fetchUserOrders } from '../services/orderService';
import { minorToMajor } from '../lib/supabase';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders(user?.id).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
        <div>
          <h1 className="text-3xl font-serif text-brand-burgundy font-normal">
            My Order History
          </h1>
          <p className="text-xs text-brand-text-muted mt-1">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed with Crochie Tales
          </p>
        </div>
        <Link to="/shop">
          <Button variant="outline" size="sm">Continue Shopping</Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-brand-burgundy text-sm">
          <div className="w-8 h-8 border-2 border-brand-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-border/70 p-12 text-center space-y-4 max-w-lg mx-auto shadow-soft">
          <div className="w-16 h-16 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center mx-auto border border-[#FAD3DC]">
            <PackageOpen className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#5C0024]">No orders found yet</h2>
          <p className="text-xs sm:text-sm text-[#79002F]/75 leading-relaxed">
            When you place an order, its real-time crafting status and Shiprocket tracking updates will appear right here.
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

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-brand-border/60">
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
                      {order.status}
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

                <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-text-muted">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
                    <span>Fulfillment: <strong>Shiprocket Express Delivery</strong></span>
                  </div>
                  <a
                    href="https://shiprocket.co/tracking"
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
