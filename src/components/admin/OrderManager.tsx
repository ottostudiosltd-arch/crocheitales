import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { minorToMajor } from '../../lib/supabase';
import { updateOrderStatus, updatePaymentStatus } from '../../services/orderService';

interface OrderManagerProps {
  orders: any[];
  onOrderUpdated: () => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, onOrderUpdated }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        onOrderUpdated();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePayment = async (orderId: string, currentStatus: string) => {
    setUpdatingId(orderId);
    try {
      const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
      const res = await updatePaymentStatus(orderId, newStatus);
      if (res.success) {
        onOrderUpdated();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      filterStatus === 'all' || ord.status?.toLowerCase() === filterStatus.toLowerCase();

    const addr = ord.shipping_address_snapshot as any;
    const customerName = addr?.fullName?.toLowerCase() || '';
    const phone = addr?.phone || '';
    const orderNum = ord.order_number?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      customerName.includes(query) || phone.includes(query) || orderNum.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Orders Queue
            </span>
            <span className="text-xs text-brand-text-muted">
              {orders.length} total orders recorded in Supabase
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy mt-1">
            Customer Orders & Fulfillment
          </h2>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'pending', 'confirmed', 'processing', 'delivered', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-brand-burgundy text-white'
                    : 'bg-brand-cream/60 text-brand-text-muted hover:bg-brand-cream'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-brand-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by order number (CT-123456), customer name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-border bg-brand-cream/30 focus:bg-white focus:outline-none focus:border-brand-burgundy transition-all"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-xs text-brand-text-muted space-y-2">
          <Package className="w-8 h-8 mx-auto text-brand-text-muted/60 stroke-[1.5]" />
          <p>No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => {
            const addr = ord.shipping_address_snapshot as any;
            const isExpanded = expandedOrderId === ord.id;
            const items = ord.order_items || [];

            return (
              <div
                key={ord.id}
                className="border border-brand-border/70 rounded-2xl overflow-hidden bg-white hover:border-brand-burgundy/40 transition-colors"
              >
                {/* Order Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-softPink/60 text-brand-burgundy flex items-center justify-center font-bold text-xs shrink-0">
                      CT
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-burgundy">
                          #{ord.order_number}
                        </span>
                        <Badge
                          variant={ord.status === 'delivered' ? 'bestseller' : 'outline'}
                          className="capitalize text-[10px]"
                        >
                          {ord.status || 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-xs text-brand-text-primary font-medium mt-0.5">
                        {addr?.fullName || 'Guest Customer'} &bull;{' '}
                        <span className="text-brand-text-muted">{addr?.city || 'Pune'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="font-bold text-sm text-brand-burgundy">
                        ₹{minorToMajor(ord.total_amount_minor).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-brand-text-muted">
                        {ord.payment_method?.toUpperCase() || 'COD'} &bull;{' '}
                        <span
                          className={`font-semibold ${
                            ord.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {ord.payment_status?.toUpperCase() || 'PENDING'}
                        </span>
                      </p>
                    </div>

                    <div className="text-brand-text-muted">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details View */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 border-t border-brand-border/40 bg-brand-cream/10 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Address Snapshot */}
                      <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-2">
                        <span className="font-semibold text-brand-burgundy flex items-center gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5" />
                          Delivery Address Snapshot
                        </span>
                        <div className="text-brand-text-muted text-[11px] space-y-0.5">
                          <p className="font-semibold text-brand-text-primary">{addr?.fullName}</p>
                          <p>{addr?.addressLine1}</p>
                          {addr?.addressLine2 && <p>{addr?.addressLine2}</p>}
                          <p>
                            {addr?.city}, {addr?.state} - {addr?.postalCode}
                          </p>
                          <p className="flex items-center gap-1 pt-1 text-brand-burgundy font-medium">
                            <Phone className="w-3 h-3" />
                            {addr?.phone}
                          </p>
                        </div>
                      </div>

                      {/* Fulfillment Status Controls */}
                      <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-3">
                        <span className="font-semibold text-brand-burgundy flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          Update Order Status
                        </span>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-brand-text-muted w-24">
                              Status:
                            </label>
                            <select
                              value={ord.status || 'pending'}
                              disabled={updatingId === ord.id}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className="px-2.5 py-1 text-xs rounded-lg border border-brand-border bg-brand-cream/20 font-semibold focus:outline-none focus:border-brand-burgundy"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-brand-text-muted w-24">
                              Payment:
                            </label>
                            <button
                              onClick={() => handleTogglePayment(ord.id, ord.payment_status)}
                              disabled={updatingId === ord.id}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-colors ${
                                ord.payment_status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {ord.payment_status === 'paid' ? 'Marked as Paid ✓' : 'Mark as Paid'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-2">
                      <span className="font-semibold text-brand-burgundy text-[11px] block">
                        Ordered Items ({items.length})
                      </span>
                      <div className="divide-y divide-brand-border/40">
                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            className="py-2 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-burgundy" />
                              <span className="font-medium text-brand-text-primary">
                                {item.title_snapshot}
                              </span>
                              <span className="text-brand-text-muted text-[11px]">
                                × {item.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-brand-burgundy">
                              ₹{minorToMajor(item.total_minor).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {ord.customer_notes && (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>Customer Note:</strong> {ord.customer_notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
