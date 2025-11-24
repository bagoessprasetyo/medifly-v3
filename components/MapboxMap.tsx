
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Hospital } from '../types';
import { AlertCircle, Map as MapIcon } from 'lucide-react';
// import { defineConfig, loadEnv } from 'vite';

// const env = loadEnv(mode, '.', '');
// Use a token placeholder. In a real app, this comes from env vars.
// Vite exposes client env vars via `import.meta.env` and only variables
// prefixed with `VITE_` are exposed to the browser.
const MAPBOX_TOKEN = ((import.meta as any).env?.VITE_MAPBOX_API_KEY) || 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';

try {
  // @ts-ignore - accessing internal config to disable telemetry is necessary for sandboxed environments
  mapboxgl.config.ENABLE_TELEMETRY = false; 
  mapboxgl.accessToken = MAPBOX_TOKEN;
} catch (e) {
  console.error("Failed to set Mapbox config", e);
}

interface MapboxMapProps {
  hospitals: Hospital[];
  onSelectHospital: (hospital: Hospital) => void;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({ hospitals, onSelectHospital }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (map.current || isInitialized.current) return; 
    if (!mapContainer.current) return;

    // Prevent double initialization
    isInitialized.current = true;

    try {
      // Initialize map
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: [103.0, 5.0], 
        zoom: 14,
        attributionControl: false,
        interactive: true,
      });

      map.current = newMap;

      // Add navigation control
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle load errors
      newMap.on('error', (e) => {
         console.warn("Mapbox internal error:", e);
         // Filter out 401s which are expected with invalid tokens
         if (e.error && (e.error as any).status !== 401) {
            // We don't set global error here to avoid unmounting on minor tile errors
         }
      });

    } catch (err: any) {
      console.error("Error initializing map:", err);
      // Catch synchronous errors like SecurityError for cross-origin frames
      if (err.message?.includes('Blocked a frame') || err.message?.includes('Location') || err.name === 'SecurityError') {
        setError("Map visualization is disabled in this preview environment due to browser security restrictions.");
      } else {
        setError("Unable to initialize map view.");
      }
    }

    return () => {
        try {
            map.current?.remove();
        } catch (e) {
            // Ignore cleanup errors
        }
        map.current = null;
        isInitialized.current = false;
    };
  }, []);

  // Update markers when hospitals change
  useEffect(() => {
    if (!map.current || error) return;

    try {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (hospitals.length === 0) return;

        // Add new markers
        hospitals.forEach(hospital => {
        const el = document.createElement('div');
        el.className = 'marker-hospital';
        el.style.backgroundImage = `url(${hospital.imageUrl})`;
        
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click
            onSelectHospital(hospital);
        });

        const marker = new mapboxgl.Marker(el)
            .setLngLat([hospital.coordinates.lng, hospital.coordinates.lat])
            .addTo(map.current!);
        
        markersRef.current.push(marker);
        });

        // Fit bounds to show all markers
        if (hospitals.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            hospitals.forEach(h => bounds.extend([h.coordinates.lng, h.coordinates.lat]));
            map.current.fitBounds(bounds, { padding: 80, maxZoom: 12 });
        }
    } catch (e) {
        console.warn("Error updating map markers:", e);
    }

  }, [hospitals, onSelectHospital, error]);

  if (error) {
    return (
        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center border border-slate-200 rounded-xl">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-slate-800 font-medium mb-1">Map Unavailable</h3>
            <p className="text-sm text-slate-500 max-w-xs">{error}</p>
        </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden bg-slate-100 relative" />;
};
