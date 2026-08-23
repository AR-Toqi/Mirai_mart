import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Mirai Mart",
  description: "Sign in to your Mirai Mart account to track orders and save your wishlist.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-surface border border-neutral-border rounded-2xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
