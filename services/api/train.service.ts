import { api } from "./axios";

export const trainService = {
  async getAllTrains() {
    return (await api.get("/api/trains")).data;
  },
};
