

import React from 'react';
import { Star, Heart, Plane, Car, MapPin } from 'lucide-react';
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
      className="group flex flex-col h-full cursor-pointer bg-transparent relative"
      onClick={() => onViewDetails(hospital)}
    >
      {/* Image Container */}
      <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-slate-200 mb-3">
        <img 
          src={hospital.images && hospital.images.length > 0 ? hospital.images[0] : hospital.imageUrl} 
          alt={hospital.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Overlay: Guest Favorite / Accreditation Badge */}
        {hospital.accreditation && hospital.accreditation.length > 0 && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
            {hospital.accreditation[0]} Verified
            </div>
        )}

        {/* Overlay: Heart Icon */}
        <button 
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100/20 transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                // Handle save logic
            }}
        >
            <Heart className="w-6 h-6 text-white fill-black/40 active:scale-90 transition-transform hover:fill-red-500 hover:text-red-500" />
        </button>
      </div>
      
      {/* Content Container - Clean, borderless */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-slate-900 text-[15px] leading-tight truncate">
            {hospital.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
             <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
             <span className="text-sm font-light text-slate-900">{hospital.rating}</span>
          </div>
        </div>

        <p className="text-slate-500 text-[15px] font-light truncate">
          {hospital.specialties.slice(0, 2).join(', ')} Specialist
        </p>

        {/* Dynamic Travel Info Line */}
        {travelEstimate ? (
           <div 
             className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 self-start px-2 py-1 rounded-md border border-slate-100 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors max-w-full"
             onClick={handleNavigate}
             title="Click to navigate"
           >
              {travelEstimate.mode === 'driving' ? (
                 <Car className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              ) : (
                 <Plane className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
              <span className="truncate">{travelEstimate.durationText}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal truncate">{travelEstimate.distanceText}</span>
           </div>
        ) : (
          <p className="text-slate-500 text-[15px] font-light truncate">
            {hospital.location}, {hospital.country}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between w-full gap-2">
            <div className="flex items-baseline gap-1 truncate">
                <span className="font-semibold text-slate-900 text-[15px]">{hospital.priceRange}</span>
                <span className="text-slate-900 text-[15px] font-light truncate">est. range</span>
            </div>
            
            {/* Quick Map Action */}
            <button 
              onClick={handleNavigate}
              className="text-xs font-semibold text-[#6495ED] hover:underline flex items-center gap-1"
            >
              Directions
            </button>
        </div>
      </div>
    </div>
  );
};