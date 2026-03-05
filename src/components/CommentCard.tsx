import { useState } from "react";
import { CityComment, CommentStatus, Discipline } from "@/types";
import { Loader2, RotateCcw, Sparkles, ChevronDown, ChevronRight } from "lucide-react";

interface CommentCardProps {
  comment: CityComment;
  onUpdate: (updated: CityComment) => void;
  projectAddress: string;
  projectDescription: string;
}

const statusStyles: Record<CommentStatus, { bg: string; border: string; badge: string; label: string }> = {
  pending: { bg: "bg-card", border: "border-l-muted-foreground/40", badge: "bg-muted text-muted-foreground", label: "PENDING" },
  in_progress: { bg: "bg-info-bg", border: "border-l-info", badge: "bg-info/20 text-info", label: "IN PROGRESS" },
  addressed: { bg: "bg-success-bg", border: "border-l-success", badge: "bg-success/20 text-success", label: "ADDRESSED" },
  deferred: { bg: "bg-warning-bg", border: "border-l-warning", badge: "bg-warning/20 text-warning", label: "DEFERRED" },
  "n/a": { bg: "bg-muted/50", border: "border-l-muted-foreground/30", badge: "bg-muted text-muted-foreground", label: "N/A" },
};

const CommentCard = ({ comment, onUpdate, projectAddress, projectDescription }: CommentCardProps) => {
  const [generating, setGenerating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const style = statusStyles[comment.status];

  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        const mockResponse = `Acknowledged. Plans have been revised on ${comment.sheetReference} to address this comment. ${comment.codeReference ? `Revisions comply with ${comment.codeReference} as noted.` : "All revisions are reflected in the updated drawings."} Please refer to the revised plans for the specific changes made.`;
        let text = "";
        for (const word of mockResponse.split(" ")) {
          text += (text ? " " : "") + word;
          onUpdate({ ...comment, aiResponse: text, userResponse: text, status: "in_progress" });
          await new Promise(r => setTimeout(r, 30));
        }
        setGenerating(false);
        return;
      }
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a California licensed architect preparing a Plan Check Response Letter. Write a professional, specific response to this city plan check comment. The response should: (1) acknowledge the comment, (2) state specifically what was done on the plans to address it (reference specific sheet numbers and details), (3) confirm code compliance. Be concise but complete. 2-4 sentences. Do NOT use generic responses like 'see plans' — be specific about what was revised." },
            { role: "user", content: `Comment: "${comment.commentText}"\nCode Reference: "${comment.codeReference}"\nSheet: "${comment.sheetReference}"\nProject: "${projectDescription}"\nProject Address: "${projectAddress}"` },
          ],
          max_tokens: 300,
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "Error generating response.";
      onUpdate({ ...comment, aiResponse: text, userResponse: text });
    } catch {
      onUpdate({ ...comment, aiResponse: "Error generating response. Please try again.", userResponse: comment.userResponse });
    }
    setGenerating(false);
  };

  const setStatus = (status: CommentStatus) => {
    onUpdate({ ...comment, status });
    setShowStatusMenu(false);
  };

  return (
    <div className={`rounded-lg border ${style.bg} border-l-4 ${style.border} shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-foreground bg-navy/10 px-2 py-0.5 rounded">#{comment.number}</span>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{comment.sheetReference}</span>
          {comment.codeReference && (
            <span className="font-mono text-[10px] text-gold bg-navy px-2 py-0.5 rounded">{comment.codeReference}</span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{comment.discipline}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${style.badge}`}
          >
            {style.label} <ChevronDown className="w-3 h-3" />
          </button>
          {showStatusMenu && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-lg z-10 min-w-[140px]">
              {(["pending", "in_progress", "addressed", "deferred", "n/a"] as CommentStatus[]).map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider hover:bg-muted transition-colors ${comment.status === s ? "text-gold font-bold" : "text-foreground"}`}>
                  {comment.status === s ? "● " : "○ "}{statusStyles[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">📌 City Comment:</p>
        <p className="font-body text-sm text-foreground leading-relaxed">{comment.commentText}</p>
      </div>

      {/* Response */}
      <div className="px-4 pb-4">
        <div className="border-t border-border/50 pt-3">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">✏️ Your Response:</p>
          <textarea
            value={comment.userResponse}
            onChange={e => onUpdate({ ...comment, userResponse: e.target.value })}
            rows={3}
            placeholder="Type your response here, or click AI Generate below..."
            className="w-full px-3 py-2 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-y"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAIGenerate}
              disabled={generating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {generating ? (
                <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
              ) : comment.aiResponse ? (
                <><RotateCcw className="w-3 h-3" /> Regenerate</>
              ) : (
                <><Sparkles className="w-3 h-3" /> AI Generate Response</>
              )}
            </button>
            <button
              onClick={() => setStatus("addressed")}
              className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success font-mono text-[10px] uppercase tracking-wider rounded hover:bg-success/20 transition-colors"
            >
              ✓ Mark Addressed
            </button>
            <button
              onClick={() => setStatus("n/a")}
              className="flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-muted/80 transition-colors"
            >
              — Mark N/A
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DisciplineSectionProps {
  discipline: Discipline;
  icon: string;
  comments: CityComment[];
  onUpdateComment: (updated: CityComment) => void;
  projectAddress: string;
  projectDescription: string;
}

export const DisciplineSection = ({ discipline, icon, comments, onUpdateComment, projectAddress, projectDescription }: DisciplineSectionProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const addressed = comments.filter(c => c.status === "addressed").length;
  const pending = comments.filter(c => c.status === "pending").length;

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
          {comments.length} comment{comments.length !== 1 ? "s" : ""} · {addressed} addressed · {pending} pending
        </span>
        <span className="ml-auto">
          {collapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </span>
      </button>
      {!collapsed && (
        <div className="space-y-3 mt-3">
          {comments.map(c => (
            <CommentCard
              key={c.id}
              comment={c}
              onUpdate={onUpdateComment}
              projectAddress={projectAddress}
              projectDescription={projectDescription}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
