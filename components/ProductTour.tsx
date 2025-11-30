
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface TourStep {
  targetId: string | null; // null for center modal
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface ProductTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ steps, isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const currentStep = steps[currentStepIndex];

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate Target Position with Polling
  useEffect(() => {
    if (!isOpen) return;

    let intervalId: any;
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // Poll for up to 1 second

    const findTarget = () => {
      if (currentStep.targetId) {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
          // Found it!
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
          return true; // Found
        } else {
          // Not found yet
          setTargetRect(null);
          return false;
        }
      } else {
        // Center modal (no target)
        setTargetRect(null);
        return true; // "Found" implies logic is done
      }
    };

    // Initial check
    if (!findTarget()) {
      // If not found, start polling to catch late renders (animations/page switches)
      intervalId = setInterval(() => {
        attempts++;
        if (findTarget() || attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalId);
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentStepIndex, isOpen, windowSize]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  // Tooltip Positioning Logic
  const getTooltipStyle = () => {
    if (!targetRect || !currentStep.targetId) {
      // Center position
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const gap = 20;
    // Approx max width of tooltip
    
    let top = 0;
    let left = 0;
    let transform = '';

    switch (currentStep.position) {
      case 'top':
        top = targetRect.top - gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, 0)';
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - gap;
        transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + gap;
        transform = 'translate(0, -50%)';
        break;
      default: // bottom default
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, 0)';
    }

    // Boundary checks to prevent overflow off-screen
    // Left boundary
    if (left < 160) { 
        left = 170; 
        // Respect vertical alignment even when clamped horizontally
        if (currentStep.position === 'top') {
             transform = 'translate(-50%, -100%)';
        } else if (currentStep.position === 'bottom') {
             transform = 'translate(-50%, 0)';
        } else {
             // For left/right original intents that are clamped
             transform = 'translate(0, -50%)';
        }
    } 
    
    // Right boundary
    if (left + 160 > windowSize.width) {
        left = windowSize.width - 170;
        if (currentStep.position === 'top') {
             transform = 'translate(-50%, -100%)';
        } else if (currentStep.position === 'bottom') {
             transform = 'translate(-50%, 0)';
        } else {
             transform = 'translate(-100%, -50%)';
        }
    }

    return { top, left, transform };
  };

  const tooltipStyle = getTooltipStyle();

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* SVG Overlay for Spotlight Effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out">
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 5}
                y={targetRect.top - 5}
                width={targetRect.width + 10}
                height={targetRect.height + 10}
                rx="8"
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#tour-mask)"
        />
        {/* Glowing border around target */}
        {targetRect && (
            <rect
                x={targetRect.left - 5}
                y={targetRect.top - 5}
                width={targetRect.width + 10}
                height={targetRect.height + 10}
                rx="8"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                className="animate-pulse transition-all duration-300 ease-out"
            />
        )}
      </svg>

      {/* Tooltip Card */}
      <div
        className="absolute w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300 transition-all ease-out"
        style={tooltipStyle as React.CSSProperties}
      >
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {currentStepIndex === 0 ? 'Welcome' : `Step ${currentStepIndex + 1} of ${steps.length}`}
                </span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{currentStep.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
                {currentStep.content}
            </p>
        </div>

        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-50">
            {/* Skip Button */}
            <div className="w-12">
                {currentStepIndex < steps.length - 1 && (
                    <button 
                        onClick={onComplete}
                        className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Skip
                    </button>
                )}
            </div>

            {/* Progress Dots */}
            <div className="flex gap-1">
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200'}`}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 justify-end w-auto">
                {currentStepIndex > 0 && (
                    <button 
                        onClick={handlePrev}
                        className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Back
                    </button>
                )}
                <button 
                    onClick={handleNext}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition-all shadow-md flex items-center gap-1"
                >
                    {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                    {currentStepIndex < steps.length - 1 && <ChevronRight className="w-3 h-3" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
