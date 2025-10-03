import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: { id: string; commentId: string } }) {
    const {id, commentId} = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const drive = await Drive.findById(id);
  if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 });

  const comment = drive.comments.id(commentId);
  if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  const isAuthor = comment.authorEmail === session.user.email;
  const isAdmin = session.user?.role === "admin";

  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  comment.remove();
  await drive.save();
  return NextResponse.json({ ok: true });
}
