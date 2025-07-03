import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  isPublicMode: boolean;
  publicUser: any;
}

// Create a mock public user
const PUBLIC_USER = {
  id: 'public-user-id',
  email: 'public@example.com',
  full_name: 'مستخدم عام',
  role: 'viewer'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublicMode] = useState(true); // Always use public mode for the deployed app

  useEffect(() => {
    // In public mode, skip authentication
    setSession(null);
    setUser(null);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In public mode, just simulate successful login
      console.log('Public mode login simulation for:', email);
      return;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // In public mode, just simulate successful logout
      console.log('Public mode logout simulation');
      return;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // In public mode, just simulate successful signup
      console.log('Public mode signup simulation for:', email, fullName);
      return;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
    signUp,
    isPublicMode,
    publicUser: PUBLIC_USER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}