import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CaseSidebar from "@/components/CaseSidebar";
import { DisciplineSection } from "@/components/CommentCard";
import AddCommentModal from "@/components/AddCommentModal";
import { loadComments, saveComments, getCaseInfo, ALL_DISCIPLINES, disciplineIcons, resubmittalRequirements } from "@/lib/caseStorage";
import { CityComment, Discipline } from "@/types";
import { Plus, Zap, Loader2, CheckSquare } from "lucide-react";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CityComment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

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

  const emptyResponseCount = comments.filter(c => !c.userResponse && c.status !== "n/a").length;
  const addressedCount = comments.filter(c => c.status === "addressed").length;
  const pendingCount = comments.filter(c => c.status === "pending").length;
  const naCount = comments.filter(c => c.status === "n/a").length;
  const deferredCount = comments.filter(c => c.status === "deferred").length;

  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    const empty = comments.filter(c => !c.userResponse && c.status !== "n/a");
    for (let i = 0; i < empty.length; i++) {
      setBulkProgress(i + 1);
      const c = empty[i];
      const mockResponse = `Acknowledged. Plans have been revised on ${c.sheetReference} to address this comment. ${c.codeReference ? `Revisions comply with ${c.codeReference} as noted.` : "All revisions are reflected in the updated drawings."} Please refer to the revised plans for the specific changes made.`;
      updateComment({ ...c, aiResponse: mockResponse, userResponse: mockResponse });
      await new Promise(r => setTimeout(r, 200));
    }
    setBulkGenerating(false);
    setBulkProgress(0);
  };

  const jurisdiction = caseInfo?.jurisdiction || "san_mateo";
  const requirements = resubmittalRequirements[jurisdiction] || [];
  const projectAddress = caseInfo?.projectAddress || "Unknown Address";
  const permitNumber = caseInfo?.permitNumber || "";
  const projectDescription = caseInfo?.projectDescription || "";

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
                  {projectAddress} · <span className="text-gold">{permitNumber}</span>
                </h1>
                <div className="flex gap-3 mt-1">
                  <span className="font-mono text-[10px] text-success">✓ {addressedCount} Addressed</span>
                  <span className="font-mono text-[10px] text-info">● {pendingCount} Pending</span>
                  {deferredCount > 0 && <span className="font-mono text-[10px] text-warning">◐ {deferredCount} Deferred</span>}
                  <span className="font-mono text-[10px] text-muted-foreground">— {naCount} N/A</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Comment
              </button>
            </div>
          </div>

          <div className="px-6 py-6 max-w-4xl">
            {/* Bulk generate banner */}
            {emptyResponseCount > 0 && (
              <div className="mb-6 flex items-center justify-between px-4 py-3 bg-warning-bg border border-warning/20 rounded-lg">
                <span className="font-mono text-xs text-warning">
                  <Zap className="w-3.5 h-3.5 inline mr-1" />
                  {emptyResponseCount} comments have no response yet.
                </span>
                <button
                  onClick={handleBulkGenerate}
                  disabled={bulkGenerating}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors disabled:opacity-50"
                >
                  {bulkGenerating ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> {bulkProgress}/{emptyResponseCount}</>
                  ) : (
                    "Generate All AI Responses"
                  )}
                </button>
              </div>
            )}

            {/* Jurisdiction intro */}
            <div className="mb-6 px-4 py-3 bg-info-bg border border-info/10 rounded-lg">
              <p className="font-body text-sm text-info italic">
                {caseInfo?.reviewingDepartment || "Building Department"} comments. Your plans have been reviewed for conformance of the current California Building Codes, City Ordinances, and City standards.
              </p>
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
                  projectAddress={projectAddress}
                  projectDescription={projectDescription}
                />
              );
            })}

            {/* Resubmittal Requirements */}
            {requirements.length > 0 && (
              <div className="mt-10 mb-6">
                <h2 className="font-display text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
                  📋 Resubmittal Requirements
                </h2>
                <div className="bg-card rounded-lg border border-border p-5 space-y-2">
                  {requirements.map((req, i) => (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checkedItems[`req-${i}`] || false}
                        onChange={e => setCheckedItems(prev => ({ ...prev, [`req-${i}`]: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 rounded border-border text-gold focus:ring-gold"
                      />
                      <span className={`font-body text-sm transition-colors ${checkedItems[`req-${i}`] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {req}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddCommentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addComment}
        nextNumber={nextNumber}
      />
    </AppLayout>
  );
};

export default CaseDetail;
