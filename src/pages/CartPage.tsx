import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
  const cartItems = [
    {
      id: 'prod-1',
      title: 'Tulip Crochet Bouquet',
      price: 899,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-2',
      title: 'Bow Hair Clip (Dusty Rose)',
      price: 249,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
        Your Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft divide-y divide-brand-border/50">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-brand-border"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-brand-burgundy text-base">
                      {item.title}
                    </h3>
                    <p className="text-sm font-semibold text-brand-text-primary mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center rounded-full border border-brand-border px-3 py-1 bg-brand-cream/30">
                    <button className="text-brand-text-muted hover:text-brand-burgundy p-1" aria-label="Decrease">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button className="text-brand-text-muted hover:text-brand-burgundy p-1" aria-label="Increase">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-brand-burgundy text-base min-w-[70px] text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button className="p-2 text-brand-text-muted hover:text-red-600 transition-colors" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft space-y-6">
            <h2 className="font-serif text-xl text-brand-burgundy font-normal pb-3 border-b border-brand-border">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-text-muted">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-brand-burgundy">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-between text-lg font-bold text-brand-burgundy">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-brand-text-muted">
              <ShieldCheck className="w-4 h-4 text-brand-burgundy" />
              <span>Safe & Secure Indian Payment & COD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
