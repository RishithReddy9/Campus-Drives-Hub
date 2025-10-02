"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function SubmitResource() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    link: "",
    description: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleDescriptionChange = (value?: string) => {
    setForm((p) => ({ ...p, description: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!form.title.trim() || !form.category.trim() || !form.link.trim() || !form.description.trim()) {
      setStatus("Please fill Title, Category, Link and Description.");
      return;
    }

    setLoading(true);
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Resource submitted!");
        setForm({ title: "", category: "", link: "", description: "" });
      } else {
        const json = await res.json().catch(() => null);
        setStatus(`❌ Error: ${json?.error ?? res.statusText}`);
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err?.message ?? "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Submit Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="link"
            placeholder="Link (https://...)"
            value={form.link}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
          <MDEditor
            value={form.description}
            onChange={handleDescriptionChange}
            height={240}
            preview="live"
            textareaProps={{ placeholder: "Write resource description in Markdown..." }}
          />
          <p className="text-xs text-gray-500 mt-1">Use Markdown — headings, lists, links, code blocks, etc.</p>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {status && <p className="text-sm">{status}</p>}
        </div>
      </form>

      {/* Live read-only preview */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Preview</h2>
        <div className="bg-white border rounded p-4">
          <MarkdownPreview source={form.description || "_(no description)_"} wrapperElement={{ "data-color-mode": "light" }} />
        </div>
      </div>
    </section>
  );
}
