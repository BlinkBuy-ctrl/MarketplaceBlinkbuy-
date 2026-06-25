import { useState, useEffect, useRef, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const STORAGE_KEY = "onboarding_done";

interface Step {
  target: string;           // CSS selector of the element to highlight
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  mobilePosition?: "top" | "bottom" | "left" | "right" | "center";
}

const STEPS: Step[] = [
  {
    target: "",
    title: "Welcome to Marketplace Malawi! 🇲🇼",
    description: "Your one-stop local marketplace to buy and sell across all 28 districts. Let us show you around — it only takes a minute!",
    position: "center",
  },
  {
    target: "[data-tour='hero-search']",
    title: "Search for Anything 🔍",
    description: "Type what you're looking for — phones, furniture, clothes, food and more. Hit Search to browse results instantly.",
    position: "bottom",
  },
  {
    target: "[data-tour='categories']",
    title: "Browse by Category 🛍️",
    description: "Tap any category to filter listings — Electronics, Phones, Clothing, Farm Produce and more. Find exactly what you need.",
    position: "bottom",
    mobilePosition: "top",
  },
  {
    target: "[data-tour='featured']",
    title: "Featured Listings ⭐",
    description: "These are handpicked premium items. Tap any card to see full details, photos, price and seller contact info.",
    position: "top",
    mobilePosition: "top",
  },
  {
    target: "[data-tour='nav-marketplace']",
    title: "The Marketplace 🏪",
    description: "Browse all listings with powerful filters — search by category, district, price and condition.",
    position: "bottom",
    mobilePosition: "top",
  },
  {
    target: "[data-tour='nav-sell']",
    title: "Start Selling! 💸",
    description: "Tap this button to list your item. Add photos, set your price, pick your location and reach buyers across Malawi in minutes.",
    position: "top",
    mobilePosition: "top",
  },
  {
    target: "[data-tour='nav-settings']",
    title: "Settings & Preferences ⚙️",
    description: "Switch between dark and light mode, manage notifications, view payment methods and more.",
    position: "bottom",
    mobilePosition: "top",
  },
];

interface Rect {
  top: number; left: number; width: number; height: number;
}

function getTargetRect(selector: string): Rect | null {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

const PADDING = 10;

export default function OnboardingTour() {
  const [done, setDone] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const current = STEPS[step];

  const computeLayout = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const r = getTargetRect(current.target);
    setRect(r);

    if (!r) return; // center — handled by CSS

    const tooltip = tooltipRef.current;
    const tw = tooltip?.offsetWidth || 300;
    const th = tooltip?.offsetHeight || 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const pos = mobile ? (current.mobilePosition || current.position) : current.position;

    let top = 0, left = 0;

    if (pos === "bottom") {
      top = r.top + r.height + PADDING + window.scrollY;
      left = r.left + r.width / 2 - tw / 2;
    } else if (pos === "top") {
      top = r.top - th - PADDING + window.scrollY;
      left = r.left + r.width / 2 - tw / 2;
    } else if (pos === "left") {
      top = r.top + r.height / 2 - th / 2 + window.scrollY;
      left = r.left - tw - PADDING;
    } else if (pos === "right") {
      top = r.top + r.height / 2 - th / 2 + window.scrollY;
      left = r.left + r.width + PADDING;
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, vw - tw - 12));
    top = Math.max(12 + window.scrollY, top);

    setTooltipPos({ top, left });
  }, [current]);

  useEffect(() => {
    if (done) return;
    // Scroll target into view
    if (current.target) {
      const el = document.querySelector(current.target);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Small delay so scroll + render settle
    const t = setTimeout(computeLayout, 350);
    return () => clearTimeout(t);
  }, [step, done, computeLayout]);

  useEffect(() => {
    if (done) return;
    window.addEventListener("resize", computeLayout);
    return () => window.removeEventListener("resize", computeLayout);
  }, [done, computeLayout]);

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setDone(true);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finish();
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  if (done) return null;

  const isCenter = !current.target;
  const isLast = step === STEPS.length - 1;
  const pos = isMobile ? (current.mobilePosition || current.position) : current.position;

  // Arrow direction (points toward the target)
  const arrowClass: Record<string, string> = {
    bottom: "before:top-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-b-[7px] before:border-b-[#1a0a1a] before:border-x-[7px] before:border-x-transparent before:border-t-0",
    top: "before:bottom-[-7px] before:left-1/2 before:-translate-x-1/2 before:border-t-[7px] before:border-t-[#1a0a1a] before:border-x-[7px] before:border-x-transparent before:border-b-0",
    left: "before:right-[-7px] before:top-1/2 before:-translate-y-1/2 before:border-l-[7px] before:border-l-[#1a0a1a] before:border-y-[7px] before:border-y-transparent before:border-r-0",
    right: "before:left-[-7px] before:top-1/2 before:-translate-y-1/2 before:border-r-[7px] before:border-r-[#1a0a1a] before:border-y-[7px] before:border-y-transparent before:border-l-0",
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9000] pointer-events-none"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(1px)" }}
      />

      {/* Spotlight cutout */}
      {rect && !isCenter && (
        <div
          className="fixed z-[9001] rounded-xl pointer-events-none"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
            border: "2px solid rgba(236,72,153,0.7)",
            background: "transparent",
          }}
        />
      )}

      {/* Tooltip */}
      {isCenter ? (
        /* Centered welcome card */
        <div className="fixed inset-0 z-[9002] flex items-center justify-center px-4 pointer-events-none">
          <div
            ref={tooltipRef}
            className="pointer-events-auto w-full max-w-sm bg-[#1a0a1a] border border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/20 p-6 animate-[fadeInScale_0.3s_ease]"
          >
            <TourCard
              current={current}
              step={step}
              total={STEPS.length}
              isLast={isLast}
              onNext={next}
              onPrev={prev}
              onSkip={finish}
              showArrow={false}
            />
          </div>
        </div>
      ) : (
        <div
          ref={tooltipRef}
          className={`fixed z-[9002] w-72 bg-[#1a0a1a] border border-pink-500/40 rounded-2xl shadow-2xl shadow-pink-500/20 p-4 pointer-events-auto before:absolute before:content-[''] before:w-0 before:h-0 ${arrowClass[pos] || ""} animate-[fadeInScale_0.25s_ease]`}
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <TourCard
            current={current}
            step={step}
            total={STEPS.length}
            isLast={isLast}
            onNext={next}
            onPrev={prev}
            onSkip={finish}
            showArrow
          />
        </div>
      )}
    </>
  );
}

function TourCard({
  current, step, total, isLast, onNext, onPrev, onSkip, showArrow: _showArrow,
}: {
  current: Step; step: number; total: number;
  isLast: boolean; onNext: () => void; onPrev: () => void; onSkip: () => void;
  showArrow: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-pink-400 shrink-0" />
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">
            Step {step + 1} of {total}
          </span>
        </div>
        <button
          onClick={onSkip}
          className="text-white/40 hover:text-white/80 transition-colors shrink-0 -mt-0.5"
          aria-label="Skip tour"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      {/* Content */}
      <h3 className="text-white font-black text-sm mb-1.5 leading-snug">{current.title}</h3>
      <p className="text-white/65 text-xs leading-relaxed mb-4">{current.description}</p>

      {/* Dots */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? "w-4 h-2 bg-pink-500"
                  : i < step
                  ? "w-2 h-2 bg-pink-500/50"
                  : "w-2 h-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 text-white/50 hover:text-white text-xs font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              <ChevronLeft size={13} /> Back
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-lg shadow-pink-500/30"
          >
            {isLast ? "Got it! 🎉" : <>Next <ChevronRight size={13} /></>}
          </button>
        </div>
      </div>
    </>
  );
}
