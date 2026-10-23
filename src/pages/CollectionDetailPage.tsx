import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard, type Product } from '../components/shop/ProductCard';
import { PRODUCTS } from '../data/catalog';
import { fetchProducts } from '../services/productService';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);

  const title = (slug || 'Collection')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  useEffect(() => {
    fetchProducts().then((res) => {
      if (res && res.length > 0) {
        if (slug === 'sale-finds') {
          setProducts(res.filter((p) => p.originalPrice && p.originalPrice > p.price));
        } else if (slug === 'bestsellers') {
          setProducts(res.filter((p) => p.tag === 'Bestseller'));
        } else {
          setProducts(res.slice(0, 8));
        }
      } else {
        setProducts(PRODUCTS.slice(0, 8));
      }
    });
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#79002F] font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Collections</span>
      </Link>

      <div className="bg-[#FFF4F6] p-6 sm:p-8 rounded-3xl border border-[#FAD3DC] space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#5C0024] font-bold">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#79002F]/80">
          Showing curated handcrafted pieces from our {title} collection.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
