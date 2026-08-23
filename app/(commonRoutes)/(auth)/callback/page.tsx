import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthCallbackClient } from "@/components/auth/AuthCallbackClient";

export const metadata: Metadata = {
  title: "Authenticating — Mirai Mart",
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-surface border border-neutral-border rounded-2xl p-8 shadow-sm flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
