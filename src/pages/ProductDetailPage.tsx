import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { fetchProductBySlug } from '../services/productService';
import { minorToMajor } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { asset } from '../utils/asset';


export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);

  interface ProductDetail {
    id: string;
    slug: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    images: string[];
    description: string;
    materials: string;
    care: string;
    inStock: boolean;
  }

  const defaultProduct: ProductDetail = {
    id: 'prod-1',
    slug: 'tulip-bouquet',
    title: 'Tulip Crochet Bouquet',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 124,
    images: [
      asset('/images/products/tulip-bouquet.webp'),
    ],
    description:
      'Everlasting spring captured in soft threads. Our Tulip Crochet Bouquet features five vibrant hand-knitted blooms carefully wrapped in artisanal craft paper and finished with a delicate lace ribbon.',
    materials: '100% premium milk cotton yarn, flexible florist wire stem, hypoallergenic fill.',
    care: 'Gently dust with a soft brush. Keep away from direct water immersion.',
    inStock: true,
  };

  const [product, setProduct] = useState<ProductDetail>(defaultProduct);

  useEffect(() => {
    if (!slug) return;

    fetchProductBySlug(slug).then((data) => {
      if (data) {
        const imageList = data.product_images?.length
          ? data.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => asset(img.image_url))
          : defaultProduct.images;

        setProduct({
          id: data.id,
          slug: data.slug,
          title: data.title,
          price: minorToMajor(data.price_minor),
          originalPrice: data.compare_at_price_minor ? minorToMajor(data.compare_at_price_minor) : undefined,
          rating: data.rating ? Number(data.rating) : 5.0,
          reviewCount: data.review_count || 0,
          images: imageList,
          description: data.description || data.short_description || defaultProduct.description,
          materials: defaultProduct.materials,
          care: defaultProduct.care,
          inStock: (data.stock_quantity ?? 0) > 0,
        });
      }
    });
  }, [slug]);

  const handleAddToCart = () => {
    addItemToCart(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: asset(product.images[0] || '/images/products/tulip-bouquet.webp'),
      },
      quantity
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#79002F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-green-300" />
          <span>Added <strong>{quantity}× {product.title}</strong> to your bag! ♡</span>
        </div>
      )}

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
              src={asset(product.images[selectedImage] || product.images[0])}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === idx
                    ? 'border-brand-burgundy ring-2 ring-brand-blush'
                    : 'border-brand-border hover:opacity-80'
                }`}
              >
                <img src={asset(img)} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Badge variant="bestseller">Handmade with Love ♡</Badge>
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
            {product.originalPrice && (
              <span className="text-base text-brand-text-muted line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
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
                onClick={handleAddToCart}
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
