import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingBag, Home, Briefcase, MessageCircle, User,
  Menu, X, Sun, Moon, Plus, Zap,
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
      {/* PREMIUM HEADER */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f] dark:bg-[#0a0a0a] text-white shadow-2xl border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Premium Black & Pink */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-pink-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300">
                <span className="text-white font-black text-base">B</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-pink-400 transition-colors">BlinkBuy</span>
                <span className="text-xs font-bold text-pink-400 tracking-wider">OTECHY EXCLUSIVE</span>
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      active 
                        ? "text-pink-400 bg-pink-500/15 border border-pink-500/30" 
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <n.icon size={14} strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-white/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-pink-500/30"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Sell Button - Premium Pink */}
              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-pink-500/50 border border-pink-400/20"
              >
                <Plus size={14} strokeWidth={3} /> 
                <span>Sell Item</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2.5 text-white/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all border border-white/10 hover:border-pink-500/30"
              >
                {open ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="lg:hidden border-t border-pink-500/20 bg-black/80 backdrop-blur-sm">
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV.map(n => {
                const active = loc === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active 
                        ? "text-pink-400 bg-pink-500/20 border border-pink-500/40" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <n.icon size={16} strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/post-item"
                className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition-all mt-2"
                onClick={() => setOpen(false)}
              >
                <Plus size={16} strokeWidth={3} /> 
                Sell an Item
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

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0f0f0f] dark:bg-[#0a0a0a] border-t border-pink-500/20">
        <div className="flex items-center justify-around h-16 px-1 backdrop-blur-sm">
          {BOTTOM_NAV.map(n => {
            const active = n.href !== "#" && (loc === n.href || (n.href !== "/" && loc.startsWith(n.href)));
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  active 
                    ? "text-pink-400" 
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <n.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-semibold whitespace-nowrap leading-none">{n.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* PREMIUM FOOTER */}
      <footer className="hidden lg:block bg-[#0f0f0f] dark:bg-[#0a0a0a] text-white/70 border-t border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-black text-base">B</span>
                </div>
                <div>
                  <span className="font-black text-white text-base block">BlinkBuy</span>
                  <span className="text-xs text-pink-400 font-bold">MALAWI</span>
                </div>
              </div>
              <p className="text-xs text-white/45 leading-relaxed">
                Malawi's premium local marketplace. Buy and sell goods across all 28 districts with confidence.
              </p>
            </div>

            {/* Marketplace Links */}
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Marketplace</h4>
              <div className="space-y-2.5 text-xs">
                {[["Browse All", "/marketplace"], ["Sell an Item", "/post-item"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Support</h4>
              <div className="space-y-2.5 text-xs">
                {[["Help Center", "#"], ["Contact Us", "#"], ["Safety Tips", "#"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Payment</h4>
              <div className="text-xs text-white/50 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-pink-400" />
                  <span>Airtel Money: <strong className="text-white">0999626944</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-pink-400" />
                  <span>TNM Mpamba: <strong className="text-white">0888712272</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-500/10 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Powered by <span className="text-pink-400 font-bold">O-techy</span> · Premium marketplace for Malawi
            </p>
            <p className="text-xs text-white/20">© 2026 BlinkBuy Malawi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
