
import React from 'react';
import { Doctor } from '../types';
import { Briefcase, Languages } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onViewDetails?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewDetails }) => {
  return (
    <div className="group bg-white flex flex-col h-full rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-100">
        <div className="h-48 bg-gray-100 overflow-hidden relative mb-4">
            <img 
                src={doctor.imageUrl} 
                alt={doctor.name} 
                className="w-full h-full object-cover object-top mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-500" 
            />
        </div>
        
        <div className="flex-1 flex flex-col px-4 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{doctor.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                <span className="text-base">
                    {doctor.hospitalCountry === 'Malaysia' ? '🇲🇾' : 
                     doctor.hospitalCountry === 'Singapore' ? '🇸🇬' : 
                     doctor.hospitalCountry === 'Thailand' ? '🇹🇭' : 
                     doctor.hospitalCountry === 'South Korea' ? '🇰🇷' : '🏳️'}
                </span>
                <span className="truncate">{doctor.hospitalName}, {doctor.hospitalCountry}</span>
            </div>
            
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1.5">{doctor.specialty}</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {doctor.procedures.slice(0, 3).join(' • ')}
                    {doctor.procedures.length > 3 && (
                        <span className="inline-flex items-center justify-center bg-gray-100 text-[10px] font-semibold text-gray-600 px-1.5 py-0.5 rounded ml-1">+{doctor.procedures.length - 3}</span>
                    )}
                </p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-auto space-y-2.5">
                <div className="flex items-start gap-2.5">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 stroke-[1.5]" />
                    <span className="text-xs text-gray-600 pt-0.5">{doctor.experienceYears}+ years experience</span>
                </div>
                <div className="flex items-start gap-2.5">
                    <Languages className="w-4 h-4 text-gray-400 mt-0.5 stroke-[1.5]" />
                    <span className="text-xs text-gray-600 pt-0.5 line-clamp-1">{doctor.languages.join(', ')}</span>
                </div>
            </div>

            <button 
                onClick={() => onViewDetails?.(doctor)}
                className="w-full mt-5 border border-gray-200 text-sm font-medium text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
                Overview
            </button>
        </div>
    </div>
  );
};
