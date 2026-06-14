"use client";

import { CollisionRisk } from "@/types";

interface CollisionRiskCardProps {
  risk: CollisionRisk | null;
}

export default function CollisionRiskCard({ risk }: CollisionRiskCardProps) {
  if (!risk) {
    return (
      <div className="panel p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Collision Risk</div>
        <div className="text-sm text-slate-500 italic">No collision data</div>
      </div>
    );
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return { text: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/40", bar: "bg-red-500" };
      case "HIGH":     return { text: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/40", bar: "bg-orange-500" };
      case "MEDIUM":   return { text: "text-saffron dark:text-saffron", bg: "bg-yellow-500/20", border: "border-yellow-500/40", bar: "bg-yellow-500" };
      case "LOW":      return { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40", bar: "bg-emerald-500" };
      default:         return { text: "text-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/40", bar: "bg-slate-500" };
    }
  };

  const colors = getThreatColor(risk.threatLevel);

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-slate-400 uppercase tracking-wider">Collision Risk</div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
          {risk.threatLevel}
        </div>
      </div>

      <div className="space-y-2.5">
        {/* Risk Score with gauge */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-500">Risk Score</span>
            <span className={`text-sm font-bold font-mono ${colors.text}`}>{risk.riskScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
              style={{ width: `${risk.riskScore}%` }}
            />
          </div>
        </div>

        {/* Distance */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Distance</span>
          <span className="text-sm font-mono">{risk.distanceMeters.toLocaleString()} m</span>
        </div>

        {/* Closing Speed */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Closing Speed</span>
          <span className="text-sm font-mono">{risk.closingSpeed} km/h</span>
        </div>

        {/* Time to Impact */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Time to Impact</span>
          <span className="text-sm font-mono">{risk.timeToImpact}s</span>
        </div>

        {/* Confidence */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Confidence</span>
          <span className="text-sm font-mono text-emerald-400">{risk.confidence}%</span>
        </div>

        {/* Affected Train */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Affected Train</span>
          <span className="text-sm font-mono">{risk.trainId}</span>
        </div>

        {/* Recommended Action */}
        <div className={`mt-2 p-2 rounded ${colors.bg} ${colors.border} border`}>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Recommended Action</div>
          <div className={`text-xs font-medium ${colors.text}`}>{risk.recommendedAction}</div>
        </div>
      </div>
    </div>
  );
}