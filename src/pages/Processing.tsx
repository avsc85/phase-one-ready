import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { norfolkComments, sampleCasesFull } from "@/data/sampleComments";

interface Agent {
  icon: string;
  name: string;
  description: string;
  status: "waiting" | "running" | "complete";
  progress: number;
  result: string;
  duration: number;
}

const logLines = [
  { text: "[●] Reading Sheet A-0.0: Cover Sheet", type: "info" },
  { text: "[●] Reading Sheet A-1.1: Site Plan", type: "info" },
  { text: "[●] Reading Sheet A-2.0: Floor Plan", type: "info" },
  { text: "[●] Reading Sheet A-3.0: Elevations", type: "info" },
  { text: "[●] Reading Sheet A-3.1: Floor Plan Detail", type: "info" },
  { text: "[●] Reading Sheet A-4.1: Details", type: "info" },
  { text: "[●] Reading Sheet A-6.0: Electrical Plan", type: "info" },
  { text: "[⚠] CRC 310.2 — Bedroom 2 egress window", type: "warn" },
  { text: "    Net clear opening < 5.7 sf required", type: "warn-sub" },
  { text: "[⚠] CRC 311.3 — Door 14/16 exterior landing", type: "warn" },
  { text: "    Landing required both sides of door", type: "warn-sub" },
  { text: "[✓] CRC 314.3 — Smoke detectors OK", type: "ok" },
  { text: "[⚠] CEC 210.52(D) — Bathroom GFCI missing", type: "warn" },
  { text: "    Required within 3ft of each basin", type: "warn-sub" },
  { text: "[✓] CBC §107.2.5 — Site plan OK", type: "ok" },
  { text: "[⚠] CMC 405.4 — Kitchen exhaust not shown", type: "warn" },
  { text: "    Min 100 CFM required, vent to exterior", type: "warn-sub" },
  { text: "[✓] CRC 807.1 — Attic access OK", type: "ok" },
  { text: "[⚠] CPC 1208.1 — Gas line diagram missing", type: "warn" },
  { text: "    Required for new gas fireplace", type: "warn-sub" },
  { text: "[⚠] CGC 4.304.1 — MWELO form missing", type: "warn" },
  { text: "    Required for landscaping work", type: "warn-sub" },
  { text: "[●] Generating correction comments...", type: "info" },
  { text: "[●] Applying jurisdiction letter format...", type: "info" },
  { text: "[✅] Analysis complete — corrections flagged", type: "done" },
];

const Processing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Load upload data from session storage or fall back to demo
  const uploadDataRaw = sessionStorage.getItem("calplancheck_upload");
  const uploadData = uploadDataRaw ? JSON.parse(uploadDataRaw) : null;
  const isDemo = !uploadData || id === "case-001" || id === "demo-001";

  const projectAddress = isDemo ? "12 N Norfolk St, San Mateo, CA 94403" : uploadData?.address || "Unknown Address";
  const fileName = isDemo ? "plans_norfolk_st.pdf · 18 pages" : `${uploadData?.fileName || "plans.pdf"} · analyzing...`;
  const targetCaseId = isDemo ? "case-001" : uploadData?.caseId || id || "case-001";

  const [agents, setAgents] = useState<Agent[]>([
    { icon: "📄", name: "Plan Reader", description: "Reading PDF pages and extracting all drawing content", status: "waiting", progress: 0, result: "", duration: 2000 },
    { icon: "📋", name: "Rule Engine", description: `Loading jurisdiction rules · ${isDemo ? "Residential Remodel" : uploadData?.projectType?.replace(/_/g, " ") || "Project"}`, status: "waiting", progress: 0, result: "", duration: 1500 },
    { icon: "🔍", name: "Compliance Checker", description: "Comparing plan elements against all loaded rules", status: "waiting", progress: 0, result: "", duration: 4000 },
    { icon: "✍️", name: "Comment Writer", description: "Writing professional correction comments for each violation", status: "waiting", progress: 0, result: "", duration: 3000 },
    { icon: "📄", name: "Letter Formatter", description: `Formatting output for correction letter format`, status: "waiting", progress: 0, result: "", duration: 1500 },
  ]);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [showSummary, setShowSummary] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // For non-demo cases, seed sample comments to localStorage so CaseDetail can load them
  useEffect(() => {
    if (!isDemo && uploadData) {
      const caseKey = `calplancheck_comments_${targetCaseId}`;
      if (!localStorage.getItem(caseKey)) {
        // Seed the demo comments for the new case so there's data to review
        localStorage.setItem(caseKey, JSON.stringify(norfolkComments));
      }
      // Also seed case info
      const infoKey = `calplancheck_caseinfo_${targetCaseId}`;
      if (!localStorage.getItem(infoKey)) {
        const caseInfo = {
          projectAddress: uploadData.address,
          permitNumber: uploadData.permitNumber,
          jurisdiction: uploadData.jurisdiction,
          submittalNumber: 1,
          projectDescription: "",
          reviewingDepartment: "",
          departmentAddress: "",
          expirationDate: "",
          planDate: new Date().toISOString().split("T")[0],
          applicantName: uploadData.applicantName || "",
          applicantAddress: "",
          applicantPhone: "",
          applicantEmail: uploadData.applicantEmail || "",
          apn: uploadData.apn || "",
          reviewerEmail: "",
          reviewerPhone: "",
        };
        localStorage.setItem(infoKey, JSON.stringify(caseInfo));
      }
    }
  }, [isDemo, uploadData, targetCaseId]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const runAgents = async () => {
      const results = [
        "18 sheets analyzed · 847 elements extracted",
        "847 rules loaded · CBC 2022 + CRC + Title 24 + CALGreen + CMC + CPC + CEC",
        "847 items checked · 9 violations found · 838 compliant",
        "9 correction comments written · All code citations included",
        "Letter template applied · Ready for plan checker review",
      ];
      
      for (let i = 0; i < 5; i++) {
        setAgents(prev => prev.map((a, j) => j === i ? { ...a, status: "running" } : a));
        
        const durations = [2000, 1500, 4000, 3000, 1500];
        const duration = durations[i];
        const steps = 20;
        for (let s = 1; s <= steps; s++) {
          await new Promise(r => setTimeout(r, duration / steps));
          const pct = Math.round((s / steps) * 100);
          setAgents(prev => prev.map((a, j) => j === i ? { ...a, progress: pct } : a));
          
          if (i >= 1 && i <= 3) {
            const logIdx = Math.floor(((i - 1) * 8 + (s / steps) * 8));
            if (logIdx < logLines.length) {
              setVisibleLogs(prev => Math.max(prev, logIdx + 1));
            }
          }
        }
        
        setAgents(prev => prev.map((a, j) => j === i ? { ...a, status: "complete", progress: 100, result: results[i] } : a));
      }

      setVisibleLogs(logLines.length);
      await new Promise(r => setTimeout(r, 500));
      setShowSummary(true);
    };

    runAgents();
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [visibleLogs]);

  const now = new Date();
  const timeStr = (offset: number) => {
    const d = new Date(now.getTime() + offset * 1000);
    return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const handleReview = () => {
    // Clean up session storage
    sessionStorage.removeItem("calplancheck_upload");
    navigate(`/case/${targetCaseId}`);
  };

  return (
    <div className="min-h-screen bg-navy-dark text-cream">
      {/* Header */}
      <div className="border-b border-navy-light px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏛️</span>
            <span className="font-display font-bold text-lg text-cream">CalPlanCheck</span>
            <span className="font-display font-bold text-lg text-gold">AI</span>
          </div>
          <p className="font-display text-base font-bold text-cream">{projectAddress}</p>
          <p className="font-mono text-[11px] text-cream/50">{fileName}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Processing... do not close this tab</span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Agent Pipeline */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-cream text-center mb-2">AI Agents Analyzing Your Plans</h2>
            <p className="font-mono text-[11px] text-gold uppercase tracking-[3px] text-center mb-8">5 AGENTS WORKING IN PARALLEL</p>

            <div className="space-y-1">
              {agents.map((agent, i) => (
                <div key={i}>
                  <div className={`rounded-lg border p-5 transition-all duration-500 ${
                    agent.status === "running" ? "border-gold bg-gold/5" :
                    agent.status === "complete" ? "border-success/40 bg-success/5" :
                    "border-navy-light bg-navy/50"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{agent.icon}</span>
                        <div>
                          <p className="font-display text-sm font-bold">{agent.name}</p>
                          <p className="font-mono text-[10px] text-cream/50">{agent.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {agent.status === "complete" && (
                          <span className="font-mono text-[10px] text-success">✅ COMPLETE</span>
                        )}
                        {agent.status === "running" && (
                          <span className="font-mono text-[10px] text-gold animate-pulse">⏳ RUNNING...</span>
                        )}
                        {agent.status === "waiting" && (
                          <span className="font-mono text-[10px] text-cream/30">⏸ WAITING</span>
                        )}
                      </div>
                    </div>
                    {(agent.status === "running" || agent.status === "complete") && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-navy-light rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${agent.status === "complete" ? "bg-success" : "bg-gold"}`}
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                        {agent.result && (
                          <p className="font-mono text-[10px] text-cream/50 mt-1">{agent.result}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {i < 4 && (
                    <div className="flex justify-center py-1">
                      <div className={`w-px h-4 ${agents[i + 1].status !== "waiting" ? "bg-gold" : "bg-navy-light"} transition-colors`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary Card */}
            {showSummary && (
              <div className="mt-8 rounded-lg border border-gold bg-navy p-6 animate-in fade-in duration-500">
                <h3 className="font-display text-lg font-bold text-gold mb-4">✅ AI Plan Review Complete</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Total Rules Checked</p>
                    <p className="font-display text-2xl font-bold text-cream">847</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Compliant Items</p>
                    <p className="font-display text-2xl font-bold text-success">838 ✓</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Corrections Required</p>
                    <p className="font-display text-2xl font-bold text-warning">9 ⚠</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Disciplines with Corrections</p>
                    <p className="font-mono text-xs text-cream/70">Arch (4) · Elec (1) · Mech (2) · Plumb (2)</p>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-navy-light/50 rounded-lg">
                  <p className="font-mono text-[10px] text-cream/50">Time saved vs manual review: <span className="text-gold font-bold">~11 hours</span></p>
                </div>
                <button
                  onClick={handleReview}
                  className="w-full py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
                >
                  → Review AI-Generated Comments
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Log Feed */}
        <div className="w-[300px] bg-navy border-l border-navy-light flex flex-col">
          <div className="px-4 py-3 border-b border-navy-light">
            <p className="font-mono text-[10px] uppercase tracking-wider text-gold">COMPLIANCE LOG</p>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {logLines.slice(0, visibleLogs).map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="font-mono text-[9px] text-cream/30">[{timeStr(i)}] </span>
                <span className={`font-mono text-[10px] ${
                  log.type === "warn" ? "text-warning" :
                  log.type === "warn-sub" ? "text-warning/70" :
                  log.type === "ok" ? "text-success" :
                  log.type === "done" ? "text-gold" :
                  "text-cream/60"
                }`}>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processing;
