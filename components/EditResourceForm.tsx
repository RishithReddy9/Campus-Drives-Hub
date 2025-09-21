"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditResourceForm({ resource }: { resource: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: resource.title,
    category: resource.category,
    link: resource.link,
    description: resource.description,
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Updating...");

    const res = await fetch(`/api/resources/${resource._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("✅ Updated!");
      router.push("/resources");
    } else {
      setStatus("❌ Error updating");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="link" value={form.link} onChange={handleChange} className="w-full border p-2 rounded" required />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded h-32" required />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      {status && <p className="mt-4">{status}</p>}
    </form>
  );
}
