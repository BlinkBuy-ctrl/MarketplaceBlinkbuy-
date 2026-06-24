import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        <div className="text-6xl font-black text-muted-foreground/20 mb-4">404</div>
        <h2 className="text-xl font-bold mb-2">Page not found</h2>
        <p className="text-muted-foreground text-sm mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}
