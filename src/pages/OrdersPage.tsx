import React from 'react';
import { Truck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const OrdersPage: React.FC = () => {
  const orders = [
    {
      id: 'CT-82914',
      date: 'Oct 10, 2026',
      total: 1148,
      status: 'Shipped via Shiprocket',
      awb: 'SR992019482IN',
      items: [
        { title: 'Tulip Crochet Bouquet', qty: 1, price: 899 },
        { title: 'Bow Hair Clip (Dusty Rose)', qty: 1, price: 249 },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-brand-burgundy font-normal">
          My Order History
        </h1>
        <Link to="/shop">
          <Button variant="outline" size="sm">Continue Shopping</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-brand-border/70 p-6 shadow-soft space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-brand-border/60">
              <div>
                <span className="text-xs text-brand-text-muted">Order ID:</span>
                <p className="font-serif font-bold text-brand-burgundy text-lg">{order.id}</p>
                <span className="text-xs text-brand-text-muted">{order.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="bestseller">{order.status}</Badge>
                <span className="text-base font-bold text-brand-burgundy font-sans">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text-primary">
                    {item.title} <span className="text-brand-text-muted text-xs">× {item.qty}</span>
                  </span>
                  <span className="font-medium text-brand-text-primary">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-brand-text-muted">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-burgundy shrink-0" />
                <span>AWB Tracking: <strong>{order.awb}</strong></span>
              </div>
              <a
                href={`https://shiprocket.co/tracking/${order.awb}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-brand-burgundy font-semibold hover:underline"
              >
                <span>Track on Shiprocket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
