import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeading
        title="Get in Touch"
        subtitle="Have a custom order idea or question? We'd love to hear from you!"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-6">
            <h2 className="font-serif text-xl text-brand-burgundy font-bold">Connect With Us</h2>
            <div className="space-y-4 text-sm text-brand-text-muted">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-text-primary">Email Inquiries</p>
                  <p>hello@crocheitales.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-text-primary">WhatsApp & Call</p>
                  <p>+91 744 724 6150</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-burgundy shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-text-primary">Studio Location</p>
                  <p>Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-brand-burgundy mx-auto" />
                <h3 className="text-2xl font-serif text-brand-burgundy">Message Sent!</h3>
                <p className="text-sm text-brand-text-muted">
                  Thank you for reaching out. We will respond to your message within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya"
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                    Subject / Custom Request
                  </label>
                  <input
                    type="text"
                    placeholder="Custom Crochet Bouquet, Bulk Gifting, etc."
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-text-muted mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you have in mind..."
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream/30 text-sm focus:outline-none focus:border-brand-burgundy"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" rightIcon={<Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
