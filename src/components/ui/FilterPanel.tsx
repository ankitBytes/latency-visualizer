"use client";

import React from "react";
import { Eye, EyeOff, Server, Cloud } from "lucide-react";
import { useSimulation } from "@/context/SimulationContext";
import { CloudProvider } from "@/types";

interface FilterPanelProps {
  showServers: boolean;
  setShowServers: (v: boolean) => void;
  showRegions: boolean;
  setShowRegions: (v: boolean) => void;
}

const PROVIDER_LABELS: { id: CloudProvider; label: string }[] = [
  { id: "AWS", label: "AWS" },
  { id: "GCP", label: "GCP" },
  { id: "Azure", label: "Azure" },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  showServers,
  setShowServers,
  showRegions,
  setShowRegions,
}) => {
  const {
    servers,
    filters,
    setProviders,
    setExchangesFilter,
    setLatencyRange,
  } = useSimulation();

  const toggleProvider = (provider: CloudProvider) => {
    const current = filters.providers;
    if (current.includes(provider)) {
      setProviders(current.filter((p) => p !== provider));
    } else {
      setProviders([...current, provider]);
    }
  };

  const toggleExchange = (id: string) => {
    const current = filters.exchanges;
    if (current.includes(id)) {
      setExchangesFilter(current.filter((x) => x !== id));
    } else {
      setExchangesFilter([...current, id]);
    }
  };

  const handleMaxLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Number(e.target.value);
    setLatencyRange(0, max);
  };

  return (
    <div className="space-y-4">
      {/* Visibility toggles */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Server className="text-emerald-400" size={18} />
          <span className="text-sm">Exchange Servers</span>
        </div>
        <button
          onClick={() => setShowServers(!showServers)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          {showServers ? (
            <Eye size={16} />
          ) : (
            <EyeOff size={16} />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cloud className="text-blue-400" size={18} />
          <span className="text-sm">Cloud Regions</span>
        </div>
        <button
          onClick={() => setShowRegions(!showRegions)}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
        >
          {showRegions ? (
            <Eye size={16} />
          ) : (
            <EyeOff size={16} />
          )}
        </button>
      </div>

      {/* Provider filters */}
      <div className="pt-2 border-t border-gray-800">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Cloud Providers
        </div>
        <div className="flex flex-wrap gap-2">
          {PROVIDER_LABELS.map((p) => {
            const active = filters.providers.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProvider(p.id)}
                className={`px-2 py-1 rounded-full text-xs border ${
                  active
                    ? "bg-gray-100 text-black border-gray-100"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exchange filters */}
      <div className="pt-2 border-t border-gray-800 max-h-40 overflow-y-auto">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Exchanges
        </div>
        <div className="space-y-1">
          {servers.map((s) => (
            <label
              key={s.id}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span className="truncate">
                {s.name}{" "}
                <span className="text-[10px] text-gray-500">
                  ({s.provider})
                </span>
              </span>
              <input
                type="checkbox"
                checked={filters.exchanges.includes(s.id)}
                onChange={() => toggleExchange(s.id)}
                className="accent-blue-500"
              />
            </label>
          ))}
        </div>
        <button
          className="mt-2 text-[11px] text-gray-400 hover:text-gray-200 underline"
          onClick={() => setExchangesFilter([])}
        >
          Clear exchange filter
        </button>
      </div>

      {/* Latency range */}
      <div className="pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="uppercase tracking-wide text-gray-500">
            Max Latency
          </span>
          <span className="text-gray-300">
            ≤ {filters.maxLatency} ms
          </span>
        </div>
        <input
          type="range"
          min={20}
          max={300}
          step={10}
          value={filters.maxLatency}
          onChange={handleMaxLatencyChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
