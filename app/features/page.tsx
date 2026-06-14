"use client";
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";

const features = [
  {
    id: "live-tracking",
    icon: "🛰️",
    title: "Live Train Tracking",
    subtitle: "Real-time GPS telemetry",
    description:
      "Monitor every train on the Mumbai–Pune corridor in real-time. GPS positions update continuously, with speed, heading, and delay data surfaced instantly.",
    highlights: ["Sub-second position updates", "Multi-train simultaneous view", "Geofence alerts"],
    color: "saffron",
    gradient: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-600/30 dark:border-orange-500/30",
    textColor: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-600 dark:bg-orange-400",
  },
  {
    id: "collision-monitor",
    icon: "⚠️",
    title: "Collision Detection",
    subtitle: "AI-powered risk scoring",
    description:
      "Continuously calculates inter-train distances and closing speeds. The AI engine predicts collision risk up to 10 minutes in advance and recommends actions.",
    highlights: ["Time-to-impact calculation", "Threat level classification", "Automated brake advisory"],
    color: "red",
    gradient: "from-red-500/20 to-red-600/5",
    border: "border-red-600/30 dark:border-red-500/30",
    textColor: "text-red-600 dark:text-red-400",
    dot: "bg-red-600 dark:bg-red-400",
  },
  {
    id: "train-health",
    icon: "⚙️",
    title: "Train Health Monitor",
    subtitle: "Full diagnostic telemetry",
    description:
      "Engine temperature, brake pressure, fuel levels, wheel health, and battery charge — all monitored via onboard sensors and streamed live to the dashboard.",
    highlights: ["8-channel sensor fusion", "Predictive maintenance alerts", "Historical trend charts"],
    color: "blue",
    gradient: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-600/30 dark:border-blue-500/30",
    textColor: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-600 dark:bg-blue-400",
  },
  {
    id: "track-health",
    icon: "🛤️",
    title: "Track Health Analysis",
    subtitle: "Corridor condition scoring",
    description:
      "Each segment of the 192 km Mumbai–Pune corridor is graded independently. Vibration anomalies, surface conditions, and signal states are aggregated into a single health score.",
    highlights: ["192 km corridor coverage", "Per-segment condition grading", "Signal status aggregation"],
    color: "green",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-600/30 dark:border-emerald-500/30",
    textColor: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-700 dark:bg-emerald-400",
  },
  {
    id: "fleet",
    icon: "🚂",
    title: "Fleet Management",
    subtitle: "Full fleet visibility",
    description:
      "See every train in your fleet — status, route, speed, health, fuel, and delay — in a single sortable table. Summary statistics give instant fleet health at a glance.",
    highlights: ["Real-time fleet table", "Utilization metrics", "Delay & fuel analytics"],
    color: "purple",
    gradient: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-600/30 dark:border-purple-500/30",
    textColor: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-600 dark:bg-purple-400",
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI Recommendations",
    subtitle: "Decision-support engine",
    description:
      "The onboard AI evaluates sensor data, track conditions, and traffic patterns to generate speed adjustment, route change, and maintenance recommendations with confidence scores.",
    highlights: ["Confidence-scored decisions", "Risk-reduction quantification", "PENDING / APPROVED / REJECTED workflow"],
    color: "saffron",
    gradient: "from-yellow-500/20 to-yellow-600/5",
    border: "border-yellow-600/30 dark:border-yellow-500/30",
    textColor: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-600 dark:bg-yellow-400",
  },
  {
    id: "alerts",
    icon: "🔔",
    title: "Real-time Alert Feed",
    subtitle: "Prioritised notifications",
    description:
      "Critical, warning, and info alerts are streamed in real-time. Each alert is tagged to a specific train and timestamped so operators can respond without delay.",
    highlights: ["3-tier priority system", "Train-level attribution", "Live scrolling feed"],
    color: "red",
    gradient: "from-rose-500/20 to-rose-600/5",
    border: "border-rose-600/30 dark:border-rose-500/30",
    textColor: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-600 dark:bg-rose-400",
  },
  {
    id: "websocket",
    icon: "⚡",
    title: "WebSocket Data Layer",
    subtitle: "Sub-100ms data pipeline",
    description:
      "All real-time data flows through a Socket.IO connection with automatic polling fallback. State is managed globally via Zustand for instant UI updates across every page.",
    highlights: ["Socket.IO with polling fallback", "Zustand global state", "REST API backup every 10s"],
    color: "blue",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "border-cyan-600/30 dark:border-cyan-500/30",
    textColor: "text-cyan-700 dark:text-cyan-400",
    dot: "bg-cyan-700 dark:bg-cyan-400",
  },
];

const stats = [
  { value: "192 km", label: "Corridor Length" },
  { value: "128", label: "Trains Tracked" },
  { value: "<100ms", label: "Update Latency" },
  { value: "8", label: "Sensor Channels" },
];

export default function FeaturesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        {/* Hero strip */}
        <div className="relative px-8 py-10 border-b border-black/5 dark:border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/5 dark:from-orange-900/20 dark:to-blue-900/10 pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-full px-3 py-0.5">
                Platform Overview
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Railsy — AI Railway Command Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
              An integrated safety and operations platform for the Mumbai–Pune railway corridor.
              Eight core modules work together to give operators complete situational awareness,
              predictive safety insights, and fleet-wide operational control.
            </p>
            {/* Stat bar */}
            <div className="flex flex-wrap gap-6 mt-6">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-orange-400 font-mono">{s.value}</span>
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.id}
              className={`group relative rounded-xl border ${f.border} bg-gradient-to-br ${f.gradient} p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30`}
              onClick={() => setActive(active === f.id ? null : f.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-black/5 dark:bg-white/5 border ${f.border}`}>
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">{f.title}</div>
                    <div className={`text-[11px] ${f.textColor}`}>{f.subtitle}</div>
                  </div>
                </div>
                <span className={`text-xs ${f.textColor} transition-transform duration-300 ${active === f.id ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {f.description}
              </p>

              {/* Highlights — expand on click */}
              <div className={`overflow-hidden transition-all duration-300 ${active === f.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-black/5 dark:border-white/5 pt-3 space-y-1.5">
                  {f.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${f.dot} flex-shrink-0`} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer hint */}
              <div className={`text-[10px] ${f.textColor} mt-2 opacity-60 group-hover:opacity-100 transition-opacity`}>
                {active === f.id ? "Click to collapse" : "Click to see highlights →"}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture note */}
        <div className="mx-6 mb-6 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/2 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🏗️</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 14", "TypeScript", "Tailwind CSS", "Zustand",
              "Socket.IO", "Flask-SocketIO", "React-Leaflet",
              "Recharts", "Axios", "Python Flask"
            ].map((t) => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
