
import React, { useEffect } from 'react';
import { Hospital } from '../types';
import { ChevronRight, Building, Languages } from 'lucide-react';

interface TreatmentDetailsPageProps {
  hospital: Hospital;
  specializationName: string;
  treatmentName: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToSpecialization: () => void;
}

export const TreatmentDetailsPage: React.FC<TreatmentDetailsPageProps> = ({ 
  hospital, 
  specializationName, 
  treatmentName,
  onBack, 
  onNavigateToHospital,
  onNavigateToSpecialization 
}) => {

  // Scroll to top on mount
  useEffect(() => {
    const mainContainer = document.getElementById('main-content-area');
    if (mainContainer) mainContainer.scrollTo(0, 0);
  }, [treatmentName]);

  // Mock content generation
  const getContent = (name: string) => {
    // Default generic content
    let content = {
        overview: `${name} is a specialized medical procedure performed to diagnose, treat, or manage specific health conditions. It involves advanced techniques and is carried out by expert specialists to ensure the best possible outcomes.`,
        why: [
            `To treat specific conditions related to ${specializationName}.`,
            "To alleviate symptoms and improve quality of life.",
            "To prevent further complications or disease progression."
        ],
        expect: [
            "Comprehensive pre-procedure assessment.",
            "State-of-the-art care during the procedure.",
            "Dedicated post-procedure monitoring and recovery plan."
        ],
        image: `https://source.unsplash.com/1600x900/?medical,surgery,${name.split(' ')[0]}`
    };

    // Specific content if matching the example "Chemotherapy"
    if (name.toLowerCase().includes('chemotherapy')) {
        content = {
            overview: "Chemotherapy is a drug treatment that uses powerful chemicals to kill fast-growing cells in your body. Chemotherapy is most often used to treat cancer, since cancer cells grow and multiply much more quickly than most cells in the body. Many different chemotherapy drugs are available. Chemotherapy drugs can be used alone or in combination to treat a wide variety of cancers.",
            why: [
                "To cure the cancer without other treatments. Chemotherapy can be used as the primary or sole treatment for cancer.",
                "After other treatments, to kill hidden cancer cells. Chemotherapy can be used after other treatments, such as surgery, to kill any cancer cells that might remain in the body. Doctors call this adjuvant therapy.",
                "To prepare you for other treatments. Chemotherapy can be used to shrink a tumor so that other treatments, such as radiation and surgery, are possible. Doctors call this neoadjuvant therapy.",
                "To ease signs and symptoms. Chemotherapy may help relieve signs and symptoms of cancer by killing some of the cancer cells. Doctors call this palliative chemotherapy."
            ],
            expect: [
                "Prevents cancer from spreading",
                "Helps make surgery easier",
                "Enhances the effect of radiation or other treatments",
                "Can relieve symptoms and improve comfort"
            ],
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
        };
    }

    return content;
  };

  const data = getContent(treatmentName);

  return (
    <div className="bg-white text-gray-900 font-sans antialiased animate-in fade-in duration-500">
        
        {/* Navigation Placeholder */}
        <div className="h-6"></div>

        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <button onClick={onNavigateToHospital} className="hover:text-gray-900 transition cursor-pointer">{hospital.name}</button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <button onClick={onNavigateToSpecialization} className="hover:text-gray-900 transition cursor-pointer">{specializationName}</button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900">{treatmentName}</span>
            </nav>

            {/* Page Title */}
            <h1 className="mb-10 text-4xl font-semibold tracking-tight text-gray-900">{treatmentName}</h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                
                {/* Main Content Area */}
                <div className="lg:col-span-8">
                    {/* Hero Image */}
                    <div className="relative mb-10 overflow-hidden rounded-2xl bg-gray-100 aspect-video">
                        <img 
                            src={data.image} 
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600'}
                            alt={treatmentName} 
                            className="h-full w-full object-cover" 
                        />
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-10">
                        {/* Overview */}
                        <section>
                            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">Overview</h2>
                            <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                                <p>{data.overview}</p>
                            </div>
                        </section>

                        {/* Why it's done */}
                        <section>
                            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">Why it's done</h2>
                            <p className="mb-4 text-lg leading-relaxed text-gray-600">
                                {treatmentName} is used to treat specific conditions effectively.
                            </p>
                            <ul className="list-outside list-disc space-y-3 pl-5 text-lg leading-relaxed text-gray-600">
                                {data.why.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        {/* What to expect */}
                        <section>
                            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900">What to expect</h2>
                            <ul className="list-outside list-disc space-y-3 pl-5 text-lg leading-relaxed text-gray-600">
                                {data.expect.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        {/* Card Header */}
                        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-200">
                                <Building className="h-5 w-5 text-gray-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Hospital</h3>
                        </div>

                        {/* Hospital Info */}
                        <div className="mb-6">
                            <div className="mb-4 flex items-start gap-3">
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 p-1">
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 rounded">
                                        {hospital.name.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <div className="relative">
                                    <h4 className="text-base font-semibold leading-tight text-gray-900">{hospital.name}</h4>
                                    
                                    {/* Language Tooltip Simulation */}
                                    <div className="group relative mt-1 cursor-help">
                                        <p className="text-xs text-blue-600 underline decoration-blue-200 underline-offset-2">5 Languages Supported</p>
                                        <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg bg-gray-900 p-3 text-xs text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                            <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-gray-900"></div>
                                            <p className="font-medium leading-relaxed">English, Melayu, Mandarin, Hokkien, Cantonese</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-[#EEF8D6] px-2.5 py-1.5 text-xs font-medium text-[#4D642D]">
                                <Languages className="h-3.5 w-3.5" />
                                Offers Multiple Language Support
                            </div>

                            <p className="text-base leading-relaxed text-gray-500">
                                Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
                            </p>
                        </div>

                        {/* Action Button */}
                        <button 
                            onClick={onNavigateToHospital}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                        >
                            View Hospital
                        </button>
                    </div>
                </div>

            </div>
        </main>
    </div>
  );
};
