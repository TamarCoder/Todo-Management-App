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

export function matchesQuery(title: string, query: string): boolean {
  if (!query.trim()) return true;
  return title.toLowerCase().includes(query.trim().toLowerCase());
}
