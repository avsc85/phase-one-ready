import { CityComment, Discipline } from "@/types";
import { ALL_DISCIPLINES, disciplineIcons } from "@/lib/caseStorage";

interface CaseSidebarProps {
  projectAddress: string;
  permitNumber: string;
  jurisdiction: string;
  submittalNumber: number;
  expirationDate: string;
  comments: CityComment[];
  onDisciplineClick: (d: Discipline) => void;
  onGenerateLetter: () => void;
}

const ProgressRing = ({ approved, total }: { approved: number; total: number }) => {
  const pct = total > 0 ? (approved / total) * 100 : 0;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center py-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--navy-light))" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--gold))" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 60 60)" className="transition-all duration-500" />
        <text x="60" y="55" textAnchor="middle" className="fill-cream font-display text-lg font-bold">{approved}</text>
        <text x="60" y="70" textAnchor="middle" className="fill-cream/60 font-mono text-[10px]">/ {total}</text>
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-wider text-cream/60 mt-1">Review Progress</p>
    </div>
  );
};

const jurisdictionLabels: Record<string, string> = {
  san_mateo: "San Mateo", san_leandro: "San Leandro", milpitas: "Milpitas",
  san_bruno: "San Bruno", union_city: "Union City", fremont: "Fremont", other: "Other",
};

const CaseSidebar = ({
  projectAddress, permitNumber, jurisdiction, submittalNumber, expirationDate,
  comments, onDisciplineClick, onGenerateLetter,
}: CaseSidebarProps) => {
  const approved = comments.filter(c => c.reviewStatus === "approved").length;
  const edited = comments.filter(c => c.reviewStatus === "edited").length;
  const pending = comments.filter(c => c.reviewStatus === "pending").length;
  const removed = comments.filter(c => c.reviewStatus === "removed").length;
  const manual = comments.filter(c => c.source === "manual").length;
  const total = comments.length;
  const approvedTotal = approved + edited;

  const daysUntilExpiry = expirationDate
    ? Math.ceil((new Date(expirationDate).getTime() - Date.now()) / 86400000)
    : null;

  const disciplineGroups = ALL_DISCIPLINES.map(d => {
    const items = comments.filter(c => c.discipline === d);
    const done = items.filter(c => c.reviewStatus === "approved" || c.reviewStatus === "edited").length;
    return { discipline: d, count: items.length, done };
  });

  return (
    <aside className="w-[260px] bg-navy flex flex-col h-[calc(100vh-5.25rem)] sticky top-0 overflow-y-auto flex-shrink-0">
      {/* Project Info */}
      <div className="p-5 border-b border-navy-light">
        <h2 className="font-display text-base font-bold text-cream leading-tight">{projectAddress}</h2>
        <p className="font-mono text-[11px] text-gold mt-1">{permitNumber}</p>
        <div className="flex gap-2 mt-3">
          <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider bg-navy-light text-cream border border-navy-light">
            {jurisdictionLabels[jurisdiction] || jurisdiction}
          </span>
          <span className="px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
            {submittalNumber === 1 ? "1ST" : submittalNumber === 2 ? "2ND" : submittalNumber === 3 ? "3RD" : `${submittalNumber}TH`} REVIEW
          </span>
        </div>
        {daysUntilExpiry !== null && daysUntilExpiry < 30 && (
          <p className="font-mono text-[10px] text-destructive mt-2">⚠ Expires in {daysUntilExpiry} days</p>
        )}
      </div>

      {/* Progress Ring */}
      <ProgressRing approved={approvedTotal} total={total} />

      {/* Review Progress Stats */}
      <div className="px-5 pb-4 border-b border-navy-light">
        <p className="font-mono text-[9px] uppercase tracking-wider text-cream/40 mb-2">Review Progress</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/70">✅ Approved</span>
            <span className="font-mono text-[10px] text-cream/50">{approved}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/70">✏️ Edited</span>
            <span className="font-mono text-[10px] text-cream/50">{edited}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/70">⏳ Pending</span>
            <span className="font-mono text-[10px] text-cream/50">{pending}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/70">🗑 Removed</span>
            <span className="font-mono text-[10px] text-cream/50">{removed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/70">👤 Manual</span>
            <span className="font-mono text-[10px] text-cream/50">{manual}</span>
          </div>
          <div className="border-t border-navy-light mt-2 pt-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-cream/80 font-medium">Total</span>
            <span className="font-mono text-[10px] text-cream/80 font-medium">{total}</span>
          </div>
        </div>
      </div>

      {/* Discipline Nav */}
      <div className="flex-1 px-3 py-4">
        <p className="font-mono text-[9px] uppercase tracking-wider text-cream/40 px-2 mb-2">Disciplines</p>
        <div className="space-y-0.5">
          {disciplineGroups.map(({ discipline, count, done }) => (
            <button
              key={discipline}
              onClick={() => onDisciplineClick(discipline)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-navy-light/50 transition-colors group"
            >
              <span className="text-sm">{disciplineIcons[discipline]}</span>
              <span className="font-mono text-[10px] text-cream/80 flex-1 truncate">{discipline}</span>
              {count > 0 ? (
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                  done === count ? "bg-success/20 text-success" : "bg-navy-light text-cream/60"
                }`}>
                  {done}/{count}
                </span>
              ) : (
                <span className="font-mono text-[9px] text-cream/30">—</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-navy-light space-y-2">
        <button
          onClick={onGenerateLetter}
          disabled={approvedTotal === 0}
          className="w-full py-2.5 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📄 Generate Correction Letter ({approvedTotal} approved)
        </button>
      </div>
    </aside>
  );
};

export default CaseSidebar;
