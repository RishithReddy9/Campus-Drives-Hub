"use client";
import PDFViewer from "@/components/PDFViewer";
import { log } from "console";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PDFPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("key");

  if (!url) return <p>Loading...</p>;

  return (
    <PDFViewer url={url} />
  );
}
