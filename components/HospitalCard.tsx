
import React from 'react';
import { Star, Plane, MapPin, Languages, Stethoscope, BriefcaseMedical, GitCompare, Check } from 'lucide-react';
import { Hospital, TravelEstimate } from '../types';

interface HospitalCardProps {
  hospital: Hospital;
  onViewDetails: (hospital: Hospital) => void;
  travelEstimate?: TravelEstimate;
  isComparing?: boolean;
  onToggleCompare?: (hospital: Hospital) => void;
  compareBtnId?: string;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ 
  hospital, 
  onViewDetails, 
  travelEstimate,
  isComparing = false,
  onToggleCompare,
  compareBtnId
}) => {
  
  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.(hospital);
  };

  return (
    <div 
        className={`bg-white rounded-xl overflow-hidden group flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 border ${isComparing ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-transparent hover:border-slate-100'}`}
        onClick={() => onViewDetails(hospital)}
    >
        {/* Image Container */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img 
                src={hospital.images && hospital.images.length > 0 ? hospital.images[0] : hospital.imageUrl} 
                alt={hospital.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Compare Toggle Button */}
            {onToggleCompare && (
                <button 
                    id={compareBtnId}
                    onClick={handleCompareClick}
                    className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-md border shadow-sm transition-all z-10 flex items-center gap-1.5
                        ${isComparing 
                            ? 'bg-indigo-600 border-indigo-500 text-white' 
                            : 'bg-white/90 border-white/20 text-slate-600 hover:bg-white'
                        }`}
                >
                    {isComparing ? <Check className="w-3.5 h-3.5" /> : <GitCompare className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-bold uppercase tracking-wide">
                        {isComparing ? 'Added' : 'Compare'}
                    </span>
                </button>
            )}

            {/* Google Rating Badge */}
            <div className="absolute bottom-2 left-2 bg-[#222222]/90 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-2 shadow-lg border border-white/10">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center p-0.5">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-full h-full" />
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                    <span className="text-[10px] font-semibold text-white">{hospital.rating}/5</span>
                    <span className="text-[10px] text-gray-400">({hospital.reviewCount} reviews)</span>
                </div>
            </div>
        </div>

        {/* Card Body */}
        <div className="pt-4 flex-1 flex flex-col px-4 pb-4">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-semibold text-gray-900 tracking-tight line-clamp-1" title={hospital.name}>
                    {hospital.name}
                </h3>
                <span className="text-sm font-medium flex tracking-tighter shrink-0 ml-2">
                    <span className="text-gray-900">{hospital.priceRange.substring(0, 1)}</span>
                    <span className="text-gray-300">{hospital.priceRange.substring(1).padEnd(2, '$')}</span>
                </span>
            </div>
            
            <div className="flex items-center gap-1.5 mb-3">
                {/* Flag placeholder - using emoji for simplicity/reliability */}
                <span className="text-sm">
                    {hospital.country === 'Thailand' ? '🇹🇭' : 
                     hospital.country === 'Singapore' ? '🇸🇬' : 
                     hospital.country === 'Malaysia' ? '🇲🇾' : 
                     hospital.country === 'South Korea' ? '🇰🇷' : 
                     hospital.country === 'Indonesia' ? '🇮🇩' : '🏳️'}
                </span>
                <span className="text-xs text-gray-500 font-normal truncate">{hospital.location}, {hospital.country}</span>
            </div>

            {travelEstimate ? (
                <div className="inline-flex items-center gap-1.5 bg-[#E4F28A] self-start px-2 py-1 rounded-[4px] mb-4 max-w-full">
                    <Plane className="w-3 h-3 text-gray-800 rotate-[-45deg] shrink-0" />
                    <span className="text-[10px] font-medium text-gray-800 truncate">
                        {travelEstimate.durationText} Away
                    </span>
                </div>
            ) : (
                <div className="inline-flex items-center gap-1.5 bg-slate-100 self-start px-2 py-1 rounded-[4px] mb-4">
                    <Plane className="w-3 h-3 text-slate-500 rotate-[-45deg]" />
                    <span className="text-[10px] font-medium text-slate-600">Global Travel Ready</span>
                </div>
            )}

            <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2 min-h-[2.5em]">
                {hospital.description}
            </p>

            <div className="border-t border-gray-100 pt-3 mt-auto space-y-3">
                <div className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-600 font-medium truncate">English, Local, Mandarin</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-[11px] text-gray-500">100+ specialists</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BriefcaseMedical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-[11px] text-gray-500">{hospital.specialties.length}+ treatments</span>
                    </div>
                </div>
                
                <button className="w-full border border-gray-200 rounded-lg py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition mt-2">
                    Hospital Overview
                </button>
            </div>
        </div>
    </div>
  );
};
