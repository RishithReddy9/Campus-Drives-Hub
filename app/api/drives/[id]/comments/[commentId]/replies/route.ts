// app/api/drives/[id]/comments/[commentId]/replies/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string; commentId: string } }) {
    const {id, commentId} = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const text = (body?.text || "").toString().trim();
    if (!text) return NextResponse.json({ error: "Empty reply" }, { status: 400 });

    await dbConnect();

    const drive = await Drive.findById(id);
    if (!drive) {
      console.warn("POST reply: drive not found", params.id);
      return NextResponse.json({ error: "Drive not found" }, { status: 404 });
    }

    // defensive: ensure comments array exists
    if (!Array.isArray((drive as any).comments)) (drive as any).comments = [];

    const comment = (drive as any).comments.id(commentId);
    if (!comment) {
      console.warn("POST reply: comment not found", { driveId: params.id, commentId: params.commentId });
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // ensure replies array exists
    if (!Array.isArray(comment.replies)) comment.replies = [];

    const reply = {
      authorEmail: session.user.email,
      text,
      createdAt: new Date(),
    };

    comment.replies.push(reply as any);
    await drive.save();

    // return the newly added reply (mongoose subdoc)
    const added = comment.replies[comment.replies.length - 1];
    return NextResponse.json(added, { status: 201 });
  } catch (err: any) {
    console.error("POST reply error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
