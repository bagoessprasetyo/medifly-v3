
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export const Mission: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 px-6 md:px-12 overflow-hidden bg-[#FBFBF9] text-slate-900">
        
        {/* Subtle Background Gradient for Depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                
                {/* Headline Column */}
                <div className="lg:col-span-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] text-[#1a1a1a]">
                        {t('We’re on a mission to make global healthcare accessible for everyone')}
                    </h2>
                </div>

                {/* Body Text Column */}
                <div className="lg:col-span-7 flex flex-col justify-center pt-2 lg:pt-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
                    <div className="prose prose-lg prose-slate max-w-none">
                        <p className="text-lg md:text-xl text-[#4a4a4a] leading-relaxed font-normal">
                            {t('Everyone deserves access to trusted, high-quality care — no matter where they live. Medifly connects patients with accredited hospitals and specialists across the globe, making it simple to explore treatment options with confidence.')} 
                        </p>
                        <p className="text-lg md:text-xl text-[#4a4a4a] leading-relaxed font-normal mt-6">
                            {t('We’re your partner in navigating global healthcare. From comparing experts to organizing care abroad, Medifly makes the journey to better health transparent, safe, and effortless.')}
                        </p>
                    </div>

                    {/* Optional Decorative Element / Call to Action Hint */}
                    <div className="mt-10 flex items-center gap-2 group cursor-pointer w-fit">
                        <span className="text-sm font-medium text-[#1a1a1a] border-b border-[#1a1a1a]/20 group-hover:border-[#1a1a1a] transition-colors duration-300 pb-0.5">{t('Learn about our approach')}</span>
                        <ArrowRight className="w-4 h-4 text-[#1a1a1a] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>

            </div>
        </div>

    </section>
  );
};
