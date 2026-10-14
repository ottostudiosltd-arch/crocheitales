import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const WorkshopDetailPage: React.FC = () => {
  const [registered, setRegistered] = useState(false);

  const workshop = {
    title: 'Beginner Crochet Masterclass: Basics & Stitches',
    date: 'Sunday, Oct 26, 2026',
    time: '11:00 AM - 2:00 PM',
    duration: '3 Hours',
    price: 1499,
    venue: 'Boutique Craft Studio, Koregaon Park, Pune',
    capacity: 12,
    bookedCount: 9,
    materialsIncluded: [
      '2 Skeins of Premium Milk Cotton Yarn',
      'Ergonomic 3.5mm & 4.0mm Crochet Hooks',
      'Stitch Markers & Tapestry Needle',
      'Printed Pattern Guidebook & Step-by-Step Cheatsheet',
      'Complimentary Tea, Coffee & Light Artisanal Pastries',
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link to="/workshops" className="inline-flex items-center gap-2 text-sm text-brand-burgundy hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Workshops</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-softPink text-brand-burgundy uppercase">
              Hands-on Masterclass
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-burgundy font-normal">
              {workshop.title}
            </h1>
          </div>

          <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-brand-border bg-white shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=80"
              alt="Crochet workshop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl text-brand-burgundy font-bold">What's Included in Your Kit</h2>
            <ul className="space-y-2 text-sm text-brand-text-muted">
              {workshop.materialsIncluded.map((mat, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-burgundy shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Registration Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-card space-y-6 sticky top-28">
            <div className="space-y-1">
              <span className="text-xs text-brand-text-muted uppercase tracking-wider font-semibold">Seat Investment</span>
              <p className="text-3xl font-bold text-brand-burgundy font-sans">₹{workshop.price.toLocaleString('en-IN')}</p>
              <p className="text-xs text-brand-text-muted">Includes all materials & take-home creations</p>
            </div>

            <div className="space-y-3 text-xs text-brand-text-muted border-t border-brand-border/60 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-burgundy shrink-0" />
                <span>{workshop.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-burgundy shrink-0" />
                <span>{workshop.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-burgundy shrink-0" />
                <span>{workshop.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-burgundy shrink-0" />
                <span className="font-semibold text-brand-burgundy">
                  Only {workshop.capacity - workshop.bookedCount} seats remaining!
                </span>
              </div>
            </div>

            {registered ? (
              <div className="bg-brand-softPink/60 p-4 rounded-2xl text-center text-xs text-brand-burgundy font-semibold">
                🎉 Your seat is reserved! Confirmation email sent.
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setRegistered(true)}
              >
                Book Your Seat Now
              </Button>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-brand-text-muted">
              <ShieldCheck className="w-4 h-4 text-brand-burgundy" />
              <span>Full refund up to 48 hours prior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
