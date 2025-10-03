"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function EditResourceForm({ resource }: { resource: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: resource.title,
    type: resource.type,
    content: resource.content || "",
    pdf: resource.pdf || "",
    parentId: resource.parentId || null,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value?: string) => {
    setForm((p) => ({ ...p, content: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Updating...");

    try {
      const res = await fetch(`/api/resources/${resource._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Updated!");
        // redirect to the resource detail page
        router.push(`/resources/${resource._id}`);
        router.refresh(); // refresh cache so the page shows new data
      } else {
        const err = await res.json().catch(() => null);
        setStatus(`❌ Error updating: ${err?.error ?? res.statusText}`);
      }
    } catch (error: any) {
      setStatus(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <select
                name="type"
                value={form.type}
                disabled={true}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Category</option>
                <option value="folder">Folder</option>
                <option value="file">File</option>
                <option value="blog">Blog</option>
              </select>

              {/* File Upload */}
              {form.type === "file" && (
                <div>
                  <label className="block text-sm font-medium mb-2">PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    disabled={true}
                    className="mb-2"
                  />
                </div>
              )}

              {/* Blog Markdown */}
              {form.type === "blog" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Markdown)</label>
                  <MDEditor
                    value={form.content}
                    onChange={handleDescriptionChange}
                    height={240}
                    preview="live"
                    textareaProps={{ placeholder: "Write resource description in Markdown..." }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use Markdown — headings, lists, links, code blocks, etc.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                {status && <p className="text-sm">{status}</p>}
              </div>

            {/* Live Preview */}
            {form.type === "blog" && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-2">Preview</h2>
                <div className="bg-white border rounded p-4">
                  <MarkdownPreview
                    source={form.content || "_(no description)_"}
                    wrapperElement={{ "data-color-mode": "light" }}
                  />
                </div>
              </div>
            )}
    </form>
  );
}
