export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export interface ExchangeServer {
  id: string;
  name: string;
  provider: CloudProvider;
  lat: number;
  lng: number;
  region: string;
}

export interface CloudRegion {
  id: string;
  provider: CloudProvider;
  name: string;
  lat: number;
  lng: number;
}

export interface LatencySample {
  timestamp: number;
  latencyMs: number;
}

export interface LatencyLink {
  id: string;
  sourceId: string;
  targetId: string;
  currentLatencyMs: number;
  history: LatencySample[];
}
