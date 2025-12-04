
import React, { useEffect } from 'react';
import { ArrowLeft, Share, Heart } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalGalleryPageProps {
  hospital: Hospital;
  onBack: () => void;
}

export const HospitalGalleryPage: React.FC<HospitalGalleryPageProps> = ({ hospital, onBack }) => {
  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-area');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hospital.id]);

  // Mock categories to match the requested design aesthetic
  // In a real app, these would come from the backend structure
  const categories = [
    {
      title: "Endoscopy Room",
      description: "Advanced diagnostic imaging and minimally invasive procedure suites.",
      images: [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200"
      ]
    },
    {
      title: "Operating Room",
      description: "State-of-the-art surgical theaters equipped with robotic assistance systems.",
      images: [
        "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
      ]
    },
    {
      title: "Recovery Suite",
      description: "Private recovery rooms designed for comfort and monitoring post-procedure.",
      images: [
        "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1200"
      ]
    },
    {
      title: "Recovery Bays",
      description: "High-dependency care units with 24/7 nursing supervision.",
      images: [
        "https://images.unsplash.com/photo-1587351021759-3e566b9af922?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&q=80&w=1200"
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      
      {/* Sub-Header Actions */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center sticky top-20 bg-white/95 backdrop-blur-sm z-30 border-b border-transparent transition-all">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors group flex items-center gap-2"
          title="Back to Hospital Details"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 underline decoration-slate-200 decoration-2 underline-offset-4 hover:decoration-slate-400 transition-all">
              <Share className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
           </button>
           <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 underline decoration-slate-200 decoration-2 underline-offset-4 hover:decoration-slate-400 transition-all">
              <Heart className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 tracking-tight">
            {hospital ? `${hospital.name} Tour` : 'Hospital Tour'}
        </h1>

        {/* Categories Loop */}
        <div className="space-y-20">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-10 md:gap-16 border-b border-slate-100 pb-16 last:border-0">
              
              {/* Left: Sticky Title & Description */}
              <div className="md:w-1/3">
                 <div className="sticky top-40">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">{cat.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                       {cat.description}
                    </p>
                 </div>
              </div>

              {/* Right: Image Grid */}
              <div className="md:w-2/3">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cat.images.map((img, imgIdx) => (
                       <div 
                          key={imgIdx} 
                          className={`
                            rounded-xl overflow-hidden bg-slate-100 relative group cursor-pointer
                            ${cat.images.length === 3 && imgIdx === 0 ? 'sm:col-span-2 aspect-video' : 'aspect-[4/3]'}
                          `}
                       >
                          <img 
                            src={img} 
                            alt={`${cat.title} ${imgIdx + 1}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
