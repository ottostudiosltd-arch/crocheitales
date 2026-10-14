import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';

export const CategoriesPage: React.FC = () => {
  const categories = [
    { title: 'Hair Accessories', count: '12 items', slug: 'hair-accessories', description: 'Cute crochet hair clips, scrunchies, and headbands.', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80' },
    { title: 'Keychains', count: '18 items', slug: 'keychains', description: 'Charming bag charms, flower keyrings, and cute miniatures.', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80' },
    { title: 'Flower Bouquets', count: '9 items', slug: 'flower-bouquets', description: 'Everlasting crochet tulips, sunflowers, and floral bundles.', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80' },
    { title: 'Wearables', count: '6 items', slug: 'wearables', description: 'Cozy crochet cardigans, scarves, and handmade tops.', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80' },
    { title: 'Plushies', count: '14 items', slug: 'plushies', description: 'Snuggly crochet bunnies, bears, and adorable amigurumi toys.', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80' },
    { title: 'Other Things', count: '8 items', slug: 'other-things', description: 'Crochet tote bags, coasters, cup cozies, and bookmark wonders.', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SectionHeading
        title="Categories"
        subtitle="Explore our specialized handmade collections"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/categories/${cat.slug}`}
            className="group bg-white rounded-3xl border border-brand-border/70 overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="w-full aspect-[4/3] overflow-hidden bg-brand-cream/50 relative">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 right-3 text-xs bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-brand-burgundy font-semibold">
                {cat.count}
              </span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-brand-burgundy group-hover:text-brand-burgundy-dark transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-brand-text-muted mt-1">
                  {cat.description}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-softPink text-brand-burgundy flex items-center justify-center shrink-0 group-hover:bg-brand-burgundy group-hover:text-white transition-all ml-3">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
