// app/apps/supabase-examples/examples/role-based-access/components/TaskList.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface Task {
  id: number;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  isAdmin: boolean;
  onTaskUpdated: () => void;
}

const TaskList = ({ tasks, isAdmin, onTaskUpdated }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const handleUpdate = async (taskId: number) => {
    const { error } = await supabase.from("tasks").update({ title, description }).eq("id", taskId);
    if (error) {
      console.error("Update error:", error.message);
    } else {
      setEditingTask(null);
      onTaskUpdated();
    }
  };

  const handleDelete = async (taskId: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      console.error("Delete error:", error.message);
    } else {
      onTaskUpdated();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="border border-gray-200 p-4 rounded-lg">
          {editingTask?.id === task.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={() => handleUpdate(task.id)}
                className="py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="py-1 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-700">
                <span className="font-semibold">Title:</span> {task.title}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Description:</span> {task.description || "None"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Created By:</span> {task.user_id}
              </p>
              {isAdmin && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;