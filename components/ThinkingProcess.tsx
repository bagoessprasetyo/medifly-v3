
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Brain, Sparkles, Lightbulb, Target, Search, Compass } from 'lucide-react';

interface ThinkingProcessProps {
  steps: string[];
  isStreaming?: boolean;
}

// Map of step titles to icons for visual variety
const getStepIcon = (title: string): React.ReactNode => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('intent') || lowerTitle.includes('question') || lowerTitle.includes('asking')) {
    return <Search className="w-3 h-3" />;
  }
  if (lowerTitle.includes('emotion') || lowerTitle.includes('feeling') || lowerTitle.includes('reading')) {
    return <Lightbulb className="w-3 h-3" />;
  }
  if (lowerTitle.includes('knowledge') || lowerTitle.includes('assess') || lowerTitle.includes('journey')) {
    return <Compass className="w-3 h-3" />;
  }
  if (lowerTitle.includes('strategy') || lowerTitle.includes('formul') || lowerTitle.includes('approach')) {
    return <Target className="w-3 h-3" />;
  }
  return <Brain className="w-3 h-3" />;
};

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ steps: rawSteps, isStreaming = false }) => {
  // Start collapsed by default for cleaner UX, but expand if streaming
  const [isMainOpen, setIsMainOpen] = useState(isStreaming);
  const contentRef = useRef<HTMLDivElement>(null);

  // Expand when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setIsMainOpen(true);
    }
  }, [isStreaming]);

  // Safety: Ensure steps is always an array
  const steps = Array.isArray(rawSteps)
    ? rawSteps
    : typeof rawSteps === 'string'
      ? (rawSteps as string).split('\n').filter(s => s.trim().length > 0)
      : [];

  // If steps are undefined or empty array, but component is rendered, it means we are "thinking"
  const isLoading = !steps || steps.length === 0;

  // Auto-scroll to bottom as new content streams in
  useEffect(() => {
    if (contentRef.current && isMainOpen) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [steps, isMainOpen]);

  // Filter out any garbage steps
  const displaySteps = isLoading ? [] : steps.filter(s => {
    if (typeof s !== 'string') return false;
    const trimmed = s.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.toLowerCase().match(/^(thinking|analysis|\.+)$/)) return false;
    return true;
  });

  const parsedSteps = displaySteps.map((step, idx) => {
    // Match pattern: "1. **Title**: Content" or "1. Title: Content"
    const match = step.match(/^(\d+)\.\s*(?:\*\*)?([^:*]+)(?:\*\*)?:?\s*(.*)/);

    if (match) {
      const title = match[2]?.trim().replace(/^\*\*/, '').replace(/\*\*$/, '') || `Step ${match[1]}`;
      return {
        number: match[1],
        title: title,
        content: match[3]?.trim() || '',
        icon: getStepIcon(title)
      };
    }

    // Fallback for unstructured text
    const cleanedStep = step.replace(/^[0-9.]+\s*/, '').trim();
    const isTitleLike = step.length < 50 && !step.includes('. ');

    return {
      number: String(idx + 1),
      title: isTitleLike ? cleanedStep : 'Analysis',
      content: isTitleLike ? '' : cleanedStep,
      icon: <Brain className="w-3 h-3" />
    };
  });

  const isActivelyStreaming = isStreaming || isLoading;

  return (
    <div className="w-full max-w-full my-2 font-sans animate-in fade-in duration-300">
      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-gradient-to-b from-slate-50/50 to-white/80">

        {/* Header */}
        <button
          onClick={() => setIsMainOpen(!isMainOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg transition-colors ${isActivelyStreaming ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
              {isActivelyStreaming ? (
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              ) : (
                <Brain className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs font-medium text-slate-600">
              {isActivelyStreaming ? 'Reasoning...' : 'View reasoning'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && parsedSteps.length > 0 && !isActivelyStreaming && (
              <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                {parsedSteps.length} steps
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isMainOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Content */}
        {isMainOpen && (
          <div
            ref={contentRef}
            className="border-t border-slate-100 max-h-[280px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="px-4 py-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500">Analyzing your request...</span>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {parsedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="animate-in fade-in slide-in-from-left-1 duration-200 py-2 px-2.5 rounded-lg hover:bg-slate-50/50 transition-colors"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="flex gap-2.5 items-start">
                      {/* Step icon with subtle background */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100/80 flex items-center justify-center text-slate-500">
                        {step.icon}
                      </div>
                      {/* Step content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <span className="text-[13px] font-medium text-slate-700">{step.title}</span>
                        {step.content && (
                          <p className="text-[12px] text-slate-500 leading-relaxed mt-0.5">
                            {step.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streaming indicator */}
                {isStreaming && (
                  <div className="flex items-center gap-2 pl-9 pt-2 pb-1">
                    <span className="w-0.5 h-4 bg-amber-400 animate-pulse rounded-sm" />
                    <span className="text-[11px] text-slate-400 italic">Still thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
