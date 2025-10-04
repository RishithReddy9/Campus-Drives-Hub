"use client";
import useSWR from "swr";
import Link from "next/link";
import SubmitResource from "@/components/SubmitResource";
import { useSession } from "next-auth/react";
import { Folder, FileText, BookOpen } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResourcesPage() {
  const { data: resources, error, isLoading } = useSWR("/api/resources", fetcher);
  const { data: session } = useSession();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>❌ Failed to load</p>;

  const getIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-12 h-12 text-yellow-500" />;
      case "file":
        return <FileText className="w-12 h-12 text-blue-500" />;
      case "blog":
        return <BookOpen className="w-12 h-12 text-green-500" />;
      default:
        return <FileText className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <AuthGuard>
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📂 Preparation Resources
        </h1>
        {session?.user.role === "admin" && <SubmitResource />}
      </div>

      {/* Google Drive style grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {resources.map((r: any) => (
          <Link
            key={r._id}
            href={`/resources/${r._id}`}
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl 
                       bg-white dark:bg-gray-900 shadow-sm hover:shadow-md 
                       hover:border-blue-400 dark:hover:border-blue-500 
                       transition-all flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className="mb-3">{getIcon(r.type)}</div>

            {/* Title */}
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate w-full">
              {r.title}
            </h2>

            {/* Type label */}
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
              {r.type}
            </span>
          </Link>
        ))}
      </div>
    </section>
    </AuthGuard>
  );
}
