import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Home as HomeIcon,
  Presentation,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, openDocModal, openSlideModal, setActiveTab } = useApp();
  const [quickTopic, setQuickTopic] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType>('diplom');

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService === 'slayd') {
      openSlideModal();
    } else {
      openDocModal(selectedService);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-12 sm:pt-14 sm:pb-20">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/30 via-sky-100/40 to-blue-200/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Editorial Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 border border-indigo-200/70 text-indigo-800 text-xs font-semibold mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>TALABAGO AI 2026 — AKADEMIK STANDARTLAR</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance font-display">
            {t('hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('hero_subtitle')}
          </p>

          {/* Fast Topic Input Box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleQuickStart}
              className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 flex flex-col sm:flex-row items-stretch gap-2"
            >
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={quickTopic}
                  onChange={(e) => setQuickTopic(e.target.value)}
                  placeholder={t('modal_topic_placeholder')}
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 justify-between sm:justify-start">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as ServiceType)}
                  aria-label="Tanlangan ilmiy xizmat"
                  className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  <option value="diplom">Diplom ishi</option>
                  <option value="kurs">Kurs ishi</option>
                  <option value="referat">Referat</option>
                  <option value="mustaqil">Mustaqil ish</option>
                  <option value="slayd">Slayd / Prezentatsiya</option>
                  <option value="laboratoriya">Laboratoriya ishi</option>
                  <option value="amaliyot">Amaliyot hisoboti</option>
                  <option value="konspekt">Konspekt</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Zap className="w-4 h-4" />
                  <span>Tayyorlash</span>
                </button>
              </div>
            </form>

            {/* Quick Suggestions */}
            <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Ommabop mavzular:</span>
              <button
                type="button"
                onClick={() => {
                  setQuickTopic('Sun’iy intellektning bank sohasidagi o‘rni');
                  setSelectedService('diplom');
                }}
                className="hover:text-indigo-600 hover:underline"
              >
                Bankda AI
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setQuickTopic('O‘zbekistonda yashil iqtisodiyotga o‘tish istiqbollari');
                  setSelectedService('kurs');
                }}
                className="hover:text-indigo-600 hover:underline"
              >
                Yashil iqtisodiyot
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setQuickTopic('Kvant hisoblash texnologiyalari va kiberxavfsizlik');
                  setSelectedService('slayd');
                }}
                className="hover:text-indigo-600 hover:underline"
              >
                Kvant hisoblash (Slayd)
              </button>
            </div>
          </div>

          {/* Quick Pillars: Jobs, Housing, Fast Delivery */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div
              onClick={() => openDocModal('diplom')}
              className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Diplom & Kurs ishi</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Tituldan adabiyotlargacha to‘liq</p>
            </div>

            <div
              onClick={() => openSlideModal()}
              className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Presentation className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Slayd Generator</div>
              <p className="text-[11px] text-slate-500 mt-0.5">5 dan 30 tagacha zamonaviy PPT</p>
            </div>

            <div
              onClick={() => setActiveTab('jobs')}
              className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Ish topish</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Darsdan keyingi yarim stavka</p>
            </div>

            <div
              onClick={() => setActiveTab('housing')}
              className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <HomeIcon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Talaba kvartirasi</div>
              <p className="text-[11px] text-slate-500 mt-0.5">OTM yaqinidagi qulay xonadonlar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
