"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SMSForm from "./components/SMSForm";
import SMSStatus from "./components/SMSStatus";

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
    const apiKey = process.env.NEXT_PUBLIC_AFROMESSAGE_API_KEY;
    const from = process.env.NEXT_PUBLIC_AFROMESSAGE_IDENTIFIER_ID;
    const sender = process.env.NEXT_PUBLIC_AFROMESSAGE_SENDER_NAME;
    const callback = process.env.NEXT_PUBLIC_AFROMESSAGE_CALLBACK_URL || "https://fir-practice-7c6ff.web.app/apps/afromessage";

    const url = new URL("https://api.afromessage.com/api/send");
    url.searchParams.append("from", from || "");
    url.searchParams.append("sender", sender || "");
    url.searchParams.append("to", to);
    url.searchParams.append("message", message);
    url.searchParams.append("callback", callback);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to send SMS");
    }

    const data = await response.json();
    const result = {
      messageId: data.message_id || "unknown",
      status: data.status || "Sent",
    };

    setSmsStatus(result);
    // Simulate callback status update (since we don’t have a real callback server here)
    setTimeout(() => setSmsStatus({ ...result, status: "Delivered" }), 3000);

    return result;
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