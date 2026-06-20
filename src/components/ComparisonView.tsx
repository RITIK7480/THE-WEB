import React from "react";
import { ComparisonTable } from "../types";
import { Check, X, ShieldAlert, Award } from "lucide-react";

interface ComparisonViewProps {
  comparison: ComparisonTable;
}

export default function ComparisonView({ comparison }: ComparisonViewProps) {
  if (!comparison || !comparison.rows) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Feature Comparison Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Detailed parameter analysis comparing baseline options
          </p>
        </div>
        <div className="flex gap-4 text-xs font-semibold font-mono">
          <div className="flex items-center gap-1.5 text-blue-600">
            <span className="w-2.5 h-2.5 rounded bg-blue-100 flex items-center justify-center font-bold text-[9px]">A</span>
            Option A (Baseline)
          </div>
          <div className="flex items-center gap-1.5 text-teal-600">
            <span className="w-2.5 h-2.5 rounded bg-teal-100 flex items-center justify-center font-bold text-[9px]">B</span>
            Option B (Proposed alternative)
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
              <th className="px-6 py-4 font-mono font-bold">Aspect / Dimension</th>
              <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-50/80">
                {comparison.optionAName || "Option A (Baseline)"}
              </th>
              <th className="px-6 py-4 font-semibold text-teal-900 bg-teal-50/20">
                {comparison.optionBName || "Option B (Proposed alternative)"}
              </th>
              <th className="px-6 py-4 text-center font-mono font-bold">Verdict Winner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {comparison.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {row.aspect}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {row.optionA}
                </td>
                <td className="px-6 py-4 text-slate-600 bg-teal-50/5">
                  {row.optionB}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      row.winner === "A"
                        ? "bg-amber-100 text-amber-800"
                        : row.winner === "B"
                        ? "bg-teal-100 text-teal-900"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    Option {row.winner === "Tie" ? "Tie" : row.winner}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Option B delivers an upgraded modern user experience with lower overall latency.
        </span>
      </div>
    </div>
  );
}
