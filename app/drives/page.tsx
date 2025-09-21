"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DrivesPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/drives")
      .then((res) => res.json())
      .then((data) => setDrives(data));
  }, []);

  const filteredDrives = drives.filter((d) => {
    const searchText = search.toLowerCase();
    return (
      (!filter || d.company.toLowerCase().includes(filter.toLowerCase())) &&
      (d.company.toLowerCase().includes(searchText) ||
       d.role.toLowerCase().includes(searchText) ||
       d.summary.toLowerCase().includes(searchText))
    );
  });

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Drives & Interview Experiences</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by company, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Companies</option>
          {[...new Set(drives.map((d) => d.company))].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredDrives.length > 0 ? (
          filteredDrives.map((d) => (
            <article key={d._id} className="p-4 bg-white shadow rounded">
              <Link href={`/drives/${d._id}`}>
                <h2 className="font-semibold">{d.company} — {d.role}</h2>
              </Link>
              <p className="text-sm text-gray-500">{d.date}</p>
              <p className="mt-2">{d.summary}</p>
            </article>
          ))
        ) : (
          <p className="text-gray-500">No drives found.</p>
        )}
      </div>
    </section>
  );
}
