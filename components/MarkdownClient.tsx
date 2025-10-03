"use client";

import { useTheme } from "next-themes";
import MarkdownPreview from "@uiw/react-markdown-preview";

type Props = { markdown: string };

export default function DriveMarkdownClient({ markdown }: Props) {
  const { theme } = useTheme();

  return (
    <div
      className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 prose prose-sm max-w-none dark:prose-invert"
    >
      <MarkdownPreview
        source={markdown || "_(no content)_"}
        wrapperElement={{
          "data-color-mode": theme === "dark" ? "dark" : "light",
        }}
      />
    </div>
  );
}
