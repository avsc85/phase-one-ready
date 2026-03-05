import { useState } from "react";
import { CityComment, Discipline } from "@/types";
import { ALL_DISCIPLINES } from "@/lib/caseStorage";
import { X } from "lucide-react";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (comment: CityComment) => void;
  nextNumber: string;
}

const inputClasses = "w-full px-3 py-2 bg-card border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";

const AddCommentModal = ({ open, onClose, onAdd, nextNumber }: AddCommentModalProps) => {
  const [discipline, setDiscipline] = useState<Discipline>("Architectural");
  const [number, setNumber] = useState(nextNumber);
  const [sheetReference, setSheetReference] = useState("");
  const [codeReference, setCodeReference] = useState("");
  const [commentText, setCommentText] = useState("");
  const [priority, setPriority] = useState<"required" | "advisory">("required");

  if (!open) return null;

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      number: number || nextNumber,
      discipline,
      sheetReference,
      codeReference,
      commentText,
      status: "pending",
      userResponse: "",
      aiResponse: "",
      priority,
    });
    setCommentText("");
    setSheetReference("");
    setCodeReference("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/60">
      <div className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-lg font-bold text-foreground">Add Comment</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Discipline</label>
              <select value={discipline} onChange={e => setDiscipline(e.target.value as Discipline)} className={inputClasses}>
                {ALL_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Comment #</label>
              <input value={number} onChange={e => setNumber(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sheet Reference</label>
              <input value={sheetReference} onChange={e => setSheetReference(e.target.value)} className={inputClasses} placeholder="Sheet A1.1" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Code Reference</label>
              <input value={codeReference} onChange={e => setCodeReference(e.target.value)} className={inputClasses} placeholder="CRC 311.3" />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Comment Text</label>
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={4} className={inputClasses} placeholder="Enter the city comment..." />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Priority</label>
            <div className="flex gap-2">
              {(["required", "advisory"] as const).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-md font-mono text-xs border transition-colors capitalize ${priority === p ? "bg-gold text-accent-foreground border-gold" : "bg-card border-border text-foreground hover:border-gold/50"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors">Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default AddCommentModal;
