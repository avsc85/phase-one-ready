import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Building2, CheckCircle2, FileText, ArrowRight, Clipboard, Send } from "lucide-react";

const jurisdictions = [
  { emoji: "🏛️", city: "City of San Mateo", dept: "Building Division", permit: "BD-20XX-XXXXXX" },
  { emoji: "🏛️", city: "City of San Leandro", dept: "Community Development", permit: "BRADU-XX-XXXX" },
  { emoji: "🏛️", city: "City of Milpitas", dept: "Building Safety & Housing", permit: "B-BPXX-XXXX" },
  { emoji: "🏛️", city: "City of San Bruno", dept: "Community Development", permit: "BLD-20XX-XXX" },
  { emoji: "🏛️", city: "City of Fremont", dept: "Development Review", permit: "BLD20XX-XXXXX" },
  { emoji: "🏛️", city: "City of Union City", dept: "Planning Department", permit: "Planning Comments" },
];

const disciplines = [
  "Architectural", "Structural", "Mechanical", "Electrical", "Plumbing",
  "Energy / Title 24", "Fire & Life Safety", "Green Building / CALGreen",
  "Planning", "Public Works", "Construction & Demolition", "Geotechnical",
];

const stats = [
  { value: "73%", label: "Average Time Saved vs Manual Response" },
  { value: "12+", label: "Disciplines Covered (Arch, Struct, MEP, Fire...)" },
  { value: "6", label: "CA Jurisdictions Pre-Configured" },
  { value: "2022", label: "Code Cycle (CBC / CRC / CMC / CPC / CEC)" },
];

const steps = [
  { icon: Clipboard, title: "Enter City Comments", emoji: "📋", desc: "Manually enter or paste the corrections from your city's plan check letter. Organized by discipline: Architectural, Structural, MEP, Fire, Planning, and more." },
  { icon: CheckCircle2, title: "Review & Respond", emoji: "✅", desc: "Review each comment, add your notes, and let AI generate professional, code-accurate responses for every item. Edit anything before finalizing." },
  { icon: Send, title: "Generate & Submit", emoji: "📄", desc: "Generate a formatted Response Letter with your project header, numbered responses for each comment, and the correct resubmittal language for your jurisdiction." },
];

const MockLetterPreview = () => (
  <div className="bg-card rounded-lg shadow-2xl border border-border p-6 max-w-sm transform rotate-1 hover:rotate-0 transition-transform">
    <div className="border-b-2 border-gold pb-3 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🏛️</span>
        <span className="font-display text-sm font-bold text-foreground">City of San Mateo</span>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground">Building Division · 330 West 20th Avenue</p>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded w-3/4"></div>
      <div className="h-2 bg-muted rounded w-full"></div>
      <div className="h-2 bg-muted rounded w-5/6"></div>
    </div>
    <div className="mt-4 p-3 bg-cream rounded border border-border">
      <p className="font-mono text-[9px] text-muted-foreground mb-1">COMMENT #1 — ARCHITECTURAL</p>
      <div className="h-2 bg-gold/30 rounded w-full mb-1"></div>
      <div className="h-2 bg-gold/30 rounded w-4/5"></div>
    </div>
    <div className="mt-2 p-3 bg-success-bg rounded border border-border">
      <p className="font-mono text-[9px] text-success mb-1">RESPONSE:</p>
      <div className="h-2 bg-success/20 rounded w-full mb-1"></div>
      <div className="h-2 bg-success/20 rounded w-3/4"></div>
    </div>
    <div className="mt-3 flex items-center gap-1">
      <div className="h-1.5 w-1.5 rounded-full bg-gold"></div>
      <p className="font-mono text-[8px] text-muted-foreground">3 more comments...</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <AppLayout showFooter>
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
                Turn City Comments Into Professional Response Letters
              </h1>
              <p className="font-body text-lg text-cream/70 mb-8 max-w-xl leading-relaxed">
                Upload your city's Plan Check Correction Letter. Our AI reads every comment, generates code-accurate responses, and produces a formatted letter ready to submit — in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  to="/new-case"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
                >
                  Start New Plan Check <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/case/case-001"
                  className="inline-flex items-center justify-center px-6 py-3 border border-cream/40 text-cream font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-cream/10 transition-colors"
                >
                  View Demo Case
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-cream/60 font-mono text-[11px]">
                <span>✓ 2022 CBC / CRC Compliant</span>
                <span>✓ 6 Bay Area Jurisdictions</span>
                <span>✓ GPT-4o Powered</span>
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
                <p className="font-display text-3xl font-bold text-accent-foreground">{stat.value}</p>
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
            From City Comments to Approved Plans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-cream border-2 border-gold flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Step {i + 1} — {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gold" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jurisdictions */}
      <section className="bg-cream py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-3">
            Pre-Configured for Bay Area Jurisdictions
          </h2>
          <p className="font-body text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Each jurisdiction has its own letter format, code citations, and resubmittal requirements — all built in.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {jurisdictions.map((j, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-5 hover:border-gold/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-lg flex-shrink-0">
                    {j.emoji}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">{j.city}</p>
                    <p className="font-body text-xs text-muted-foreground">{j.dept}</p>
                    <p className="font-mono text-[10px] text-gold-dark mt-1">{j.permit}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-muted/50 rounded-lg border border-dashed border-border p-5 flex items-center justify-center">
              <p className="font-mono text-xs text-muted-foreground">More cities coming soon...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="bg-card py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">
            Every Review Discipline. Every Comment. Covered.
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {disciplines.map((d) => (
              <span
                key={d}
                className="px-4 py-2 rounded-full bg-cream border border-border font-mono text-xs text-foreground hover:border-gold transition-colors"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-cream mb-6">
            Ready to cut your response time by 73%?
          </h2>
          <Link
            to="/new-case"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-accent-foreground font-mono text-sm uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
          >
            Create Your First Plan Check Case
          </Link>
        </div>
      </section>
    </AppLayout>
  );
};

export default Index;
