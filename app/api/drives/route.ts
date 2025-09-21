import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all drives
export async function GET() {
  await dbConnect();
  const drives = await Drive.find({});
  return NextResponse.json(drives);
}

// POST new drive (ADMIN only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const drive = await Drive.create(body);
  return NextResponse.json(drive, { status: 201 });
}
