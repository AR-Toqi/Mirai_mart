"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.role === "admin" || user?.role === "store-manager") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/account");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="w-full bg-surface border border-neutral-border rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-12">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h2 className="font-heading font-bold text-xl text-neutral-dark">
        Completing Authentication...
      </h2>
      <p className="font-sans text-xs text-neutral-muted mt-1">
        Please wait while we set up your session.
      </p>
    </div>
  );
}
