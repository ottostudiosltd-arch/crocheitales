import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Heart,
  Gift,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Mail,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import heroImage from '../assets/hero.webp';
import heroMobileImage from '../assets/hero-mobile.webp';
import promoGiftBox from '../assets/promo-gift-box.webp';
import categoryBg from '../assets/Shop by Category.webp';
import contactBg from '../assets/contact.webp';
import { asset } from '../utils/asset';
import { ProductCard, Product } from '../components/shop/ProductCard';

// 8-Lobe Scalloped Pink Flower Badge matching the mobile reference mockup
const ScallopFlowerBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-11 h-11 mx-auto flex items-center justify-center">
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

export const HomePage: React.FC = () => {
  // Mobile Categories for horizontal scroll
  const mobileCategories = [
    {
      title: 'Flower Bouquets',
      slug: 'flower-bouquets',
      image: asset('/images/mockup/cat-flower-bouquets.webp'),
    },
    {
      title: 'Hair Accessories',
      slug: 'hair-accessories',
      image: asset('/images/mockup/cat-hair-accessories.webp'),
    },
    {
      title: 'Keychains',
      slug: 'keychains',
      image: asset('/images/mockup/cat-keychains.webp'),
    },
    {
      title: 'Wearables',
      slug: 'wearables',
      image: asset('/images/mockup/cat-wearables.webp'),
    },
    {
      title: 'Plushies',
      slug: 'plushies',
      image: asset('/images/mockup/cat-plushies.webp'),
    },
  ];

  // Mobile Bestsellers matching client reference
  const bestsellers: Product[] = [
    {
      id: 'best-1',
      slug: 'bow-hair-clip',
      title: 'Bow Hair Clip',
      price: 149,
      originalPrice: 249,
      rating: 4.6,
      reviewCount: 98,
      imageUrl: asset('/images/products/bow-hair-clip.webp'),
      category: 'Hair Accessories',
      tag: 'Bestseller',
      inStock: true,
    },
    {
      id: 'best-2',
      slug: 'daisy-keychain',
      title: 'Daisy Keychain',
      price: 199,
      originalPrice: 299,
      rating: 4.7,
      reviewCount: 76,
      imageUrl: asset('/images/products/daisy-keychain.webp'),
      category: 'Keychains',
      tag: 'Sale',
      inStock: true,
    },
    {
      id: 'best-3',
      slug: 'tulip-crochet-bouquet',
      title: 'Tulip Bouquet',
      price: 999,
      originalPrice: 1299,
      rating: 4.8,
      reviewCount: 124,
      imageUrl: asset('/images/products/tulip-bouquet.webp'),
      category: 'Flower Bouquets',
      tag: 'Bestseller',
      inStock: true,
    },
  ];

  // Desktop Categories (6 full categories)
  const categories = [
    {
      title: 'Hair Accessories',
      subtitle: 'Clips, scrunchies & more',
      slug: 'hair-accessories',
      image: asset('/images/mockup/cat-hair-accessories.webp'),
      badge: '🎀',
    },
    {
      title: 'Keychains',
      subtitle: 'Cute charms & bag tags',
      slug: 'keychains',
      image: asset('/images/mockup/cat-keychains.webp'),
      badge: '✨',
    },
    {
      title: 'Flower Bouquets',
      subtitle: 'Everlasting floral blooms',
      slug: 'flower-bouquets',
      image: asset('/images/mockup/cat-flower-bouquets.webp'),
      badge: '🌸',
    },
    {
      title: 'Wearables',
      subtitle: 'Tops, hats & mufflers',
      slug: 'wearables',
      image: asset('/images/mockup/cat-wearables.webp'),
      badge: '🧶',
    },
    {
      title: 'Plushies',
      subtitle: 'Soft snuggly companions',
      slug: 'plushies',
      image: asset('/images/mockup/cat-plushies.webp'),
      badge: '🧸',
    },
    {
      title: 'Other Things',
      subtitle: 'Bookmarks, coasters & more',
      slug: 'other-things',
      image: asset('/images/mockup/cat-other-things.webp'),
      badge: '♡',
    },
  ];

  return (
    <div className="bg-[#FAF1E8] min-h-screen text-[#50242E] pb-12">
      {/* ========================================================================= */}
      {/* MOBILE HOME VIEW (< lg) - Rebuilt to precisely match client reference mockup */}
      {/* ========================================================================= */}
      <div className="block lg:hidden px-3 pt-2.5 pb-6 space-y-4">
        {/* 1. Mobile Hero Banner Card (Using new hero-mobile.png) */}
        <section className="relative rounded-3xl overflow-hidden border border-[#FAD3DC]/80 shadow-xs aspect-[1.85/1] min-h-[195px] flex items-center bg-[#FDE7EC]">
          {/* New Hero Mobile Image */}
          <img
            src={heroMobileImage}
            alt="Crochei Tales - Handmade for Brighter Days"
            className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
            loading="eager"
            decoding="sync"
          />

          {/* Left Text Overlay */}
          <div className="relative z-10 pl-3.5 xs:pl-4 sm:pl-5 pr-2 py-3 flex flex-col justify-between h-full max-w-[62%]">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[8.5px] xs:text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#79002F]">
                  Little Threads, Big Happiness
                </span>
                <span className="text-[#C77D91] font-handwriting text-xs">♡</span>
              </div>

              <h1 className="font-serif font-bold text-lg xs:text-xl text-[#5C0024] leading-[1.12] mt-1 tracking-tight">
                Handmade <br />
                for Brighter <br />
                Days <span className="inline-block text-base">🌸</span>
              </h1>
            </div>

            <div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#79002F] text-white text-[11px] font-semibold shadow-md active:scale-95 transition-all hover:bg-[#5C0024]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </Link>

              {/* Carousel dots indicator */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-3.5 h-1.5 rounded-full bg-[#79002F]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A3B3]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A3B3]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5A3B3]" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Scalloped Feature Badges Row (4 Items) */}
        <section className="grid grid-cols-4 gap-1 px-0.5 py-1 text-center">
          {/* Free Shipping */}
          <div className="flex flex-col items-center">
            <ScallopFlowerBadge>
              <Truck className="w-4 h-4 stroke-[1.8]" />
            </ScallopFlowerBadge>
            <p className="font-bold text-[10px] text-[#5C0024] leading-tight mt-1">Free Shipping</p>
            <p className="text-[9px] text-[#79002F]/75">above ₹999</p>
          </div>

          {/* Handmade with love */}
          <div className="flex flex-col items-center">
            <ScallopFlowerBadge>
              <Heart className="w-4 h-4 stroke-[1.8]" />
            </ScallopFlowerBadge>
            <p className="font-bold text-[10px] text-[#5C0024] leading-tight mt-1">Handmade</p>
            <p className="text-[9px] text-[#79002F]/75">with love</p>
          </div>

          {/* Perfect for Gifting */}
          <div className="flex flex-col items-center">
            <ScallopFlowerBadge>
              <Gift className="w-4 h-4 stroke-[1.8]" />
            </ScallopFlowerBadge>
            <p className="font-bold text-[10px] text-[#5C0024] leading-tight mt-1">Perfect for</p>
            <p className="font-bold text-[10px] text-[#5C0024]">Gifting</p>
          </div>

          {/* Unique & Custom */}
          <div className="flex flex-col items-center">
            <ScallopFlowerBadge>
              <Sparkles className="w-4 h-4 stroke-[1.8]" />
            </ScallopFlowerBadge>
            <p className="font-bold text-[10px] text-[#5C0024] leading-tight mt-1">Unique & Custom</p>
            <p className="text-[9px] text-[#79002F]/75">pieces available</p>
          </div>
        </section>

        {/* 3. Shop by Category Section */}
        <section className="pt-1">
          {/* Category Header */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg xs:text-xl font-serif font-bold text-[#5C0024] tracking-tight">
                Shop by Category
              </h2>
              <span className="text-[#E07A93] font-handwriting text-lg">♡</span>
            </div>

            <Link
              to="/shop"
              className="text-xs font-semibold text-[#79002F] flex items-center gap-1 hover:underline"
            >
              <span>See All</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>

          {/* Category Horizontal Scroll Cards with White Bottom Pills */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 -mx-3 pl-3">
            {mobileCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="w-28 xs:w-32 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden relative border border-[#FAD3DC]/80 shadow-2xs group bg-white"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {/* White bottom pill label */}
                <div className="absolute bottom-2 left-1.5 right-1.5 bg-white/95 backdrop-blur-xs py-1 px-1 rounded-xl text-center shadow-xs border border-white/60">
                  <span className="text-[10px] xs:text-[11px] font-bold text-[#5C0024] leading-tight block truncate">
                    {cat.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Promotional Gift Set Banner */}
        <section className="my-2 p-3.5 xs:p-4 rounded-3xl bg-gradient-to-r from-[#FDE8EE] via-[#FCE4EB] to-[#FBD6E2] border border-[#FAD3DC] flex items-center justify-between relative overflow-hidden shadow-2xs">
          {/* Left Content */}
          <div className="flex-1 pr-2 z-10">
            <h3 className="font-serif font-bold text-sm xs:text-base text-[#5C0024] leading-tight">
              Handmade Gifts
            </h3>
            <h4 className="font-serif font-bold text-sm xs:text-base text-[#5C0024] leading-tight flex items-center gap-1">
              <span>for Every Occasion</span>
              <span className="text-[#E07A93] font-handwriting text-sm">♡</span>
            </h4>
            <p className="text-[9.5px] xs:text-[10px] text-[#79002F]/80 mt-1 leading-snug">
              Birthdays, Anniversaries, or Just Because
              <br />
              Make it Extra Special with Crochie Tales
            </p>
            <Link
              to="/shop?tag=gift"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#79002F] text-white text-[10px] xs:text-[11px] font-semibold shadow-xs active:scale-95 transition-all mt-2 hover:bg-[#5C0024]"
            >
              <span>Explore Gift Sets</span>
              <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Right Image (Cropped Gift Box) */}
          <div className="w-24 xs:w-28 sm:w-32 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-white/60">
            <img
              src={promoGiftBox}
              alt="Handmade Gift Sets"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* 5. Bestsellers Section */}
        <section className="pt-1">
          {/* Bestsellers Header */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg xs:text-xl font-serif font-bold text-[#5C0024] tracking-tight">
                Bestsellers
              </h2>
              <span className="text-[#E07A93] font-handwriting text-lg">♡</span>
            </div>

            <Link
              to="/shop"
              className="text-xs font-semibold text-[#79002F] flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>

          {/* Horizontal Product Cards (Equal height & identical alignment) */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 -mx-3 pl-3 items-stretch">
            {bestsellers.map((prod) => (
              <div key={prod.id} className="w-[160px] xs:w-[170px] shrink-0 flex flex-col">
                <ProductCard product={prod} className="h-full flex flex-col justify-between" />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Quick Mobile Story & Contact Banner */}
        <section className="mt-4 pt-2 space-y-2.5">
          <Link
            to="/about"
            className="p-3.5 rounded-2xl bg-white/90 border border-[#FAD3DC] flex items-center justify-between shadow-2xs hover:border-[#79002F]/40 transition-all group"
          >
            <div>
              <h4 className="font-serif font-bold text-xs text-[#79002F] group-hover:text-[#5C0024] transition-colors">
                Our Story ♡
              </h4>
              <p className="text-[10px] text-[#79002F]/75">Handcrafted with pure love & patience</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#79002F] text-white text-[10px] font-semibold group-hover:bg-[#5C0024] transition-colors shadow-xs">
              Read Story
            </span>
          </Link>

          <div className="p-3 rounded-2xl bg-white/80 border border-[#FAD3DC] flex items-center justify-between shadow-2xs">
            <div>
              <h4 className="font-serif font-bold text-xs text-[#79002F]">Custom Orders & Queries</h4>
              <p className="text-[10px] text-[#79002F]/75">+91 744 724 6150</p>
            </div>
            <a
              href="https://wa.me/917447246150"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-semibold flex items-center gap-1 shadow-2xs"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP HOME VIEW (lg:block) - Preserving original desktop layout           */}
      {/* ========================================================================= */}
      <div className="hidden lg:block">
        {/* 1. Full-Width Bleed Hero Section */}
        <section className="relative w-full overflow-hidden bg-[#FAF1E8] flex justify-center items-center">
          <div className="relative w-full max-h-[calc(100vh-100px)] flex justify-center items-center">
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
              <p className="text-xs md:text-sm lg:text-base tracking-[0.22em] uppercase font-bold text-[#79002F]">
                Little Threads, Big Happiness
              </p>
              <span className="text-[#C77D91] text-sm md:text-base font-handwriting block -mt-0.5">♡</span>
            </div>

            {/* Center Brand Logo */}
            <div
              className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none select-none flex items-center justify-center"
              style={{ top: '24%', width: 'min(380px, 45%)' }}
            >
              <img
                src={asset('/branding/crochie-tales-logo-transparent.webp')}
                alt="Crochei Tales"
                className="w-full h-auto max-h-[170px] md:max-h-[200px] object-contain drop-shadow-xs"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Central Content */}
            <div
              className="absolute left-1/2 -translate-x-1/2 text-center w-full max-w-lg md:max-w-xl px-4 flex flex-col items-center"
              style={{ top: '57%' }}
            >
              <h2 className="font-serif text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-[#79002F] leading-tight">
                Handmade Crochet Pieces for Brighter Days
              </h2>
              <p className="text-xs md:text-sm text-[#79002F]/85 leading-snug mt-0.5 max-w-md">
                Hair accessories, keychains, bouquets, wearables and more — crafted with love.
              </p>

              {/* Real Clickable Shop Now Button */}
              <div className="mt-2 md:mt-2.5 pointer-events-auto">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 px-7 md:px-8 py-2 md:py-2.5 rounded-full bg-[#79002F] text-white text-sm md:text-base font-semibold shadow-md hover:bg-[#5C0024] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Benefits Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-16 md:-mt-20">
          <div className="bg-[#FFF8F3]/95 backdrop-blur-sm rounded-2xl border border-[#F2DCD1] p-5 shadow-sm grid grid-cols-4 divide-x divide-[#F2DCD1]">
            <div className="flex items-center gap-3.5 p-3">
              <div className="text-[#79002F] shrink-0">
                <Truck className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#79002F] leading-tight">Free Shipping</p>
                <p className="text-[11px] text-[#79002F]/75 mt-0.5">on orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="text-[#79002F] shrink-0">
                <Heart className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#79002F] leading-tight">Handmade</p>
                <p className="text-[11px] text-[#79002F]/75 mt-0.5">with love</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="text-[#79002F] shrink-0">
                <Gift className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#79002F] leading-tight">Perfect for Gifting</p>
                <p className="text-[11px] text-[#79002F]/75 mt-0.5">for every occasion</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="text-[#79002F] shrink-0">
                <Sparkles className="w-7 h-7 stroke-[1.6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#79002F] leading-tight">Unique & Custom</p>
                <p className="text-[11px] text-[#79002F]/75 mt-0.5">pieces available</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Shop by Category Section */}
        <section
          className="relative w-full overflow-hidden py-20 md:py-24 my-8"
          style={{
            backgroundImage: `url("${categoryBg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="relative mb-10 -mt-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2">
                  <span className="text-[#C77D91] font-handwriting text-2xl">♡</span>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
                    Shop by Category
                  </h2>
                  <span className="text-[#C77D91] font-handwriting text-2xl">♡</span>
                </div>
                <p className="text-sm text-[#79002F]/80 mt-1 font-medium">
                  Find your perfect handmade piece
                </p>
              </div>

              <div className="absolute right-0 bottom-0 flex justify-end">
                <Link
                  to="/categories"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#79002F] text-white text-sm font-semibold shadow-sm hover:bg-[#520020] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>See All Categories</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categories/${cat.slug}`}
                  className="group relative bg-[#FFF4F6]/92 backdrop-blur-xs rounded-3xl p-4 md:p-4.5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-[#FAD3DC]/90 overflow-hidden shadow-sm"
                >
                  <div className="absolute top-2.5 left-2.5 text-[#C77D91]/70 text-sm pointer-events-none select-none font-handwriting">
                    ♡
                  </div>
                  <div className="absolute top-2.5 right-2.5 text-[#C77D91]/60 text-xs pointer-events-none select-none">
                    ✧
                  </div>

                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/75 shadow-inner flex items-center justify-center mb-3.5">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="pt-1.5 flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base select-none shrink-0">{cat.badge}</span>
                      <h3 className="font-serif font-bold text-[15px] text-[#79002F] group-hover:text-[#520020] transition-colors leading-tight line-clamp-1">
                        {cat.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#79002F]/75 mt-1 leading-tight line-clamp-1">
                      {cat.subtitle}
                    </p>

                    <div className="mt-3.5 pt-1.5 border-t border-dashed border-[#F2B8C5]/80 flex items-center justify-between">
                      <span className="text-[11px] font-handwriting text-[#C77D91] font-semibold">
                        Explore ♡
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#79002F] text-white flex items-center justify-center group-hover:bg-[#520020] group-hover:scale-110 group-hover:shadow-md transition-all shadow-xs">
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Our Story */}
        <section id="about" className="max-w-7xl mx-auto px-6 relative mt-20 scroll-mt-24">
          <div className="bg-[#FFF8F3] rounded-3xl border border-[#F2DCD1] p-10 md:p-12 shadow-sm">
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="text-[#C77D91] font-handwriting text-2xl">♡</span>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
                  Our Story
                </h2>
                <span className="text-[#C77D91] font-handwriting text-2xl">♡</span>
              </div>
              <p className="text-sm text-[#79002F]/80 mt-1 font-medium">
                Crafting Little Threads of Big Happiness
              </p>
            </div>

            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-white/70">
                <img
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=1000&auto=format&fit=crop&q=80"
                  alt="Crochei Tales Story"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="col-span-7 space-y-4 text-base leading-relaxed text-[#79002F]/90">
                <p>
                  Welcome to <strong className="text-[#79002F] font-serif font-bold text-lg">Crochei Tales</strong>, where every thread has a tale and every stitch is woven with heartfelt care. We believe in the timeless warmth and charm of authentic handmade creations.
                </p>
                <p>
                  Founded out of a genuine love for textile craftsmanship, Crochei Tales transforms premium natural cotton yarn into everlasting floral bouquets, chic hair accessories, plush toys, and custom heirloom gifts. Each piece is handmade patiently by dedicated artisans, ensuring unmatched durability, vibrant color, and a joyful personal touch.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F2DCD1]">
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

        {/* 5. Get in Touch */}
        <section
          id="contact"
          className="relative w-full overflow-hidden py-12 mt-16 scroll-mt-24 flex items-center justify-end"
          style={{
            backgroundImage: `url("${contactBg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="w-full max-w-xl px-6 mr-[12%] xl:mr-[16%] relative z-10 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F3]/90 border border-[#FAD3DC] text-[#79002F] text-xs font-semibold shadow-xs mb-2">
              <span className="font-handwriting text-sm">♡</span>
              <span>Contact Us</span>
              <span className="font-handwriting text-sm">♡</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#79002F] tracking-tight">
              Let’s Get in Touch
            </h2>

            <p className="text-sm text-[#79002F]/80 mt-1 max-w-md leading-snug font-medium">
              Have a question, custom order, or workshop query?
              <br />
              We’d love to hear from you!
            </p>

            <div className="w-full max-w-md mt-6 space-y-3">
              <a
                href="mailto:hello@crochietales.in"
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                    <Mail className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#79002F] leading-tight">
                      Email Us
                    </h3>
                    <p className="text-xs text-[#79002F]/75 mt-0.5 font-normal">
                      hello@crochietales.in
                    </p>
                  </div>
                </div>
                <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              <a
                href="https://instagram.com/crochie_tales"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#79002F] leading-tight">
                      DM on Instagram
                    </h3>
                    <p className="text-xs text-[#79002F]/75 mt-0.5 font-normal">
                      @crochie_tales
                    </p>
                  </div>
                </div>
                <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              <a
                href="https://wa.me/917447246150"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#FAD3DC]/90 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0F3] border border-[#FAD3DC] flex items-center justify-center text-[#79002F] group-hover:bg-[#79002F] group-hover:text-white transition-colors duration-200 shrink-0">
                    <MessageCircle className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#79002F] leading-tight">
                      Chat on WhatsApp
                    </h3>
                    <p className="text-xs text-[#79002F]/75 mt-0.5 font-normal">
                      +91 744 724 6150
                    </p>
                  </div>
                </div>
                <div className="text-[#79002F]/50 group-hover:text-[#79002F] group-hover:translate-x-0.5 transition-all p-1.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
