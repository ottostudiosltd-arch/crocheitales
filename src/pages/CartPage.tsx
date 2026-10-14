import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';

export const CartPage: React.FC = () => {
  const { items: cartItems, updateQuantity, removeItem, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-baseline justify-between border-b border-brand-border/60 pb-4">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
          Your Shopping Bag
        </h1>
        <span className="text-sm text-brand-text-muted">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-brand-border/70 p-12 text-center space-y-4 max-w-lg mx-auto shadow-soft">
          <div className="w-16 h-16 rounded-full bg-[#FCEAEB] text-[#79002F] flex items-center justify-center mx-auto border border-[#FAD3DC]">
            <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#5C0024]">Your bag is currently empty</h2>
          <p className="text-xs sm:text-sm text-[#79002F]/75 leading-relaxed">
            Fill it with handcrafted love, eternal flower bouquets, cute keychains, or chic hair accessories.
          </p>
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Explore Creations →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft divide-y divide-brand-border/50">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-brand-border shrink-0"
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
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-brand-text-muted hover:text-brand-burgundy p-1"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-brand-text-muted hover:text-brand-burgundy p-1"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold text-brand-burgundy text-base min-w-[70px] text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-brand-text-muted hover:text-red-600 transition-colors"
                      aria-label="Remove"
                    >
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
                  <span className="font-semibold text-brand-text-primary">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
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
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
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
      )}
    </div>
  );
};
