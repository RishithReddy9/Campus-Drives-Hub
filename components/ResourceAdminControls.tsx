"use client";

import { useRouter } from "next/navigation";

export default function ResourceAdminControls({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("✅ Resource deleted!");
      router.refresh(); // reloads /resources
    } else {
      alert("❌ Error deleting resource");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
      <a href={`/admin/edit-resource/${id}`} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</a>
    </div>
  );
}
