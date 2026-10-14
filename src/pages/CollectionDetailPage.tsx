import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard, type Product } from '../components/shop/ProductCard';

export const CollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const title = (slug || 'Collection')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      slug: 'tulip-crochet-bouquet',
      title: `${title} - Featured Selection`,
      price: 899,
      originalPrice: 1199,
      rating: 4.8,
      reviewCount: 124,
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-2',
      slug: 'daisy-keychain',
      title: `${title} - Handcrafted Gem`,
      price: 199,
      rating: 4.7,
      reviewCount: 76,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      inStock: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/collections"
        className="inline-flex items-center gap-2 text-sm text-brand-burgundy hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Collections</span>
      </Link>

      <div className="bg-brand-cream/60 p-8 rounded-3xl border border-brand-border space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
          {title}
        </h1>
        <p className="text-sm text-brand-text-muted">
          Curated handcrafted pieces from our {title} collection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};
