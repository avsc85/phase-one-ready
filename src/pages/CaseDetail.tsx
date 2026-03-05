import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CaseSidebar from "@/components/CaseSidebar";
import { DisciplineSection } from "@/components/CommentCard";
import AddCommentModal from "@/components/AddCommentModal";
import { loadComments, saveComments, getCaseInfo, ALL_DISCIPLINES, disciplineIcons, resubmittalRequirements } from "@/lib/caseStorage";
import { CityComment, Discipline } from "@/types";
import { Check } from "lucide-react";

const jurisdictionLabels: Record<string, string> = {
  san_mateo: "San Mateo", san_leandro: "San Leandro", milpitas: "Milpitas",
  san_bruno: "San Bruno", union_city: "Union City", fremont: "Fremont", other: "Other",
};

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CityComment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForDiscipline, setAddForDiscipline] = useState<Discipline | undefined>();

  const caseInfo = id ? getCaseInfo(id) : null;

  useEffect(() => {
    if (id) setComments(loadComments(id));
  }, [id]);

  const updateComment = useCallback((updated: CityComment) => {
    setComments(prev => {
      const next = prev.map(c => c.id === updated.id ? updated : c);
      if (id) saveComments(id, next);
      return next;
    });
  }, [id]);

  const addComment = useCallback((comment: CityComment) => {
    setComments(prev => {
      const next = [...prev, comment];
      if (id) saveComments(id, next);
      return next;
    });
  }, [id]);

  const handleDisciplineClick = (d: Discipline) => {
    const el = document.getElementById(`discipline-${d.replace(/\s+/g, "-")}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddManual = (discipline: Discipline) => {
    setAddForDiscipline(discipline);
    setShowAddModal(true);
  };

  const approvedCount = comments.filter(c => c.reviewStatus === "approved" || c.reviewStatus === "edited").length;
  const pendingCount = comments.filter(c => c.reviewStatus === "pending").length;
  const removedCount = comments.filter(c => c.reviewStatus === "removed").length;

  const handleApproveAll = () => {
    const updated = comments.map(c =>
      c.reviewStatus === "pending" ? { ...c, reviewStatus: "approved" as const, status: "addressed" as const } : c
    );
    setComments(updated);
    if (id) saveComments(id, updated);
  };

  const jurisdiction = caseInfo?.jurisdiction || "san_mateo";
  const projectAddress = caseInfo?.projectAddress || "Unknown Address";
  const permitNumber = caseInfo?.permitNumber || "";

  const nextNumber = String(comments.length + 1);

  return (
    <AppLayout>
      <div className="flex bg-cream min-h-[calc(100vh-5.25rem)]">
        <CaseSidebar
          projectAddress={projectAddress}
          permitNumber={permitNumber}
          jurisdiction={jurisdiction}
          submittalNumber={caseInfo?.submittalNumber || 1}
          expirationDate={caseInfo?.expirationDate || ""}
          comments={comments}
          onDisciplineClick={handleDisciplineClick}
          onGenerateLetter={() => navigate(`/case/${id}/letter`)}
        />

        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  AI-Generated Plan Check Comments — Human Review
                </h1>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Review each finding below. Approve, edit, or remove. Add manual comments if needed.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 max-w-4xl">
            {/* AI Status Banner */}
            <div className="mb-6 flex items-center justify-between px-4 py-3 bg-info-bg border border-info/20 rounded-lg">
              <span className="font-mono text-xs text-info">
                🤖 AI generated {comments.filter(c => c.source === "ai").length} correction comments for review.
                Approve all findings or review item by item.
              </span>
              <div className="flex gap-2">
                {pendingCount > 0 && (
                  <button
                    onClick={handleApproveAll}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-success/10 text-success font-mono text-[10px] uppercase tracking-wider rounded hover:bg-success/20 transition-colors"
                  >
                    <Check className="w-3 h-3" /> Approve All ({pendingCount})
                  </button>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="bg-success-bg rounded-lg p-3 text-center">
                <p className="font-display text-xl font-bold text-success">{approvedCount}</p>
                <p className="font-mono text-[9px] text-success uppercase tracking-wider">Approved</p>
              </div>
              <div className="bg-warning-bg rounded-lg p-3 text-center">
                <p className="font-display text-xl font-bold text-warning">{pendingCount}</p>
                <p className="font-mono text-[9px] text-warning uppercase tracking-wider">Pending Review</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="font-display text-xl font-bold text-muted-foreground">{removedCount}</p>
                <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Removed</p>
              </div>
            </div>

            {/* Discipline sections */}
            {ALL_DISCIPLINES.map(d => {
              const filtered = comments.filter(c => c.discipline === d);
              return (
                <DisciplineSection
                  key={d}
                  discipline={d}
                  icon={disciplineIcons[d]}
                  comments={filtered}
                  onUpdateComment={updateComment}
                  onAddManual={handleAddManual}
                />
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-foreground">{projectAddress}</span>
              <span className="font-mono text-[10px] text-gold">·</span>
              <span className="font-mono text-[10px] text-muted-foreground">{jurisdictionLabels[jurisdiction] || jurisdiction}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-success">✅ {approvedCount} approved</span>
              <span className="font-mono text-[10px] text-warning">⏳ {pendingCount} pending</span>
              <button
                onClick={() => navigate(`/case/${id}/letter`)}
                disabled={approvedCount === 0}
                className="ml-2 px-4 py-1.5 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📄 Generate Correction Letter ({approvedCount} approved)
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddCommentModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setAddForDiscipline(undefined); }}
        onAdd={addComment}
        nextNumber={nextNumber}
        defaultDiscipline={addForDiscipline}
      />
    </AppLayout>
  );
};

export default CaseDetail;
