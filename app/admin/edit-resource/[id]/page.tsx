import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EditResourceForm from "@/components/EditResourceForm";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function EditResourcePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  // 🔐 Check if user is logged in
  if (!session) {
    redirect("/auth/login"); // or show Unauthorized UI
  }

  // 🔐 Check role (optional)
  if (session.user.role !== "admin") {
    return <p className="mt-20 text-center text-red-600">❌ Access denied</p>;
  }

  await dbConnect();

  let resource;
  try {
    resource = await Resource.findById(params.id).lean();
  } catch (err) {
    console.error("Invalid ID or DB error", err);
    return notFound();
  }

  if (!resource) {
    return notFound();
  }

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      {/* Pass resource safely into client form */}
      <EditResourceForm resource={JSON.parse(JSON.stringify(resource))} />
    </section>
  );
}
