import { useState, useEffect } from "react";
import { CityComment, Discipline } from "@/types";
import { ALL_DISCIPLINES } from "@/lib/caseStorage";
import { X } from "lucide-react";

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (comment: CityComment) => void;
  nextNumber: string;
  defaultDiscipline?: Discipline;
}

const inputClasses = "w-full px-3 py-2 bg-background border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";

const AddCommentModal = ({ open, onClose, onAdd, nextNumber, defaultDiscipline }: AddCommentModalProps) => {
  const [discipline, setDiscipline] = useState<Discipline>(defaultDiscipline || "Architectural");
  const [sheetRef, setSheetRef] = useState("");
  const [codeRef, setCodeRef] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (defaultDiscipline) setDiscipline(defaultDiscipline);
  }, [defaultDiscipline]);

  if (!open) return null;

  const handleAdd = () => {
    if (!text.trim()) return;
    const comment: CityComment = {
      id: `manual-${Date.now()}`,
      number: nextNumber,
      discipline,
      sheetReference: sheetRef || "N/A",
      codeReference: codeRef,
      commentText: text,
      status: "addressed",
      userResponse: "",
      aiResponse: "",
      priority: "required",
      source: "manual",
      reviewStatus: "approved",
      editedText: "",
      aiConfidence: "high",
      missingInfo: "",
      suggestedRectification: "",
      inspectorStatus: "",
    };
    onAdd(comment);
    setSheetRef("");
    setCodeRef("");
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">+ Add Manual Correction Comment</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Discipline</label>
            <select value={discipline} onChange={e => setDiscipline(e.target.value as Discipline)} className={inputClasses}>
              {ALL_DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Sheet Reference</label>
              <input value={sheetRef} onChange={e => setSheetRef(e.target.value)} className={inputClasses} placeholder="Sheet A3.1" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Code Reference</label>
              <input value={codeRef} onChange={e => setCodeRef(e.target.value)} className={inputClasses} placeholder="CRC 310.2" />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Comment Text</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} className={`${inputClasses} resize-y`} placeholder="Describe the correction required..." />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleAdd} disabled={!text.trim()} className="flex-1 py-2 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50">Add Comment</button>
            <button onClick={onClose} className="px-4 py-2 border border-border text-foreground font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommentModal;
