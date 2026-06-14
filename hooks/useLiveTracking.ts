"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { connectSocket, disconnectSocket, onSocketEvent } from "@/services/websocket/socket";
import { fleetService } from "@/services/api/fleet.service";
import { mapService } from "@/services/api/map.service";
import { collisionService } from "@/services/api/collision.service";
import { trainService } from "@/services/api/train.service";
import { FleetTrain, MapTrain, RailwaySignal, CollisionRisk, TrainStatus, TelemetryData } from "@/types";

export interface LiveTrackingState {
  trains: FleetTrain[];
  mapTrains: MapTrain[];
  signals: RailwaySignal[];
  collisionRisk: CollisionRisk | null;
  trainStatus: TrainStatus | null;
  telemetry: TelemetryData | null;
  loading: boolean;
  connected: boolean;
  lastUpdate: string | null;
  error: string | null;
}

export function useLiveTracking() {
  const [state, setState] = useState<LiveTrackingState>({
    trains: [],
    mapTrains: [],
    signals: [],
    collisionRisk: null,
    trainStatus: null,
    telemetry: null,
    loading: true,
    connected: false,
    lastUpdate: null,
    error: null,
  });

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const updateRef = useRef<number>(0);

  // Fetch REST data (initial + fallback polling)
  const fetchRestData = useCallback(async () => {
    try {
      const [fleetTrains, mapTrains, signals, collision, train, telemetry] = await Promise.all([
        fleetService.getTrains().catch(() => [] as FleetTrain[]),
        mapService.getTrains().catch(() => [] as MapTrain[]),
        mapService.getSignals().catch(() => [] as RailwaySignal[]),
        collisionService.getRisk().catch(() => null),
        trainService.getStatus().catch(() => null),
        trainService.getTelemetry().catch(() => null),
      ]);

      setState((prev) => ({
        ...prev,
        trains: fleetTrains,
        mapTrains,
        signals,
        collisionRisk: collision,
        trainStatus: train,
        telemetry,
        loading: false,
        lastUpdate: new Date().toLocaleTimeString(),
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch live data",
      }));
    }
  }, []);

  // Handle WebSocket updates
  const handleWsUpdate = useCallback((data: any) => {
    updateRef.current += 1;

    setState((prev) => {
      const next = { ...prev };

      if (data.trainStatus) {
        next.trainStatus = {
          ...prev.trainStatus,
          ...data.trainStatus,
        } as TrainStatus;
      }

      if (data.telemetry) {
        next.telemetry = {
          ...prev.telemetry,
          ...data.telemetry,
        } as TelemetryData;
      }

      if (data.collisionRisk) {
        next.collisionRisk = {
          ...prev.collisionRisk,
          ...data.collisionRisk,
        } as CollisionRisk;
      }

      if (data.mapTrains) {
        next.mapTrains = data.mapTrains as MapTrain[];

        // Also update fleet trains positions/speed from map data
        next.trains = prev.trains.map((t) => {
          const mt = data.mapTrains.find((m: MapTrain) => m.trainId === t.trainId);
          if (mt) {
            return { ...t, latitude: mt.latitude, longitude: mt.longitude, speed: mt.speed };
          }
          return t;
        });
      }

      // Animate train speeds with slight variations for visual interest
      if (updateRef.current % 3 === 0 && !data.mapTrains) {
        next.trains = prev.trains.map((t) => ({
          ...t,
          speed: Math.max(0, Math.min(200, t.speed + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
          latitude: t.latitude + (Math.random() - 0.5) * 0.001,
          longitude: t.longitude + (Math.random() - 0.5) * 0.001,
        }));
        next.mapTrains = prev.mapTrains.map((t) => ({
          ...t,
          speed: Math.max(0, Math.min(200, t.speed + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))),
          latitude: t.latitude + (Math.random() - 0.5) * 0.001,
          longitude: t.longitude + (Math.random() - 0.5) * 0.001,
        }));
      }

      next.connected = true;
      next.lastUpdate = new Date().toLocaleTimeString();
      next.error = null;

      return next;
    });
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchRestData();

    // Connect WebSocket
    const socket = connectSocket();

    const unsubscribe = onSocketEvent("update", handleWsUpdate);

    // Handle socket connection state
    socket.on("connect", () => {
      setState((prev) => ({ ...prev, connected: true, error: null }));
    });

    socket.on("disconnect", () => {
      setState((prev) => ({ ...prev, connected: false }));
    });

    socket.on("connect_error", () => {
      setState((prev) => ({ ...prev, connected: false, error: "WebSocket connection failed" }));
    });

    // Fallback polling every 10s if WebSocket is not connected
    pollRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.connected) {
          fetchRestData();
        }
        return prev;
      });
    }, 10000);

    return () => {
      unsubscribe();
      if (pollRef.current) clearInterval(pollRef.current);
      disconnectSocket();
    };
  }, [fetchRestData, handleWsUpdate]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchRestData();
  }, [fetchRestData]);

  return { ...state, refresh };
}