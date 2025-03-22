// app/apps/firebase/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

export default function FirebasePage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setIsAdmin(userDoc.exists() && userDoc.data()?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/apps/firebase");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Firebase Inventory System</h1>
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
          {isAdmin && <ProductForm />}
          <ProductList user={user} isAdmin={isAdmin} />
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg">Please log in to manage inventory.</p>
          <div className="flex gap-4">
            <a href="/apps/firebase/auth/signin" className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Log In
            </a>
            <a href="/apps/firebase/auth/signup" className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
              Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  );
}