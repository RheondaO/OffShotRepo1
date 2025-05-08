import { createContext, ReactNode, useContext, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

// In a fully implemented app, we would use proper authentication
// For now, we'll fetch our demo user directly
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Fetch the demo user from the database (ID: 3)
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/users/3');
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // For now, directly fetch the demo user instead of implementing real login
      const response = await apiRequest('GET', '/api/users/3');
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return await response.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
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

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      // In a real app, we would create a new user
      // For now, just return the demo user
      const response = await apiRequest('GET', '/api/users/3');
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      return await response.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
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

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // In a real app, we would call a logout endpoint
      return;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
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
        error,
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
  const [impersonatedUser, setImpersonatedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Add isAdmin state

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Get effective user (impersonated or real)
  const effectiveUser = impersonatedUser || context.user;

  // Impersonation functions
  const impersonateUser = async (userId: number) => {
    if (!isAdmin) { // Check if admin before impersonating
      console.error('Only admins can impersonate users');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${userId}`);
      }
      const userData = await response.json();
      setImpersonatedUser(userData);
    } catch (error) {
      console.error('Failed to impersonate user:', error);
    }
  };

  const stopImpersonating = () => {
    setImpersonatedUser(null);
  };

  //  We need a way to determine isAdmin.  This is placeholder code.
  // In a real application, you would fetch this information from the server
  // based on the authenticated user's role.
  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user/admincheck'); // Replace with your admin check endpoint
      if (!response.ok) {
        throw new Error('Failed to check admin status');
      }
      setIsAdmin(await response.json());
    } catch (error) {
      console.error('Failed to check admin status:', error);
    }
  }
  checkAdminStatus();


  return {
    user: effectiveUser,
    isAdmin,
    isImpersonating: !!impersonatedUser,
    impersonateUser,
    stopImpersonating,
  };
}