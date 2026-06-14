"use client";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import StatusIndicator from "@/components/ui/StatusIndicator";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      id="header-main"
      className={cn(
        "h-14 flex items-center gap-4 px-5 z-50 shrink-0",
        "bg-background/80 backdrop-blur-xl",
        "border-b border-border/60",
        "transition-all duration-300"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 bg-[#FF9933] rounded-lg flex items-center justify-center text-sm shadow-sm">
          🚆
        </div>
        <div>
          <div className="text-foreground font-semibold tracking-[0.15em] text-sm leading-none">RAILSY</div>
          <div className="text-[#FF9933] text-[9px] tracking-widest leading-none mt-0.5 font-medium">COMMAND CENTER</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border/60 shrink-0" />

      {/* Train & route */}
      <div id="train-id" className="hidden md:flex flex-col">
        <span className="text-[#FF9933] font-semibold text-sm leading-none">TR-4481</span>
        <span id="route-id" className="text-muted-foreground text-[10px] mt-0.5">Mumbai → Pune</span>
      </div>

      {/* Status pills */}
      <div className="hidden lg:flex items-center gap-3 ml-1">
        <div id="connection-status"><StatusIndicator label="Connected" status="online" /></div>
        <div id="gps-status"><StatusIndicator label="GPS Active" status="online" /></div>
        <div id="ai-status"><StatusIndicator label="AI Online" status="online" /></div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-muted-foreground text-xs font-mono tabular-nums hidden sm:block">{time}</span>
        <ThemeToggle />
        <button
          id="emergency-stop-btn"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
            "bg-red-600 hover:bg-red-500 text-white",
            "shadow-sm hover:shadow-red-500/25 transition-all duration-200"
          )}
        >
          <AlertTriangle size={13} />
          <span className="hidden sm:inline">Emergency</span>
        </button>
      </div>
    </header>
  );
}

