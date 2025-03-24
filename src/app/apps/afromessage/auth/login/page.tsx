"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import GoogleButton from "../components/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const handleLogin= async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/apps/afromessage");
    } catch (err: any) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <AuthForm onSubmit={handleLogin} buttonText="Log In" />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-4">
        <GoogleButton redirectPath="/apps/afromessage" />
      </div>
    </div>
  );
}