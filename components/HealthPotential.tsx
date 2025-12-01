
import React from 'react';
import { ChevronRight } from 'lucide-react';

export const HealthPotential: React.FC = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 lg:py-24 bg-white">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-16 items-start">
        <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-slate-900">
          Unlock your Global <br className="hidden lg:block" /> Health Potential
        </h1>
        <div className="max-w-xl">
          <h2 className="text-xl font-medium text-slate-900 mb-4 tracking-tight">
            Know more. Choose better. Heal faster.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-normal">
            Medifly helps you compare hospitals, specialists, and treatments worldwide — giving you personalized insights so you can make confident, data-driven decisions about your health.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Card 1 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Image */}
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop" 
                 alt="Health Analysis" 
                 className="absolute inset-0 w-full h-full object-cover object-[25%_20%] mix-blend-overlay opacity-50 grayscale-[20%]" />
            <div className="absolute inset-0 bg-sky-900/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 to-transparent"></div>

            {/* Badge */}
            <div className="absolute top-4 left-4 w-10 h-10 bg-[#fef08a] rounded-full flex items-center justify-center text-sm font-medium text-slate-900 shadow-sm z-20">
              1 .
            </div>

            {/* UI Overlay: Chart */}
            <div className="absolute inset-0 p-6 flex flex-col justify-center z-10">
              <div className="text-center text-xs text-sky-100 mb-6 font-medium tracking-wide opacity-80 uppercase">Mid-year result</div>
              
              <div className="relative h-48 w-full max-w-[200px] mx-auto">
                {/* Vertical Bar */}
                <div className="absolute left-4 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-red-500 via-orange-400 to-green-500"></div>

                {/* Marker 1: Top */}
                <div className="absolute top-[10%] left-8 flex flex-col">
                  <span className="text-[10px] font-semibold text-red-500 leading-tight">&gt;47</span>
                  <span className="text-[10px] text-red-400 font-medium leading-tight">Trending older</span>
                </div>

                {/* Marker 2: Middle (Active) */}
                <div className="absolute top-[50%] left-0 w-full flex items-center">
                  <div className="w-4 h-4 -ml-[5px] bg-white border-4 border-orange-400 rounded-full shadow-sm z-20 relative"></div>
                  <div className="ml-4 flex flex-col">
                    <span className="text-xs font-semibold text-white leading-tight">47</span>
                    <span className="text-[10px] text-sky-100/80 font-normal leading-tight">Your real age</span>
                  </div>
                  {/* Dashed Line */}
                  <svg className="absolute left-4 top-1/2 w-[200px] h-[20px] -translate-y-1/2 overflow-visible hidden lg:block" style={{zIndex: 0}}>
                    <path d="M0,10 L250,50" stroke="white" strokeWidth="1.5" strokeDasharray="4,4" strokeOpacity="0.6" fill="none" />
                  </svg>
                </div>

                {/* Marker 3: Bottom */}
                <div className="absolute bottom-[20%] left-8 flex flex-col">
                  <span className="text-[10px] font-semibold text-green-400 leading-tight">&lt;47</span>
                  <span className="text-[10px] text-green-500/80 font-medium leading-tight">Trending younger</span>
                </div>
              </div>

              <div className="mt-auto text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mb-2 animate-pulse"></div>
                  <p className="text-[11px] text-white font-medium leading-snug max-w-[140px] mx-auto">
                    13% improvement over the last 6 months
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">Discover Your Options</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Explore 1,000+ hospitals and specialists, and the best treatment for your specific condition, globally.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop" 
                 alt="Biological Age" 
                 className="absolute inset-0 w-full h-full object-cover object-[60%_20%] mix-blend-overlay opacity-60 grayscale-[20%]" />
            <div className="absolute inset-0 bg-sky-900/30 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-transparent to-sky-900/20"></div>

            <div className="absolute top-4 left-4 w-10 h-10 bg-[#fef08a] rounded-full flex items-center justify-center text-sm font-medium text-slate-900 shadow-sm z-20">
              2 .
            </div>

            <div className="absolute inset-0 p-6 flex flex-col items-center justify-center z-10 text-center">
              <div className="text-[10px] text-sky-100 mb-2 font-medium tracking-wide opacity-80 uppercase absolute top-24">As of today</div>
              
              <div className="relative z-20">
                <div className="text-[80px] leading-none font-light text-white tracking-tighter mix-blend-screen drop-shadow-lg">
                  41
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-4 ring-4 ring-green-500/20"></div>
              </div>

              <div className="absolute bottom-10 w-full text-center px-4">
                <div className="w-1.5 h-1.5 bg-white rounded-full mb-3 mx-auto"></div>
                <p className="text-[11px] text-sky-100 font-medium leading-snug">
                  6 years younger than your chronological age
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">Compare Experts & Costs with AI</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Get personalized insights and treatment matches based on your lifestyle & health goals — instantly.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#0c4a6e] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop" 
                 alt="Medical Data" 
                 className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-sky-600/20 mix-blend-color"></div>

            <div className="absolute top-4 left-4 w-10 h-10 bg-[#fef08a] rounded-full flex items-center justify-center text-sm font-medium text-slate-900 shadow-sm z-20">
              3 .
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white/95 backdrop-blur-sm w-full max-w-[240px] rounded-xl shadow-2xl overflow-hidden transform transition-transform group-hover:scale-[1.02] duration-500">
                <div className="p-4 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900">Making you younger</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">These markers are helping you age more slowly.</p>
                </div>
                <div className="flex flex-col">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">Triglycerides</div>
                        <div className="text-[9px] text-green-600 font-medium">Optimal — 108 mg/dL</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">Hemoglobin A1c</div>
                        <div className="text-[9px] text-green-600 font-medium">Optimal — 5.1%</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">Calcium</div>
                        <div className="text-[9px] text-green-600 font-medium">Optimal — 9.4 mg/dL</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Fade out */}
                  <div className="px-3 pb-2 pt-1 opacity-40">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                      <div className="h-2 w-16 bg-slate-200 rounded-full mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">Speak directly with doctors</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Connect with real doctors ready to answer your questions and craft your personalised care plan.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#0c4a6e] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                 alt="Medical Data Analysis" 
                 className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-sky-700/30 mix-blend-color"></div>

            <div className="absolute top-4 left-4 w-10 h-10 bg-[#fef08a] rounded-full flex items-center justify-center text-sm font-medium text-slate-900 shadow-sm z-20">
              4 .
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="bg-white/95 backdrop-blur-sm w-full max-w-[240px] rounded-xl shadow-2xl overflow-hidden transform transition-transform group-hover:scale-[1.02] duration-500">
                <div className="p-4 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900">Aging you</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">These markers are aging you faster than normal.</p>
                </div>
                <div className="flex flex-col">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">LDL Cholesterol</div>
                        <div className="text-[9px] text-red-500 font-medium">Out of range — 185 mg/dL</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">Non-HDL Cholesterol</div>
                        <div className="text-[9px] text-red-500 font-medium">Out of range — 195 mg/dL</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-800">Cortisol</div>
                        <div className="text-[9px] text-red-500 font-medium">Out of range — 28.5 mg/dL</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                  {/* Fade out */}
                  <div className="px-3 pb-2 pt-1 opacity-40">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                      <div className="h-2 w-8 bg-slate-200 rounded-full mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">Plan your full care journey safe</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Finalize treatment, travel, and recovery with Medifly — everything under one roof.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
