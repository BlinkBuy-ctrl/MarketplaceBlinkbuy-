import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingBag, Home, Briefcase, MessageCircle, User,
  Menu, X, Sun, Moon, Plus,
} from "lucide-react";

const NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Jobs",        href: "#",            icon: Briefcase },
  { label: "Messages",    href: "#",            icon: MessageCircle },
];

const BOTTOM_NAV = [
  { label: "Home",      href: "/",            icon: Home },
  { label: "Market",    href: "/marketplace", icon: ShoppingBag },
  { label: "Jobs",      href: "#",            icon: Briefcase },
  { label: "Messages",  href: "#",            icon: MessageCircle },
  { label: "Profile",   href: "#",            icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    setPageVisible(false);
    const t = setTimeout(() => setPageVisible(true), 80);
    setOpen(false);
    return () => clearTimeout(t);
  }, [loc]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[hsl(215,55%,12%)] text-white shadow-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(210,100%,60%)] to-[hsl(210,100%,45%)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-150">
                <span className="text-white font-black text-sm">B</span>
              </div>
              <span className="font-black text-lg tracking-tight">BlinkBuy</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => {
                const active = loc === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      active ? "text-white bg-white/15" : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <n.icon size={12} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1 bg-[hsl(210,100%,56%)] hover:bg-[hsl(210,100%,50%)] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                <Plus size={13} /> Sell Item
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[hsl(215,50%,10%)]">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/10 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <n.icon size={15} />
                  {n.label}
                </Link>
              ))}
              <Link
                href="/post-item"
                className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-bold text-[hsl(210,100%,70%)] hover:bg-white/10 transition-all"
                onClick={() => setOpen(false)}
              >
                <Plus size={15} /> Sell an Item
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main
        className="flex-1 pb-16 lg:pb-0"
        style={{ opacity: pageVisible ? 1 : 0, transition: "opacity 120ms ease" }}
      >
        {children}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[hsl(215,55%,10%)] border-t border-white/10">
        <div className="flex items-center justify-around h-14 px-1">
          {BOTTOM_NAV.map(n => {
            const active = n.href !== "#" && (loc === n.href || (n.href !== "/" && loc.startsWith(n.href)));
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-150 min-w-0 flex-1 ${
                  active ? "text-blue-400" : "text-white/40 hover:text-white/70"
                }`}
              >
                <n.icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium whitespace-nowrap leading-none">{n.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* FOOTER */}
      <footer className="hidden lg:block bg-[hsl(215,55%,8%)] text-white/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(210,100%,60%)] to-[hsl(210,100%,45%)] flex items-center justify-center">
                  <span className="text-white font-black text-sm">B</span>
                </div>
                <span className="font-black text-white text-lg">BlinkBuy Malawi</span>
              </div>
              <p className="text-xs text-white/45 leading-relaxed mb-4">
                Malawi's local marketplace. Buy and sell goods across all 28 districts.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Marketplace</h4>
              <div className="space-y-2 text-xs">
                {[["Browse All", "/marketplace"], ["Sell an Item", "/post-item"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-white/50 hover:text-white transition-all">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">Payments</h4>
              <div className="text-xs text-white/50 space-y-1">
                <p>Airtel Money: <strong className="text-white">0999626944</strong></p>
                <p>TNM Mpamba: <strong className="text-white">0888712272</strong></p>
                <p>Featured: <strong className="text-white/70">MK 5,000/mo</strong></p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Powered by <span className="text-[hsl(210,100%,65%)] font-bold">O-techy</span> · Built for Malawi.
            </p>
            <p className="text-xs text-white/20">© 2026 BlinkBuy Malawi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
