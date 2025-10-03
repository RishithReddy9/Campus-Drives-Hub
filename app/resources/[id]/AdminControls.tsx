"use client";

import { useRouter } from "next/navigation";

export default function AdminControls({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("✅ Resource deleted!");
      router.push("/resources");
      router.refresh();
    } else {
      alert("❌ Error deleting Resource");
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
        href={`/admin/edit-resource/${id}`}
        className="px-3 py-1 bg-yellow-500 text-white rounded"
      >
        Edit
      </a>
    </div>
  );
}
