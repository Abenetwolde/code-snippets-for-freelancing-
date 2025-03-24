"use client";

import { useState } from "react";

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  buttonText: string;
}

export default function AuthForm({ onSubmit, buttonText }: AuthFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        {buttonText}
      </button>
    </form>
  );
}