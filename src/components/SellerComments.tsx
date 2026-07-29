import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { addComment, getComments, type SellerComment } from "@/lib/comments";

interface SellerCommentsProps {
  sellerId: string;
  sellerName: string;
  itemId: string;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SellerComments({ sellerId, sellerName, itemId }: SellerCommentsProps) {
  const [comments, setComments] = useState<SellerComment[]>(() => getComments(sellerId));
  const [authorName, setAuthorName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const saved = addComment({
      sellerId,
      sellerName,
      itemId,
      authorName: authorName.trim() || undefined,
      comment: text.trim(),
    });
    // New comment goes on top of the list right away.
    setComments(prev => [saved, ...prev]);
    setText("");
  };

  return (
    <div className="bg-card border border-red-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold flex items-center gap-1.5">
          <MessageSquare size={14} className="text-red-500" />
          Comments on {sellerName}
        </p>
        <span className="text-xs text-muted-foreground font-medium">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Share your experience with ${sellerName}...`}
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500 resize-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          <Send size={14} /> Post comment
        </button>
      </form>

      {comments.length > 0 && (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {comments.map(c => (
            <div key={c.id} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{c.authorName || "Anonymous buyer"}</span>
                <span className="text-[10px] text-muted-foreground">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
