import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, LayoutGrid, GraduationCap, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Collections', path: '/collections', icon: LayoutGrid },
    { name: 'Workshops', path: '/workshops', icon: GraduationCap },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-border/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(121,0,47,0.05)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 select-none min-w-[56px]',
                  isActive
                    ? 'text-brand-burgundy font-semibold'
                    : 'text-brand-text-muted hover:text-brand-burgundy'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-1 rounded-full transition-transform',
                      isActive ? 'bg-brand-softPink text-brand-burgundy scale-105' : ''
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
