"use client";

import React, { useState } from "react";
import { SimulationProvider } from "@/context/SimulationContext";
import WorldMap from "@/components/globe/WorldMap";
import DashboardOverlay from "@/components/ui/DashboardOverlay";

export default function Home() {
  const [showServers, setShowServers] = useState(true);
  const [showRegions, setShowRegions] = useState(true);

  return (
    <SimulationProvider>
      <main className="relative w-full h-[100dvh] overflow-hidden bg-black">
        <WorldMap showServers={showServers} showRegions={showRegions} />
        <DashboardOverlay
          showServers={showServers}
          setShowServers={setShowServers}
          showRegions={showRegions}
          setShowRegions={setShowRegions}
        />
      </main>
    </SimulationProvider>
  );
}
