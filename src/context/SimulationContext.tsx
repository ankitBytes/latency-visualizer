"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  CloudProvider,
  CloudRegion,
  ExchangeServer,
  LatencyLink,
} from "@/types";

type TimeRange = "1h" | "24h" | "7d" | "30d";

interface Filters {
  providers: CloudProvider[];
  exchanges: string[]; // exchange IDs; empty = all
  minLatency: number;
  maxLatency: number;
}

interface SimulationContextType {
  servers: ExchangeServer[];
  regions: CloudRegion[];
  links: LatencyLink[];
  isRunning: boolean;
  toggleSimulation: () => void;

  filters: Filters;
  setProviders: (providers: CloudProvider[]) => void;
  setExchangesFilter: (exchangeIds: string[]) => void;
  setLatencyRange: (min: number, max: number) => void;

  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;

  selectedLinkId: string | null;
  setSelectedLinkId: (id: string | null) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

// --- MOCK DATA ------------------------------------------------------------

const MOCK_SERVERS: ExchangeServer[] = [
  {
    id: "binance-tokyo",
    name: "Binance (Asia)",
    provider: "AWS",
    lat: 35.6895,
    lng: 139.6917,
    region: "Asia",
  },
  {
    id: "coinbase-sf",
    name: "Coinbase (US)",
    provider: "GCP",
    lat: 37.7749,
    lng: -122.4194,
    region: "North America",
  },
  {
    id: "kraken-eu",
    name: "Kraken (EU)",
    provider: "Azure",
    lat: 53.3498,
    lng: -6.2603,
    region: "Europe",
  },
  {
    id: "bybit-dubai",
    name: "Bybit (MENA)",
    provider: "AWS",
    lat: 25.2048,
    lng: 55.2708,
    region: "Middle East",
  },
  {
    id: "okx-hk",
    name: "OKX (HK)",
    provider: "GCP",
    lat: 22.3193,
    lng: 114.1694,
    region: "Asia",
  },
  {
    id: "deribit-amsterdam",
    name: "Deribit (EU)",
    provider: "Azure",
    lat: 52.3676,
    lng: 4.9041,
    region: "Europe",
  },
];

const MOCK_REGIONS: CloudRegion[] = [
  // AWS
  {
    id: "aws-us-east-1",
    provider: "AWS",
    name: "AWS US East (N. Virginia)",
    lat: 38.88,
    lng: -77.03,
  },
  {
    id: "aws-eu-west-1",
    provider: "AWS",
    name: "AWS EU (Ireland)",
    lat: 53.34,
    lng: -6.26,
  },
  {
    id: "aws-ap-northeast-1",
    provider: "AWS",
    name: "AWS AP (Tokyo)",
    lat: 35.68,
    lng: 139.69,
  },

  // GCP
  {
    id: "gcp-us-central1",
    provider: "GCP",
    name: "GCP US Central (Iowa)",
    lat: 41.87,
    lng: -93.6,
  },
  {
    id: "gcp-europe-west1",
    provider: "GCP",
    name: "GCP Europe West (Belgium)",
    lat: 50.45,
    lng: 3.82,
  },
  {
    id: "gcp-asia-east1",
    provider: "GCP",
    name: "GCP Asia East (Taiwan)",
    lat: 25.03,
    lng: 121.56,
  },

  // Azure
  {
    id: "azure-eastus",
    provider: "Azure",
    name: "Azure East US",
    lat: 37.37,
    lng: -79.85,
  },
  {
    id: "azure-westeurope",
    provider: "Azure",
    name: "Azure West Europe",
    lat: 52.36,
    lng: 4.9,
  },
  {
    id: "azure-japaneast",
    provider: "Azure",
    name: "Azure Japan East",
    lat: 35.68,
    lng: 139.69,
  },
];

// --- GEO / LATENCY UTILS --------------------------------------------------

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function baseLatencyMs(distanceKm: number): number {
  // Approx: 1ms per 200km one-way, plus overhead
  const theoretical = distanceKm / 200;
  return theoretical * 2.5 + 10;
}

function findNearestRegion(
  server: ExchangeServer,
  regions: CloudRegion[]
): CloudRegion {
  const sameProvider = regions.filter(
    (r) => r.provider === server.provider
  );
  const candidates = sameProvider.length > 0 ? sameProvider : regions;

  let best = candidates[0];
  let bestDist = Infinity;

  for (const r of candidates) {
    const d = haversineKm(server.lat, server.lng, r.lat, r.lng);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }

  return best;
}

function initLinks(
  servers: ExchangeServer[],
  regions: CloudRegion[]
): LatencyLink[] {
  const now = Date.now();
  return servers.map((srv) => {
    const region = findNearestRegion(srv, regions);
    const dist = haversineKm(srv.lat, srv.lng, region.lat, region.lng);
    const base = baseLatencyMs(dist);
    const latency = Math.round(base + (Math.random() - 0.5) * 10);

    return {
      id: `${srv.id}__${region.id}`,
      sourceId: srv.id,
      targetId: region.id,
      currentLatencyMs: latency,
      history: [{ timestamp: now, latencyMs: latency }],
    };
  });
}

// --- CONTEXT PROVIDER -----------------------------------------------------

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [servers] = useState<ExchangeServer[]>(MOCK_SERVERS);
  const [regions] = useState<CloudRegion[]>(MOCK_REGIONS);
  const [links, setLinks] = useState<LatencyLink[]>(() =>
    initLinks(MOCK_SERVERS, MOCK_REGIONS)
  );

  const [isRunning, setIsRunning] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    providers: ["AWS", "GCP", "Azure"],
    exchanges: [],
    minLatency: 0,
    maxLatency: 300,
  });

  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  // Real-time simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLinks((prev) => {
        const now = Date.now();
        return prev.map((link) => {
          const current = link.currentLatencyMs;
          const jitter = (Math.random() - 0.5) * 10; // +/- 5ms
          let next = current + jitter;

          if (next < 1) next = 1;

          const latency = Math.round(next);

          const newHistory = [
            ...link.history,
            { timestamp: now, latencyMs: latency },
          ];

          // keep last 500 samples max
          const trimmed =
            newHistory.length > 500
              ? newHistory.slice(newHistory.length - 500)
              : newHistory;

          return {
            ...link,
            currentLatencyMs: latency,
            history: trimmed,
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSimulation = useCallback(
    () => setIsRunning((prev) => !prev),
    []
  );

  const setProviders = (providers: CloudProvider[]) => {
    setFilters((prev) => ({ ...prev, providers }));
  };

  const setExchangesFilter = (exchangeIds: string[]) => {
    setFilters((prev) => ({ ...prev, exchanges: exchangeIds }));
  };

  const setLatencyRange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minLatency: min, maxLatency: max }));
  };

  const value: SimulationContextType = {
    servers,
    regions,
    links,
    isRunning,
    toggleSimulation,
    filters,
    setProviders,
    setExchangesFilter,
    setLatencyRange,
    timeRange,
    setTimeRange,
    selectedLinkId,
    setSelectedLinkId,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error(
      "useSimulation must be used within a SimulationProvider"
    );
  }
  return ctx;
};
