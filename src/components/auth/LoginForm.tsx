"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuthStore } from "@/store";
import { validateEmail, validatePassword } from "@/lib/validation";

const DEMO_EMAIL = "demo@focusflow.app";
const DEMO_PASSWORD = "demo1234";

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const next: typeof errors = {};
    const ev = validateEmail(email);
    if (!ev.valid) next.email = ev.error;
    const pv = validatePassword(password);
    if (!pv.valid) next.password = pv.error;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setFormError(err?.message ?? "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrors({});
    setFormError(null);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {formError && <ErrorMessage message={formError} />}
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
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" loading={submitting} fullWidth size="lg">
        Sign in
      </Button>
      <button
        type="button"
        onClick={fillDemo}
        className="mt-1 rounded-lg border border-dashed border-outline-variant bg-surface-container-low px-3 py-3 text-center text-[12px] text-on-surface-variant transition hover:border-secondary hover:bg-white"
      >
        <span className="font-mono uppercase tracking-wider">Use demo credentials</span>
        <div className="mt-1 font-mono text-on-surface">
          {DEMO_EMAIL} · {DEMO_PASSWORD}
        </div>
      </button>
    </form>
  );
}
