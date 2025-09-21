"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="ml-4 px-2 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
