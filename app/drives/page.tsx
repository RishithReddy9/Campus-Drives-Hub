"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@heroui/input";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DrivesPage() {
  const { data: drives, error, isLoading } = useSWR("/api/drives", fetcher);
  const [search, setSearch] = useState("");

  if (error) return <p className="text-red-500">❌ Failed to load drives.</p>;

  const filteredDrives = (drives || []).filter((d: any) => {
    const searchText = search.toLowerCase();
    return d.company.toLowerCase().includes(searchText);
  });

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎯 Drives & Experiences</h1>

      {/* Search */}
      <div className="flex gap-4 mb-8 w-full justify-center">
        <Input
          type="text"
          placeholder="Search by company..."
          className="max-w-md w-full dark:bg-gray-800 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="bordered"
        />
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : filteredDrives.length > 0 ? (
          filteredDrives.map((d: any) => (
            <Link
              key={d._id}
              href={`/drives/${d._id}`}
              className="group block rounded-2xl border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg 
                         hover:scale-[1.02] transition-all duration-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600">
                  {d.company}
                </h2>
                <span className="text-md text-gray-500 dark:text-gray-400">{d.roles[0]}</span>
              </div>
              <p className="text-md text-gray-700 dark:text-gray-300 line-clamp-3">
                {d.compensation}
              </p>
              <div className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
                Read more →
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No drives found.</p>
        )}
      </div>
    </section>
  );
}
