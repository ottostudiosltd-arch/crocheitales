import React from 'react';
import { MapPin, Package, Heart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-brand-softPink text-brand-burgundy flex items-center justify-center font-serif text-3xl font-bold border-2 border-brand-border">
          T
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-serif font-bold text-brand-burgundy">Tausif Shaikh</h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">tausif@example.com • +91 744 724 6150</p>
          <span className="inline-block mt-2 text-xs px-3 py-0.5 rounded-full bg-brand-cream text-brand-burgundy font-medium border border-brand-border/60">
            Valued Crochet Lover
          </span>
        </div>
        <Button variant="outline" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/orders"
          className="group bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-softPink text-brand-burgundy flex items-center justify-center shrink-0 group-hover:bg-brand-burgundy group-hover:text-white transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-brand-burgundy">My Orders</h3>
            <p className="text-xs text-brand-text-muted">Track & review shipments</p>
          </div>
        </Link>

        <div className="group bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cream text-brand-burgundy flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-brand-burgundy">Addresses</h3>
            <p className="text-xs text-brand-text-muted">1 saved shipping address</p>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-3xl border border-brand-border/70 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-peach text-brand-burgundy flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-brand-burgundy">Wishlist</h3>
            <p className="text-xs text-brand-text-muted">3 saved favorites</p>
          </div>
        </div>
      </div>
    </div>
  );
};
