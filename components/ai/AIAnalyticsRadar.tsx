"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import Card from "@/components/ui/PanelCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/radar-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const chartData = [
  { metric: "Safety", performance: 95, target: 100 },
  { metric: "Punctuality", performance: 88, target: 90 },
  { metric: "Maintenance", performance: 92, target: 95 },
  { metric: "Efficiency", performance: 85, target: 80 },
  { metric: "Comfort", performance: 90, target: 85 },
  { metric: "Energy", performance: 78, target: 80 },
];

const chartConfig = {
  performance: {
    label: "Current",
    color: "#FF9933", // Saffron
  },
  target: {
    label: "Target",
    color: "#138808", // India Green
  },
} satisfies ChartConfig;

export default function AIAnalyticsRadar() {
  return (
    <Card title="Fleet Analytics" accent="saffron">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">System Metrics</span>
        <Badge
          variant="outline"
          className="text-igreen-d bg-igreen/10 border-none"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>+4.2%</span>
        </Badge>
      </div>
      <div className="pb-0 w-full overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <PolarGrid strokeDasharray="3 3" />
            <Radar
              name="Current"
              dataKey="performance"
              stroke="var(--color-performance)"
              fill="var(--color-performance)"
              fillOpacity={0.2}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="var(--color-target)"
              fill="var(--color-target)"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
