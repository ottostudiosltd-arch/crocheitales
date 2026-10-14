import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles, Truck, Gift, MessageCircle, ArrowRight } from 'lucide-react';


// 8-Lobe Scalloped Pink Flower Badge matching the boutique aesthetic
const ScallopBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-11 h-11 mx-auto flex items-center justify-center shrink-0">
    <svg className="absolute inset-0 w-full h-full text-[#FDE8EE]" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="22" r="16" />
      <circle cx="70" cy="29" r="16" />
      <circle cx="78" cy="50" r="16" />
      <circle cx="70" cy="71" r="16" />
      <circle cx="50" cy="78" r="16" />
      <circle cx="30" cy="71" r="16" />
      <circle cx="22" cy="50" r="16" />
      <circle cx="30" cy="29" r="16" />
      <circle cx="50" cy="50" r="24" />
    </svg>
    <div className="relative z-10 text-[#79002F] flex items-center justify-center">
      {children}
    </div>
  </div>
);

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF1E8] text-[#50242E] pb-24">
      {/* 1. Mobile Top Navigation Bar */}
      <div className="sticky top-14 z-30 bg-[#FAF1E8]/95 backdrop-blur-md border-b border-[#F2DCD1]/70 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white border border-[#F3CDD5] text-[#79002F] flex items-center justify-center hover:bg-[#FCEAEB] active:scale-95 transition-all shadow-2xs"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="text-center">
          <h1 className="font-serif font-bold text-base text-[#5C0024] tracking-tight flex items-center gap-1 justify-center">
            <span>Our Story</span>
            <span className="text-[#E07A93] font-handwriting text-sm">♡</span>
          </h1>
          <p className="text-[10px] text-[#79002F]/70 font-medium">Crafting Little Threads of Big Happiness</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#79002F] flex items-center justify-center border border-[#FAD3DC] shadow-2xs">
          <Heart className="w-4 h-4 fill-[#79002F]" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 space-y-4 sm:space-y-6">
        {/* 2. Hero Story Card with Warm Visual */}
        <section className="bg-white rounded-3xl border border-[#F2DCD1] p-4 sm:p-7 shadow-2xs relative overflow-hidden">
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] text-[#79002F] text-[11px] font-semibold mb-3">
            <span className="font-handwriting text-xs">♡</span>
            <span>Little Threads, Big Happiness</span>
            <span className="font-handwriting text-xs">♡</span>
          </div>

          <h2 className="font-serif font-bold text-xl sm:text-3xl text-[#5C0024] leading-tight tracking-tight">
            Where Every Thread Tells a Heartfelt Story 🌸
          </h2>
          <p className="text-xs sm:text-sm text-[#79002F]/80 mt-1.5 leading-relaxed">
            Welcome to <strong className="font-serif font-bold text-[#79002F]">Crochei Tales</strong>. In a fast world of machine-made mass production, we believe in the soulful beauty, patience, and warmth of authentic handmade crochet.
          </p>

          {/* Featured Story Photo */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] rounded-2xl overflow-hidden mt-4 shadow-inner bg-[#FDE7EC] border border-[#FAD3DC]/60">
            <img
              src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1000&auto=format&fit=crop&q=80"
              alt="Artisan crocheting with milk cotton yarn"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-3 sm:p-4">
              <span className="text-white text-xs sm:text-sm font-handwriting font-medium drop-shadow-md">
                100% Handcrafted with milk cotton yarn ♡
              </span>
            </div>
          </div>
        </section>

        {/* 3. The 3 Story Chapters */}
        <section className="space-y-3">
          {/* Chapter 1 */}
          <div className="bg-white rounded-2xl border border-[#F2DCD1] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-[#FCEAEB] text-[#79002F] font-serif font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#5C0024]">
                Born from a Simple Passion
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#79002F]/85 leading-relaxed pl-8">
              Crochei Tales began with a skein of soft pastel milk cotton yarn, a single crochet hook, and a love for creating heirloom treasures that bring genuine smiles. What started as small gifts for close friends quickly blossomed into a dedicated boutique brand loved across India.
            </p>
          </div>

          {/* Chapter 2 */}
          <div className="bg-white rounded-2xl border border-[#F2DCD1] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-[#FCEAEB] text-[#79002F] font-serif font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#5C0024]">
                Patience in Every Stitch — Zero Machines
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#79002F]/85 leading-relaxed pl-8">
              Crochet cannot be replicated by automated machines. Every single loop, knot, and petal must be crafted by human hands. When you hold a Crochei Tales bouquet or clip, you hold hours of dedicated artisan patience, skill, and care.
            </p>
          </div>

          {/* Chapter 3 */}
          <div className="bg-white rounded-2xl border border-[#F2DCD1] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-[#FCEAEB] text-[#79002F] font-serif font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#5C0024]">
                Everlasting Blooms That Never Fade
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#79002F]/85 leading-relaxed pl-8">
              Real flowers wither away in days, but our crochet tulips, daisies, and sunflowers remain vibrant forever. They sit on your work desk, bedside table, or bookshelf as lasting reminders of birthdays, anniversaries, and heartfelt memories.
            </p>
          </div>
        </section>

        {/* 4. 4 Scalloped Artisan Badges */}
        <section className="bg-white rounded-3xl border border-[#F2DCD1] p-4 sm:p-6 shadow-2xs">
          <h3 className="font-serif font-bold text-sm sm:text-base text-center text-[#5C0024] mb-3">
            The Crochei Tales Promise
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-2xl bg-[#FFF8F3] border border-[#F2DCD1] flex flex-col items-center">
              <ScallopBadge>
                <Heart className="w-4 h-4 stroke-[1.8]" />
              </ScallopBadge>
              <h4 className="font-serif font-bold text-xs text-[#5C0024] mt-2">100% Handmade</h4>
              <p className="text-[10px] text-[#79002F]/75 mt-0.5">Pure human artistry</p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FFF8F3] border border-[#F2DCD1] flex flex-col items-center">
              <ScallopBadge>
                <Sparkles className="w-4 h-4 stroke-[1.8]" />
              </ScallopBadge>
              <h4 className="font-serif font-bold text-xs text-[#5C0024] mt-2">Premium Yarn</h4>
              <p className="text-[10px] text-[#79002F]/75 mt-0.5">Soft milk cotton</p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FFF8F3] border border-[#F2DCD1] flex flex-col items-center">
              <ScallopBadge>
                <Truck className="w-4 h-4 stroke-[1.8]" />
              </ScallopBadge>
              <h4 className="font-serif font-bold text-xs text-[#5C0024] mt-2">Free Shipping</h4>
              <p className="text-[10px] text-[#79002F]/75 mt-0.5">On orders above ₹999</p>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#FFF8F3] border border-[#F2DCD1] flex flex-col items-center">
              <ScallopBadge>
                <Gift className="w-4 h-4 stroke-[1.8]" />
              </ScallopBadge>
              <h4 className="font-serif font-bold text-xs text-[#5C0024] mt-2">Gift-Ready</h4>
              <p className="text-[10px] text-[#79002F]/75 mt-0.5">With custom cards</p>
            </div>
          </div>
        </section>

        {/* 5. Founder Quote Note Card */}
        <section className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FDE8EE] via-[#FCE4EB] to-[#FBD6E2] border border-[#FAD3DC] text-center shadow-2xs relative">
          <span className="font-handwriting text-3xl text-[#C77D91]">“</span>
          <p className="font-serif italic text-xs sm:text-sm text-[#5C0024] max-w-md mx-auto -mt-2 leading-relaxed">
            We don’t just crochet yarn — we crochet smiles, cozy moments, and memories that brighten your everyday life.
          </p>
          <div className="mt-3">
            <p className="font-handwriting font-bold text-sm sm:text-base text-[#79002F]">
              With love, Tausif Shaikh & Crochei Tales Artisans ♡
            </p>
          </div>
        </section>

        {/* 6. Action Buttons */}
        <section className="pt-2 space-y-2.5">
          <Link
            to="/shop"
            className="w-full py-3 rounded-full bg-[#79002F] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#5C0024] active:scale-95 transition-all"
          >
            <span>Explore Our Creations</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </Link>

          <a
            href="https://wa.me/917447246150"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-full bg-white border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 744 724 6150)</span>
          </a>
        </section>
      </div>
    </div>
  );
};
