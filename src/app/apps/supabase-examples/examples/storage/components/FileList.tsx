// app/apps/supabase-examples/examples/storage/components/FileList.tsx
"use client";

import { supabase } from "@/app/lib/supabase";

interface StoredFile {
  name: string;
  bucket: string;
  url: string;
}

interface FileListProps {
  files: StoredFile[];
}

const FileList = ({ files }: FileListProps) => {
  const handleDownload = (bucket: string, fileName: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    window.open(data.publicUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Stored Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        files.map((file) => (
          <div key={file.name} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {file.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Bucket:</span> {file.bucket}
              </p>
            </div>
            <button
              onClick={() => handleDownload(file.bucket, file.name)}
              className="py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Download/View
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FileList;