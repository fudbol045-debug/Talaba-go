import React from 'react';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';
import { SERVICE_METADATA } from '../lib/i18n';
import {
  ArrowRight,
  BookmarkCheck,
  Bot,
  Briefcase,
  FileCheck2,
  FileText,
  FlaskConical,
  GraduationCap,
  Library,
  PenTool,
  Presentation,
  Sparkles,
} from 'lucide-react';

const ICONS_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  BookOpen: <FileCheck2 className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Presentation: <Presentation className="w-5 h-5" />,
  Library: <Library className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  BookmarkCheck: <BookmarkCheck className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
};

export const ServiceGrid: React.FC = () => {
  const { t, prices, openDocModal, openSlideModal, setActiveTab, setIsAiDrawerOpen } = useApp();

  const handleSelectService = (st: ServiceType) => {
    if (st === 'slayd') {
      openSlideModal();
    } else if (st === 'maruza') {
      setActiveTab('study');
    } else if (st === 'ai_yordamchi') {
      setIsAiDrawerOpen(true);
    } else {
      openDocModal(st);
    }
  };

  const servicesList: ServiceType[] = [
    'diplom',
    'kurs',
    'referat',
    'mustaqil',
    'slayd',
    'maruza',
    'laboratoriya',
    'amaliyot',
    'konspekt',
    'ai_yordamchi',
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              AI Akademik Xizmatlar
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Barcha ilmiy va o‘quv hujjatlarini tayyorlash
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Mavzuni kiritasiz — TalabaGO AI esa davlat ta’lim andozalari bo‘yicha to‘liq, xatosiz va tayyor shaklda yaratib beradi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((serviceKey) => {
            const meta = SERVICE_METADATA[serviceKey];
            const currentPrice = prices[serviceKey] ?? meta.defaultPrice;
            const isFree = currentPrice === 0;

            return (
              <div
                key={serviceKey}
                onClick={() => handleSelectService(serviceKey)}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {ICONS_MAP[meta.icon]}
                    </div>
                    {meta.badge && (
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/60 px-2.5 py-1 rounded-md">
                        {meta.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {t(meta.nameKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {t(meta.descKey)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Narxi</div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                      {isFree ? (
                        <span className="text-emerald-600 font-sans font-bold">Bepul</span>
                      ) : (
                        `${currentPrice.toLocaleString()} ${t('currency')}`
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-white group-hover:bg-indigo-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-indigo-600 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Tanlash</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
