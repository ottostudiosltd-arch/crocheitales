import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ProductCard, type Product } from '../components/shop/ProductCard';
import { CATEGORIES } from '../data/catalog';
import { fetchProducts } from '../services/productService';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const matchedCat = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase()
  );

  const title = matchedCat
    ? matchedCat.title
    : (slug || 'Category')
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  useEffect(() => {
    setLoading(true);
    fetchProducts({ categorySlug: slug }).then((res) => {
      setProducts(res || []);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#79002F] font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </Link>

      <div className="bg-[#FFF4F6] p-6 sm:p-8 rounded-3xl border border-[#FAD3DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{matchedCat?.badge || '🧶'}</span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#5C0024] font-bold">
              {title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#79002F]/80 max-w-xl">
            {matchedCat?.description ||
              `Showing handcrafted crochet pieces specially created under ${title}.`}
          </p>
        </div>

        {matchedCat && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-white/80 shadow-xs shrink-0 self-center sm:self-auto">
            <img
              src={matchedCat.image}
              alt={matchedCat.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#79002F]/70">
          Loading {title} pieces...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#F2DCD1] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] text-[#79002F] mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#5C0024]">
            More {title} Creations Coming Soon! ♡
          </h3>
          <p className="text-xs text-[#79002F]/75 max-w-md mx-auto">
            Our artisans are currently crocheting exciting new designs for {title}. Meanwhile, check out our Winter Wear and other boutique pieces!
          </p>
          <div className="pt-2">
            <Link
              to="/categories/winter-wear"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#79002F] text-white text-xs font-semibold shadow-xs hover:bg-[#5C0024]"
            >
              <span>Explore Winter Wear Collection</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
