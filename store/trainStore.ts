import { create } from "zustand";
import { TrainStatus, TelemetryData } from "@/types";
import { trainService } from "@/services/api/train.service";

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
  train: null,
  telemetry: null,
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
      set({ train, telemetry, loading: false });
    } catch (err) {
      console.error("Failed to fetch train data:", err);
      set({ loading: false });
    }
  },
}));