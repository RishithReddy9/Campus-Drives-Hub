// app/drives/[id]/page.tsx  (server component)
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminControls from "./AdminControls";
import MarkdownClient from "@/components/MarkdownClient";

interface DrivePageProps {
  params: { id: string };
}

export default async function DrivePage({ params }: DrivePageProps) {
  const { id } = await params;
  await dbConnect();
  const resource: IResource | null = await Resource.findById(id).lean<IResource>();
  const session = await getServerSession(authOptions);

  if (!resource) return notFound();

  const markdown = resource.description ?? "";

  return (
    <article className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">{resource.title}</h1>
      <p className="mt-4">{resource.category}</p>

      {/* pass markdown to client component */}
      <div className="mt-2 prose max-w-none bg-white">
        <MarkdownClient markdown={markdown} />
      </div>

      <a href={resource.link} target="_blank" className="text-blue-600 underline mt-2 inline-block">
            Open Resource
        </a>

      {session && session.user.role === "admin" && <AdminControls id={id} />}
    </article>
  );
}
