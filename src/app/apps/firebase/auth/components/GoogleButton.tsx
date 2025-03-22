// app/apps/ribase/auth/components/GoogleButton.tsx
"use client";

// import auth, {googleProvider}  from "@/lib/firebase";
// import { auth } from "@/lib/firebase";
import { googleProvider,auth } from "@/app/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/apps/firbase");
    } catch (err: any) {
      console.error("Google sign-in error:", err.message);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.67 0-8.58-3.892-8.58-8.68s3.91-8.68 8.58-8.68c2.133 0 3.96.893 5.24 2.333l2.333-2.333C18.067 1.333 15.333 0 12 0 5.373 0 0 5.373 0 12s5.373 12 12 12c3.573 0 6.773-1.573 8.987-4.053 2.213-2.48 3.013-5.92 2.453-9.28h-10.96z"
        />
      </svg>
      Sign in with Google
    </button>
  );
}