// app/apps/supabase-examples/examples/authentication/components/UserProfile.tsx
"use client";

import { supabase } from "@/app/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      onLogout();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Welcome, {user.email}</h2>
      <div className="border border-gray-200 p-4 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Provider:</span>{" "}
          {user.app_metadata.provider || "Email"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;