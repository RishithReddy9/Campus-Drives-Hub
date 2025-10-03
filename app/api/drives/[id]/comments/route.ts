import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const {id} = await params;
  await dbConnect();
  const drive = await Drive.findById(id).select("comments").lean();
  if (!drive) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json((drive as any).comments || []);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const {id}  = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text = (body?.text || "").toString().trim();
    if (!text) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

    await dbConnect();

    const drive = await Drive.findById(id);
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 });

    // Ensure comments array exists (defensive)
    if (!Array.isArray((drive as any).comments)) {
      (drive as any).comments = [];
    }

    const comment = {
      authorEmail: session.user.email,
      text,
      createdAt: new Date(),
      replies: [],
    };

    (drive as any).comments.push(comment);
    await drive.save();

    const added = (drive as any).comments[(drive as any).comments.length - 1];
    return NextResponse.json(added, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/drives/[id]/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}