"use client";
import MainLayout from "@/components/layout/MainLayout";
import dynamic from "next/dynamic";
import TrainStatusCard from "@/components/status/TrainStatusCard";
import CollisionMonitor from "@/components/status/CollisionMonitor";
import TrackAnomalyPanel from "@/components/status/TrackAnomalyPanel";
import RecommendationPanel from "@/components/ai/RecommendationPanel";
import AIAnalyticsRadar from "@/components/ai/AIAnalyticsRadar";
import AlertFeed from "@/components/alerts/AlertFeed";

const AdvancedRailwayMap = dynamic(() => import("@/components/map/AdvancedRailwayMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted/50 animate-pulse rounded-lg flex items-center justify-center"><span className="text-muted-foreground">Loading Map...</span></div>
});

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden bg-background">
        {/* Main grid */}
        <div className="flex-1 grid grid-cols-[1fr_240px] gap-3 p-3 overflow-hidden min-h-0">
          {/* Map */}
          <section id="map-container" className="panel overflow-hidden">
            <AdvancedRailwayMap />
          </section>
          {/* Right column */}
          <div className="flex flex-col gap-3 overflow-y-auto min-h-0 hide-scrollbar pb-6">
            <div className="shrink-0"><TrainStatusCard /></div>
            <div className="shrink-0"><CollisionMonitor /></div>
            <div className="shrink-0"><RecommendationPanel /></div>
            <div className="shrink-0"><AIAnalyticsRadar /></div>
          </div>
        </div>
        {/* Alert feed strip */}
        <div className="h-10 shrink-0 border-t border-border/50">
          <AlertFeed />
        </div>
      </div>
    </MainLayout>
  );
}

