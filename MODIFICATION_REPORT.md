# MarketplaceBlinkbuy Modification Report

## Overview
This report details the visual overhaul and architectural modifications applied to the MarketplaceBlinkbuy application. The application has been updated to feature a deep space aesthetic, and an analysis of the authentication flow was conducted.

---

## 1. Visual & Styling Overhaul
The application's global and component styling has been modified to reflect a deep space aesthetic.

* **Background (The Vast Space):** Implemented a deep, immersive space background using CSS gradients and radial gradients. Added animated twinkling stars and a realistic glowing moon in the top-right corner.
* **Buttons (Floating Effect):** Updated all primary, secondary, and outline buttons with layered box-shadows to create a floating effect. Added smooth hover transitions that translate the buttons slightly upwards on the Y-axis.
* **Theme Default:** Updated the theme hook to default to dark mode, ensuring the cosmic aesthetic is the primary experience.

---

## 2. Functional Modifications (Auth Removal)
After a thorough analysis of the codebase (including `App.tsx`, `main.tsx`, and all routing logic), it was determined that **the application currently does not have any login, sign-up, or onboarding authentication screens**. 

The application already boots directly into the main landing page (`HomePage`) without any authentication guards or redirects. Therefore, no code removal was necessary for this requirement, as the desired behavior is already the default state of the application.

---

## 3. Modified Files Summary

| File Name | Folder Location / Path | Description of Changes Made |
| :--- | :--- | :--- |
| `index.css` | `/src/` | Applied deep space background, animated stars, glowing moon, and floating button styles with hover transitions. |
| `Layout.tsx` | `/src/components/` | Updated header and footer with deep space gradients, enhanced shadow effects, and floating animations for navigation elements. |
| `useTheme.ts` | `/src/hooks/` | Changed the default theme state from "light" to "dark" to ensure the space aesthetic is active by default. |

---

## 4. Updated Code Blocks

### 1. `/src/index.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-card-border: hsl(var(--card-border));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --font-sans: var(--app-font-sans);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  /* Deep Space Theme - Dark Mode Default */
  --background: 240 10% 5%;
  --foreground: 0 0% 95%;
  --border: 240 15% 20%;
  --card: 240 10% 10%;
  --card-foreground: 0 0% 95%;
  --card-border: 320 100% 35%;
  --primary: 320 100% 55%;
  --primary-foreground: 0 0% 100%;
  --muted: 240 10% 25%;
  --muted-foreground: 0 0% 65%;
  --destructive: 0 70% 50%;
  --destructive-foreground: 0 0% 100%;
  --input: 240 10% 15%;
  --ring: 320 100% 55%;
  --app-font-sans: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --radius: 0.75rem;
  --shadow-sm: 0px 4px 12px 0px rgba(0, 0, 0, 0.60);
  --shadow-md: 0px 8px 24px 0px rgba(0, 0, 0, 0.70);
  --shadow-lg: 0px 16px 40px 0px rgba(0, 0, 0, 0.80);
  --shadow-pink: 0px 12px 32px 0px rgba(230, 25, 150, 0.40);
}

.dark {
  /* Deep Space Theme - Cosmic Enhancements */
  --background: 240 10% 5%;
  --foreground: 0 0% 95%;
  --border: 240 15% 20%;
  --card: 240 10% 10%;
  --card-foreground: 0 0% 95%;
  --card-border: 320 100% 35%;
  --primary: 320 100% 55%;
  --primary-foreground: 0 0% 100%;
  --muted: 240 10% 25%;
  --muted-foreground: 0 0% 65%;
  --destructive: 0 70% 50%;
  --destructive-foreground: 0 0% 100%;
  --input: 240 10% 15%;
  --ring: 320 100% 55%;
  --shadow-sm: 0px 4px 12px 0px rgba(0, 0, 0, 0.60);
  --shadow-md: 0px 8px 24px 0px rgba(0, 0, 0, 0.70);
  --shadow-lg: 0px 16px 40px 0px rgba(0, 0, 0, 0.80);
  --shadow-pink: 0px 12px 32px 0px rgba(230, 25, 150, 0.40);
}

@layer base {
  * { 
    box-sizing: border-box; 
    border-color: hsl(var(--border)); 
  }
  
  body {
    font-family: var(--app-font-sans);
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    overscroll-behavior-y: none;
  }
}

/* ===== DEEP SPACE BACKGROUND ===== */
html {
  background: linear-gradient(135deg, #0a0e27 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0a0e27 100%);
  position: relative;
}

html::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
}

/* Starfield Effect */
html::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0)),
    radial-gradient(2px 2px at 60px 70px, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0)),
    radial-gradient(1px 1px at 50px 50px, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0)),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
    radial-gradient(2px 2px at 90px 10px, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)),
    radial-gradient(1px 1px at 130px 130px, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0)),
    radial-gradient(2px 2px at 10px 90px, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
  background-size: 200px 200px;
  background-position: 0 0, 40px 60px, 130px 270px, 70px 100px, 100px 50px, 90px 10px, 130px 130px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: -1;
  opacity: 0.8;
  animation: twinkleStar 8s ease-in-out infinite;
}

/* Moon Element */
@keyframes moonGlow {
  0%, 100% {
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(200, 200, 255, 0.15);
  }
  50% {
    box-shadow: 0 0 80px rgba(255, 255, 255, 0.4), 0 0 120px rgba(200, 200, 255, 0.2);
  }
}

@keyframes twinkleStar {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

/* Moon positioned in top-right corner */
body::before {
  content: '';
  position: fixed;
  top: 40px;
  right: 40px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), rgba(200, 200, 220, 0.7) 30%, rgba(150, 150, 180, 0.5) 60%, rgba(100, 100, 150, 0.3) 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.3), 0 0 100px rgba(200, 200, 255, 0.15);
  animation: moonGlow 6s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

/* Moon craters for realism */
body::after {
  content: '';
  position: fixed;
  top: 40px;
  right: 40px;
  width: 120px;
  height: 120px;
  background: 
    radial-gradient(circle at 30% 30%, rgba(100, 100, 150, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 60% 50%, rgba(100, 100, 150, 0.3) 0%, transparent 35%),
    radial-gradient(circle at 40% 70%, rgba(100, 100, 150, 0.25) 0%, transparent 30%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}

/* Premium Inputs */
select {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  cursor: pointer;
}

select option {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

input, textarea {
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
}

input:focus, textarea:focus {
  border-color: hsl(var(--primary)) !important;
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.08);
}

/* ===== FLOATING BUTTON EFFECTS ===== */
button, a[href] {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active, a[href]:active {
  transform: scale(0.96);
  opacity: 0.85;
}

/* Floating Primary Button */
.btn-primary {
  @apply bg-primary text-primary-foreground font-bold px-4 py-2.5 rounded-xl transition-all duration-300;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(230, 25, 150, 0.2);
  position: relative;
}

.btn-primary:hover {
  @apply opacity-95;
  transform: translateY(-3px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    0 12px 24px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(230, 25, 150, 0.4);
}

.btn-primary:active {
  transform: translateY(-1px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 6px 12px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(230, 25, 150, 0.2);
}

/* Floating Secondary Button */
.btn-secondary {
  @apply border-2 border-primary text-primary px-4 py-2.5 rounded-xl font-bold transition-all duration-300;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(230, 25, 150, 0.15);
}

.btn-secondary:hover {
  @apply bg-primary/10;
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(230, 25, 150, 0.3);
}

/* Floating Outline Button */
.btn-outline {
  @apply border border-border text-foreground px-4 py-2.5 rounded-xl font-medium transition-all duration-300;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.btn-outline:hover {
  @apply border-primary text-primary bg-primary/5;
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(230, 25, 150, 0.2);
}

/* Global floating effect for all buttons and links */
button:not(.btn-primary):not(.btn-secondary):not(.btn-outline),
a[href]:not(.btn-primary):not(.btn-secondary):not(.btn-outline) {
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(230, 25, 150, 0.1);
}

button:not(.btn-primary):not(.btn-secondary):not(.btn-outline):hover,
a[href]:not(.btn-primary):not(.btn-secondary):not(.btn-outline):hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(230, 25, 150, 0.2);
}

/* Card Hover Animation */
.card-hover { 
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s ease;
}

.card-hover:hover { 
  transform: translateY(-6px);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(230, 25, 150, 0.3);
  border-color: hsl(var(--primary));
}

/* Scrollbar Styling */
::-webkit-scrollbar { 
  width: 6px; 
  height: 6px; 
}

::-webkit-scrollbar-track { 
  background: hsl(var(--background)); 
}

::-webkit-scrollbar-thumb { 
  background: hsl(var(--primary));
  border-radius: 99px;
  opacity: 0.5;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

/* Text Wrapping */
p, span, div, h1, h2, h3, h4, h5, h6, li {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Page Animations */
@keyframes pageFadeIn {
  from { 
    opacity: 0; 
    transform: translateY(12px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.page-enter {
  animation: pageFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Pink Glow Effect */
@keyframes pinkGlow {
  0%, 100% {
    box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
  }
  50% {
    box-shadow: 0 0 30px hsl(var(--primary) / 0.5);
  }
}

.glow-pink {
  animation: pinkGlow 3s ease-in-out infinite;
}

/* Premium Badge */
.badge-featured {
  @apply inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
  color: hsl(var(--primary-foreground));
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(230, 25, 150, 0.2);
}

.badge-new {
  @apply inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold;
  background: linear-gradient(135deg, hsl(320 100% 50%), hsl(320 100% 45%));
  color: white;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(230, 25, 150, 0.2);
}

/* Safe area inset for mobile */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .fixed.bottom-0 {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Filter Chip Animation */
.filter-chip {
  @apply inline-block px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer;
  border: 1px solid hsl(var(--border));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.filter-chip:hover, .filter-chip.active {
  border-color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  transform: translateY(-1px);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(230, 25, 150, 0.2);
}

/* Luxury Text Gradient */
.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, hsl(var(--primary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading Spinner - Pink */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-pink {
  width: 20px;
  height: 20px;
  border: 3px solid hsl(var(--primary) / 0.2);
  border-top-color: hsl(var(--primary));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Exclusive Section */
.exclusive-section {
  @apply relative overflow-hidden rounded-2xl;
  background: linear-gradient(135deg, #0a0e27 0%, #1a0a2e 100%);
}

.exclusive-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%);
  pointer-events: none;
}
```

### 2. `/src/components/Layout.tsx`

```tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingBag, Home, Search, Settings, Sun, Moon, Plus, Store,
  Menu, X, Download,
} from "lucide-react";

const NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

const BOTTOM_NAV = [
  { label: "Home",      href: "/",            icon: Home },
  { label: "Search",    href: "/marketplace", icon: Search },
  { label: "Sell",      href: "/post-item",   icon: Plus,   isAction: true },
  { label: "Settings",  href: "/settings",    icon: Settings },
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
```

### 3. `/src/hooks/useTheme.ts`

```typescript
import { useState, useEffect } from "react";

const KEY = "marketplace_theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as "light" | "dark") || "dark";
    setThemeState(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    localStorage.setItem(KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return { theme, toggleTheme };
}
```
