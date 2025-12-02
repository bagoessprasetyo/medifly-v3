
import React, { useState } from 'react';
import { Hospital } from '../types';
import { ChevronRight, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface HospitalInsightsPageProps {
  hospital: Hospital;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToArticle?: (title: string) => void;
  onNavigateToResearch?: (title: string) => void; // Added prop
}

export const HospitalInsightsPage: React.FC<HospitalInsightsPageProps> = ({ hospital, onBack, onNavigateToHospital, onNavigateToArticle, onNavigateToResearch }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2); 

  const tabs = [
    { id: 'all', label: 'All Insights' },
    { id: 'articles', label: 'Articles' },
    { id: 'research', label: 'Research' }
  ];

  const articles = [
    {
        title: `Explore world-class hospitals in ${hospital.location}, ${hospital.country}`,
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop",
        category: "Article",
        tag: "Oncology",
        readTime: "5 min reading"
    },
    {
        title: "Renowned for cosmetic, dental, and transplant care international standards",
        image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2000&auto=format&fit=crop",
        category: "Research", // Changed to Research for demo
        tag: "Research",
        readTime: "10 min reading"
    },
    {
        title: "Latest advancements in precision medicine and robotic surgery",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop",
        category: "Article",
        tag: "Research",
        readTime: "8 min reading"
    },
    // Repeat for grid effect
    {
        title: `Understanding the patient journey at ${hospital.name}`,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
        category: "Article",
        tag: "Patient Guide",
        readTime: "4 min reading"
    },
    {
        title: "Top 10 reasons to choose medical tourism in Asia",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2000&auto=format&fit=crop",
        category: "Article",
        tag: "Guide",
        readTime: "6 min reading"
    },
    {
        title: "Post-operative care: What you need to know before flying",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop",
        category: "Article",
        tag: "Recovery",
        readTime: "5 min reading"
    }
  ];

  const faqs = [
    { q: "What support does this hospital provide for international patients?", a: "We offer dedicated concierge services, including visa assistance, airport transfers, and translation services in over 20 languages." },
    { q: "How can Medifly.Ai help me?", a: "Medifly streamlines your journey by connecting you with top specialists, estimating costs, and managing logistics." },
    { q: "Does this hospital provide virtual consultations before traveling?", a: "Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free." },
    { q: "How do I schedule an appointment or treatment?", a: "You can book directly through our platform. Just click 'Book Consultation' or ask Aria to set it up for you." },
    { q: "How much do treatments cost?", a: "Costs vary by procedure. Use our AI pricing tool or request a detailed quote from the hospital page." },
    { q: "Can my insurance cover my treatment in this hospital?", a: "Many international insurance plans are accepted. We recommend checking with your provider or our billing team." }
  ];

  const filteredArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(a => a.category.toLowerCase().includes(activeTab) || a.tag.toLowerCase().includes(activeTab));

  return (
    <div className="bg-[#FAF8F7] min-h-screen pb-20 font-sans text-slate-900 animate-in fade-in duration-500">
        
        {/* Main Content */}
        <main className="max-w-[1400px] mx-auto px-6 pt-10 pb-24">
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span className="hover:text-gray-900 cursor-pointer transition-colors" onClick={onNavigateToHospital}>{hospital.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">Insights</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-12 max-w-2xl leading-[1.1]">
                Insights from <br/> {hospital.name}
            </h1>

            {/* Filters & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 mb-10 gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-8">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 border-b-2 text-sm font-medium transition-all ${
                                activeTab === tab.id 
                                    ? 'border-black text-black' 
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filter Dropdown Trigger (Mock) */}
                <div className="pb-2 md:pb-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-all shadow-sm">
                        Specialization
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {filteredArticles.map((article, i) => (
                    <div 
                        key={i} 
                        onClick={() => {
                            if (article.tag === 'Research' || article.category === 'Research') {
                                onNavigateToResearch?.(article.title);
                            } else {
                                onNavigateToArticle?.(article.title);
                            }
                        }}
                        className="group cursor-pointer flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="relative h-64 overflow-hidden rounded-t-xl bg-gray-200">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-900 shadow-sm">{article.category}</span>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-900 shadow-sm">{article.tag}</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-b-xl flex-1 flex flex-col justify-between transition-colors shadow-sm border border-transparent border-t-0 group-hover:shadow-md">
                            <h3 className="text-lg font-medium tracking-tight text-gray-900 mb-8 leading-snug">
                                {article.title}
                            </h3>
                            <div className="flex items-center justify-between text-gray-500">
                                <span className="text-xs font-medium">{article.readTime}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <section className="max-w-4xl mb-24">
                <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-8">Frequently Asked Questions</h2>
                
                <div className="space-y-0 border-t border-gray-200">
                    {faqs.map((item, i) => (
                        <div key={i} className="border-b border-gray-200 py-5">
                            <button 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                className={`flex items-center justify-between w-full text-left focus:outline-none group ${openFaqIndex === i ? 'mb-3' : ''}`}
                            >
                                <span className="text-base font-medium text-gray-900 group-hover:text-gray-700">{item.q}</span>
                                {openFaqIndex === i ? <ChevronUp className="w-5 h-5 text-gray-900" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                            </button>
                            {openFaqIndex === i && (
                                <div className="text-gray-500 text-sm leading-relaxed max-w-3xl animate-in slide-in-from-top-1">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

        </main>
    </div>
  );
};
