import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — Mirai Mart",
  description: "Join Mirai Mart for curated educational toys, tech gadgets, and gift bundles.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-surface border border-neutral-border rounded-2xl p-8 shadow-sm flex items-center justify-center min-h-[450px]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
