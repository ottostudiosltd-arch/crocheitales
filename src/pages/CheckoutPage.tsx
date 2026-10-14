import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useCustomerStore } from '../stores/customerStore';
import { placeOrder } from '../services/orderService';
import { createShiprocketShipment } from '../services/shiprocketService';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { profile, setProfile, addOrderNumber } = useCustomerStore();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [saveDetails, setSaveDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    awbCode: string;
    trackingUrl: string;
    courierName: string;
  } | null>(null);

  // Form State initialized from customerStore
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [addressLine1, setAddressLine1] = useState(profile.addressLine1 || '');
  const [city, setCity] = useState(profile.city || '');
  const [state, setState] = useState(profile.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(profile.postalCode || '');

  // Update form if profile loads or updates
  useEffect(() => {
    if (profile.fullName && !fullName) setFullName(profile.fullName);
    if (profile.phone && !phone) setPhone(profile.phone);
    if (profile.email && !email) setEmail(profile.email);
    if (profile.addressLine1 && !addressLine1) setAddressLine1(profile.addressLine1);
    if (profile.city && !city) setCity(profile.city);
    if (profile.state && !state) setState(profile.state);
    if (profile.postalCode && !postalCode) setPostalCode(profile.postalCode);
  }, [profile]);

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your bag is empty! Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Save details locally if user checked the box
    if (saveDetails) {
      setProfile({
        fullName,
        phone,
        email,
        addressLine1,
        city,
        state,
        postalCode,
      });
    }

    // 1. Place order into Supabase PostgreSQL
    const result = await placeOrder({
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      shippingAddress: {
        fullName,
        phone,
        email,
        addressLine1,
        city,
        state,
        postalCode,
      },
    });

    if (result.success && result.orderNumber && result.orderId) {
      // 2. Generate Shiprocket Shipment & Tracking Code (Phase 8)
      const shipment = await createShiprocketShipment({
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        customerName: fullName,
        phone,
        email,
        addressLine1,
        city,
        state,
        postalCode,
        paymentMethod,
        subtotal,
        items: items.map((i) => ({
          title: i.title,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      // Save order number to customer's order history
      addOrderNumber(result.orderNumber);

      setConfirmedOrder({
        orderNumber: result.orderNumber,
        awbCode: shipment.awbCode,
        trackingUrl: shipment.trackingUrl,
        courierName: shipment.courierName,
      });

      clearCart();
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Order Success Screen
  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#FFF0F3] text-[#79002F] flex items-center justify-center mx-auto border-2 border-[#FAD3DC] shadow-xs">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            Order Confirmed & Queued for Crafting ♡
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-burgundy font-bold pt-2">
            Thank You for Shopping Handmade!
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto">
            Order <strong>#{confirmedOrder.orderNumber}</strong> has been saved directly to our artisan system.
          </p>
        </div>

        {/* Shiprocket Tracking Card */}
        <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-6 shadow-soft text-left space-y-3">
          <div className="flex items-center justify-between border-b border-[#F2DCD1] pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-burgundy" />
              <span className="font-serif font-bold text-sm text-[#5C0024]">
                Shiprocket Courier Details
              </span>
            </div>
            <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              Live Assigned
            </span>
          </div>

          <div className="text-xs space-y-1 text-[#79002F]/85">
            <p><strong>AWB Code:</strong> <span className="font-mono text-sm font-bold text-[#5C0024]">{confirmedOrder.awbCode}</span></p>
            <p><strong>Courier:</strong> {confirmedOrder.courierName}</p>
            <p className="text-[11px] text-[#79002F]/70">You can track your package dispatch and live transit at any time.</p>
          </div>

          <div className="pt-2">
            <a
              href={confirmedOrder.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-full bg-[#79002F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#5C0024] transition-all"
            >
              <span>Track on Shiprocket</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              View My Order History
            </Button>
          </Link>
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              Continue Shopping →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-brand-burgundy hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/60 pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
            Express Checkout
          </h1>
          <p className="text-xs text-brand-text-muted mt-0.5">
            No login required — enter your delivery address and we'll craft your order!
          </p>
        </div>

        {profile.fullName && (
          <span className="text-xs px-3 py-1 rounded-full bg-[#FFF0F3] text-[#79002F] font-semibold border border-[#FAD3DC] flex items-center gap-1 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-filled from your saved info</span>
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Customer & Shipping Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-4">
            <h2 className="font-serif text-xl text-brand-burgundy font-normal pb-2 border-b border-brand-border">
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                  Phone Number (for Courier Delivery) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                Street Address / House No. *
              </label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="House / Flat No., Apartment, Street"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 411001"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            {/* Save details checkbox for 1-click checkout */}
            <div className="pt-2 border-t border-brand-border/40">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-text-muted">
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(e) => setSaveDetails(e.target.checked)}
                  className="rounded text-brand-burgundy focus:ring-brand-burgundy w-4 h-4"
                />
                <span>Save these delivery details on this device for 1-click checkout next time</span>
              </label>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-4">
            <h2 className="font-serif text-xl text-brand-burgundy font-normal pb-2 border-b border-brand-border">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-burgundy bg-brand-softPink/30'
                    : 'border-brand-border/60 hover:bg-brand-cream/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'cod' ? 'border-brand-burgundy' : 'border-brand-text-muted'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-brand-burgundy" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-text-primary">Cash on Delivery (COD)</p>
                    <p className="text-xs text-brand-text-muted">Pay comfortably upon delivery across India</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-brand-burgundy" />
              </label>

              <label
                onClick={() => setPaymentMethod('online')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-brand-burgundy bg-brand-softPink/30'
                    : 'border-brand-border/60 hover:bg-brand-cream/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'online' ? 'border-brand-burgundy' : 'border-brand-text-muted'
                  }`}>
                    {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-brand-burgundy" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-text-primary">Online UPI / Cards / NetBanking</p>
                    <p className="text-xs text-brand-text-muted">Instant, encrypted payment processing</p>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-brand-burgundy" />
              </label>
            </div>
          </div>
        </div>

        {/* Order Review & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft space-y-4">
            <h2 className="font-serif text-xl text-brand-burgundy font-normal pb-2 border-b border-brand-border">
              Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-text-muted">
                <span>Items Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold text-brand-text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-text-muted">
                <span>Shipping via Shiprocket</span>
                <span className="font-semibold text-brand-burgundy">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-between text-xl font-bold text-brand-burgundy">
                <span>Amount to Pay</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting
                ? 'Processing Order & Generating AWB...'
                : `Place Order Now (₹${total.toLocaleString('en-IN')})`}
            </Button>

            <div className="pt-2 text-center text-xs text-brand-text-muted flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-burgundy" />
              <span>Safe & Secure Indian Fulfillment</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
