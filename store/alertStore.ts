import { create } from "zustand";
import { Alert } from "@/types";
import { alertService } from "@/services/api/alert.service";

interface AlertStore {
  alerts: Alert[];
  setAlerts: (a: Alert[]) => void;
  addAlert: (a: Alert) => void;
  fetchAll: () => Promise<void>;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),
  fetchAll: async () => {
    try {
      const alerts = await alertService.getAll();
      set({ alerts });
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  },
}));