import { useState, useEffect } from "react";
import { getInstallPrompt, clearInstallPrompt } from "@/App";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  Home, Search, Settings, Sun, Moon, Plus,
  Menu, X, Download, ShoppingBag, ShieldCheck,
} from "lucide-react";


const TOP_NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [loc] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    // Show banner if install prompt already captured at app start
    if (getInstallPrompt()) setShowBanner(true);
    // Also listen for late arrival
    const handler = () => setShowBanner(true);
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setPageVisible(false);
    const t = setTimeout(() => setPageVisible(true), 80);
    setMenuOpen(false);
    return () => clearTimeout(t);
  }, [loc]);

  const handleInstall = async () => {
    const prompt = getInstallPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") { clearInstallPrompt(); setShowBanner(false); }
  };

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc === href || loc.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── PWA Install Banner ── */}
      {showBanner && (
        <div className="sticky top-0 z-[60] bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Download size={14} strokeWidth={2.5} className="shrink-0" />
            <span className="text-xs font-bold truncate">Install Market Hub Malawi on your phone</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstall}
              className="bg-white text-red-600 px-3 py-1 rounded-lg text-xs font-black hover:bg-red-50 transition-all"
            >
              Install
            </button>
            <button onClick={() => setShowBanner(false)} className="text-white/70 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f] text-white shadow-2xl border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                <img src="/icon.svg" alt="Market Hub Malawi" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-red-400 transition-colors">Market Hub</span>
                <span className="text-[10px] font-bold text-red-400 tracking-wider">MALAWI</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {TOP_NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "text-red-400 bg-red-500/15 border border-red-500/30"
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
                className="p-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-red-500/30"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Sell Button — desktop */}
              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-red-500/50"
              >
                <Plus size={14} strokeWidth={3} />
                Sell Item
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-white/10 hover:border-red-500/30"
              >
                {menuOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-red-500/20 bg-black/95 backdrop-blur-sm">
            <div className="px-4 py-4 flex flex-col gap-1">
              {TOP_NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "text-red-400 bg-red-500/20 border border-red-500/40"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <n.icon size={16} strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/post-item"
                className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 mt-2 shadow-lg"
              >
                <Plus size={16} strokeWidth={3} />
                Sell an Item
              </Link>
              {showBanner && (
                <button
                  onClick={() => { handleInstall(); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/30 mt-1"
                >
                  <Download size={16} />
                  Install App
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Page Content ── */}
      <main
        className="flex-1 pb-24 lg:pb-0"
        style={{ opacity: pageVisible ? 1 : 0, transition: "opacity 120ms ease" }}
      >
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0f0f0f] border-t border-red-500/20"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* 4-column grid: Home | Search | [SELL] | Settings — no empty 5th slot */}
        <div className="grid grid-cols-4 items-end h-16 px-2">

          {/* Home */}
          <NavItem href="/" label="Home" icon={Home} active={isActive("/")} />

          {/* Search */}
          <NavItem href="/marketplace" label="Search" icon={Search} active={isActive("/marketplace")} dataTour="nav-marketplace" />

          {/* CENTER SELL BUTTON — col 3 */}
          <div className="flex flex-col items-center justify-end pb-1" data-tour="nav-sell">
            <Link href="/post-item" className="flex flex-col items-center gap-0.5 group">
              <div className="relative -mt-7">
                <div className="absolute inset-0 rounded-full bg-red-500/30 blur-md scale-110" />
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-700 flex items-center justify-center shadow-xl shadow-red-500/50 border-4 border-[#0f0f0f] group-hover:scale-105 transition-transform duration-200">
                  <Plus size={26} strokeWidth={2.5} className="text-white" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-red-400 mt-1 leading-none">Sell</span>
            </Link>
          </div>

          {/* Settings */}
          <NavItem href="/settings" label="Settings" icon={Settings} active={isActive("/settings")} dataTour="nav-settings" />
        </div>
      </nav>

      {/* ── Desktop Footer ── */}
      <footer className="hidden lg:block border-t border-red-500/20">
        <div className="bg-[#0f0f0f] py-3 text-center">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/30 hover:text-red-400 transition-colors">
            <ShieldCheck size={12} /> Admin Dashboard
          </Link>
        </div>
        <div
          className="max-w-7xl mx-auto px-4 py-6 text-center bg-gradient-to-r from-red-600 to-red-500"
        >
          <p className="text-sm font-bold text-white">
            © {new Date().getFullYear()} Market Hub Malawi. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Reusable nav item ── */
function NavItem({
  href, label, icon: Icon, active, dataTour,
}: { href: string; label: string; icon: React.ElementType; active: boolean; dataTour?: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-end gap-0.5 pb-2 group" data-tour={dataTour}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
        active ? "bg-red-500/15" : "group-hover:bg-white/8"
      }`}>
        <Icon
          size={19}
          strokeWidth={active ? 2.5 : 1.8}
          className={active ? "text-red-400" : "text-white/40 group-hover:text-white/70"}
        />
      </div>
      <span className={`text-[9px] font-bold leading-none transition-colors ${
        active ? "text-red-400" : "text-white/35 group-hover:text-white/60"
      }`}>
        {label}
      </span>
      {active && <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5" />}
    </Link>
  );
}
