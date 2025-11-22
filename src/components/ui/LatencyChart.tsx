"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSimulation } from "@/context/SimulationContext";

const RANGE_MS: Record<string, number> = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const LatencyChart: React.FC = () => {
  const {
    links,
    servers,
    regions,
    selectedLinkId,
    timeRange,
    setTimeRange,
  } = useSimulation();

  const selectedLink = links.find((l) => l.id === selectedLinkId) || null;

  const { data, min, max, avg, linkLabel } = useMemo(() => {
    if (!selectedLink) {
      return {
        data: [],
        min: null,
        max: null,
        avg: null,
        linkLabel: "",
      };
    }

    const now = Date.now();
    const windowMs = RANGE_MS[timeRange] ?? RANGE_MS["1h"];

    const filtered = selectedLink.history.filter(
      (h) => now - h.timestamp <= windowMs
    );

    const chartData = filtered.map((h) => ({
      // keep time short
      time: new Date(h.timestamp).toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      latency: h.latencyMs,
    }));

    if (filtered.length === 0) {
      return {
        data: chartData,
        min: null,
        max: null,
        avg: null,
        linkLabel: "",
      };
    }

    const latencies = filtered.map((h) => h.latencyMs);
    const min = Math.min(...latencies);
    const max = Math.max(...latencies);
    const avg =
      latencies.reduce((acc, v) => acc + v, 0) / latencies.length;

    const server = servers.find((s) => s.id === selectedLink.sourceId);
    const region = regions.find((r) => r.id === selectedLink.targetId);

    const label =
      server && region
        ? `${server.name} → ${region.name}`
        : selectedLink.id;

    return {
      data: chartData,
      min,
      max,
      avg,
      linkLabel: label,
    };
  }, [selectedLink, timeRange, servers, regions]);

  return (
    <div className="bg-black/70 border border-gray-800 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-semibold text-gray-200">
            Latency History
          </h3>
          <p className="text-[11px] text-gray-500">
            {selectedLink
              ? linkLabel
              : "Click a connection on the globe to inspect latency over time"}
          </p>
        </div>
        <div className="flex gap-1">
          {(["1h", "24h", "7d", "30d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-1.5 py-0.5 rounded-full text-[10px] border ${
                timeRange === range
                  ? "border-blue-400 text-blue-300 bg-blue-950/40"
                  : "border-gray-700 text-gray-400 hover:bg-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {selectedLink && data.length > 0 ? (
        <>
          <div className="flex items-center gap-3 mb-2 text-[11px] text-gray-300">
            <span>
              <span className="text-gray-500 mr-1">Min</span>
              {min} ms
            </span>
            <span>
              <span className="text-gray-500 mr-1">Avg</span>
              {avg && avg.toFixed(1)} ms
            </span>
            <span>
              <span className="text-gray-500 mr-1">Max</span>
              {max} ms
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid #1f2937",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="h-24 flex items-center justify-center text-[11px] text-gray-500">
          {selectedLink
            ? "Waiting for more samples in this time window…"
            : "Select a connection on the globe to see its latency history."}
        </div>
      )}
    </div>
  );
};

export default LatencyChart;
