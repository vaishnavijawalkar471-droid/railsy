import { api } from "./axios";

export const trainService = {
  async getStatus() {
    return (await api.get("/api/trains")).data;
  },
};
