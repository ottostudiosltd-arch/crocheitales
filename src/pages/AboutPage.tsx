import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeading
        title="Our Story"
        subtitle="Crafting Little Threads of Big Happiness"
      />

      <div className="bg-white rounded-3xl border border-brand-border/70 p-8 sm:p-12 shadow-soft space-y-8 leading-relaxed text-brand-text-primary text-base sm:text-lg">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1200&auto=format&fit=crop&q=80"
            alt="Crochie Tales Story"
            className="w-full h-full object-cover"
          />
        </div>

        <p>
          Welcome to <strong className="text-brand-burgundy font-serif">Crochei Tales</strong>, where every thread has a tale and every stitch is woven with love. We believe in the timeless charm of handmade treasures in a world increasingly filled with mass-produced items.
        </p>

        <p>
          Founded out of a genuine passion for textile artistry, Crochei Tales transforms premium natural cotton yarn into everlasting floral bouquets, adorable accessories, and heirloom keepsake gifts. Each creation is handcrafted patiently by skilled artisans, ensuring unmatched quality, durability, and a soulful personal touch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-border">
          <div className="text-center p-4 bg-brand-cream/50 rounded-2xl">
            <h4 className="font-serif font-bold text-brand-burgundy text-lg">100% Handmade</h4>
            <p className="text-xs text-brand-text-muted mt-1">No automated machines, just pure human artistry.</p>
          </div>
          <div className="text-center p-4 bg-brand-cream/50 rounded-2xl">
            <h4 className="font-serif font-bold text-brand-burgundy text-lg">Premium Yarn</h4>
            <p className="text-xs text-brand-text-muted mt-1">Ultra-soft, vibrant colorfast milk cotton.</p>
          </div>
          <div className="text-center p-4 bg-brand-cream/50 rounded-2xl">
            <h4 className="font-serif font-bold text-brand-burgundy text-lg">Sustainable Love</h4>
            <p className="text-xs text-brand-text-muted mt-1">Everlasting flowers that never wilt or fade.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
