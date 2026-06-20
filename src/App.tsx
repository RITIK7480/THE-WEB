import React, { useState } from "react";
import { 
  Network, 
  ThumbsUp, 
  Flame, 
  Shuffle, 
  MessageCircle, 
  BookOpen, 
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  History,
  FileSpreadsheet
} from "lucide-react";
import { DecisionAnalysis, SavedDecisionHeader } from "./types";
import DecisionInput from "./components/DecisionInput";
import DecisionSummary from "./components/DecisionSummary";
import ProsConsList from "./components/ProsConsList";
import SWOTBoard from "./components/SWOTBoard";
import ComparisonView from "./components/ComparisonView";
import InteractiveWeb from "./components/InteractiveWeb";
import MediaChatDemo from "./components/MediaChatDemo";

// Premium Seed Initial Data for the user's specific WhatsApp "No-Download Video Streaming" prompt
const DEFAULT_WHATSAPP_DECISION: DecisionAnalysis = {
  id: "whatsapp-streaming",
  topic: "Build an application similar to WhatsApp, but with a key difference: unlike WhatsApp—where the recipient has to download a video sent to them—in my app, the other person should not have to download it.",
  createdAt: "2026-06-20T01:40:00-07:00",
  verdict: "Implementation using HLS or WebRTC streaming directly inside continuous Web Worker buffers is highly recommended. By building a Progressive Web App (PWA) with client-side chunk decoding (via MSE/WebAssembly), users bypass the tedious 'spin & wait for file downloads' flow typical of standard legacy carriers, unlocking immense competitive UX advantage.",
  summary: "This analysis evaluates the architectural feasibility and key design trade-offs of building a modern chat application centering dynamic video-on-demand and real-time streaming. Traditional clients force full byte transfer before allowing media playbacks (download step). Transitioning to progressive progressive-buffer chunk delivery addresses direct mobile latency constraints.",
  dimensions: ["Latency & UX", "Server Costs", "Security", "Offline Experience"],
  pros: [
    {
      id: "pro1",
      title: "Zero Waiting UX",
      description: "Recipients tap play and stream instantly. Highly engaging compared to legacy download rings.",
      strength: 5,
      dimension: "Latency & UX",
      impact: "High"
    },
    {
      id: "pro2",
      title: "Reduced local client storage footprint",
      description: "Videos reside on the server with active buffering, saving storage drive sizes on standard mobile devices.",
      strength: 4,
      dimension: "Offline Experience",
      impact: "High"
    },
    {
      id: "pro3",
      title: "Encrypted Stream Delivery",
      description: "Since chunks are transiently buffered and played in memory (MSE), piracy / illicit storage extraction is minimized.",
      strength: 4,
      dimension: "Security",
      impact: "Medium"
    }
  ],
  cons: [
    {
      id: "con1",
      title: "Transcoding Compute Overhead",
      description: "Inbound files must be immediately converted to HLS playlists/m3u8 profiles on our core servers.",
      severity: 4,
      dimension: "Server Costs",
      impact: "High"
    },
    {
      id: "con2",
      title: "Loss of offline preservation",
      description: "If recipients lose cell signal or internet later on, they cannot watch past videos unless pre-cached.",
      severity: 3,
      dimension: "Offline Experience",
      impact: "Medium"
    }
  ],
  swot: {
    strengths: [
      "Stellar first-view loading speed",
      "In-memory transient audio/video decoding (extremely secure)",
      "Low storage drive usage metrics on devices"
    ],
    weaknesses: [
      "Heavy cloud server transcoding cost profiles",
      "Network dependency is higher compared to WhatsApp",
      "Sophisticated adaptive bitrates required (HLS/DASH)"
    ],
    opportunities: [
      "Target enterprises needing high security video chats",
      "Capitalize on high speed 5G/Fiber wireless coverage",
      "Offer selective 'save offline' tiers as premium options"
    ],
    threats: [
      "Cloud bandwidth costs scale linearly with media traffic",
      "Large group chats of 100+ can trigger sudden CDN peak bills"
    ]
  },
  comparison: {
    optionAName: "Traditional WhatsApp Style App (Full Download First)",
    optionBName: "The WEB Direct-Streaming App (Instant No-Download Play)",
    rows: [
      {
        aspect: "Loading Speed / Latency",
        optionA: "Must download entire 50MB file first (30-60 sec waiting)",
        optionB: "Plays in < 500ms using progressive source media buffers",
        winner: "B"
      },
      {
        aspect: "Client storage load",
        optionA: "Saves video to phone gallery permanently (Clutters disk)",
        optionB: "Saves nothing in permanent gallery, plays from RAM / safe caching",
        winner: "B"
      },
      {
        aspect: "Offline Availability",
        optionA: "Always plays anywhere after downloaded once",
        optionB: "Requires network signal unless specifically labeled for pre-load",
        winner: "A"
      },
      {
        aspect: "Server Infrastructure",
        optionA: "Simple File Servers / cloud CDN storage distribution",
        optionB: "Real-time encoding servers with adaptive dynamic bitrates",
        winner: "A"
      },
      {
        aspect: "Overall User NPS Interest",
        optionA: "Standard, generic, slow media sharing",
        optionB: "Stellar, modern, next-generation immersive communication",
        winner: "B"
      }
    ]
  },
  graph: {
    nodes: [
      { id: "root", label: "No-Download Video Chat", type: "decision", score: 5, description: "Core challenge: Build video service bypassing WhatsApp disk-download flow." },
      { id: "f1", label: "Latency & UX", type: "factor", score: 4, description: "Focusing on immediate sensory playback speeds." },
      { id: "f2", label: "Server Costs", type: "factor", score: 3, description: "Transcoding backend pipelines needed for stream conversion." },
      { id: "f3", label: "Security & DRM", type: "factor", score: 4, description: "Protecting user content via temporary RAM buffers." },
      { id: "pro1", label: "Instant 500ms play", type: "pro", score: 5, description: "Recipient can watch immediately on cell data without waiting." },
      { id: "pro2", label: "Saves Drive Storage", type: "pro", score: 4, description: "Device runs fast and lightweight without clutter." },
      { id: "con1", label: "Server Transcoding Cost", type: "con", score: 4, description: "Increased backend computing load to transform MP4 videos." },
      { id: "con2", label: "Offline limitations", type: "con", score: 3, description: "Requires internet connection unless explicit caching occurs." }
    ],
    links: [
      { source: "root", target: "f1", relationship: "neutral" },
      { source: "root", target: "f2", relationship: "neutral" },
      { source: "root", target: "f3", relationship: "neutral" },
      { source: "f1", target: "pro1", relationship: "supports" },
      { source: "f1", target: "pro2", relationship: "supports" },
      { source: "f2", target: "con1", relationship: "opposes" },
      { source: "f1", target: "con2", relationship: "opposes" }
    ]
  }
};

const DEFAULT_INFRA_DECISION: DecisionAnalysis = {
  id: "infra-upgrade",
  topic: "Q4 Infrastructure Upgrade - Migratescaling Monolith App to Serverless Microservices and Cloud Run",
  createdAt: "2026-06-20T01:30:00-07:00",
  verdict: "Execute the migration starting with low-risk batch worker queues. Maintaining modularity decreases dependency lock-in risks.",
  summary: "Assessing if moving to Cloud Run and severless scaling suits our variable traffic. While serverless lowers operations, cold-starts present database-pool latency trade-offs that need careful container warmups.",
  dimensions: ["Scaling", "DevOps Overhead", "API response time", "Compute Costs"],
  pros: [
    {
      id: "pro1",
      title: "Zero Ops Auto-Scaling",
      description: "Spins container limits up or down automatically according to active query load. No manual VM provision.",
      strength: 5,
      dimension: "Scaling",
      impact: "High"
    }
  ],
  cons: [
    {
      id: "con1",
      title: "Cold Starts Potential",
      description: "First container activations incur 2.5 second delays, reducing extreme high-frequency performance.",
      severity: 3,
      dimension: "API response time",
      impact: "Medium"
    }
  ],
  swot: {
    strengths: ["Infinite scaling", "Cost to zero idle benefits", "Easy microsecond deployments"],
    weaknesses: ["Complex locally state architectures", "More fragmented micro service tracking"],
    opportunities: ["Enable edge computations", "Consolidate pipeline workloads"],
    threats: ["Provider API lock-ins"]
  },
  comparison: {
    optionAName: "Traditional Monolith State",
    optionBName: "Serverless Cloud Run Microservices",
    rows: [
      { aspect: "Scalability", optionA: "Requires vertical scaling limits", optionB: "Frictionless modular auto scale auto down", winner: "B" }
    ]
  },
  graph: {
    nodes: [
      { id: "root", label: "Serverless Migration", type: "decision", score: 5, description: "Upgrade monolith to Cloud Run structures." },
      { id: "f1", label: "Scaling Options", type: "factor", score: 4, description: "Handling sudden dynamic user traffic peaks." }
    ],
    links: [
      { source: "root", target: "f1", relationship: "neutral" }
    ]
  }
};

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysis>(DEFAULT_WHATSAPP_DECISION);
  const [activeTab, setActiveTab] = useState<"web" | "proscons" | "swot" | "comparison">("web");
  const [historyList, setHistoryList] = useState<DecisionAnalysis[]>([
    DEFAULT_WHATSAPP_DECISION,
    DEFAULT_INFRA_DECISION
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Trigger Gemini Analysis Submission
  const handleSubmitDecision = async (topic: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/decide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Decision synthesis endpoint request failed.");
      }

      const freshAnalysis: DecisionAnalysis = await response.json();
      // Tag it with client side properties
      freshAnalysis.id = "custom-" + Date.now();
      freshAnalysis.createdAt = new Date().toISOString();

      setActiveDecision(freshAnalysis);
      // Add to historical top of sidebar list
      setHistoryList((prev) => [freshAnalysis, ...prev.filter((d) => d.topic !== freshAnalysis.topic )]);
      // Focus on summary map first
      setActiveTab("web");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong while compiling the layout decision variables.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 flex font-sans text-slate-300">
      
      {/* 1. Left Sidebar: Decisions, Projects, & Identity */}
      <aside className="w-64 bg-[#111b21] flex flex-col flex-shrink-0 border-r border-slate-900">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Network className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-widest block font-mono">THE WEB</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">A decision layer</span>
            </div>
          </div>
          
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System running live" />
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 py-5 px-3 space-y-5 overflow-y-auto">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2 font-bold font-mono">
              Active Inquiries ({historyList.length})
            </div>
            <div className="space-y-1">
              {historyList.map((item) => {
                const isSelected = activeDecision.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDecision(item)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs md:text-sm transition-all duration-150 cursor-pointer flex flex-col relative group ${
                      isSelected
                        ? "bg-teal-950/40 text-teal-200 border-l-2 border-teal-500"
                        : "hover:bg-slate-900/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-semibold line-clamp-1 truncate block pr-2">
                      {item.topic}
                    </span>
                    <span className="text-[9px] text-slate-600 group-hover:text-slate-400 mt-1 flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2.5 font-bold font-mono">
              Collaborators
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-900">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Elena Vance
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Online</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/10">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  Product Group (4)
                </span>
                <span className="text-[9px] text-slate-500 font-mono">2m ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* User identification footer pane */}
        <div className="p-4 bg-[#1a2329] border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-slate-100 font-bold text-sm shadow-md">
              DA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate font-mono">Decision Architect</p>
              <p className="text-[10px] text-slate-400 truncate">ritikraj737@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Decision Workspace */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Live System Header */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-6 md:px-8 bg-slate-950 z-10">
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2 truncate">
              {activeDecision.topic}
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Dynamic Multi-Criteria Decision Analytics Dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button 
              onClick={() => handleSubmitDecision(activeDecision.topic)}
              disabled={isLoading}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
            >
              Re-Analyze
            </button>
            <div className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-teal-900/20 text-teal-400 border border-teal-800/20 font-bold">
              Resolution Engine Active
            </div>
          </div>
        </header>

        {/* Core Workspace Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
          
          {/* Custom decision maker UI input row */}
          <section className="space-y-2">
            <DecisionInput onSubmit={handleSubmitDecision} isLoading={isLoading} />
            
            {apiError && (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 text-xs md:text-sm text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Inquiry generation delay has been noted</p>
                  <p className="mt-0.5 text-rose-400">{apiError}</p>
                </div>
              </div>
            )}
          </section>

          {/* Quick Stats overview panel */}
          <section className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 shadow-sm">
            <DecisionSummary 
              summary={activeDecision.summary} 
              verdict={activeDecision.verdict} 
              dimensions={activeDecision.dimensions} 
            />
          </section>

          {/* Graphical Tabs Bar */}
          <section className="space-y-4">
            <div className="border-b border-slate-900 flex flex-wrap gap-1.5 pb-2">
              <button
                onClick={() => setActiveTab("web")}
                className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition ${
                  activeTab === "web"
                    ? "bg-slate-900 text-teal-400 border border-slate-800"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
              >
                <Network className="w-4 h-4" />
                1. Cognitive Web Graph
              </button>
              
              <button
                role="tab"
                aria-selected={activeTab === "proscons"}
                onClick={() => setActiveTab("proscons")}
                className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition ${
                  activeTab === "proscons"
                    ? "bg-slate-900 text-teal-400 border border-slate-800"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                2. Pros & Cons Split
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "swot"}
                onClick={() => setActiveTab("swot")}
                className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition ${
                  activeTab === "swot"
                    ? "bg-slate-900 text-teal-400 border border-slate-800"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
              >
                <Flame className="w-4 h-4" />
                3. SWOT Matrix (Internal/External)
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "comparison"}
                onClick={() => setActiveTab("comparison")}
                className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition ${
                  activeTab === "comparison"
                    ? "bg-slate-900 text-teal-400 border border-slate-800"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                4. Feature Matchup comparison
              </button>
            </div>

            {/* Dynamic Viewport rendering */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-900 p-2 md:p-4">
              {activeTab === "web" && (
                <InteractiveWeb graph={activeDecision.graph} />
              )}
              {activeTab === "proscons" && (
                <ProsConsList pros={activeDecision.pros} cons={activeDecision.cons} />
              )}
              {activeTab === "swot" && (
                <SWOTBoard swot={activeDecision.swot} />
              )}
              {activeTab === "comparison" && (
                <ComparisonView comparison={activeDecision.comparison} />
              )}
            </div>
          </section>

        </div>
      </main>

      {/* 3. Right Pane: Instant Streaming Media Chat Showcase */}
      <aside className="w-80 flex-shrink-0 flex flex-col bg-slate-900 border-l border-slate-900">
        <MediaChatDemo />
      </aside>

    </div>
  );
}
