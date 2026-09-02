"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import posthog from "posthog-js";
import { insforge } from "@/lib/insforge-client";
import type { UserProfile, UserRole, SessionState } from "@/types";

interface SignUpResult {
  success: boolean;
  requireVerification?: boolean;
  email?: string;
  error?: string;
}

interface AuthContextType extends SessionState {
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<SignUpResult>;
  verifyEmailOtp: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = "mirai_mart_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    user: null,
    profile: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Sync cookie for Next.js 16 proxy.ts perimeter guard and Server Action verification
  const syncSessionCookie = useCallback((isAuthenticated: boolean, role: UserRole = "customer", userId?: string, email?: string) => {
    if (typeof document !== "undefined") {
      if (isAuthenticated) {
        document.cookie = `mirai_mart_token=active_session; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `mirai_mart_role=${role}; path=/; max-age=86400; SameSite=Lax`;
        if (userId) {
          document.cookie = `mirai_mart_user_id=${userId}; path=/; max-age=86400; SameSite=Lax`;
        }
        if (email) {
          document.cookie = `mirai_mart_user_email=${encodeURIComponent(email)}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else {
        document.cookie = "mirai_mart_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "mirai_mart_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "mirai_mart_user_id=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "mirai_mart_user_email=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      // 1. Check InsForge backend session
      const { data, error } = await insforge.auth.getCurrentUser();
      if (data?.user && !error) {
        const userRole: UserRole = "customer";
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email ?? "",
          fullName:
            data.user.profile?.name ||
            data.user.email?.split("@")[0] ||
            "Valued Customer",
          role: userRole,
          avatarUrl: data.user.profile?.avatar_url,
        };

        const currentSession = {
          user: {
            id: data.user.id,
            email: data.user.email ?? "",
            role: userRole,
          },
          profile,
          role: userRole,
          isLoading: false,
          isAuthenticated: true,
        };

        setSession(currentSession);
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(currentSession));
        syncSessionCookie(true, userRole, data.user.id, data.user.email ?? "");
        return;
      }
    } catch {
      // Check cached localStorage before clearing
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed?.isAuthenticated && parsed?.user) {
              setSession(parsed);
              syncSessionCookie(true, parsed.role || "customer", parsed.user.id, parsed.user.email);
              return;
            }
          } catch {}
        }
      }
    }

    // If not authenticated, clear any stale state
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    setSession({
      user: null,
      profile: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    });
    syncSessionCookie(false);
  }, [syncSessionCookie]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signInWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Invalid email or password. Please check your credentials or register first.",
        };
      }

      if (data?.user) {
        const userRole: UserRole = "customer";
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email ?? email,
          fullName:
            data.user.profile?.name ||
            email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          role: userRole,
        };

        const sessionData = {
          user: {
            id: data.user.id,
            email: data.user.email ?? email,
            role: userRole,
          },
          profile,
          role: userRole,
          isLoading: false,
          isAuthenticated: true,
        };

        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
        setSession(sessionData);
        syncSessionCookie(true, userRole, data.user.id, data.user.email ?? email);

        // Identify user and capture sign-in event
        posthog.identify(profile.id, {
          name: profile.fullName,
          role: userRole,
        });
        posthog.capture("user_signed_in", {
          method: "email",
          role: userRole,
        });

        return { success: true };
      }

      return {
        success: false,
        error: "Unable to sign in. Please verify your email and password.",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      posthog.captureException(err instanceof Error ? err : new Error(String(err)));
      return { success: false, error: msg };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<SignUpResult> => {
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to create account. Please try again.",
        };
      }

      // Check if OTP verification is required
      if (data?.requireEmailVerification) {
        posthog.capture("user_registered", {
          method: "email",
          requires_verification: true,
        });
        return {
          success: true,
          requireVerification: true,
          email,
        };
      }

      // If user is immediately signed in (verification disabled on backend)
      if (data?.user || data?.accessToken) {
        const userRole: UserRole = "customer";
        const profile: UserProfile = {
          id: data.user?.id ?? `usr_${Date.now()}`,
          email,
          fullName: name,
          role: userRole,
        };

        const sessionData = {
          user: { id: profile.id, email, role: userRole },
          profile,
          role: userRole,
          isLoading: false,
          isAuthenticated: true,
        };

        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
        setSession(sessionData);
        syncSessionCookie(true, userRole, sessionData.user.id, email);

        posthog.identify(profile.id, {
          name,
          role: userRole,
        });
        posthog.capture("user_registered", {
          method: "email",
          requires_verification: false,
          role: userRole,
        });

        return { success: true, requireVerification: false };
      }

      // Default fallback if verification is required
      posthog.capture("user_registered", {
        method: "email",
        requires_verification: true,
      });
      return {
        success: true,
        requireVerification: true,
        email,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create account";
      posthog.captureException(err instanceof Error ? err : new Error(String(err)));
      return { success: false, error: msg };
    }
  };

  const verifyEmailOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp: otp.trim(),
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Invalid or expired verification code. Please try again.",
        };
      }

      if (data?.user || data?.accessToken) {
        const userRole: UserRole = "customer";
        const profile: UserProfile = {
          id: data.user?.id ?? `usr_${Date.now()}`,
          email: data.user?.email || email,
          fullName:
            data.user?.profile?.name ||
            email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          role: userRole,
        };

        const sessionData = {
          user: {
            id: profile.id,
            email: profile.email,
            role: userRole,
          },
          profile,
          role: userRole,
          isLoading: false,
          isAuthenticated: true,
        };

        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionData));
        setSession(sessionData);
        syncSessionCookie(true, userRole);

        posthog.identify(profile.id, {
          name: profile.fullName,
          role: userRole,
        });
        posthog.capture("email_verified", {
          role: userRole,
        });

        return { success: true };
      }

      return {
        success: false,
        error: "Verification could not be completed.",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      posthog.captureException(err instanceof Error ? err : new Error(String(err)));
      return { success: false, error: msg };
    }
  };

  const resendOtp = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await insforge.auth.resendVerificationEmail({
        email,
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to resend code.",
        };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code";
      return { success: false, error: msg };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      posthog.capture("google_sign_in_initiated");
      const redirectTo = `${window.location.origin}/callback`;
      const { data, error } = await insforge.auth.signInWithOAuth("google", {
        redirectTo,
        skipBrowserRedirect: false,
        additionalParams: { prompt: "select_account" },
      });

      if (error) {
        return { success: false, error: error.message || "Google OAuth is not configured on the backend." };
      }

      if (data?.url) {
        window.location.href = data.url;
      }
      return { success: true };
    } catch {
      return { success: false, error: "Google sign in was interrupted" };
    }
  };

  const signOut = async () => {
    posthog.capture("user_signed_out");
    posthog.reset();
    try {
      await insforge.auth.signOut();
    } catch {
      // Continue clearing local state even if remote call fails
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    setSession({
      user: null,
      profile: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    });
    syncSessionCookie(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signInWithPassword,
        signUpWithEmail,
        verifyEmailOtp,
        resendOtp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
