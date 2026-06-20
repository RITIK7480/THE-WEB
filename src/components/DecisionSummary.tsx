import React from "react";
import { Sparkles, Trophy, CheckCircle } from "lucide-react";

interface DecisionSummaryProps {
  summary: string;
  verdict: string;
  dimensions: string[];
}

export default function DecisionSummary({ summary, verdict, dimensions }: DecisionSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Executive Evaluation Summary
            </h3>
          </div>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </div>

        {/* Dimensions of focus sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-4">
              Core Mapped Dimensions
            </h3>
            <div className="space-y-2">
              {dimensions.map((dim, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 text-xs font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {dim}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-4 leading-relaxed">
            The decision parameters have been weighted and cross-checked against these areas of impact.
          </p>
        </div>
      </div>

      {/* Synthesis Verdict Block */}
      <div className="bg-cyan-950/15 border border-cyan-500/20 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center text-slate-950 shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider font-mono mb-1">
              Engine Verdict & Guidance
            </h3>
            <h4 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight mb-2">
              Strategic Decision Resolution
            </h4>
            <div className="text-slate-300 text-sm md:text-base leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-cyan-500/10 mt-3 flex gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="italic">{verdict}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
