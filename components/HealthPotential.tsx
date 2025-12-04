
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

export const HealthPotential: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-[1400px] mx-auto px-20 py-20 lg:py-24 bg-white">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-16 items-start">
        <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-slate-900">
          {t('Unlock your Global')} <br className="hidden lg:block" /> {t('Health Potential')}
        </h1>
        <div className="max-w-xl">
          <h2 className="text-xl font-medium text-slate-900 mb-4 tracking-tight">
            {t('Know more. Choose better. Heal faster.')}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-normal">
            {t('Access expert care from 50+ trusted specialists across multiple medical fields, all delivering global-standard treatment you can trust.')}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        
        {/* Card 1 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Image */}
            <img src="/assets/images/health-1.svg" alt="Health Analysis" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">{t('Discover Your Options')}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('Explore 1,000+ hospitals and specialists, and the best treatment for your specific condition, globally.')}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Image */}
            <img src="/assets/images/health-2.svg" alt="Health Analysis" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">{t('Compare Experts & Costs with AI')}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('Get personalized insights and treatment matches based on your lifestyle & health goals — instantly.')}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Image */}
            <img src="/assets/images/health-3.svg" alt="Health Analysis" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">{t('Speak directly with doctors')}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('Connect with real doctors ready to answer your questions and craft your personalised care plan.')}
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col group cursor-default">
          <div className="relative w-full aspect-[4/5] bg-[#005f8f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Background Image */}
            <img src="/assets/images/health-4.svg" alt="Health Analysis" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="mt-6 pr-2">
            <h3 className="text-lg font-medium text-slate-900 tracking-tight">{t('Plan your full care journey safe')}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {t('Finalize treatment, travel, and recovery with Medifly — everything under one roof.')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
