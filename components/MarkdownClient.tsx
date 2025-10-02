// components/DriveMarkdownClient.tsx
"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

type Props = { markdown: string };

export default function DriveMarkdownClient({ markdown }: Props) {
  return (
    <div>
      <MarkdownPreview wrapperElement={{
        "data-color-mode": "light", // 👈 force light mode
        style: { backgroundColor: "white", padding: "1rem", borderRadius: "0.5rem" },
      }} source={markdown || "_(no content)_"} />
    </div>
  );
}
