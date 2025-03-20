// app/apps/supabase-examples/examples/storage/components/FileList.tsx
"use client";

import { useState } from "react";
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
  const [expandedFile, setExpandedFile] = useState<string | null>(null); // Track which file is expanded

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return "image";
    if (["mp4", "webm", "ogg"].includes(extension || "")) return "video";
    if (["pdf", "doc", "docx"].includes(extension || "")) return "document";
    return "unknown";
  };

  const handleDownload = (bucket: string, fileName: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    window.open(data.publicUrl, "_blank");
  };

  const toggleExpand = (fileName: string) => {
    setExpandedFile(expandedFile === fileName ? null : fileName);
  };

  const renderMedia = (file: StoredFile) => {
    const fileType = getFileType(file.name);
    const { data } = supabase.storage.from(file.bucket).getPublicUrl(file.name);
    const publicUrl = data.publicUrl;

    switch (fileType) {
      case "image":
        return (
          <img
            src={publicUrl}
            alt={file.name}
            className="max-w-full h-auto rounded-md mt-2"
          />
        );
      case "video":
        return (
          <video
            controls
            src={publicUrl}
            className="max-w-full h-auto rounded-md mt-2"
          />
        );
      case "document":
        return (
          <iframe
            src={publicUrl}
            title={file.name}
            className="w-full h-64 rounded-md mt-2"
          />
        );
      default:
        return (
          <p className="text-gray-600 mt-2">
            Preview not available for this file type.{" "}
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Download/View
            </a>
          </p>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Stored Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-600">No files uploaded yet.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.name}
            className="border border-gray-200 p-4 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {file.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Bucket:</span> {file.bucket}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleExpand(file.name)}
                  className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {expandedFile === file.name ? "Hide" : "Preview"}
                </button>
                <button
                  onClick={() => handleDownload(file.bucket, file.name)}
                  className="py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Download
                </button>
              </div>
            </div>
            {expandedFile === file.name && (
              <div className="mt-2">{renderMedia(file)}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FileList;