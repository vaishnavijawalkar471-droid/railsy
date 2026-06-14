"use client";

import { FleetTrain } from "@/types";

interface FleetOverviewPanelProps {
  trains: FleetTrain[];
}

export default function FleetOverviewPanel({ trains }: FleetOverviewPanelProps) {
  if (trains.length === 0) {
    return (
      <div className="panel p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Fleet Overview</div>
        <div className="text-sm text-slate-500 italic">Loading fleet data...</div>
      </div>
    );
  }

  const activeTrains = trains.filter((t) => t.status === "ACTIVE").length;
  const emergencyTrains = trains.filter((t) => t.status === "EMERGENCY").length;
  const maintenanceTrains = trains.filter((t) => t.status === "MAINTENANCE").length;
  const stoppedTrains = trains.filter((t) => t.status === "STOPPED").length;
  const avgSpeed = Math.round(trains.reduce((sum, t) => sum + t.speed, 0) / trains.length);
  const avgHealth = Math.round(trains.reduce((sum, t) => sum + t.healthScore, 0) / trains.length);

  return (
    <div className="panel p-4">
      <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Fleet Overview</div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-emerald-500/10 rounded p-2 text-center border border-emerald-500/20">
          <div className="text-lg font-bold text-emerald-400 font-mono">{activeTrains}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active</div>
        </div>
        <div className="bg-red-500/10 rounded p-2 text-center border border-red-500/20">
          <div className="text-lg font-bold text-red-400 font-mono">{emergencyTrains}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Emergency</div>
        </div>
        <div className="bg-yellow-500/10 rounded p-2 text-center border border-yellow-500/20">
          <div className="text-lg font-bold text-saffron dark:text-saffron font-mono">{maintenanceTrains}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Maintenance</div>
        </div>
        <div className="bg-slate-500/10 rounded p-2 text-center border border-slate-500/20">
          <div className="text-lg font-bold text-slate-300 font-mono">{stoppedTrains}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Stopped</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Total Trains</span>
          <span className="text-sm font-mono font-bold">{trains.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Avg Speed</span>
          <span className="text-sm font-mono">{avgSpeed} km/h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Avg Health</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${avgHealth >= 80 ? "bg-emerald-500" : avgHealth >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${avgHealth}%` }}
              />
            </div>
            <span className="text-xs font-mono">{avgHealth}%</span>
          </div>
        </div>
      </div>

      {/* Mini fleet list */}
      <div className="mt-3 space-y-1 max-h-[140px] overflow-y-auto scrollbar-thin">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active Trains</div>
        {trains.slice(0, 5).map((t) => (
          <div key={t.trainId} className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/5">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                t.status === "ACTIVE" ? "bg-emerald-400" :
                t.status === "EMERGENCY" ? "bg-red-400" :
                t.status === "MAINTENANCE" ? "bg-yellow-400" :
                "bg-slate-400"
              }`} />
              <span className="text-xs font-mono text-slate-300">{t.trainId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">{t.speed} km/h</span>
              <span className="text-[10px] font-mono text-slate-400">{t.healthScore}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}