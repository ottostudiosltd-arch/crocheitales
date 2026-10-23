import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { fetchProductBySlug } from '../services/productService';
import { minorToMajor } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { asset } from '../utils/asset';
import { PRODUCTS } from '../data/catalog';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';

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

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToast, setAddedToast] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);

  // Instant in-memory fallback lookup
  const initialLocal = PRODUCTS.find(
    (p) => p.slug === slug || p.slug === (slug === 'tulip-crochet-bouquet' ? 'tulip-bouquet' : slug)
  );

  const initialProduct: ProductDetail | null = initialLocal
    ? {
        id: initialLocal.id,
        slug: initialLocal.slug,
        title: initialLocal.title,
        price: initialLocal.price,
        originalPrice: initialLocal.originalPrice,
        rating: initialLocal.rating || 5.0,
        reviewCount: initialLocal.reviewCount || 0,
        images: initialLocal.images || [initialLocal.imageUrl],
        description: initialLocal.description || initialLocal.shortDescription || '',
        materials: initialLocal.materials || '100% premium milk cotton yarn, handcrafted with love.',
        care: initialLocal.care || 'Gently hand wash in cool water. Dry flat in shade.',
        inStock: initialLocal.inStock ?? true,
      }
    : null;

  const [product, setProduct] = useState<ProductDetail | null>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);

  useEffect(() => {
    if (!slug) return;
    if (!product) setLoading(true);

    fetchProductBySlug(slug).then((data) => {
      if (data) {
        const imageList = data.product_images?.length
          ? data.product_images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => asset(img.image_url))
          : (product?.images || []);

        setProduct({
          id: data.id,
          slug: data.slug,
          title: data.title,
          price: minorToMajor(data.price_minor),
          originalPrice: data.compare_at_price_minor ? minorToMajor(data.compare_at_price_minor) : undefined,
          rating: data.rating ? Number(data.rating) : 5.0,
          reviewCount: data.review_count || 0,
          images: imageList,
          description: data.description || data.short_description || product?.description || '',
          materials: data.materials || product?.materials || '100% premium milk cotton yarn, handcrafted with love.',
          care: data.care || product?.care || 'Gently hand wash in cool water. Dry flat in shade.',
          inStock: (data.stock_quantity ?? 0) > 0,
        });
      }
      setLoading(false);
    });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
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

  if (loading && !product) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#5C0024]">Product Not Found</h2>
        <p className="text-xs text-[#79002F]/75">The requested handcrafted piece could not be located.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#79002F] text-white text-xs font-semibold"
        >
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
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
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#79002F] font-semibold hover:underline group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Shop</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Product Images Gallery with Shimmer */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-[#FAD3DC] bg-[#FFF4F6] shadow-sm">
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer-effect pointer-events-none" />
            )}
            <img
              src={asset(product.images[selectedImage] || product.images[0])}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(idx);
                    setImageLoaded(false);
                  }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white shadow-2xs ${
                    selectedImage === idx
                      ? 'border-[#79002F] ring-2 ring-[#FAD3DC]'
                      : 'border-[#F2DCD1] hover:opacity-80'
                  }`}
                >
                  <img src={asset(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0F3] text-[#79002F] border border-[#FAD3DC]">
              Handmade with Love ♡
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#5C0024] font-bold">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#79002F]/75">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-[#5C0024]">{product.rating}</span>
              <span>({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#79002F] font-sans">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#8C7A80] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FDF0F2] text-[#D9536F] border border-[#FADDE3]">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#79002F]/85 leading-relaxed bg-white/70 p-4 rounded-2xl border border-[#FAD3DC]/70">
            <p>{product.description}</p>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#F2DCD1] rounded-full bg-white px-2 py-1 shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#79002F] hover:bg-[#FFF0F3] rounded-full transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#5C0024]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#79002F] hover:bg-[#FFF0F3] rounded-full transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#79002F] text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-[#5C0024] hover:shadow-lg active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>

          {/* Materials & Care */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#F2DCD1]/80 text-xs">
            <div className="p-3 bg-white/80 rounded-2xl border border-[#FAD3DC]/60">
              <h4 className="font-serif font-bold text-[#5C0024] mb-1">Materials</h4>
              <p className="text-[#79002F]/75 leading-snug">{product.materials}</p>
            </div>
            <div className="p-3 bg-white/80 rounded-2xl border border-[#FAD3DC]/60">
              <h4 className="font-serif font-bold text-[#5C0024] mb-1">Care Guide</h4>
              <p className="text-[#79002F]/75 leading-snug">{product.care}</p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#F2DCD1] space-y-2 text-xs text-[#79002F]/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#79002F] shrink-0" />
              <span>Free standard delivery on orders above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#79002F] shrink-0" />
              <span>Cash on Delivery (COD) supported across India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
