"use client";

import { useState } from "react";

interface SMSStatusProps {
  status: { messageId?: string; status?: string; error?: string } | null;
}

export default function SMSStatus({ status }: SMSStatusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">SMS Status</h2>
      {status ? (
        <div className="border border-gray-200 p-4 rounded-lg">
          {status.messageId && <p>Message ID: <span className="font-bold">{status.messageId}</span></p>}
          {status.status && <p>Status: <span className="font-bold">{status.status}</span></p>}
          {status.error && <p className="text-red-500">Error: {status.error}</p>}
        </div>
      ) : (
        <p className="text-gray-600">No SMS sent yet.</p>
      )}
    </div>
  );
}