import dbConnect from "@/lib/mongodb";
import Drive, { IDrive } from "@/models/drives";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminControls from "./AdminControls";
import MarkdownClient from "@/components/MarkdownClient";
import PDFCard from "@/components/PdfCard";
import CommentsSection from "@/components/CommentsSection";

interface DrivePageProps {
  params: { id: string };
}

export default async function DrivePage({ params }: DrivePageProps) {
  const { id } = await params;
  await dbConnect();
  const drive: IDrive | null = await Drive.findById(id).lean<IDrive>();
  const session = await getServerSession(authOptions);

  if (!drive) return notFound();

  return (
    <article className="p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">{drive.company}</h1>
      <p className="mt-2 text-gray-600"><span className="font-semibold">Compensation:</span> {drive.compensation}</p>
      {drive.roles ?? <label className="mt-2 text-gray-600"><span className="font-semibold">Roles:</span> 
        {drive.roles}
      </label>}
      {drive.skills ?? <label className="mt-2 text-gray-600"><span className="font-semibold">Skills:</span> {drive.skills}</label>}
      <div className="mt-4">
        <label className="mt-2 text-gray-600">Company Summary</label>
        <p className="mt-1">{drive.summary}</p>
      </div>

      <h2 className="mt-6 font-semibold">Full Experience</h2>

      {(drive.rounds ?? []).length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Interview Rounds</h3>
          <ul className="list-disc list-inside mt-2">
            {drive.rounds.map((round, i) => (
              <li key={i}>
                <span className="font-semibold">{new Date(round.date).toLocaleDateString()}:</span> {round.round}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(drive.experiences ?? []).map((markdown, i) => (
        <div key={i} className="mt-2 prose max-w-none bg-white">
          <h1 className="font-semibold text-lg">Experience {i+1}</h1>
          <MarkdownClient markdown={markdown} />
        </div>
      ))}

      {/* JDs */}
      {drive.pdfs?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Job Description</h2>
          {drive.pdfs.map((key: any, i: number) => (
            <PDFCard key={i} keyName={key} driveId={id} />
          ))}
        </div>
      )}

      {/* Resources */}
      {drive.resources?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Resources</h2>
          {drive.resources.map((key: any, i: number) => (
            <PDFCard key={i} keyName={key} driveId={id} />
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {drive.tags?.map((tag: string) => (
          <span key={tag} className="px-2 py-1 text-xs bg-gray-200 rounded">{tag}</span>
        ))}
      </div>

      {session && <AdminControls id={id} />}

      <CommentsSection driveId={id} />
    </article>
  );
}
