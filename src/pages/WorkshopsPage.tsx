import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const WorkshopsPage: React.FC = () => {
  const workshops = [
    {
      id: 'ws-1',
      slug: 'beginner-crochet-masterclass',
      title: 'Beginner Crochet Masterclass: Basics & Stitches',
      description: 'Learn fundamental slip knots, chain stitches, single & double crochet. Complete your first granny square with live personalized guidance!',
      format: 'Offline Studio Session',
      venue: 'Boutique Craft Studio, Pune',
      date: 'Sunday, Oct 26, 2026',
      time: '11:00 AM - 2:00 PM',
      duration: '3 Hours',
      price: 1499,
      capacity: 12,
      bookedCount: 9,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
      badge: 'Almost Full',
    },
    {
      id: 'ws-2',
      slug: 'crochet-flower-bouquet-crafting',
      title: 'Handmade Tulip & Daisy Bouquet Workshop',
      description: 'Master 3D flower petals, wire stem assembly, and floral presentation wrapping. Take home a finished 3-flower crochet bouquet!',
      format: 'Live Online Workshop (Zoom)',
      venue: 'Interactive Zoom + Free Delivered Yarn Kit',
      date: 'Saturday, Nov 01, 2026',
      time: '4:00 PM - 7:00 PM',
      duration: '3 Hours',
      price: 1199,
      capacity: 20,
      bookedCount: 11,
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80',
      badge: 'Popular',
    },
    {
      id: 'ws-3',
      slug: 'amigurumi-bunny-plushie-workshop',
      title: 'Amigurumi Bunny Plushie Creation',
      description: 'Dive into 3D crochet sculpting, circular rounds, stuffing techniques, and embroidery facial features for cute plush toys.',
      format: 'Offline Studio Session',
      venue: 'Artisans Hall, Mumbai',
      date: 'Sunday, Nov 08, 2026',
      time: '10:30 AM - 2:30 PM',
      duration: '4 Hours',
      price: 1899,
      capacity: 10,
      bookedCount: 4,
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      badge: 'New',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SectionHeading
        title="Crochet Workshops"
        subtitle="Learn • Create • Have Fun with our interactive hands-on masterclasses"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops.map((ws) => (
          <div
            key={ws.id}
            className="group bg-white rounded-3xl border border-brand-border/70 overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-cream/50">
                <img
                  src={ws.imageUrl}
                  alt={ws.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="bestseller">{ws.badge}</Badge>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-brand-burgundy px-3 py-1 rounded-full text-xs font-bold font-sans">
                  ₹{ws.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-serif text-xl font-bold text-brand-burgundy group-hover:text-brand-burgundy-dark transition-colors line-clamp-2">
                  {ws.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-text-muted line-clamp-2">
                  {ws.description}
                </p>

                <div className="space-y-2 text-xs text-brand-text-muted pt-2 border-t border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                    <span>{ws.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                    <span>{ws.time} ({ws.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                    <span className="truncate">{ws.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                    <span>Seats: {ws.bookedCount} / {ws.capacity} booked</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link to={`/workshops/${ws.slug}`} className="block w-full">
                <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Register Seat
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
