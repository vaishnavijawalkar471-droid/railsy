import { create } from "zustand";

export interface Train {
  trainId: string;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
}

interface TrainStore {
  trains: Train[];
  setTrains: (trains: Train[]) => void;
}

export const useTrainStore = create<TrainStore>((set) => ({
  trains: [],
  setTrains: (trains) => set({ trains }),
}));
