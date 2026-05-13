
import { Todo, TodoInput, User } from "./types";
import { localDateISO } from "./utils";

const KEY_USERS = "focusflow:users";
const KEY_TODOS = "focusflow:todos";
const KEY_SESSION = "focusflow:session";
const KEY_SEEDED = "focusflow:seeded";
const SEED_VERSION = "2";

const ARTIFICIAL_DELAY_MS = 200;

function delay<T>(value: T, ms = ARTIFICIAL_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  const s = safeStorage();
  if (!s) return fallback;
  const raw = s.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(key, JSON.stringify(value));
}

export function uid(): string {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function hashPassword(password: string): string {
  const salted = `focusflow::${password}::v1`;
  if (typeof window === "undefined") {
    return Buffer.from(salted).toString("base64");
  }
  return window.btoa(unescape(encodeURIComponent(salted)));
}

export async function listUsers(): Promise<User[]> {
  return delay(readJSON<User[]>(KEY_USERS, []));
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = readJSON<User[]>(KEY_USERS, []);
  const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  return delay(u ?? null);
}

export async function findUserById(id: string): Promise<User | null> {
  const users = readJSON<User[]>(KEY_USERS, []);
  return delay(users.find((u) => u.id === id) ?? null);
}

export async function createUser(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<User> {
  const users = readJSON<User[]>(KEY_USERS, []);
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  const user: User = {
    id: uid(),
    email: input.email.trim(),
    passwordHash: hashPassword(input.password),
    displayName: input.displayName.trim(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON(KEY_USERS, users);
  return delay(user);
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "displayName">>
): Promise<User> {
  const users = readJSON<User[]>(KEY_USERS, []);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx], ...patch };
  writeJSON(KEY_USERS, users);
  return delay(users[idx]);
}

export async function verifyCredentials(email: string, password: string): Promise<User> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");
  if (user.passwordHash !== hashPassword(password)) {
    throw new Error("Invalid email or password");
  }
  return user;
}

export function getSessionUserId(): string | null {
  const s = safeStorage();
  if (!s) return null;
  return s.getItem(KEY_SESSION);
}

export function setSessionUserId(userId: string | null): void {
  const s = safeStorage();
  if (!s) return;
  if (userId) s.setItem(KEY_SESSION, userId);
  else s.removeItem(KEY_SESSION);
}

export async function listTodos(userId: string): Promise<Todo[]> {
  const all = readJSON<Todo[]>(KEY_TODOS, []);
  const mine = all.filter((t) => t.userId === userId);
  mine.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return delay(mine);
}

export async function getTodo(userId: string, id: string): Promise<Todo | null> {
  const all = readJSON<Todo[]>(KEY_TODOS, []);
  const t = all.find((x) => x.id === id);
  if (!t) return delay(null);
  if (t.userId !== userId) return delay(null); 
  return delay(t);
}

export async function createTodo(userId: string, input: TodoInput): Promise<Todo> {
  const all = readJSON<Todo[]>(KEY_TODOS, []);
  const now = new Date().toISOString();
  const todo: Todo = {
    id: uid(),
    userId,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now,
  };
  all.push(todo);
  writeJSON(KEY_TODOS, all);
  return delay(todo);
}

export async function updateTodo(
  userId: string,
  id: string,
  patch: Partial<TodoInput>
): Promise<Todo> {
  const all = readJSON<Todo[]>(KEY_TODOS, []);
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Todo not found");
  if (all[idx].userId !== userId) throw new Error("Not authorized");
  all[idx] = {
    ...all[idx],
    ...patch,
    title: patch.title !== undefined ? patch.title.trim() : all[idx].title,
    description: patch.description !== undefined ? (patch.description?.trim() || undefined) : all[idx].description,
    updatedAt: new Date().toISOString(),
  };
  writeJSON(KEY_TODOS, all);
  return delay(all[idx]);
}

export async function deleteTodo(userId: string, id: string): Promise<void> {
  const all = readJSON<Todo[]>(KEY_TODOS, []);
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Todo not found");
  if (all[idx].userId !== userId) throw new Error("Not authorized");
  all.splice(idx, 1);
  writeJSON(KEY_TODOS, all);
  return delay(undefined);
}

export async function seedIfEmpty(): Promise<void> {
  const s = safeStorage();
  if (!s) return;
  if (s.getItem(KEY_SEEDED) === SEED_VERSION) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const existingUsers = readJSON<User[]>(KEY_USERS, []);
  let demoUser = existingUsers.find((u) => u.email === "demo@focusflow.app");

  if (!demoUser) {
    demoUser = {
      id: uid(),
      email: "demo@focusflow.app",
      passwordHash: hashPassword("demo1234"),
      displayName: "Demo User",
      createdAt: new Date().toISOString(),
    };
    writeJSON(KEY_USERS, [...existingUsers, demoUser]);
  }

  const existingTodos = readJSON<Todo[]>(KEY_TODOS, []);
  const preserved = existingTodos.filter((t) => t.userId !== demoUser!.id);

  const atToday = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const seedTodos: Todo[] = [
    {
      id: uid(), userId: demoUser.id,
      title: "Finalize Q4 Quarterly Report",
      description: "Review numbers with finance, polish slides, send to leadership.",
      status: "in_progress", priority: "high", dueDate: localDateISO(today),
      createdAt: atToday(10, 0), updatedAt: atToday(10, 0),
    },
    {
      id: uid(), userId: demoUser.id,
      title: "Product Design Review with Team",
      status: "todo", priority: "medium", dueDate: localDateISO(today),
      createdAt: atToday(14, 30), updatedAt: atToday(14, 30),
    },
    {
      id: uid(), userId: demoUser.id,
      title: "Renew professional insurance policy",
      status: "todo", priority: "low", dueDate: localDateISO(nextWeek),
      createdAt: atToday(9, 15), updatedAt: atToday(9, 15),
    },
    {
      id: uid(), userId: demoUser.id,
      title: "Review feedback on user onboarding flow",
      status: "todo", priority: "medium", dueDate: localDateISO(tomorrow),
      createdAt: atToday(9, 30), updatedAt: atToday(9, 30),
    },
    {
      id: uid(), userId: demoUser.id,
      title: "Ship FocusFlow MVP",
      status: "done", priority: "high", dueDate: null,
      createdAt: atToday(8, 0), updatedAt: atToday(8, 0),
    },
  ];
  writeJSON(KEY_TODOS, [...preserved, ...seedTodos]);
  s.setItem(KEY_SEEDED, SEED_VERSION);
}

export function _resetForTests(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(KEY_USERS);
  s.removeItem(KEY_TODOS);
  s.removeItem(KEY_SESSION);
  s.removeItem(KEY_SEEDED);
}
