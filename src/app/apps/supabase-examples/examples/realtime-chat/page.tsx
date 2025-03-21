// app/apps/supabase-examples/examples/realtime-chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/app/lib/supabase";

const ChatMap = dynamic(() => import("./components/ChatMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface Message {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
}

export default function RealtimeChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
      if (error) {
        setError("Failed to load messages: " + error.message);
      } else {
        setMessages(data || []);
      }
    };
    fetchMessages();
  }, []);

  // Subscribe to Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to send messages.");
      return;
    }
    if (!newMessage.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("messages")
      .insert({ content: newMessage, user_id: user.id });

    if (error) {
      setError("Failed to send message: " + error.message);
    } else {
      setNewMessage("");
      setError("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Realtime Chat with Map</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="border border-gray-200 p-4 rounded-lg h-96 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-2 bg-gray-100 rounded-md">
                  <p className="text-gray-700">{msg.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleTimeString()} - User: {msg.user_id.slice(0, 8)}
                  </p>
                </div>
              ))
            )}
          </div>
          {!user && <p className="text-red-500 mt-4">Log in to send messages.</p>}
          <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={!user}
              className={`w-full py-2 px-4 rounded-md text-white ${
                user ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="flex-1 h-[500px]">
          <ChatMap />
        </div>
      </div>
    </div>
  );
}