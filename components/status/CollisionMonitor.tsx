"use client";
import Card from "@/components/ui/PanelCard";
import { useCollisionStore } from "@/store/collisionStore";
import { getThreatBg } from "@/lib/utils";

const RADIUS = 32, CIRC = 2 * Math.PI * RADIUS;

export default function CollisionMonitor() {
  const risk = useCollisionStore((s) => s.risk);
  if (!risk) {
    return (
      <div id="collision-monitor">
        <Card title="Collision Monitor" accent="green">
          <div className="text-center text-sm text-slate-400 py-4">Loading...</div>
        </Card>
      </div>
    );
  }

  const pct = risk.riskScore / 100;
  return (
    <div id="collision-monitor">
      <Card title="Collision Monitor" accent="green">
        <div className="flex flex-col items-center mb-2">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 72 72" className="w-20 h-20 -rotate-90">
              <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200 dark:text-d-border"/>
              <circle cx="36" cy="36" r={RADIUS} fill="none" strokeWidth="6"
                stroke={getThreatBg(risk.riskScore)}
                strokeDasharray={`${pct*CIRC} ${CIRC}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span id="collision-risk" className="text-xl font-bold" style={{color:getThreatBg(risk.riskScore)}}>{risk.riskScore}%</span>
              <span className="text-[9px] text-slate-500">risk</span>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          {[
            ["Nearby Train", risk.trainId],
            ["Time to Impact", `${risk.timeToImpact}s`],
            ["Distance", `${risk.distanceMeters}m`],
            ["Closing Speed", `${risk.closingSpeed} km/h`],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between py-1 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
          <div id="recommended-action" className="mt-2 text-center text-[10px] font-medium text-igreen-d dark:text-green-400 bg-igreen-l dark:bg-igreen/10 rounded-lg py-1.5 px-2">
            ✓ {risk.recommendedAction}
          </div>
        </div>
      </Card>
    </div>
  );
}
