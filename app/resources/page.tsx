"use client";
import useSWR from "swr";
import Link from "next/link";
import SubmitResource from "@/components/SubmitResource";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ResourcesPage() {
  const { data: resources, error, isLoading } = useSWR("/api/resources", fetcher);
  const { data: session } = useSession();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>❌ Failed to load</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Preparation Resources</h1>
      {session?.user.role==='admin' && <SubmitResource />}
      <div className="grid gap-4">
        {resources.map((r: any) => (
          <article key={r._id} className="p-4 bg-white shadow rounded">
            <Link href={`/resources/${r._id}`}>
              <h2 className="font-semibold">{r.title}</h2>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
