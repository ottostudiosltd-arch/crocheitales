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
  MessageCircle,
  Sparkles,
  Plus,
  Truck,
  X,
  Check,
  Ban,
  Send,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { minorToMajor } from '../../lib/supabase';
import {
  updateOrderStatus,
  cancelOrder,
  placeOrder,
  retryTelegramNotification,
} from '../../services/orderService';
import { useAuthStore } from '../../stores/authStore';

interface OrderManagerProps {
  orders: any[];
  onOrderUpdated: () => void;
}

const DEFAULT_DEMO_ORDER = {
  id: 'demo-order-849201',
  order_number: 'CT-849201',
  status: 'pending_confirmation',
  payment_status: 'pending',
  payment_method: 'cod',
  total_amount_minor: 84800,
  subtotal_amount_minor: 76900,
  shipping_amount_minor: 7900,
  shipping_address_snapshot: {
    fullName: 'Priya Sharma',
    phone: '9876543210',
    addressLine1: 'Flat 402, Green Park Apartments',
    addressLine2: 'Lane 7, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
  },
  customer_notes: 'Please pack in a lovely gift box with ribbon if possible! ♡',
  created_at: new Date().toISOString(),
  confirmed_at: null,
  cancelled_at: null,
  cancelled_reason: null,
  order_items: [
    {
      id: 'demo-item-1',
      title_snapshot: 'Tulip Crochet Bouquet',
      price_snapshot_minor: 59900,
      quantity: 1,
      total_minor: 59900,
    },
    {
      id: 'demo-item-2',
      title_snapshot: 'Daisy Keychain',
      price_snapshot_minor: 17000,
      quantity: 1,
      total_minor: 17000,
    },
  ],
  isDemo: true,
  shipping_shipments: null,
};

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, onOrderUpdated }) => {
  const { user } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('demo-order-849201');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Customer declined via WhatsApp');

  // Shipment feedback state
  const [shipmentNotice, setShipmentNotice] = useState<{ id: string; text: string } | null>(null);

  // If no database orders exist yet, display the demo order for immediate testing
  const displayOrders = orders && orders.length > 0 ? orders : [DEFAULT_DEMO_ORDER];

  // Calculate counts for quick badges
  const pendingCount = displayOrders.filter(
    (o) => o.status === 'pending_confirmation' || o.status === 'pending'
  ).length;

  // 1. Manual Confirmation Action
  const handleConfirmOrder = async (ord: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (ord.isDemo) {
      ord.status = 'confirmed';
      ord.confirmed_at = new Date().toISOString();
      alert(`Demo Order #${ord.order_number} marked as Confirmed! Ready for iThink shipment creation.`);
      return;
    }

    setActionLoadingId(ord.id);
    try {
      const res = await updateOrderStatus(
        ord.id,
        'confirmed',
        'Customer confirmed order details via WhatsApp.',
        user?.id
      );
      if (res.success) {
        onOrderUpdated();
      } else {
        alert('Failed to confirm order: ' + res.error);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // 2. Cancellation Action
  const handleConfirmCancellation = async () => {
    if (!cancellingOrder) return;
    const ord = cancellingOrder;

    if (ord.isDemo) {
      ord.status = 'cancelled';
      ord.cancelled_at = new Date().toISOString();
      ord.cancelled_reason = cancelReason;
      setCancellingOrder(null);
      alert(`Demo Order #${ord.order_number} marked as Cancelled.`);
      return;
    }

    setActionLoadingId(ord.id);
    try {
      const res = await cancelOrder(ord.id, cancelReason, user?.id);
      if (res.success) {
        setCancellingOrder(null);
        onOrderUpdated();
      } else {
        alert('Failed to cancel order: ' + res.error);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Telegram Notification Retry Handler
  const handleRetryTelegram = async (ord: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (ord.isDemo) {
      alert('Sample order simulated: Telegram notification sent.');
      return;
    }

    setActionLoadingId(`tg-${ord.id}`);
    try {
      const res = await retryTelegramNotification(ord.id);
      if (res.success) {
        alert('🎉 Telegram order alert dispatched successfully!');
        onOrderUpdated();
      } else {
        alert('⚠️ Telegram notification result: ' + (res.error || 'Please check Supabase Edge Function secrets.'));
        onOrderUpdated();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. WhatsApp 1-Click Confirmation Link Generator
  const sendWhatsAppConfirmation = (ord: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const addr = ord.shipping_address_snapshot as any;
    const customerName = addr?.fullName || 'there';
    const rawPhone = addr?.phone || '';

    // Clean phone number to WhatsApp international format without '+' or '-'
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const orderNumber = ord.order_number;
    const total = minorToMajor(ord.total_amount_minor);
    const items = ord.order_items || [];
    const itemsText =
      items.length > 0
        ? items
            .map(
              (i: any) =>
                `• ${i.title_snapshot} × ${i.quantity} (₹${minorToMajor(i.total_minor)})`
            )
            .join('\n')
        : '• Handcrafted Crochet Items';

    const deliveryAddress = `${addr?.addressLine1 || ''}${
      addr?.addressLine2 ? ', ' + addr.addressLine2 : ''
    }, ${addr?.city || ''}, ${addr?.state || ''} - ${addr?.postalCode || ''}`;

    const message =
`Hello ${customerName}! 🌸
Thank you for your order with Crochie Tales! ♡

We received your order #${orderNumber}:
${itemsText}

💰 Total Amount: ₹${total.toLocaleString('en-IN')} (Cash on Delivery)
📍 Delivery Address: ${deliveryAddress}

Please reply with *CONFIRM* so our artisans can lovingly pack and dispatch your handmade parcel! 🧶✨`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // 4. Shipment Trigger Action (available ONLY after confirmation)
  const handleInitiateShipment = (ord: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (ord.status === 'pending_confirmation' || ord.status === 'pending') {
      alert('⚠️ Shipping Locked: Please confirm this order with the customer on WhatsApp and click "Mark as Confirmed" before generating an iThink shipment.');
      return;
    }

    setShipmentNotice({
      id: ord.id,
      text: 'iThink Logistics provider adapter queued for Phase 6 dispatch.',
    });
    setTimeout(() => setShipmentNotice(null), 4000);
  };

  // 5. Insert Live Test Order into Supabase for testing
  const handleCreateTestOrder = async () => {
    setIsCreatingDemo(true);
    try {
      const res = await placeOrder({
        items: [
          {
            id: 'ws-demo-tulip',
            slug: 'tulip-bouquet',
            title: 'Tulip Crochet Bouquet',
            price: 599,
            quantity: 1,
            imageUrl: '/images/products/tulip-bouquet.webp',
          },
          {
            id: 'ws-demo-daisy',
            slug: 'daisy-keychain',
            title: 'Daisy Keychain',
            price: 249,
            quantity: 1,
            imageUrl: '/images/products/daisy-keychain.webp',
          },
        ],
        shippingAddress: {
          fullName: 'Ananya Deshmukh',
          phone: '9822012345',
          email: 'ananya@example.com',
          addressLine1: 'Row House 12, Blossom Enclave',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411038',
        },
        notes: 'Please confirm via WhatsApp before dispatch! ♡',
      });

      if (res.success) {
        onOrderUpdated();
      } else {
        alert('Could not insert test order: ' + res.error);
      }
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
      case 'pending':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Pending Confirmation</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Confirmed</span>
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-700" />
            <span>Processing</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 inline-flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-700" />
            <span>Shipped</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 border border-green-300 inline-flex items-center gap-1">
            <Check className="w-3 h-3 text-green-700" />
            <span>Delivered</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300 inline-flex items-center gap-1">
            <Ban className="w-3 h-3 text-red-700" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  const filteredOrders = displayOrders.filter((ord) => {
    let matchesStatus = true;
    if (filterStatus === 'pending_confirmation') {
      matchesStatus = ord.status === 'pending_confirmation' || ord.status === 'pending';
    } else if (filterStatus !== 'all') {
      matchesStatus = ord.status?.toLowerCase() === filterStatus.toLowerCase();
    }

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy border border-brand-border">
              Order Fulfillment Center
            </span>
            {pendingCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {pendingCount} Pending WhatsApp Confirmation
              </span>
            )}
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy mt-1">
            Customer Orders & Order Pipeline
          </h2>
          <p className="text-xs text-brand-text-muted mt-0.5">
            Confirm COD orders on WhatsApp, update statuses, and prepare packages for iThink Logistics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCreateTestOrder}
            disabled={isCreatingDemo}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isCreatingDemo ? 'Creating...' : '+ Test Order in DB'}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'pending_confirmation', label: `Pending Confirmation (${pendingCount})` },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'processing', label: 'Processing' },
          { key: 'shipped', label: 'Shipped' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === tab.key
                ? 'bg-brand-burgundy text-white shadow-xs'
                : 'bg-brand-cream/60 text-brand-text-muted hover:bg-brand-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-brand-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by order number (CT-849201), customer name, or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-cream/30 focus:bg-white focus:outline-none focus:border-brand-burgundy transition-all"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-xs text-brand-text-muted space-y-2">
          <Package className="w-8 h-8 mx-auto text-brand-text-muted/60 stroke-[1.5]" />
          <p>No orders found matching your search filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const addr = ord.shipping_address_snapshot as any;
            const isExpanded = expandedOrderId === ord.id;
            const items = ord.order_items || [];
            const isDemo = ord.isDemo;
            const isPending = ord.status === 'pending_confirmation' || ord.status === 'pending';
            const isCancelled = ord.status === 'cancelled';

            const shipment = Array.isArray(ord.shipping_shipments)
              ? ord.shipping_shipments[0]
              : ord.shipping_shipments || null;

            return (
              <div
                key={ord.id}
                className={`border rounded-2xl overflow-hidden bg-white transition-all shadow-xs ${
                  isDemo
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : isPending
                    ? 'border-amber-300/80 bg-amber-50/10'
                    : 'border-brand-border/70 hover:border-brand-burgundy/40'
                }`}
              >
                {/* Order Summary Header Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-softPink text-brand-burgundy flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      CT
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-brand-burgundy">
                          #{ord.order_number}
                        </span>
                        {isDemo && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Sample / Dummy Order
                          </span>
                        )}
                        {getStatusBadge(ord.status)}
                        {ord.notification_status === 'failed' && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1"
                            title={ord.notification_error || 'Telegram delivery failed'}
                          >
                            <AlertCircle className="w-3 h-3 text-red-600" />
                            Telegram Failed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-text-primary font-medium mt-0.5">
                        {addr?.fullName || 'Guest Customer'} &bull;{' '}
                        <span className="text-brand-text-muted">
                          {addr?.city || 'Pune'} ({addr?.phone || 'No phone'})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
                    {/* Amount & Payment Info */}
                    <div className="text-left md:text-right mr-1">
                      <p className="font-bold text-sm text-brand-burgundy">
                        ₹{minorToMajor(ord.total_amount_minor).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {ord.payment_method?.toUpperCase() || 'COD'}
                      </span>
                    </div>

                    {/* WhatsApp Click-to-Chat Action */}
                    <button
                      onClick={(e) => sendWhatsAppConfirmation(ord, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs transition-all shadow-xs active:scale-95 shrink-0"
                      title="Send pre-filled confirmation receipt to customer on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp Confirmation</span>
                    </button>

                    {/* Manual Confirmation Button (when pending) */}
                    {isPending && (
                      <button
                        onClick={(e) => handleConfirmOrder(ord, e)}
                        disabled={actionLoadingId === ord.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs active:scale-95 shrink-0"
                        title="Mark order as confirmed after customer replies on WhatsApp"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Mark as Confirmed</span>
                      </button>
                    )}

                    {/* Shipment Trigger Button */}
                    {shipment?.awb_code ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shrink-0">
                        <Truck className="w-3 h-3 text-blue-600" />
                        <span>AWB: {shipment.awb_code}</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleInitiateShipment(ord, e)}
                        disabled={isPending || isCancelled}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                          isPending || isCancelled
                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                            : 'bg-brand-burgundy text-white hover:bg-[#5C0024] shadow-xs'
                        }`}
                        title={
                          isPending
                            ? 'Awaiting customer WhatsApp confirmation before shipment can be created'
                            : 'Generate shipment via iThink Logistics'
                        }
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isPending ? '🔒 Ship (Awaiting Conf.)' : 'Create iThink Shipment'}</span>
                      </button>
                    )}

                    <div className="text-brand-text-muted hidden sm:block">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {shipmentNotice?.id === ord.id && (
                  <div className="mx-4 mb-3 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                    ℹ️ {shipmentNotice?.text}
                  </div>
                )}

                {/* Expanded Details View */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-3 border-t border-brand-border/40 bg-brand-cream/10 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Address Snapshot */}
                      <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-2">
                        <span className="font-semibold text-brand-burgundy flex items-center gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5" />
                          Delivery Address Snapshot
                        </span>
                        <div className="text-brand-text-muted text-[11px] space-y-0.5">
                          <p className="font-semibold text-brand-text-primary text-xs">
                            {addr?.fullName}
                          </p>
                          <p>{addr?.addressLine1}</p>
                          {addr?.addressLine2 && <p>{addr?.addressLine2}</p>}
                          <p>
                            {addr?.city}, {addr?.state} - <strong>{addr?.postalCode}</strong>
                          </p>
                          <p className="flex items-center gap-2 pt-1.5 text-brand-burgundy font-semibold">
                            <Phone className="w-3.5 h-3.5" />
                            <a href={`tel:${addr?.phone}`} className="hover:underline">
                              +91 {addr?.phone}
                            </a>
                            {addr?.email && (
                              <span className="text-brand-text-muted font-normal text-[10px]">
                                ({addr.email})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Order Timeline & Status Details */}
                      <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-2.5">
                        <span className="font-semibold text-brand-burgundy flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          Order Timeline & Actions
                        </span>

                        <div className="space-y-1.5 text-[11px] text-brand-text-muted">
                          <div className="flex items-center justify-between">
                            <span>Placed at:</span>
                            <span className="font-medium text-brand-text-primary">
                              {new Date(ord.created_at).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>WhatsApp Confirmed:</span>
                            <span className="font-medium text-brand-text-primary">
                              {ord.confirmed_at
                                ? new Date(ord.confirmed_at).toLocaleString('en-IN', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                  })
                                : 'Awaiting confirmation'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Telegram Alert:</span>
                            <div>
                              {ord.notification_status === 'sent' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Sent to Admin
                                </span>
                              ) : ord.notification_status === 'failed' ? (
                                <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 cursor-help"
                                    title={ord.notification_error || 'Telegram delivery failed'}
                                  >
                                    <AlertCircle className="w-3 h-3 text-red-600" />
                                    Failed ({ord.notification_retries || 1})
                                  </span>
                                  <button
                                    onClick={(e) => handleRetryTelegram(ord, e)}
                                    disabled={actionLoadingId === `tg-${ord.id}`}
                                    className="text-[10px] font-semibold text-brand-burgundy hover:underline flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-cream/80 hover:bg-brand-cream border border-brand-border/60"
                                  >
                                    <RefreshCw className={`w-2.5 h-2.5 ${actionLoadingId === `tg-${ord.id}` ? 'animate-spin' : ''}`} />
                                    {actionLoadingId === `tg-${ord.id}` ? 'Retrying...' : 'Retry Alert'}
                                  </button>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    Pending
                                  </span>
                                  <button
                                    onClick={(e) => handleRetryTelegram(ord, e)}
                                    disabled={actionLoadingId === `tg-${ord.id}`}
                                    className="text-[10px] font-semibold text-brand-burgundy hover:underline flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-cream/80 hover:bg-brand-cream border border-brand-border/60"
                                  >
                                    <Send className={`w-2.5 h-2.5 ${actionLoadingId === `tg-${ord.id}` ? 'animate-spin' : ''}`} />
                                    {actionLoadingId === `tg-${ord.id}` ? 'Sending...' : 'Send Alert'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {ord.notification_error && ord.notification_status === 'failed' && (
                            <div className="text-[10px] text-red-600 bg-red-50/70 p-2 rounded-lg border border-red-200">
                              <span className="font-semibold">Delivery Error:</span> {ord.notification_error}
                            </div>
                          )}

                          {ord.cancelled_at && (
                            <div className="flex flex-col gap-0.5 text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                              <span className="font-bold">Cancelled:</span>
                              <span>Reason: {ord.cancelled_reason || 'Customer request'}</span>
                            </div>
                          )}
                        </div>

                        {/* Order Actions */}
                        <div className="pt-2 border-t border-brand-border/50 flex flex-wrap items-center gap-2">
                          <button
                            onClick={(e) => sendWhatsAppConfirmation(ord, e)}
                            className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                            title="Open WhatsApp chat with pre-filled order receipt"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp Confirmation</span>
                          </button>

                          {isPending && (
                            <button
                              onClick={(e) => handleConfirmOrder(ord, e)}
                              disabled={actionLoadingId === ord.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Confirmed</span>
                            </button>
                          )}

                          {!isCancelled && ord.status !== 'delivered' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancellingOrder(ord);
                              }}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs flex items-center gap-1"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Cancel Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-burgundy text-[11px]">
                          Ordered Items ({items.length})
                        </span>
                        <span className="text-[11px] text-brand-text-muted">
                          Subtotal: ₹{minorToMajor(ord.subtotal_amount_minor || 0)} + Shipping: ₹{minorToMajor(ord.shipping_amount_minor || 0)} = <strong>₹{minorToMajor(ord.total_amount_minor)} (COD)</strong>
                        </span>
                      </div>

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
                                × {item.quantity} (₹{minorToMajor(item.price_snapshot_minor)} each)
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

      {/* Cancellation Reason Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F2DCD1] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                <h3 className="font-serif font-bold text-base text-[#5C0024]">
                  Cancel Order #{cancellingOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-brand-text-muted">
              Please specify the cancellation reason for the audit trail:
            </p>

            <div className="space-y-2">
              {[
                'Customer declined via WhatsApp',
                'Customer unreachable after multiple attempts',
                'Customer requested cancellation',
                'Invalid address or pincode',
                'Duplicate test order',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-brand-border/60 hover:bg-brand-cream/30 text-xs cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="accent-[#79002F]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingOrder(null)}
              >
                Go Back
              </Button>
              <button
                onClick={handleConfirmCancellation}
                disabled={actionLoadingId === cancellingOrder.id}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {actionLoadingId === cancellingOrder.id ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
