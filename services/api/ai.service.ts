import { api } from "./axios";
import { AIDecision } from "@/types";

export const aiService = {
  async getDecisions() {
    return (await api.get<AIDecision[]>("/api/ai/decisions")).data;
  },
};