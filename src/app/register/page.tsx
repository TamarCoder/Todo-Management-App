"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Hexagon className="h-6 w-6" />
          </div>
          <h1 className="font-display text-[28px] font-bold text-primary">
            Create your FocusFlow account
          </h1>
          <p className="text-sm text-on-surface-variant">
            It takes less than a minute. No credit card required.
          </p>
        </div>
        <Card padding="lg" shadow>
          <RegisterForm />
        </Card>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
