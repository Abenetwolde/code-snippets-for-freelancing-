    // app/apps/firebase/components/NotificationList.tsx
"use client";

import { useState, useEffect } from "react";
import { messaging, onMessage } from "@/app/lib/firebase";

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: payload.notification?.title || "No Title",
        body: payload.notification?.body || "No Body",
        timestamp: Date.now(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif.id} className="border border-gray-200 p-4 rounded-md">
              <p className="font-semibold">{notif.title}</p>
              <p>{notif.body}</p>
              <p className="text-sm text-gray-500">
                {new Date(notif.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}