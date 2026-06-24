import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingBag, Home, Search, Settings, Sun, Moon, Plus, Store,
  Menu, X, Download, MessageCircle,
} from "lucide-react";

const NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Messages",    href: "/messages",    icon: MessageCircle },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

const BOTTOM_NAV = [
  { label: "Home",      href: "/",            icon: Home },
  { label: "Search",    href: "/marketplace", icon: Search },
  { label: "Sell",      href: "/post-item",   icon: Plus,   isAction: true },
  { label: "Messages",  href: "/messages",    icon: MessageCircle },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setPageVisible(false);
    const t = setTimeout(() => setPageVisible(true), 80);
    setOpen(false);
    return () => clearTimeout(t);
  }, [loc]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstallBanner(false);
  };

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc === href || loc.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="sticky top-0 z-[60] bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Download size={15} strokeWidth={2.5} />
            <span className="text-xs font-bold">Install Marketplace on your phone</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-pink-600 px-3 py-1 rounded-lg text-xs font-black hover:bg-pink-50 transition-all"
            >
              Install
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="text-white/70 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER - Deep Space Theme */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0e27]/95 to-[#0f1a35]/95 dark:from-[#0a0e27]/95 dark:to-[#0f1a35]/95 text-white shadow-2xl border-b border-pink-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-lg shadow-pink-500/40 group-hover:shadow-pink-500/60 transition-all duration-300 transform group-hover:scale-110">
                <Store size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-pink-300 transition-colors">Marketplace</span>
                <span className="text-[10px] font-bold text-pink-400 tracking-wider">MALAWI</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                      active
                        ? "text-pink-300 bg-pink-500/20 border border-pink-500/40 shadow-lg shadow-pink-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
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
                className="p-2.5 text-white/60 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition-all duration-300 border border-white/10 hover:border-pink-500/40 transform hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-pink-500/20"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Sell Button - Floating Effect */}
              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60 border border-pink-400/30 transform hover:-translate-y-1 active:translate-y-0"
              >
                <Plus size={14} strokeWidth={3} />
                <span>Sell Item</span>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2.5 text-white/60 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition-all border border-white/10 hover:border-pink-500/40 transform hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-pink-500/20"
              >
                {open ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="lg:hidden border-t border-pink-500/20 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm">
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                      active
                        ? "text-pink-300 bg-pink-500/25 border border-pink-500/50 shadow-lg shadow-pink-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
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
                className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all mt-2 shadow-lg shadow-pink-500/40 transform hover:-translate-y-1 active:translate-y-0"
                onClick={() => setOpen(false)}
              >
                <Plus size={16} strokeWidth={3} />
                Sell an Item
              </Link>
              {installPrompt && (
                <button
                  onClick={() => { handleInstall(); setOpen(false); }}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-pink-300 bg-pink-500/15 border border-pink-500/40 transition-all mt-1 transform hover:-translate-y-1 shadow-lg shadow-pink-500/10"
                >
                  <Download size={16} />
                  Install App
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main
        className="flex-1 pb-20 lg:pb-0"
        style={{ opacity: pageVisible ? 1 : 0, transition: "opacity 120ms ease" }}
      >
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION - Deep Space Theme */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-[#0a0e27]/95 to-[#0f1a35]/95 dark:from-[#0a0e27]/95 dark:to-[#0f1a35]/95 border-t border-pink-500/20 backdrop-blur-md">
        <div className="flex items-center justify-around h-16 px-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {BOTTOM_NAV.map(n => {
            const active = isActive(n.href) && !n.isAction;
            if (n.isAction) {
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className="flex flex-col items-center justify-center -mt-6 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-xl shadow-pink-500/50 border-4 border-[#0a0e27] hover:shadow-pink-500/70 transition-all duration-300 transform hover:scale-110">
                    <n.icon size={22} strokeWidth={2.5} className="text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-pink-400 mt-1">Sell</span>
                </Link>
              );
            }
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 flex-1 transform hover:-translate-y-1 ${
                  active ? "text-pink-400 shadow-lg shadow-pink-500/20" : "text-white/40 hover:text-white/70 hover:shadow-lg hover:shadow-pink-500/10"
                }`}
              >
                <n.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-semibold whitespace-nowrap leading-none">{n.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* DESKTOP FOOTER - Deep Space Theme */}
      <footer className="hidden lg:block bg-gradient-to-b from-[#0f1a35]/80 to-[#0a0e27]/95 dark:from-[#0f1a35]/80 dark:to-[#0a0e27]/95 text-white/70 border-t border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Store size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-black text-white text-base block">Marketplace</span>
                  <span className="text-xs text-pink-400 font-bold">MALAWI</span>
                </div>
              </div>
              <p className="text-xs text-white/45 leading-relaxed">
                Malawi's premium local marketplace. Buy and sell goods across all 28 districts with confidence.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Marketplace</h4>
              <div className="space-y-2.5 text-xs">
                {[["Browse All", "/marketplace"], ["Sell an Item", "/post-item"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Support</h4>
              <div className="space-y-2.5 text-xs">
                {[["Help Center", "/settings"], ["Safety Tips", "/settings"]].map(([l, h]) => (
                  <Link key={l} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Payment</h4>
              <div className="text-xs text-white/50 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                  <span>Airtel Money accepted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                  <span>TNM Mpamba accepted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-500/10 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/30">Marketplace Malawi · Connecting buyers & sellers</p>
            <p className="text-xs text-white/20">© 2026 Marketplace Malawi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
