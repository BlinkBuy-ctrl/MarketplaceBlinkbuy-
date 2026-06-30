// Listing/seller reports, stored locally in the browser.
// There's no backend in this project yet, so reports submitted by a buyer
// are saved to localStorage and read back on the Admin Reports tab — this
// keeps the "message admin about a fake listing / stolen item" flow fully
// working end-to-end today, and is a thin layer to swap for a real API
// call later (just replace the localStorage read/write below).

export type ReportReason =
  | "fake_details"
  | "stolen_item"
  | "scam_fraud"
  | "inappropriate"
  | "other";

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "fake_details", label: "Fake or misleading listing details" },
  { value: "stolen_item", label: "Suspected stolen item" },
  { value: "scam_fraud", label: "Scam or fraud attempt" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Other" },
];

export interface ListingReport {
  id: string;
  itemId: string;
  itemTitle: string;
  sellerName: string;
  reason: ReportReason;
  message: string;
  reporterContact?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

const KEY = "mhm_reports";

function read(): ListingReport[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ListingReport[]) : [];
  } catch {
    return [];
  }
}

function write(reports: ListingReport[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(reports));
  } catch {
    // localStorage unavailable (private browsing, etc.) — fail silently.
  }
}

export function getReports(): ListingReport[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addReport(
  report: Omit<ListingReport, "id" | "status" | "createdAt">
): ListingReport {
  const full: ListingReport = {
    ...report,
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  write([full, ...read()]);
  return full;
}

export function updateReportStatus(id: string, status: ListingReport["status"]) {
  write(read().map(r => (r.id === id ? { ...r, status } : r)));
}

export function pendingReportCount(): number {
  return read().filter(r => r.status === "pending").length;
}
