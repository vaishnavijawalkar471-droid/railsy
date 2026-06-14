import { create } from "zustand";
import { TrainStatus, TelemetryData } from "@/types";
import { trainService } from "@/services/api/train.service";
import { trainStatusMock } from "@/mock";

const telemetryDefault: TelemetryData = {
  speed: 94,
  targetSpeed: 100,
  safeSpeed: 110,
  engineTemperature: 82,
  brakePressure: 87,
  fuelLevel: 71,
  batteryHealth: 95,
  wheelHealth: 91,
  vibrationLevel: 12,
  timestamp: new Date().toISOString(),
};

interface TrainStore {
  train: TrainStatus | null;
  telemetry: TelemetryData | null;
  loading: boolean;
  setTrain: (t: TrainStatus) => void;
  setTelemetry: (t: TelemetryData) => void;
  setLoading: (b: boolean) => void;
  fetchAll: () => Promise<void>;
}

export const useTrainStore = create<TrainStore>((set) => ({
  train: trainStatusMock,       // seeded immediately — never shows 0/null
  telemetry: telemetryDefault,  // seeded immediately
  loading: false,
  setTrain: (train) => set({ train }),
  setTelemetry: (telemetry) => set({ telemetry }),
  setLoading: (loading) => set({ loading }),
  fetchAll: async () => {
    set({ loading: true });
    try {
      const [train, telemetry] = await Promise.all([
        trainService.getStatus(),
        trainService.getTelemetry(),
      ]);
      set({ train, telemetry: telemetry as TelemetryData, loading: false });
    } catch (err) {
      console.info("Train API unavailable, using mock data.");
      set({ loading: false });
    }
  },
}));