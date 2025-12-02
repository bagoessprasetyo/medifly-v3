
import React, { useEffect, useState } from 'react';
import { Brain, Globe, Sparkles, Zap, FileText } from 'lucide-react';

export const AITranslationOverlay: React.FC = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { text: "Scanning page content...", icon: FileText },
    { text: "Identifying context nodes...", icon: Brain },
    { text: "Synthesizing neural translation...", icon: Zap },
    { text: "Optimizing medical terminology...", icon: Sparkles },
    { text: "Finalizing localization...", icon: Globe },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center max-w-md text-center p-8">
        
        {/* Animated Brain/Globe Core */}
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-[#E4F28A] blur-3xl opacity-40 animate-pulse rounded-full"></div>
            <div className="w-24 h-24 bg-white border border-slate-100 rounded-3xl shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent"></div>
                <CurrentIcon className="w-10 h-10 text-slate-900 animate-[bounce_1s_infinite]" />
            </div>
            {/* Orbiting particles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-slate-300 rounded-full animate-[spin_4s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-slate-100 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">AI Translation Active</h2>
        
        <div className="h-8 mb-6 flex items-center justify-center">
            <span className="text-sm font-medium text-slate-500 animate-in slide-in-from-bottom-2 fade-in duration-300 key={step}">
                {steps[step].text}
            </span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-[#D9F850] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
        </div>
        
        <div className="mt-8 flex gap-3 opacity-50">
            <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce delay-0"></div>
            <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce delay-100"></div>
            <div className="h-1 w-1 bg-slate-400 rounded-full animate-bounce delay-200"></div>
        </div>

      </div>
    </div>
  );
};
