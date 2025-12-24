"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [supabase] = useState(() => createClient());

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchProfileWithTimeout = async (userId) => {
    try {
      const profilePromise = supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: profile, error } = await Promise.race([
        profilePromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 5000))
      ]);

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  };

  const fetchUser = useCallback(async () => {
    console.log('🔍 Fetching user session...');
    try {
      const sessionPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
      );

      const { data: { user: authUser }, error: sessionError } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]);

      if (sessionError || !authUser) {
        if (isMounted.current) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const profile = await fetchProfileWithTimeout(authUser.id);

      if (isMounted.current) {
        setUser(profile ? { ...authUser, ...profile } : { ...authUser, role: 'student' });
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      if (isMounted.current) setUser(null);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted.current) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);

        try {
          if (session?.user) {
            const profile = await fetchProfileWithTimeout(session.user.id);
            if (isMounted.current) {
              setUser(profile ? { ...session.user, ...profile } : { ...session.user, role: 'student' });
            }
          }
        } catch (error) {
          console.error("Error during auth state change:", error);
        } finally {
          if (isMounted.current) {
            setLoading(false);
            router.refresh();
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchUser, router]);

  // Re-fetch user when pathname changes (e.g., after login redirect)
  useEffect(() => {
    console.log('📍 Pathname changed to:', pathname);
    // Small delay to ensure cookies are set after server redirect
    const timer = setTimeout(() => {
      fetchUser();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, fetchUser]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setUser(null); // Clear user immediately
      await supabase.auth.signOut({ scope: 'local' }); // Clear local session only
      // Force clear any remaining session
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear local state and redirect
      setUser(null);
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
