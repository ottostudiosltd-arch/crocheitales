import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProductCard, type Product } from '../components/shop/ProductCard';

export const DesignSystemShowcase: React.FC = () => {
  const [cartCount, setCartCount] = useState(2);
  const [notification, setNotification] = useState<string | null>(null);

  const sampleProduct: Product = {
    id: 'prod-1',
    slug: 'tulip-crochet-bouquet',
    title: 'Tulip Crochet Bouquet',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80',
    tag: 'Bestseller',
    inStock: true,
  };

  const sampleBow: Product = {
    id: 'prod-2',
    slug: 'bow-hair-clip',
    title: 'Bow Hair Clip',
    price: 249,
    rating: 4.6,
    reviewCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    tag: 'Sale',
    inStock: true,
  };

  const sampleKeychain: Product = {
    id: 'prod-3',
    slug: 'daisy-keychain',
    title: 'Daisy Keychain',
    price: 199,
    rating: 4.7,
    reviewCount: 76,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    inStock: true,
  };

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
    setNotification(`Added "${product.title}" to cart! (Cart: ${cartCount + 1})`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-brand-burgundy text-white px-5 py-3 rounded-full shadow-card flex items-center gap-2 text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-brand-blush" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="bestseller" className="px-3.5 py-1 text-xs">
          Phase 1: Brand System & UI Design Verified
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-burgundy font-normal tracking-tight">
          Crochei Tales Design System
        </h1>
        <p className="text-base sm:text-lg text-brand-text-muted">
          Centralized brand tokens, typography, exact logo asset, and reusable boutique UI components tailored to the client's approved aesthetic.
        </p>
      </div>

      {/* 1. Brand Logo Showcase */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            1. Brand Logo & Wordmark
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 flex flex-col items-center justify-center gap-4 bg-white border border-brand-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
              Primary Header Logo (Burgundy Variant)
            </span>
            <Logo size="lg" showTagline />
          </Card>

          <Card className="p-8 flex flex-col items-center justify-center gap-4 bg-brand-burgundy text-white border-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-softPink">
              Footer & Dark Background (White/Blush Variant)
            </span>
            <Logo variant="white" size="lg" showTagline />
          </Card>
        </div>
      </section>

      {/* 2. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            2. Centralized Color Palette
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-brand-burgundy text-white p-4 rounded-2xl shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75">Deep Burgundy</span>
            <div>
              <p className="font-bold text-sm">#79002F</p>
              <p className="text-[10px] opacity-75">Primary Brand / CTAs</p>
            </div>
          </div>

          <div className="bg-brand-dustyRose text-white p-4 rounded-2xl shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75">Dusty Rose</span>
            <div>
              <p className="font-bold text-sm">#C77D91</p>
              <p className="text-[10px] opacity-75">Secondary / Accents</p>
            </div>
          </div>

          <div className="bg-brand-blush text-brand-burgundy p-4 rounded-2xl shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75 font-medium">Blush Pink</span>
            <div>
              <p className="font-bold text-sm">#F2B8C5</p>
              <p className="text-[10px] opacity-75">Badges / Highlights</p>
            </div>
          </div>

          <div className="bg-brand-softPink text-brand-burgundy p-4 rounded-2xl shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75 font-medium">Soft Pink</span>
            <div>
              <p className="font-bold text-sm">#FBE0E6</p>
              <p className="text-[10px] opacity-75">Subtle Cards / Tints</p>
            </div>
          </div>

          <div className="bg-brand-cream text-brand-text-primary p-4 rounded-2xl border border-brand-border shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75 font-medium">Warm Cream</span>
            <div>
              <p className="font-bold text-sm">#F8F1E5</p>
              <p className="text-[10px] opacity-75">Section Backdrops</p>
            </div>
          </div>

          <div className="bg-brand-peach text-brand-text-primary p-4 rounded-2xl border border-brand-border shadow-soft flex flex-col justify-between h-36">
            <span className="text-xs opacity-75 font-medium">Soft Peach</span>
            <div>
              <p className="font-bold text-sm">#FEEFEA</p>
              <p className="text-[10px] opacity-75">Hero Glow / Neutral</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            3. Typography Hierarchy
          </h2>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-text-muted uppercase">Serif Headings (DM Serif Display / Playfair)</span>
            <p className="text-3xl sm:text-4xl font-serif text-brand-burgundy">
              Little Threads, Big Happiness
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-text-muted uppercase">Sans-Serif Body (Plus Jakarta Sans)</span>
            <p className="text-base text-brand-text-primary leading-relaxed max-w-2xl">
              Handmade crochet pieces designed for brighter days. Each product is crafted with 100% premium cotton yarn, delicate craftsmanship, and immense attention to detail.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-brand-text-muted uppercase">Cursive Handwriting Accent (Caveat / Dancing Script)</span>
            <p className="text-2xl sm:text-3xl font-handwriting text-brand-dustyRose">
              Made with love ♡ for your special moments
            </p>
          </div>
        </Card>
      </section>

      {/* 4. Button & Badge Component System */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            4. Reusable Buttons & Badges
          </h2>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 bg-white">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Shop Now
            </Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Explore Workshops</Button>
            <Button variant="soft">View Details</Button>
            <Button variant="ghost">Learn More</Button>
            <Button variant="primary" isLoading>Processing</Button>
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3">
            <span className="text-xs text-brand-text-muted font-medium mr-2">Badges:</span>
            <Badge variant="bestseller">Bestseller</Badge>
            <Badge variant="sale">Sale -25%</Badge>
            <Badge variant="new">New Arrival</Badge>
            <Badge variant="subtle">Free Shipping</Badge>
            <Badge variant="outline">Custom Made</Badge>
          </div>
        </Card>
      </section>

      {/* 5. Section Heading Component with Mockup Flourishes */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            5. Boutique Section Headings
          </h2>
        </div>

        <div className="space-y-8 bg-brand-cream/40 p-6 rounded-3xl border border-brand-border/60">
          <SectionHeading
            title="Shop by Category"
            subtitle="Find your perfect handmade piece"
          />

          <SectionHeading
            title="Featured Products"
            align="left"
            viewAllLink="/shop"
            viewAllText="View All Products"
          />
        </div>
      </section>

      {/* 6. Product Cards Grid (Matching Mockups) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            6. Interactive Product Cards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            product={sampleProduct}
            onAddToCart={handleAddToCart}
            isWishlisted
          />
          <ProductCard
            product={sampleBow}
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            product={sampleKeychain}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>

      {/* 7. Unconfirmed Brand Values Record (Phase 1 Acceptance Criterion) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-border">
          <Sparkles className="w-5 h-5 text-brand-burgundy" />
          <h2 className="text-2xl font-serif text-brand-burgundy font-medium">
            7. Brand Values Verification Status
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream border-b border-brand-border text-xs uppercase tracking-wider text-brand-burgundy">
              <tr>
                <th className="px-6 py-3.5">Asset / Value</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Current Applied Value</th>
                <th className="px-6 py-3.5">Action / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-brand-text-primary">
              <tr>
                <td className="px-6 py-4 font-semibold">Brand Logo</td>
                <td className="px-6 py-4">
                  <Badge variant="bestseller">Confirmed</Badge>
                </td>
                <td className="px-6 py-4">High-res client provided asset ("crochei tales" with yarn heart)</td>
                <td className="px-6 py-4 text-xs text-brand-text-muted">Preserved without alteration</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">Color Palette</td>
                <td className="px-6 py-4">
                  <Badge variant="bestseller">Confirmed</Badge>
                </td>
                <td className="px-6 py-4">#79002F, #C77D91, #F2B8C5, #F8F1E5, #FBE0E6</td>
                <td className="px-6 py-4 text-xs text-brand-text-muted">Centralized in Tailwind design tokens</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">Exact Font Name</td>
                <td className="px-6 py-4">
                  <Badge variant="sale">Provisional</Badge>
                </td>
                <td className="px-6 py-4">DM Serif Display + Plus Jakarta Sans + Caveat</td>
                <td className="px-6 py-4 text-xs text-brand-text-muted">Will swap seamlessly if client provides specific font file</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold">Custom Domain</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">Pending</Badge>
                </td>
                <td className="px-6 py-4">crochietales.in</td>
                <td className="px-6 py-4 text-xs text-brand-text-muted">Awaiting client ownership & DNS access (Phase 13)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
