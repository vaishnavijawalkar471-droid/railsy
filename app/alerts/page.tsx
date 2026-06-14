"use client";

import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/PanelCard";
import { useAlertStore } from "@/store/alertStore";

export default function AlertsPage() {
  const alerts = useAlertStore((s) => s.alerts);

  return (
    <MainLayout>
      <div className="p-6 h-full overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold text-saffron-d dark:text-saffron mb-6">System Alerts</h1>
        <div className="flex-1 min-h-0">
          <Card title="Live Alert Stream" accent="saffron" className="h-full">
            <div className="overflow-auto h-full pr-2">
              <div className="flex flex-col gap-3">
                {alerts.length === 0 ? (
                  <div className="text-slate-500 dark:text-slate-400 text-sm">No alerts at this time.</div>
                ) : (
                  alerts.map(a => {
                    const colors: Record<string, string> = {
                      critical: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
                      warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
                      info: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                    };
                    const icons: Record<string, string> = {
                      critical: "🔴", warning: "🟠", info: "🟢"
                    };
                    return (
                      <div key={a.id} className={`panel flex items-center p-4 border rounded-xl gap-4 transition-all duration-300 ${colors[a.priority]}`}>
                        <div className="text-xl">{icons[a.priority]}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold">{a.trainId}</span>
                            <span className="text-xs opacity-70 font-mono">{a.timestamp}</span>
                          </div>
                          <p className="text-sm opacity-90">{a.description}</p>
                        </div>
                        <div>
                          <button className="glass-btn px-4 py-1.5 text-xs font-semibold">Acknowledge</button>
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
