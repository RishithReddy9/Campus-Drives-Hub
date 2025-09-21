import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditResourceForm from "@/components/EditResourceForm";

interface Props {
  params: { id: string };
}

export default async function EditResourcePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return <p className="mt-20 text-center">❌ Unauthorized</p>;

  await dbConnect();
  const resource = await Resource.findById(params.id).lean();

  if (!resource) return <p className="mt-20 text-center">Resource not found</p>;

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      <EditResourceForm resource={JSON.parse(JSON.stringify(resource))} />
    </section>
  );
}
