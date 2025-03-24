"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import GoogleButton from "../components/GoogleButton";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    router.push("/apps/afromessage");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <AuthForm onSubmit={handleSignup} buttonText="Sign Up" />
      <div className="mt-4">
        <GoogleButton redirectPath="/apps/afromessage" />
      </div>
    </div>
  );
}