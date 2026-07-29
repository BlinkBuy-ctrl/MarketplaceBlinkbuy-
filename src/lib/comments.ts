// Seller comments, stored locally in the browser for the same reason as
// src/lib/ratings.ts and src/lib/reports.ts — no backend yet, but the flow
// works end-to-end. Unlike ratings.ts, there is no star score here — buyers
// just leave a text comment about their experience with a seller.

export interface SellerComment {
  id: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  authorName?: string;
  comment: string;
  createdAt: string;
}

const KEY = "mhm_comments";

function read(): SellerComment[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SellerComment[]) : [];
  } catch {
    return [];
  }
}

function write(comments: SellerComment[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(comments));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

/** All comments for a seller, newest first. Omit sellerId for every comment. */
export function getComments(sellerId?: string): SellerComment[] {
  const all = read();
  const filtered = sellerId ? all.filter(c => c.sellerId === sellerId) : all;
  // Newest first — a fresh comment should appear on top.
  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addComment(input: Omit<SellerComment, "id" | "createdAt">): SellerComment {
  const full: SellerComment = {
    ...input,
    id: `cm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  // Prepend so the new comment is first without needing a re-sort.
  write([full, ...read()]);
  return full;
}

export function getCommentCount(sellerId: string): number {
  return getComments(sellerId).length;
}
