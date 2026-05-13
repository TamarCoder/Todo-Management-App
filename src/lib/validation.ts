import { TODO_PRIORITIES, TODO_STATUSES, TodoPriority, TodoStatus } from "./types";

export type ValidationResult = { valid: boolean; error?: string };

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(value: string): ValidationResult {
  if (!value || !value.trim()) return { valid: false, error: "Email is required" };
  if (!EMAIL_RE.test(value.trim())) return { valid: false, error: "Enter a valid email address" };
  return { valid: true };
}

export function validatePassword(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Password is required" };
  if (value.length < 8) return { valid: false, error: "Password must be at least 8 characters" };
  if (!/[A-Za-z]/.test(value)) return { valid: false, error: "Password must contain a letter" };
  if (!/[0-9]/.test(value)) return { valid: false, error: "Password must contain a number" };
  return { valid: true };
}

export function validateConfirmPassword(password: string, confirm: string): ValidationResult {
  if (!confirm) return { valid: false, error: "Please confirm your password" };
  if (password !== confirm) return { valid: false, error: "Passwords do not match" };
  return { valid: true };
}

export function validateTodoTitle(value: string): ValidationResult {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return { valid: false, error: "Title is required" };
  if (trimmed.length > 120) return { valid: false, error: "Title must be 120 characters or fewer" };
  return { valid: true };
}

export function validateStatus(value: string): ValidationResult {
  if (!TODO_STATUSES.includes(value as TodoStatus)) {
    return { valid: false, error: "Invalid status" };
  }
  return { valid: true };
}

export function validatePriority(value: string): ValidationResult {
  if (!TODO_PRIORITIES.includes(value as TodoPriority)) {
    return { valid: false, error: "Invalid priority" };
  }
  return { valid: true };
}

export function validateDueDate(value: string | null | undefined): ValidationResult {
  if (!value) return { valid: true };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: "Invalid date" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() < today.getTime()) {
    return { valid: false, error: "Due date cannot be in the past" };
  }
  return { valid: true };
}

export function validateDisplayName(value: string): ValidationResult {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return { valid: false, error: "Display name is required" };
  if (trimmed.length > 60) return { valid: false, error: "Display name must be 60 characters or fewer" };
  return { valid: true };
}
