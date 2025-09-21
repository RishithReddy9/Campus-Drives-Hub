"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ drive }: { drive: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    company: drive.company,
    role: drive.role,
    date: drive.date,
    summary: drive.summary,
    experience: drive.experience,
    author: drive.author,
    tags: drive.tags.join(", "),
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Updating...");

    const res = await fetch(`/api/drives/${drive._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: form.tags.split(",").map((t) => t.trim()) }),
    });

    if (res.ok) {
      setStatus("✅ Updated successfully!");
      router.push(`/drives/${drive._id}`);
    } else {
      setStatus("❌ Error updating");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="summary" value={form.summary} onChange={handleChange} className="w-full border p-2 rounded" required />
      <textarea name="experience" value={form.experience} onChange={handleChange} className="w-full border p-2 rounded h-32" required />
      <input name="author" value={form.author} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="tags" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      {status && <p className="mt-4">{status}</p>}
    </form>
  );
}
