"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/PanelCard";
import SpeedGauge from "@/components/charts/SpeedGauge";
import { trainService } from "@/services/api/train.service";
import { api } from "@/services/api/axios";
import { TrainStatus, TelemetryData } from "@/types";

interface AIDecision {
  id: string;
  type: string;
  trainId: string;
  confidence: number;
  riskReduction: number;
  recommendedValue?: number;
  reasoning: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function TrainHealthPage() {
  const [train, setTrain] = useState<TrainStatus | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [aiDecisions, setAiDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("—");

  const fetchAll = async () => {
    try {
      const [trainData, telemetryData, aiData] = await Promise.all([
        trainService.getStatus().catch(() => null),
        trainService.getTelemetry().catch(() => null),
        api.get("/api/ai/decisions").then((r) => r.data).catch(() => []),
      ]);
      setTrain(trainData);
      setTelemetry(telemetryData);
      setAiDecisions(aiData as AIDecision[]);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError("Failed to load train health data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (val: number) => {
    if (val >= 80) return "text-emerald-400";
    if (val >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getHealthBg = (val: number) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const healthScore = train
    ? Math.round((train.engineHealth * 0.35 + (telemetry?.batteryHealth ?? 95) * 0.25 + (telemetry?.wheelHealth ?? 91) * 0.25 + train.fuelLevel * 0.15))
    : 0;

  const avgHealth = telemetry
    ? Math.round((telemetry.engineTemperature <= 90 ? 100 : telemetry.engineTemperature <= 100 ? 70 : 40) * 0.3 + telemetry.batteryHealth * 0.25 + telemetry.wheelHealth * 0.25 + telemetry.fuelLevel * 0.2)
    : 0;

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-saffron-d dark:text-saffron">Train Health</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${error ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
              <span className="text-[10px] text-slate-500">
                {error ? "Error" : loading ? "Loading..." : "Live"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">Last update: {lastUpdate}</span>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-md bg-saffron/20 text-saffron-d dark:text-saffron border border-saffron/30 hover:bg-saffron/30 transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-2 px-3 py-1.5 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-2 flex-shrink-0">
            <span>⚠</span>
            <span>{error}</span>
            <button onClick={fetchAll} className="ml-auto underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Top row: Health overview + Speed gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Overall Health */}
            <Card title={`Overall Health · ${train?.trainId ?? "—"}`} accent="saffron">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-24 h-24 mb-2">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-700"/>
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke={healthScore >= 80 ? "#22c55e" : healthScore >= 60 ? "#FF9933" : "#ef4444"}
                      strokeDasharray={`${(healthScore / 100) * 100.48} 100.48`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold font-mono ${getHealthColor(healthScore)}`}>
                      {healthScore}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {healthScore >= 80 ? "Healthy" : healthScore >= 60 ? "Needs Attention" : "Critical"}
                </div>
              </div>
            </Card>

            {/* Speed Gauge */}
            <Card title="Current Speed" accent="saffron">
              <SpeedGauge speed={train?.speed ?? 0} />
            </Card>

            {/* Driver Status */}
            <Card title="Driver Status" accent="green">
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  train?.driverStatus === "ACTIVE" ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}>
                  <span className={`text-3xl ${train?.driverStatus === "ACTIVE" ? "text-emerald-400" : "text-red-400"}`}>
                    {train?.driverStatus === "ACTIVE" ? "👤" : "⚠"}
                  </span>
                </div>
                <div className={`text-sm font-bold ${train?.driverStatus === "ACTIVE" ? "text-emerald-400" : "text-red-400"}`}>
                  {train?.driverStatus ?? "—"}
                </div>
                <div className="text-[10px] text-slate-500">Driver is {train?.driverStatus === "ACTIVE" ? "actively monitoring" : "inactive"}</div>
              </div>
            </Card>
          </div>

          {/* Vital signs grid */}
          <Card title="Vital Signs" accent="navy">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Engine Health", val: train?.engineHealth ?? 0, unit: "%", icon: "⚙️", max: 100 },
                { label: "Fuel Level", val: train?.fuelLevel ?? telemetry?.fuelLevel ?? 0, unit: "%", icon: "⛽", max: 100 },
                { label: "Battery Health", val: telemetry?.batteryHealth ?? 95, unit: "%", icon: "🔋", max: 100 },
                { label: "Wheel Health", val: telemetry?.wheelHealth ?? 91, unit: "%", icon: "🛞", max: 100 },
                { label: "Brake Pressure", val: telemetry?.brakePressure ?? 84, unit: "%", icon: "🛑", max: 100 },
                { label: "Engine Temp", val: telemetry?.engineTemperature ?? 82, unit: "°C", icon: "🌡️", max: 120 },
                { label: "Vibration", val: telemetry?.vibrationLevel ?? 12, unit: "Hz", icon: "📳", max: 50 },
                { label: "Track Condition", val: train?.trackCondition === "GOOD" ? 100 : train?.trackCondition === "MODERATE" ? 60 : 30, unit: "", icon: "🛤️", max: 100, label2: train?.trackCondition },
              ].map((m) => (
                <div key={m.label} className="panel p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{m.icon}</span>
                    <span className={`text-xs font-bold font-mono ${getHealthColor(m.val)}`}>
                      {m.val}{m.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-1.5">{m.label}</div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getHealthBg(m.val)}`}
                      style={{ width: `${(m.val / m.max) * 100}%` }}
                    />
                  </div>
                  {(m as any).label2 && (
                    <div className={`text-[10px] mt-1 font-medium ${
                      train?.trackCondition === "GOOD" ? "text-emerald-400" :
                      train?.trackCondition === "MODERATE" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {(m as any).label2}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Brake & Track Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Brake System" accent="saffron">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      train?.brakeStatus === "NORMAL" ? "bg-emerald-500" :
                      train?.brakeStatus === "WARNING" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                    <span className="text-sm font-medium">{train?.brakeStatus ?? "—"}</span>
                  </div>
                  <span className="text-sm font-mono">{telemetry?.brakePressure ?? "—"}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (telemetry?.brakePressure ?? 0) >= 80 ? "bg-emerald-500" :
                      (telemetry?.brakePressure ?? 0) >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${telemetry?.brakePressure ?? 0}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-emerald-500/10 rounded p-1.5">
                    <div className="text-emerald-400 font-bold">NORMAL</div>
                    <div className="text-slate-500">Safe</div>
                  </div>
                  <div className="bg-yellow-500/10 rounded p-1.5">
                    <div className="text-yellow-400 font-bold">WARNING</div>
                    <div className="text-slate-500">Caution</div>
                  </div>
                  <div className="bg-red-500/10 rounded p-1.5">
                    <div className="text-red-400 font-bold">CRITICAL</div>
                    <div className="text-slate-500">Immediate</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Track Condition" accent="green">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    train?.trackCondition === "GOOD" ? "bg-emerald-500" :
                    train?.trackCondition === "MODERATE" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm font-medium">{train?.trackCondition ?? "—"}</span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {train?.trackCondition === "GOOD"
                    ? "Track condition is normal. No speed restrictions required. Continue at current operational speed."
                    : train?.trackCondition === "MODERATE"
                    ? "Track condition requires attention. Reduce speed by 15 km/h and monitor for further degradation."
                    : "Track condition is poor. Immediate speed reduction required. Inspect section before proceeding."
                  }
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-emerald-500/10 rounded p-1.5">
                    <div className="text-emerald-400 font-bold">GOOD</div>
                    <div className="text-slate-500">Clear</div>
                  </div>
                  <div className="bg-yellow-500/10 rounded p-1.5">
                    <div className="text-yellow-400 font-bold">MODERATE</div>
                    <div className="text-slate-500">Caution</div>
                  </div>
                  <div className="bg-red-500/10 rounded p-1.5">
                    <div className="text-red-400 font-bold">POOR</div>
                    <div className="text-slate-500">Restricted</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Decisions */}
          <Card title="AI Recommendations" accent="saffron">
            <div className="space-y-3">
              {aiDecisions.length === 0 ? (
                <div className="text-sm text-slate-500 italic">No AI recommendations at this time.</div>
              ) : (
                aiDecisions.map((d) => (
                  <div key={d.id} className="panel p-3 border-l-4" style={{
                    borderLeftColor: d.status === "APPROVED" ? "#22c55e" : d.status === "REJECTED" ? "#ef4444" : "#FF9933"
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-slate-400">{d.type.replace(/_/g, " ")}</span>
                        <span className="text-[10px] text-slate-500">· {d.trainId}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        d.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                        d.status === "REJECTED" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">{d.reasoning}</p>
                    <div className="flex gap-3 text-[10px]">
                      <span className="text-slate-500">Confidence: <span className="text-emerald-400 font-mono">{d.confidence}%</span></span>
                      <span className="text-slate-500">Risk Reduction: <span className="text-emerald-400 font-mono">{d.riskReduction}%</span></span>
                      {d.recommendedValue && (
                        <span className="text-slate-500">Value: <span className="text-saffron font-mono">{d.recommendedValue}</span></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}