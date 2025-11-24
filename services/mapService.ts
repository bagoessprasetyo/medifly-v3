

import { Hospital, TravelEstimate } from '../types';
import { calculateDistance } from '../constants';

// In-memory cache: "originLat,originLng-hospitalId" -> TravelEstimate
const travelCache = new Map<string, TravelEstimate>();

/**
 * Simulates a Distance Matrix API call.
 * In production, this would fetch from Google Maps/Mapbox API.
 * Here, we calculate distance and simulate realistic traffic/flight times.
 */
export const getTravelEstimates = async (
  origin: { lat: number; lng: number },
  destinations: Hospital[],
  mode: 'driving' | 'flying' = 'driving'
): Promise<Record<string, TravelEstimate>> => {
  const results: Record<string, TravelEstimate> = {};
  const missList: Hospital[] = [];

  // 1. Check Cache
  destinations.forEach(hospital => {
    const key = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}-${hospital.id}`;
    if (travelCache.has(key)) {
      results[hospital.id] = travelCache.get(key)!;
    } else {
      missList.push(hospital);
    }
  });

  if (missList.length === 0) {
    return results;
  }

  // 2. Simulate API Call (with artificial delay for realism if this were a real fetch)
  // await new Promise(resolve => setTimeout(resolve, 300));

  missList.forEach(hospital => {
    const key = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}-${hospital.id}`;
    
    // Calculate Haversine distance
    const distKm = calculateDistance(
      origin.lat, 
      origin.lng, 
      hospital.coordinates.lat, 
      hospital.coordinates.lng
    );

    let durationMins = 0;
    
    // Logic to distinguish local driving vs international flying
    // If distance > 400km, assume flying.
    const effectiveMode = distKm > 400 ? 'flying' : 'driving';

    if (effectiveMode === 'driving') {
      // Simulate Traffic: 
      // Base speed 40km/h in city, but adding randomness for "traffic"
      // Formula: (Distance / Speed) * 60
      const speed = 30 + Math.random() * 20; // 30-50 km/h average
      durationMins = Math.round((distKm / speed) * 60);
    } else {
      // Flight logic: Base 1 hour + (Distance / 800km/h)
      durationMins = 60 + Math.round((distKm / 800) * 60);
    }

    const estimate: TravelEstimate = {
      distanceValue: distKm,
      distanceText: distKm < 1 ? `${(distKm * 1000).toFixed(0)} m` : `${distKm.toFixed(1)} km`,
      durationValue: durationMins,
      durationText: formatDuration(durationMins),
      mode: effectiveMode
    };

    // Store in Cache and Result
    travelCache.set(key, estimate);
    results[hospital.id] = estimate;
  });

  return results;
};

const formatDuration = (mins: number): string => {
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs} hr ${remainingMins} min` : `${hrs} hr`;
};