import React, { createContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient.js';
import { getProfile } from '../services/profileService.js';
import { loginUser, registerUser } from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const p = await getProfile(session.user.id);
          if (isMounted) setProfile(p);
        } catch (err) {
          if (isMounted) setProfile(null);
        }
      }
      if (isMounted) setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const p = await getProfile(session.user.id);
            setProfile(p);
          } catch (err) {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    if (data.user) {
      try {
        const p = await getProfile(data.user.id);
        setProfile(p);
        return { ...data, profile: p };
      } catch (err) {
        setProfile(null);
        return { ...data, profile: null };
      }
    }
    return { ...data, profile: null };
  }, []);

  const signUp = useCallback(async ({ email, password, full_name, phone }) => {
    const data = await registerUser({ email, password, name: full_name, phone });
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async (userId) => {
    const id = userId || user?.id;
    if (!id) return null;
    try {
      const p = await getProfile(id);
      setProfile(p);
      return p;
    } catch (err) {
      setProfile(null);
      return null;
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
