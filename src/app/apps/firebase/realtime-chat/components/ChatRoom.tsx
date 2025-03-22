// app/apps/firebase/components/ChatRoom.tsx
"use client";

import { useState, useEffect } from "react";
import { auth, database } from "@/app/lib/firebase";
import { ref, onValue, push } from "firebase/database";
import { supabase } from "@/app//lib/supabase";
import MessageForm from "./MessageForm";

interface Message {
  uid: string;
  email: string;
  text: string;
  timestamp: number;
  imageUrl?: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          ...value,
          id: key,
        }));
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });
  }, []);

  const handleSendMessage = async (text: string, image: File | null) => {
    if (!user) return;

    let imageUrl = "";
    if (image) {
      const filePath = `chat/${Date.now()}_${image.name}`;
      const { error } = await supabase.storage.from("chat").upload(filePath, image);
      if (error) throw error;
      const { data } = supabase.storage.from("chat").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const message: Message = {
      uid: user.uid,
      email: user.email,
      text,
      timestamp: Date.now(),
      imageUrl: imageUrl || undefined,
    };

    await push(ref(database, "messages"), message);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Chat Room</h2>
      <div className="h-96 overflow-y-auto border border-gray-200 p-4 rounded-lg">
        {messages.map((msg) => (
          <div key={msg.timestamp} className="mb-2">
            <p className="text-sm text-gray-600">
              {msg.email} <span className="text-xs">({new Date(msg.timestamp).toLocaleTimeString()})</span>
            </p>
            <p>{msg.text}</p>
            {msg.imageUrl && (
              <img src={msg.imageUrl} alt="Chat image" className="max-w-xs h-auto rounded-md mt-2" />
            )}
          </div>
        ))}
      </div>
      {user ? (
        <MessageForm onSend={handleSendMessage} />
      ) : (
        <p className="text-red-500">Please log in to send messages.</p>
      )}
    </div>
  );
}