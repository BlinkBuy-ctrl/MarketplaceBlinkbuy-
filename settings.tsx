import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "wouter";
import {
  Sun, Moon, Bell, Shield, Info, ChevronRight, Store,
  Globe, HelpCircle, Star, Download, Smartphone, Heart, CheckCircle, Map,
  X, Mail, ThumbsUp, MapPin,
} from "lucide-react";
import { getInstallPrompt, clearInstallPrompt } from "@/App";
import airtelLogo from "@/assets/airtel.svg";
import tnmLogo from "@/assets/tnm.svg";

type InstallState = "prompt" | "installed" | "ios" | "unavailable";
type ModalKind = "help" | "about" | "rate" | null;
type HelpTopic = "Request" | "Query" | "Wish";

const SUPPORT_EMAIL = "otechy8@gmail.com";

// Free, no-signup shared counter — swap this out once Otechy has its own backend.
const LIKE_COUNTER_URL = "https://api.countapi.xyz";
const LIKE_NAMESPACE = "otechy-markethub-mw";
const LIKE_KEY = "app-likes";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [currency] = useState("MWK");
  const [language] = useState("English");
  const [installState, setInstallState] = useState<InstallState>("unavailable");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalKind>(null);

  // Help Center form
  const [helpTopic, setHelpTopic] = useState<HelpTopic>("Query");
  const [helpName, setHelpName] = useState("");
  const [helpMessage, setHelpMessage] = useState("");

  // Rate the App (single-click, shared count)
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(false);

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

  useEffect(() => {
    try {
      setHasLiked(localStorage.getItem("appLiked") === "true");
    } catch { /* ignore */ }

    // Fetch the shared, cross-user like count
    fetch(`${LIKE_COUNTER_URL}/get/${LIKE_NAMESPACE}/${LIKE_KEY}`)
      .then((r) => r.json())
      .then((data) => setLikeCount(typeof data?.value === "number" ? data.value : 0))
      .catch(() => setLikeError(true));
  }, []);

  const closeModal = () => setActiveModal(null);

  const handleLike = async () => {
    if (hasLiked || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`${LIKE_COUNTER_URL}/hit/${LIKE_NAMESPACE}/${LIKE_KEY}`);
      const data = await res.json();
      setLikeCount(typeof data?.value === "number" ? data.value : (likeCount ?? 0) + 1);
      localStorage.setItem("appLiked", "true");
      setHasLiked(true);
      setLikeError(false);
    } catch {
      setLikeError(true);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleHelpSubmit = () => {
    const subject = encodeURIComponent(`Market Hub Malawi — ${helpTopic} from ${helpName || "a user"}`);
    const body = encodeURIComponent(
      `Name: ${helpName || "(not provided)"}\nType: ${helpTopic}\n\nMessage:\n${helpMessage}`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

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
        {settingRow(<HelpCircle size={15} />, "Help Center", "Get help and FAQs", undefined, () => setActiveModal("help"))}
        {settingRow(<Shield size={15} />, "Safety Tips", "Stay safe when buying & selling", undefined, () => {
          document.getElementById("safety-tips-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        })}
        {settingRow(
          <Star size={15} />,
          "Rate the App",
          hasLiked
            ? `You liked this app · ${likeCount ?? "…"} total`
            : likeCount !== null ? `${likeCount} people like this app` : "Share your feedback",
          undefined,
          () => setActiveModal("rate")
        )}
        {settingRow(<Info size={15} />, "About", "Market Hub Malawi v1.0.0", undefined, () => setActiveModal("about"))}
      </>)}

      {/* Safety Tips */}
      <div id="safety-tips-section" className="mb-6 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4 scroll-mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-amber-500" />
          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Safety Tips for Buyers & Sellers</p>
        </div>
        <div className="flex items-start gap-2 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <MapPin size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-bold">Always meet in a public place.</span> Market Hub Malawi doesn't process any
            payment between buyers and sellers — this is intentional. Meeting up in public, well-lit locations
            (like a market, mall, or police post) protects both sides from robbery and scams that can happen
            when money and goods are exchanged in private or unfamiliar places.
          </p>
        </div>
        <ul className="space-y-2 text-xs text-amber-700 dark:text-amber-400">
          {[
            "Choose a busy, public, well-lit place to meet — never an isolated location",
            "If possible, bring a friend along or meet during daylight hours",
            "Inspect items thoroughly before paying anything",
            "Only exchange Airtel Money or TNM Mpamba in person, once you're satisfied with the item",
            "Never send money in advance to someone you haven't met",
            "Trust your instincts — if a deal or location feels wrong, walk away",
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

      {/* Modals */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between px-5 py-4 z-10">
              <h2 className="text-base font-black">
                {activeModal === "help" && "Help Center"}
                {activeModal === "about" && "About"}
                {activeModal === "rate" && "Rate the App"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              {/* Help Center content */}
              {activeModal === "help" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Got a request, a question, or an idea for us? Fill this in and we'll open your email app so you
                    can send it straight to <span className="font-semibold text-foreground">{SUPPORT_EMAIL}</span>.
                  </p>

                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">What's this about?</p>
                    <div className="flex gap-2">
                      {(["Request", "Query", "Wish"] as HelpTopic[]).map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setHelpTopic(topic)}
                          className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-colors ${
                            helpTopic === topic
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-muted/50 text-muted-foreground border-border hover:bg-red-500/5"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Your name (optional)</p>
                    <input
                      value={helpName}
                      onChange={(e) => setHelpName(e.target.value)}
                      placeholder="e.g. Elisha"
                      className="w-full text-sm bg-muted/50 border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Your {helpTopic.toLowerCase()}
                    </p>
                    <textarea
                      value={helpMessage}
                      onChange={(e) => setHelpMessage(e.target.value)}
                      placeholder={`Tell us about your ${helpTopic.toLowerCase()}...`}
                      rows={4}
                      className="w-full text-sm bg-muted/50 border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    />
                  </div>

                  <button
                    onClick={handleHelpSubmit}
                    disabled={!helpMessage.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-bold px-4 py-3 rounded-xl transition-all shadow-md shadow-red-500/30 active:scale-95"
                  >
                    <Mail size={15} /> Open Email to {SUPPORT_EMAIL}
                  </button>
                </div>
              )}

              {/* About content */}
              {activeModal === "about" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg shadow-red-500/30">
                      <img src="/icon.svg" alt="Market Hub Malawi" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-black text-base">Market Hub Malawi</p>
                    <p className="text-xs text-muted-foreground mt-0.5">by Otechy · Version 1.0.0</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1.5">Our story</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Otechy is a Malawian company on a mission to digitalize Malawi in line with Vision 2063 —
                      building smooth, reliable digital services for people across Malawi and around the globe.
                      Market Hub Malawi is one step in that journey: a simple, trustworthy way for Malawians to
                      buy and sell with each other.
                    </p>
                  </div>
                  <div className="border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
                    <p>Built for Malawi 🇲🇼</p>
                    <p>© {new Date().getFullYear()} Otechy. All rights reserved.</p>
                  </div>
                </div>
              )}

              {/* Rate the App content */}
              {activeModal === "rate" && (
                <div className="text-center py-2 space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Tap once to show your support. Your click adds to the total count everyone sees.
                  </p>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleLike}
                      disabled={hasLiked || likeLoading}
                      className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all active:scale-95 ${
                        hasLiked
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                      } disabled:pointer-events-none`}
                    >
                      <ThumbsUp size={28} className={hasLiked ? "fill-white" : ""} />
                    </button>
                    <p className="text-2xl font-black mt-1">
                      {likeCount !== null ? likeCount.toLocaleString() : "…"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {likeCount === 1 ? "person likes" : "people like"} Market Hub Malawi
                    </p>
                  </div>

                  {hasLiked && (
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle size={15} />
                      <p className="text-xs font-bold">Thanks for your support!</p>
                    </div>
                  )}

                  {likeError && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Couldn't reach the counter right now — please check your connection and try again.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
