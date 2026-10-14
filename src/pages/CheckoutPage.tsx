import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-softPink text-brand-burgundy flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <h1 className="text-3xl font-serif text-brand-burgundy">Thank You for Your Order!</h1>
        <p className="text-sm text-brand-text-muted">
          Your handmade treasures are being queued for crafting. Order confirmation #CT-82914 has been recorded.
        </p>
        <Link to="/orders">
          <Button variant="primary">View My Orders</Button>
        </Link>
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
                  placeholder="+91 744 724 6150"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                Street Address / House No. *
              </label>
              <input
                type="text"
                required
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
                  placeholder="e.g. 411014"
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
                <span>Items Subtotal (2 items)</span>
                <span className="font-semibold text-brand-text-primary">₹1,148</span>
              </div>
              <div className="flex justify-between text-brand-text-muted">
                <span>Shipping via Shiprocket</span>
                <span className="font-semibold text-brand-burgundy">FREE</span>
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-between text-xl font-bold text-brand-burgundy">
                <span>Amount to Pay</span>
                <span>₹1,148</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Place Order Now (₹1,148)
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
