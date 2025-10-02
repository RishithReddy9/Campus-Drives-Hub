"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// client-only dynamic imports
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function SubmitForm() {
  const [form, setForm] = useState({
    company: "",
    role: "",
    date: "",
    summary: "",
    experience: "", // markdown
    author: "",
    tags: "",
  });
  const [status, setStatus] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExperienceChange = (value?: string) => {
    setForm((prev) => ({ ...prev, experience: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // basic validation
    if (
      !form.company.trim() ||
      !form.role.trim() ||
      !form.date.trim() ||
      !form.summary.trim() ||
      !form.experience.trim()
    ) {
      setStatus("Please fill required fields (company, role, date, summary, experience).");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting...");

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("✅ Submitted successfully!");
        setForm({ company: "", role: "", date: "", summary: "", experience: "", author: "", tags: "" });
      } else {
        const json = await res.json().catch(() => null);
        setStatus(`❌ Error: ${json?.error ?? res.statusText}`);
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err?.message ?? "Network error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Submit Interview Experience</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="summary"
          placeholder="Short Summary"
          value={form.summary}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Full Experience — Markdown</label>
          {/* Editor */}
          <MDEditor
            value={form.experience}
            onChange={handleExperienceChange}
            height={300}
            visibleDragbar={false}
            preview="live"
            textareaProps={{
              placeholder: "Write your interview experience here using Markdown...",
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Use Markdown (headings, lists, code blocks, links). Preview is live below the editor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="author"
            placeholder="Your Name (optional)"
            value={form.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {status && <p className="text-sm">{status}</p>}
        </div>
      </form>

      {/* Compiled preview block (read-only) */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <div className="prose max-w-none border rounded p-4 bg-gray-50">
          {/* Use @uiw/react-markdown-preview's component */}
          <MarkdownPreview source={form.experience || "Nothing yet..."} />
        </div>
      </div>
    </section>
  );
}
