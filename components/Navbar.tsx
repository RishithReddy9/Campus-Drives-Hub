import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg dark:text-white">
          Campus Drives Hub
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/drives" className="text-sm dark:text-gray-300">Drives</Link>
          <Link href="/resources" className="text-sm dark:text-gray-300">Resources</Link>
          <Link href="/submit" className="text-sm dark:text-gray-300">Submit</Link>
        </div>
      </div>
    </nav>
  );
}
