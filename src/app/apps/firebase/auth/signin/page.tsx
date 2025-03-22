// app/apps/ribase/auth/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import AuthForm from "../components/AuthForm";
// import GoogleButton from "../components/GoogleButton";
import dynamic from "next/dynamic";

const AuthForm = dynamic(() => import("../components/AuthForm"), {
  ssr: false, // Disable SSR for Leaflet
  loading: () => <p>Loading map...</p>,
});
const GoogleButton = dynamic(() => import("../components/GoogleButton"), {
  ssr: false, // Disable SSR for Leaflet
  loading: () => <p>Loading map...</p>,
});

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/apps/firebase");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <AuthForm onSubmit={handleLogin} buttonText="Log In" />
      <div className="mt-4">
        <GoogleButton />
      </div>
    </div>
  );
}