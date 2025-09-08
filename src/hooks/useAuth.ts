import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import supabase from "../services/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
    } else {
      set({ user: data.user, session: data.session });
    }
    set({ loading: false });
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
    } else {
      set({ user: data.user, session: data.session });
    }
    set({ loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
  },
}));
