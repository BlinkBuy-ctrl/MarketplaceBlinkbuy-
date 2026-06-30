import { useState } from "react";
import { Flag, Send, CheckCircle, ChevronDown } from "lucide-react";
import { addReport, REPORT_REASONS, type ReportReason } from "@/lib/reports";

interface ReportListingProps {
  itemId: string;
  itemTitle: string;
  sellerName: string;
}

export default function ReportListing({ itemId, itemTitle, sellerName }: ReportListingProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("fake_details");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addReport({
      itemId,
      itemTitle,
      sellerName,
      reason,
      message: message.trim(),
      reporterContact: contact.trim() || undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-green-700 dark:text-green-400">Report sent to admin</p>
          <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-0.5">
            Our team will review "{itemTitle}" and reach out if we need more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-red-500/20 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3.5 hover:bg-red-500/5 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-red-600">
          <Flag size={15} /> Report this listing or seller
        </span>
        <ChevronDown size={15} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-3 border-t border-red-500/10 pt-3">
          <p className="text-xs text-muted-foreground">
            Spotted fake details, a stolen item, or a scam? Let admin know — your message goes straight to the Reports queue.
          </p>

          <div>
            <label className="text-xs font-bold mb-1.5 block">What's wrong?</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as ReportReason)}
              className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500"
            >
              {REPORT_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block">Tell us what happened</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={3}
              placeholder={`e.g. "Photos don't match the item" or "This looks like a phone reported stolen in my area"`}
              className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block">Your phone or email (optional)</label>
            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="So admin can follow up with you"
              className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-all"
          >
            <Send size={14} /> Send report to admin
          </button>
        </form>
      )}
    </div>
  );
}
