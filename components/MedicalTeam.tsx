
import React, { useRef } from 'react';
import { BadgeCheck, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export const MedicalTeam: React.FC = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const teamMembers = [
    {
      name: "Rachel Yew",
      role: t("Chief Executive Officer"),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      desc: t("She led transformative initiatives to position the hospital as a leading healthcare provider in the region."),
      education: [t("University of Malaysia"), t("Stanford University")]
    },
    {
      name: "Dr Kelvin Ch'ng",
      role: t("Chief Executive Officer"),
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop",
      desc: t("Dr Kelvin has over 17 years' experience in healthcare. He joined Pantai Hospital Penang as a medical officer in 2012."),
      education: [t("University of Malaysia"), t("Stanford University")]
    },
    {
      name: "Dr Kamal Amzan",
      role: t("Chief Executive Officer"),
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
      desc: t("He led transformative initiatives to position the hospital as a leading healthcare provider in the region."),
      education: [t("University of Malaysia"), t("Stanford University")]
    },
    {
      name: "Dr Sarah Lim",
      role: t("Chief Medical Officer"),
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      desc: t("Specializing in advanced cardiology with a focus on preventative care strategies for international patients."),
      education: [t("University of Singapore"), t("Harvard Medical School")]
    }
  ];

  return (
    <section className="w-full py-20 bg-white text-gray-900">
        <div className="pl-24 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* Left Content */}
                <div className="lg:col-span-4 flex flex-col justify-start">
                    {/* Icon */}
                    <div className="mb-6">
                        <BadgeCheck className="w-10 h-10 text-gray-900 stroke-[1.5]" />
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 leading-[1.1]">
                        {t('Guided by trusted doctors and global care partners')}
                    </h2>

                    {/* Description */}
                    <p className="mt-8 text-lg text-gray-500 leading-relaxed font-normal">
                        {t('Medifly collaborates with experienced physicians and accredited hospitals worldwide to ensure every patient gets reliable, high-quality care. Our growing network of medical advisors helps us design safe, patient-first experiences.')}
                    </p>

                    {/* CTA Button */}
                    <div className="mt-10">
                        <button className="group inline-flex items-center gap-4 bg-white border border-gray-200 rounded-full pl-6 pr-2 py-2 shadow-sm hover:border-gray-300 transition-colors duration-200">
                            <span className="text-base font-medium text-gray-900">{t('Explore Hospitals Now')}</span>
                            <span className="bg-black text-white rounded-full p-2 group-hover:bg-gray-800 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right Content (Carousel) */}
                <div className="lg:col-span-8 relative min-w-0">
                    {/* Slider Wrapper */}
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-8 pb-4 no-scrollbar -mr-6 px-1 lg:mr-0 snap-x snap-mandatory"
                    >
                        
                        {teamMembers.map((member, index) => (
                            <div key={index} className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col snap-start">
                                <div className="w-full aspect-[4/3] bg-[#93bace] overflow-hidden mb-6 relative rounded-sm">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top mix-blend-multiply opacity-90 contrast-125 hover:scale-105 transition-transform duration-500" />
                                </div>
                                
                                <h3 className="text-xl font-medium text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 font-normal">{member.role}</p>
                                
                                <p className="text-base text-gray-500 mt-5 leading-relaxed font-light min-h-[4.5em]">
                                    {member.desc}
                                </p>
                                
                                <div className="mt-6 space-y-3">
                                    {member.education.map((edu, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-600">
                                            <GraduationCap className="w-5 h-5 stroke-[1.5]" />
                                            <span className="text-sm">{edu}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-3 mt-10 pr-6 lg:pr-24">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </section>
  );
};
