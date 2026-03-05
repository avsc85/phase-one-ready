import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { sampleCases } from "@/data/sampleCases";
import { CaseSummary, CaseStatus, ProjectType, Jurisdiction } from "@/types";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<CaseStatus, { label: string; classes: string }> = {
  uploading: { label: "UPLOADING", classes: "bg-muted text-muted-foreground" },
  ai_processing: { label: "AI PROCESSING", classes: "bg-info-bg text-info animate-pulse" },
  awaiting_review: { label: "AWAITING REVIEW", classes: "bg-warning-bg text-warning" },
  in_review: { label: "IN REVIEW", classes: "bg-gold/20 text-gold-dark" },
  letter_ready: { label: "LETTER READY", classes: "bg-success-bg text-success" },
  sent: { label: "SENT", classes: "bg-navy text-gold border border-gold/40" },
};

const projectTypeLabels: Record<ProjectType, string> = {
  residential_remodel: "Residential Remodel",
  residential_addition: "Residential Addition",
  new_adu_detached: "New Detached ADU",
  new_adu_attached: "New Attached ADU",
  new_sfr: "New SFR",
  commercial_ti: "Commercial TI",
  bathroom_remodel: "Bath/Kitchen Remodel",
  kitchen_remodel: "Kitchen Remodel",
  solar_pv: "Solar / PV",
  demolition: "Demolition",
  other: "Other",
};

const jurisdictionLabels: Record<Jurisdiction, string> = {
  san_mateo: "San Mateo",
  san_leandro: "San Leandro",
  milpitas: "Milpitas",
  san_bruno: "San Bruno",
  union_city: "Union City",
  fremont: "Fremont",
  los_angeles: "Los Angeles",
  san_francisco: "San Francisco",
  san_jose: "San Jose",
  sacramento: "Sacramento",
  other: "Other",
};

const StatusBadge = ({ status }: { status: CaseStatus }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] tracking-wider ${config.classes}`}>
      {config.label}
    </span>
  );
};

const activityFeed = [
  { text: "AI review complete for 12 Norfolk St — 27 corrections found", time: "2 hours ago" },
  { text: "Correction letter generated for 1864 Shenandoah", time: "Yesterday" },
  { text: "Plans uploaded: 43353 Cedarwood Dr", time: "2 days ago" },
  { text: "Letter sent to applicant for Cedarwood Dr", time: "3 days ago" },
  { text: "New upload: 2741 Berkshire Dr", time: "5 days ago" },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const cases = sampleCases;

  const activeCases = cases.filter(c => c.status !== "sent").length;
  const letterReady = cases.filter(c => c.status === "letter_ready" || c.status === "sent").length;
  const awaitingReview = cases.filter(c => c.status === "awaiting_review" || c.status === "in_review").length;
  const totalComments = cases.reduce((a, c) => a + c.totalComments, 0);

  const statCards = [
    { label: "Active Cases", value: activeCases, dot: "bg-warning" },
    { label: "Letters Ready/Sent", value: letterReady, dot: "bg-success" },
    { label: "Awaiting Review", value: awaitingReview, dot: "bg-gold" },
    { label: "Total AI Comments", value: totalComments, dot: "bg-info" },
  ];

  const filtered = cases.filter(c =>
    c.projectAddress.toLowerCase().includes(search.toLowerCase()) ||
    c.permitNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="bg-cream min-h-[calc(100vh-5.25rem)]">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Plan Check Cases</h1>
              <p className="font-body text-muted-foreground mt-1">Manage all AI-reviewed plan check cases and correction letters</p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Upload Plans
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`}></div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by address, permit number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-cream/50">
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Project Address</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Permit No.</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Jurisdiction</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Comments</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, i) => (
                        <tr key={c.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-cream/30" : ""} hover:bg-gold/5 transition-colors`}>
                          <td className="px-4 py-3">
                            <p className="font-body text-sm font-medium text-foreground">{c.projectAddress}</p>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{c.permitNumber}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{projectTypeLabels[c.projectType]}</td>
                          <td className="px-4 py-3 font-sans text-xs text-muted-foreground">{jurisdictionLabels[c.jurisdiction]}</td>
                          <td className="px-4 py-3 font-mono text-xs text-foreground">
                            {c.addressedComments} approved / {c.totalComments} total
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/case/${c.id}`}
                                className="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-navy text-cream hover:bg-navy-light transition-colors"
                              >
                                Review
                              </Link>
                              <Link
                                to={`/case/${c.id}/letter`}
                                className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                                  c.status === "letter_ready" || c.status === "sent"
                                    ? "bg-gold/20 text-gold-dark hover:bg-gold/30"
                                    : "bg-muted text-muted-foreground pointer-events-none opacity-50"
                                }`}
                              >
                                Letter
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="hidden xl:block w-72 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="font-display text-sm font-bold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activityFeed.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="font-body text-xs text-foreground leading-relaxed">{item.text}</p>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
