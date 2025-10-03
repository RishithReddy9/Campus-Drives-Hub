"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Button } from "@heroui/button";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function SubmitResource({ currentFolderId }: { currentFolderId?: string }) {
  const [open, setOpen] = useState(false); // modal toggle
  const [form, setForm] = useState({
    title: "",
    type: "",
    content: "",
    pdf: "",
    parentId: currentFolderId || null,
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleDescriptionChange = (value?: string) => {
    setForm((p) => ({ ...p, content: value ?? "" }));
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data?.key) {
        setForm((prev) => ({ ...prev, pdf: data.key }));
      } else {
        setStatus(`❌ PDF upload failed: ${data?.error ?? res.statusText}`);
      }
    } catch (err: any) {
      setStatus(`❌ PDF upload failed: ${err?.message ?? "Network error"}`);
    } finally {
      setUploading(false);
      (e.target as HTMLInputElement).value = ""; // reset
    }
  };

  const removePdf = () => {
    setForm((prev) => ({ ...prev, pdf: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!form.title.trim() || form.type == "") {
      setStatus("Please fill Title and Type.");
      return;
    }

    setLoading(true);
    setStatus("Submitting...");

    const payload = { ...form, parentId: currentFolderId || null };

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("✅ Resource submitted!");
        setForm({ title: "", type: "", content: "", pdf: "", parentId: currentFolderId || null });
        setTimeout(() => setOpen(false), 1000); // auto-close after success
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
    <>
      {/* Global Add Button */}
      <Button
        onPress={() => setOpen(true)}
        color="primary"
      >
        Add Resource
      </Button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

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

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
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
                  <label className="block text-sm font-medium mb-2">Attach PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleUploadPdf}
                    className="mb-2"
                  />
                  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  {form.pdf && (
                    <ul className="mt-2">
                      <li className="flex justify-between items-center">
                        <span className="truncate max-w-[70%]">{form.pdf}</span>
                        <button
                          type="button"
                          onClick={removePdf}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    </ul>
                  )}
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
            </form>

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
          </div>
        </div>
      )}
    </>
  );
}
