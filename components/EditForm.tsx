"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

type RoundItem = { date: string; round: string };

type FormState = {
  company: string;
  summary: string;
  experiences: string[];
  tags: string; // comma separated in UI
  pdfs: string[]; // s3 keys
  compensation: string;
  skills: string; // comma separated
  roles: string; // comma separated
  resources: string[]; // comma separated (URLs)
  rounds: RoundItem[];
};

export default function EditForm({ drive }: { drive: any }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    company: drive.company,
    summary: drive.summary,
    experiences: drive.experiences,
    tags: drive.tags.join(", ") || "",
    pdfs: drive.pdfs || [],
    compensation: drive.compensation || "",
    skills: drive.skills.join(", ") || "",
    roles: drive.roles.join(", ") || "",
    resources: drive.resources || [],
    rounds: drive.rounds || [],
  });
  const [status, setStatus] = useState<null | string>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingResources, setUploadingResources] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Experiences handlers
  const handleExperienceChange = (index: number, value?: string) => {
    const updated = [...form.experiences];
    updated[index] = value ?? "";
    setForm((prev) => ({ ...prev, experiences: updated }));
  };
  const addExperience = () => setForm((prev) => ({ ...prev, experiences: [...prev.experiences, ""] }));
  const removeExperience = (index: number) => {
    if (form.experiences.length === 1) return;
    setForm((prev) => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
  };

  // Rounds handlers (array of {date, round})
  const handleRoundChange = (index: number, field: "date" | "round", value: string) => {
    const updated = [...form.rounds];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, rounds: updated }));
  };
  const addRound = () => setForm((prev) => ({ ...prev, rounds: [...prev.rounds, { date: "", round: "" }] }));
  const removeRound = (index: number) =>
    setForm((prev) => ({ ...prev, rounds: prev.rounds.filter((_, i) => i !== index) }));

  // PDF upload (expects /api/upload returns { key })
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
        setForm((prev) => ({ ...prev, pdfs: [...prev.pdfs, data.key] }));
      } else {
        setStatus(`❌ PDF upload failed: ${data?.error ?? res.statusText}`);
      }
    } catch (err: any) {
      setStatus(`❌ PDF upload failed: ${err?.message ?? "Network error"}`);
    } finally {
      setUploading(false);
      // reset input value to allow re-upload of same file if needed
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removePdf = (index: number) => {
    setForm((prev) => ({ ...prev, pdfs: prev.pdfs.filter((_, i) => i !== index) }));
  };

  const handleUploadPdfResources = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResources(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data?.key) {
        setForm((prev) => ({ ...prev, resources: [...prev.resources, data.key] }));
      } else {
        setStatus(`❌ PDF upload failed: ${data?.error ?? res.statusText}`);
      }
    } catch (err: any) {
      setStatus(`❌ PDF upload failed: ${err?.message ?? "Network error"}`);
    } finally {
      setUploadingResources(false);
      // reset input value to allow re-upload of same file if needed
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removePdfResources = (index: number) => {
    setForm((prev) => ({ ...prev, pdfs: prev.pdfs.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Updating...");

    const res = await fetch(`/api/drives/${drive._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: form.tags.split(",").map((t:string) => t.trim()) }),
    });

    if (res.ok) {
      setStatus("✅ Updated successfully!");
      router.push(`/drives/${drive._id}`);
    } else {
      setStatus("❌ Error updating");
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="compensation" placeholder="Compensation (e.g. 6 LPA)" value={form.compensation} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <input name="summary" placeholder="Short Summary" value={form.summary} onChange={handleChange} className="w-full border p-2 rounded" required />

        {/* Experiences (Markdown) */}
        <div>
          <label className="block text-sm font-medium mb-2">Experiences (Markdown)</label>
          {form.experiences.map((exp, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Experience {i + 1}</span>
                {form.experiences.length > 1 && (
                  <button type="button" onClick={() => removeExperience(i)} className="text-red-500 text-sm">Remove</button>
                )}
              </div>
              <MDEditor value={exp} onChange={(val) => handleExperienceChange(i, val)} height={220} preview="live" textareaProps={{ placeholder: "Write experience in Markdown..." }} />
            </div>
          ))}
          <button type="button" onClick={addExperience} className="mt-2 text-sm px-3 py-1 rounded bg-green-500 text-white">+ Add Experience</button>
        </div>

        {/* Rounds */}
        <div>
          <label className="block text-sm font-medium mb-2">Rounds (date & name)</label>
          {form.rounds.length === 0 && <p className="text-sm text-gray-500 mb-2">No rounds added — optionally add interview rounds.</p>}
          {form.rounds.map((r, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input type="date" value={r.date} onChange={(e) => handleRoundChange(i, "date", e.target.value)} className="border p-2 rounded" />
              <input placeholder="Round name (e.g. Technical, HR)" value={r.round} onChange={(e) => handleRoundChange(i, "round", e.target.value)} className="border p-2 rounded flex-1" />
              <button type="button" onClick={() => removeRound(i)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addRound} className="mt-2 text-sm px-3 py-1 rounded bg-indigo-600 text-white">+ Add Round</button>
        </div>

        {/* Upload JDs */}
        <div>
          <label className="block text-sm font-medium mb-2">Attach JD(s)</label>
          <input type="file" accept="application/pdf" onChange={handleUploadPdf} className="mb-2" />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          <ul className="mt-2">
            {form.pdfs.map((pdf, i) => (
              <li key={i} className="flex justify-between items-center text-sm border p-2 rounded mb-1">
                <span className="truncate max-w-[70%]">{pdf}</span>
                <button type="button" onClick={() => removePdf(i)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags / skills / roles / resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="roles" placeholder="Other roles (comma separated)" value={form.roles} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        {/* Upload Resources */}
        <div>
          <label className="block text-sm font-medium mb-2">Attach Resource(s) (Optional)</label>
          <input type="file" accept="application/pdf" onChange={handleUploadPdfResources} className="mb-2" />
          {uploadingResources && <p className="text-sm text-gray-500">Uploading...</p>}
          <ul className="mt-2">
            {form.resources.map((pdf, i) => (
              <li key={i} className="flex justify-between items-center text-sm border p-2 rounded mb-1">
                <span className="truncate max-w-[70%]">{pdf}</span>
                <button type="button" onClick={() => removePdfResources(i)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {status && <p className="text-sm">{status}</p>}
        </div>
      </form>

      {/* Live Preview */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <div className="prose max-w-none border rounded p-4 bg-gray-50">
          {form.experiences.map((exp, i) => (
            <div key={i} className="mb-6">
              <h3 className="text-md font-semibold">Experience {i + 1}</h3>
              <MarkdownPreview source={exp || "Nothing yet..."} wrapperElement={{ "data-color-mode": "light" }} />
            </div>
          ))}

          {form.rounds.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium">Rounds</h3>
              <ul className="list-disc pl-5">
                {form.rounds.map((r, i) => <li key={i}>{r.date} — {r.round}</li>)}
              </ul>
            </div>
          )}

          {form.pdfs.length > 0 && (
            <div>
              <h3 className="font-medium mt-4">Attached PDFs</h3>
              <ul className="list-disc pl-5">
                {form.pdfs.map((pdf, i) => <li key={i}>{pdf}</li>)}
              </ul>
            </div>
          )}

          {form.skills && (
            <div className="mt-4">
              <h3 className="font-medium">Skills</h3>
              <p>{form.skills.split(",").map(s => s.trim()).filter(Boolean).join(", ")}</p>
            </div>
          )}
        </div>
      </div>
      </>
  );
}
