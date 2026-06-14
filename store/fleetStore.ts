import { create } from "zustand";
import { FleetTrain, FleetSummary } from "@/types";
import { fleetService } from "@/services/api/fleet.service";

interface FleetStore {
  trains: FleetTrain[];
  summary: FleetSummary | null;
  setTrains: (t: FleetTrain[]) => void;
  setSummary: (s: FleetSummary) => void;
  fetchAll: () => Promise<void>;
}

export const useFleetStore = create<FleetStore>((set) => ({
  trains: [],
  summary: null,
  setTrains: (trains) => set({ trains }),
  setSummary: (summary) => set({ summary }),
  fetchAll: async () => {
    try {
      const [trains, summary] = await Promise.all([
        fleetService.getTrains(),
        fleetService.getSummary(),
      ]);
      set({ trains, summary });
    } catch (err) {
      console.error("Failed to fetch fleet data:", err);
    }
  },
}));