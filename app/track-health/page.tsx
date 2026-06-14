"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/PanelCard";
import { trackService } from "@/services/api/track.service";
import { api } from "@/services/api/axios";
import { trackAnomaliesMock, signalsMock } from "@/mock";

interface TrackAnomaly {
  id: string;
  label: string;
  value: string;
  color: string;
}

interface SignalData {
  id: string;
  status: "green" | "yellow" | "red";
}

export default function TrackHealthPage() {
  const [anomalies, setAnomalies] = useState<TrackAnomaly[]>(trackAnomaliesMock);
  const [signals, setSignals] = useState<SignalData[]>(signalsMock);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("Mock data");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [anomaliesData, signalsData] = await Promise.all([
        trackService.getAnomalies().catch(() => null),
        api.get("/api/map/signals").then((r) => r.data).catch(() => null),
      ]);
      if (anomaliesData && anomaliesData.length > 0) setAnomalies(anomaliesData as TrackAnomaly[]);
      if (signalsData && signalsData.length > 0) setSignals(signalsData as SignalData[]);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.info("Track API unavailable, using mock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute track health score from anomalies
  const severityMap: Record<string, number> = {
    "text-red-600 dark:text-red-400": 0,
    "text-saffron-d dark:text-saffron": 1,
    "text-igreen dark:text-green-400": 2,
  };
  const totalScore = anomalies.length
    ? Math.round(
        anomalies.reduce((sum, a) => {
          const severity = a.color.includes("red") ? 0 : a.color.includes("saffron") ? 1 : 2;
          return sum + severity;
        }, 0) / (anomalies.length * 2) * 100
      )
    : 0;

  const greenSignals = signals.filter((s) => s.status === "green").length;
  const yellowSignals = signals.filter((s) => s.status === "yellow").length;
  const redSignals = signals.filter((s) => s.status === "red").length;

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-saffron-d dark:text-saffron">Track Health</h1>
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
              onClick={fetchData}
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
            <button onClick={fetchData} className="ml-auto underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Overall Health Score */}
          <Card title="Track Health Overview" accent="saffron">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-700"/>
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke={totalScore >= 70 ? "#22c55e" : totalScore >= 40 ? "#FF9933" : "#ef4444"}
                      strokeDasharray={`${(totalScore / 100) * 100.48} 100.48`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold font-mono ${totalScore >= 70 ? "text-emerald-400" : totalScore >= 40 ? "text-saffron" : "text-red-400"}`}>
                      {totalScore}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Mumbai–Pune Corridor</div>
                  <div className="text-xs text-slate-500">Route length: 192 km · 2 main lines</div>
                  <div className="flex gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {greenSignals} Green
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      {yellowSignals} Yellow
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      {redSignals} Red
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Anomaly cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anomalies.length === 0 && !loading ? (
              <div className="col-span-full panel p-8 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-slate-400">No track anomalies detected — all clear</div>
              </div>
            ) : (
              anomalies.map((a) => (
                <Card key={a.id} title={a.label} accent={a.color.includes("red") ? "saffron" : "green"}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-mono">{a.value}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      a.color.includes("red") ? "bg-red-500/20 text-red-400" :
                      a.color.includes("saffron") ? "bg-yellow-500/20 text-saffron" :
                      "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {a.color.includes("red") ? "⚠ Critical" : a.color.includes("saffron") ? "⚠ Warning" : "✓ Clear"}
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      a.value === "Clear" ? "w-0" : "w-full"
                    } ${
                      a.color.includes("red") ? "bg-red-500" :
                      a.color.includes("saffron") ? "bg-yellow-500" :
                      "bg-emerald-500"
                    }`} style={{ width: a.value === "Clear" ? "0%" : "100%" }} />
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Track condition timeline */}
          <Card title="Track Segment Conditions" accent="navy">
            <div className="space-y-2">
              {[
                { segment: "Mumbai CST → Dadar", distance: "8 km", status: "GOOD", color: "bg-emerald-500" },
                { segment: "Dadar → Thane", distance: "22 km", status: "GOOD", color: "bg-emerald-500" },
                { segment: "Thane → Kalyan", distance: "18 km", status: "MODERATE", color: "bg-yellow-500" },
                { segment: "Kalyan → Karjat", distance: "38 km", status: "GOOD", color: "bg-emerald-500" },
                { segment: "Karjat → Lonavala", distance: "42 km", status: "POOR", color: "bg-red-500" },
                { segment: "Lonavala → Khandala", distance: "12 km", status: "MODERATE", color: "bg-yellow-500" },
                { segment: "Khandala → Pune Jn", distance: "52 km", status: "GOOD", color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.segment} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{s.segment}</div>
                    <div className="text-[10px] text-slate-500">{s.distance}</div>
                  </div>
                  <span className={`text-[10px] font-medium ${
                    s.status === "GOOD" ? "text-emerald-400" :
                    s.status === "MODERATE" ? "text-yellow-400" :
                    "text-red-400"
                  }`}>{s.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}