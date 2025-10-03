import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Drive from "@/models/drives";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; commentId: string; replyId: string } }
) {
    const {id, commentId, replyId} = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // load full mongoose document (no .lean())
    const drive = await Drive.findById(id);
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 });

    // find comment by id (works whether comment is subdoc or plain object)
    const comment = (drive as any).comments?.find(
      (c: any) => String(c._id) === String(commentId)
    );
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    // find reply index
    const replyIndex = (comment.replies || []).findIndex(
      (r: any) => String(r._id) === String(replyId)
    );
    if (replyIndex === -1) return NextResponse.json({ error: "Reply not found" }, { status: 404 });

    const reply = comment.replies[replyIndex];

    // authorization: only reply.authorEmail or admin can delete
    const isAuthor = reply.authorEmail === session.user.email;
    const isAdmin = (session as any).user?.role === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // remove the reply (splice the array) and save
    comment.replies.splice(replyIndex, 1);

    await drive.save();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE reply error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
