"use client";
import { useAlertStore } from "@/store/alertStore";

const priorityConfig = {
  critical: { dot: "bg-red-500", text: "text-red-500", label: "CRIT" },
  warning: { dot: "bg-amber-500", text: "text-amber-500", label: "WARN" },
  info: { dot: "bg-emerald-500", text: "text-emerald-500", label: "INFO" },
};

export default function AlertFeed() {
  const alerts = useAlertStore((s) => s.alerts);
  return (
    <section id="alert-feed" className="h-full flex items-center bg-background/95 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center h-full gap-0">
        <div className="px-3 h-full flex items-center gap-1.5 border-r border-border/50 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Live</span>
        </div>
        <div id="alert-feed-container" className="flex items-center gap-3 px-4 overflow-x-auto flex-1 h-full">
          {alerts.length === 0 ? (
            <span className="text-[11px] text-muted-foreground italic">No active alerts</span>
          ) : alerts.map(a => {
            const cfg = priorityConfig[a.priority as keyof typeof priorityConfig] ?? priorityConfig.info;
            return (
              <div key={a.id} className="shrink-0 flex items-center gap-1.5 text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                <span className={`font-semibold ${cfg.text}`}>{a.trainId}</span>
                <span className="text-muted-foreground">—</span>
                <span className="text-foreground/80">{a.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

