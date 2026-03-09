import { useState, useRef, DragEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Upload as UploadIcon, X, FileText, Rocket, CheckCircle2, AlertCircle, Pencil, Loader2, Sparkles } from "lucide-react";
import { Jurisdiction, ProjectType } from "@/types";

const jurisdictionOptions = [
  { value: "san_mateo" as Jurisdiction, label: "City of San Mateo" },
  { value: "san_leandro" as Jurisdiction, label: "City of San Leandro" },
  { value: "milpitas" as Jurisdiction, label: "City of Milpitas" },
  { value: "san_bruno" as Jurisdiction, label: "City of San Bruno" },
  { value: "fremont" as Jurisdiction, label: "City of Fremont" },
  { value: "union_city" as Jurisdiction, label: "City of Union City" },
  { value: "other" as Jurisdiction, label: "Other" },
];

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: "residential_remodel", label: "Residential Remodel" },
  { value: "residential_addition", label: "Residential Addition" },
  { value: "new_adu_detached", label: "New Detached ADU" },
  { value: "new_adu_attached", label: "New Attached ADU" },
  { value: "new_sfr", label: "New Single Family Residence" },
  { value: "commercial_ti", label: "Commercial TI" },
  { value: "solar_pv", label: "Solar / PV System" },
  { value: "demolition", label: "Demolition" },
  { value: "other", label: "Other" },
];

type ExtractionStatus = "idle" | "extracting" | "done";

interface ExtractedField {
  value: string;
  confidence: "high" | "medium" | "low" | "manual";
  autoDetected: boolean;
}

const confidenceColors: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-success/10", text: "text-success", label: "Auto-detected" },
  medium: { bg: "bg-warning/10", text: "text-warning", label: "Likely match" },
  low: { bg: "bg-info/10", text: "text-info", label: "Needs review" },
  manual: { bg: "bg-muted", text: "text-muted-foreground", label: "Manual entry" },
};

// Simulated extraction results based on filename
const simulateExtraction = (fileName: string): Record<string, ExtractedField> => {
  const isResidential = /res|house|home|sfr|adu|remodel|addition|kitchen|bath/i.test(fileName);
  const isCommercial = /commercial|office|retail|ti|tenant/i.test(fileName);
  
  return {
    address: {
      value: isResidential ? "12 N Norfolk St, San Mateo, CA 94403" : isCommercial ? "450 E 3rd Ave, Suite 200, San Mateo, CA" : "1234 Main St, San Mateo, CA 94401",
      confidence: "high",
      autoDetected: true,
    },
    apn: {
      value: "035-432-120",
      confidence: "medium",
      autoDetected: true,
    },
    permitNumber: {
      value: `BD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`,
      confidence: "low",
      autoDetected: true,
    },
    jurisdiction: {
      value: "san_mateo",
      confidence: "high",
      autoDetected: true,
    },
    projectType: {
      value: isResidential ? "residential_remodel" : isCommercial ? "commercial_ti" : "other",
      confidence: isResidential || isCommercial ? "high" : "low",
      autoDetected: true,
    },
    applicantName: {
      value: "J. Smith",
      confidence: "medium",
      autoDetected: true,
    },
    applicantEmail: {
      value: "",
      confidence: "manual",
      autoDetected: false,
    },
    squareFootage: {
      value: isResidential ? "1,850" : isCommercial ? "4,200" : "",
      confidence: isResidential || isCommercial ? "medium" : "manual",
      autoDetected: isResidential || isCommercial,
    },
    projectDescription: {
      value: isResidential
        ? "Residential remodel including kitchen renovation, bathroom upgrade, new gas fireplace"
        : isCommercial
          ? "Commercial tenant improvement — new partition walls, HVAC modifications"
          : "",
      confidence: isResidential || isCommercial ? "medium" : "manual",
      autoDetected: isResidential || isCommercial,
    },
    sheetsDetected: {
      value: "A0.0, A1.1, A3.1, A4.1, A6.0, S1.0, M1.0, E1.0",
      confidence: "high",
      autoDetected: true,
    },
  };
};

const extractionSteps = [
  { label: "Reading cover sheet...", duration: 800 },
  { label: "Scanning title block...", duration: 600 },
  { label: "Extracting project address & APN...", duration: 700 },
  { label: "Detecting project type...", duration: 500 },
  { label: "Identifying sheet index...", duration: 600 },
  { label: "Parsing applicant information...", duration: 500 },
  { label: "Matching jurisdiction...", duration: 400 },
  { label: "Extraction complete ✓", duration: 300 },
];

const inputClasses = "w-full px-3 py-2 bg-card border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";

const UploadPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>("idle");
  const [extractionStep, setExtractionStep] = useState(0);
  const [extractedFields, setExtractedFields] = useState<Record<string, ExtractedField>>({});

  // Editable form state (populated from extraction)
  const [address, setAddress] = useState("");
  const [apn, setApn] = useState("");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("san_mateo");
  const [projectType, setProjectType] = useState<ProjectType>("residential_remodel");
  const [permitNumber, setPermitNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (pdfs.length > 0) {
      setFiles(prev => [...prev, ...pdfs]);
      // Start extraction on first file add
      if (files.length === 0 && extractionStatus === "idle") {
        startExtraction(pdfs[0].name);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setExtractionStatus("idle");
      setExtractedFields({});
      setExtractionStep(0);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
    e.target.value = "";
  };

  const startExtraction = (fileName: string) => {
    setExtractionStatus("extracting");
    setExtractionStep(0);

    // Animate through extraction steps
    let step = 0;
    const runStep = () => {
      if (step < extractionSteps.length) {
        setExtractionStep(step);
        step++;
        setTimeout(runStep, extractionSteps[step - 1]?.duration || 500);
      } else {
        // Done — populate fields
        const results = simulateExtraction(fileName);
        setExtractedFields(results);
        setAddress(results.address.value);
        setApn(results.apn.value);
        setJurisdiction(results.jurisdiction.value as Jurisdiction);
        setProjectType(results.projectType.value as ProjectType);
        setPermitNumber(results.permitNumber.value);
        setApplicantName(results.applicantName.value);
        setApplicantEmail(results.applicantEmail.value);
        setSquareFootage(results.squareFootage.value);
        setProjectDescription(results.projectDescription.value);
        setExtractionStatus("done");
      }
    };
    setTimeout(runStep, 400);
  };

  const handleStart = () => {
    if (!address.trim()) return;
    const caseId = `case-${Date.now()}`;
    const uploadData = {
      caseId,
      address: address.trim(),
      apn,
      jurisdiction,
      projectType,
      permitNumber: permitNumber || `BD-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000 + 100000)}`,
      applicantName,
      applicantEmail,
      fileName: files[0]?.name || "plans.pdf",
      fileSize: files.reduce((a, f) => a + f.size, 0),
    };
    sessionStorage.setItem("calplancheck_upload", JSON.stringify(uploadData));
    navigate(`/processing/${caseId}`);
  };

  const autoDetectedCount = Object.values(extractedFields).filter(f => f.autoDetected).length;
  const totalFields = Object.keys(extractedFields).length;

  const FieldIndicator = ({ field }: { field?: ExtractedField }) => {
    if (!field) return null;
    const style = confidenceColors[field.confidence];
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono ${style.bg} ${style.text}`}>
        {field.autoDetected ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Pencil className="w-2.5 h-2.5" />}
        {style.label}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="bg-cream min-h-[calc(100vh-5.25rem)]">
        <div className="container py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-[32px] font-bold text-foreground mb-3">
              Upload Plan Set for AI Review
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
              Upload your PDF plan set. Our AI will automatically extract project details and then check every item against California building codes.
            </p>
          </div>

          {/* Step 1: Upload Zone */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gold text-accent-foreground flex items-center justify-center font-mono text-xs font-bold">1</span>
              <h2 className="font-display text-lg font-bold text-foreground">Upload Plan Files</h2>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragging ? "border-gold bg-gold/5" : files.length > 0 ? "border-success/50 bg-success-bg/30" : "border-border hover:border-gold/50 hover:bg-gold/5"
              }`}
              style={{ minHeight: files.length > 0 ? "120px" : "200px" }}
            >
              <input ref={fileRef} type="file" accept=".pdf" multiple onChange={handleFileChange} className="hidden" />
              {files.length === 0 ? (
                <>
                  <UploadIcon className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="font-body text-lg text-foreground mb-1">Drop PDF Plan Set Here</p>
                  <p className="font-body text-sm text-muted-foreground mb-3">or click to browse</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">PDF files · Multi-page plan sets supported</p>
                </>
              ) : (
                <div className="w-full px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="bg-card rounded-lg border border-border p-3 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gold flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium text-foreground truncate">{f.name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        {extractionStatus === "done" && i === 0 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-success/10 text-success font-mono text-[9px]">
                            <CheckCircle2 className="w-3 h-3" /> Extracted
                          </span>
                        )}
                        <button onClick={() => removeFile(i)} className="p-1 hover:bg-muted rounded transition-colors">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 w-full py-2 border border-dashed border-border rounded-lg font-mono text-[10px] text-muted-foreground uppercase tracking-wider hover:border-gold/50 hover:text-foreground transition-colors"
                  >
                    + Add More Files
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Extraction Progress */}
          {extractionStatus === "extracting" && (
            <div className="mb-8 bg-navy rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
                <h3 className="font-display text-lg font-bold text-cream">Extracting Project Details from Plans...</h3>
              </div>
              <div className="space-y-2">
                {extractionSteps.map((step, i) => (
                  <div key={i} className={`flex items-center gap-2 font-mono text-[11px] transition-all duration-300 ${
                    i < extractionStep ? "text-success" :
                    i === extractionStep ? "text-gold" :
                    "text-cream/30"
                  }`}>
                    {i < extractionStep ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : i === extractionStep ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-cream/20 inline-block" />
                    )}
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Extracted & Editable Details */}
          {extractionStatus === "done" && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-gold text-accent-foreground flex items-center justify-center font-mono text-xs font-bold">2</span>
                <h2 className="font-display text-lg font-bold text-foreground">Review Extracted Details</h2>
                <span className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success font-mono text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  {autoDetectedCount} of {totalFields} fields auto-detected
                </span>
              </div>

              <p className="font-body text-sm text-muted-foreground mb-4">
                The following details were extracted from your plan set. Review and edit any fields as needed before starting AI review.
              </p>

              <div className="bg-card rounded-lg border border-border p-6 space-y-5">
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Project Address <span className="text-destructive">*</span>
                      </label>
                      <FieldIndicator field={extractedFields.address} />
                    </div>
                    <input value={address} onChange={e => setAddress(e.target.value)} className={inputClasses} placeholder="123 Main St, City, CA" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">APN</label>
                      <FieldIndicator field={extractedFields.apn} />
                    </div>
                    <input value={apn} onChange={e => setApn(e.target.value)} className={inputClasses} placeholder="035-432-120" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Permit Number</label>
                      <FieldIndicator field={extractedFields.permitNumber} />
                    </div>
                    <input value={permitNumber} onChange={e => setPermitNumber(e.target.value)} className={inputClasses} placeholder="BD-2025-XXXXXX" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Jurisdiction <span className="text-destructive">*</span>
                      </label>
                      <FieldIndicator field={extractedFields.jurisdiction} />
                    </div>
                    <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value as Jurisdiction)} className={inputClasses}>
                      {jurisdictionOptions.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Project Type <span className="text-destructive">*</span>
                      </label>
                      <FieldIndicator field={extractedFields.projectType} />
                    </div>
                    <select value={projectType} onChange={e => setProjectType(e.target.value as ProjectType)} className={inputClasses}>
                      {projectTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Applicant Name</label>
                      <FieldIndicator field={extractedFields.applicantName} />
                    </div>
                    <input value={applicantName} onChange={e => setApplicantName(e.target.value)} className={inputClasses} placeholder="John Smith" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Applicant Email</label>
                      <FieldIndicator field={extractedFields.applicantEmail} />
                    </div>
                    <input value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} className={inputClasses} placeholder="applicant@email.com" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Square Footage</label>
                      <FieldIndicator field={extractedFields.squareFootage} />
                    </div>
                    <input value={squareFootage} onChange={e => setSquareFootage(e.target.value)} className={inputClasses} placeholder="1,850 sq ft" />
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Project Description</label>
                    <FieldIndicator field={extractedFields.projectDescription} />
                  </div>
                  <textarea
                    value={projectDescription}
                    onChange={e => setProjectDescription(e.target.value)}
                    rows={2}
                    className={inputClasses + " resize-y"}
                    placeholder="Brief description of work..."
                  />
                </div>

                {/* Detected Sheets */}
                {extractedFields.sheetsDetected?.autoDetected && (
                  <div className="p-3 bg-navy/5 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gold" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-foreground font-semibold">Sheets Detected in Plan Set</span>
                      <FieldIndicator field={extractedFields.sheetsDetected} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedFields.sheetsDetected.value.split(", ").map((sheet, i) => (
                        <span key={i} className="px-2 py-0.5 bg-card border border-border rounded font-mono text-[10px] text-foreground">
                          {sheet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(confidenceColors).map(([key, style]) => (
                  <span key={key} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded font-mono text-[9px] ${style.bg} ${style.text}`}>
                    {key === "manual" ? <Pencil className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                    {style.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Start Button */}
          {extractionStatus === "done" && (
            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={!address.trim()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-accent-foreground font-mono text-sm uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="w-5 h-5" /> Start AI Plan Review
              </button>
              <p className="font-mono text-[10px] text-muted-foreground mt-3">
                AI agents will check all detected sheets against California building codes
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;