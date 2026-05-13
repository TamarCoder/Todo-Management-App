import { create } from "zustand";
import { todosApi } from "@/api";
import { Todo, TodoInput } from "@/lib/types";

type TodoState = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  loadedFor: string | null;
  refresh: (userId: string) => Promise<void>;
  clear: () => void;
  create: (userId: string, input: TodoInput) => Promise<Todo>;
  update: (userId: string, id: string, patch: Partial<TodoInput>) => Promise<Todo>;
  remove: (userId: string, id: string) => Promise<void>;
};

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,
  loadedFor: null,

  refresh: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await todosApi.list(userId);
      set({ todos: data, loading: false, loadedFor: userId });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to load todos", loading: false });
    }
  },

  clear: () => set({ todos: [], loadedFor: null, error: null, loading: false }),

  create: async (userId, input) => {
    const t = await todosApi.create(userId, input);
    set((state) => ({ todos: [t, ...state.todos] }));
    return t;
  },

  update: async (userId, id, patch) => {
    // Optimistic — flip controlled inputs immediately, reconcile when API returns.
    const now = new Date().toISOString();
    set((state) => ({
      todos: state.todos.map((x) =>
        x.id === id ? { ...x, ...patch, updatedAt: now } : x
      ),
    }));
    try {
      const t = await todosApi.update(userId, id, patch);
      set((state) => ({
        todos: state.todos.map((x) => (x.id === id ? t : x)),
      }));
      return t;
    } catch (e) {
      // Roll back by re-fetching authoritative state.
      await get().refresh(userId);
      throw e;
    }
  },

  remove: async (userId, id) => {
    await todosApi.remove(userId, id);
    set((state) => ({ todos: state.todos.filter((x) => x.id !== id) }));
  },
}));
