import { api } from "./axios";
import { MapTrain, RailwaySignal } from "@/types";

export const mapService = {
  async getTrains() {
    return (await api.get<MapTrain[]>("/api/map/trains")).data;
  },
  async getSignals() {
    return (await api.get<RailwaySignal[]>("/api/map/signals")).data;
  },
};