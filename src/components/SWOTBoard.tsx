import React from "react";
import { SWOTAnalysis } from "../types";
import { ShieldCheck, Flame, PlusCircle, AlertOctagon } from "lucide-react";

interface SWOTBoardProps {
  swot: SWOTAnalysis;
}

export default function SWOTBoard({ swot }: SWOTBoardProps) {
  const defaultSWOT = {
    strengths: ["Highly scalable setup", "High control over user-side cache layers", "No-download streaming reduces friction"],
    weaknesses: ["Requires video transcoding servers", "Higher bandwidth bill costs", "No offline play mode without cache"],
    opportunities: ["Create a custom business-focused messaging ecosystem", "Disrupt legacy offline-first players"],
    threats: ["Provider API cost spikes", "Increased regulatory scrutiny on local data"]
  };

  const activeSWOT = swot || defaultSWOT;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2.5 h-6 bg-emerald-500 rounded-full" />
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 font-mono">
            Strengths (Internal)
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 flex-1">
          {activeSWOT.strengths.map((str, idx) => (
            <li key={idx} className="flex gap-2 items-start leading-relaxed">
              <span className="text-emerald-500 font-bold">•</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2.5 h-6 bg-amber-500 rounded-full" />
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 font-mono">
            Weaknesses (Internal)
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 flex-1">
          {activeSWOT.weaknesses.map((weak, idx) => (
            <li key={idx} className="flex gap-2 items-start leading-relaxed">
              <span className="text-amber-500 font-bold">•</span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2.5 h-6 bg-blue-500 rounded-full" />
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <PlusCircle className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 font-mono">
            Opportunities (External)
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 flex-1">
          {activeSWOT.opportunities.map((opp, idx) => (
            <li key={idx} className="flex gap-2 items-start leading-relaxed">
              <span className="text-blue-500 font-bold">•</span>
              <span>{opp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2.5 h-6 bg-rose-500 rounded-full" />
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 font-mono">
            Threats (External)
          </h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 flex-1">
          {activeSWOT.threats.map((thr, idx) => (
            <li key={idx} className="flex gap-2 items-start leading-relaxed">
              <span className="text-rose-500 font-bold">•</span>
              <span>{thr}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
