
import React from 'react';
import { MapPin, Star, ShieldCheck, CheckCircle2, Clock, Globe, ExternalLink, Share, Heart, ArrowRight } from 'lucide-react';
import { Hospital } from '../types';
import { createSlug } from '../constants';

interface HospitalDetailsProps {
   hospital: Hospital;
   onViewFullProfile: (hospital: Hospital) => void;
}

export const HospitalDetails: React.FC<HospitalDetailsProps> = ({ hospital, onViewFullProfile }) => {
   return (
      <div className="flex flex-col h-full bg-white">
         {/* Header/Title Block (Airbnb style: Title above images) */}
         <div className="px-6 pt-6 pb-4 flex-shrink-0">
            <h2 className="text-2xl font-medium text-slate-900 leading-tight">{hospital.name}</h2>
            <div className="flex items-center justify-between mt-2">
               <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
                  <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                  <span className="font-medium text-slate-900">{hospital.rating}</span>
                  <span>·</span>
                  <span className="underline decoration-slate-300">{hospital.reviewCount} reviews</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3 text-slate-900" />
                     {hospital.accreditation?.[0] || 'Verified'}
                  </div>
                  <span className="hidden sm:inline">·</span>
                  <span className="truncate max-w-[150px] sm:max-w-none">{hospital.location}, {hospital.country}</span>
               </div>
               <div className="flex gap-3 text-sm font-medium text-slate-700 underline decoration-slate-200 shrink-0">
                  <button className="flex items-center gap-1 hover:bg-[#F4F0EE] px-2 py-1 rounded"><Share className="w-4 h-4" /> <span className="hidden sm:inline">Share</span></button>
                  <button className="flex items-center gap-1 hover:bg-[#F4F0EE] px-2 py-1 rounded"><Heart className="w-4 h-4" /> <span className="hidden sm:inline">Save</span></button>
               </div>
            </div>
         </div>

         {/* Content Area - Gallery is now inside here */}
         <div className="flex-1 overflow-y-auto">

            {/* Scrollable Photo Gallery */}
            <div className="relative group mb-2">
               <div
                  className="flex overflow-x-auto gap-3 px-6 pb-6 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                  {/* CSS to hide scrollbar for webkit */}
                  <style>{`
                  .no-scrollbar::-webkit-scrollbar {
                      display: none;
                  }
              `}</style>

                  {(hospital.images && hospital.images.length > 0 ? hospital.images : [hospital.imageUrl]).map((img, idx) => (
                     <div
                        key={idx}
                        className="min-w-[85%] sm:min-w-[380px] h-[260px] sm:h-[300px] snap-center rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-100 shadow-sm cursor-pointer"
                        onClick={() => onViewFullProfile(hospital)}
                     >
                        <img src={img} alt={`${hospital.name} ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full">
                           {idx + 1} / {hospital.images?.length || 1}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="px-6 pb-12">
               <div className="flex gap-10">
                  {/* Left Column */}
                  <div className="flex-1 space-y-8">

                     {/* Highlights */}
                     <div className="py-4 border-b border-slate-100 space-y-4">
                        <div className="flex gap-4">
                           <ShieldCheck className="w-6 h-6 text-slate-700 flex-shrink-0" />
                           <div>
                              <h3 className="font-medium text-slate-900">Internationally Accredited</h3>
                              <p className="text-slate-500 text-sm">Verified by {hospital.accreditation?.join(' & ') || 'International'} standards.</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <Clock className="w-6 h-6 text-slate-700 flex-shrink-0" />
                           <div>
                              <h3 className="font-medium text-slate-900">Fast-Track Appointments</h3>
                              <p className="text-slate-500 text-sm">International patients get priority scheduling.</p>
                           </div>
                        </div>
                     </div>

                     {/* Description */}
                     <div className="py-2">
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                           {hospital.description} Recognized globally for commitment to patient care. The facility features dedicated international wings, translators for 20+ languages, and premium recovery suites.
                        </p>
                     </div>

                     {/* Specialties Tags */}
                     <div>
                        <h3 className="text-lg font-medium text-slate-900 mb-3">Centers of Excellence</h3>
                        <div className="flex flex-wrap gap-2">
                           {hospital.specialties.map((spec) => (
                              <span key={spec} className="px-4 py-2 bg-[#F4F0EE] text-slate-700 rounded-full text-sm font-medium border border-transparent">
                                 {spec}
                              </span>
                           ))}
                        </div>
                     </div>

                     {/* Practical Info (Languages, etc) */}
                     <div className="py-4 border-t border-slate-100">
                        <h3 className="text-lg font-medium text-slate-900 mb-3">Hospital Features</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Globe className="w-4 h-4 flex-shrink-0" /> <span className="truncate">English, Chinese</span>
                           </div>
                           <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Direct Billing</span>
                           </div>
                           <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Airport Transfer</span>
                           </div>
                           <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Halal Food</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Footer Actions (Sticky Price Bar) */}
         <div className="p-6 pb-8 border-t border-slate-100 flex items-center justify-between bg-white z-10 flex-shrink-0">
            <div>
               <div className="flex items-baseline gap-1">
                  <span className="text-xl font-medium text-slate-900">{hospital.priceRange}</span>
                  <span className="text-slate-500 text-sm">est. range</span>
               </div>
               <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-900 underline">{hospital.reviewCount} reviews</span>
               </div>
            </div>

            <button
               onClick={() => onViewFullProfile(hospital)}
               className="bg-slate-900 text-white px-6 md:px-8 py-3 rounded-xl font-medium hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm md:text-base active:scale-95"
            >
               View Details <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
   );
};
