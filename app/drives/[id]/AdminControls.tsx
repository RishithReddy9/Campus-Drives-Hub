"use client";

import { useRouter } from "next/navigation";

export default function AdminControls({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this drive?")) return;

    const res = await fetch(`/api/drives/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("✅ Drive deleted!");
      router.push("/drives");
      router.refresh();
    } else {
      alert("❌ Error deleting drive");
    }
  };

  return (
    <div className="flex gap-2 mt-6">
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        Delete
      </button>
      <a
        href={`/admin/edit/${id}`}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        Edit
      </a>
    </div>
  );
}
