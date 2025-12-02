
import React, { useState, useEffect } from 'react';
import { Hospital } from '../types';
import { 
  ChevronRight, Building2, Globe, Languages, ArrowRight, 
  ChevronDown, ChevronUp, FileText, Calendar, Users, Briefcase
} from 'lucide-react';

interface ResearchDetailsPageProps {
  hospital: Hospital;
  researchTitle: string;
  category?: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToArticle?: (title: string) => void;
  onNavigateToResearch?: (title: string) => void;
}

export const ResearchDetailsPage: React.FC<ResearchDetailsPageProps> = ({ 
  hospital, 
  researchTitle, 
  category = "Oncology",
  onBack, 
  onNavigateToHospital,
  onNavigateToArticle,
  onNavigateToResearch
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2);

  // Scroll to top on mount
  useEffect(() => {
    const mainContainer = document.getElementById('main-content-area');
    if (mainContainer) mainContainer.scrollTo(0, 0);
  }, [researchTitle]);

  // Mock Content Generator based on title
  const getResearchContent = () => {
    return {
      title: researchTitle,
      date: "30 November 2025",
      heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
      content: (
        <>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">MRI</h2>
          <p className="mb-6 leading-relaxed text-lg">
              LASIK (Laser-Assisted in Situ Keratomileusis) is a popular vision correction surgery that uses a precise laser to reshape the cornea, improving focus and eliminating the need for glasses or contact lenses. It is commonly used to treat refractive vision problems such as nearsightedness (myopia), farsightedness (hyperopia), and astigmatism.
          </p>
          <p className="mb-6 leading-relaxed text-lg">
              During the procedure, numbing eye drops are applied to ensure comfort. A small flap is created in the cornea, and a laser is used to reshape the inner tissue to focus carefully. The flap is then repositioned, aiding in quick healing. LASIK is a minimally invasive, outpatient procedure with a fast recovery time, although mild discomfort is common in the initial days after surgery.
          </p>
          <p className="mb-8 leading-relaxed text-lg">
              At {hospital.name}, we are dedicated to providing you and your loved ones with exceptional care for eye-related diagnosis and treatment. In addition to providing our patients with high-quality services and clinical care, we also give them access to the most advanced medical technology and the greatest diagnostic equipment available.
          </p>

          <p className="mb-4 leading-relaxed text-lg">
              Our dedicated team and excellent facilities ensure you will receive quality care, as we treat and manage various eye conditions and diseases in both adults and children. Our <span className="text-gray-900 underline decoration-gray-300 underline-offset-4 cursor-pointer">Specialist Clinic</span> aims to provide:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-10 text-lg marker:text-gray-400">
              <li>Comprehensive eye assessment and screening services for all ophthalmic patients.</li>
              <li>Scheduled annual eye examinations.</li>
              <li>Health education (pre and post) for all patients undergoing surgery or procedures.</li>
              <li>A comprehensive treatment plan will be implemented according to each patient's needs.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight mb-4">Pre-operation LASIK Surgery</h3>
          <p className="mb-8 leading-relaxed text-lg">
              Before undergoing LASIK surgery at {hospital.name}, your doctor will first perform a series of eye exams to determine if you are a good candidate for the procedure. To reduce the risk of infection, we recommend avoiding the use of makeup, perfume, or lotion at least one day before your surgery. Our team will guide you through the preparation process to ensure a smooth and successful LASIK experience.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 tracking-tight mb-4">LASIK Procedure</h3>
          <ul className="list-disc pl-6 space-y-3 mb-12 text-lg marker:text-gray-400">
              <li>Firstly, anaesthesia in the form of eye drops will be administered to numb your eyes, and your surgeon will place ink marks to indicate where the corneal flap will be cut.</li>
              <li>Then, an eye retainer will be placed over your eyelids in order to keep them open, while a suction ring will be used to hold your eye still and create enough pressure to firm it up for laser cutting.</li>
              <li>Next, a femtosecond laser will be used to create a corneal flap to expose the inner corneal tissue, and an excimer laser will remove said tissue to reshape the cornea properly. The outer corneal flap is then replaced.</li>
          </ul>
        </>
      )
    };
  };

  const articleData = getResearchContent();

  const relatedContent = [
    { title: "Explore world-class hospitals in Kuala Lumpur, Penang, and Johor", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800", type: "Article" },
    { title: "Renowned for cosmetic, dental, and transplant care international standards", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800", type: "Research" },
    { title: "Latest advancements in precision medicine and robotic surgery", img: "https://images.unsplash.com/photo-1516549655169-df83a0833860?q=80&w=800", type: "Article" }
  ];

  const faqs = [
    "What support does this hospital provide for international patients?",
    "How can Medifly.Ai help me?",
    "Does this hospital provide virtual consultations before traveling?",
    "How do I schedule an appointment or treatment?",
    "How much do treatments cost?",
    "Can my insurance cover my treatment in this hospital?"
  ];

  return (
    <div className="bg-white text-gray-900 font-sans antialiased animate-in fade-in duration-500">
        
        {/* Navigation Placeholder */}
        <div className="h-6"></div>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <button onClick={onNavigateToHospital} className="hover:text-gray-900 cursor-pointer">{hospital.name}</button>
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                <button onClick={onBack} className="hover:text-gray-900 cursor-pointer">{category}</button>
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{researchTitle}</span>
            </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Article */}
                <div className="lg:col-span-8">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex gap-3">
                            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-600">Research</span>
                            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-600">{category}</span>
                        </div>
                        <span className="text-sm text-gray-500">{articleData.date}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.15] mb-8">
                        {articleData.title}
                    </h1>

                    {/* Hero Image */}
                    <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-gray-100 relative">
                        <img src={articleData.heroImage} alt="Medical Procedure" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/5"></div>
                    </div>

                    {/* Article Body */}
                    <div className="prose prose-lg max-w-none text-gray-600">
                        {articleData.content}
                    </div>

                    {/* Featured Doctor */}
                    <div className="border-t border-gray-100 pt-8 mb-12 mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                            <h3 className="text-lg font-semibold text-gray-900">Featured Doctor</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Doctor 1 */}
                            <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150" alt="Dr. Khoo" className="w-14 h-14 rounded-full object-cover ring-2 ring-white" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-base">Dr. Khoo Eng Hooi</p>
                                    <p className="text-gray-500 text-sm">General Medicine</p>
                                </div>
                            </div>
                             {/* Doctor 2 */}
                             <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150&h=150" alt="Dr. Ang" className="w-14 h-14 rounded-full object-cover ring-2 ring-white" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-base">Dr. Ang Peng Tiam</p>
                                    <p className="text-gray-500 text-sm">Oncology</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reference */}
                    <div className="border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                            <h3 className="text-lg font-semibold text-gray-900">Reference</h3>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-8 space-y-4 border border-gray-100">
                            <p className="text-gray-600 italic text-sm leading-relaxed">
                                Roberts ME, Rahman NM, Maskell NA, et al. British Thoracic Society Guideline for pleural disease. Thorax 2023;0:1-34.
                            </p>
                            <p className="text-gray-600 italic text-sm leading-relaxed">
                                Brims F, Popowicz N, Rosenstengel A, et al. Bacteriology and clinical outcomes of patients with culture-positive pleural infection. Respirology. 2019;24(2):171–8
                            </p>
                            <p className="text-gray-600 italic text-sm leading-relaxed">
                                Yong GKW, Wong JJJ, Zhang X, et al. Intrapleural fibrinolytic therapy for pleural infections: outcomes from a cohort study. Ann Acad Med Singap 2024;53:724-33.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Hospital</h2>
                        </div>

                        {/* Hospital Card */}
                        <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shrink-0">
                                    <span className="text-xs font-bold text-gray-500">{hospital.name.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">{hospital.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs">
                                            {hospital.country === 'Malaysia' ? '🇲🇾' : 
                                             hospital.country === 'Singapore' ? '🇸🇬' : 
                                             hospital.country === 'Thailand' ? '🇹🇭' : '🏳️'}
                                        </span>
                                        <p className="text-sm text-gray-500 leading-snug">English, Melayu, Mandarin</p>
                                    </div>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] px-3 py-1.5 rounded-md text-xs font-medium mb-4">
                                <Languages className="w-3.5 h-3.5" strokeWidth={1.5} />
                                Offers Multiple Language Support
                            </div>

                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
                            </p>

                            <button 
                                onClick={onNavigateToHospital}
                                className="w-full border border-gray-200 text-gray-900 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                            >
                                View Hospital
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Articles Section */}
            <div className="mt-24 pt-12 border-t border-gray-100">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-10">Other Articles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {relatedContent.map((item, i) => (
                        <div 
                            key={i} 
                            onClick={() => {
                                if (item.type === 'Research') {
                                    onNavigateToResearch?.(item.title);
                                } else {
                                    onNavigateToArticle?.(item.title);
                                }
                            }}
                            className="group cursor-pointer bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-900 shadow-sm">{item.type}</span>
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-900 shadow-sm">{category}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-tight group-hover:text-gray-700 min-h-[3.5em]">{item.title}</h3>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm text-gray-500">5 min reading</span>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button onClick={onBack} className="border border-gray-200 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        See More Article
                    </button>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-24">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-12">Frequently Asked Questions</h2>
                
                <div className="space-y-0 border-t border-gray-100">
                    {faqs.map((q, i) => (
                        <div key={i} className="border-b border-gray-100 py-5 cursor-pointer group">
                            <button 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                className="flex justify-between items-center w-full text-left"
                            >
                                <h3 className={`text-lg font-medium ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>{q}</h3>
                                {openFaqIndex === i ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />}
                            </button>
                            {openFaqIndex === i && (
                                <div className="mt-4 text-gray-600 leading-relaxed text-base pr-8 animate-in slide-in-from-top-1">
                                    Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
};
