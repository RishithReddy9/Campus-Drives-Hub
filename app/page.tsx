import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Campus Drives Hub</h1>
      <p className="mt-4 text-gray-600">A community-sourced collection of on-campus drives and interview experiences.</p>

      <div className="mt-6 space-y-4">
        <Link href="/drives" className="block p-4 bg-white shadow rounded">Browse Drives</Link>
        <Link href="/resources" className="block p-4 bg-white shadow rounded">Explore Resources</Link>
      </div>
    </section>
  )
}
