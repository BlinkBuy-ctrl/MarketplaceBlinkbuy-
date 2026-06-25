import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  ShoppingBag, Home, Briefcase, MessageCircle, User,
  Menu, X, Plus, Bell,
} from "lucide-react";

const NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Jobs",        href: "#",            icon: Briefcase },
  { label: "Messages",    href: "#",            icon: MessageCircle },
];

const BOTTOM_NAV = [
  { label: "Home",     href: "/",            icon: Home },
  { label: "Market",   href: "/marketplace", icon: ShoppingBag },
  { label: "Jobs",     href: "#",            icon: Briefcase },
  { label: "Messages", href: "#",            icon: MessageCircle },
  { label: "Profile",  href: "#",            icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setPageVisible(false);
    const t = setTimeout(() => setPageVisible(true), 80);
    setOpen(false);
    return () => clearTimeout(t);
  }, [loc]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>

      {/* ── Malawian top accent stripe ─────────────────────────── */}
      <div className="h-[3px] w-full flex shrink-0">
        <div className="flex-1" style={{ backgroundColor: "#121212" }} />
        <div className="flex-1" style={{ backgroundColor: "#CE1126" }} />
        <div className="flex-1" style={{ backgroundColor: "#007A33" }} />
      </div>

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 transition-shadow duration-200"
        style={{
          backgroundColor: "#0d0d0d",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.70)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-15 py-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-150"
                style={{ background: "linear-gradient(135deg, #0047AB 0%, #007A33 100%)" }}
              >
                <span className="text-white font-black text-sm tracking-tighter">BB</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-base tracking-tight text-white">BlinkBuy</span>
                <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "#007A33" }}>Malawi</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => {
                const active = loc === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150"
                    style={{
                      color: active ? "#fff" : "rgba(255,255,255,0.55)",
                      backgroundColor: active ? "rgba(0,71,171,0.30)" : "transparent",
                      borderBottom: active ? "2px solid #0047AB" : "2px solid transparent",
                    }}
                  >
                    <n.icon size={13} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button
                className="p-2 rounded-lg transition-all"
                style={{ color: "rgba(255,255,255,0.45)" }}
                aria-label="Notifications"
              >
                <Bell size={16} />
              </button>

              {/* Sell CTA */}
              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1.5 btn-primary px-4 py-2 rounded-xl text-xs"
              >
                <Plus size={13} /> Sell Item
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 rounded-lg transition-all"
                style={{ color: "rgba(255,255,255,0.55)" }}
                aria-label="Menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {open && (
          <div style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                  onClick={() => setOpen(false)}
                >
                  <n.icon size={16} />
                  {n.label}
                </Link>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <Link
                  href="/post-item"
                  className="flex items-center gap-2 p-3 rounded-xl text-sm font-bold btn-primary mt-1"
                  onClick={() => setOpen(false)}
                >
                  <Plus size={15} /> Sell an Item
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ──────────────────────────────────────── */}
      <main
        className="flex-1 pb-16 lg:pb-0"
        style={{ opacity: pageVisible ? 1 : 0, transition: "opacity 130ms ease" }}
      >
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50"
        style={{ backgroundColor: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-around h-14 px-1">
          {BOTTOM_NAV.map(n => {
            const active = n.href !== "#" && (loc === n.href || (n.href !== "/" && loc.startsWith(n.href)));
            return (
              <Link
                key={n.label}
                href={n.href}
                className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-150 min-w-0 flex-1"
                style={{ color: active ? "#6babff" : "rgba(255,255,255,0.35)" }}
              >
                <n.icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium whitespace-nowrap leading-none">{n.label}</span>
                {active && (
                  <span className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: "#0047AB" }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── DESKTOP FOOTER ────────────────────────────────────── */}
      <footer className="hidden lg:block" style={{ backgroundColor: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Malawian flag accent bar */}
        <div className="h-[2px] w-full flex">
          <div className="flex-1" style={{ backgroundColor: "#121212" }} />
          <div className="flex-1" style={{ backgroundColor: "#CE1126" }} />
          <div className="flex-1" style={{ backgroundColor: "#007A33" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0047AB 0%, #007A33 100%)" }}
                >
                  <span className="text-white font-black text-sm">BB</span>
                </div>
                <div>
                  <span className="font-black text-white text-base">BlinkBuy</span>
                  <span className="text-xs font-semibold tracking-widest uppercase ml-1.5" style={{ color: "#007A33" }}>Malawi</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                Malawi's premium local marketplace. Buy and sell goods across all 28 districts.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.50)" }}>Marketplace</h4>
              <div className="space-y-2 text-xs">
                {[["Browse All", "/marketplace"], ["Sell an Item", "/post-item"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block transition-all" style={{ color: "rgba(255,255,255,0.40)" }}>
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payments */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.50)" }}>Payments</h4>
              <div className="text-xs space-y-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                <p>Airtel Money: <strong className="text-white">0999 626 944</strong></p>
                <p>TNM Mpamba: <strong className="text-white">0888 712 272</strong></p>
                <p className="mt-2">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide badge-green"
                  >
                    Featured: MK 5,000 / mo
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
              Powered by{" "}
              <span className="font-bold" style={{ color: "#0047AB" }}>O-techy</span>
              {" "}· Built for Malawi 🇲🇼
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>© 2026 BlinkBuy Malawi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
