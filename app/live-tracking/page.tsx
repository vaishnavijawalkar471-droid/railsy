"use client";

import { useLiveTracking } from "@/hooks/useLiveTracking";
import MainLayout from "@/components/layout/MainLayout";
import LiveTrackingMap from "@/components/live-tracking/LiveTrackingMap";
import TrainStatusCard from "@/components/live-tracking/TrainStatusCard";
import CollisionRiskCard from "@/components/live-tracking/CollisionRiskCard";
import FleetOverviewPanel from "@/components/live-tracking/FleetOverviewPanel";
import { useEffect, useRef } from "react";

export default function LiveTrackingPage() {
  const {
    trains,
    mapTrains,
    signals,
    collisionRisk,
    trainStatus,
    telemetry,
    loading,
    connected,
    lastUpdate,
    error,
    refresh,
  } = useLiveTracking();

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between px-6 py-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-saffron-d dark:text-saffron">Live Tracking</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
              <span className="text-[10px] text-slate-500">
                {connected ? "Connected" : error ? "Disconnected" : "Connecting..."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-[10px] text-slate-500">
                Last update: {lastUpdate}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-md bg-saffron/20 text-saffron-d dark:text-saffron border border-saffron/30 hover:bg-saffron/30 transition-colors disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-2 px-3 py-1.5 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-2 flex-shrink-0">
            <span>⚠</span>
            <span>{error}</span>
            <button onClick={refresh} className="ml-auto underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden p-3 gap-3 min-h-0">
          {/* Left sidebar - info panels */}
          <div className="w-72 flex flex-col gap-3 overflow-y-auto flex-shrink-0 scrollbar-thin pr-1">
            <TrainStatusCard status={trainStatus} telemetry={telemetry} />
            <CollisionRiskCard risk={collisionRisk} />
            <FleetOverviewPanel trains={trains} />
          </div>

          {/* Center - Map */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 panel overflow-hidden">
              <LiveTrackingMap mapTrains={mapTrains} signals={signals} />
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center gap-4 px-4 py-2 text-[10px] text-slate-500 border-t border-white/5 mt-1 flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {trains.filter((t) => t.status === "ACTIVE").length} Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {trains.filter((t) => t.status === "EMERGENCY").length} Emergency
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {trains.filter((t) => t.status === "MAINTENANCE").length} Maintenance
              </span>
              <span className="ml-auto">
                Mumbai–Pune Railway Corridor · Route length: 192 km
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}