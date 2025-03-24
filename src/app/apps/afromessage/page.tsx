"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SMSForm from "./components/SMSForm";
import SMSStatus from "./components/SMSStatus";
import axios from "axios";

export default function AfroMessagePage() {
  const [user, setUser] = useState<any>(null);
  const [smsStatus, setSmsStatus] = useState<{ messageId?: string; status?: string; error?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSendSMS = async (to: string, message: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_AFROMESSAGE_API_KEY;
      const from = process.env.NEXT_PUBLIC_AFROMESSAGE_IDENTIFIER_ID;
      const sender = process.env.NEXT_PUBLIC_AFROMESSAGE_SENDER_NAME;
      const callback =
        process.env.NEXT_PUBLIC_AFROMESSAGE_CALLBACK_URL ||
        "https://fir-practice-7c6ff.web.app/apps/afromessage";
  
      const url = "https://api.afromessage.com/api/send";
  
      const params = new URLSearchParams({
        from: from || "",
        sender: sender || "",
        to,
        message,
        callback,
      });
  
      const response = await axios.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
  
      if (response.data.acknowledge !== "success") {
        throw new Error(response.data.error || "Failed to send SMS");
      }
  
      const result = {
        messageId: response.data.message_id || "unknown",
        status: response.data.status || "Sent",
      };
  
      setSmsStatus(result);
  
      // Simulate callback status update (since we don’t have a real callback server here)
      setTimeout(() => setSmsStatus({ ...result, status: "Delivered" }), 3000);
  
      return result;
    } catch (error) {
      console.error("Error sending SMS:", error);
      setSmsStatus({ error: "Failed to send SMS" });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/apps/afromessage");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AfroMessage SMS</h1>
      {user ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-lg">Welcome, {user.email}!</p>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
          <SMSForm onSend={handleSendSMS} />
          <SMSStatus status={smsStatus} />
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">Please log in to send SMS.</p>
          <div className="flex gap-4">
            <a href="/apps/afromessage/auth/login" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Log In
            </a>
            <a href="/apps/afromessage/auth/signup" className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  );
}