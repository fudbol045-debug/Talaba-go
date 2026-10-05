import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeneratedPresentation, Language, SlideItem } from '../types';
import { exportToPptx } from '../lib/exportUtils';
import { LANGUAGES } from '../lib/i18n';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Layout,
  Maximize2,
  Presentation,
  Sparkles,
  Volume2,
  Wallet,
  X,
} from 'lucide-react';

export const SlideGeneratorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    user,
    language: appLanguage,
    t,
    prices,
    addPresentation,
    updateUserBalance,
    setIsTopUpOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState<number>(10);
  const [designStyle, setDesignStyle] = useState<'Minimal' | 'Professional' | 'Universitet' | 'Business' | 'Modern'>('Professional');
  const [slideLang, setSlideLang] = useState<Language>(appLanguage);
  const [outline, setOutline] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedPres, setGeneratedPres] = useState<GeneratedPresentation | null>(null);

  // Presentation interactive player state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  if (!isOpen) return null;

  const price = prices.slayd ?? 20000;
  const userBalance = user?.balance ?? 0;
  const canAfford = userBalance >= price;

  const countOptions = [5, 10, 15, 20, 30];
  const styleOptions: ('Minimal' | 'Professional' | 'Universitet' | 'Business' | 'Modern')[] = [
    'Minimal',
    'Professional',
    'Universitet',
    'Business',
    'Modern',
  ];

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('Iltimos, taqdimot mavzusini kiriting');
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!canAfford) {
      setErrorMessage(t('insufficient_balance'));
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);
    setProgress(5);
    setStatusText(t('step_0'));

    if (price > 0) {
      updateUserBalance(user.id, -price, `SLAYD GENERATOR: "${topic.slice(0, 30)}..."`);
    }

    const t1 = setTimeout(() => {
      setProgress(25);
      setStatusText('Slaydlar rejasi va vizual konsepsiya tuzilmoqda (25%)...');
    }, 1500);

    const t2 = setTimeout(() => {
      setProgress(60);
      setStatusText('Tezislar va diagrammalar tanlanmoqda (60%)...');
    }, 3500);

    const t3 = setTimeout(() => {
      setProgress(85);
      setStatusText('Spiker nutqi va slayd dizaynlari yakunlanmoqda (85%)...');
    }, 5500);

    try {
      const response = await fetch('/api/ai/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          slideCount,
          designStyle,
          language: slideLang,
          contentOutline: outline,
        }),
      });

      const resData = await response.json();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Slayd generatsiyasida xatolik');
      }

      setProgress(100);
      setStatusText(t('step_100'));

      const newPres: GeneratedPresentation = {
        id: `pres-${Date.now()}`,
        userId: user.id,
        topic,
        style: designStyle,
        slideCount,
        language: slideLang,
        createdAt: new Date().toISOString(),
        price,
        slides: resData.data.slides || [],
      };

      setGeneratedPres(newPres);
      addPresentation(newPres);
      setCurrentSlideIndex(0);
    } catch (err: any) {
      console.error(err);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (price > 0) {
        updateUserBalance(user.id, price, `Qaytarildi (Xatolik tufayli): Slayd - ${topic.slice(0, 20)}`);
      }
      setErrorMessage(err.message || 'Slayd generatsiyasida uzilish bo‘ldi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSlide: SlideItem | undefined = generatedPres?.slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                {t('service_slayd_title')}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>PPTX / PDF</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">
                  {price === 0 ? 'Bepul' : `${price.toLocaleString()} ${t('currency')}`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!generatedPres && !isGenerating && (
            <form onSubmit={handleStartGeneration} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Taqdimot mavzusi yoki matni <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Masalan: Raqamli iqtisodiyotda fintech startaplar va xavflar tahlili"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Slide Count Buttons: 5 / 10 / 15 / 20 / 30 */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Slaydlar soni
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {countOptions.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSlideCount(cnt)}
                      className={`py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                        slideCount === cnt
                          ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cnt} ta
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Style: Minimal, Professional, Universitet, Business, Modern */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dizayn uslubi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {styleOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDesignStyle(st)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        designStyle === st
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Slayd tili
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSlideLang(l.code)}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        slideLang === l.code
                          ? 'bg-sky-50 border-sky-600 text-sky-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        {l.name}
                      </span>
                      {slideLang === l.code && <CheckCircle className="w-4 h-4 text-sky-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra outline notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Qo‘shimcha fikrlar yoki reja (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  placeholder="Masalan: 3-slayd O‘zbekiston statistikasiga bag‘ishlansin"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Price & Balance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Balansingiz:</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {userBalance.toLocaleString()} {t('currency')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Narxi:</div>
                    <div className="text-base font-extrabold text-sky-600 font-mono">
                      {price.toLocaleString()} {t('currency')}
                    </div>
                  </div>

                  {!canAfford && (
                    <button
                      type="button"
                      onClick={() => setIsTopUpOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      {t('btn_topup')}
                    </button>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!canAfford}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  canAfford
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{canAfford ? 'Slaydlarni generatsiya qilish' : 'Balansni to‘ldirish talab etiladi'}</span>
              </button>
            </form>
          )}

          {/* Progress */}
          {isGenerating && (
            <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-sky-600 border-t-transparent animate-spin"
                  style={{ animationDuration: '1.2s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm text-sky-700 font-mono">
                  {progress}%
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Slaydlar tayyorlanmoqda...</h3>
                <p className="text-xs sm:text-sm text-sky-600 font-medium mt-1">{statusText}</p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400">
                Har bir slaydda ortiqcha matnsiz qisqa va aniq ma’lumotlar joylashtirilmoqda...
              </div>
            </div>
          )}

          {/* Interactive Presentation Deck Viewer */}
          {generatedPres && currentSlide && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Slayd: {currentSlideIndex + 1} / {generatedPres.slides.length}
                  </span>
                  <button
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      showSpeakerNotes ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Nutq eslatmasi
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToPptx(generatedPres)}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('btn_download_pptx')}</span>
                  </button>
                </div>
              </div>

              {/* Main Slide Canvas */}
              <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-12 shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-700">
                {/* Subtle visual elements based on style */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      {generatedPres.topic} · {generatedPres.style}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      0{currentSlide.slideNumber}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {currentSlide.title}
                  </h2>
                  {currentSlide.subtitle && (
                    <p className="text-xs sm:text-sm text-sky-200 mt-1 font-medium">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                <div className="my-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  <ul className="md:col-span-3 space-y-2.5 text-xs sm:text-base text-slate-200">
                    {currentSlide.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs text-sky-300">
                    <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-sky-400" />
                      <span>Vizual tavsiya</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {currentSlide.visualDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
                  <span>TalabaGO AI Slide Deck</span>
                  <span>Sahifa {currentSlideIndex + 1} / {generatedPres.slides.length}</span>
                </div>
              </div>

              {/* Speaker Notes */}
              {showSpeakerNotes && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Taqdimotchi nutqi (Speaker notes):</strong> {currentSlide.speakerNotes}
                </div>
              )}

              {/* Navigation arrows & slide thumbs */}
              <div className="flex items-center justify-between gap-4">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi</span>
                </button>

                <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-[200px] sm:max-w-md">
                  {generatedPres.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                        currentSlideIndex === idx
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentSlideIndex === generatedPres.slides.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(generatedPres.slides.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Keyingi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
