
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: Converts a Supabase Auth User to our App User type
  const mapSessionUserToAppUser = (sessionUser: any, profile?: any): User => {
    const metadata = sessionUser.user_metadata || {};
    const fallbackName = sessionUser.email?.split('@')[0] || 'Intern';
    
    return {
      id: sessionUser.id,
      email: sessionUser.email || '',
      // Prefer profile name, then metadata name, then fallback
      name: profile?.full_name || metadata.full_name || metadata.name || fallbackName,
      // Prefer profile role, default to intern
      role: (profile?.role as UserRole) || 'intern',
      avatar_url: profile?.avatar_url || metadata.avatar_url || metadata.picture
    };
  };

  const syncProfile = async (sessionUser: any) => {
    try {
      const userId = sessionUser.id;
      const email = sessionUser.email;
      const metadata = sessionUser.user_metadata || {};
      const fullName = metadata.full_name || email?.split('@')[0];

      // 1. Try to fetch profile from DB
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile && !fetchError) {
        // Profile exists, update state
        setUser(mapSessionUserToAppUser(sessionUser, existingProfile));
      } else {
        // 2. Profile missing? Attempt to create it (Self-Repair)
        console.log("Profile missing. Attempting self-repair...", fetchError?.message);
        
        const newProfileData = {
          id: userId,
          email: email,
          full_name: fullName,
          role: 'intern',
          avatar_url: metadata.avatar_url || ''
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .upsert(newProfileData, { onConflict: 'id' })
          .select()
          .single();

        if (insertError) {
          console.error("Failed to create profile in DB:", insertError.message);
          // Fallback: Still log the user in using session data, just without custom role
          setUser(mapSessionUserToAppUser(sessionUser, null)); 
        } else {
          console.log("Profile created successfully.");
          setUser(mapSessionUserToAppUser(sessionUser, newProfile));
        }
      }
    } catch (err) {
      console.error("Unexpected error in syncProfile:", err);
      // Fail-safe: log in with session data
      setUser(mapSessionUserToAppUser(sessionUser, null));
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        // Set immediate state so UI doesn't hang
        setUser(mapSessionUserToAppUser(session.user, null));
        // Then sync with DB
        syncProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Change:", event);
      
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
           // Optimistically set user
           setUser(prev => prev || mapSessionUserToAppUser(session.user, null));
           syncProfile(session.user);
        } else if (event === 'USER_UPDATED') {
           syncProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signupWithEmail = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // If auto-confirm is on, we have a session. Try to create profile immediately.
    if (data.session?.user) {
      await syncProfile(data.session.user);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      loginWithEmail, 
      signupWithEmail, 
      resetPassword,
      logout, 
      isAuthenticated: !!user, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
