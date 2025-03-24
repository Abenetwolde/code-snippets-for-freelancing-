"use client";

import { useState } from "react";

interface SMSFormProps {
  onSend: (to: string, message: string) => Promise<{ messageId?: string; status?: string; error?: string }>;
}

export default function SMSForm({ onSend }: SMSFormProps) {
  const [to, setTo] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !message) {
      setError("Recipient and message are required.");
      return;
    }

    setSending(true);
    try {
      const result = await onSend(to, message);
      if (result.error) {
        setError(result.error);
      } else {
        setTo("");
        setMessage("");
        setError("");
      }
    } catch (err: any) {
      setError("Failed to send SMS: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold">Send SMS via AfroMessage</h2>
      <div>
        <label htmlFor="to" className="block text-lg font-medium mb-2">Recipient Phone Number</label>
        <input
          type="tel"
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="+251912345678"
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-lg font-medium mb-2">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message here..."
          className="w-full border border-gray-300 p-2 rounded-md"
          rows={4}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {sending ? "Sending..." : "Send SMS"}
      </button>
    </form>
  );
}