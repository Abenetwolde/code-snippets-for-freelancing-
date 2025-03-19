// app/apps/supabase-examples/examples/authentication/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/app/lib/supabase";
import { User } from "@supabase/supabase-js";

const AuthForm = dynamic(() => import("./components/AuthForm"), { ssr: false });
const UserProfile = dynamic(() => import("./components/UserProfile"), { ssr: false });

export default function AuthenticationPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check initial session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase Authentication</h1>
      <div className="max-w-md mx-auto">
        {user ? (
          <UserProfile user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    </div>
  );
}