import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { PlanCheckCase, ProjectType, Jurisdiction } from "@/types";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

const jurisdictionOptions = [
  { value: "san_mateo" as Jurisdiction, city: "City of San Mateo", dept: "Building Division", address: "330 West 20th Ave, San Mateo, CA 94403" },
  { value: "san_leandro" as Jurisdiction, city: "City of San Leandro", dept: "Community Development", address: "835 E. 14th Street, San Leandro, CA 94577" },
  { value: "milpitas" as Jurisdiction, city: "City of Milpitas", dept: "Building Safety & Housing", address: "455 E. Calaveras Blvd, Milpitas, CA 95035" },
  { value: "san_bruno" as Jurisdiction, city: "City of San Bruno", dept: "Community Development Dept", address: "" },
  { value: "fremont" as Jurisdiction, city: "City of Fremont", dept: "Development Review", address: "39550 Liberty Street, Fremont, CA 94537" },
  { value: "union_city" as Jurisdiction, city: "City of Union City", dept: "Planning Department", address: "" },
  { value: "other" as Jurisdiction, city: "Other / Custom", dept: "Enter details below", address: "" },
];

const projectTypes: { value: ProjectType; label: string; emoji: string }[] = [
  { value: "residential_remodel", label: "Residential Remodel", emoji: "🏠" },
  { value: "residential_addition", label: "Residential Addition", emoji: "🏗️" },
  { value: "new_adu_detached", label: "New Detached ADU", emoji: "🏡" },
  { value: "new_adu_attached", label: "New Attached ADU", emoji: "🏘️" },
  { value: "new_sfr", label: "New Single Family Residence", emoji: "🏠" },
  { value: "commercial_ti", label: "Commercial Tenant Improvement", emoji: "🏢" },
  { value: "bathroom_remodel", label: "Bathroom / Kitchen Remodel", emoji: "🚿" },
  { value: "solar_pv", label: "Solar / PV System", emoji: "☀️" },
  { value: "demolition", label: "Demolition", emoji: "🔨" },
  { value: "other", label: "Other", emoji: "📦" },
];

const stepLabels = ["Project Info", "Jurisdiction", "Project Details", "Review & Create"];

interface FormData {
  projectAddress: string; apn: string; permitNumber: string; planCheckNumber: string;
  planDate: string; expirationDate: string; submittalNumber: number;
  ownerName: string; ownerAddress: string; ownerPhone: string; ownerEmail: string;
  applicantName: string; applicantAddress: string; applicantPhone: string; applicantEmail: string;
  contractorName: string; contractorPhone: string;
  jurisdiction: Jurisdiction; reviewingDepartment: string; departmentAddress: string;
  reviewerName: string; reviewerEmail: string; reviewerPhone: string;
  projectType: ProjectType; projectDescription: string; squareFootage: string;
  numberOfStories: string; constructionType: string; occupancyGroup: string;
}

const initialForm: FormData = {
  projectAddress: "", apn: "", permitNumber: "", planCheckNumber: "",
  planDate: "", expirationDate: "", submittalNumber: 1,
  ownerName: "", ownerAddress: "", ownerPhone: "", ownerEmail: "",
  applicantName: "", applicantAddress: "", applicantPhone: "", applicantEmail: "",
  contractorName: "", contractorPhone: "",
  jurisdiction: "san_mateo", reviewingDepartment: "", departmentAddress: "",
  reviewerName: "", reviewerEmail: "", reviewerPhone: "",
  projectType: "residential_remodel", projectDescription: "", squareFootage: "",
  numberOfStories: "", constructionType: "", occupancyGroup: "",
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
  </div>
);

const inputClasses = "w-full px-3 py-2 bg-card border border-border rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";
const inputErrorClasses = "w-full px-3 py-2 bg-card border border-danger rounded-md font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-danger/50";

const NewCase = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const set = (key: keyof FormData, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const errs: string[] = [];
    if (step === 0) {
      if (!form.projectAddress) errs.push("projectAddress");
      if (!form.permitNumber) errs.push("permitNumber");
      if (!form.ownerName) errs.push("ownerName");
      if (!form.applicantName) errs.push("applicantName");
    }
    if (step === 2) {
      if (!form.projectDescription) errs.push("projectDescription");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(3, s + 1)); };
  const back = () => setStep(s => Math.max(0, s - 1));

  const handleCreate = () => {
    const id = `case-${Date.now()}`;
    const newCase: Partial<PlanCheckCase> = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
      projectAddress: form.projectAddress,
      apn: form.apn,
      permitNumber: form.permitNumber,
      planCheckNumber: form.planCheckNumber,
      planDate: form.planDate,
      expirationDate: form.expirationDate,
      submittalNumber: form.submittalNumber,
      ownerName: form.ownerName,
      ownerAddress: form.ownerAddress,
      applicantName: form.applicantName,
      applicantAddress: form.applicantAddress,
      applicantPhone: form.applicantPhone,
      applicantEmail: form.applicantEmail,
      contractorName: form.contractorName,
      jurisdiction: form.jurisdiction,
      reviewingDepartment: form.reviewingDepartment,
      departmentAddress: form.departmentAddress,
      reviewerName: form.reviewerName,
      reviewerEmail: form.reviewerEmail,
      reviewerPhone: form.reviewerPhone,
      projectType: form.projectType,
      projectDescription: form.projectDescription,
      squareFootage: Number(form.squareFootage) || 0,
      comments: [],
      generatedLetter: "",
      letterGeneratedAt: "",
      letterEditedContent: "",
    };
    const existing = JSON.parse(localStorage.getItem("calplancheck_cases") || "[]");
    existing.push(newCase);
    localStorage.setItem("calplancheck_cases", JSON.stringify(existing));
    navigate(`/case/${id}`);
  };

  const hasError = (key: string) => errors.includes(key);
  const cls = (key: string) => hasError(key) ? inputErrorClasses : inputClasses;

  const selectedJurisdiction = jurisdictionOptions.find(j => j.value === form.jurisdiction);

  return (
    <AppLayout>
      <div className="bg-cream min-h-[calc(100vh-5.25rem)]">
        <div className="container max-w-3xl py-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-medium transition-colors ${
                    i < step ? "bg-gold text-accent-foreground" :
                    i === step ? "bg-gold text-accent-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`font-mono text-[11px] uppercase tracking-wider hidden sm:inline ${
                    i <= step ? "text-foreground" : "text-muted-foreground"
                  }`}>{label}</span>
                </div>
                {i < 3 && <div className={`w-8 md:w-16 h-px mx-2 ${i < step ? "bg-gold" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-lg border border-border p-6 md:p-8">
            {/* Step 1 */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Project & Applicant Information</h2>
                <div className="space-y-6">
                  <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-2">Project Details</h3>
                  <Field label="Project Address" required>
                    <input value={form.projectAddress} onChange={e => set("projectAddress", e.target.value)} className={cls("projectAddress")} placeholder="123 Main St, City, CA 94XXX" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="APN"><input value={form.apn} onChange={e => set("apn", e.target.value)} className={inputClasses} placeholder="XXX-XXX-XXX" /></Field>
                    <Field label="Permit / Application Number" required><input value={form.permitNumber} onChange={e => set("permitNumber", e.target.value)} className={cls("permitNumber")} placeholder="BD-2025-XXXXXX" /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Plan Check Number"><input value={form.planCheckNumber} onChange={e => set("planCheckNumber", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Submittal Number" required>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map(n => (
                          <button key={n} onClick={() => set("submittalNumber", n)}
                            className={`flex-1 py-2 rounded-md font-mono text-xs border transition-colors ${form.submittalNumber === n ? "bg-gold text-accent-foreground border-gold" : "bg-card border-border text-foreground hover:border-gold/50"}`}>
                            {n === 4 ? "4th+" : `${n}${n === 1 ? "st" : n === 2 ? "nd" : "rd"}`}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Plan Date"><input type="date" value={form.planDate} onChange={e => set("planDate", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Expiration Date"><input type="date" value={form.expirationDate} onChange={e => set("expirationDate", e.target.value)} className={inputClasses} /></Field>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-2 pt-4">Property Owner</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Owner Name" required><input value={form.ownerName} onChange={e => set("ownerName", e.target.value)} className={cls("ownerName")} /></Field>
                    <Field label="Owner Address"><input value={form.ownerAddress} onChange={e => set("ownerAddress", e.target.value)} className={inputClasses} /></Field>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-2 pt-4">Applicant / Architect / Contractor</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Applicant Name" required><input value={form.applicantName} onChange={e => set("applicantName", e.target.value)} className={cls("applicantName")} /></Field>
                    <Field label="Applicant Email"><input type="email" value={form.applicantEmail} onChange={e => set("applicantEmail", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Applicant Phone"><input value={form.applicantPhone} onChange={e => set("applicantPhone", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Applicant Address"><input value={form.applicantAddress} onChange={e => set("applicantAddress", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Contractor Name"><input value={form.contractorName} onChange={e => set("contractorName", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Contractor Phone"><input value={form.contractorPhone} onChange={e => set("contractorPhone", e.target.value)} className={inputClasses} /></Field>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Reviewing Department</h2>
                <p className="font-body text-sm text-muted-foreground mb-6">Select the jurisdiction that issued the plan check letter.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                  {jurisdictionOptions.map(j => (
                    <button key={j.value} onClick={() => {
                      set("jurisdiction", j.value);
                      if (j.value !== "other") {
                        set("reviewingDepartment", `${j.city} ${j.dept}`);
                        set("departmentAddress", j.address);
                      }
                    }}
                      className={`text-left p-4 rounded-lg border-2 transition-colors ${form.jurisdiction === j.value ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                      <p className="font-display text-sm font-bold text-foreground">{j.city}</p>
                      <p className="font-body text-xs text-muted-foreground">{j.dept}</p>
                      {j.address && <p className="font-mono text-[10px] text-muted-foreground mt-1">{j.address}</p>}
                    </button>
                  ))}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Reviewer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Reviewer Name"><input value={form.reviewerName} onChange={e => set("reviewerName", e.target.value)} className={inputClasses} /></Field>
                  <Field label="Reviewer Email"><input value={form.reviewerEmail} onChange={e => set("reviewerEmail", e.target.value)} className={inputClasses} /></Field>
                  <Field label="Reviewer Phone"><input value={form.reviewerPhone} onChange={e => set("reviewerPhone", e.target.value)} className={inputClasses} /></Field>
                  <Field label="Department Address"><input value={form.departmentAddress} onChange={e => set("departmentAddress", e.target.value)} className={inputClasses} /></Field>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Project Type & Scope</h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {projectTypes.map(pt => (
                    <button key={pt.value} onClick={() => set("projectType", pt.value)}
                      className={`text-left p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${form.projectType === pt.value ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}>
                      <span className="text-xl">{pt.emoji}</span>
                      <span className="font-sans text-sm text-foreground">{pt.label}</span>
                    </button>
                  ))}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-2 mb-4">Project Scope Details</h3>
                <div className="space-y-4">
                  <Field label="Project Description" required>
                    <textarea value={form.projectDescription} onChange={e => set("projectDescription", e.target.value)} rows={4} className={cls("projectDescription")} placeholder="Describe the scope of work as it appears on plans" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Square Footage"><input type="number" value={form.squareFootage} onChange={e => set("squareFootage", e.target.value)} className={inputClasses} /></Field>
                    <Field label="Number of Stories">
                      <select value={form.numberOfStories} onChange={e => set("numberOfStories", e.target.value)} className={inputClasses}>
                        <option value="">Select</option>
                        <option value="1">1</option><option value="2">2</option><option value="3">3+</option>
                      </select>
                    </Field>
                    <Field label="Construction Type"><input value={form.constructionType} onChange={e => set("constructionType", e.target.value)} className={inputClasses} placeholder="Type V-B" /></Field>
                    <Field label="Occupancy Group"><input value={form.occupancyGroup} onChange={e => set("occupancyGroup", e.target.value)} className={inputClasses} placeholder="R-3" /></Field>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Review Case Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-sm font-bold text-foreground border-b border-border pb-2">Project & Permit Info</h3>
                    <ReviewLine label="Address" value={form.projectAddress} />
                    <ReviewLine label="Permit #" value={form.permitNumber} />
                    <ReviewLine label="Plan Check #" value={form.planCheckNumber} />
                    <ReviewLine label="Submittal" value={`${form.submittalNumber}${form.submittalNumber === 1 ? "st" : form.submittalNumber === 2 ? "nd" : form.submittalNumber === 3 ? "rd" : "th"} Review`} />
                    <ReviewLine label="Owner" value={form.ownerName} />
                    <ReviewLine label="Applicant" value={form.applicantName} />
                    <ReviewLine label="Contractor" value={form.contractorName} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-sm font-bold text-foreground border-b border-border pb-2">Jurisdiction & Project Type</h3>
                    <ReviewLine label="Jurisdiction" value={selectedJurisdiction?.city || ""} />
                    <ReviewLine label="Department" value={form.reviewingDepartment} />
                    <ReviewLine label="Reviewer" value={form.reviewerName} />
                    <ReviewLine label="Project Type" value={projectTypes.find(p => p.value === form.projectType)?.label || ""} />
                    <ReviewLine label="Description" value={form.projectDescription} />
                    <ReviewLine label="Sq. Ft." value={form.squareFootage} />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <button onClick={back} className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-2.5 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors">
                  Create Case & Start Entering Comments <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const ReviewLine = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between gap-4">
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="font-body text-sm text-foreground text-right">{value || "—"}</span>
  </div>
);

export default NewCase;
