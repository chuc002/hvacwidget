import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  companyName: string;
}

interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    // Check if user is authenticated on mount
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setSession({
            isAuthenticated: true,
            isLoading: false,
            user: data.user,
            error: null
          });
        } else {
          setSession({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null
          });
        }
      } catch (error: any) {
        setSession({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error.message
        });
      }
    }
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setSession(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      
      setSession({
        isAuthenticated: true,
        isLoading: false,
        user: data.user,
        error: null
      });
      
      return { success: true };
    } catch (error: any) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      
      return { success: false, error: error.message };
    }
  };

  const register = async (companyName: string, email: string, password: string, phone?: string, website?: string, industry?: string) => {
    setSession(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, password, phone, website, industry }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const data = await response.json();
      
      setSession({
        isAuthenticated: true,
        isLoading: false,
        user: data.user,
        error: null
      });
      
      return { success: true };
    } catch (error: any) {
      setSession(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      setSession({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null
      });
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...session,
    login,
    register,
    logout
  };
}