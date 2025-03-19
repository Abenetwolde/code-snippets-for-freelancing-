// app/apps/supabase-examples/examples/role-based-access/components/TaskForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface TaskFormProps {
  onTaskCreated: () => void;
  isAdmin: boolean;
}

const TaskForm = ({ onTaskCreated, isAdmin }: TaskFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.from("tasks").insert([{ title, description, user_id: (await supabase.auth.getUser()).data.user?.id }]);
    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setDescription("");
      onTaskCreated();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{isAdmin ? "Admin Task Management" : "Create Task"}</h2>
      <form onSubmit={handleCreateTask} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;