import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useLocation } from 'wouter';

interface User {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user data from localStorage for now
        // In a real app, you'd verify the session with a backend call
        const userData = localStorage.getItem('serviceplan_user');
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simplified login for demo - in production, you'd call your API
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // if (!response.ok) throw new Error('Login failed');
      // const data = await response.json();

      // For demo purposes, just check a specific email/password
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          companyName: 'Premium Home Services',
          role: 'admin'
        };

        // Save to localStorage
        localStorage.setItem('serviceplan_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('serviceplan_user');
    setUser(null);
    setLocation('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Higher-order component to protect routes
export const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setLocation('/login');
      }
    }, [isAuthenticated, isLoading, setLocation]);

    if (isLoading) {
      return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};