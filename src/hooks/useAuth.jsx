import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import * as demo from '../lib/demoStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!isSupabaseConfigured) {
        const session = demo.getSession();
        if (mounted) {
          setUser(session);
          setLoading(false);
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      }
      if (mounted) setLoading(false);

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session) {
          setUser(null);
          return;
        }
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      });
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    if (!isSupabaseConfigured) {
      const u = demo.login(email, password);
      setUser(u);
      return u;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    setUser(profile);
    return profile;
  }, []);

  const signup = useCallback(async ({ email, password, fullName, role }) => {
    if (!isSupabaseConfigured) {
      const u = demo.signup({ email, password, fullName, role });
      setUser(u);
      return u;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const { data: profile, error: insertErr } = await supabase
      .from('users')
      .insert({ id: data.user.id, email, full_name: fullName, role })
      .select()
      .single();
    if (insertErr) throw insertErr;
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured) {
      demo.logout();
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
