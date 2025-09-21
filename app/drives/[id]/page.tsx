import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminControls from "./AdminControls";

interface DrivePageProps {
  params: { id: string };
}

export default async function DrivePage({ params }: DrivePageProps) {
  await dbConnect();
  const drive = await Drive.findById(params.id).lean();
  const session = await getServerSession(authOptions);

  if (!drive) return notFound();

  return (
    <article className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">{drive.company} — {drive.role}</h1>
      <p className="text-gray-500 text-sm">{drive.date}</p>
      <p className="mt-4">{drive.summary}</p>

      <h2 className="mt-6 font-semibold">Full Experience</h2>
      <p className="mt-2 whitespace-pre-line">{drive.experience}</p>

      <p className="mt-6 text-sm text-gray-500">
        Shared by: {drive.author || "Anonymous"}
      </p>

      <div className="flex gap-2 mt-4">
        {drive.tags?.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-200 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {session && <AdminControls id={params.id} />}
    </article>
  );
}
