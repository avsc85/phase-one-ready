import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { loadComments, getCaseInfo, resubmittalRequirements } from "@/lib/caseStorage";
import { CityComment } from "@/types";
import { ArrowLeft, Printer } from "lucide-react";

const jurisdictionLabels: Record<string, string> = {
  san_mateo: "San Mateo", san_leandro: "San Leandro", milpitas: "Milpitas",
  san_bruno: "San Bruno", union_city: "Union City", fremont: "Fremont", other: "Other",
};

const PrintPreview = () => {
  const { id } = useParams<{ id: string }>();
  const [comments, setComments] = useState<CityComment[]>([]);
  const caseInfo = id ? getCaseInfo(id) : null;

  useEffect(() => {
    if (id) setComments(loadComments(id));
  }, [id]);

  const jurisdiction = caseInfo?.jurisdiction || "san_mateo";
  const projectAddress = caseInfo?.projectAddress || "Unknown Address";
  const permitNumber = caseInfo?.permitNumber || "";
  const requirements = resubmittalRequirements[jurisdiction] || [];
  const approvedComments = comments.filter(c => c.reviewStatus === "approved" || c.reviewStatus === "edited");

  const grouped: Record<string, CityComment[]> = {};
  approvedComments.forEach(c => {
    if (!grouped[c.discipline]) grouped[c.discipline] = [];
    grouped[c.discipline].push(c);
  });

  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-muted">
      {/* Toolbar - hidden during print */}
      <div className="print:hidden sticky top-0 z-10 bg-navy border-b border-gold px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/case/${id}/letter`} className="flex items-center gap-2 text-cream/70 hover:text-cream font-mono text-[11px] uppercase tracking-wider transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Letter Generator
          </Link>
          <span className="text-cream/30">|</span>
          <span className="font-mono text-[11px] text-cream/50">{projectAddress} · {permitNumber}</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Letter Content */}
      <div className="max-w-[8.5in] mx-auto my-8 print:my-0 bg-card border border-border print:border-0 shadow-lg print:shadow-none p-12 min-h-[11in]">
        {/* Letterhead */}
        <div className="text-center mb-8 pb-4 border-b-2 border-foreground/20">
          <p className="font-display text-xl font-bold text-foreground">
            {jurisdictionLabels[jurisdiction] ? `City of ${jurisdictionLabels[jurisdiction]}` : jurisdiction}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {caseInfo?.reviewingDepartment || "Building Division"}
          </p>
          {caseInfo?.departmentAddress && (
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{caseInfo.departmentAddress}</p>
          )}
        </div>

        <p className="font-mono text-sm text-foreground whitespace-pre-line mb-6">
{`                    PLAN CHECK CORRECTIONS LIST

Applicant Name:    ${caseInfo?.applicantName || "[Applicant Name]"}
Applicant Address: ${caseInfo?.applicantAddress || "[Applicant Address]"}
Applicant Phone:   ${caseInfo?.applicantPhone || "[Phone]"}
Email Address:     ${caseInfo?.applicantEmail || "[Email]"}

Date Plan Check Completed: ${dateStr}
Plan Check Number:         ${permitNumber}
APN Number:                ${caseInfo?.apn || "[APN]"}
Project Address:           ${projectAddress}`}
        </p>

        <p className="font-body text-sm text-foreground leading-relaxed mb-6">
          Your plans have been reviewed for conformance of the current California Building Codes, City Ordinances, and City standards. The following corrections or clarifications are required.
        </p>

        {requirements.length > 0 && (
          <div className="mb-6">
            <p className="font-mono text-xs font-bold text-foreground mb-2">Guidelines for submittal of revised plans:</p>
            <ul className="list-disc list-inside space-y-1">
              {requirements.map((req, i) => (
                <li key={i} className="font-body text-sm text-foreground leading-relaxed">{req}</li>
              ))}
            </ul>
          </div>
        )}

        <hr className="border-foreground/30 my-6" />

        {/* Comments by discipline */}
        {Object.entries(grouped).map(([disc, cmts]) => (
          <div key={disc} className="mb-6 break-inside-avoid">
            <p className="font-mono text-sm font-bold text-foreground uppercase tracking-wider mb-3 border-b border-foreground/20 pb-1">
              {disc} Comments:
            </p>
            {cmts.map(c => (
              <div key={c.id} className="mb-4 break-inside-avoid">
                <p className="font-body text-sm text-foreground leading-relaxed">
                  <span className="font-mono font-bold">Comment {c.number}.</span>{" "}
                  <span className="font-mono text-xs text-muted-foreground">{c.sheetReference}:</span>{" "}
                  {c.editedText || c.commentText}
                </p>
              </div>
            ))}
          </div>
        ))}

        {approvedComments.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-sm text-muted-foreground">No approved comments yet. Approve comments in the Case Detail view first.</p>
            <Link to={`/case/${id}`} className="inline-block mt-4 px-4 py-2 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors">
              Go to Case Review
            </Link>
          </div>
        )}

        <hr className="border-foreground/30 my-6" />

        <p className="font-body text-sm text-foreground">
          If you have any questions, please contact the Building Division at{" "}
          {caseInfo?.reviewerEmail || "[email]"}.
        </p>
        {caseInfo?.departmentAddress && (
          <p className="font-mono text-xs text-muted-foreground mt-2">
            {caseInfo.departmentAddress} · Phone: {caseInfo.reviewerPhone || "[phone]"}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintPreview;
