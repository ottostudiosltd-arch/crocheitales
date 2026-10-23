import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { asset } from '../utils/asset';

export const CollectionsPage: React.FC = () => {
  const collections = [
    {
      title: 'Best Sellers',
      count: '10 items',
      slug: 'bestsellers',
      description: 'Our most loved and reviewed crochet treasures.',
      image: asset('/images/categories/winter-wear.webp'),
    },
    {
      title: 'Sale Finds',
      count: '6 items',
      slug: 'sale-finds',
      description: 'Limited-time special prices on curated handcrafted pieces.',
      image: asset('/images/products/maroon-vintage-gloves.webp'),
    },
    {
      title: 'Gift Ideas',
      count: '12 items',
      slug: 'gift-ideas',
      description: 'Thoughtfully wrapped crochet gifts for birthdays and celebrations.',
      image: asset('/images/products/winter-charm-crochet-set.webp'),
    },
    {
      title: 'Gifts for Him',
      count: '5 items',
      slug: 'gifts-for-him',
      description: 'Monochrome square mufflers, neutral charms, and custom cozy pieces.',
      image: asset('/images/products/black-and-white-square-muffler.webp'),
    },
    {
      title: 'Gifts for Her',
      count: '14 items',
      slug: 'gifts-for-her',
      description: 'Romantic vintage cardigans, floral bouquets, and cute hair accessories.',
      image: asset('/images/products/pink-vintage-cardigan.webp'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SectionHeading
        title="Shop by Collection"
        subtitle="Curated with love for every special occasion"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Link
            key={col.slug}
            to={`/collections/${col.slug}`}
            className="group bg-white rounded-3xl border border-[#FAD3DC]/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#FFF4F6] relative">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-3 right-3 text-xs bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[#79002F] font-bold shadow-xs border border-white/60">
                {col.count}
              </span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#5C0024] group-hover:text-[#79002F] transition-colors leading-tight">
                  {col.title}
                </h3>
                <p className="text-xs text-[#79002F]/75 mt-1 leading-snug">
                  {col.description}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#FDE8EE] text-[#79002F] flex items-center justify-center shrink-0 group-hover:bg-[#79002F] group-hover:text-white transition-all ml-3 shadow-2xs">
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
