import React, { useState } from "react";
import { Sparkles, HelpCircle, ArrowRight, Layers } from "lucide-react";

interface DecisionInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export default function DecisionInput({ onSubmit, isLoading }: DecisionInputProps) {
  const [topic, setTopic] = useState("");

  const presets = [
    {
      title: "Streaming Video App (WhatsApp Alternative)",
      prompt: "Build an application similar to WhatsApp, but with a key difference: unlike WhatsApp—where the recipient has to download a video sent to them—in my app, the other person should not have to download it.",
      badge: "User Request"
    },
    {
      title: "Cloud Infrastructure Choice",
      prompt: "Should I migrate our scaling Web App from a single robust monolithic server to serverless microservices and Cloud Run?",
      badge: "Architecture"
    },
    {
      title: "Career Path",
      prompt: "Should I focus on mastering Full-Stack System Engineering or specializing deeply in Machine Learning and generative AI models?",
      badge: "Career"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-100 tracking-tight font-sans">
            Inquire the Decision Engine
          </h2>
          <p className="text-sm text-slate-400">
            Define your dilemma, alternative, or architectural puzzle to generate your analysis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            aria-label="Decision topic input"
            rows={4}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., Should I buy a house or keep renting? / Or paste your setup details..."
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none transition-all resize-none text-[15px] leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-mono">
            {topic.length} characters
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-slate-500">
            Provide details of the trade-offs to get the most specific cognitive web mapping.
          </p>
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
            style={{ touchAction: "manipulation" }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-900" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Synthesize Decision
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-slate-800/60 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Interactive Suggestion Presets
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTopic(p.prompt)}
              disabled={isLoading}
              className="text-left bg-slate-950 hover:bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800/80">
                    {p.badge}
                  </span>
                  <Layers className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-500 transition-colors" />
                </div>
                <h3 className="text-xs font-semibold text-slate-300 font-sans group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.prompt}
                </p>
              </div>
              <div className="text-[10px] text-cyan-500 mt-2 font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform self-end">
                Load Preset →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
