import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = "https://itdrjobpqkaoahxcsetl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHJqb2JwcWthb2FoeGNzZXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0ODAzMDYsImV4cCI6MjEwMjA1NjMwNn0.Te_gl-kO6cOFT0fj5KJWM5z3xUYutN5o_eH4wtZZ_jI";

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

type LoginData = Pick<InsertUser, "username" | "password">;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // 1. Fetch current logged in user (or fallback to Maya)
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const savedUsername = localStorage.getItem("offshot_username") || "maya.organizer";
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/users?username=eq.${savedUsername}&select=*`,
          { headers }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data && data.length > 0 ? (data[0] as User) : null;
      } catch (err) {
        console.error("Error fetching Supabase user:", err);
        return null;
      }
    },
  });

  // 2. Login Mutation (fetches or creates user in Supabase)
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/users?username=eq.${credentials.username}&select=*`,
        { headers }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        localStorage.setItem("offshot_username", data[0].username);
        return data[0] as User;
      }

      // If user doesn't exist yet, insert them
      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({
          username: credentials.username,
          name: credentials.username,
          role: "resident",
          xp: 50,
          level: 1,
          badge: "New Explorer",
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to authenticate user");
      }

      const created = await createRes.json();
      localStorage.setItem("offshot_username", created[0].username);
      return created[0] as User;
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name || user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 3. Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        throw new Error("Failed to register user");
      }

      const created = await res.json();
      localStorage.setItem("offshot_username", created[0].username);
      return created[0] as User;
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Account created for ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 4. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("offshot_username");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error: error as Error | null,
        loginMutation,
        logoutMutation,
        registerMutation,
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