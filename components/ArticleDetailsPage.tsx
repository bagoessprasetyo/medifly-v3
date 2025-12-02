
import React, { useState, useEffect } from 'react';
import { Hospital } from '../types';
import { 
  ChevronRight, Building2, Globe, Languages, ArrowRight, 
  ChevronDown, ChevronUp, FileText, Calendar 
} from 'lucide-react';

interface ArticleDetailsPageProps {
  hospital: Hospital;
  articleTitle: string;
  category?: string;
  onBack: () => void;
  onNavigateToHospital: () => void;
  onNavigateToArticle: (title: string) => void;
  onNavigateToResearch?: (title: string) => void; // Added prop
}

export const ArticleDetailsPage: React.FC<ArticleDetailsPageProps> = ({ 
  hospital, 
  articleTitle, 
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
  }, [articleTitle]);

  // Mock Content Generator based on title
  const getArticleContent = () => {
    return {
      title: articleTitle,
      author: "Dr. Khoo Eng Hooi",
      date: "30 November 2025",
      heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000",
      content: (
        <>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-6">Introduction to Advanced Care</h2>
          <p className="mb-6 leading-relaxed">
            In the rapidly evolving landscape of modern medicine, staying ahead means integrating the latest technological advancements with compassionate, patient-centered care. This article explores how {hospital.name} is pioneering new standards in {category}, offering patients access to treatments that were unavailable just a decade ago.
          </p>
          <p className="mb-6 leading-relaxed">
            From minimally invasive robotic surgeries to precision-targeted therapies, the focus is on reducing recovery time while maximizing clinical outcomes. Our multidisciplinary team ensures that every diagnosis is met with a comprehensive, tailored treatment plan.
          </p>
          <p className="mb-6 leading-relaxed">
            At {hospital.name}, we are dedicated to providing you and your loved ones with exceptional care for diagnosis and treatment. In addition to providing our patients with high-quality services and clinical care, we also give them access to the most advanced medical technology and the greatest diagnostic equipment available.
          </p>
          <p className="mb-6 leading-relaxed">
            Our dedicated team and excellent facilities ensure you will receive quality care, as we treat and manage various complex conditions. Our <span className="text-slate-900 underline decoration-slate-300 underline-offset-4 cursor-pointer">Specialist Clinic</span> aims to provide:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-10 text-slate-600 marker:text-slate-400">
            <li>Comprehensive assessment and screening services for all patients.</li>
            <li>Scheduled annual detailed examinations.</li>
            <li>Health education (pre and post) for all patients undergoing surgery or procedures.</li>
            <li>A comprehensive treatment plan implemented according to each patient's needs.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">Pre-operation Procedures</h3>
          <p className="mb-6 leading-relaxed">
            Before undergoing surgery at {hospital.name}, your doctor will first perform a series of exams to determine if you are a good candidate for the procedure. To reduce the risk of infection, we recommend following strict hygiene protocols at least one day before your surgery. Our team will guide you through the preparation process to ensure a smooth and successful experience.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">The Procedure</h3>
          <ul className="list-disc pl-5 space-y-2 mb-12 text-slate-600 marker:text-slate-400">
            <li>Firstly, anaesthesia will be administered to ensure comfort, and your surgeon will mark the precise areas for intervention.</li>
            <li>Then, advanced imaging guidance is used to position instruments with sub-millimeter accuracy.</li>
            <li>Finally, the procedure is completed with minimal tissue disruption, promoting faster healing and less post-operative discomfort.</li>
          </ul>
        </>
      )
    };
  };

  const articleData = getArticleContent();

  const relatedArticles = [
    { title: "Explore world-class hospitals in Kuala Lumpur, Penang, and Johor", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800", type: "Article" },
    { title: "Renowned for cosmetic, dental, and transplant care international standards", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800", type: "Research" }, // Research Item
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
    <div className="bg-white text-slate-600 font-sans antialiased animate-in fade-in duration-500">
        
        {/* Navbar Placeholder */}
        <div className="h-6"></div>

        <div className="max-w-[1400px] mx-auto px-6 py-10">
            
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
                <button onClick={onNavigateToHospital} className="hover:text-slate-900 transition-colors">{hospital.name}</button>
                <ChevronRight className="w-4 h-4 mx-2" />
                <button onClick={onBack} className="hover:text-slate-900 transition-colors">{category}</button>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-slate-900 font-medium truncate max-w-[200px]">{articleTitle}</span>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                
                {/* Left Content: Article */}
                <article className="lg:col-span-8">
                    
                    {/* Tags */}
                    <div className="flex gap-3 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-medium text-slate-700">
                            Article
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-medium text-slate-700">
                            {category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1] mb-8">
                        {articleData.title}
                    </h1>

                    {/* Author Meta */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
                        <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                            <span className="text-sm font-medium text-slate-900">{articleData.author}</span>
                        </div>
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {articleData.date}
                        </span>
                    </div>

                    {/* Hero Image */}
                    <div className="relative w-full aspect-[16/9] mb-12 overflow-hidden rounded-xl bg-gray-100">
                        <img src={articleData.heroImage} alt="Article Hero" className="w-full h-full object-cover" />
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-lg max-w-none text-slate-600">
                        {articleData.content}
                    </div>

                    {/* Reference Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 mb-20 mt-12">
                        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
                            <FileText className="w-5 h-5" />
                            <span>Reference</span>
                        </div>
                        <div className="space-y-4 text-sm text-slate-500 italic leading-relaxed">
                            <p>Roberts ME, Rahman NM, Maskell NA, et al. British Thoracic Society Guideline for pleural disease. Thorax 2023;0:1-34.</p>
                            <p>Helps determine the next steps if any condition is identified.</p>
                            <p>Brims F, Popowicz N, Rosenstengel A, Hart J, Yogendran A, Read CA, et al. Bacteriology and clinical outcomes of patients with culture-positive pleural infection in Western Australia.</p>
                            <p>Goh KJ, Chew WM, Ong JCL, et al. A retrospective cohort study evaluating the safety and efficacy of sequential versus concurrent intrapleural instillation.</p>
                        </div>
                    </div>

                </article>

                {/* Right Content: Sidebar */}
                <aside className="lg:col-span-4 space-y-8 mt-10 lg:mt-0">
                    <div className="border border-gray-200 rounded-xl p-6 sticky top-28 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <Building2 className="w-6 h-6 text-slate-900" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Hospital</h3>
                        </div>

                        <div className="flex items-start gap-4 mb-4 relative">
                            <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white shrink-0 p-1">
                                <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {hospital.name.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-slate-900 leading-tight mb-1">{hospital.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <Globe className="w-3 h-3" />
                                    <span className="font-medium underline decoration-blue-200 underline-offset-2">5 Languages Supported</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 text-yellow-800 text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded mb-4 inline-flex items-center gap-1.5">
                            <Languages className="w-3 h-3" />
                            Offers Multiple Language Support
                        </div>

                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Committed to patient-centered care, {hospital.name} ensures high-quality treatments tailored to individual needs.
                        </p>

                        <button 
                            onClick={onNavigateToHospital}
                            className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 hover:text-slate-900 transition-colors bg-white"
                        >
                            View Hospital
                        </button>
                    </div>
                </aside>
            </div>

            {/* Other Articles Section */}
            <section className="mt-12 pt-12 border-t border-gray-100">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-10">Other Articles</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {relatedArticles.map((article, i) => (
                        <div 
                            key={i} 
                            onClick={() => {
                                if (article.type === 'Research') {
                                    onNavigateToResearch?.(article.title);
                                } else {
                                    onNavigateToArticle(article.title);
                                }
                            }}
                            className="group bg-[#f5f5f4] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-4 left-4 flex gap-2 z-10">
                                    <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-semibold px-2.5 py-1 rounded shadow-sm">Article</span>
                                    <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-semibold px-2.5 py-1 rounded shadow-sm">{article.type || category}</span>
                                </div>
                                <img src={article.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={article.title} />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-900 leading-snug mb-8 tracking-tight min-h-[3.5em]">{article.title}</h3>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs text-gray-500">5 min reading</span>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mb-24">
                    <button 
                        onClick={onBack}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-900 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        See More Articles
                    </button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-24">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-10">Frequently Asked Questions</h2>
                
                <div className="border-t border-gray-200">
                    {faqs.map((q, i) => (
                        <div key={i} className="border-b border-gray-200 py-5">
                            <button 
                                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                                className={`flex w-full items-center justify-between text-left group ${openFaqIndex === i ? 'mb-4' : ''}`}
                            >
                                <span className={`text-base ${openFaqIndex === i ? 'font-semibold text-slate-900' : 'font-medium text-slate-900 group-hover:text-slate-700'}`}>
                                    {q}
                                </span>
                                {openFaqIndex === i ? <ChevronUp className="w-5 h-5 text-slate-900" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>
                            {openFaqIndex === i && (
                                <div className="text-base text-gray-500 leading-relaxed pr-8 animate-in slide-in-from-top-1">
                                    Absolutely. Medifly AI assists you through every step of your medical journey — from finding the right hospital and doctor to estimating costs, planning your stay, and arranging travel details. We make medical trips simpler, smarter, and stress-free.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

        </div>
    </div>
  );
};
