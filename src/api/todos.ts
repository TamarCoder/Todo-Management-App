/**
 * Todos API surface.
 *
 * Owner isolation (a user only sees their own todos) is enforced inside the
 * mock store. A real backend would derive `userId` from the session token
 * instead of accepting it as a parameter, but the contract is otherwise
 * identical.
 *
 * Endpoint contract:
 *   GET    /todos              → 200 Todo[]                   (filters by session user)
 *   GET    /todos/:id          → 200 Todo | 404 not found
 *   POST   /todos              → 201 Todo
 *   PATCH  /todos/:id          → 200 Todo | 403 not authorized | 404 not found
 *   DELETE /todos/:id          → 204     | 403 not authorized | 404 not found
 */

import type { Todo, TodoInput } from "@/lib/types";
import {
  createTodo as storeCreateTodo,
  deleteTodo as storeDeleteTodo,
  getTodo as storeGetTodo,
  listTodos as storeListTodos,
  updateTodo as storeUpdateTodo,
} from "@/lib/db";
import { toApiError } from "./client";

export const todosApi = {
  /** GET /todos */
  async list(userId: string): Promise<Todo[]> {
    try {
      return await storeListTodos(userId);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** GET /todos/:id — returns null when missing or not the caller's. */
  async get(userId: string, id: string): Promise<Todo | null> {
    try {
      return await storeGetTodo(userId, id);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** POST /todos */
  async create(userId: string, input: TodoInput): Promise<Todo> {
    try {
      return await storeCreateTodo(userId, input);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** PATCH /todos/:id */
  async update(
    userId: string,
    id: string,
    patch: Partial<TodoInput>
  ): Promise<Todo> {
    try {
      return await storeUpdateTodo(userId, id, patch);
    } catch (e) {
      throw toApiError(e);
    }
  },

  /** DELETE /todos/:id */
  async remove(userId: string, id: string): Promise<void> {
    try {
      await storeDeleteTodo(userId, id);
    } catch (e) {
      throw toApiError(e);
    }
  },
};
