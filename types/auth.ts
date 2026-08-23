export type UserRole = "admin" | "store-manager" | "customer";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: UserRole;
  };
}

export interface SessionState {
  user: AuthUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
