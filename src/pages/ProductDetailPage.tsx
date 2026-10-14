import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProductDetailPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: 'prod-1',
    title: 'Tulip Crochet Bouquet',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    ],
    description:
      'Everlasting spring captured in soft threads. Our Tulip Crochet Bouquet features five vibrant hand-knitted blooms carefully wrapped in artisanal craft paper and finished with a delicate lace ribbon.',
    materials: '100% premium milk cotton yarn, flexible florist wire stem, hypoallergenic fill.',
    care: 'Gently dust with a soft brush. Keep away from direct water immersion.',
    inStock: true,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back to Shop link */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-brand-burgundy hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden border border-brand-border bg-white shadow-soft">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? 'border-brand-burgundy ring-2 ring-brand-blush'
                    : 'border-brand-border hover:opacity-80'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Badge variant="bestseller">Bestseller</Badge>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-brand-text-muted">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-brand-text-primary">{product.rating}</span>
              <span>({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-burgundy font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-base text-brand-text-muted line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy">
              Save 25%
            </span>
          </div>

          <p className="text-sm text-brand-text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector & Add to Bag */}
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Quantity:
              </span>
              <div className="flex items-center rounded-full border border-brand-border bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-brand-text-muted hover:text-brand-burgundy"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-brand-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-brand-text-muted hover:text-brand-burgundy"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                Add to Bag • ₹{(product.price * quantity).toLocaleString('en-IN')}
              </Button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
                className={`p-3.5 rounded-full border border-brand-border bg-white transition-all hover:scale-105 ${
                  isWishlisted ? 'text-brand-burgundy border-brand-burgundy' : 'text-brand-text-muted'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-brand-cream/60 rounded-2xl p-4 space-y-3 border border-brand-border/60 text-xs text-brand-text-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span>Free Delivery across India on orders above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span>100% Handcrafted with genuine premium yarn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
