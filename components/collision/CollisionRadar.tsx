"use client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/PanelCard";
import { useCollisionStore } from "@/store/collisionStore";

export default function CollisionRadar() {
  const risk = useCollisionStore((s) => s.risk);
  const data = [
    { metric:"Risk",       value: risk?.riskScore ?? 18 },
    { metric:"Closing",    value: risk?.closingSpeed ?? 42 },
    { metric:"Confidence", value: risk?.confidence ?? 87 },
    { metric:"Speed",      value: 60 },
    { metric:"Distance",   value: 55 },
  ];
  return (
    <Card title="Collision Radar" accent="green">
      <div className="h-48">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(128,128,128,0.2)"/>
            <PolarAngleAxis dataKey="metric" tick={{fontSize:9, fill:"currentColor"}}/>
            <Radar dataKey="value" stroke="#FF9933" fill="#FF9933" fillOpacity={0.2} strokeWidth={2}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
