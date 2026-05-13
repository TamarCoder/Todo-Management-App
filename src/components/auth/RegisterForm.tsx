"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuthStore } from "@/store";
import {
  validateConfirmPassword,
  validateDisplayName,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

export function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const next: typeof errors = {};
    const nameV = validateDisplayName(displayName);
    if (!nameV.valid) next.displayName = nameV.error;
    const ev = validateEmail(email);
    if (!ev.valid) next.email = ev.error;
    const pv = validatePassword(password);
    if (!pv.valid) next.password = pv.error;
    const cv = validateConfirmPassword(password, confirm);
    if (!cv.valid) next.confirm = cv.error;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await register(email, password, displayName);
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err?.message ?? "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {formError && <ErrorMessage message={formError} />}
      <Input
        label="Display name"
        name="displayName"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={errors.displayName}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint={!errors.password ? "At least 8 chars, with a letter and a number." : undefined}
      />
      <Input
        label="Confirm password"
        type="password"
        name="confirm"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      />
      <Button type="submit" loading={submitting} fullWidth size="lg">
        Create account
      </Button>
    </form>
  );
}
