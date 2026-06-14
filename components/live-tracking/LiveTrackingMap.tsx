"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapTrain, RailwaySignal } from "@/types";

interface LiveTrackingMapProps {
  mapTrains: MapTrain[];
  signals: RailwaySignal[];
}

export default function LiveTrackingMap({ mapTrains, signals }: LiveTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const prevPositionsRef = useRef<Map<string, { lat: number; lng: number }>>(new Map());

  // Convert lat/lng to canvas x/y (simple projection for India corridor)
  const project = (lat: number, lng: number, w: number, h: number) => {
    // Bounding box roughly covering Mumbai-Pune corridor
    const minLat = 17.5, maxLat = 19.5;
    const minLng = 72.5, maxLng = 74.5;
    const x = ((lng - minLng) / (maxLng - minLng)) * w;
    const y = ((maxLat - lat) / (maxLat - minLat)) * h;
    return { x, y };
  };

  // Compute positions once per render with interpolation
  const trainPositions = useMemo(() => {
    const w = 680;
    const h = 380;
    return mapTrains.map((t) => {
      const pos = project(t.latitude, t.longitude, w, h);
      return { ...t, x: pos.x, y: pos.y };
    });
  }, [mapTrains]);

  const signalPositions = useMemo(() => {
    const w = 680;
    const h = 380;
    return signals.map((s) => {
      const pos = project(s.latitude, s.longitude, w, h);
      return { ...s, x: pos.x, y: pos.y };
    });
  }, [signals]);

  // Store positions for smooth interpolation in animation
  useEffect(() => {
    trainPositions.forEach((t) => {
      prevPositionsRef.current.set(t.trainId, { lat: t.latitude, lng: t.longitude });
    });
  }, [trainPositions]);

  // Determine the "current" train (first active one) for highlight
  const currentTrain = trainPositions.length > 0 ? trainPositions[0] : null;
  const nearbyTrains = trainPositions.slice(1);

  // Scale helper for responding to container size
  const scale = (val: number) => val;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-[#060B1A] rounded-sm overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 680 380" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <rect width="680" height="380" fill="#060B1A"/>
        <defs>
          <pattern id="live-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,128,0.15)" strokeWidth="1"/>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="pulse">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect width="680" height="380" fill="url(#live-grid)"/>

        {/* Main railway line */}
        <path d="M60 300 Q180 260 320 200 Q420 160 580 120" stroke="#FF9933" strokeWidth="3" fill="none" opacity="0.8"/>
        <path d="M60 300 Q160 290 280 270 Q380 255 580 220" stroke="#138808" strokeWidth="1.5" fill="none" opacity="0.5"/>

        {/* Station markers */}
        <circle cx="60" cy="300" r="8" fill="#FF9933" stroke="#fff" strokeWidth="1.5"/>
        <text x="72" y="315" fill="rgba(255,255,255,0.7)" fontSize="9">Mumbai CST</text>
        <circle cx="320" cy="200" r="6" fill="#fff" stroke="#138808" strokeWidth="1.5"/>
        <text x="332" y="198" fill="rgba(255,255,255,0.7)" fontSize="9">Lonavala</text>
        <circle cx="580" cy="120" r="8" fill="#138808" stroke="#fff" strokeWidth="1.5"/>
        <text x="545" y="113" fill="rgba(255,255,255,0.7)" fontSize="9">Pune Jn</text>

        {/* Signals */}
        {signalPositions.map((s) => (
          <g key={s.id}>
            <circle
              cx={s.x}
              cy={s.y}
              r="5"
              fill={s.status === "green" ? "#4CAF50" : s.status === "yellow" ? "#FF9800" : "#EF4444"}
              filter="url(#glow)"
            />
            <text
              x={s.x + 8}
              y={s.y + 3}
              fill="rgba(255,255,255,0.5)"
              fontSize="7"
            >{s.id}</text>
          </g>
        ))}

        {/* Nearby trains */}
        {nearbyTrains.map((t) => (
          <g key={t.trainId}>
            {/* Speed/direction indicator */}
            <line
              x1={t.x}
              y1={t.y}
              x2={t.x + Math.cos((t.heading || 0) * Math.PI / 180) * 20}
              y2={t.y - Math.sin((t.heading || 0) * Math.PI / 180) * 20}
              stroke="#4FC3F7"
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx={t.x}
              cy={t.y}
              r="5"
              fill="#4FC3F7"
              stroke="#fff"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <rect
              x={t.x + 8}
              y={t.y - 8}
              width={48}
              height={16}
              rx="3"
              fill="rgba(0,0,30,0.85)"
              stroke="#4FC3F7"
              strokeWidth="1"
            />
            <text x={t.x + 12} y={t.y + 1} fill="#4FC3F7" fontSize="8" fontWeight="bold">{t.trainId}</text>
            <text x={t.x + 12} y={t.y + 10} fill="rgba(255,255,255,0.5)" fontSize="6">{t.speed} km/h</text>
          </g>
        ))}

        {/* Current train (highlighted) */}
        {currentTrain && (
          <g>
            {/* Speed/direction indicator */}
            <line
              x1={currentTrain.x}
              y1={currentTrain.y}
              x2={currentTrain.x + Math.cos((currentTrain.heading || 0) * Math.PI / 180) * 25}
              y2={currentTrain.y - Math.sin((currentTrain.heading || 0) * Math.PI / 180) * 25}
              stroke="#FF9933"
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Pulsing outer ring */}
            <circle
              cx={currentTrain.x}
              cy={currentTrain.y}
              r="14"
              fill="rgba(255,153,51,0.15)"
              stroke="#FF9933"
              strokeWidth="1"
              className="animate-ping"
              style={{ animationDuration: "2s" }}
            />
            <circle
              cx={currentTrain.x}
              cy={currentTrain.y}
              r="8"
              fill="rgba(255,153,51,0.3)"
              stroke="#FF9933"
              strokeWidth="2"
              filter="url(#pulse)"
            />
            <circle
              cx={currentTrain.x}
              cy={currentTrain.y}
              r="4"
              fill="#FF9933"
              stroke="#fff"
              strokeWidth="2"
            />
            {/* Info badge */}
            <rect
              x={currentTrain.x + 12}
              y={currentTrain.y - 10}
              width={62}
              height={20}
              rx="4"
              fill="rgba(0,0,30,0.95)"
              stroke="#FF9933"
              strokeWidth="1"
            />
            <text x={currentTrain.x + 16} y={currentTrain.y + 2} fill="#FF9933" fontSize="9" fontWeight="bold">
              {currentTrain.trainId}
            </text>
            <text x={currentTrain.x + 16} y={currentTrain.y + 11} fill="rgba(255,255,255,0.6)" fontSize="7">
              {currentTrain.speed} km/h
            </text>
          </g>
        )}

        {/* Collision risk zone indicator */}
        {currentTrain && nearbyTrains.length > 0 && (
          <g>
            <circle
              cx={(currentTrain.x + nearbyTrains[0].x) / 2}
              cy={(currentTrain.y + nearbyTrains[0].y) / 2}
              r="25"
              fill="rgba(211,47,47,0.06)"
              stroke="rgba(211,47,47,0.3)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <text
              x={(currentTrain.x + nearbyTrains[0].x) / 2 - 20}
              y={(currentTrain.y + nearbyTrains[0].y) / 2 + 30}
              fill="rgba(211,47,47,0.6)"
              fontSize="7"
            >⚠ Monitoring Zone</text>
          </g>
        )}

        {/* Weather overlay */}
        <rect x="10" y="55" width="82" height="28" rx="4" fill="rgba(0,0,60,0.75)" stroke="rgba(100,150,255,0.4)" strokeWidth="1"/>
        <text x="18" y="68" fill="rgba(200,220,255,0.9)" fontSize="8">🌧 Heavy Rain</text>
        <text x="23" y="79" fill="rgba(200,220,255,0.6)" fontSize="7">Visibility 60%</text>

        {/* Legend */}
        <rect x="530" y="10" width="140" height="100" rx="5" fill="rgba(0,0,30,0.7)" stroke="rgba(255,153,51,0.3)" strokeWidth="1"/>
        <text x="540" y="27" fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="bold">Map Layers</text>
        <circle cx="542" cy="40" r="4" fill="#FF9933"/><text x="552" y="44" fill="rgba(255,255,255,0.6)" fontSize="8">Your Train</text>
        <circle cx="542" cy="54" r="4" fill="#4FC3F7"/><text x="552" y="58" fill="rgba(255,255,255,0.6)" fontSize="8">Nearby Trains</text>
        <circle cx="542" cy="68" r="4" fill="#4CAF50"/><text x="552" y="72" fill="rgba(255,255,255,0.6)" fontSize="8">Signal (Green)</text>
        <circle cx="542" cy="82" r="4" fill="#FF9800"/><text x="552" y="86" fill="rgba(255,255,255,0.6)" fontSize="8">Signal (Yellow)</text>
        <circle cx="542" cy="96" r="4" fill="rgba(211,47,47,0.6)"/><text x="552" y="100" fill="rgba(255,255,255,0.6)" fontSize="8">Risk Zone</text>

        {/* Bottom status bar */}
        <text x="10" y="370" fill="rgba(255,255,255,0.3)" fontSize="8">
          Mumbai–Pune Corridor · {mapTrains.length} trains tracked · {signals.length} signals
        </text>
      </svg>

      {/* Connection indicator overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 rounded-full px-3 py-1 border border-white/10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-white/70">LIVE</span>
      </div>
    </div>
  );
}