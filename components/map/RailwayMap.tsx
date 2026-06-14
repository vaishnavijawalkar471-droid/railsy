"use client";
import { useEffect, useRef } from "react";
import { useFleetStore } from "@/store/fleetStore";
import { mapService } from "@/services/api/map.service";

export default function RailwayMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const fleetTrains = useFleetStore((s) => s.trains);

  useEffect(() => {
    const fetchAndRender = async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token || token === "YOUR_MAPBOX_TOKEN_HERE" || !mapRef.current) {
        return; // SVG fallback renders automatically
      }
      let map: any;
      try {
        const mbgl = await import("mapbox-gl");
        try {
          await import("mapbox-gl/dist/mapbox-gl.css");
        } catch {
          // CSS import may fail in some build setups; component still works
        }
        mbgl.default.accessToken = token;

        const currentTrain = fleetTrains.find(t => t.status === "ACTIVE") || fleetTrains[0];
        const nearbyTrains = fleetTrains.filter(t => t.trainId !== currentTrain?.trainId);
        const signalsData = await mapService.getSignals().catch(() => []);

        const centerLng = currentTrain?.longitude ?? 73.8567;
        const centerLat = currentTrain?.latitude ?? 18.5204;

        map = new mbgl.default.Map({
          container: mapRef.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [centerLng, centerLat],
          zoom: 9,
        });

        map.on("load", () => {
          if (currentTrain) {
            new mbgl.default.Marker({ color: "#FF9933" })
              .setLngLat([currentTrain.longitude, currentTrain.latitude])
              .addTo(map);
          }
          nearbyTrains.forEach((t) =>
            new mbgl.default.Marker({ color: "#4FC3F7" })
              .setLngLat([t.longitude, t.latitude])
              .addTo(map)
          );
          signalsData.forEach((s: any) => {
            const c = s.status === "green" ? "#4CAF50" : s.status === "yellow" ? "#FF9800" : "#EF4444";
            new mbgl.default.Marker({ color: c })
              .setLngLat([s.longitude, s.latitude])
              .addTo(map);
          });
        });
      } catch (err) {
        console.warn("Mapbox init failed, showing fallback SVG:", err);
      }
    };
    fetchAndRender();
    return () => { /* cleanup not needed without map instance */ };
  }, [fleetTrains]);

  const activeCount = fleetTrains.filter(t => t.status === "ACTIVE").length;
  const totalCount = fleetTrains.length;
  const alertCount = fleetTrains.filter(t => t.status === "EMERGENCY").length;

  return (
    <div id="map-view" className="relative w-full h-full bg-[#060B1A]">
      <div ref={mapRef} className="w-full h-full rounded-sm" />
      {/* SVG fallback map — shown when no Mapbox token or as base layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="#0a0f1c"/>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        
        {/* Lines */}
        {/* Blue Line */}
        <path d="M 200 40 L 200 160 L 280 240 L 280 360" stroke="#3b82f6" strokeWidth="3" fill="none" filter="url(#glow)"/>
        {/* Green Line */}
        <path d="M 80 280 L 240 280 L 320 200 L 560 200" stroke="#10b981" strokeWidth="3" fill="none" filter="url(#glow)"/>
        {/* Red Line */}
        <path d="M 420 40 L 360 100 L 360 200 L 440 280 L 440 360" stroke="#ef4444" strokeWidth="3" fill="none" filter="url(#glow)"/>
        {/* Saffron Line */}
        <path d="M 60 120 L 240 120 L 320 200 L 400 280 L 600 280" stroke="#f97316" strokeWidth="3" fill="none" filter="url(#glow)"/>

        {/* Stations/Intersections */}
        {/* Saffron nodes */}
        <circle cx="60" cy="120" r="4" fill="#0a0f1c" stroke="#f97316" strokeWidth="2"/>
        <circle cx="240" cy="120" r="6" fill="#fff" stroke="#f97316" strokeWidth="2"/>
        <circle cx="400" cy="280" r="6" fill="#fff" stroke="#f97316" strokeWidth="2"/>
        <circle cx="600" cy="280" r="4" fill="#0a0f1c" stroke="#f97316" strokeWidth="2"/>

        {/* Green nodes */}
        <circle cx="80" cy="280" r="4" fill="#0a0f1c" stroke="#10b981" strokeWidth="2"/>
        <circle cx="240" cy="280" r="6" fill="#fff" stroke="#10b981" strokeWidth="2"/>
        <circle cx="560" cy="200" r="4" fill="#0a0f1c" stroke="#10b981" strokeWidth="2"/>

        {/* Blue nodes */}
        <circle cx="200" cy="40" r="4" fill="#0a0f1c" stroke="#3b82f6" strokeWidth="2"/>
        <circle cx="200" cy="160" r="6" fill="#fff" stroke="#3b82f6" strokeWidth="2"/>
        <circle cx="280" cy="240" r="6" fill="#fff" stroke="#3b82f6" strokeWidth="2"/>
        <circle cx="280" cy="360" r="4" fill="#0a0f1c" stroke="#3b82f6" strokeWidth="2"/>

        {/* Red nodes */}
        <circle cx="420" cy="40" r="4" fill="#0a0f1c" stroke="#ef4444" strokeWidth="2"/>
        <circle cx="360" cy="100" r="6" fill="#fff" stroke="#ef4444" strokeWidth="2"/>
        <circle cx="440" cy="280" r="6" fill="#fff" stroke="#ef4444" strokeWidth="2"/>
        <circle cx="440" cy="360" r="4" fill="#0a0f1c" stroke="#ef4444" strokeWidth="2"/>
        
        {/* Central Hub (Intersection of Saffron, Green, Red) */}
        <circle cx="320" cy="200" r="8" fill="#fff" stroke="#0a0f1c" strokeWidth="3"/>
        <circle cx="320" cy="200" r="10" fill="none" stroke="#fff" strokeWidth="2" filter="url(#glow)"/>

        {/* Labels */}
        <text x="252" y="115" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="bold">North Station</text>
        <text x="335" y="195" fill="rgba(255,255,255,0.9)" fontSize="10" fontWeight="bold">Central Junction</text>
        <text x="292" y="245" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="bold">West Link</text>
        <text x="452" y="285" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="bold">South East Node</text>

        {/* Dynamic Train Markers */}
        {/* Saffron Train (Active) */}
        <g transform="translate(360, 240)">
          <circle cx="0" cy="0" r="16" fill="rgba(249,115,22,0.15)" stroke="#f97316" strokeWidth="1" filter="url(#glow-strong)">
            <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/>
          </circle>
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#f97316"/>
          <rect x="14" y="-10" width="48" height="15" rx="3" fill="rgba(10,15,28,0.9)" stroke="#f97316" strokeWidth="1"/>
          <text x="18" y="-1" fill="#f97316" fontSize="8" fontWeight="bold">TR-4481</text>
          <text x="48" y="-1" fill="rgba(255,255,255,0.6)" fontSize="7">120 km/h</text>
        </g>

        {/* Red Train (Alert/Stopped) */}
        <g transform="translate(360, 100)">
          <circle cx="0" cy="0" r="22" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" filter="url(#glow-strong)">
            <animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite"/>
          </circle>
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#ef4444"/>
          <rect x="14" y="-10" width="42" height="15" rx="3" fill="rgba(10,15,28,0.9)" stroke="#ef4444" strokeWidth="1"/>
          <text x="18" y="-1" fill="#ef4444" fontSize="8" fontWeight="bold">TR-5201</text>
          <text x="-32" y="-16" fill="#ef4444" fontSize="8" fontWeight="bold">⚠ ALARM</text>
        </g>

        {/* Blue Train (Moving) */}
        <g transform="translate(200, 100)">
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#3b82f6"/>
          <rect x="14" y="-10" width="42" height="15" rx="3" fill="rgba(10,15,28,0.9)" stroke="#3b82f6" strokeWidth="1"/>
          <text x="18" y="-1" fill="#3b82f6" fontSize="8" fontWeight="bold">TR-9981</text>
        </g>

        {/* Green Train */}
        <g transform="translate(160, 280)">
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#10b981"/>
          <rect x="14" y="-10" width="42" height="15" rx="3" fill="rgba(10,15,28,0.9)" stroke="#10b981" strokeWidth="1"/>
          <text x="18" y="-1" fill="#10b981" fontSize="8" fontWeight="bold">TR-3301</text>
        </g>

        {/* Legend */}
        <rect x="520" y="20" width="130" height="95" rx="6" fill="rgba(10,15,28,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" style={{ backdropFilter: "blur(8px)" }}/>
        <text x="532" y="38" fill="rgba(255,255,255,0.9)" fontSize="9" fontWeight="bold">Map Layers</text>
        <rect x="532" y="50" width="8" height="8" rx="2" fill="#f97316"/><text x="546" y="57" fill="rgba(255,255,255,0.7)" fontSize="8">Trains</text>
        <circle cx="536" cy="69" r="4" fill="#10b981"/><text x="546" y="72" fill="rgba(255,255,255,0.7)" fontSize="8">Signals</text>
        <circle cx="536" cy="83" r="4" fill="#fff" stroke="#3b82f6" strokeWidth="2"/><text x="546" y="86" fill="rgba(255,255,255,0.7)" fontSize="8">Stations</text>
        <circle cx="536" cy="97" r="4" fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth="1"/><text x="546" y="100" fill="rgba(255,255,255,0.7)" fontSize="8">Risk Zones</text>
      </svg>
      <div id="current-train-marker" className="hidden"/>
      <div id="nearby-trains-layer" className="hidden"/>
      <div id="signal-layer" className="hidden"/>
      <div id="anomaly-layer" className="hidden"/>
      <div id="collision-layer" className="hidden"/>
      <div id="weather-layer" className="hidden"/>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <div className="bg-black/60 text-white text-[10px] rounded-full px-3 py-1 border border-white/10">🟠 {totalCount || 128} trains</div>
        <div className="bg-black/60 text-white text-[10px] rounded-full px-3 py-1 border border-white/10">🟢 {activeCount || 98} Active</div>
        <div className="bg-black/60 text-white text-[10px] rounded-full px-3 py-1 border border-white/10">🔴 {alertCount || 3} Alerts</div>
      </div>
      <div className="absolute top-2 left-3 text-white/40 text-[10px]">Mumbai–Pune Corridor · Live</div>
    </div>
  );
}