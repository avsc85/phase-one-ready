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

const UploadPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [address, setAddress] = useState("");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("san_mateo");
  const [projectType, setProjectType] = useState<ProjectType>("residential_remodel");
  const [permitNumber, setPermitNumber] = useState("");

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
    navigate("/processing/demo-001");
  };

  return (
    <AppLayout>
      <div className="bg-cream min-h-[calc(100vh-5.25rem)]">
        <div className="container max-w-3xl py-12">
          <div className="text-center mb-10">
            <h1 className="font-display text-[32px] font-bold text-foreground mb-3">
              Upload Your Plan Set for AI Review
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-xl mx-auto">
              Our AI agents will analyze your drawings against California building codes and automatically identify all non-compliant items.
            </p>
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragging ? "border-gold bg-gold/5" : file ? "border-success bg-success-bg" : "border-border hover:border-gold/50 hover:bg-gold/5"
            }`}
            style={{ minHeight: "400px" }}
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
                <p className="font-body text-lg text-foreground mb-1">Drop PDF plans here</p>
                <p className="font-body text-sm text-muted-foreground mb-4">or click to browse</p>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">Supports: PDF (up to 50MB)</p>
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
                  Project Address <span className="text-danger">*</span>
                </label>
                <input value={address} onChange={e => setAddress(e.target.value)} className={inputClasses} placeholder="123 Main St, City, CA" />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Jurisdiction <span className="text-danger">*</span>
                </label>
                <select value={jurisdiction} onChange={e => setJurisdiction(e.target.value as Jurisdiction)} className={inputClasses}>
                  {jurisdictionOptions.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  Project Type <span className="text-danger">*</span>
                </label>
                <select value={projectType} onChange={e => setProjectType(e.target.value as ProjectType)} className={inputClasses}>
                  {projectTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Permit Number</label>
                <input value={permitNumber} onChange={e => setPermitNumber(e.target.value)} className={inputClasses} placeholder="Optional" />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleStart}
              disabled={!address.trim()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-accent-foreground font-mono text-sm uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Rocket className="w-5 h-5" /> Start AI Plan Review
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
