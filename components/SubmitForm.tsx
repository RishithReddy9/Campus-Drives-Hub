"use client";

import { useState } from "react";

export default function SubmitForm() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    summary: "",
    experience: "",
    author: "",
    tags: ""
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/drives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...form, 
        tags: form.tags.split(",").map(t => t.trim()) 
      })
    });

    if (res.ok) {
      setStatus("✅ Submitted successfully!");
      setForm({ company:"", role:"", date:"", summary:"", experience:"", author:"", tags:"" });
    } else {
      setStatus("❌ Error submitting");
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Interview Experience</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="summary" placeholder="Short Summary" value={form.summary} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="experience" placeholder="Full Experience" value={form.experience} onChange={handleChange} className="w-full border p-2 rounded h-32" required />
        <input name="author" placeholder="Your Name (optional)" value={form.author} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </section>
  );
}
