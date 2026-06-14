import { create } from "zustand";
import { CollisionRisk } from "@/types";
import { api } from "@/services/api/axios";
import { collisionMock } from "@/mock";

interface CollisionStore {
  risk: CollisionRisk | null;
  setRisk: (r: CollisionRisk) => void;
  fetchAll: () => Promise<void>;
}

export const useCollisionStore = create<CollisionStore>((set) => ({
  risk: collisionMock,
  setRisk: (risk) => set({ risk }),
  fetchAll: async () => {
    try {
      const { data } = await api.get<CollisionRisk>("/api/collision");
      set({ risk: data });
    } catch (err) {
      console.info("Collision API unavailable, using mock data.");
    }
  },
}));