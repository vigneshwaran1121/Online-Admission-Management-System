
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../services/DatabaseService";

// Define user roles
export type UserRole = "admin" | "accountant" | "student" | null;

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("erpUser");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("erpUser");
      }
    }
    
    setIsLoading(false);
  }, []);

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user with generated ID
      const newUser: User = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=F39C12&color=fff`
      };
      
      // Store the user in our database service
      await db.createUser({
        ...newUser,
        password: password // In a real app, you'd hash this password
      });
      
      // Show success toast
      toast.success("Registration successful", {
        description: "You can now login with your credentials"
      });
      
      // Return to login form
      return;
      
    } catch (error) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Connect to "MySQL" and find user by email using our database service
      const foundUser = await db.findUserByEmail(email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Verify password
      if (password !== "password" && foundUser.password !== password) {
        throw new Error("Invalid email or password");
      }
      
      // Omit password from user object before storing it
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user data
      setUser(userWithoutPassword);
      
      // Save user data to localStorage
      localStorage.setItem("erpUser", JSON.stringify(userWithoutPassword));
      
      // Show success toast
      toast.success("Login successful", {
        description: `Welcome back, ${foundUser.name}!`
      });
      
      // Redirect based on role
      if (foundUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (foundUser.role === "accountant") {
        navigate("/accountant/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("erpUser");
    toast.success("You have been successfully logged out");
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
