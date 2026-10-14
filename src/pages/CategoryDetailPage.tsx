import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard, type Product } from '../components/shop/ProductCard';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const title = (slug || 'Category')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const sampleProducts: Product[] = [
    {
      id: 'prod-1',
      slug: 'tulip-crochet-bouquet',
      title: `${title} - Signature Piece`,
      price: 899,
      rating: 4.8,
      reviewCount: 124,
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'prod-2',
      slug: 'bow-hair-clip',
      title: `${title} - Delightful Item`,
      price: 249,
      rating: 4.6,
      reviewCount: 98,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
      tag: 'Sale',
      inStock: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-sm text-brand-burgundy hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Categories</span>
      </Link>

      <div className="bg-brand-cream/60 p-8 rounded-3xl border border-brand-border space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
          {title}
        </h1>
        <p className="text-sm text-brand-text-muted">
          Showing handcrafted crochet pieces specially created under {title}.
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
