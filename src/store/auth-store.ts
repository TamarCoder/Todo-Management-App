import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { authApi, ApiError } from "@/api";
import { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: { displayName: string }) => Promise<void>;
  _reset: () => void;
};

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    loading: true,
    initialized: false,

    initialize: async () => {
      if (get().initialized) return;
      set({ initialized: true });
      try {
        await authApi.seed();
        const u = await authApi.me();
        set({ user: u, loading: false });
      } catch (e) {
        set({ loading: false });
        if (!(e instanceof ApiError)) throw e;
      }
    },

    login: async (email, password) => {
      const u = await authApi.login(email, password);
      set({ user: u });
    },

    register: async (email, password, displayName) => {
      const u = await authApi.register({ email, password, displayName });
      set({ user: u });
    },

    logout: async () => {
      await authApi.logout();
      set({ user: null });
    },

    updateProfile: async (patch) => {
      const { user } = get();
      if (!user) throw new ApiError("Not signed in", 401);
      const updated = await authApi.updateProfile(user.id, patch);
      set({ user: updated });
    },

    _reset: () => set({ user: null, loading: true, initialized: false }),
  }))
);
