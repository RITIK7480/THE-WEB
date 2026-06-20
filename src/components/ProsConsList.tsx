import React from "react";
import { ProItem, ConItem } from "../types";
import { ThumbsUp, ThumbsDown, ShieldAlert, BadgeInfo } from "lucide-react";

interface ProsConsListProps {
  pros: ProItem[];
  cons: ConItem[];
}

export default function ProsConsList({ pros, cons }: ProsConsListProps) {
  // Score indicator helper
  const renderIndicator = (score: number, type: "pro" | "con") => {
    const baseColor = type === "pro" ? "bg-emerald-500" : "bg-rose-500";
    return (
      <div className="flex items-center gap-1 mt-1.5">
        {[1, 2, 3, 4, 5].map((idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              idx <= score ? `${baseColor} w-3` : "bg-slate-800 w-1.5"
            }`}
          />
        ))}
        <span className="text-[10px] text-slate-500 font-mono ml-1">
          {score}/5
        </span>
      </div>
    );
  };

  const getImpactBadge = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case "high":
        return "text-cyan-400 bg-cyan-950/40 border-cyan-900/40";
      case "medium":
        return "text-purple-400 bg-purple-950/40 border-purple-900/40";
      default:
        return "text-slate-400 bg-slate-950 border-slate-850";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* Pros Column */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <ThumbsUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Advantage Factors (Pros)
              </h3>
              <p className="text-xs text-slate-400">
                Strategic drivers backing this alternative
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pros && pros.length > 0 ? (
              pros.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 hover:border-emerald-500/20 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                      {item.dimension}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/80">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider block">
                        Driving Force
                      </span>
                      {renderIndicator(item.strength, "pro")}
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${getImpactBadge(item.impact)}`}>
                      {item.impact} Impact
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs md:text-sm">
                No active Pros mapped for this direction.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-850/80 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <BadgeInfo className="w-3.5 h-3.5" />
          Always configure mitigators for low-strength Pros.
        </div>
      </div>

      {/* Cons Column */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
              <ThumbsDown className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Risks & Drawbacks (Cons)
              </h3>
              <p className="text-xs text-slate-400">
                Critical bottlenecks, barriers, or drawbacks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {cons && cons.length > 0 ? (
              cons.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 hover:border-rose-500/20 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                      {item.dimension}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/80">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider block">
                        Barrier Severity
                      </span>
                      {renderIndicator(item.severity, "con")}
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${getImpactBadge(item.impact)}`}>
                      {item.impact} Risk
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs md:text-sm">
                No active Drawbacks or Cons mapped.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-850/80 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Cons rated 4+ represent immediate potential deal-breakers.
        </div>
      </div>
    </div>
  );
}
