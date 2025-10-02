'use client'
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const hideAuthButtons = pathname === "/login";
  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg dark:text-white">
          Campus Drives Hub
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/drives" className="text-sm dark:text-gray-300">Drives</Link>
          <Link href="/resources" className="text-sm dark:text-gray-300">Resources</Link>
          {session && session.user.role==='admin' && <Link href="/admin" className="text-sm dark:text-gray-300">Submit</Link>}
          {!hideAuthButtons && 
            (session ? (
            <>
              {session.user?.role === "admin" && (
                <Link href="/admin" className="text-blue-600 font-medium">
                  Admin
                </Link>
              )}
              <span className="text-sm text-emerald-400">
                Hi, {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/drives" })}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          )
        )}
        </div>
      </div>
    </nav>
  );
}
