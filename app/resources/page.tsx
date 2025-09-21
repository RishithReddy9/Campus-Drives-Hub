"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ResourceAdminControls from "@/components/ResourceAdminControls";

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => setResources(data));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Preparation Resources</h1>
      <div className="grid gap-4">
        {resources.map((r) => (
          <article key={r._id} className="p-4 bg-white shadow rounded">
            <h2 className="font-semibold">{r.title}</h2>
            <p className="text-sm text-gray-500">{r.category}</p>
            <p className="mt-2">{r.description}</p>
            <a href={r.link} target="_blank" className="text-blue-600 underline mt-2 inline-block">
              Open Resource
            </a>

            {session && <ResourceAdminControls id={r._id} />}
          </article>
        ))}
      </div>
    </section>
  );
}
