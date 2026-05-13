
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
  async list(userId: string): Promise<Todo[]> {
    try {
      return await storeListTodos(userId);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async get(userId: string, id: string): Promise<Todo | null> {
    try {
      return await storeGetTodo(userId, id);
    } catch (e) {
      throw toApiError(e);
    }
  },

  async create(userId: string, input: TodoInput): Promise<Todo> {
    try {
      return await storeCreateTodo(userId, input);
    } catch (e) {
      throw toApiError(e);
    }
  },

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

  async remove(userId: string, id: string): Promise<void> {
    try {
      await storeDeleteTodo(userId, id);
    } catch (e) {
      throw toApiError(e);
    }
  },
};
