import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  { text: "Reading Sheet A-1.1: Site Plan", type: "info" },
  { text: "Reading Sheet A-2.0: Floor Plan", type: "info" },
  { text: "Reading Sheet A-3.0: Elevations", type: "info" },
  { text: "Reading Sheet A-4.1: Details & Sections", type: "info" },
  { text: "Reading Sheet A-6.0: Electrical Plan", type: "info" },
  { text: "⚠ CRC 310.2: Bedroom egress window — net clear opening < 5.7 sf", type: "warn" },
  { text: "⚠ CRC 311.3: Exterior landing missing at Door 14", type: "warn" },
  { text: "✓ CRC 314.3: Smoke detectors — compliant", type: "ok" },
  { text: "⚠ CEC 210.52(D): GFCI receptacle missing at Bathroom 2", type: "warn" },
  { text: "✓ CBC §107.2.5: Site plan — compliant", type: "ok" },
  { text: "⚠ CMC 405.4: Kitchen exhaust not shown", type: "warn" },
  { text: "✓ CRC 807.1: Attic access — compliant", type: "ok" },
  { text: "⚠ CPC 1208.1: Gas line diagram missing", type: "warn" },
  { text: "⚠ CPC 408.5: Curbless shower detail needed", type: "warn" },
  { text: "✓ CEnC 150.0(k): Luminaire compliance noted", type: "ok" },
  { text: "Generating correction comments...", type: "info" },
  { text: "Formatting plan check letter...", type: "info" },
  { text: "✅ Review complete — 9 items require correction", type: "done" },
];

const Processing = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([
    { icon: "📄", name: "Plan Analyzer", description: "Reading PDF pages", status: "waiting", progress: 0, result: "", duration: 2000 },
    { icon: "📋", name: "Checklist Engine", description: "Applying code rules", status: "waiting", progress: 0, result: "", duration: 2500 },
    { icon: "🔍", name: "Compliance Checker", description: "Identifying violations", status: "waiting", progress: 0, result: "", duration: 4000 },
    { icon: "✍️", name: "Comment Generator", description: "Writing corrections", status: "waiting", progress: 0, result: "", duration: 3000 },
    { icon: "📄", name: "Letter Formatter", description: "Formatting output", status: "waiting", progress: 0, result: "", duration: 2000 },
  ]);
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  const [allDone, setAllDone] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const runAgents = async () => {
      const results = ["18 sheets analyzed", "CBC 2022 + CRC + Title 24", "9 items flagged", "27 comments generated", "Letter formatted"];
      
      for (let i = 0; i < 5; i++) {
        setAgents(prev => prev.map((a, j) => j === i ? { ...a, status: "running" } : a));
        
        const duration = agents[i].duration;
        const steps = 20;
        for (let s = 1; s <= steps; s++) {
          await new Promise(r => setTimeout(r, duration / steps));
          const pct = Math.round((s / steps) * 100);
          setAgents(prev => prev.map((a, j) => j === i ? { ...a, progress: pct } : a));
          
          // Add log lines during agents 2-4
          if (i >= 1 && i <= 3) {
            const logIdx = Math.floor(((i - 1) * 6 + (s / steps) * 6));
            if (logIdx < logLines.length) {
              setVisibleLogs(prev => Math.max(prev, logIdx + 1));
            }
          }
        }
        
        setAgents(prev => prev.map((a, j) => j === i ? { ...a, status: "complete", progress: 100, result: results[i] } : a));
      }

      setVisibleLogs(logLines.length);
      await new Promise(r => setTimeout(r, 500));
      setAllDone(true);
      await new Promise(r => setTimeout(r, 300));
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

  return (
    <div className="min-h-screen bg-navy-dark text-cream">
      {/* Header */}
      <div className="border-b border-navy-light px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-gold">AI Plan Review in Progress</p>
        <p className="font-display text-lg font-bold text-cream mt-1">12 N Norfolk St, San Mateo, CA 94403</p>
        <p className="font-mono text-[11px] text-cream/50">plans_norfolk_st.pdf · 18 pages</p>
      </div>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Agent Pipeline */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-1">
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
            <div className="max-w-2xl mx-auto mt-8 rounded-lg border border-gold bg-navy p-6 animate-in fade-in duration-500">
              <h3 className="font-display text-lg font-bold text-gold mb-4">✅ AI Plan Review Complete</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Total Items Checked</p>
                  <p className="font-display text-2xl font-bold text-cream">847</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Items Compliant</p>
                  <p className="font-display text-2xl font-bold text-success">838 ✓</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Items Requiring Action</p>
                  <p className="font-display text-2xl font-bold text-warning">9 ⚠</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">Disciplines with Issues</p>
                  <p className="font-mono text-xs text-cream/70">Arch (4) · Elec (1) · Mech (2) · Plumb (2)</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/case/case-001")}
                className="w-full py-3 bg-gold text-accent-foreground font-mono text-xs uppercase tracking-[2px] rounded-md hover:bg-gold-dark transition-colors"
              >
                → Review All Comments & Generate Letter
              </button>
            </div>
          )}
        </div>

        {/* Live Log Feed */}
        <div className="w-[280px] bg-navy border-l border-navy-light flex flex-col">
          <div className="px-4 py-3 border-b border-navy-light">
            <p className="font-mono text-[10px] uppercase tracking-wider text-gold">Live Compliance Log</p>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {logLines.slice(0, visibleLogs).map((log, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="font-mono text-[9px] text-cream/30">[{timeStr(i)}] </span>
                <span className={`font-mono text-[10px] ${
                  log.type === "warn" ? "text-warning" :
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
