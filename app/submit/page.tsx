import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SubmitForm from "@/components/SubmitForm";

export default async function SubmitPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">❌ Unauthorized. Please login as admin.</p>
      </div>
    );
  }

  return <SubmitForm />;
}
