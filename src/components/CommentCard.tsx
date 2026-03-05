import { useState } from "react";
import { CityComment, Discipline, ReviewStatus } from "@/types";
import { ChevronDown, ChevronRight, Check, Pencil, Trash2, RotateCcw } from "lucide-react";

interface CommentCardProps {
  comment: CityComment;
  onUpdate: (updated: CityComment) => void;
}

const reviewStatusStyles: Record<ReviewStatus, { bg: string; border: string; badge: string; badgeBg: string; label: string }> = {
  pending: { bg: "bg-card", border: "border-l-info/50", badge: "text-gold", badgeBg: "bg-gold/10", label: "AI GENERATED" },
  approved: { bg: "bg-success-bg", border: "border-l-success", badge: "text-success", badgeBg: "bg-success/10", label: "✅ APPROVED" },
  edited: { bg: "bg-success-bg", border: "border-l-success", badge: "text-success", badgeBg: "bg-success/10", label: "✏️ EDITED & APPROVED" },
  removed: { bg: "bg-muted/50", border: "border-l-muted-foreground/30", badge: "text-muted-foreground", badgeBg: "bg-muted", label: "REMOVED" },
};

const confidenceLabels: Record<string, { text: string; color: string }> = {
  high: { text: "High (clear violation detected)", color: "text-success" },
  medium: { text: "Medium (likely violation)", color: "text-warning" },
  low: { text: "Low (possible issue)", color: "text-muted-foreground" },
};

const CommentCard = ({ comment, onUpdate }: CommentCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.commentText);
  const style = reviewStatusStyles[comment.reviewStatus];
  const isRemoved = comment.reviewStatus === "removed";
  const confidence = confidenceLabels[comment.aiConfidence] || confidenceLabels.high;

  const handleApprove = () => {
    onUpdate({ ...comment, reviewStatus: "approved", status: "addressed" });
  };

  const handleStartEdit = () => {
    setEditText(comment.editedText || comment.commentText);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdate({ ...comment, reviewStatus: "edited", status: "addressed", editedText: editText });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(comment.commentText);
    setEditing(false);
  };

  const handleRemove = () => {
    onUpdate({ ...comment, reviewStatus: "removed", status: "n/a" });
  };

  const handleRestore = () => {
    onUpdate({ ...comment, reviewStatus: "pending", status: "pending", editedText: "" });
  };

  const displayText = comment.editedText || comment.commentText;

  return (
    <div className={`rounded-lg border ${style.bg} border-l-4 ${style.border} shadow-sm ${isRemoved ? "opacity-60" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-warning">⚠️</span>
          <span className="font-mono text-xs font-bold text-foreground bg-navy/10 px-2 py-0.5 rounded">#{comment.number}</span>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{comment.sheetReference}</span>
          {comment.codeReference && (
            <span className="font-mono text-[10px] text-gold bg-navy px-2 py-0.5 rounded">{comment.codeReference}</span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{comment.discipline}</span>
        </div>
        <div className="flex items-center gap-2">
          {comment.source === "manual" && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-info/10 text-info">👤 MANUAL</span>
          )}
          <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${style.badgeBg} ${style.badge}`}>
            {style.label}
          </span>
        </div>
      </div>

      {/* AI-Generated Comment */}
      <div className="px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-2">
          🤖 {comment.source === "manual" ? "MANUAL" : "AI-GENERATED"} CORRECTION COMMENT:
        </p>
        
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-gold rounded-md font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 resize-y"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-success/10 text-success font-mono text-[10px] uppercase tracking-wider rounded hover:bg-success/20 transition-colors"
              >
                <Check className="w-3 h-3" /> Save Edit
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-muted text-muted-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={`bg-background border border-border rounded-lg p-3 ${isRemoved ? "line-through" : ""}`}>
            <p className="font-body text-sm text-foreground leading-relaxed">{displayText}</p>
          </div>
        )}

        {!editing && (
          <p className="font-mono text-[9px] text-muted-foreground/60 mt-1 italic">Click Edit to modify if needed</p>
        )}
      </div>

      {/* Metadata */}
      {!editing && (
        <div className="px-4 pb-2 flex flex-wrap gap-x-6 gap-y-1">
          {comment.codeReference && (
            <p className="font-mono text-[10px] text-muted-foreground">📋 CODE BASIS: {comment.codeReference}</p>
          )}
          <p className="font-mono text-[10px] text-muted-foreground">📄 SHEET: {comment.sheetReference}</p>
          <p className={`font-mono text-[10px] ${confidence.color}`}>⚡ AI CONFIDENCE: {confidence.text}</p>
        </div>
      )}

      {/* Actions */}
      {!editing && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30">
          <div className="flex gap-2 flex-wrap">
            {!isRemoved && comment.reviewStatus !== "approved" && comment.reviewStatus !== "edited" && (
              <>
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success font-mono text-[10px] uppercase tracking-wider rounded hover:bg-success/20 transition-colors"
                >
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-info/10 text-info font-mono text-[10px] uppercase tracking-wider rounded hover:bg-info/20 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive font-mono text-[10px] uppercase tracking-wider rounded hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </>
            )}
            {(comment.reviewStatus === "approved" || comment.reviewStatus === "edited") && (
              <button
                onClick={handleRestore}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-muted/80 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Undo Approval
              </button>
            )}
            {isRemoved && (
              <button
                onClick={handleRestore}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-info/10 text-info font-mono text-[10px] uppercase tracking-wider rounded hover:bg-info/20 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Restore
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface DisciplineSectionProps {
  discipline: Discipline;
  icon: string;
  comments: CityComment[];
  onUpdateComment: (updated: CityComment) => void;
  onAddManual: (discipline: Discipline) => void;
}

export const DisciplineSection = ({ discipline, icon, comments, onUpdateComment, onAddManual }: DisciplineSectionProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const approved = comments.filter(c => c.reviewStatus === "approved" || c.reviewStatus === "edited").length;
  const pending = comments.filter(c => c.reviewStatus === "pending").length;
  const removed = comments.filter(c => c.reviewStatus === "removed").length;

  if (comments.length === 0) return null;

  return (
    <div id={`discipline-${discipline.replace(/\s+/g, "-")}`} className="mb-6">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-navy/5 rounded-lg border border-border hover:bg-navy/10 transition-colors"
      >
        <span className="text-lg">{icon}</span>
        <span className="font-display text-sm font-bold text-foreground uppercase tracking-wider">{discipline}</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {comments.length} comment{comments.length !== 1 ? "s" : ""} · {approved} approved · {pending} pending{removed > 0 ? ` · ${removed} removed` : ""}
        </span>
        <span className="ml-auto">
          {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </span>
      </button>
      {!collapsed && (
        <div className="space-y-3 mt-3">
          {comments.map(c => (
            <CommentCard key={c.id} comment={c} onUpdate={onUpdateComment} />
          ))}
          <button
            onClick={() => onAddManual(discipline)}
            className="w-full py-2 border border-dashed border-border rounded-lg font-mono text-[10px] text-muted-foreground uppercase tracking-wider hover:border-gold/50 hover:text-foreground transition-colors"
          >
            + Add Manual Correction Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
