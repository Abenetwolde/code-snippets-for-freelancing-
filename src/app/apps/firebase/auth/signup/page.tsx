// app/apps/ribase/auth/signup/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { auth, database, db } from "@/app/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import GoogleButton from "../components/GoogleButton";
import { doc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "user", // Default role; manually change to "admin" for testing
      createdAt: new Date().toISOString(),
    });
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      role: "user",
      createdAt: new Date().toISOString(),
    });
    router.push("/apps/firebase");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <AuthForm onSubmit={handleSignup} buttonText="Sign Up" />
      <div className="mt-4">
        <GoogleButton />
      </div>
    </div>
  );
}