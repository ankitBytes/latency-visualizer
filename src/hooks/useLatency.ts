'use client';

import { useState, useEffect, useCallback } from 'react';
import { exchanges } from '@/data/exchanges';

export interface LatencyMap {
    [id: string]: number; // latency in ms
}

export function useLatency() {
    const [latencies, setLatencies] = useState<LatencyMap>({});

    const measureLatency = useCallback(async () => {
        const newLatencies: LatencyMap = {};

        // 1. Measure WebSocket Latency (Connection Time)
        const wsPromises = exchanges.map(async (exchange) => {
            if (!exchange.wsUrl) return;

            const start = performance.now();
            try {
                const ws = new WebSocket(exchange.wsUrl);

                await new Promise<void>((resolve, reject) => {
                    ws.onopen = () => {
                        const end = performance.now();
                        newLatencies[exchange.id] = Math.round(end - start);
                        ws.close();
                        resolve();
                    };
                    ws.onerror = (err) => {
                        ws.close();
                        reject(err);
                    };
                    // Timeout after 2s
                    setTimeout(() => {
                        ws.close();
                        resolve(); // Resolve anyway to not block others
                    }, 2000);
                });
            } catch (e) {
                console.warn(`Failed to measure WS latency for ${exchange.name}`, e);
            }
        });

        // 2. Measure HTTP Latency (Fetch HEAD/GET)
        // Note: Many APIs block CORS, so this is best-effort or requires a proxy.
        // We'll try to use no-cors mode for opacity, but that doesn't give timing accurately in all browsers due to security.
        // For this demo, we will rely primarily on WS connection time where available, 
        // and for others, we might simulate or skip if CORS blocks.

        await Promise.all(wsPromises);

        setLatencies(prev => ({ ...prev, ...newLatencies }));
    }, []);

    useEffect(() => {
        // Initial measurement
        measureLatency();

        // Poll every 10 seconds
        const interval = setInterval(measureLatency, 10000);
        return () => clearInterval(interval);
    }, [measureLatency]);

    return latencies;
}
