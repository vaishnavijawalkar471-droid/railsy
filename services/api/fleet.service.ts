import { api } from "./axios";
import { FleetTrain, FleetSummary } from "@/types";

export const fleetService = {
  async getTrains() {
    return (await api.get<FleetTrain[]>("/api/fleet/trains")).data;
  },
  async getSummary() {
    return (await api.get<FleetSummary>("/api/fleet/summary")).data;
  },
};