import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot';

  // Modal actions
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;

  // Auth actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  isAuthModalOpen: false,
  authModalMode: 'signin',

  openAuthModal: (mode = 'signin') => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, session });
        await get().refreshProfile();
      } else {
        set({ user: null, profile: null, session: null, isAdmin: false });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          set({ user: newSession.user, session: newSession });
          await get().refreshProfile();
        } else {
          set({ user: null, profile: null, session: null, isAdmin: false });
        }
      });
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        const profileData = data as unknown as Profile;
        set({
          profile: profileData,
          isAdmin: profileData.role === 'admin',
        });
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      set({ user: data.user, session: data.session });
      await get().refreshProfile();
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Login failed' };
    }
  },

  signUp: async (email, password, fullName, phone) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || '',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
        await get().refreshProfile();
      }

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Registration failed' };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, session: null, isAdmin: false });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  },
}));
