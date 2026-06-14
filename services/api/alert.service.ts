import { api } from "./axios";
import { Alert } from "@/types";

export const alertService = {
  async getAll() {
    return (await api.get<Alert[]>("/api/alerts")).data;
  },
};