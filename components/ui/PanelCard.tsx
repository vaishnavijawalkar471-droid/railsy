import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  accent?: "saffron" | "green" | "navy";
  action?: ReactNode;
}

const accentColors = {
  saffron: "text-[#FF9933]",
  green: "text-[#138808]",
  navy: "text-[#000080]",
};

export default function Card({ title, children, className = "", accent = "saffron", action }: PanelCardProps) {
  return (
    <div className={cn("panel p-4 h-full flex flex-col", className)}>
      {title && (
        <div className="mb-3 flex items-center justify-between shrink-0">
          <h3 className={cn("text-[11px] font-semibold tracking-[0.1em] uppercase", accentColors[accent])}>
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
