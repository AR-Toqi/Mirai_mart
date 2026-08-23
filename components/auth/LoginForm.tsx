"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { loginSchema } from "@/lib/validations/auth.schema";
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const errorParam = searchParams.get("error");

  const { signInWithPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    errorParam === "unauthorized"
      ? "Please sign in to access your account."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || "Please check your inputs.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInWithPassword(email, password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setFormError(res.error || "Invalid email or password.");
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface border border-neutral-border rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
          Welcome Back!
        </h1>
        <p className="font-sans text-sm text-neutral-muted mt-1">
          Sign in to access your orders, wishlist & account
        </p>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="mb-5 p-3.5 rounded-lg bg-error-surface border border-error/20 flex items-start gap-2.5 text-error text-xs font-sans">
          <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* OAuth Button */}
      <OAuthButtons text="Sign in with Google" />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-3 text-neutral-muted font-sans font-medium">
            Or sign in with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3.5 py-2.5 bg-surface border border-neutral-border rounded-md text-sm text-neutral-dark placeholder:text-neutral-muted font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-neutral-dark font-sans">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-tertiary transition-colors font-sans"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 pr-10 bg-surface border border-neutral-border rounded-md text-sm text-neutral-dark placeholder:text-neutral-muted font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-dark transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-neutral-border text-primary focus:ring-primary/20 cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-neutral-muted font-sans cursor-pointer select-none"
          >
            Remember this device for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-primary hover:bg-tertiary text-white font-sans font-medium py-2.5 px-4 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Register Link */}
      <p className="mt-6 text-center text-xs text-neutral-muted font-sans">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:text-tertiary transition-colors"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}
