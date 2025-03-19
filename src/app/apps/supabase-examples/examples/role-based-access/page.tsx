// app/apps/supabase-examples/examples/role-based-access/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/app/lib/supabase";
import { User } from "@supabase/supabase-js";

const TaskForm = dynamic(() => import("./components/TaskForm"), { ssr: false });
const TaskList = dynamic(() => import("./components/TaskList"), { ssr: false });

export default function RoleBasedAccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: roleData } = await supabase
          .from("roles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        setRole(roleData?.role || "user");

        const { data: tasksData } = await supabase.from("tasks").select("*");
        setTasks(tasksData || []);
      }
    };
    getSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data || []);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Role-Based Access</h1>
        <p className="text-gray-600">Please log in to access this feature.</p>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Role-Based Access (Role: {role})</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <TaskForm onTaskCreated={fetchTasks} isAdmin={isAdmin} />
        </div>
        <div className="flex-1">
          <TaskList tasks={tasks} isAdmin={isAdmin} onTaskUpdated={fetchTasks} />
        </div>
      </div>
    </div>
  );
}