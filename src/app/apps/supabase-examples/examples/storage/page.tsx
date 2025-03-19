// app/apps/supabase-examples/examples/storage/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/app/lib/supabase";
import { User } from "@supabase/supabase-js";

const UploadForm = dynamic(() => import("./components/UploadForm"), { ssr: false });
const FileList = dynamic(() => import("./components/FileList"), { ssr: false });

interface StoredFile {
  name: string;
  bucket: string;
  url: string;
}

export default function StoragePage() {
  const [user, setUser] = useState<User | null>(null);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const buckets = ["images", "documents", "videos"];

  useEffect(() => {
    const getSessionAndFiles = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData.session?.user ?? null);

      if (sessionData.session) {
        const allFiles: StoredFile[] = [];
        for (const bucket of buckets) {
          const { data, error } = await supabase.storage.from(bucket).list();
          if (!error && data) {
            const bucketFiles = data.map((file) => ({
              name: file.name,
              bucket,
              url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
            }));
            allFiles.push(...bucketFiles);
          }
        }
        setFiles(allFiles);
      }
    };
    getSessionAndFiles();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUploadSuccess = async () => {
    const allFiles: StoredFile[] = [];
    for (const bucket of buckets) {
      const { data } = await supabase.storage.from(bucket).list();
      if (data) {
        const bucketFiles = data.map((file) => ({
          name: file.name,
          bucket,
          url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
        }));
        allFiles.push(...bucketFiles);
      }
    }
    setFiles(allFiles);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Supabase Storage</h1>
        <p className="text-gray-600">Please log in to access this feature.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase Storage</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
        <div className="flex-1">
          <FileList files={files} />
        </div>
      </div>
    </div>
  );
}