import { api } from "./axios";

export const trackService = {
  async getAnomalies() {
    return (await api.get("/api/track/anomalies")).data;
  },
};