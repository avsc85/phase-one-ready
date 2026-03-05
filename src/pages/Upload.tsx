import { useState, useRef, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Upload as UploadIcon, X, FileText, Rocket } from "lucide-react";
import { Jurisdiction, ProjectType } from "@/types";

const jurisdictionOptions = [
  { value: "san_mateo" as Jurisdiction, label: "City of San Mateo" },
  { value: "san_leandro" as Jurisdiction, label: "City of San Leandro" },
  { value: "milpitas" as Jurisdiction, label: "City of Milpitas" },
  { value: "san_bruno" as Jurisdiction, label: "City of San Bruno" },
  { value: "fremont" as Jurisdiction, label: "City of Fremont" },
  { value: "union_city" as Jurisdiction, label: "City of Union City" },
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

const inputClasses = "w-full px-3 py-2 bg-card border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";

const checklistData: Record<string, { icon: string; name: string; items: string[]; moreCount: number }[]> = {
  residential_remodel: [
    { icon: "📐", name: "Architectural (CBC/CRC)", items: ["Egress windows — CRC 310.2", "Exterior landings — CRC 311.3", "Guards & handrails — CRC 312", "Attic access — CRC 807.1", "Smoke detectors — CRC 314.3", "Safety glazing — CRC 308.4"], moreCount: 12 },
    { icon: "⚡", name: "Electrical (CEC)", items: ["GFCI receptacles — CEC 210.52(D)", "Kitchen island outlets — CEC 210.52(C)", "AFCI protection — CEC 210.12(B)"], moreCount: 8 },
    { icon: "🔧", name: "Mechanical (CMC)", items: ["Kitchen exhaust — CMC 405.4", "AC receptacle — CMC 301.4", "Dryer venting — CMC 504.4"], moreCount: 6 },
    { icon: "🚿", name: "Plumbing (CPC)", items: ["Gas line diagram — CPC 1208.1", "Gas sizing — CPC 1215", "Shower receptor — CPC 408.5"], moreCount: 5 },
    { icon: "💡", name: "Energy (Title 24)", items: ["High-efficacy lighting — CEnC 150.0", "CF1R forms — Title 24 Part 6"], moreCount: 4 },
    { icon: "🌿", name: "Green Building (CALGreen)", items: ["MWELO screening — CGC 4.304.1", "C&D waste plan"], moreCount: 3 },
    { icon: "🏗️", name: "Public Works", items: ["Stormwater — STOPPP Type II", "BMP requirements", "Sewer lateral inspection"], moreCount: 3 },
  ],
  default: [
    { icon: "📐", name: "Architectural", items: ["Building code compliance", "Egress requirements", "Fire separation"], moreCount: 15 },
    { icon: "🔩", name: "Structural", items: ["Load calculations", "Foundation details", "Seismic requirements"], moreCount: 10 },
    { icon: "⚡", name: "Electrical", items: ["Service sizing", "Panel schedules", "GFCI/AFCI"], moreCount: 8 },
    { icon: "🔧", name: "Mechanical", items: ["HVAC sizing", "Ventilation", "Duct routing"], moreCount: 6 },
  ],
};

const UploadPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [address, setAddress] = useState("");
  const [apn, setApn] = useState("");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("san_mateo");
  const [projectType, setProjectType] = useState<ProjectType>("residential_remodel");
  const [permitNumber, setPermitNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleStart = () => {
    if (!address.trim()) return;

    // Create a new case and store its metadata for the processing page
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
      fileName: file?.name || "plans.pdf",
      fileSize: file?.size || 0,
    };
    sessionStorage.setItem("calplancheck_upload", JSON.stringify(uploadData));
    navigate(`/processing/${caseId}`);
  };

  const checklist = checklistData[projectType] || checklistData.default;
  const totalRules = checklist.reduce((a, c) => a + c.items.length + c.moreCount, 0);

  return (
    <AppLayout>
      <div className="bg-cream min-h-[calc(100vh-5.25rem)]">
        <div className="container py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Side - Upload & Form (55%) */}
            <div className="lg:col-span-7">
              <h1 className="font-display text-[32px] font-bold text-foreground mb-3">
                Upload Plan Set for AI Review
              </h1>
              <p className="font-body text-base text-muted-foreground max-w-xl mb-8">
                Our AI agents will read the plans, check every item against California building codes, and generate all correction comments automatically.
              </p>

              {/* Upload Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragging ? "border-gold bg-gold/5" : file ? "border-success bg-success-bg" : "border-border hover:border-gold/50 hover:bg-gold/5"
                }`}
                style={{ minHeight: "220px" }}
              >
                <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                {file ? (
                  <div className="bg-card rounded-lg border border-border p-5 flex items-center gap-4 min-w-[360px]">
                    <FileText className="w-8 h-8 text-gold" />
                    <div className="flex-1">
                      <p className="font-mono text-sm font-medium text-foreground">{file.name}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-muted rounded transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="font-body text-lg text-foreground mb-1">Drop PDF Plan Set Here</p>
                    <p className="font-body text-sm text-muted-foreground mb-4">or click to browse</p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">Supports: PDF up to 100MB · Multi-page plan sets accepted</p>
                    <button className="px-5 py-2 bg-card border border-border rounded-md font-mono text-xs uppercase tracking-wider text-foreground hover:border-gold/50 transition-colors">
                      Browse Files
                    </button>
                  </>
                )}
              </div>

              {/* Project Info Form */}
              <div className="mt-8 bg-card rounded-lg border border-border p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">Project Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Project Address <span className="text-destructive">*</span>
                    </label>
                    <input value={address} onChange={e => setAddress(e.target.value)} className={inputClasses} placeholder="123 Main St, City, CA" />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      APN (Assessor's Parcel Number)
                    </label>
                    <input value={apn} onChange={e => setApn(e.target.value)} className={inputClasses} placeholder="035-432-120" />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Permit / Application Number
                    </label>
                    <input value={permitNumber} onChange={e => setPermitNumber(e.target.value)} className={inputClasses} placeholder="BD-2025-XXXXXX" />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Jurisdiction <span className="text-destructive">*</span>
                    </label>
                    <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value as Jurisdiction)} className={inputClasses}>
                      {jurisdictionOptions.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      Project Type <span className="text-destructive">*</span>
                    </label>
                    <select value={projectType} onChange={e => setProjectType(e.target.value as ProjectType)} className={inputClasses}>
                      {projectTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Applicant Name</label>
                    <input value={applicantName} onChange={e => setApplicantName(e.target.value)} className={inputClasses} placeholder="John Smith" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Applicant Email (for sending letter)</label>
                    <input value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} className={inputClasses} placeholder="applicant@email.com" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleStart}
                  disabled={!address.trim()}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-accent-foreground font-mono text-sm uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Rocket className="w-5 h-5" /> 🚀 Start AI Plan Review →
                </button>
              </div>
            </div>

            {/* Right Side - AI Checklist Coverage (45%) */}
            <div className="lg:col-span-5">
              <div className="bg-navy rounded-xl p-6 sticky top-24">
                <h3 className="font-display text-lg font-bold text-gold mb-1">AI Checklist Coverage</h3>
                <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider mb-6">Every item checked for this project type</p>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {checklist.map((group, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{group.icon}</span>
                        <span className="font-mono text-[11px] text-cream/80 font-medium">{group.name}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {group.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span className="text-success text-[10px] mt-0.5">✓</span>
                            <span className="font-mono text-[10px] text-cream/60">{item}</span>
                          </div>
                        ))}
                        {group.moreCount > 0 && (
                          <p className="font-mono text-[10px] text-cream/40 ml-4">+ {group.moreCount} more items</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-navy-light">
                  <p className="font-mono text-[11px] text-gold font-medium">
                    <strong>{totalRules} rules checked</strong> across {checklist.length} disciplines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
