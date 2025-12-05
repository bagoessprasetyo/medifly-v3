import React, { useState } from 'react';
import {
  Navigation,
  Target,
  Plane,
  Bus,
  Train,
  Car,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  MapPin,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { LocationInfo, TravelRoute, TravelSegment } from '../services/geminiService';

interface GettingHereProps {
  locationInfo: LocationInfo | null;
  isLoading: boolean;
  hospitalName: string;
}

type TransportMode = 'air' | 'bus' | 'train' | 'car';

const transportModeConfig: Record<TransportMode, { icon: React.ElementType; label: string; color: string }> = {
  air: { icon: Plane, label: 'By Air', color: 'bg-blue-500' },
  bus: { icon: Bus, label: 'By Bus', color: 'bg-green-500' },
  train: { icon: Train, label: 'By Train', color: 'bg-purple-500' },
  car: { icon: Car, label: 'By Car', color: 'bg-orange-500' },
};

const segmentTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  flight: { icon: Plane, color: 'text-blue-500' },
  bus: { icon: Bus, color: 'text-green-500' },
  train: { icon: Train, color: 'text-purple-500' },
  car: { icon: Car, color: 'text-orange-500' },
  taxi: { icon: Car, color: 'text-yellow-600' },
  walk: { icon: MapPin, color: 'text-gray-500' },
  ferry: { icon: Navigation, color: 'text-cyan-500' },
};

const GettingHere: React.FC<GettingHereProps> = ({ locationInfo, isLoading, hospitalName }) => {
  const [selectedMode, setSelectedMode] = useState<TransportMode>('air');
  const [isExpanded, setIsExpanded] = useState(true);

  const getSelectedRoute = (): TravelRoute | undefined => {
    return locationInfo?.travelRoutes?.find(route => route.mode === selectedMode);
  };

  const selectedRoute = getSelectedRoute();

  const renderSegmentIcon = (type: TravelSegment['type']) => {
    const config = segmentTypeConfig[type] || segmentTypeConfig.car;
    const Icon = config.icon;
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  const renderJourneyTimeline = (segments: TravelSegment[]) => {
    return (
      <div className="space-y-0">
        {segments.map((segment, index) => (
          <div key={index} className="relative">
            {/* Segment Row */}
            <div className="flex items-start gap-3 py-3">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                {/* Start point */}
                <div className={`w-3 h-3 rounded-full border-2 ${index === 0 ? 'bg-[#1C1C1C] border-[#1C1C1C]' : 'bg-white border-slate-300'}`} />
                {/* Vertical line */}
                <div className="w-0.5 h-full min-h-[40px] bg-slate-200 my-1" />
                {/* End point (only for last segment) */}
                {index === segments.length - 1 && (
                  <div className="w-3 h-3 rounded-full bg-[#E4F28A] border-2 border-[#1C1C1C]" />
                )}
              </div>

              {/* Segment Content */}
              <div className="flex-1 -mt-1">
                {/* From Location */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    {segment.from.name}
                    {segment.from.code && (
                      <span className="text-slate-500 ml-1">({segment.from.code})</span>
                    )}
                  </span>
                </div>

                {/* Transport Details */}
                <div className="flex items-center gap-2 pl-0 py-2 my-1 bg-slate-50 rounded-lg px-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    {renderSegmentIcon(segment.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">{segment.details || segment.type}</div>
                    <div className="text-sm font-medium text-slate-700">{segment.duration}</div>
                  </div>
                </div>

                {/* To Location (only for last segment) */}
                {index === segments.length - 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-slate-900">
                      {segment.to.name}
                      {segment.to.code && (
                        <span className="text-slate-500 ml-1">({segment.to.code})</span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Connector to next segment */}
            {index < segments.length - 1 && (
              <div className="flex items-center gap-3 py-1">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {segment.to.name}
                  {segment.to.code && (
                    <span className="text-slate-500 ml-1">({segment.to.code})</span>
                  )}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderUnavailableRoute = (route: TravelRoute) => {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <X className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">Route Not Available</p>
        <p className="text-xs text-slate-500 max-w-[250px]">
          {route.unavailableReason || 'This transport option is not available for this route'}
        </p>
      </div>
    );
  };

  return (
    <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-medium text-[#1C1C1C]">
          <div className="p-1.5 bg-slate-100 rounded-full">
            <Navigation className="w-4 h-4" />
          </div>
          Getting Here
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-0.5">
            From your Location
          </div>
          <div className="text-sm font-medium text-slate-900 flex items-center justify-end gap-1.5">
            <Target className="w-3.5 h-3.5" />
            {isLoading ? (
              <span className="animate-pulse bg-slate-200 rounded w-16 h-4"></span>
            ) : (
              locationInfo?.travelInfo.fromLocation || 'Jakarta'
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Loading travel options...</span>
        </div>
      ) : (
        <>
          {/* Transport Mode Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4">
            {(['air', 'bus', 'train', 'car'] as TransportMode[]).map((mode) => {
              const config = transportModeConfig[mode];
              const Icon = config.icon;
              const route = locationInfo?.travelRoutes?.find(r => r.mode === mode);
              const isAvailable = route?.available ?? false;
              const isSelected = selectedMode === mode;

              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white text-[#1C1C1C] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  } ${!isAvailable && !isSelected ? 'opacity-50' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? '' : ''}`} />
                  <span className="hidden sm:inline">{config.label.replace('By ', '')}</span>
                  {route?.recommended && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E4F28A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Route Info */}
          {selectedRoute && (
            <div className="mb-4">
              {/* Duration and Cost Summary */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-[#1C1C1C]">
                      {selectedRoute.available ? selectedRoute.totalDuration : 'N/A'}
                    </span>
                  </div>
                  {selectedRoute.estimatedCost && selectedRoute.available && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {selectedRoute.estimatedCost}
                      </span>
                    </div>
                  )}
                </div>
                {selectedRoute.recommended && selectedRoute.available && (
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    Recommended
                  </div>
                )}
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors mb-3"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    View Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    View Details
                  </>
                )}
              </button>

              {/* Journey Timeline */}
              {isExpanded && (
                <div className="border-t border-slate-100 pt-4">
                  {selectedRoute.available && selectedRoute.segments.length > 0 ? (
                    renderJourneyTimeline(selectedRoute.segments)
                  ) : (
                    renderUnavailableRoute(selectedRoute)
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fallback for no routes */}
          {!selectedRoute && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No travel information available
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GettingHere;
