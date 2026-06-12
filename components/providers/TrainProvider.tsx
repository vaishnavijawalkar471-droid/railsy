"use client";

import { useEffect } from "react";
import { trainService } from "@/services/api/train.service";
import { collisionService } from "@/services/api/collision.service";

import { useTrainStore } from "@/store/trainStore";
import { useCollisionStore } from "@/store/collisionStore";

export default function TrainProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const setTrain = useTrainStore((s) => s.setTrain);
  const setRisk = useCollisionStore((s) => s.setRisk);

  useEffect(() => {
    async function loadData() {
      try {
        const trainData = await trainService.getStatus();
        setTrain(trainData);

        const riskData = await collisionService.getRisk();
        setRisk(riskData);
      } catch (error) {
        console.error("Failed to load backend data:", error);
      }
    }

    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, [setTrain, setRisk]);

  return <>{children}</>;
}
