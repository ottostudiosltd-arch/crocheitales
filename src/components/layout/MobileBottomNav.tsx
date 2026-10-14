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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F3CDD5] px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] rounded-t-2xl sm:rounded-t-3xl"
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
                  'flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-200 select-none min-w-[56px]',
                  isActive
                    ? 'text-[#79002F] font-semibold'
                    : 'text-[#8C5D67] hover:text-[#79002F]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'px-3.5 py-1 rounded-2xl transition-all duration-200 flex items-center justify-center',
                      isActive ? 'bg-[#FCEAEB] text-[#79002F]' : 'text-[#8C5D67]'
                    )}
                  >
                    <Icon className="w-5 h-5 stroke-[1.9]" />
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
