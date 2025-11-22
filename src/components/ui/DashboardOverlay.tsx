"use client";

import React from "react";
import FilterPanel from "./FilterPanel";
import LatencyChart from "./LatencyChart";
import { Activity, Gauge, Network, Server, Cloud } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";

interface DashboardOverlayProps {
  showServers: boolean;
  setShowServers: (v: boolean) => void;
  showRegions: boolean;
  setShowRegions: (v: boolean) => void;
}

const DashboardOverlay: React.FC<DashboardOverlayProps> = ({
  showServers,
  setShowServers,
  showRegions,
  setShowRegions,
}) => {
  const { servers, regions, links, filters } = useSimulation();

  const filteredLinks = links.filter((link) => {
    const server = servers.find((s) => s.id === link.sourceId);
    if (!server) return false;

    if (!filters.providers.includes(server.provider)) return false;
    if (
      filters.exchanges.length > 0 &&
      !filters.exchanges.includes(server.id)
    ) {
      return false;
    }
    if (
      link.currentLatencyMs < filters.minLatency ||
      link.currentLatencyMs > filters.maxLatency
    ) {
      return false;
    }
    return true;
  });

  const activeCount = filteredLinks.length;
  const avgLatency =
    activeCount > 0
      ? Math.round(
          filteredLinks.reduce((acc, l) => acc + l.currentLatencyMs, 0) /
            activeCount
        )
      : null;

  const maxLatency =
    activeCount > 0
      ? Math.max(...filteredLinks.map((l) => l.currentLatencyMs))
      : null;

  return (
    <div className="absolute inset-0 pointer-events-auto flex flex-col">
      {/* Header */}
      <div className="px-6 pt-4 flex justify-between items-start pointer-events-auto">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-[11px] mb-2">
            <Activity size={12} />
            <span>Live Latency Topology</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Latency <span className="text-blue-400">Topology</span> Visualizer
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Real-time view of crypto exchange infrastructure across AWS, GCP
            and Azure co-location regions, with simulated latency flows and
            historical trends.
          </p>
        </div>
      </div>

      {/* Main panel */}
      <div className="mt-auto pb-4 px-4 flex justify-end pointer-events-none">
        <div className="w-full max-w-3xl pointer-events-auto">
          <div className="bg-black/80 border border-gray-800 rounded-2xl p-4 shadow-lg shadow-black/60 backdrop-blur-lg">
            {/* Metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <MetricCard
                icon={<Server size={14} />}
                label="Exchanges"
                value={servers.length.toString()}
              />
              <MetricCard
                icon={<Cloud size={14} />}
                label="Cloud Regions"
                value={regions.length.toString()}
              />
              <MetricCard
                icon={<Network size={14} />}
                label="Active Links"
                value={activeCount.toString()}
              />
              <MetricCard
                icon={<Gauge size={14} />}
                label="Avg Latency"
                value={avgLatency !== null ? `${avgLatency} ms` : "–"}
                secondary={
                  maxLatency !== null ? `Max ${maxLatency} ms` : undefined
                }
              />
            </div>

            <div className="grid md:grid-cols-[1.4fr,1.6fr] gap-4">
              {/* Filters */}
              <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-3">
                <FilterPanel
                  showServers={showServers}
                  setShowServers={setShowServers}
                  showRegions={showRegions}
                  setShowRegions={setShowRegions}
                />
              </div>

              {/* Chart */}
              <LatencyChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  secondary,
}) => {
  return (
    <div className="bg-gray-950/80 border border-gray-800 rounded-xl px-3 py-2 flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-semibold text-gray-100">
        {value}
      </div>
      {secondary && (
        <div className="text-[10px] text-gray-500">{secondary}</div>
      )}
    </div>
  );
};

export default DashboardOverlay;
