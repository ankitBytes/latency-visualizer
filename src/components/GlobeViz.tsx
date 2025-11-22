'use client';

import { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { exchanges, Exchange } from '@/data/exchanges';
import { cloudRegions, CloudRegion } from '@/data/cloudRegions';
import { useLatency } from '@/hooks/useLatency';

interface GlobeVizProps {
    userLocation?: { lat: number; lng: number };
}

export default function GlobeViz({ userLocation }: GlobeVizProps) {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    const latencies = useLatency();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
    }, [mounted]);

    if (!mounted) return null;

    // Combine data for points
    const points = [
        ...exchanges.map(e => ({ ...e, type: 'exchange', color: '#FFD700', size: 0.5 })), // Gold
        ...cloudRegions.map(c => ({ ...c, type: 'cloud', color: '#00BFFF', size: 0.3 })), // Deep Sky Blue
    ];

    // Create arcs from user location to all points (if user location exists)
    const arcs = userLocation
        ? points.map(p => {
            const latency = latencies[p.id];
            let color = ['#00BFFF', '#0000FF']; // Default Blue for Cloud

            if (p.type === 'exchange') {
                if (!latency) {
                    color = ['#808080', '#808080']; // Grey if unknown
                } else if (latency < 100) {
                    color = ['#00FF00', '#006400']; // Green
                } else if (latency < 200) {
                    color = ['#FFFF00', '#808000']; // Yellow
                } else {
                    color = ['#FF0000', '#8B0000']; // Red
                }
            }

            return {
                startLat: userLocation.lat,
                startLng: userLocation.lng,
                endLat: p.lat,
                endLng: p.lng,
                color: color,
                // Add latency info to the arc object for potential tooltip use
                latency: latency
            };
        })
        : [];

    return (
        <div className="h-screen w-full bg-black">
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointsMerge={true}
                pointLabel={(d: any) => {
                    const latency = latencies[d.id];
                    return `
          <div class="bg-gray-900 text-white p-2 rounded shadow-lg border border-gray-700 font-sans">
            <div class="font-bold text-sm">${d.name}</div>
            <div class="text-xs text-gray-400">${d.type === 'exchange' ? d.region : d.provider}</div>
            ${latency ? `<div class="text-xs text-green-400 mt-1">Latency: ${latency}ms</div>` : ''}
          </div>
        `}}
                arcsData={arcs}
                arcColor="color"
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={1500}
                arcStroke={0.5}
            />
        </div>
    );
}
