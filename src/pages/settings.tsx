import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "wouter";
import {
  Sun, Moon, Bell, Shield, Info, ChevronRight, Store,
  Globe, HelpCircle, Star, Download, Smartphone, Heart,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [currency] = useState("MWK");
  const [language] = useState("English");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Capture PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Load wishlist count
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(saved.length);
    } catch { setWishlistCount(0); }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstallPrompt(null);
  };

  const settingSection = (title: string, children: React.ReactNode) => (
    <div className="mb-6">
      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-card border border-pink-500/15 rounded-2xl overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );

  const settingRow = (
    icon: React.ReactNode,
    label: string,
    value?: string,
    action?: React.ReactNode,
    onClick?: () => void,
  ) => (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? "cursor-pointer hover:bg-pink-500/5 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {value && <p className="text-xs text-muted-foreground">{value}</p>}
      </div>
      {action || (onClick && <ChevronRight size={15} className="text-muted-foreground shrink-0" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Customize your marketplace experience</p>
      </div>

      {/* Appearance */}
      {settingSection("Appearance", <>
        {settingRow(
          theme === "dark" ? <Moon size={15} /> : <Sun size={15} />,
          "Theme",
          theme === "dark" ? "Dark mode" : "Light mode",
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-pink-500" : "bg-muted border border-border"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${theme === "dark" ? "left-5.5 translate-x-0" : "left-0.5"}`} />
          </button>
        )}
        {settingRow(<Globe size={15} />, "Language", language, <span className="text-xs text-muted-foreground font-medium">{language}</span>)}
        {settingRow(<Store size={15} />, "Currency", "Malawian Kwacha", <span className="text-xs font-bold text-pink-500">{currency}</span>)}
      </>)}

      {/* Notifications */}
      {settingSection("Notifications", <>
        {settingRow(
          <Bell size={15} />,
          "Push Notifications",
          notifications ? "Enabled" : "Disabled",
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifications ? "bg-pink-500" : "bg-muted border border-border"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${notifications ? "left-5.5 translate-x-0" : "left-0.5"}`} />
          </button>
        )}
      </>)}

      {/* App */}
      {settingSection("App", <>
        {settingRow(
          <Smartphone size={15} />,
          "Install App",
          installPrompt ? "Tap to install on your home screen" : "Already installed or not available",
          undefined,
          installPrompt ? () => handleInstall() : undefined
        )}
        {settingRow(
          <Heart size={15} />,
          "Saved Items",
          `${wishlistCount} item${wishlistCount !== 1 ? "s" : ""} saved`,
          <Link href="/marketplace" className="text-xs text-pink-500 font-bold hover:text-pink-600 transition-colors">Browse →</Link>
        )}
        {settingRow(
          <Download size={15} />,
          "App Version",
          "Version 1.0.0",
          <span className="text-xs text-green-600 font-bold">Up to date ✓</span>
        )}
      </>)}

      {/* Support */}
      {settingSection("Support & Info", <>
        {settingRow(<HelpCircle size={15} />, "Help Center", "Get help and FAQs", undefined, () => {})}
        {settingRow(<Shield size={15} />, "Safety Tips", "Stay safe when buying & selling", undefined, () => {})}
        {settingRow(<Star size={15} />, "Rate the App", "Share your feedback", undefined, () => {})}
        {settingRow(<Info size={15} />, "About", "Marketplace Malawi v1.0.0", undefined, () => {})}
      </>)}

      {/* Safety Tips expanded */}
      <div className="mb-6 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-amber-500" />
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Safety Tips for Buyers & Sellers</p>
        </div>
        <ul className="space-y-2 text-xs text-amber-700 dark:text-amber-400">
          {[
            "Always meet in a public, well-lit place",
            "Inspect items thoroughly before paying",
            "Use Airtel Money or TNM Mpamba for safe payments",
            "Never send money in advance to unknown sellers",
            "Trust your instincts — if it seems too good to be true, be cautious",
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Info */}
      {settingSection("Payment Methods", <>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/5 border border-pink-500/15">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-sm font-bold text-red-500 shrink-0">A</div>
            <div>
              <p className="text-sm font-bold">Airtel Money</p>
              <p className="text-xs text-muted-foreground">Widely accepted across Malawi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-500/5 border border-pink-500/15">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-500 shrink-0">T</div>
            <div>
              <p className="text-sm font-bold">TNM Mpamba</p>
              <p className="text-xs text-muted-foreground">Fast and reliable mobile money</p>
            </div>
          </div>
        </div>
      </>)}

      {/* App Info */}
      <div className="text-center mt-8 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-pink-500/30">
          <Store size={22} className="text-white" />
        </div>
        <p className="font-black text-base">Marketplace Malawi</p>
        <p className="text-xs text-muted-foreground mt-1">Version 1.0.0 · Built for Malawi 🇲🇼</p>
        <p className="text-xs text-muted-foreground mt-1">Connecting buyers &amp; sellers across all 28 districts</p>
      </div>
    </div>
  );
}
