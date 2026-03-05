import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { loadComments, getCaseInfo, resubmittalRequirements } from "@/lib/caseStorage";
import { CityComment } from "@/types";
import { Loader2, Printer, Copy, Save, Edit3, RefreshCw, Mail } from "lucide-react";

const jurisdictionLabels: Record<string, string> = {
  san_mateo: "San Mateo", san_leandro: "San Leandro", milpitas: "Milpitas",
  san_bruno: "San Bruno", union_city: "Union City", fremont: "Fremont", other: "Other",
};

const inputClasses = "w-full px-3 py-2 bg-navy-light/50 border border-navy-light rounded-md font-sans text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";

const LetterGenerator = () => {
  const { id } = useParams();
  const [comments, setComments] = useState<CityComment[]>([]);
  const caseInfo = id ? getCaseInfo(id) : null;
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split("T")[0]);
  const [planCheckerName, setPlanCheckerName] = useState("");
  const [planCheckerTitle, setPlanCheckerTitle] = useState("Building Inspector");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) setComments(loadComments(id));
  }, [id]);

  const jurisdiction = caseInfo?.jurisdiction || "san_mateo";
  const projectAddress = caseInfo?.projectAddress || "Unknown Address";
  const permitNumber = caseInfo?.permitNumber || "";
  const requirements = resubmittalRequirements[jurisdiction] || [];

  const approvedComments = comments.filter(c => c.reviewStatus === "approved" || c.reviewStatus === "edited");
  const removedComments = comments.filter(c => c.reviewStatus === "removed");
  const manualComments = approvedComments.filter(c => c.source === "manual");
  const disciplines = [...new Set(approvedComments.map(c => c.discipline))];

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));

    const dateStr = new Date(letterDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const grouped: Record<string, CityComment[]> = {};
    approvedComments.forEach(c => {
      if (!grouped[c.discipline]) grouped[c.discipline] = [];
      grouped[c.discipline].push(c);
    });

    let letter = "";
    letter += `                    PLAN CHECK CORRECTIONS LIST\n\n`;
    letter += `Applicant Name:    ${caseInfo?.applicantName || "[Applicant Name]"}\n`;
    letter += `Applicant Address: ${caseInfo?.applicantAddress || "[Applicant Address]"}\n`;
    letter += `Applicant Phone:   ${caseInfo?.applicantPhone || "[Phone]"}\n`;
    letter += `Email Address:     ${caseInfo?.applicantEmail || "[Email]"}\n\n`;
    letter += `Date Plan Check Completed: ${dateStr}\n`;
    letter += `Plan Check Number:         ${permitNumber}\n`;
    letter += `APN Number:                ${caseInfo?.apn || "[APN]"}\n`;
    letter += `Project Address:           ${projectAddress}\n\n`;
    letter += `Your plans have been reviewed for conformance of the current California\nBuilding Codes, City Ordinances, and City standards. The following\ncorrections or clarifications are required.\n\n`;

    if (requirements.length > 0) {
      letter += `Guidelines for submittal of revised plans:\n`;
      requirements.forEach(req => {
        letter += `• ${req}\n`;
      });
      letter += `\n`;
    }

    letter += `${"━".repeat(55)}\n\n`;

    for (const [disc, cmts] of Object.entries(grouped)) {
      letter += `${disc.toUpperCase()} COMMENTS:\n${"─".repeat(40)}\n\n`;
      for (const c of cmts) {
        const text = c.editedText || c.commentText;
        letter += `Comment ${c.number}. ${c.sheetReference}: ${text}\n\n`;
      }
    }

    letter += `${"━".repeat(55)}\n\n`;
    letter += `If you have any questions, please contact ${planCheckerName || "[Plan Checker Name]"} at ${caseInfo?.reviewerEmail || "[email]"}.\n\n`;
    letter += `${caseInfo?.departmentAddress || "[Department Address]"}  Phone: ${caseInfo?.reviewerPhone || "[phone]"}\n`;

    setGeneratedLetter(letter);
    setGenerating(false);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Plan Check Corrections</title><style>body{font-family:'DM Mono',monospace;font-size:12px;line-height:1.6;padding:40px;max-width:8.5in;margin:0 auto;white-space:pre-wrap;}@media print{body{padding:0.5in;}}</style></head><body>${generatedLetter}</body></html>`);
    w.document.close();
    w.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
  };

  const handleEmail = () => {
    const email = caseInfo?.applicantEmail || "";
    const subject = encodeURIComponent(`Plan Check Corrections — ${projectAddress} — ${permitNumber}`);
    window.open(`mailto:${email}?subject=${subject}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-5.25rem)]">
        {/* Left Config Panel */}
        <aside className="w-[360px] bg-navy flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-6 border-b border-navy-light">
            <h2 className="font-display text-lg font-bold text-gold">Generate Correction Letter</h2>
            <p className="font-mono text-[10px] text-cream/40 mt-1">
              📋 {jurisdictionLabels[jurisdiction]} Format — Official Correction Letter
            </p>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Letter Date</label>
              <input type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Plan Checker Name <span className="text-destructive">*</span></label>
              <input value={planCheckerName} onChange={e => setPlanCheckerName(e.target.value)} className={inputClasses} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Plan Checker Title</label>
              <select value={planCheckerTitle} onChange={e => setPlanCheckerTitle(e.target.value)} className={inputClasses}>
                <option>Building Inspector</option>
                <option>Plan Check Engineer</option>
                <option>Senior Building Inspector</option>
                <option>Plans Examiner</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Department</label>
              <input value={caseInfo?.reviewingDepartment || ""} readOnly className={`${inputClasses} opacity-60`} />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Department Address</label>
              <input value={caseInfo?.departmentAddress || ""} readOnly className={`${inputClasses} opacity-60`} />
            </div>

            {/* Letter Count Summary */}
            <div className="pt-4 border-t border-navy-light">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-2">Letter Summary</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cream/70">✅ Approved comments</span>
                  <span className="font-mono text-[10px] text-cream/50">{approvedComments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cream/70">🗑 Removed (excluded)</span>
                  <span className="font-mono text-[10px] text-cream/50">{removedComments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cream/70">👤 Manual comments</span>
                  <span className="font-mono text-[10px] text-cream/50">{manualComments.length}</span>
                </div>
                <div className="border-t border-navy-light mt-2 pt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cream/80 font-medium">Total in letter</span>
                  <span className="font-mono text-[10px] text-gold font-bold">{approvedComments.length} corrections</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-2">Disciplines Included</p>
              <div className="space-y-1">
                {disciplines.map(d => (
                  <div key={d} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gold/80" />
                    <span className="font-mono text-[11px] text-cream/70">{d}</span>
                  </div>
                ))}
                {disciplines.length === 0 && (
                  <p className="font-mono text-[10px] text-cream/30 italic">No approved comments yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-navy-light">
            <button
              onClick={handleGenerate}
              disabled={generating || approvedComments.length === 0}
              className="w-full py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>
              ) : generatedLetter ? (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Regenerate Letter</span>
              ) : (
                "📄 Generate Official Correction Letter"
              )}
            </button>
          </div>
        </aside>

        {/* Right Document Panel */}
        <div className="flex-1 bg-cream overflow-y-auto">
          {generatedLetter && (
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-2 flex items-center gap-2">
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Edit3 className="w-3 h-3" /> {editing ? "Done Editing" : "✏️ Edit Mode"}
              </button>
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Printer className="w-3 h-3" /> 🖨 Print
              </button>
              <button onClick={handleEmail} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Mail className="w-3 h-3" /> 📧 Email to Applicant
              </button>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Copy className="w-3 h-3" /> Copy All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-gold-dark transition-colors">
                <Save className="w-3 h-3" /> 💾 Save Draft
              </button>
            </div>
          )}

          <div className="max-w-[8.5in] mx-auto p-12">
            {generatedLetter ? (
              <div
                ref={letterRef}
                contentEditable={editing}
                suppressContentEditableWarning
                className={`bg-card border border-border shadow-lg p-12 min-h-[11in] font-mono text-sm text-foreground whitespace-pre-wrap leading-relaxed ${editing ? "ring-2 ring-gold/30" : ""}`}
                onBlur={e => setGeneratedLetter(e.currentTarget.innerText)}
              >
                {generatedLetter}
              </div>
            ) : (
              <div className="bg-card border border-border shadow-lg p-12 min-h-[11in] flex flex-col">
                <div className="text-muted-foreground/40 space-y-4 flex-1">
                  <p className="font-mono text-lg text-center font-bold">PLAN CHECK CORRECTIONS LIST</p>
                  <br />
                  <p className="font-mono text-sm">Applicant Name: {caseInfo?.applicantName || "[Applicant Name]"}</p>
                  <p className="font-mono text-sm">Project Address: {projectAddress}</p>
                  <p className="font-mono text-sm">Permit: {permitNumber}</p>
                  <br />
                  <p className="font-mono text-sm italic">Your plans have been reviewed for conformance of the current California Building Codes...</p>
                  <br />
                  <p className="font-mono text-sm italic">[Correction comments will appear here after generation...]</p>
                  <br />
                  <div className="border-t border-border/30 pt-4 mt-auto">
                    <p className="font-mono text-xs text-center text-muted-foreground/40">
                      ← Click "Generate Official Correction Letter" to create the letter
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LetterGenerator;
