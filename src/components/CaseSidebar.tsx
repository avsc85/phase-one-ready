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

const ProgressRing = ({ addressed, total }: { addressed: number; total: number }) => {
  const pct = total > 0 ? (addressed / total) * 100 : 0;
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
        <text x="60" y="55" textAnchor="middle" className="fill-cream font-display text-lg font-bold">{addressed}</text>
        <text x="60" y="70" textAnchor="middle" className="fill-cream/60 font-mono text-[10px]">/ {total}</text>
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-wider text-cream/60 mt-1">Comments Addressed</p>
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
  const addressed = comments.filter(c => c.status === "addressed").length;
  const total = comments.length;

  const daysUntilExpiry = expirationDate
    ? Math.ceil((new Date(expirationDate).getTime() - Date.now()) / 86400000)
    : null;

  const disciplineGroups = ALL_DISCIPLINES.map(d => {
    const items = comments.filter(c => c.discipline === d);
    const done = items.filter(c => c.status === "addressed").length;
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
          <p className="font-mono text-[10px] text-danger mt-2">⚠ Expires in {daysUntilExpiry} days</p>
        )}
      </div>

      {/* Progress */}
      <ProgressRing addressed={addressed} total={total} />

      {/* Discipline Nav */}
      <div className="flex-1 px-3 pb-4">
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
          className="w-full py-2.5 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
        >
          📄 Generate Response Letter
        </button>
        <button className="w-full py-2 border border-cream/20 text-cream/70 font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-navy-light transition-colors">
          📋 Preview Case Summary
        </button>
      </div>
    </aside>
  );
};

export default CaseSidebar;
