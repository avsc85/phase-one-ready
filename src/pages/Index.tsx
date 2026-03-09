import { forwardRef } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { ArrowRight } from "lucide-react";

const jurisdictions = [
  { emoji: "🏛️", city: "City of San Mateo", dept: "Building Division", permit: "BD-20XX-XXXXXX" },
  { emoji: "🏛️", city: "City of San Leandro", dept: "Community Development", permit: "BRADU-XX-XXXX" },
  { emoji: "🏛️", city: "City of Milpitas", dept: "Building Safety & Housing", permit: "B-BPXX-XXXX" },
  { emoji: "🏛️", city: "City of San Bruno", dept: "Community Development", permit: "BLD-20XX-XXX" },
  { emoji: "🏛️", city: "City of Fremont", dept: "Development Review", permit: "BLD20XX-XXXXX" },
  { emoji: "🏛️", city: "City of Union City", dept: "Planning Department", permit: "Planning Comments" },
];

const stats = [
  { value: "800+", label: "Code Rules Checked Per Submittal" },
  { value: "10–14 hrs → 30 min", label: "Review Time Reduction" },
  { value: "6", label: "Bay Area Jurisdictions Supported" },
  { value: "5", label: "Specialized AI Agents Working in Parallel" },
];

const steps = [
  { emoji: "📤", title: "Upload Plans", desc: "Plan checker uploads the applicant's PDF plan set. Any project type — residential, ADU, commercial TI, addition." },
  { emoji: "🤖", title: "AI Agents Analyze", desc: "5 specialized AI agents read every sheet, dimension, and note. They check compliance against CBC 2022, CRC, Title 24, CALGreen, CMC, CPC, CEC, and local ordinances." },
  { emoji: "👁️", title: "Human Review", desc: "The plan checker reviews every AI-generated finding. Approve, edit, or remove each item. Add manual comments if needed. Full control stays with the inspector." },
  { emoji: "📄", title: "Generate & Send", desc: "One click generates the official correction letter in the exact format required by your jurisdiction — ready to send to the applicant." },
];

const MockLetterPreview = () => (
  <div className="bg-card rounded-lg shadow-2xl border border-border p-6 max-w-sm transform rotate-1 hover:rotate-0 transition-transform">
    <div className="border-b-2 border-gold pb-3 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🏛️</span>
        <span className="font-display text-sm font-bold text-foreground">City of San Mateo</span>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground">Building Division · Plan Check Corrections</p>
    </div>
    <div className="space-y-2">
      <p className="font-mono text-[9px] text-muted-foreground">PLAN CHECK CORRECTIONS LIST</p>
      <div className="h-2 bg-muted rounded w-3/4"></div>
      <div className="h-2 bg-muted rounded w-full"></div>
    </div>
    <div className="mt-4 p-3 bg-warning-bg rounded border border-border">
      <p className="font-mono text-[9px] text-warning mb-1">⚠ CORRECTION #1 — ARCHITECTURAL</p>
      <div className="h-2 bg-warning/20 rounded w-full mb-1"></div>
      <div className="h-2 bg-warning/20 rounded w-4/5"></div>
    </div>
    <div className="mt-2 p-3 bg-warning-bg rounded border border-border">
      <p className="font-mono text-[9px] text-warning mb-1">⚠ CORRECTION #2 — ELECTRICAL</p>
      <div className="h-2 bg-warning/20 rounded w-full mb-1"></div>
      <div className="h-2 bg-warning/20 rounded w-3/4"></div>
    </div>
    <div className="mt-3 flex items-center gap-1">
      <div className="h-1.5 w-1.5 rounded-full bg-gold"></div>
      <p className="font-mono text-[8px] text-muted-foreground">7 more corrections...</p>
    </div>
  </div>
);

const Index = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <AppLayout showFooter ref={ref}>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-dark to-navy-light overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)"
        }} />
        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[3px] text-gold mb-4">
                California Building Departments · Plan Check AI
              </p>
              <h1 className="font-display text-4xl md:text-[52px] md:leading-[1.1] font-bold text-cream mb-6">
                AI Agents Review Building Plans. You Just Approve.
              </h1>
              <p className="font-body text-lg text-cream/70 mb-8 max-w-xl leading-relaxed">
                Upload applicant plans. Our AI reads every sheet, checks against 800+ California code rules, and generates all correction comments automatically. You review, approve, and send the official letter — in under an hour.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
                >
                  Upload Plans for AI Review <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/case/case-001"
                  className="inline-flex items-center justify-center px-6 py-3 border border-cream/40 text-cream font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-cream/10 transition-colors"
                >
                  View Demo Case
                </Link>
              </div>
              {/* Quick Demo Row */}
              <div className="mt-6 pt-4 border-t border-cream/20">
                <p className="font-mono text-[10px] text-cream/40 uppercase tracking-wider mb-3">── Quick Demo ──</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/case/case-001"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-cream/30 text-cream font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-cream/10 transition-colors"
                  >
                    📋 Review AI Findings
                    <span className="text-cream/40 normal-case tracking-normal">12 Norfolk St · 27 comments</span>
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-cream/30 text-cream font-mono text-[10px] uppercase tracking-[2px] rounded-md hover:bg-cream/10 transition-colors"
                  >
                    🎬 Watch AI Processing
                    <span className="text-cream/40 normal-case tracking-normal">Upload → AI → Letter</span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-cream/60 font-mono text-[11px] mt-4">
                <span>✓ 2022 CBC / CRC Compliant</span>
                <span>✓ 6 Bay Area Jurisdictions</span>
                <span>✓ AI-Powered Plan Review</span>
              </div>
            </div>
            <div className="md:col-span-2 hidden md:flex justify-center">
              <MockLetterPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gold">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className={`text-center ${i > 0 ? "md:border-l md:border-gold-dark/30" : ""}`}>
                <p className="font-display text-2xl md:text-3xl font-bold text-accent-foreground">{stat.value}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-accent-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            From Uploaded Plans to Official Correction Letter
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-cream border-2 border-gold flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  Step {i + 1} — {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-gold" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-4">
            Ready to review plans in 30 minutes instead of 14 hours?
          </h2>
          <p className="font-body text-cream/60 mb-8 max-w-lg mx-auto">
            Upload your first plan set and let our AI agents do the heavy lifting.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-accent-foreground font-mono text-sm uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
          >
            Upload Plans for AI Review
          </Link>
        </div>
      </section>
    </AppLayout>
  );
});

Index.displayName = "Index";

export default Index;
