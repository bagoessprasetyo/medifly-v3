
import React from 'react';
import { Hospital } from '../types';
import { X, MapPin, Star, ShieldCheck, Languages, ArrowRight, Trash2 } from 'lucide-react';

interface ComparisonViewProps {
  hospitals: Hospital[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onViewDetails: (hospital: Hospital) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ hospitals, onRemove, onClose, onViewDetails }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
            <h2 className="text-xl font-bold text-slate-900">Compare Hospitals</h2>
            <p className="text-sm text-slate-500">Comparing {hospitals.length} selected facilities</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[800px] p-6">
            
            {/* Grid Container */}
            <div className="grid" style={{ gridTemplateColumns: `150px repeat(${hospitals.length}, 1fr)` }}>
                
                {/* 1. Header Row (Images & Actions) */}
                <div className="py-4 font-semibold text-slate-900 flex items-center">Hospital</div>
                {hospitals.map(h => (
                    <div key={h.id} className="px-4 pb-4 border-b border-slate-100 flex flex-col gap-3">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group">
                            <img src={h.imageUrl} alt={h.name} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => onRemove(h.id)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                title="Remove"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="min-h-[3rem]">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{h.name}</h3>
                        </div>
                        <button 
                            onClick={() => onViewDetails(h)}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                ))}

                {/* 2. Rating Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Rating</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50 flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">{h.rating}</span>
                        <span className="text-xs text-slate-400">({h.reviewCount} reviews)</span>
                    </div>
                ))}

                {/* 3. Location Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Location</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">{h.location}, {h.country}</span>
                        </div>
                    </div>
                ))}

                {/* 4. Price Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Price Estimate</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50">
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                            {h.priceRange} Range
                        </span>
                    </div>
                ))}

                {/* 5. Accreditations Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Accreditation</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50">
                        <div className="flex flex-wrap gap-1">
                            {h.accreditation.length > 0 ? h.accreditation.map(acc => (
                                <span key={acc} className="inline-flex items-center gap-1 px-2 py-1 border border-blue-100 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                                    <ShieldCheck className="w-3 h-3" /> {acc}
                                </span>
                            )) : <span className="text-xs text-slate-400">-</span>}
                        </div>
                    </div>
                ))}

                {/* 6. Specialties Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Top Specialties</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50">
                        <ul className="text-xs text-slate-600 space-y-1">
                            {h.specialties.slice(0, 3).map((s, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-400" /> {s}
                                </li>
                            ))}
                            {h.specialties.length > 3 && (
                                <li className="text-slate-400 pl-2.5">+{h.specialties.length - 3} more</li>
                            )}
                        </ul>
                    </div>
                ))}

                {/* 7. Languages Row */}
                <div className="py-4 text-sm font-medium text-slate-500 border-b border-slate-50 flex items-center">Languages</div>
                {hospitals.map(h => (
                    <div key={h.id} className="p-4 border-b border-slate-50">
                        <div className="flex items-start gap-2">
                            <Languages className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <span className="text-xs text-slate-600">
                                {h.languages ? h.languages.join(', ') : 'English, Local'}
                            </span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
      </div>
    </div>
  );
};
