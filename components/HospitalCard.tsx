
import React from 'react';
import { Star, Plane, Car, MapPin, Languages, Stethoscope } from 'lucide-react';
import { Hospital, TravelEstimate } from '../types';

interface HospitalCardProps {
  hospital: Hospital;
  onViewDetails: (hospital: Hospital) => void;
  travelEstimate?: TravelEstimate;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onViewDetails, travelEstimate }) => {
  
  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open Google Maps Directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all group cursor-pointer flex flex-col h-full"
      onClick={() => onViewDetails(hospital)}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img 
          src={hospital.images && hospital.images.length > 0 ? hospital.images[0] : hospital.imageUrl} 
          alt={hospital.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating Overlay - Updated to Yellow/Dark style */}
        <div className="absolute bottom-2 left-2 bg-[#F1FCA7] text-[#1C1C1C] text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
            <Star className="w-2 h-2 fill-current" /> {hospital.rating}/5
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-[#1C1C1C] text-sm truncate" title={hospital.name}>
                {hospital.name}
            </h3>
            <span className="text-xs font-semibold text-[#1C1C1C] shrink-0">{hospital.priceRange}</span>
        </div>

        {/* Location & Travel Info */}
        <div className="space-y-1">
            <p className="text-xs text-zinc-500 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" /> 
                <span className="truncate">{hospital.location}, {hospital.country}</span>
            </p>
            
            {travelEstimate ? (
                 <div 
                    onClick={handleNavigate}
                    className="text-xs font-medium text-[#1C1C1C] flex items-center gap-1 hover:text-blue-600 transition-colors w-fit"
                    title={`Click for directions: ${travelEstimate.durationText} • ${travelEstimate.distanceText}`}
                 >
                    {travelEstimate.mode === 'driving' ? <Car className="w-3 h-3 shrink-0" /> : <Plane className="w-3 h-3 shrink-0" />}
                    <span>{travelEstimate.durationText} away</span>
                 </div>
            ) : (
                <p className="text-xs font-medium text-[#1C1C1C] flex items-center gap-1">
                    <Plane className="w-3 h-3 shrink-0" /> Int'l Travel Ready
                </p>
            )}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 line-clamp-2">
            {hospital.description}
        </p>
        
        <div className="flex-1" /> {/* Spacer to push footer down */}

        {/* Footer Info */}
        <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-2 border-t border-zinc-100 mt-1">
            <span className="flex items-center gap-1">
                <Languages className="w-3 h-3" /> English, Local
            </span>
            <span className="flex items-center gap-1">
                <Stethoscope className="w-3 h-3" /> {hospital.specialties.length} specialities
            </span>
        </div>

        {/* Action Button */}
        <button className="w-full border border-zinc-200 rounded-lg py-2 text-xs font-medium text-[#1C1C1C] hover:bg-[#FAF8F7] transition-colors">
            Hospital Overview
        </button>

      </div>
    </div>
  );
};
