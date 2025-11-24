
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain, CheckCircle2, Loader2 } from 'lucide-react';

interface ThinkingProcessProps {
  steps: string[];
}

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ steps }) => {
  const [isMainOpen, setIsMainOpen] = useState(false); // Collapsed by default
  const [expandedStep, setExpandedStep] = useState<number | null>(null); // All steps collapsed by default
  
  // If steps are undefined or empty array, but component is rendered, it means we are "thinking" (loading)
  const isLoading = !steps || steps.length === 0;
  
  // Filter out any garbage steps
  const displaySteps = isLoading ? [] : steps.filter(s => s.length > 5 && !s.toLowerCase().match(/^(thinking|analysis)$/));

  const parsedSteps = displaySteps.map((step, idx) => {
    // We expect "1. **Title**: Content" or "1. Title: Content"
    const match = step.match(/^(\d+)\.\s*(?:\*\*)?([^:*]+)(?:\*\*)?:?\s*(.*)/);
    
    if (match) {
      return {
        number: match[1],
        title: match[2]?.trim().replace(/^\*\*/, '').replace(/\*\*$/, '') || `Step ${match[1]}`,
        content: match[3]?.trim() || step,
      };
    }
    
    const isTitleLike = step.length < 40 && !step.includes('.');
    
    return { 
        number: idx + 1, 
        title: isTitleLike ? step.replace(/^[0-9.]+\s*/, '') : 'Analysis', 
        content: isTitleLike ? 'Processing...' : step.replace(/^[0-9.]+\s*/, '') 
    };
  });

  const toggleStep = (idx: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedStep(expandedStep === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-full my-3 font-sans animate-in fade-in slide-in-from-bottom-1 duration-500">
      {/* Main Container */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        
        {/* Main Header */}
        <button 
          onClick={() => setIsMainOpen(!isMainOpen)}
          className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors"
        >
           <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-md ${isLoading ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      {isLoading ? 'Analyzing Request...' : 'Clinical Reasoning'}
                  </span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              {!isLoading && (
                  <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                      {parsedSteps.length} Steps
                  </span>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isMainOpen ? 'rotate-180' : ''}`} />
           </div>
        </button>

        {/* Content Body */}
        {isMainOpen && (
            <div className="border-t border-slate-100">
                {isLoading ? (
                    <div className="p-4 text-center">
                        <p className="text-xs text-slate-400 italic">Consulting medical protocols...</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {parsedSteps.map((step, idx) => (
                            <div key={idx} className="border-b border-slate-50 last:border-none">
                                <button 
                                    onClick={(e) => toggleStep(idx, e)}
                                    className="w-full flex items-center text-left py-2.5 px-4 hover:bg-slate-50/80 transition-colors group"
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono mr-3 border ${expandedStep === idx ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                                        {step.number}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wide flex-1 ${expandedStep === idx ? 'text-teal-700' : 'text-slate-600'}`}>
                                        {step.title}
                                    </span>
                                    {expandedStep === idx ? (
                                        <ChevronUp className="w-3 h-3 text-teal-500" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                                    )}
                                </button>
                                
                                {/* Expandable Content */}
                                {expandedStep === idx && (
                                    <div className="px-4 pb-4 pl-[3.25rem] animate-in slide-in-from-top-1 duration-200">
                                        <p className="text-[13px] leading-relaxed text-slate-600 font-medium">
                                            {step.content}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
