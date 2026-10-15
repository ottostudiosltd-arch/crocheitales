import React, { useState, useEffect } from 'react';
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
  Send,
  Truck,
  ExternalLink,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { minorToMajor } from '../../lib/supabase';
import { updateOrderStatus, updatePaymentStatus, placeOrder } from '../../services/orderService';
import { createShiprocketShipment } from '../../services/shiprocketService';
import {
  getTelegramConfig,
  saveTelegramConfig,
  testTelegramConnection,
} from '../../services/telegramService';

interface OrderManagerProps {
  orders: any[];
  onOrderUpdated: () => void;
}

const DEFAULT_DEMO_ORDER = {
  id: 'demo-order-849201',
  order_number: 'CT-849201',
  status: 'pending',
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
  awb_code: undefined as string | undefined,
};

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, onOrderUpdated }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('demo-order-849201');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [generatingAwbId, setGeneratingAwbId] = useState<string | null>(null);

  // Local map to track generated AWBs for immediate UI responsiveness
  const [orderAwbs, setOrderAwbs] = useState<Record<string, { awb: string; courier: string; url: string }>>({});

  // Telegram Config Modal State
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const config = getTelegramConfig();
    setBotToken(config.botToken);
    setChatId(config.chatId);
    setIsTelegramConfigured(config.isConfigured);
  }, []);

  // If no database orders exist yet, display the demo order for immediate testing
  const displayOrders = orders && orders.length > 0 ? orders : [DEFAULT_DEMO_ORDER];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (orderId === 'demo-order-849201') {
      alert(`Demo Order status updated to "${newStatus}"! (In real orders, this updates Supabase live).`);
      return;
    }
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
    if (orderId === 'demo-order-849201') {
      alert(`Demo Order payment updated to "${currentStatus === 'paid' ? 'pending' : 'paid'}"!`);
      return;
    }
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

  // WhatsApp 1-Click Confirmation Link Generator
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

Please reply with *CONFIRM* so we can start lovingly packing and preparing your handmade parcel for dispatch! 🧶✨`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Shiprocket 1-Click AWB & Courier Generator
  const handleGenerateAwb = async (ord: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setGeneratingAwbId(ord.id);

    try {
      const addr = ord.shipping_address_snapshot as any;
      const res = await createShiprocketShipment({
        orderId: ord.id,
        orderNumber: ord.order_number,
        customerName: addr?.fullName || 'Valued Customer',
        phone: addr?.phone || '9876543210',
        email: addr?.email,
        addressLine1: addr?.addressLine1 || '',
        city: addr?.city || 'Pune',
        state: addr?.state || 'Maharashtra',
        postalCode: addr?.postalCode || '411001',
        paymentMethod: ord.payment_method || 'cod',
        subtotal: minorToMajor(ord.subtotal_amount_minor || ord.total_amount_minor),
        items: (ord.order_items || []).map((i: any) => ({
          title: i.title_snapshot,
          quantity: i.quantity,
          price: minorToMajor(i.price_snapshot_minor),
        })),
      });

      if (res.success) {
        setOrderAwbs((prev) => ({
          ...prev,
          [ord.id]: {
            awb: res.awbCode,
            courier: res.courierName,
            url: res.trackingUrl,
          },
        }));
      }
    } finally {
      setGeneratingAwbId(null);
    }
  };

  // Save Telegram settings
  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    saveTelegramConfig(botToken, chatId);
    setIsTelegramConfigured(Boolean(botToken && chatId));
    setTelegramStatusMsg({ type: 'success', text: '✅ Telegram credentials saved successfully!' });
    setTimeout(() => setTelegramStatusMsg(null), 3000);
  };

  // Test Telegram ping
  const handleTestTelegramPing = async () => {
    if (!botToken || !chatId) {
      setTelegramStatusMsg({ type: 'error', text: 'Please enter both Bot Token and Chat ID first.' });
      return;
    }
    setIsTestingTelegram(true);
    setTelegramStatusMsg(null);
    try {
      const res = await testTelegramConnection(botToken, chatId);
      if (res.success) {
        setTelegramStatusMsg({ type: 'success', text: '🎉 Ping sent! Check your Telegram app for the notification sound.' });
        saveTelegramConfig(botToken, chatId);
        setIsTelegramConfigured(true);
      } else {
        setTelegramStatusMsg({ type: 'error', text: res.error || 'Failed to connect to Telegram bot.' });
      }
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Helper to insert a live test order into Supabase
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
        subtotal: 848,
        shippingFee: 0,
        total: 848,
        paymentMethod: 'cod',
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

  const filteredOrders = displayOrders.filter((ord) => {
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Orders Queue & Fulfillment
            </span>
            <span className="text-xs text-brand-text-muted">
              {orders.length} real {orders.length === 1 ? 'order' : 'orders'} in Supabase
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy mt-1">
            Customer Orders, WhatsApp & Shiprocket
          </h2>
          <p className="text-xs text-brand-text-muted mt-0.5">
            Confirm orders via WhatsApp, get Telegram instant alerts, and dispatch via Shiprocket.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Telegram Alert Configuration Trigger */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isTelegramConfigured
                ? 'border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100'
                : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            <span>Telegram Alert: {isTelegramConfigured ? '🟢 Active' : '⚙️ Connect Bot'}</span>
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCreateTestOrder}
            disabled={isCreatingDemo}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isCreatingDemo ? 'Creating...' : '+ Test Order in DB'}
          </Button>

          {/* Filter chips */}
          <div className="hidden xl:flex items-center gap-1.5">
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
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-brand-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by order number (CT-849201), customer name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-brand-border bg-brand-cream/30 focus:bg-white focus:outline-none focus:border-brand-burgundy transition-all"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-xs text-brand-text-muted space-y-2">
          <Package className="w-8 h-8 mx-auto text-brand-text-muted/60 stroke-[1.5]" />
          <p>No orders found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const addr = ord.shipping_address_snapshot as any;
            const isExpanded = expandedOrderId === ord.id;
            const items = ord.order_items || [];
            const isDemo = ord.isDemo;

            // Check AWB from DB record or local state
            const awbInfo = orderAwbs[ord.id] || (ord.awb_code ? {
              awb: ord.awb_code,
              courier: 'Shiprocket Express',
              url: `https://shiprocket.co/tracking/${ord.awb_code}`,
            } : null);

            return (
              <div
                key={ord.id}
                className={`border rounded-2xl overflow-hidden bg-white transition-all shadow-xs ${
                  isDemo
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-brand-border/70 hover:border-brand-burgundy/40'
                }`}
              >
                {/* Order Summary Row */}
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
                        <Badge
                          variant={ord.status === 'delivered' ? 'bestseller' : 'outline'}
                          className="capitalize text-[10px]"
                        >
                          {ord.status || 'Pending'}
                        </Badge>
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

                    {/* Shiprocket AWB pill or button */}
                    {awbInfo ? (
                      <a
                        href={awbInfo.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-semibold transition-colors"
                        title="Click to view live Shiprocket tracking"
                      >
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{awbInfo.awb}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={(e) => handleGenerateAwb(ord, e)}
                        disabled={generatingAwbId === ord.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-brand-cream border border-brand-border text-brand-burgundy hover:bg-brand-softPink/50 text-xs font-semibold transition-colors shrink-0"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{generatingAwbId === ord.id ? 'Generating...' : 'Shiprocket AWB'}</span>
                      </button>
                    )}

                    {/* WhatsApp Confirmation Button */}
                    <button
                      onClick={(e) => sendWhatsAppConfirmation(ord, e)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0"
                      title="Open WhatsApp to confirm this order with the customer"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Confirm on WhatsApp</span>
                    </button>

                    <div className="text-brand-text-muted hidden sm:block">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

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
                            {addr?.city}, {addr?.state} - {addr?.postalCode}
                          </p>
                          <p className="flex items-center gap-1 pt-1.5 text-brand-burgundy font-semibold">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{addr?.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status Controls & 1-Click WhatsApp Quick Action */}
                      <div className="bg-white p-3.5 rounded-xl border border-brand-border/60 space-y-3">
                        <span className="font-semibold text-brand-burgundy flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          Order Status & Fulfillment
                        </span>

                        <div className="space-y-2.5">
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
                              <option value="confirmed">Confirmed (WhatsApp Verified)</option>
                              <option value="processing">Processing (Knitting/Packing)</option>
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

                          {/* Pre-formatted WhatsApp CTA banner */}
                          <div className="pt-2 border-t border-brand-border/50 flex flex-col sm:flex-row items-center gap-2">
                            <button
                              onClick={(e) => sendWhatsAppConfirmation(ord, e)}
                              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                              <span>Send WhatsApp Receipt</span>
                            </button>

                            {!awbInfo && (
                              <button
                                onClick={(e) => handleGenerateAwb(ord, e)}
                                disabled={generatingAwbId === ord.id}
                                className="w-full sm:w-auto py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
                              >
                                <Truck className="w-4 h-4" />
                                <span>{generatingAwbId === ord.id ? 'Generating...' : 'Shiprocket AWB'}</span>
                              </button>
                            )}
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

      {/* Telegram Setup & Testing Modal */}
      {isTelegramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsTelegramModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-brand-cream text-brand-text-muted hover:text-brand-burgundy transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-burgundy">
                    Telegram Order Alert Setup
                  </h3>
                  <span className="text-[10px] text-brand-text-muted">
                    Instant sound alert on your phone whenever an order is placed
                  </span>
                </div>
              </div>
            </div>

            {/* Quick 1-minute steps */}
            <div className="bg-brand-cream/30 p-3.5 rounded-2xl border border-brand-border/60 space-y-1.5 text-xs text-brand-text-muted">
              <p className="font-bold text-brand-burgundy">How to get your Bot Token & Chat ID (1 Minute):</p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                <li>Open Telegram and search <strong>@BotFather</strong>. Send <code>/newbot</code> to get your <strong>Bot Token</strong>.</li>
                <li>Search <strong>@userinfobot</strong> on Telegram to see your personal <strong>Chat ID</strong>.</li>
                <li>Paste both below and click <strong>&ldquo;Test Ping&rdquo;</strong> to verify sound alert on your phone!</li>
              </ol>
            </div>

            {telegramStatusMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  telegramStatusMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {telegramStatusMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{telegramStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveTelegram} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-burgundy mb-1">
                  Telegram Bot Token *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-burgundy mb-1">
                  Telegram Chat ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 987654321"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestTelegramPing}
                  disabled={isTestingTelegram}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  {isTestingTelegram ? 'Sending Ping...' : 'Test Sound Ping 🔔'}
                </Button>

                <Button type="submit" variant="primary" size="sm">
                  Save Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
