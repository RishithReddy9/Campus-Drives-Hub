import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET one drive
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const drive = await Drive.findById(params.id);
  if (!drive) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(drive);
}

// DELETE (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  await Drive.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

// PUT (admin only - edit)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await dbConnect();
  const drive = await Drive.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(drive);
}
