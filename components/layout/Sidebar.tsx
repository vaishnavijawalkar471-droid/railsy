"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Route, HeartPulse, Bell,
  Radio, ShieldAlert, Train, Wrench, Settings
} from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Map, Route, HeartPulse, Bell,
  Radio, ShieldAlert, Train, Wrench, Settings
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      id="sidebar-navigation"
      className={cn(
        "w-[200px] shrink-0 flex flex-col z-40",
        "bg-background/95 backdrop-blur-sm",
        "border-r border-border/60",
        "transition-colors duration-300"
      )}
    >
      {/* Section label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Navigation</p>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Settings;
          const active = pathname === item.href;
          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                active
                  ? "bg-[#FF9933]/10 text-[#FF9933] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon
                size={15}
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  active ? "text-[#FF9933]" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="leading-none">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-semibold rounded-full px-1.5 py-0.5 leading-none">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* System status */}
      <div className="p-3 mx-2 mb-3 mt-auto">
        <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808] inline-block" />
            <span className="text-xs font-medium text-foreground">System Nominal</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>API</span><span className="text-[#138808] font-medium">Online</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>WebSocket</span><span className="text-[#138808] font-medium">Live</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>AI Engine</span><span className="text-[#138808] font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

