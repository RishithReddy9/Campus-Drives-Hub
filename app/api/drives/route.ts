import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all drives
export async function GET() {
  try {
    await dbConnect();
    const drives = await Drive.find({}).lean(); // lean = plain JSON
    return NextResponse.json(drives);
  } catch (err: any) {
    console.error("GET /api/drives error:", err);
    return NextResponse.json({ error: "Failed to fetch drives" }, { status: 500 });
  }
}

// POST new drive (ADMIN only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Basic validation
    const { company, summary, experiences, tags, pdfs, resources, compensation, skills, roles, rounds, comments } = body;
    if (!company || !summary || !experiences || !Array.isArray(experiences) || experiences.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const drive = await Drive.create({
      company: company.trim(),
      summary: summary.trim(),
      experiences,
      resources: resources || [],
      compensation: compensation || {},
      skills: skills || [],
      roles: roles || [],
      rounds: rounds || [],
      comments: comments || [],
      pdfs: pdfs || [],
      tags: tags || [],
    });

    return NextResponse.json(drive, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/drives error:", err);
    return NextResponse.json({ error: "Failed to create drive" }, { status: 500 });
  }
}
