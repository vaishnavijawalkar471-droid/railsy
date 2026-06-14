"use client";

import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/PanelCard";
import { useFleetStore } from "@/store/fleetStore";

export default function MaintenancePage() {
  const trains = useFleetStore((s) => s.trains);
  const maintenanceTrains = trains.filter(t => t.status === "MAINTENANCE" || t.status === "EMERGENCY");

  return (
    <MainLayout>
      <div className="p-6 h-full overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold text-saffron-d dark:text-saffron mb-6">Maintenance Overview</h1>
        <div className="flex-1 min-h-0">
          <Card title="Trains Requiring Attention" accent="navy" className="h-full">
            <div className="overflow-auto h-full pr-2">
              <div className="flex flex-col gap-3">
                {maintenanceTrains.length === 0 ? (
                  <div className="text-slate-500 dark:text-slate-400 text-sm">All trains are operational.</div>
                ) : (
                  maintenanceTrains.map(t => {
                    const isEmergency = t.status === "EMERGENCY";
                    const bgColor = isEmergency ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30";
                    const textColor = isEmergency ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400";
                    return (
                      <div key={t.trainId} className={`panel flex items-center p-4 border rounded-xl gap-4 transition-all duration-300 ${bgColor}`}>
                        <div className="text-2xl">{isEmergency ? "🚨" : "🔧"}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold ${textColor}`}>{t.trainId}</span>
                            <span className="text-xs opacity-70 font-mono">Route: {t.routeId}</span>
                          </div>
                          <p className="text-sm opacity-90 text-slate-700 dark:text-slate-300">
                            Health Score: <span className="font-bold">{t.healthScore}%</span> | Delay: {t.delayMinutes} mins
                          </p>
                        </div>
                        <div>
                          <button className="glass-btn px-4 py-1.5 text-xs font-semibold">Dispatch Crew</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
