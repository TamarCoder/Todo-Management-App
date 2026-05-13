export type User = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
};

export type TodoStatus = "todo" | "in_progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

export const TODO_STATUSES: TodoStatus[] = ["todo", "in_progress", "done"];
export const TODO_PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

export type Todo = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TodoInput = {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
};
