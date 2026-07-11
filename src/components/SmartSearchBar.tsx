import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, X, Clock, TrendingUp, Tag, MapPin, ShoppingBag, CornerDownLeft } from "lucide-react";
import { CATEGORIES, CITIES, BRANDS, TRENDING_SEARCHES, type MarketplaceItem } from "@/lib/mockData";
import { fetchActiveListings } from "@/lib/listings";

const RECENT_KEY = "mh_recent_searches";

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function pushRecent(q: string) {
  if (!q.trim()) return;
  const next = [q, ...getRecent().filter(r => r.toLowerCase() !== q.toLowerCase())].slice(0, 6);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
}

// Cheap edit-distance for "did you mean" suggestions
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

type Suggestion = { type: "product" | "category" | "brand" | "location" | "recent" | "trending"; label: string; meta?: string };

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "lg" | "md";
}

export default function SmartSearchBar({ value, onChange, onSubmit, placeholder, autoFocus, size = "md" }: Props) {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setRecent(getRecent()); }, [open]);
  useEffect(() => { fetchActiveListings().then(setItems); }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = value.trim().toLowerCase();

  const suggestions: Suggestion[] = useMemo(() => {
    if (!q) {
      const list: Suggestion[] = [];
      recent.forEach(r => list.push({ type: "recent", label: r }));
      TRENDING_SEARCHES.slice(0, 6).forEach(t => list.push({ type: "trending", label: t }));
      return list.slice(0, 10);
    }
    const out: Suggestion[] = [];

    items.filter(i => i.title.toLowerCase().includes(q)).slice(0, 4)
      .forEach(i => out.push({ type: "product", label: i.title, meta: i.location }));

    CATEGORIES.filter(c => c !== "All Categories" && c.toLowerCase().includes(q)).slice(0, 3)
      .forEach(c => out.push({ type: "category", label: c }));

    BRANDS.filter(b => b.toLowerCase().includes(q)).slice(0, 3)
      .forEach(b => out.push({ type: "brand", label: b }));

    CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 3)
      .forEach(c => out.push({ type: "location", label: c, meta: "District" }));

    return out.slice(0, 10);
  }, [q, recent, items]);

  // "Did you mean" — only when there are zero matches and query is reasonably long
  const didYouMean = useMemo(() => {
    if (!q || q.length < 3 || suggestions.length > 0) return null;
    const pool = [
      ...CATEGORIES.filter(c => c !== "All Categories"),
      ...CITIES, ...BRANDS,
      ...items.map(i => i.title),
    ];
    let best: { word: string; dist: number } | null = null;
    for (const word of pool) {
      const d = levenshtein(q, word.toLowerCase().slice(0, Math.max(q.length + 2, 6)));
      if (!best || d < best.dist) best = { word, dist: d };
    }
    if (best && best.dist <= 3 && best.word.toLowerCase() !== q) return best.word;
    return null;
  }, [q, suggestions.length, items]);

  const commit = (v: string) => {
    pushRecent(v);
    onChange(v);
    setOpen(false);
    if (onSubmit) onSubmit(v);
    else navigate(`/marketplace?q=${encodeURIComponent(v)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const pick = activeIdx >= 0 ? suggestions[activeIdx]?.label : value;
      if (pick) commit(pick);
    } else if (e.key === "Escape") setOpen(false);
  };

  const iconFor = (t: Suggestion["type"]) => {
    switch (t) {
      case "product": return <ShoppingBag size={13} className="text-red-400" />;
      case "category": return <Tag size={13} className="text-red-400" />;
      case "brand": return <Tag size={13} className="text-red-400" />;
      case "location": return <MapPin size={13} className="text-red-400" />;
      case "recent": return <Clock size={13} className="text-muted-foreground" />;
      case "trending": return <TrendingUp size={13} className="text-red-400" />;
    }
  };

  const padding = size === "lg" ? "py-3.5 pl-12 pr-4 text-base" : "py-3 pl-10 pr-4 text-sm";

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <Search size={size === "lg" ? 18 : 15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={value}
          autoFocus={autoFocus}
          onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search products, brands, categories, districts..."}
          className={`w-full ${padding} rounded-xl border border-red-500/20 bg-card text-foreground outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 font-medium transition-all`}
        />
        {value && (
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (suggestions.length > 0 || didYouMean) && (
        <div className="absolute z-50 mt-2 w-full bg-card border border-red-500/20 rounded-xl shadow-2xl shadow-black/30 overflow-hidden max-h-[60vh] overflow-y-auto">
          {didYouMean && (
            <button
              onClick={() => commit(didYouMean)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 font-semibold hover:bg-red-500/10 border-b border-red-500/10"
            >
              Did you mean <span className="underline">{didYouMean}</span>?
            </button>
          )}
          {!q && suggestions.length > 0 && (
            <div className="px-4 pt-2.5 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {recent.length > 0 ? "Recent & Trending" : "Trending Searches"}
            </div>
          )}
          {suggestions.map((s, idx) => (
            <button
              key={`${s.type}-${s.label}-${idx}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => commit(s.label)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                activeIdx === idx ? "bg-red-500/10" : "hover:bg-red-500/5"
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                {iconFor(s.type)}
                <span className="truncate font-medium">{s.label}</span>
                {s.meta && <span className="text-[10px] text-muted-foreground shrink-0">· {s.meta}</span>}
              </span>
              <span className="flex items-center gap-1 shrink-0">
                {s.type === "recent" && <span className="text-[9px] text-muted-foreground">Recent</span>}
                {s.type === "trending" && <span className="text-[9px] text-red-400">Trending</span>}
                {activeIdx === idx && <CornerDownLeft size={11} className="text-red-400" />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
