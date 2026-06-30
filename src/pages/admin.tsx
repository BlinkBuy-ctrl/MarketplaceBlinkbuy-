import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard, Package, Users, Flag, TrendingUp, DollarSign,
  CheckCircle2, Trash2, Eye, Search, ShieldCheck, ArrowLeft,
  Star, MapPin, XCircle, Phone, Clock,
} from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";
import { getReports, updateReportStatus, REPORT_REASONS, type ListingReport } from "@/lib/reports";
import { getSellerRatingSummary } from "@/lib/ratings";

type Tab = "overview" | "listings" | "sellers" | "reports";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState(MOCK_ITEMS);
  const [reports, setReports] = useState<ListingReport[]>([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const refreshReports = () => setReports(getReports());

  const resolveReport = (id: string) => { updateReportStatus(id, "resolved"); refreshReports(); };
  const dismissReport = (id: string) => { updateReportStatus(id, "dismissed"); refreshReports(); };

  const pendingReports = reports.filter(r => r.status === "pending");

  const sellers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; location: string; count: number; verified: boolean }>();
    listings.forEach(i => {
      const s = i.seller;
      if (!map.has(s.id)) map.set(s.id, { id: s.id, name: s.name, location: s.location, count: 0, verified: i.is_featured });
      map.get(s.id)!.count++;
    });
    return [...map.values()];
  }, [listings]);

  const filteredListings = listings.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.seller.name.toLowerCase().includes(search.toLowerCase())
  );

  const removeListing = (id: string) => setListings(prev => prev.filter(i => i.id !== id));
  const toggleFeature = (id: string) =>
    setListings(prev => prev.map(i => i.id === id ? { ...i, is_featured: !i.is_featured } : i));

  const stats = [
    { label: "Total Listings", value: listings.length, icon: Package },
    { label: "Active Sellers", value: sellers.length, icon: Users },
    { label: "Featured Items", value: listings.filter(i => i.is_featured).length, icon: Star },
    { label: "Pending Reports", value: pendingReports.length, icon: Flag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 font-semibold mb-2">
            <ArrowLeft size={13} /> Back to site
          </Link>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShieldCheck size={22} className="text-red-500" />
            Admin Dashboard
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Manage Market Hub Malawi listings, sellers &amp; reports</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Demo Mode — local data only
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-red-500/15 overflow-x-auto">
        {([
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "listings", label: "Listings", icon: Package },
          { id: "sellers", label: "Sellers", icon: Users },
          { id: "reports", label: "Reports", icon: Flag },
        ] as { id: Tab; label: string; icon: any }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              tab === t.id ? "border-red-500 text-red-500" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={14} /> {t.label}
            {t.id === "reports" && pendingReports.length > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black">
                {pendingReports.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-card border border-red-500/20 rounded-xl p-4">
                <s.icon size={18} className="text-red-500 mb-2" />
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-[11px] text-muted-foreground font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-red-500/20 rounded-xl p-5 mb-6">
            <h2 className="font-black text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-red-500" /> Listings by Category
            </h2>
            <div className="space-y-2.5">
              {(Object.entries(
                listings.reduce<Record<string, number>>((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {})
              ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-28 shrink-0 truncate">{cat}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${(count / listings.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-red-500/20 rounded-xl p-5">
            <h2 className="font-black text-sm mb-4 flex items-center gap-2">
              <DollarSign size={15} className="text-red-500" /> Estimated Marketplace Value
            </h2>
            <p className="text-3xl font-black text-red-500">
              {formatMK(listings.reduce((sum, i) => sum + (i.price || 0), 0))}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">Combined value of all active listings</p>
          </div>
        </div>
      )}

      {/* Listings moderation */}
      {tab === "listings" && (
        <div>
          <div className="relative mb-4 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search listings or sellers..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-red-500/20 bg-card text-sm outline-none focus:border-red-500"
            />
          </div>

          <div className="bg-card border border-red-500/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground border-b border-red-500/15">
                    <th className="px-4 py-3 font-bold">Item</th>
                    <th className="px-4 py-3 font-bold">Seller</th>
                    <th className="px-4 py-3 font-bold">Price</th>
                    <th className="px-4 py-3 font-bold">Location</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map(item => (
                    <tr key={item.id} className="border-b border-red-500/10 last:border-0 hover:bg-red-500/5">
                      <td className="px-4 py-3 flex items-center gap-2.5 min-w-[200px]">
                        <img src={item.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-semibold truncate max-w-[160px]">{item.title}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.seller.name}</td>
                      <td className="px-4 py-3 font-bold text-red-500 whitespace-nowrap">{formatMK(item.price)}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.location}</td>
                      <td className="px-4 py-3">
                        {item.is_featured
                          ? <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full"><Star size={10} /> Featured</span>
                          : <span className="inline-flex items-center bg-muted text-muted-foreground text-[10px] font-bold px-2 py-1 rounded-full">Standard</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/marketplace/${item.id}`} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500" title="View">
                            <Eye size={14} />
                          </Link>
                          <button onClick={() => toggleFeature(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500" title="Toggle featured">
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => removeListing(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500" title="Remove">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredListings.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">No listings match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sellers */}
      {tab === "sellers" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sellers.map(s => {
            const rating = getSellerRatingSummary(s.id);
            return (
              <div key={s.id} className="bg-card border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate flex items-center gap-1">
                      {s.name}
                      {s.verified && <ShieldCheck size={12} className="text-red-500 shrink-0" />}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{s.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground font-medium">{s.count} listing{s.count !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1 font-bold">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {rating.avg}
                    <span className="text-muted-foreground font-medium">({rating.count})</span>
                  </span>
                </div>
                <button className="text-red-500 font-bold hover:text-red-600 text-xs">View profile</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Reports */}
      {tab === "reports" && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="bg-card border border-red-500/20 rounded-xl p-10 text-center">
              <Flag size={32} className="text-red-500 mx-auto mb-3" />
              <h2 className="font-black text-base mb-1">No reports yet</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Reported listings and flagged sellers will show up here for review once buyers start using the report button on listing pages.
              </p>
            </div>
          ) : (
            reports.map(r => {
              const reasonLabel = REPORT_REASONS.find(x => x.value === r.reason)?.label ?? r.reason;
              const listing = listings.find(i => i.id === r.itemId);
              return (
                <div key={r.id} className="bg-card border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full mb-1.5 ${
                        r.status === "pending" ? "bg-amber-500/15 text-amber-600" :
                        r.status === "resolved" ? "bg-green-500/15 text-green-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {r.status === "pending" && <Flag size={10} />} {r.status.toUpperCase()}
                      </span>
                      <p className="font-bold text-sm">{reasonLabel}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        "{r.itemTitle}" &middot; Seller: {r.sellerName}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock size={10} /> {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm bg-background border border-red-500/10 rounded-lg p-3 mb-2">{r.message}</p>

                  {r.reporterContact && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <Phone size={11} /> Reporter contact: {r.reporterContact}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {listing && (
                      <Link href={`/marketplace/${r.itemId}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/20 text-muted-foreground hover:text-red-500 hover:bg-red-500/5">
                        <Eye size={12} /> View listing
                      </Link>
                    )}
                    {r.status === "pending" && (
                      <>
                        <button onClick={() => resolveReport(r.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          <CheckCircle2 size={12} /> Mark resolved
                        </button>
                        <button onClick={() => dismissReport(r.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/70">
                          <XCircle size={12} /> Dismiss
                        </button>
                        {listing && (
                          <button onClick={() => { removeListing(r.itemId); resolveReport(r.id); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20">
                            <Trash2 size={12} /> Remove listing
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
