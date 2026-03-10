import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CaseSidebar from "@/components/CaseSidebar";
import AddCommentModal from "@/components/AddCommentModal";
import { loadComments, saveComments, getCaseInfo, ALL_DISCIPLINES, disciplineIcons } from "@/lib/caseStorage";
import { CityComment, Discipline, InspectorStatus } from "@/types";
import { Check, Pencil, Trash2, RotateCcw, Save, X, Plus, ChevronRight } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const jurisdictionLabels: Record<string, string> = {
  san_mateo: "San Mateo", san_leandro: "San Leandro", milpitas: "Milpitas",
  san_bruno: "San Bruno", union_city: "Union City", fremont: "Fremont", other: "Other",
};

const inspectorStatusLabels: Record<string, { label: string; color: string }> = {
  non_compliance: { label: "Non-Compliance", color: "bg-destructive/10 text-destructive border-destructive/30" },
  need_additional_info: { label: "Need Additional Info", color: "bg-warning/10 text-warning border-warning/30" },
  needs_manual_review: { label: "Needs Manual Review", color: "bg-info/10 text-info border-info/30" },
  "": { label: "—", color: "bg-muted text-muted-foreground border-border" },
};

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CityComment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForDiscipline, setAddForDiscipline] = useState<Discipline | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMissing, setEditMissing] = useState("");
  const [editSuggested, setEditSuggested] = useState("");
  const [editStatus, setEditStatus] = useState<InspectorStatus>("");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    setFilterDiscipline(d);
  };

  const handleAddManual = (discipline?: Discipline) => {
    setAddForDiscipline(discipline);
    setShowAddModal(true);
  };

  const startEdit = (c: CityComment) => {
    setEditingId(c.id);
    setEditMissing(c.missingInfo || "");
    setEditSuggested(c.suggestedRectification || "");
    setEditStatus(c.inspectorStatus || "");
    setExpandedId(c.id);
  };

  const saveEdit = (c: CityComment) => {
    updateComment({
      ...c,
      missingInfo: editMissing,
      suggestedRectification: editSuggested,
      inspectorStatus: editStatus,
      reviewStatus: "edited",
      status: "addressed",
    });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleApprove = (c: CityComment) => {
    updateComment({ ...c, reviewStatus: "approved", status: "addressed" });
  };

  const handleRemove = (c: CityComment) => {
    updateComment({ ...c, reviewStatus: "removed", status: "n/a" });
  };

  const handleRestore = (c: CityComment) => {
    updateComment({ ...c, reviewStatus: "pending", status: "pending", editedText: "" });
  };

  const toggleExpand = (cId: string) => {
    setExpandedId(prev => prev === cId ? null : cId);
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

  const filteredComments = filterDiscipline === "all"
    ? comments
    : comments.filter(c => c.discipline === filterDiscipline);

  const activeDisciplines = ALL_DISCIPLINES.filter(d => comments.some(c => c.discipline === d));

  const statusBadge = (status: InspectorStatus) => {
    const s = inspectorStatusLabels[status || ""];
    return (
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${s.color}`}>
        {s.label}
      </span>
    );
  };

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
                  Click a row to expand details. Override Missing Info, Suggested Rectification, and Status as needed.
                </p>
              </div>
              <button
                onClick={() => handleAddManual()}
                className="flex items-center gap-1.5 px-4 py-2 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-gold-dark transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Manual Comment
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* AI Status Banner */}
            <div className="mb-4 flex items-center justify-between px-4 py-3 bg-info-bg border border-info/20 rounded-lg">
              <span className="font-mono text-xs text-info">
                🤖 AI generated {comments.filter(c => c.source === "ai").length} correction comments.
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
            <div className="mb-4 grid grid-cols-3 gap-3">
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

            {/* Discipline Filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFilterDiscipline("all")}
                className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  filterDiscipline === "all"
                    ? "bg-navy text-cream"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All ({comments.length})
              </button>
              {activeDisciplines.map(d => {
                const count = comments.filter(c => c.discipline === d).length;
                return (
                  <button
                    key={d}
                    onClick={() => setFilterDiscipline(d)}
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      filterDiscipline === d
                        ? "bg-navy text-cream"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {disciplineIcons[d]} {d} ({count})
                  </button>
                );
              })}
            </div>

            {/* Comments Table — Expandable Rows */}
            <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-navy/5">
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider w-[40px]">#</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider w-[40px]"></TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider">Category</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider">Sheet Name</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider">Code Identifier</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-wider">Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map(c => {
                    const isEditing = editingId === c.id;
                    const isRemoved = c.reviewStatus === "removed";
                    const isApproved = c.reviewStatus === "approved" || c.reviewStatus === "edited";
                    const isExpanded = expandedId === c.id;

                    return (
                      <>
                        {/* Summary Row */}
                        <TableRow
                          key={c.id}
                          onClick={() => toggleExpand(c.id)}
                          className={`text-xs cursor-pointer transition-colors ${
                            isRemoved ? "opacity-40 bg-muted/30" :
                            isApproved ? "bg-success-bg/50" :
                            isExpanded ? "bg-accent/50" :
                            "hover:bg-muted/30"
                          }`}
                        >
                          <TableCell className="font-mono text-xs font-bold text-foreground">{c.number}</TableCell>
                          <TableCell className="px-1">
                            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-foreground">
                              {disciplineIcons[c.discipline]} {c.discipline}
                            </span>
                            {c.source === "manual" && (
                              <Badge variant="outline" className="ml-1.5 text-[8px] px-1 py-0">Manual</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-[11px] text-muted-foreground">{c.sheetReference || "—"}</TableCell>
                          <TableCell>
                            {c.codeReference ? (
                              <span className="font-mono text-[10px] text-gold bg-navy px-1.5 py-0.5 rounded">{c.codeReference}</span>
                            ) : (
                              <span className="text-muted-foreground text-[10px]">—</span>
                            )}
                          </TableCell>
                          <TableCell>{statusBadge(c.inspectorStatus || "non_compliance")}</TableCell>
                          <TableCell>
                            {isApproved && <Badge className="bg-success/15 text-success border-success/30 text-[9px]">Approved</Badge>}
                            {isRemoved && <Badge className="bg-muted text-muted-foreground text-[9px]">Removed</Badge>}
                            {!isApproved && !isRemoved && <Badge className="bg-warning/15 text-warning border-warning/30 text-[9px]">Pending</Badge>}
                          </TableCell>
                        </TableRow>

                        {/* Expanded Detail Row */}
                        {isExpanded && (
                          <TableRow key={`${c.id}-detail`} className="bg-accent/30 hover:bg-accent/30">
                            <TableCell colSpan={7} className="p-0">
                              <div className="px-6 py-4 border-t border-border/50 space-y-4">
                                {/* Rule Description */}
                                <div>
                                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Rule Description</p>
                                  <p className={`font-body text-sm leading-relaxed text-foreground ${isRemoved ? "line-through" : ""}`}>
                                    {c.editedText || c.commentText}
                                  </p>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Missing Info / Gap */}
                                  <div>
                                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                                      Missing Info / Gap Analysis
                                      <span className="ml-1 text-gold normal-case">(Inspector Override)</span>
                                    </p>
                                    {isEditing ? (
                                      <textarea
                                        value={editMissing}
                                        onChange={e => setEditMissing(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-background border border-gold rounded text-sm font-body focus:outline-none focus:ring-1 focus:ring-gold/50 resize-y"
                                      />
                                    ) : (
                                      <p className="font-body text-sm text-foreground leading-relaxed bg-background rounded p-3 border border-border">
                                        {c.missingInfo || "No missing information identified."}
                                      </p>
                                    )}
                                  </div>

                                  {/* Suggested Rectification */}
                                  <div>
                                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                                      Suggested Rectification
                                      <span className="ml-1 text-gold normal-case">(Inspector Override)</span>
                                    </p>
                                    {isEditing ? (
                                      <textarea
                                        value={editSuggested}
                                        onChange={e => setEditSuggested(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-background border border-gold rounded text-sm font-body focus:outline-none focus:ring-1 focus:ring-gold/50 resize-y"
                                      />
                                    ) : (
                                      <p className="font-body text-sm text-foreground leading-relaxed bg-background rounded p-3 border border-border">
                                        {c.suggestedRectification || "No rectification suggested."}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Actions Row */}
                                <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                                  {isEditing ? (
                                    <>
                                      <div className="flex-1">
                                        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                                          Status <span className="text-gold normal-case">(Inspector Override)</span>
                                        </p>
                                        <Select value={editStatus} onValueChange={(v) => setEditStatus(v as InspectorStatus)}>
                                          <SelectTrigger className="h-9 text-xs font-mono w-64">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="non_compliance">Non-Compliance</SelectItem>
                                            <SelectItem value="need_additional_info">Need Additional Info</SelectItem>
                                            <SelectItem value="needs_manual_review">Needs Manual Review</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <button onClick={() => saveEdit(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-success/10 text-success hover:bg-success/20 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                        <Save className="w-3.5 h-3.5" /> Save
                                      </button>
                                      <button onClick={cancelEdit} className="flex items-center gap-1.5 px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                        <X className="w-3.5 h-3.5" /> Cancel
                                      </button>
                                    </>
                                  ) : isRemoved ? (
                                    <button onClick={() => handleRestore(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-info/10 text-info hover:bg-info/20 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                                    </button>
                                  ) : (
                                    <>
                                      <button onClick={() => startEdit(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-info/10 text-info hover:bg-info/20 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                        <Pencil className="w-3.5 h-3.5" /> Edit / Override
                                      </button>
                                      {!isApproved && (
                                        <button onClick={() => handleApprove(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-success/10 text-success hover:bg-success/20 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                          <Check className="w-3.5 h-3.5" /> Approve
                                        </button>
                                      )}
                                      {!isApproved && (
                                        <button onClick={() => handleRemove(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                          <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </button>
                                      )}
                                      {isApproved && (
                                        <button onClick={() => handleRestore(c)} className="flex items-center gap-1.5 px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-mono text-[10px] uppercase tracking-wider">
                                          <RotateCcw className="w-3.5 h-3.5" /> Undo Approval
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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