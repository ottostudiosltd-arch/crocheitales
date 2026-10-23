import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CATEGORIES } from '../data/catalog';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SectionHeading
        title="All Categories"
        subtitle="Explore our complete range of authentic handcrafted crochet collections"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/categories/${cat.slug}`}
            className="group bg-white rounded-3xl border border-[#FAD3DC]/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="w-full aspect-[4/3] overflow-hidden bg-[#FFF4F6] relative">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-2.5 right-2.5 text-[11px] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[#79002F] font-bold shadow-xs border border-white/60">
                {cat.itemCount}
              </span>
              <span className="absolute top-2.5 left-2.5 text-base select-none bg-white/80 p-1.5 rounded-full shadow-2xs">
                {cat.badge}
              </span>
            </div>
            <div className="p-4 sm:p-4.5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-[#5C0024] group-hover:text-[#79002F] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#79002F]/75 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FDE8EE] text-[#79002F] flex items-center justify-center shrink-0 group-hover:bg-[#79002F] group-hover:text-white transition-all ml-2.5 shadow-2xs">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
