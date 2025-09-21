import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditForm from "@/components/EditForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditPage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="text-center mt-20">❌ Unauthorized</p>;
  }

  await dbConnect();
  const drive = await Drive.findById(params.id).lean();

  if (!drive) return <p className="text-center mt-20">Drive not found</p>;

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Drive</h1>
      <EditForm drive={JSON.parse(JSON.stringify(drive))} />
    </section>
  );
}
