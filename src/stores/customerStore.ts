import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CustomerStoreState {
  profile: CustomerProfile;
  recentOrderNumbers: string[];
  setProfile: (profile: Partial<CustomerProfile>) => void;
  addOrderNumber: (orderNumber: string) => void;
  clearProfile: () => void;
}

const defaultProfile: CustomerProfile = {
  fullName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Maharashtra',
  postalCode: '',
};

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      recentOrderNumbers: [],

      setProfile: (updated) =>
        set((state) => ({
          profile: { ...state.profile, ...updated },
        })),

      addOrderNumber: (orderNumber: string) =>
        set((state) => ({
          recentOrderNumbers: [
            orderNumber,
            ...state.recentOrderNumbers.filter((n) => n !== orderNumber),
          ],
        })),

      clearProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'crochie_tales_customer_info',
    }
  )
);
