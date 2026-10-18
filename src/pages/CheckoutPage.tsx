import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useCustomerStore } from '../stores/customerStore';
import { placeOrder } from '../services/orderService';
import { minorToMajor } from '../lib/supabase';
import {
  sanitizeInput,
  isValidIndianPhone,
  isValidIndianPincode,
  checkCheckoutRateLimit,
  recordCheckoutAttempt,
} from '../utils/security';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { profile, setProfile, addOrderNumber } = useCustomerStore();

  const [saveDetails, setSaveDetails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  // Success Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
    phone: string;
    city: string;
    status: string;
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

    // 1. Anti-bot honeypot check (silently drop bot attempts)
    if (honeypot) {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    // 2. Anti-spam Rate Limiting
    const rateCheck = checkCheckoutRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.message || 'Please wait before placing another order.');
      return;
    }

    // 3. Indian Phone Validation
    if (!isValidIndianPhone(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    // 4. Indian PIN code Validation
    if (!isValidIndianPincode(postalCode)) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code (e.g. 411001).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Sanitize user inputs
    const cleanFullName = sanitizeInput(fullName);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const cleanEmail = sanitizeInput(email);
    const cleanAddress = sanitizeInput(addressLine1);
    const cleanCity = sanitizeInput(city);
    const cleanState = sanitizeInput(state);
    const cleanPostalCode = postalCode.replace(/\D/g, '').slice(0, 6);

    // Save details locally if user checked the box
    if (saveDetails) {
      setProfile({
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        addressLine1: cleanAddress,
        city: cleanCity,
        state: cleanState,
        postalCode: cleanPostalCode,
      });
    }

    // 1. Place order into Supabase PostgreSQL (recalculated server-side)
    const result = await placeOrder({
      items,
      shippingAddress: {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        addressLine1: cleanAddress,
        city: cleanCity,
        state: cleanState,
        postalCode: cleanPostalCode,
      },
    });

    if (result.success && result.orderNumber && result.orderId) {
      recordCheckoutAttempt();
      // Save order number to customer's order history
      addOrderNumber(result.orderNumber);

      const resolvedTotal = result.totalMinor !== undefined ? minorToMajor(result.totalMinor) : total;

      setConfirmedOrder({
        orderNumber: result.orderNumber,
        total: resolvedTotal,
        phone: cleanPhone,
        city: cleanCity,
        status: result.status || 'pending_confirmation',
      });

      clearCart();
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Order Success Screen (Phase 2: Pending Confirmation)
  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#FFF0F3] text-[#79002F] flex items-center justify-center mx-auto border-2 border-[#FAD3DC] shadow-xs">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Order Placed — Awaiting Confirmation ♡</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-burgundy font-bold pt-2">
            Thank You for Shopping Handmade!
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted max-w-md mx-auto">
            Order <strong>#{confirmedOrder.orderNumber}</strong> has been received by our boutique team.
          </p>
        </div>

        {/* WhatsApp Confirmation Notice Card */}
        <div className="bg-white rounded-3xl border border-[#F2DCD1] p-5 sm:p-6 shadow-soft text-left space-y-3.5">
          <div className="flex items-center gap-2.5 border-b border-[#F2DCD1] pb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#5C0024]">
                Next Step: 1-Click WhatsApp Confirmation
              </h3>
              <p className="text-[11px] text-[#79002F]/70">
                Cash on Delivery order verification
              </p>
            </div>
          </div>

          <div className="text-xs space-y-2 text-[#79002F]/85 leading-relaxed">
            <p>
              To protect handmade orders and ensure smooth doorstep delivery, our store team will reach out to your WhatsApp at <strong>+91 {confirmedOrder.phone}</strong> shortly.
            </p>
            <div className="p-3 rounded-xl bg-[#FFF8F3] border border-[#FAD3DC] text-[11px] text-[#79002F] space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <span>🌸</span>
                <span>How it works:</span>
              </p>
              <p>
                Please reply <strong>"CONFIRM"</strong> to our WhatsApp message so our artisans can lovingly pack and dispatch your parcel!
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F2DCD1] flex items-center justify-between text-xs text-[#5C0024]">
            <span className="font-medium">Amount Due on Delivery (COD):</span>
            <span className="font-bold text-base text-[#79002F]">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              View Order Tracking
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
        {/* Anti-Bot Honeypot Trap (Invisible to humans, catches automated spam bots) */}
        <input
          type="text"
          name="b_website_trap"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

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

          {/* Payment Method - Cash on Delivery Exclusive */}
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h2 className="font-serif text-xl text-brand-burgundy font-normal">
                Payment Method
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                COD Active
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-brand-burgundy bg-brand-softPink/30 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-brand-burgundy text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-brand-burgundy">Cash on Delivery (COD)</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      Zero Risk
                    </span>
                  </div>
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    Pay comfortably in cash or via courier UPI upon doorstep delivery across India.
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-brand-burgundy shrink-0" />
            </div>
            
            <p className="text-[11px] text-brand-text-muted/80 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Each handcrafted piece is carefully wrapped and dispatched with love.</span>
            </p>
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
                <span>Shipping (iThink Logistics)</span>
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
