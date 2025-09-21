import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET one resource
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const resource = await Resource.findById(params.id);
  if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(resource);
}

// DELETE (admin only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  await Resource.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

// PUT (admin only - edit)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await dbConnect();
  const resource = await Resource.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(resource);
}
