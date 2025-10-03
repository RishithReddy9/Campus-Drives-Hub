"use client";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react"; // lucide-react icons
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

  if (!url) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <Link
      href={`/drives/${driveId}/pdf?key=${encodeURIComponent(url)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
    >
      <FileText className="w-6 h-6 text-red-500" />
      <span className="text-sm truncate">{keyName.split("/").pop()}</span>
    </Link>
  );
}
