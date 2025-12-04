
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { Hospital } from '../types';

interface FacilityGalleryPageProps {
  hospital: Hospital;
  onBack: () => void;
  onViewFacilityDetails?: (facilityName: string) => void;
}

export const FacilityGalleryPage: React.FC<FacilityGalleryPageProps> = ({ hospital, onBack, onViewFacilityDetails }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hospital.id]);

  const facilitiesData = [
    {
      title: "Medical & Treatment Centres",
      images: [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200", // MRI/Machine
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",  // Hallway/Room
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200"
      ],
      items: [
        "Accident & Emergency (A&E)",
        "Intensive Care Unit (ICU)",
        "High Dependency Unit (HDU)",
        "Breast Care Centre",
        "Neuroscience Clinic / Centre",
        "Oncology Centre",
        "Orthopaedic Centre",
        "Gastroenterology & Hepatology Clinic",
        "Endocrinology & Diabetes Care Centre",
        "Paediatrics / Child Development Centre",
        "Obstetrics & Gynaecology (O&G)",
        "General Surgery Clinic",
        "ENT Clinic",
        "Urology Clinic",
        "Dermatology Clinic",
        "Ophthalmology Clinic",
        "Respiratory Medicine / Lung Clinic",
        "Plastic & Reconstructive Surgery",
        "Pain Management Clinic"
      ]
    },
    {
      title: "Diagnostic & Treatment Technology",
      images: [
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200", // Tech
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200",  // Lab
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1200"
      ],
      items: [
        "da Vinci Xi® Robotic Surgery System",
        "Mako SmartRobotics™",
        "Gamma Knife Radiosurgery",
        "CT Scan",
        "X-ray",
        "Fluoroscopy",
        "PET/CT",
        "Robotic Rehabilitation Technology (EksoNR)",
        "Laboratory Testing Technology",
        "Nuclear Medicine Tools",
        "Minimally Invasive Surgery (MIS) Equipment",
        "Angiography Suite (Cath Lab)",
        "Endoscopy Suite"
      ]
    },
    {
      title: "Patient Care & Recovery",
      images: [
        "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=1200", // Room
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1200",  // Care
        "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200"
      ],
      items: [
        "Inpatient Rooms (Single, Deluxe, Suite)",
        "Postnatal Care Services",
        "Occupational Therapy",
        "Speech Therapy",
        "Dietetics & Nutrition Counselling",
        "Pharmacy",
        "Nursing Services / 24-hour patient care",
        "Home Nursing Coordination",
        "Pain Management Support",
        "Palliative Care",
        "Vaccination Services"
      ]
    },
    {
      title: "Amenities & Support Services",
      images: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200", // Lobby
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200",  // Service
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1536064479574-68407d66967d?auto=format&fit=crop&q=80&w=1200"
      ],
      items: [
        "International Patient Centre (IPC)",
        "Hospitality Lounge / Patient Lounge",
        "GP Liaison Services",
        "Concierge & Customer Service",
        "Ambulance Services",
        "Laboratory Services (blood test, pathology)",
        "Visitor Information Services",
        "Transport Assistance / Airport Transfer",
        "Billing & Insurance Assistance",
        "Security & Safety Support"
      ]
    }
  ];

  const currentCategory = facilitiesData[activeTab];

  // Ensure we always have 4 images for the grid
  const gridImages = [...currentCategory.images];
  while(gridImages.length < 4) {
      gridImages.push(gridImages[0]);
  }
  const displayImages = gridImages.slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      
      {/* Sub-Header Actions */}
      

      <div className="max-w-7xl mx-auto px-6 mt-4">
        {/* Breadcrumb & Title */}
        <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span>{hospital.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-slate-900">Facilities</span>
            </div>
            <div className="flex px-2 items-center flex-row">
                 <button 
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2"
                    title="Back to Hospital Details"
                    >
                    <ArrowLeft className="w-5 h-5 text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <h1 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight ">
                    Facilities
                </h1>
            </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-12">
            <div className="flex overflow-x-auto no-scrollbar">
                {facilitiesData.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`
                            px-8 py-5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200
                            ${activeTab === idx 
                                ? 'border-slate-900 text-slate-900 bg-[#F1EDEA]' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                        `}
                    >
                        {cat.title}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 animate-in fade-in slide-in-from-bottom-2 duration-500 key={activeTab}">
            
            {/* Left Column: 4-Grid Images */}
            <div className="grid grid-cols-2 gap-4 h-fit">
                {displayImages.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group">
                        <img 
                            src={img} 
                            alt={`${currentCategory.title} ${idx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                ))}
            </div>

            {/* Right Column: List */}
            <div>
                <h2 className="text-2xl font-medium text-slate-900 mb-8">{currentCategory.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {currentCategory.items.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="flex items-start gap-3 group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => onViewFacilityDetails?.(item)}
                        >
                            <CheckCircle2 className="w-5 h-5 text-slate-900 group-hover:text-slate-900 mt-0.5 transition-colors flex-shrink-0" />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed font-medium">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
