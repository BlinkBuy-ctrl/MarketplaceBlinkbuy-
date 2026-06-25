import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        {/* Flag stripe accent */}
        <div className="flex justify-center gap-1 mb-6">
          <div className="w-8 h-2 rounded-full" style={{ backgroundColor: "#121212", border: "1px solid rgba(255,255,255,0.12)" }} />
          <div className="w-8 h-2 rounded-full" style={{ backgroundColor: "#CE1126" }} />
          <div className="w-8 h-2 rounded-full" style={{ backgroundColor: "#007A33" }} />
        </div>

        <div className="text-7xl font-black mb-4" style={{ color: "rgba(255,255,255,0.07)" }}>404</div>
        <h2 className="text-xl font-black text-white mb-2">Page not found</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.40)" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl text-sm"
        >
          ← Go Home
        </Link>
      </div>
    </div>
  );
}
