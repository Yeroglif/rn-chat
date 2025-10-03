import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import supabase from "../services/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message });
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
      set({ error: error.message });
    } else {
      set({ user: data.user, session: data.session });

      if (data.user?.id) {
        const { error: insertError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            username: data.user.user_metadata.name || "New User",
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          set({ error: insertError.message });
        } else {
        }
      } else {
        set({ error: "User ID is missing" });
      }
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
  clearError: () => set({ error: null }),
}));
