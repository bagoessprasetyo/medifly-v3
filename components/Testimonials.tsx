
import React, { useState } from 'react';
import { Play, CheckCircle2, CheckCircle, X } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
  isLarge?: boolean;
}

// Sample video URL for demo purposes
const SAMPLE_VIDEO = "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";

export const Testimonials: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null);

  const testimonialsCol1: Testimonial[] = [
    {
      id: '1',
      name: '',
      role: '',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    },
    {
      id: '2',
      name: 'Sonia Ro',
      role: 'Member',
      thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop', // Replaced broken link with valid Unsplash
      videoUrl: SAMPLE_VIDEO
    }
  ];

  const testimonialsCol2: Testimonial[] = [
    {
      id: '3',
      name: '',
      role: '',
      thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    },
    {
      id: '4',
      name: 'Gordon Ro',
      role: 'Member',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    },
    {
      id: '5',
      name: 'Michael Ro',
      role: 'Member',
      thumbnail: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    }
  ];

  const testimonialsCol3: Testimonial[] = [
    {
      id: '6',
      name: '',
      role: '',
      thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    },
    {
      id: '7',
      name: 'Alan Ro',
      role: 'Member',
      thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
      videoUrl: SAMPLE_VIDEO
    }
  ];

  const renderCard = (t: Testimonial, idx: number, isMiddleCol: boolean = false) => (
    <div 
        key={t.id} 
        onClick={() => setActiveVideo(t)}
        className={`relative w-full bg-gray-200 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300
            ${isMiddleCol && idx === 0 ? 'aspect-[9/16] opacity-80' : 'aspect-[9/16]'}
        `}
    >
        <img src={t.thumbnail} alt="Testimonial" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        
        {/* Play Button - Center for some, Corner for others based on design */}
        {t.name ? (
             <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md rounded-full pl-2 pr-1.5 py-1 flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-white tracking-wide">{t.name} member</span>
                <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2} />
            </div>
        ) : (
            <div className={`absolute ${isMiddleCol && idx === 0 ? 'top-4 left-4' : 'bottom-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-transform group-hover:scale-110'}`}>
                <Play className={`${isMiddleCol && idx === 0 ? 'w-4 h-4' : 'w-3.5 h-3.5 fill-current'}`} />
            </div>
        )}
    </div>
  );

  return (
    <section className="bg-[#F3F0EA] text-[#111111] antialiased min-h-screen w-full flex items-center justify-center p-6 lg:p-12 overflow-hidden">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Video Masonry Grid */}
            <div className="h-[600px] lg:h-[720px] w-full relative overflow-hidden rounded-3xl">
                <div className="grid grid-cols-3 gap-3 lg:gap-4 h-full">
                    
                    {/* Column 1 */}
                    <div className="flex flex-col gap-3 lg:gap-4 animate-scroll-vertical" style={{ animationDuration: '40s' }}>
                        {testimonialsCol1.map((t, i) => renderCard(t, i))}
                        {/* Duplicate for infinite scroll loop illusion if needed, or just static */}
                        {testimonialsCol1.map((t, i) => renderCard({...t, id: t.id + '_dup'}, i))}
                    </div>

                    {/* Column 2 (Offset) */}
                    <div className="flex flex-col gap-3 lg:gap-4 -mt-16">
                        {testimonialsCol2.map((t, i) => renderCard(t, i, true))}
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-3 lg:gap-4">
                        {testimonialsCol3.map((t, i) => renderCard(t, i))}
                    </div>

                </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="flex flex-col justify-center items-start lg:pl-4">
                
                {/* Stat Badge */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="rounded-full border border-gray-400/50 p-0.5">
                        <CheckCircle className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                    </div>
                    <span className="text-base text-gray-700 font-medium">98% of travelers loved their Medifly experience</span>
                </div>

                {/* Main Quote */}
                <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.05] tracking-tight font-medium text-gray-900 mb-8">
                    “Medifly made my search for affordable overseas care so much easier. I finally feel confident taking the next step.”
                </h2>

                {/* Author */}
                <div className="flex items-center gap-2 text-base text-gray-600 font-medium">
                    <span>Nadya Bike - from Indonesia</span>
                    <span className="text-lg leading-none">🇮🇩</span>
                </div>

            </div>

        </div>

        {/* Video Modal */}
        {activeVideo && (
            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                onClick={() => setActiveVideo(null)}
            >
                <div 
                    className="relative w-full max-w-sm sm:max-w-md md:max-w-3xl aspect-[9/16] md:aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setActiveVideo(null)}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <video 
                        src={activeVideo.videoUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        )}

    </section>
  );
};
