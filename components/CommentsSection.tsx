"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Reply = {
  _id?: string;
  authorEmail?: string;
  text: string;
  createdAt?: string;
};
type Comment = {
  _id?: string;
  authorEmail?: string;
  text: string;
  createdAt?: string;
  replies?: Reply[];
};

export default function CommentsSection({ driveId }: { driveId: string }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? null;
  const isAdmin = (session as any)?.user?.role === "admin";

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/drives/${driveId}/comments`)
      .then((r) => r.json())
      .then((data) => { if (mounted) setComments(data || []); })
      .catch((e) => console.error(e))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [driveId]);

  const postComment = async () => {
    const body = text.trim();
    if (!body || !userEmail) return;
    setPosting(true);
    const optimistic: Comment = {
      _id: `tmp-${Date.now()}`,
      authorEmail: userEmail,
      text: body,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setComments((c) => [optimistic, ...c]);
    setText("");

    try {
      const res = await fetch(`/api/drives/${driveId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
      });
      const saved = await res.json();
      if (res.ok) {
        setComments((c) => c.map((cm) => (cm._id?.toString().startsWith("tmp-") && cm.text === body ? saved : cm)));
      } else {
        setComments((c) => c.filter((cm) => !(cm._id?.toString().startsWith("tmp-") && cm.text === body)));
        alert(saved?.error || "Failed to post comment");
      }
    } catch (err) {
      setComments((c) => c.filter((cm) => !(cm._id?.toString().startsWith("tmp-") && cm.text === body)));
      console.error(err);
      alert("Network error");
    } finally {
      setPosting(false);
    }
  };

  const postReply = async (commentId: string) => {
    const rtext = (replyText[commentId] || "").trim();
    if (!rtext || !userEmail) return;

    const optimisticReply: Reply = {
      _id: `tmp-reply-${Date.now()}`,
      authorEmail: userEmail,
      text: rtext,
      createdAt: new Date().toISOString(),
    };

    setComments((cs) => cs.map((c) => c._id === commentId ? { ...c, replies: [...(c.replies || []), optimisticReply] } : c));
    setReplyText((s) => ({ ...s, [commentId]: "" }));

    try {
      const res = await fetch(`/api/drives/${driveId}/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rtext }),
      });
      const saved = await res.json();
      if (res.ok) {
        setComments((cs) => cs.map((c) => {
          if (c._id !== commentId) return c;
          return { ...c, replies: (c.replies || []).map((r) => (r._id?.toString().startsWith("tmp-reply-") && r.text === rtext ? saved : r)) };
        }));
      } else {
        alert(saved?.error || "Failed to post reply");
        setComments((cs) => cs.map((c) => c._id === commentId ? { ...c, replies: (c.replies || []).filter((r) => !(r._id?.toString().startsWith("tmp-reply-") && r.text === rtext)) } : c));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
      setComments((cs) => cs.map((c) => c._id === commentId ? { ...c, replies: (c.replies || []).filter((r) => !(r._id?.toString().startsWith("tmp-reply-") && r.text === rtext)) } : c));
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    // optimistic remove
    const prev = comments;
    setComments((c) => c.filter((x) => x._id !== commentId));
    try {
      const res = await fetch(`/api/drives/${driveId}/comments/${commentId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to delete");
        setComments(prev);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
      setComments(prev);
    }
  };

  const deleteReply = async (commentId: string, replyId: string) => {
    if (!confirm("Delete this reply?")) return;
    const prev = comments;
    setComments((cs) => cs.map((c) => c._id === commentId ? { ...c, replies: (c.replies || []).filter(r => r._id !== replyId) } : c));
    try {
      const res = await fetch(`/api/drives/${driveId}/comments/${commentId}/replies/${replyId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to delete");
        setComments(prev);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
      setComments(prev);
    }
  };

  const renderTime = (iso?: string) => iso ? new Date(iso).toLocaleString() : "";

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {session ? (
        <div className="mb-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment..." className="w-full border p-2 rounded mb-2" rows={3} />
          <div className="flex gap-2">
            <button onClick={postComment} disabled={posting} className="px-3 py-1 bg-blue-600 text-white rounded">
              {posting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">Log in to add comments.</p>
      )}

      {loading ? <p>Loading comments…</p> : (
        comments.length === 0 ? <p className="text-sm text-gray-500">No comments yet — be the first.</p> :
        <ul className="space-y-4">
          {comments.map((c) => {
            const canDeleteComment = (userEmail && c.authorEmail === userEmail) || isAdmin;
            return (
              <li key={String(c._id)} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{c.authorEmail ?? "Anonymous"}</div>
                    <div className="text-sm text-gray-600">{renderTime(c.createdAt)}</div>
                  </div>
                  {canDeleteComment && (
                    <button onClick={() => deleteComment(c._id as string)} className="text-sm text-red-500">Delete</button>
                  )}
                </div>

                <p className="mt-2 whitespace-pre-wrap">{c.text}</p>

                <div className="mt-3 pl-4 border-l">
                  {(c.replies || []).map((r) => {
                    const canDeleteReply = (userEmail && r.authorEmail === userEmail) || isAdmin;
                    return (
                      <div key={String(r._id)} className="mb-2">
                        <div className="text-sm font-medium">{r.authorEmail ?? "Anonymous"} <span className="text-xs text-gray-500 ml-2">{renderTime(r.createdAt)}</span></div>
                        <div className="text-sm">{r.text}</div>
                        {canDeleteReply && (
                          <button onClick={() => deleteReply(c._id as string, r._id as string)} className="text-xs text-red-500 mt-1">Delete reply</button>
                        )}
                      </div>
                    );
                  })}

                  {session && (
                    <div className="mt-2">
                      <input value={replyText[c._id || ""] || ""} onChange={(e) => setReplyText((s) => ({ ...s, [c._id || ""]: e.target.value }))} placeholder="Write a reply..." className="w-full border p-1 rounded mb-1" />
                      <div>
                        <button onClick={() => postReply(c._id as string)} className="text-sm px-2 py-1 bg-gray-200 rounded">Reply</button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
