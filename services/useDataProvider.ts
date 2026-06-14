"use client";

import { useEffect } from "react";
import { useTrainStore } from "@/store/trainStore";
import { useAlertStore } from "@/store/alertStore";
import { useCollisionStore } from "@/store/collisionStore";
import { useFleetStore } from "@/store/fleetStore";
import { connectSocket, onSocketEvent } from "@/services/websocket/socket";

export function useDataProvider() {
  const setTrain = useTrainStore((s) => s.setTrain);
  const setTelemetry = useTrainStore((s) => s.setTelemetry);
  const setAlerts = useAlertStore((s) => s.setAlerts);
  const setRisk = useCollisionStore((s) => s.setRisk);
  const setTrains = useFleetStore((s) => s.setTrains);
  const setSummary = useFleetStore((s) => s.setSummary);

  useEffect(() => {
    // 1. Fetch initial data via REST API
    const fetchInitial = async () => {
      try {
        const { trainService } = await import("@/services/api/train.service");
        const { alertService } = await import("@/services/api/alert.service");
        const { fleetService } = await import("@/services/api/fleet.service");
        const { api } = await import("@/services/api/axios");

        const [train, telemetry, alerts, collision, fleetTrains, fleetSummary] =
          await Promise.all([
            trainService.getStatus().catch(() => null),
            trainService.getTelemetry().catch(() => null),
            alertService.getAll().catch(() => []),
            api.get("/api/collision").catch(() => ({ data: null })),
            fleetService.getTrains().catch(() => []),
            fleetService.getSummary().catch(() => null),
          ]);

        if (train) setTrain(train);
        if (telemetry) setTelemetry(telemetry);
        if (alerts.length > 0) setAlerts(alerts);
        if (collision?.data) setRisk(collision.data);
        if (fleetTrains.length > 0) setTrains(fleetTrains);
        if (fleetSummary) setSummary(fleetSummary);
      } catch (err) {
        console.warn("DataProvider: Initial fetch failed, relying on WS:", err);
      }
    };

    fetchInitial();

    // 2. Connect WebSocket for real-time updates
    connectSocket();
    const unsub = onSocketEvent("update", (data: any) => {
      if (data.trainStatus) setTrain(data.trainStatus);
      if (data.telemetry) setTelemetry(data.telemetry);
      if (data.collisionRisk) setRisk(data.collisionRisk);
      if (data.mapTrains) setTrains(data.mapTrains);
      if (data.alerts) setAlerts(data.alerts);
      if (data.fleetTrains) setTrains(data.fleetTrains);
      if (data.fleetSummary) setSummary(data.fleetSummary);
    });

    return () => {
      unsub();
    };
  }, [setTrain, setTelemetry, setAlerts, setRisk, setTrains, setSummary]);
}