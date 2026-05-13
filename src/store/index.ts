
import { useAuthStore } from "./auth-store";
import { useTodoStore } from "./todo-store";

export { useAuthStore } from "./auth-store";
export { useSearchStore, matchesQuery } from "./search-store";
export { useTodoStore } from "./todo-store";

let wired = false;

export function wireStores() {
  if (wired) return;
  wired = true;

  useAuthStore.subscribe(
    (state) => state.user?.id ?? null,
    (userId) => {
      if (userId) {
        useTodoStore.getState().refresh(userId);
      } else {
        useTodoStore.getState().clear();
      }
    }
  );
}
