import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "wouter";
import {
  Sun, Moon, Bell, Shield, Info, ChevronRight, Store,
  Globe, HelpCircle, Star, Download, Smartphone, Heart, CheckCircle, Map,
  X, Send, Mail,
} from "lucide-react";
import { getInstallPrompt, clearInstallPrompt } from "@/App";
import airtelLogo from "@/assets/airtel.svg";
import tnmLogo from "@/assets/tnm.svg";

const HELP_CENTER_EMAIL = "otechy8@gmail.com";
const ABOUT_TEXT =
  "OTECHY IS ONE OF THE MALAWIAN DIGITAL COMPANY WHICH AIMS AT DIGITALIZING MALAWI TOWARDS ITS VISION 2063.";

type InstallState = "prompt" | "installed" | "ios" | "unavailable";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [currency] = useState("MWK");
  const [language] = useState("English");
  const [installState, setInstallState] = useState<InstallState>("unavailable");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [helpName, setHelpName] = useState("");
  const [helpEmail, setHelpEmail] = useState("");
  const [helpSubject, setHelpSubject] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpSent, setHelpSent] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) { setInstallState("installed"); return; }

    // iOS — no beforeinstallprompt, show manual steps
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) { setInstallState("ios"); return; }

    // Prompt already captured at app start
    if (getInstallPrompt()) { setInstallState("prompt"); return; }

    // Still waiting — listen for late arrival
    const onPrompt = () => setInstallState("prompt");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstallState("installed"));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(saved.length);
    } catch { setWishlistCount(0); }
  }, []);

  const handleInstall = async () => {
    const prompt = getInstallPrompt();
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      clearInstallPrompt();
      setInstallState("installed");
    }
  };

  const handleSendQuery = () => {
    const subject = encodeURIComponent(helpSubject || "Otechy MW – Support Query");
    const bodyLines = [
      `Name: ${helpName || "-"}`,
      `Email: ${helpEmail || "-"}`,
      "",
      helpMessage || "",
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:${HELP_CENTER_EMAIL}?subject=${subject}&body=${body}`;
    setHelpSent(true);
  };

  const closeHelpCenter = () => {
    setShowHelpCenter(false);
    setHelpSent(false);
    setHelpName("");
    setHelpEmail("");
    setHelpSubject("");
    setHelpMessage("");
  };

  const settingSection = (title: string, children: React.ReactNode) => (
    <div className="mb-6">
      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-card border border-red-500/15 rounded-2xl overflow-hidden divide-y divide-border">
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
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? "cursor-pointer hover:bg-red-500/5 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-500">
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
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-red-500" : "bg-muted border border-border"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${theme === "dark" ? "left-5.5 translate-x-0" : "left-0.5"}`} />
          </button>
        )}
        {settingRow(<Globe size={15} />, "Language", language, <span className="text-xs text-muted-foreground font-medium">{language}</span>)}
        {settingRow(<Store size={15} />, "Currency", "Malawian Kwacha", <span className="text-xs font-bold text-red-500">{currency}</span>)}
      </>)}

      {/* Notifications */}
      {settingSection("Notifications", <>
        {settingRow(
          <Bell size={15} />,
          "Push Notifications",
          notifications ? "Enabled" : "Disabled",
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifications ? "bg-red-500" : "bg-muted border border-border"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${notifications ? "left-5.5 translate-x-0" : "left-0.5"}`} />
          </button>
        )}
      </>)}

      {/* App */}
      {settingSection("App", <>
        {/* Install card */}
        <div className="px-4 py-4">
          {installState === "installed" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/25">
              <CheckCircle size={18} className="text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">App Installed</p>
                <p className="text-xs text-muted-foreground">You're using the installed version</p>
              </div>
            </div>
          )}
          {installState === "prompt" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/8 border border-red-500/25">
              <Smartphone size={18} className="text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Install App</p>
                <p className="text-xs text-muted-foreground">Add to your home screen for the best experience</p>
              </div>
              <button
                onClick={handleInstall}
                className="shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-red-500/30 active:scale-95"
              >
                Install
              </button>
            </div>
          )}
          {installState === "ios" && (
            <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/25 space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-red-500 shrink-0" />
                <p className="text-sm font-bold">Install on iPhone / iPad</p>
              </div>
              <ol className="text-xs text-muted-foreground space-y-1 pl-1">
                <li>1. Tap the <span className="font-bold text-foreground">Share</span> button in Safari</li>
                <li>2. Tap <span className="font-bold text-foreground">Add to Home Screen</span></li>
                <li>3. Tap <span className="font-bold text-foreground">Add</span> to confirm</li>
              </ol>
            </div>
          )}
          {installState === "unavailable" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <Download size={16} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Install App</p>
                <p className="text-xs text-muted-foreground">Open in Chrome on Android to install</p>
              </div>
            </div>
          )}
        </div>
        {settingRow(
          <Heart size={15} />,
          "Saved Items",
          `${wishlistCount} item${wishlistCount !== 1 ? "s" : ""} saved`,
          <Link href="/marketplace" className="text-xs text-red-500 font-bold hover:text-red-600 transition-colors">Browse →</Link>
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
        {settingRow(<Map size={15} />, "Buyer–Seller Coverage Map", "See where listings are relative to you", undefined, () => setLocation("/map"))}
        {settingRow(<HelpCircle size={15} />, "Help Center", "Get help and FAQs", undefined, () => setShowHelpCenter(true))}
        {settingRow(<Shield size={15} />, "Safety Tips", "Stay safe when buying & selling", undefined, () => {})}
        {settingRow(<Star size={15} />, "Rate the App", "Share your feedback", undefined, () => {})}
        {settingRow(<Info size={15} />, "About", "Otechy MW v1.0.0", undefined, () => setShowAbout(true))}
      </>)}

      {/* Safety Tips */}
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

      {/* Payment Methods */}
      {settingSection("Payment Methods", <>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
              <img src={airtelLogo} alt="Airtel Money" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold">Airtel Money</p>
              <p className="text-xs text-muted-foreground">Widely accepted across Malawi</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
              <img src={tnmLogo} alt="TNM Mpamba" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold">TNM Mpamba</p>
              <p className="text-xs text-muted-foreground">Fast and reliable mobile money</p>
            </div>
          </div>
        </div>
      </>)}

      {/* App Info */}
      <div className="text-center mt-8 mb-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg shadow-red-500/30">
          <img src="/icon.svg" alt="Market Hub Malawi" className="w-full h-full object-cover" />
        </div>
        <p className="font-black text-base">Market Hub Malawi</p>
        <p className="text-xs text-muted-foreground mt-1">Version 1.0.0 · Built for Malawi 🇲🇼</p>
        <p className="text-xs text-muted-foreground mt-1">Connecting buyers &amp; sellers across all 28 districts</p>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center px-4 bg-black/60"
          onClick={() => setShowAbout(false)}
        >
          <div
            className="w-full max-w-sm bg-card border border-red-500/20 rounded-2xl shadow-2xl shadow-red-500/10 p-6 animate-[fadeInScale_0.25s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Info size={15} />
                </div>
                <p className="font-black text-base">About</p>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{ABOUT_TEXT}</p>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-5 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-500/30 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpCenter && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center px-4 bg-black/60"
          onClick={closeHelpCenter}
        >
          <div
            className="w-full max-w-sm bg-card border border-red-500/20 rounded-2xl shadow-2xl shadow-red-500/10 p-6 animate-[fadeInScale_0.25s_ease] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <HelpCircle size={15} />
                </div>
                <p className="font-black text-base">Help Center</p>
              </div>
              <button
                onClick={closeHelpCenter}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {helpSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={22} className="text-green-500" />
                </div>
                <p className="text-sm font-bold mb-1">Your email app should now be open</p>
                <p className="text-xs text-muted-foreground">
                  Send it to reach us at <span className="font-semibold text-foreground">{HELP_CENTER_EMAIL}</span>
                </p>
                <button
                  onClick={closeHelpCenter}
                  className="mt-5 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-500/30 active:scale-95"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Mail size={13} className="shrink-0" />
                  Your query will be sent to {HELP_CENTER_EMAIL}
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Your Name</label>
                    <input
                      type="text"
                      value={helpName}
                      onChange={(e) => setHelpName(e.target.value)}
                      placeholder="e.g. Chisomo Banda"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Your Email</label>
                    <input
                      type="email"
                      value={helpEmail}
                      onChange={(e) => setHelpEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Subject</label>
                    <input
                      type="text"
                      value={helpSubject}
                      onChange={(e) => setHelpSubject(e.target.value)}
                      placeholder="What is this about?"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Your Query</label>
                    <textarea
                      value={helpMessage}
                      onChange={(e) => setHelpMessage(e.target.value)}
                      placeholder="Describe your question or issue..."
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/40"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendQuery}
                  disabled={!helpMessage.trim()}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-red-500/30 active:scale-95"
                >
                  <Send size={14} />
                  Send Query
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
