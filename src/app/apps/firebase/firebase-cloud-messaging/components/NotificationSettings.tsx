// app/apps/firebase/components/NotificationSettings.tsx (updated)
"use client";

import { useState, useEffect } from "react";
import { auth, messaging, getToken, database } from "@/app/lib/firebase";
import { ref, set } from "firebase/database";

export default function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setPermission(Notification.permission);
    if (auth.currentUser && messaging) {
      getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            setToken(currentToken);
            saveToken(currentToken);
          }
        })
        .catch((err) => setError("Failed to get token: " + err.message));
    }
  }, []);

  const saveToken = async (fcmToken: string) => {
    if (auth.currentUser) {
      await set(ref(database, `users/${auth.currentUser.uid}/fcmToken`), fcmToken);
    }
  };

  const requestPermission = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted" && messaging) {
        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        setToken(currentToken);
        saveToken(currentToken);
      }
    } catch (err: any) {
      setError("Permission request failed: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      <p>Current Permission: <span className="font-bold">{permission}</span></p>
      {permission === "default" && (
        <button
          onClick={requestPermission}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Enable Notifications
        </button>
      )}
      {token && <p className="text-sm text-gray-600">Token: {token.slice(0, 20)}...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}