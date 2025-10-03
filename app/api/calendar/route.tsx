// app/api/calendar/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive, {IRound} from "@/models/drives";

export async function GET() {
  try {
    await dbConnect();

    // Fetch only the fields we need
    const drives = await Drive.find({}, { company: 1, rounds: 1 }).lean();

    // Flatten rounds into event objects
    const events = drives.flatMap((drive) =>
      drive.rounds.map((round: IRound) => ({
        id: `${drive._id}-${round.round}`, // unique id
        title: `${drive.company} – ${round.round}`,
        start: new Date(round.date),
        end: new Date(round.date), // single day event
        allDay: true,
      }))
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}
