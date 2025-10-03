"use client";
import { log } from "console";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PDFPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("key");

  if (!url) return <p>Loading...</p>;

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <h1 className="text-lg font-semibold mb-4">PDF Viewer</h1>
      <iframe
        src={url}
        width="100%"
        height="800px"
        style={{ border: "1px solid #e5e7eb", borderRadius: 6 }}
      />
    </div>
  );
}
