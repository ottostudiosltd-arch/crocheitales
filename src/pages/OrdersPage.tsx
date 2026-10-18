import React, { useState, useEffect } from 'react';
import { Truck, ExternalLink, PackageOpen, Clock, Search, Sparkles } from 'lucide-react';
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
            Real-time order status and fulfillment tracking
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
          Have an order ID from your confirmation? Enter it below to check current confirmation, packing, and courier tracking status.
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

            const shipment = Array.isArray(order.shipping_shipments)
              ? order.shipping_shipments[0]
              : order.shipping_shipments || order.shipping;

            const formatStatus = (s: string) => {
              switch (s) {
                case 'pending_confirmation':
                  return 'Pending Confirmation';
                case 'confirmed':
                  return 'Confirmed';
                case 'processing':
                  return 'Processing';
                case 'shipped':
                  return 'Shipped';
                case 'delivered':
                  return 'Delivered';
                case 'cancelled':
                  return 'Cancelled';
                default:
                  return s || 'Pending';
              }
            };

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
                      {formatStatus(order.status)}
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
                  {shipment?.awb_code ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
                        <span>
                          AWB: <strong className="font-mono">{shipment.awb_code}</strong> ({shipment.courier_name || 'Courier Partner'})
                        </span>
                      </div>
                      {shipment.shipping_label_url ? (
                        <a
                          href={shipment.shipping_label_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-burgundy font-semibold hover:underline"
                        >
                          <span>Shipping Label</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {shipment.tracking_status || 'Manifest Generated'}
                        </span>
                      )}
                    </>
                  ) : order.status === 'pending_confirmation' ? (
                    <div className="flex items-center gap-2 text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60 w-full sm:w-auto">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Awaiting 1-click customer WhatsApp confirmation before dispatch</span>
                    </div>
                  ) : order.status === 'confirmed' ? (
                    <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/60 w-full sm:w-auto">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Order confirmed! Preparing handcrafted pieces for dispatch</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-brand-burgundy/80">
                      <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
                      <span>Fulfillment: Handcrafted packaging in progress</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
