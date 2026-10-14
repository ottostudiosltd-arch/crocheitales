import React from 'react';
import { X, Trash2, ArrowRight, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Sample drawer state (integrated with Zustand in Phase 7)
  const cartItems = [
    {
      id: 'prod-1',
      title: 'Tulip Crochet Bouquet',
      price: 899,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-2',
      title: 'Bow Hair Clip (Pink)',
      price: 249,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-brand-border">
        {/* Drawer Header */}
        <div className="p-5 border-b border-brand-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-brand-burgundy font-normal">
              Your Shopping Bag
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy font-semibold">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-text-muted hover:text-brand-burgundy hover:bg-brand-softPink/50"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-brand-cream/80 px-5 py-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2 text-xs text-brand-burgundy font-medium mb-1.5">
            <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
            {isFreeShipping ? (
              <span>🎉 Congratulations! You unlocked <strong>Free Shipping</strong>!</span>
            ) : (
              <span>Add <strong>₹{remainingForFreeShipping}</strong> more for Free Shipping!</span>
            )}
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-brand-border/60">
            <div
              className="bg-brand-burgundy h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-brand-border/40">
          {cartItems.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-brand-border/60 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-brand-text-primary truncate">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between mt-1 text-xs text-brand-text-muted">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-bold text-brand-burgundy text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
              <button
                className="p-1.5 text-brand-text-muted hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Drawer Footer & Checkout CTA */}
        <div className="p-5 border-t border-brand-border bg-brand-cream/30 space-y-3">
          <div className="flex items-center justify-between text-base">
            <span className="text-brand-text-muted font-normal">Subtotal</span>
            <span className="font-bold text-xl text-brand-burgundy">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link to="/cart" onClick={onClose} className="w-full">
              <Button variant="outline" className="w-full">
                View Bag
              </Button>
            </Link>
            <Link to="/checkout" onClick={onClose} className="w-full">
              <Button
                variant="primary"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
