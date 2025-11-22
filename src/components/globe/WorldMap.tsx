"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSimulation } from "@/context/SimulationContext";
import { LatencyLink } from "@/types";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface WorldMapProps {
  showServers: boolean;
  showRegions: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ showServers, showRegions }) => {
  const globeEl = useRef<any>(null);
  const {
    servers,
    regions,
    links,
    filters,
    setSelectedLinkId,
  } = useSimulation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const points = useMemo(() => {
    const out: any[] = [];
    if (showServers) {
      out.push(
        ...servers.map((s) => ({
          ...s,
          type: "server",
          color:
            s.provider === "AWS"
              ? "#f97316"
              : s.provider === "GCP"
              ? "#3b82f6"
              : "#a855f7",
          radius: 0.13,
        }))
      );
    }
    if (showRegions) {
      out.push(
        ...regions.map((r) => ({
          ...r,
          type: "region",
          color:
            r.provider === "AWS"
              ? "#f97316"
              : r.provider === "GCP"
              ? "#3b82f6"
              : "#a855f7",
          radius: 0.18,
        }))
      );
    }
    return out;
  }, [servers, regions, showServers, showRegions]);

  const arcs = useMemo(() => {
    // Helper to check if link passes filters
    const isVisible = (link: LatencyLink) => {
      const server = servers.find((s) => s.id === link.sourceId);
      const region = regions.find((r) => r.id === link.targetId);
      if (!server || !region) return false;

      // Provider filter
      if (!filters.providers.includes(server.provider)) return false;

      // Exchange filter
      if (
        filters.exchanges.length > 0 &&
        !filters.exchanges.includes(server.id)
      ) {
        return false;
      }

      // Latency range
      if (
        link.currentLatencyMs < filters.minLatency ||
        link.currentLatencyMs > filters.maxLatency
      ) {
        return false;
      }

      // Only show arcs when servers are visible
      if (!showServers) return false;

      return true;
    };

    return links
      .filter(isVisible)
      .map((link) => {
        const server = servers.find((s) => s.id === link.sourceId)!;
        const region = regions.find((r) => r.id === link.targetId)!;

        return {
          ...link,
          startLat: server.lat,
          startLng: server.lng,
          endLat: region.lat,
          endLng: region.lng,
        };
      });
  }, [links, servers, regions, filters, showServers]);

  // Camera / controls
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    globeEl.current.pointOfView(
      { lat: 15, lng: 0, altitude: 2.3 },
      1500
    );
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        Loading Globe...
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-screen -z-10 bg-black z-0">
      <Globe
        ref={globeEl}
        rendererConfig={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="radius"
        pointAltitude={0.01}
        pointLabel={(d: any) => `
          <div class="bg-gray-900 text-white p-2 rounded border border-gray-700 shadow-lg">
            <div class="font-bold text-sm">${d.name}</div>
            <div class="text-xs text-gray-400">${d.type.toUpperCase()}</div>
            <div class="text-xs text-gray-500">${d.provider}</div>
          </div>
        `}
        arcsData={arcs}
        arcColor={(d: any) =>
          d.currentLatencyMs < 50
            ? "#4ade80"
            : d.currentLatencyMs < 150
            ? "#facc15"
            : "#ef4444"
        }
        arcDashLength={0.7}
        arcDashGap={3}
        arcDashInitialGap={() => Math.random() * 4}
        arcDashAnimateTime={1000}
        arcStroke={0.5}
        onArcClick={(d: any) => {
          setSelectedLinkId(d.id);
          if (globeEl.current) {
            globeEl.current.pointOfView(
              {
                lat: (d.startLat + d.endLat) / 2,
                lng: (d.startLng + d.endLng) / 2,
                altitude: 1.8,
              },
              1000
            );
          }
        }}
        atmosphereColor="#2563eb"
        atmosphereAltitude={0.12}
      />
    </div>
  );
};

export default WorldMap;
