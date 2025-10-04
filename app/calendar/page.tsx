import AuthGuard from "@/components/AuthGuard";
import RoundsCalendar from "@/components/RoundsCalendar";

export default function RoundsPage() {
  return (
    <AuthGuard>
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Placement Calendar</h1>
      <RoundsCalendar />
    </section>
    </AuthGuard>
  );
}
