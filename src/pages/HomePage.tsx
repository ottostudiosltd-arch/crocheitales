import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Heart, Gift, Sparkles, ChevronRight, ArrowRight, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import heroImage from '../assets/hero.png';
import categoryBg from '../assets/Shop by Category.png';
import contactBg from '../assets/contact.png';

export const HomePage: React.FC = () => {
  // 6 Categories matching the client's mockup & card design
  const categories = [
    {
      title: 'Hair Accessories',
      subtitle: 'Clips, scrunchies & more',
      slug: 'hair-accessories',
      image: '/images/mockup/cat-hair-accessories.png',
      badge: '🎀',
    },
    {
      title: 'Keychains',
      subtitle: 'Cute charms & bag tags',
      slug: 'keychains',
      image: '/images/mockup/cat-keychains.png',
      badge: '✨',
    },
    {
      title: 'Flower Bouquets',
      subtitle: 'Everlasting floral blooms',
      slug: 'flower-bouquets',
      image: '/images/mockup/cat-flower-bouquets.png',
      badge: '🌸',
    },
    {
      title: 'Wearables',
      subtitle: 'Tops, hats & mufflers',
      slug: 'wearables',
      image: '/images/mockup/cat-wearables.png',
      badge: '🧶',
    },
    {
      title: 'Plushies',
      subtitle: 'Soft snuggly companions',
      slug: 'plushies',
      image: '/images/mockup/cat-plushies.png',
      badge: '🧸',
    },
    {
      title: 'Other Things',
      subtitle: 'Bookmarks, coasters & more',
      slug: 'other-things',
      image: '/images/mockup/cat-other-things.png',
      badge: '♡',
    },
  ];

  return (
    <div className="bg-[#FAF1E8] min-h-screen text-[#50242E] pb-12">
      {/* 1. Full-Width Bleed Hero Section (Fits perfectly inside the viewport frame so the button & full image are visible without scrolling) */}
      <section className="relative w-full overflow-hidden bg-[#FAF1E8] flex justify-center items-center">
        <div className="relative w-full max-h-[calc(100vh-100px)] flex justify-center items-center">
          {/* Hero artwork constrained to viewport height and container width with preserve aspect-ratio */}
          <img
            src={heroImage}
            alt="Crochei Tales"
            className="w-full h-auto max-h-[calc(100vh-100px)] object-contain block select-none pointer-events-none mx-auto"
          />

          {/* Central Eyebrow: Little Threads, Big Happiness */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none select-none"
            style={{ top: '8%' }}
          >
            <p className="text-[9px] sm:text-xs md:text-sm lg:text-base tracking-[0.22em] uppercase font-bold text-[#79002F]">
              Little Threads, Big Happiness
            </p>
            <span className="text-[#C77D91] text-xs sm:text-sm md:text-base font-handwriting block -mt-0.5">♡</span>
          </div>

          {/* Center Brand Logo (Clean authentic vector logo placed centrally) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none select-none flex items-center justify-center"
            style={{ top: '24%', width: 'min(380px, 45%)' }}
          >
            <img
              src="/branding/crochie-tales-logo-transparent.png"
              alt="Crochei Tales"
              className="w-full h-auto max-h-[140px] sm:max-h-[170px] md:max-h-[200px] object-contain drop-shadow-xs"
            />
          </div>

          {/* Central Content: Heading, Description & Real Clickable Shop Now Button */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center w-full max-w-lg md:max-w-xl px-4 flex flex-col items-center"
            style={{ top: '57%' }}
          >
            <h2 className="font-serif text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-[#79002F] leading-tight">
              Handmade Crochet Pieces for Brighter Days
            </h2>
            <p className="hidden sm:block text-[10px] sm:text-xs md:text-sm text-[#79002F]/85 leading-snug mt-0.5 max-w-md">
              Hair accessories, keychains, bouquets, wearables and more — crafted with love.
            </p>

            {/* Real Clickable Shop Now Button */}
            <div className="mt-1 sm:mt-2 md:mt-2.5 pointer-events-auto">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-7 md:px-8 py-1.5 sm:py-2 md:py-2.5 rounded-full bg-[#79002F] text-white text-xs sm:text-sm md:text-base font-semibold shadow-md hover:bg-[#5C0024] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Benefits Bar (75% overlapping on hero artwork and 25% below, neatly placed below the Shop Now button) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-12 sm:-mt-16 md:-mt-20">
        <div className="bg-[#FFF8F3]/95 backdrop-blur-sm rounded-2xl border border-[#F2DCD1] p-3 sm:p-5 shadow-sm grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#F2DCD1]">
          {/* Free Shipping */}
          <div className="flex items-center gap-3.5 p-3">
            <div className="text-[#79002F] shrink-0">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#79002F] leading-tight">
                Free Shipping
              </p>
              <p className="text-[11px] text-[#79002F]/75 mt-0.5">on orders above ₹999</p>
            </div>
          </div>

          {/* Handmade with love */}
          <div className="flex items-center gap-3.5 p-3">
            <div className="text-[#79002F] shrink-0">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#79002F] leading-tight">
                Handmade
              </p>
              <p className="text-[11px] text-[#79002F]/75 mt-0.5">with love</p>
            </div>
          </div>

          {/* Perfect for Gifting */}
          <div className="flex items-center gap-3.5 p-3">
            <div className="text-[#79002F] shrink-0">
              <Gift className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#79002F] leading-tight">
                Perfect for Gifting
              </p>
              <p className="text-[11px] text-[#79002F]/75 mt-0.5">for every occasion</p>
            </div>
          </div>

          {/* Unique & Custom */}
          <div className="flex items-center gap-3.5 p-3">
            <div className="text-[#79002F] shrink-0">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#79002F] leading-tight">
                Unique & Custom
              </p>
              <p className="text-[11px] text-[#79002F]/75 mt-0.5">pieces available</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category Section - Rebuilt with full background image & boutique cards */}
      <section
        className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24 my-6 sm:my-8"
        style={{
          backgroundImage: `url("${categoryBg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Heading (Centered & shifted upward) + Right-aligned "See All Categories" Button */}
          <div className="relative mb-8 sm:mb-10 -mt-2 sm:-mt-4">
            {/* Centered Heading */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="text-[#C77D91] font-handwriting text-xl sm:text-2xl">♡</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
                  Shop by Category
                </h2>
                <span className="text-[#C77D91] font-handwriting text-xl sm:text-2xl">♡</span>
              </div>
              <p className="text-xs sm:text-sm text-[#79002F]/80 mt-1 font-medium">
                Find your perfect handmade piece
              </p>
            </div>

            {/* Right side: See All Categories Button */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:bottom-0 flex justify-center sm:justify-end">
              <Link
                to="/categories"
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#79002F] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#520020] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>See All Categories</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 6 Category Cards Grid - Increased Card Size with Luxurious Padding & Generous Photo Area */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="group relative bg-[#FFF4F6]/92 backdrop-blur-xs rounded-3xl p-3.5 sm:p-4 md:p-4.5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-[#FAD3DC]/90 overflow-hidden shadow-sm"
              >
                {/* Top Corner Cute Bow & Heart Doodle Accents */}
                <div className="absolute top-2.5 left-2.5 text-[#C77D91]/70 text-sm pointer-events-none select-none font-handwriting">
                  ♡
                </div>
                <div className="absolute top-2.5 right-2.5 text-[#C77D91]/60 text-xs pointer-events-none select-none">
                  ✧
                </div>

                {/* Top Product Photo with Smooth Curved/Pillow Frame */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/75 shadow-inner flex items-center justify-center mb-3.5">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle glossy gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Bottom Area (Icon badge, Title, Subtitle, & Circular Arrow Button) */}
                <div className="pt-1.5 flex flex-col">
                  {/* Category Title & Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base select-none shrink-0">{cat.badge}</span>
                    <h3 className="font-serif font-bold text-sm sm:text-[15px] text-[#79002F] group-hover:text-[#520020] transition-colors leading-tight line-clamp-1">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-[11px] sm:text-xs text-[#79002F]/75 mt-1 leading-tight line-clamp-1">
                    {cat.subtitle}
                  </p>

                  {/* Dashed connector line & Circular Burgundy Arrow Button */}
                  <div className="mt-3.5 pt-1.5 border-t border-dashed border-[#F2B8C5]/80 flex items-center justify-between">
                    <span className="text-[11px] font-handwriting text-[#C77D91] font-semibold">
                      Explore ♡
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#79002F] text-white flex items-center justify-center group-hover:bg-[#520020] group-hover:scale-110 group-hover:shadow-md transition-all shadow-xs">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Story (About Section on Homepage) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 relative mt-16 sm:mt-20 scroll-mt-24">
        <div className="bg-[#FFF8F3] rounded-3xl border border-[#F2DCD1] p-6 sm:p-10 md:p-12 shadow-sm">
          {/* Section Heading */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center gap-2">
              <span className="text-[#C77D91] font-handwriting text-xl sm:text-2xl">♡</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
                Our Story
              </h2>
              <span className="text-[#C77D91] font-handwriting text-xl sm:text-2xl">♡</span>
            </div>
            <p className="text-xs sm:text-sm text-[#79002F]/80 mt-1 font-medium">
              Crafting Little Threads of Big Happiness
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story Image */}
            <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-white/70">
              <img
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1000&auto=format&fit=crop&q=80"
                alt="Crochei Tales Story"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-[#79002F]/90">
              <p>
                Welcome to <strong className="text-[#79002F] font-serif font-bold text-lg">Crochei Tales</strong>, where every thread has a tale and every stitch is woven with heartfelt care. We believe in the timeless warmth and charm of authentic handmade creations.
              </p>
              <p>
                Founded out of a genuine love for textile craftsmanship, Crochei Tales transforms premium natural cotton yarn into everlasting floral bouquets, chic hair accessories, plush toys, and custom heirloom gifts. Each piece is handmade patiently by dedicated artisans, ensuring unmatched durability, vibrant color, and a joyful personal touch.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F2DCD1]">
                <div className="p-3 bg-[#FFF0F3] rounded-xl text-center border border-[#FAD3DC]/70">
                  <h4 className="font-serif font-bold text-[#79002F] text-sm">100% Handmade</h4>
                  <p className="text-[11px] text-[#79002F]/75 mt-0.5">Pure human artistry</p>
                </div>
                <div className="p-3 bg-[#FFF0F3] rounded-xl text-center border border-[#FAD3DC]/70">
                  <h4 className="font-serif font-bold text-[#79002F] text-sm">Premium Yarn</h4>
                  <p className="text-[11px] text-[#79002F]/75 mt-0.5">Soft milk cotton</p>
                </div>
                <div className="p-3 bg-[#FFF0F3] rounded-xl text-center border border-[#FAD3DC]/70">
                  <h4 className="font-serif font-bold text-[#79002F] text-sm">Everlasting Love</h4>
                  <p className="text-[11px] text-[#79002F]/75 mt-0.5">Blooms that never fade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Get in Touch (Contact Section - Compact height & Shifted towards Right Side) */}
      <section
        id="contact"
        className="relative w-full overflow-hidden py-8 sm:py-10 md:py-12 mt-12 sm:mt-16 scroll-mt-24 flex items-center justify-center lg:justify-end"
        style={{
          backgroundImage: `url("${contactBg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Content shifted towards the right side leaving ~20% breathing space from right edge */}
        <div className="w-full max-w-xl px-4 sm:px-6 lg:mr-[12%] xl:mr-[16%] relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Eyebrow Pill Badge: ♡ Contact Us ♡ */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F3]/90 border border-[#FAD3DC] text-[#79002F] text-xs font-semibold shadow-xs mb-2">
            <span className="font-handwriting text-sm">♡</span>
            <span>Contact Us</span>
            <span className="font-handwriting text-sm">♡</span>
          </div>

          {/* Heading: Let's Get in Touch */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
            Let’s Get in Touch
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#79002F]/80 mt-1 max-w-md leading-snug font-medium">
            Have a question, custom order, or workshop query?
            <br />
            We’d love to hear from you!
          </p>

          {/* Sharable Contact Tabs (Compact & Neat) */}
          <div className="w-full max-w-md mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
            {/* Tab 1: Email Us */}
            <a
              href="mailto:hello@crochietales.in"
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                {/* Circular Icon Badge */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#79002F] leading-tight">
                    Email Us
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#79002F]/75 mt-0.5 font-normal">
                    hello@crochietales.in
                  </p>
                </div>
              </div>
              <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </a>

            {/* Tab 2: DM on Instagram */}
            <a
              href="https://instagram.com/crochie_tales"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                {/* Circular Icon Badge */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#79002F] leading-tight">
                    DM on Instagram
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#79002F]/75 mt-0.5 font-normal">
                    @crochie_tales
                  </p>
                </div>
              </div>
              <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </a>

            {/* Tab 3: Chat on WhatsApp */}
            <a
              href="https://wa.me/917447246150"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                {/* Circular Icon Badge */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                  <MessageCircle className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#79002F] leading-tight">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#79002F]/75 mt-0.5 font-normal">
                    +91 744 724 6150
                  </p>
                </div>
              </div>
              <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
