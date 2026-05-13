"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Todo, TodoInput, TodoPriority, TodoStatus } from "@/lib/types";
import {
  validateDueDate,
  validatePriority,
  validateStatus,
  validateTodoTitle,
} from "@/lib/validation";

type Errors = Partial<Record<"title" | "description" | "status" | "priority" | "dueDate", string>>;

export function TodoForm({
  initial,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Todo>;
  submitLabel?: string;
  onSubmit: (input: TodoInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TodoStatus>((initial?.status as TodoStatus) ?? "todo");
  const [priority, setPriority] = useState<TodoPriority>(
    (initial?.priority as TodoPriority) ?? "medium"
  );
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): Errors => {
    const e: Errors = {};
    const t = validateTodoTitle(title);
    if (!t.valid) e.title = t.error;
    const s = validateStatus(status);
    if (!s.valid) e.status = s.error;
    const p = validatePriority(priority);
    if (!p.valid) e.priority = p.error;
    // Only enforce future-date rule when creating; allow editing past-due tasks.
    if (!initial?.id) {
      const d = validateDueDate(dueDate || null);
      if (!d.valid) e.dueDate = d.error;
    } else if (dueDate) {
      const d = new Date(dueDate);
      if (Number.isNaN(d.getTime())) e.dueDate = "Invalid date";
    }
    return e;
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setFormError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? dueDate : null,
      });
    } catch (err: any) {
      setFormError(err?.message ?? "Failed to save todo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <ErrorMessage message={formError} />}
      <Input
        label="Title"
        name="title"
        placeholder="Finalize Q4 quarterly report"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />
      <Textarea
        label="Description"
        name="description"
        placeholder="Optional details, context, links..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          error={errors.status}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
        <Select
          label="Priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority)}
          error={errors.priority}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
        <Input
          label="Due date"
          name="dueDate"
          type="date"
          value={dueDate ?? ""}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
