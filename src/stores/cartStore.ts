import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../components/shop/ProductCard';

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  price: number; // in INR
  originalPrice?: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product | { id: string; slug: string; title: string; price: number; originalPrice?: number; imageUrl: string }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'best-1',
          slug: 'bow-hair-clip',
          title: 'Bow Hair Clip',
          price: 149,
          originalPrice: 249,
          imageUrl: '/images/products/bow-hair-clip.webp',
          quantity: 1,
        },
        {
          id: 'best-2',
          slug: 'daisy-keychain',
          title: 'Daisy Keychain',
          price: 199,
          originalPrice: 299,
          imageUrl: '/images/products/daisy-keychain.webp',
          quantity: 1,
        },
      ],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                originalPrice: product.originalPrice,
                imageUrl: product.imageUrl,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'crochie_tales_cart',
    }
  )
);
