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
    <article className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-colors">
      {/* Header */}
      <header className="border-b pb-4 mb-6 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{drive.company}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          <span className="font-semibold">💰 Compensation:</span> {drive.compensation}
        </p>
        {drive.roles?.length > 0 && (
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <span className="font-semibold">🛠 Roles:</span> {drive.roles.join(", ")}
          </p>
        )}
        {drive.skills?.length > 0 && (
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <span className="font-semibold">⚡ Skills:</span> {drive.skills.join(", ")}
          </p>
        )}
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">🏢 Company Summary</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{drive.summary}</p>
      </section>

      {/* Job Descriptions */}
      {drive.pdfs?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">📄 Job Descriptions</h2>
          <div className="grid gap-4 sm:grid-cols-2 truncate overflow-hidden">
            {drive.pdfs.map((key: any, i: number) => (
              <PDFCard key={i} keyName={key} driveId={id} />
            ))}
          </div>
        </section>
      )}

      {/* Interview Rounds */}
      {(drive.rounds ?? []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📝 Interview Rounds
          </h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Round
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {drive.rounds.map((round, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100 whitespace-nowrap">
                      {new Date(round.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {round.round}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}


      {/* Experiences */}
      {(drive.experiences ?? []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">💡 Experiences</h2>
          <div className="mt-3 space-y-6">
            {drive.experiences.map((markdown, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">
                  Experience {i + 1}
                </h3>
                <MarkdownClient markdown={markdown} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {drive.resources?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">📚 Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2 truncate overflow-hidden">
            {drive.resources.map((key: any, i: number) => (
              <PDFCard key={i} keyName={key} driveId={id} />
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {drive.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {drive.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Admin */}
      {session && <AdminControls id={id} />}

      {/* Comments */}
      <section className="mt-8">
        <CommentsSection driveId={id} />
      </section>
    </article>
  );
}
