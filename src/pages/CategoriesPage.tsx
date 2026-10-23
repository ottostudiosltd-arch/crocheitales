import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CATEGORIES, type CatalogCategory } from '../data/catalog';

const CategoryCardItem: React.FC<{ cat: CatalogCategory }> = ({ cat }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/categories/${cat.slug}`}
      className="group bg-white rounded-3xl border border-[#FAD3DC]/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-[#FFF4F6] relative">
        {!loaded && (
          <div className="absolute inset-0 shimmer-effect pointer-events-none" />
        )}
        <img
          src={cat.image}
          alt={cat.title}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-2 right-2 text-[10px] sm:text-[11px] bg-white/95 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[#79002F] font-bold shadow-xs border border-white/60">
          {cat.itemCount}
        </span>
        <span className="absolute top-2 left-2 text-sm sm:text-base select-none bg-white/85 p-1 rounded-full shadow-2xs">
          {cat.badge}
        </span>
      </div>

      <div className="p-3 sm:p-4.5 flex items-center justify-between">
        <div className="flex-1 pr-1 min-w-0">
          <h3 className="text-xs sm:text-base font-serif font-bold text-[#5C0024] group-hover:text-[#79002F] transition-colors leading-tight truncate">
            {cat.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-[#79002F]/75 mt-0.5 line-clamp-1 hidden xs:block">
            {cat.description}
          </p>
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FDE8EE] text-[#79002F] flex items-center justify-center shrink-0 group-hover:bg-[#79002F] group-hover:text-white transition-all ml-1.5 sm:ml-2.5 shadow-2xs">
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
        </div>
      </div>
    </Link>
  );
};

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8 animate-fade-in">
      <SectionHeading
        title="All Categories"
        subtitle="Explore our complete range of authentic handcrafted crochet collections"
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <CategoryCardItem key={cat.slug} cat={cat} />
        ))}
      </div>
    </div>
  );
};
