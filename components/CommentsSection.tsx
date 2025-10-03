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
    <section className="mt-10">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        💬 Comments
      </h3>

      {/* Add comment box */}
      {session ? (
        <div className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add your thoughts..."
            className="w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={postComment}
              disabled={posting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {posting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          Please log in to post comments.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-500">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet — be the first!</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => {
            const canDeleteComment =
              (userEmail && c.authorEmail === userEmail) || isAdmin;
            return (
              <li
                key={String(c._id)}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {c.authorEmail ?? "Anonymous"}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {renderTime(c.createdAt)}
                    </span>
                  </div>
                  {canDeleteComment && (
                    <button
                      onClick={() => deleteComment(c._id as string)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Body */}
                <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {c.text}
                </p>

                {/* Replies */}
                <div className="mt-4 space-y-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                  {(c.replies || []).map((r) => {
                    const canDeleteReply =
                      (userEmail && r.authorEmail === userEmail) || isAdmin;
                    return (
                      <div
                        key={String(r._id)}
                        className="p-2 rounded bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {r.authorEmail ?? "Anonymous"}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {renderTime(r.createdAt)}
                            </span>
                          </div>
                          {canDeleteReply && (
                            <button
                              onClick={() =>
                                deleteReply(c._id as string, r._id as string)
                              }
                              className="text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {r.text}
                        </p>
                      </div>
                    );
                  })}

                  {/* Reply box */}
                  {session && (
                    <div className="mt-3">
                      <input
                        value={replyText[c._id || ""] || ""}
                        onChange={(e) =>
                          setReplyText((s) => ({
                            ...s,
                            [c._id || ""]: e.target.value,
                          }))
                        }
                        placeholder="Write a reply..."
                        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => postReply(c._id as string)}
                          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Reply
                        </button>
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
