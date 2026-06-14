"use client";

import { useDataProvider } from "@/services/useDataProvider";

export default function DataInitializer() {
  useDataProvider();
  return null;
}