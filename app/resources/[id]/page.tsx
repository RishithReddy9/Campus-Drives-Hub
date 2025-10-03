'use client';
import { IResource } from "@/models/Resource";
import AdminControls from "./AdminControls";
import MarkdownClient from "@/components/MarkdownClient";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import SubmitResource from "@/components/SubmitResource";
import Link from "next/link";
import ResourceBreadcrumb from "@/components/ResourceBreadcrumb";
import { Folder, FileText, BookOpen } from "lucide-react";
import PDFViewer from "@/components/PDFViewer";

export default function DrivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [children, setChildren] = useState<IResource[]>([]);
  const [resource, setResource] = useState<IResource>();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getResource(id)
      .then((res) => res && setResource(res))
      .catch((err) => console.error(err))
  }, [id]);

  useEffect(() => {
    setLoading(true);
    if (resource?.type === "folder") {
      getChildren(id)
        .then((children) => setChildren(children))
        .catch((err) => console.error(err));
    }
    setLoading(false);
  }, [resource, id]);

  useEffect(() => {
    if (!resource?.pdf) return;
      const fetchSignedUrl = async () => {
        try {
          const res = await fetch("/api/signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: resource?.pdf }),
          });
          const data = await res.json();
          if (res.ok) setUrl(data.url);
        } catch (err) {
          console.error("Failed to fetch signed URL", err);
        }
      };
      fetchSignedUrl();
  }, [resource?.pdf]);

  const getResource = async (id: string) => {
    const res = await fetch("/api/resources/" + id);
    return res.ok ? res.json() : null;
  };

  const getChildren = async (parentId: string) => {
    const res = await fetch("/api/resources/" + parentId + "/children");
    return res.ok ? res.json() : [];
  };

  const markdown = resource?.content ?? "";

  const getIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-12 h-12 text-yellow-500" />;
      case "file":
        return <FileText className="w-12 h-12 text-blue-500" />;
      case "blog":
        return <BookOpen className="w-12 h-12 text-green-500" />;
      default:
        return <FileText className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <ResourceBreadcrumb id={id} />
        {session?.user.role === "admin" && resource?.type==="folder" && <SubmitResource currentFolderId={id} />}
      </div>

      {loading && <p>Loading...</p>}

      { resource?.type === "file" && resource.pdf && (
        <div>
        <PDFViewer url={String(url)}/>
        {session?.user.role === "admin" && <AdminControls id={id} />}
        </div>
      )
      }

      {/* Folder view */}
      {resource?.type === "folder" && !loading && (
        children.length>0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {children.map((child) => (
                <Link
                  key={String(child._id)}
                  href={`/resources/${child._id}`}
                  className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl 
                             bg-white dark:bg-gray-900 shadow-sm hover:shadow-md 
                             hover:border-blue-400 dark:hover:border-blue-500 
                             transition-all flex flex-col items-center text-center"
                >
                  <div className="mb-3">{getIcon(child.type)}</div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate w-full">
                    {child.title}
                  </h2>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {child.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                No resources found in this folder.
              </p>
              {session?.user.role === "admin" && <AdminControls id={id} />}
            </div>
          )
        )}

      {/* Blog view */}
      {resource?.type === "blog" && (
        <article className="p-6 bg-white dark:bg-gray-900 shadow rounded">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {resource.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownClient markdown={markdown} />
          </div>
          {session?.user.role === "admin" && <AdminControls id={id} />}
        </article>
      )}
    </div>
  );
}
