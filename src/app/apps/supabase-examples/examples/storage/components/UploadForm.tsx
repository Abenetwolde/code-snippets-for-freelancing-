// app/apps/supabase-examples/examples/storage/components/UploadForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const buckets = ["images", "documents", "videos"] as const;
type Bucket = (typeof buckets)[number];

const UploadForm = ({ onUploadSuccess }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [bucket, setBucket] = useState<Bucket>("images");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const filePath = `${Date.now()}_${file.name}`; // Unique file name
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);

    if (error) {
      setError(error.message);
    } else {
      setFile(null);
      setError("");
      onUploadSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Upload Digital Content</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label htmlFor="bucket" className="block text-lg font-medium mb-2">
            Select Bucket
          </label>
          <select
            id="bucket"
            value={bucket}
            onChange={(e) => setBucket(e.target.value as Bucket)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {buckets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file" className="block text-lg font-medium mb-2">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!file}
          className={`w-full py-2 px-4 rounded-md text-white ${
            file ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;