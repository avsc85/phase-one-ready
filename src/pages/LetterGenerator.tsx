import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { loadComments, getCaseInfo, resubmittalRequirements } from "@/lib/caseStorage";
import { CityComment } from "@/types";
import { Loader2, Printer, Copy, Save, Edit3, RefreshCw } from "lucide-react";

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
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("Architect");
  const [licenseNo, setLicenseNo] = useState("");
  const [sigPhone, setSigPhone] = useState("");
  const [sigEmail, setSigEmail] = useState("");
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

  const addressedComments = comments.filter(c => c.status === "addressed" || c.status === "in_progress");
  const disciplines = [...new Set(addressedComments.map(c => c.discipline))];

  const handleGenerate = async () => {
    setGenerating(true);

    // Build the letter from addressed comments (mock generation)
    await new Promise(r => setTimeout(r, 1500));

    const dateStr = new Date(letterDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const grouped: Record<string, CityComment[]> = {};
    addressedComments.forEach(c => {
      if (!grouped[c.discipline]) grouped[c.discipline] = [];
      grouped[c.discipline].push(c);
    });

    let letter = `${signatoryName || "[Your Name]"}\n${signatoryTitle}${licenseNo ? ` · License #${licenseNo}` : ""}\n${sigPhone ? `${sigPhone} · ` : ""}${sigEmail || ""}\n\n${dateStr}\n\n`;
    letter += `${caseInfo?.reviewingDepartment || "Building Department"}\n${caseInfo?.departmentAddress || ""}\n\n`;
    letter += `RE: Plan Check Response Letter\nProject: ${projectAddress}\nPermit: ${permitNumber}\nSubmittal: ${caseInfo?.submittalNumber || 1}${caseInfo?.submittalNumber === 1 ? "st" : caseInfo?.submittalNumber === 2 ? "nd" : "rd"} Review\n\n`;
    letter += `Dear Building Official,\n\nPlease find below our responses to the Plan Check comments dated ${caseInfo?.planDate || "as noted"}. All revisions have been incorporated into the resubmitted plan set with revision clouds and delta numbers as indicated.\n\n`;
    letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (const [disc, cmts] of Object.entries(grouped)) {
      letter += `▸ ${disc.toUpperCase()}\n${"─".repeat(40)}\n\n`;
      for (const c of cmts) {
        letter += `Comment #${c.number}${c.sheetReference ? ` — ${c.sheetReference}` : ""}${c.codeReference ? ` (${c.codeReference})` : ""}\n`;
        letter += `City Comment: ${c.commentText}\n\n`;
        letter += `Response: ${c.userResponse || c.aiResponse || "[RESPONSE NEEDED]"}\n\n`;
      }
    }

    letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    letter += `We trust the above responses and revised plans address the comments satisfactorily. Should you have any questions or require additional information, please do not hesitate to contact us.\n\nRespectfully submitted,\n\n${signatoryName || "[Your Name]"}\n${signatoryTitle}${licenseNo ? `\nLicense #${licenseNo}` : ""}`;

    setGeneratedLetter(letter);
    setGenerating(false);
  };

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Plan Check Response Letter</title><style>body{font-family:'DM Mono',monospace;font-size:12px;line-height:1.6;padding:40px;max-width:8.5in;margin:0 auto;white-space:pre-wrap;}@media print{body{padding:0.5in;}}</style></head><body>${generatedLetter}</body></html>`);
    w.document.close();
    w.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-5.25rem)]">
        {/* Left Config Panel */}
        <aside className="w-[360px] bg-navy flex flex-col overflow-y-auto flex-shrink-0">
          <div className="p-6 border-b border-navy-light">
            <h2 className="font-display text-lg font-bold text-gold">Letter Configuration</h2>
            <p className="font-mono text-[10px] text-cream/40 mt-1">
              📋 {jurisdictionLabels[jurisdiction]} Format — Standard Correction Response
            </p>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Letter Date</label>
              <input type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Your Name / Signatory</label>
              <input value={signatoryName} onChange={e => setSignatoryName(e.target.value)} className={inputClasses} placeholder="John Smith" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Title</label>
              <select value={signatoryTitle} onChange={e => setSignatoryTitle(e.target.value)} className={inputClasses}>
                <option>Architect</option>
                <option>Engineer</option>
                <option>Owner</option>
                <option>Contractor</option>
                <option>Designer</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">License # (optional)</label>
              <input value={licenseNo} onChange={e => setLicenseNo(e.target.value)} className={inputClasses} placeholder="C-XXXXX" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Phone</label>
              <input value={sigPhone} onChange={e => setSigPhone(e.target.value)} className={inputClasses} placeholder="(415) 555-0100" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-1.5">Email</label>
              <input value={sigEmail} onChange={e => setSigEmail(e.target.value)} className={inputClasses} placeholder="you@firm.com" />
            </div>

            <div className="pt-4 border-t border-navy-light">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/50 mb-2">Disciplines Included</p>
              <div className="space-y-1">
                {disciplines.map(d => (
                  <div key={d} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-gold/80" />
                    <span className="font-mono text-[11px] text-cream/70">{d}</span>
                  </div>
                ))}
                {disciplines.length === 0 && (
                  <p className="font-mono text-[10px] text-cream/30 italic">No addressed comments yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-navy-light space-y-3">
            <div className="flex justify-between font-mono text-[10px] text-cream/50">
              <span>{addressedComments.length} comments included</span>
              <span>{disciplines.length} disciplines</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating...</span>
              ) : generatedLetter ? (
                <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Regenerate Letter</span>
              ) : (
                "📄 Generate Response Letter"
              )}
            </button>
          </div>
        </aside>

        {/* Right Document Panel */}
        <div className="flex-1 bg-cream overflow-y-auto">
          {generatedLetter && (
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-2 flex items-center gap-2">
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Edit3 className="w-3 h-3" /> {editing ? "Done Editing" : "Edit"}
              </button>
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Printer className="w-3 h-3" /> Print
              </button>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-cream font-mono text-[10px] uppercase tracking-wider rounded hover:bg-navy-light transition-colors">
                <Copy className="w-3 h-3" /> Copy All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-accent-foreground font-mono text-[10px] uppercase tracking-wider rounded hover:bg-gold-dark transition-colors">
                <Save className="w-3 h-3" /> Save
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
                  <p className="font-mono text-sm">[Your Name]</p>
                  <p className="font-mono text-sm">[Your Address]</p>
                  <p className="font-mono text-sm">[Date]</p>
                  <br />
                  <p className="font-mono text-sm">City of {jurisdictionLabels[jurisdiction]}</p>
                  <p className="font-mono text-sm">Building Division</p>
                  <p className="font-mono text-sm">{caseInfo?.departmentAddress || "[Address]"}</p>
                  <br />
                  <p className="font-mono text-sm">RE: Plan Check Response Letter</p>
                  <p className="font-mono text-sm">Project: {projectAddress}</p>
                  <p className="font-mono text-sm">Permit: {permitNumber}</p>
                  <br />
                  <p className="font-mono text-sm">Dear Building Official,</p>
                  <br />
                  <p className="font-mono text-sm italic">[AI will generate your complete response letter here...]</p>
                  <br />
                  <div className="border-t border-border/30 pt-4 mt-auto">
                    <p className="font-mono text-xs text-center text-muted-foreground/40">
                      ← Click "Generate Response Letter" to create your letter
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Resubmittal Checklist */}
            {generatedLetter && requirements.length > 0 && (
              <div className="mt-6 bg-muted/50 border border-border rounded-lg p-6">
                <h3 className="font-display text-sm font-bold text-foreground mb-3">
                  📋 Resubmittal Checklist — {jurisdictionLabels[jurisdiction]}
                </h3>
                <div className="space-y-2">
                  {requirements.map((req, i) => (
                    <label key={i} className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-border text-gold focus:ring-gold" />
                      <span className="font-body text-sm text-foreground">{req}</span>
                    </label>
                  ))}
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
