import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SubmitForm from "@/components/SubmitForm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">❌ Unauthorized. Please <Link href="/login" className="text-blue-600">login</Link>.</p>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Welcome, {session.user?.email}</p>

      <SubmitForm />
    </section>
  );
}
