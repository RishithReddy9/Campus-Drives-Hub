"use client";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function PDFCard({ keyName, driveId }: { keyName: string; driveId: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const res = await fetch("/api/signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: keyName }),
        });
        const data = await res.json();
        if (res.ok) setUrl(data.url);
      } catch (err) {
        console.error("Failed to fetch signed URL", err);
      }
    };
    fetchSignedUrl();
  }, [keyName]);

  if (!url)
    return (
      <div className="p-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full">
        Loading...
      </div>
    );

  return (
    <Link
      href={`/drives/${driveId}/pdf?key=${encodeURIComponent(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 
                 transition-colors shadow-sm w-full max-w-full"
    >
      <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />

      {/* Filename with truncation */}
      <span className="text-sm text-gray-800 dark:text-gray-200 truncate block overflow-hidden whitespace-nowrap text-ellipsis max-w-[85%]">
        {keyName.split("/").pop()}
      </span>
    </Link>
  );
}
