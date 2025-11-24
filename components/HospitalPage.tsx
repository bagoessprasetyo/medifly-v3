
import React from 'react';
import { ArrowLeft, MapPin, Star, ShieldCheck, Globe, Phone, Clock, Calendar, Stethoscope, Award, CheckCircle2 } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalPageProps {
  hospital: Hospital;
  onBack: () => void;
}

export const HospitalPage: React.FC<HospitalPageProps> = ({ hospital, onBack }) => {
  return (
    <div className="h-full w-full bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-[#F4F0EE] rounded-full text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 truncate">{hospital.name}</h1>
      </div>

      {/* Hero Section */}
      <div className="relative h-80 w-full">
        <img 
          src={hospital.imageUrl} 
          alt={hospital.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-2 text-[#B2D7FF] font-semibold">
             <ShieldCheck className="w-5 h-5" />
             {hospital.accreditation.join(" & ")} Accredited
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 shadow-sm">{hospital.name}</h1>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-300" />
              {hospital.location}, {hospital.country}
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{hospital.rating}</span>
              <span className="text-slate-300">({hospital.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-28 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Column: Main Info */}
        <div className="md:col-span-2 space-y-10">
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Award className="w-6 h-6 text-slate-700" /> About the Facility
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {hospital.description} Founded with a vision to provide world-class healthcare, this facility has grown to become a regional leader. Patients from over 50 countries visit annually for complex procedures, drawn by the combination of advanced medical technology and compassionate care.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mt-4">
              The hospital features state-of-the-art operating theaters, dedicated international patient lounges, and recovery suites designed for comfort and healing.
            </p>
          </section>

          {/* Specialties */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Stethoscope className="w-6 h-6 text-slate-700" /> Key Centers of Excellence
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {hospital.specialties.map(spec => (
                 <div key={spec} className="p-4 rounded-xl bg-[#F4F0EE] border border-transparent flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-700 mt-0.5" />
                    <div>
                       <h4 className="font-bold text-slate-900">{spec} Center</h4>
                       <p className="text-sm text-slate-500 mt-1">Top-tier specialists and advanced diagnostic equipment.</p>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Doctors Preview (Mock) */}
          <section>
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Leading Specialists</h2>
             <div className="flex gap-6 overflow-x-auto pb-4">
                {[1, 2, 3].map(i => (
                   <div key={i} className="min-w-[200px] border border-slate-100 rounded-xl p-4 text-center">
                      <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-3 overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?u=${hospital.id}${i}`} alt="Doctor" className="w-full h-full object-cover" />
                      </div>
                      <div className="font-bold text-slate-900">Dr. Sarah Lim</div>
                      <div className="text-sm text-slate-500">{hospital.specialties[0]}</div>
                   </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Sidebar / Action */}
        <div className="md:col-span-1">
           <div className="sticky top-24 space-y-6">
              {/* Action Card */}
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                 <div className="mb-6">
                    <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Estimated Cost</span>
                    <div className="flex items-baseline gap-1 mt-1">
                       <span className="text-3xl font-bold text-slate-900">{hospital.priceRange}</span>
                       <span className="text-slate-500">/ procedure</span>
                    </div>
                    <div className="text-xs text-green-800 font-medium mt-2 bg-green-50 inline-block px-2 py-1 rounded">
                       Typically 40-60% less than US/EU
                    </div>
                 </div>

                 <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg mb-3 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" /> Request Appointment
                 </button>
                 <button className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-[#F4F0EE] transition-colors">
                    Get Free Quote
                 </button>
              </div>

              {/* Info Card */}
              <div className="bg-[#F4F0EE] p-6 rounded-2xl border border-transparent space-y-4">
                 <h3 className="font-bold text-slate-900">Contact Information</h3>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Open 24 Hours for Emergency</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">+66 2 066 8888</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <span className="text-sm cursor-pointer hover:underline">Visit Official Website</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
