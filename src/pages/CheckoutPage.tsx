import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { placeOrder } from '../services/orderService';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || user?.user_metadata?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');

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

    const result = await placeOrder({
      customerId: user?.id,
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

    setIsSubmitting(false);

    if (result.success && result.orderNumber) {
      setConfirmedOrderNumber(result.orderNumber);
      clearCart();
    } else {
      setErrorMessage(result.error || 'Failed to place order. Please try again.');
    }
  };

  if (confirmedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-softPink text-brand-burgundy flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <h1 className="text-3xl font-serif text-brand-burgundy">Thank You for Your Order!</h1>
        <p className="text-sm text-brand-text-muted">
          Your handmade crochet treasures are being queued for crafting. Order confirmation <strong>#{confirmedOrderNumber}</strong> has been saved directly to your account.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/orders">
            <Button variant="primary">View My Orders</Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">Continue Shopping</Button>
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

      <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
        Secure Checkout
      </h1>

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
              Shipping Address
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
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 744 724 6150"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                Email Address
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
                ? 'Processing Order...'
                : `Place Order Now (₹${total.toLocaleString('en-IN')})`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
