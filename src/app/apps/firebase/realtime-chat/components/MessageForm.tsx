// app/apps/firebase/components/MessageForm.tsx
"use client";

import { useState } from "react";

interface MessageFormProps {
  onSend: (text: string, image: File | null) => Promise<void>;
}

export default function MessageForm({ onSend }: MessageFormProps) {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !image) return;

    try {
      await onSend(text, image);
      setText("");
      setImage(null);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="w-full border border-gray-300 p-2 rounded-md"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full border border-gray-300 p-2 rounded-md"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Send
      </button>
    </form>
  );
}