import { create } from "zustand";

type SearchState = {
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),
  clear: () => set({ query: "" }),
}));

/** Case-insensitive title match used across views. */
export function matchesQuery(title: string, query: string): boolean {
  if (!query.trim()) return true;
  return title.toLowerCase().includes(query.trim().toLowerCase());
}
