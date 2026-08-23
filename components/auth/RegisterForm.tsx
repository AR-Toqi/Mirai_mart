"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { registerSchema } from "@/lib/validations/auth.schema";
import {
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  MailCheckIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  CheckCircle2Icon,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { signUpWithEmail, verifyEmailOtp, resendOtp } = useAuth();

  // Registration form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // OTP Verification Step State
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-error",
    "bg-warning",
    "bg-primary-light",
    "bg-success",
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });

    if (!validation.success) {
      setFormError(
        validation.error.issues[0]?.message || "Please check your inputs."
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpWithEmail(email, password, fullName);
      if (res.success) {
        if (res.requireVerification) {
          setStep("otp");
        } else {
          router.push("/account");
        }
      } else {
        setFormError(res.error || "Failed to create account.");
      }
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await verifyEmailOtp(email, otpCode);
      if (res.success) {
        router.push("/account");
      } else {
        setOtpError(res.error || "Invalid verification code. Please try again.");
      }
    } catch {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setOtpError(null);
    try {
      const res = await resendOtp(email);
      if (res.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setOtpError(res.error || "Failed to resend code.");
      }
    } catch {
      setOtpError("Could not resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  // Render OTP Verification Screen
  if (step === "otp") {
    return (
      <div className="w-full bg-surface border border-neutral-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-surface text-primary mx-auto flex items-center justify-center mb-3">
            <MailCheckIcon className="w-7 h-7 stroke-[2]" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
            Verify Your Email
          </h1>
          <p className="font-sans text-xs sm:text-sm text-neutral-muted mt-1.5 leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-neutral-dark">{email}</span>.
            Enter it below to complete your registration.
          </p>
        </div>

        {otpError && (
          <div className="mb-5 p-3.5 rounded-lg bg-error-surface border border-error/20 flex items-start gap-2.5 text-error text-xs font-sans">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{otpError}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-5 p-3.5 rounded-lg bg-success-surface border border-success/20 flex items-start gap-2.5 text-success font-semibold text-xs font-sans">
            <CheckCircle2Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <span>A new 6-digit verification code has been sent to your email!</span>
          </div>
        )}

        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans text-center">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              autoFocus
              required
              className="w-full px-4 py-3 bg-surface border border-neutral-border rounded-md text-center font-mono text-xl sm:text-2xl tracking-[0.5em] text-neutral-dark placeholder:text-neutral-muted/40 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying || otpCode.length < 6}
            className="w-full mt-2 bg-primary hover:bg-tertiary text-white font-sans font-medium py-2.5 px-4 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isVerifying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Enter Store</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Action */}
        <div className="mt-6 pt-5 border-t border-neutral-border text-center space-y-3 font-sans text-xs">
          <p className="text-neutral-muted">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-primary font-semibold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </p>

          <button
            type="button"
            onClick={() => setStep("register")}
            className="text-neutral-muted hover:text-neutral-dark hover:underline block mx-auto cursor-pointer"
          >
            ← Use a different email address
          </button>
        </div>
      </div>
    );
  }

  // Render Initial Registration Form
  return (
    <div className="w-full bg-surface border border-neutral-border rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
          Create an Account
        </h1>
        <p className="font-sans text-sm text-neutral-muted mt-1">
          Join Mirai Mart for exclusive rewards & easy order tracking
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
      <OAuthButtons text="Sign up with Google" />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-3 text-neutral-muted font-sans font-medium">
            Or register with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Sarah Jenkins"
            required
            className="w-full px-3.5 py-2.5 bg-surface border border-neutral-border rounded-md text-sm text-neutral-dark placeholder:text-neutral-muted font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@example.com"
            required
            className="w-full px-3.5 py-2.5 bg-surface border border-neutral-border rounded-md text-sm text-neutral-dark placeholder:text-neutral-muted font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans">
            Password (min. 8 characters)
          </label>
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

          {/* Password strength meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1.5 w-full bg-neutral-border/40 rounded-full overflow-hidden">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`h-full flex-1 transition-all ${
                      strength >= stepNumber
                        ? strengthColors[strength - 1]
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-neutral-muted font-sans text-right">
                Strength:{" "}
                <span className="font-semibold text-neutral-dark">
                  {strengthLabels[strength - 1] || "Too weak"}
                </span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-dark mb-1.5 font-sans">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2.5 bg-surface border border-neutral-border rounded-md text-sm text-neutral-dark placeholder:text-neutral-muted font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-neutral-border text-primary focus:ring-primary/20 cursor-pointer"
          />
          <label
            htmlFor="acceptTerms"
            className="text-xs text-neutral-muted font-sans cursor-pointer select-none leading-relaxed"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 bg-primary hover:bg-tertiary text-white font-sans font-medium py-2.5 px-4 rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-6 text-center text-xs text-neutral-muted font-sans">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:text-tertiary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
