import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceGrid } from './components/ServiceGrid';
import { JobBoard } from './components/JobBoard';
import { ApartmentBoard } from './components/ApartmentBoard';
import { LectureLibrary } from './components/LectureLibrary';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { DocumentGeneratorModal } from './components/DocumentGeneratorModal';
import { SlideGeneratorModal } from './components/SlideGeneratorModal';
import { TopUpBalanceModal } from './components/TopUpBalanceModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { AddListingModal } from './components/AddListingModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import {
  ArrowRight,
  Bot,
  Briefcase,
  FileCheck2,
  GraduationCap,
  Home,
  Presentation,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openDocModal,
    openSlideModal,
    isSlideModalOpen,
    closeSlideModal,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    user,
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <ServiceGrid />

            {/* Featured Dual Section: Jobs & Apartments Preview */}
            <section className="py-12 sm:py-16 bg-slate-100/70 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Student Jobs Preview Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                        Talabalar uchun moslashuvchan ishlar
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        O‘qishingizga xalaqit bermaydigan darsdan keyingi smenalar, IT junior dasturchilik, repetitorlik va frilans vakansiyalar.
                      </p>

                      <div className="mt-6 space-y-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">Junior Frontend Dasturchi</span>
                          <span className="text-emerald-700 font-bold font-mono">4.5M — 6M so‘m</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">Ingliz tili repetitori</span>
                          <span className="text-emerald-700 font-bold font-mono">3.5M — 7M so‘m</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Google Maps koordinatalari bilan</span>
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Barcha ishlarni ko‘rish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Student Housing Preview Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                        <Home className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                        OTMlar yaqinidagi arzon va qulay kvartiralar
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        Toshkent, Samarqand va boshqa talabalar shaharchalaridagi mebelli, Wi-Fi va maishiy texnikali shinam xonadonlar.
                      </p>

                      <div className="mt-6 space-y-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">Beruniy (O‘zMU va TATU yaqinida)</span>
                          <span className="text-amber-800 font-bold font-mono">2.2M so‘m/oy</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">Chilonzor metrosiga yaqin 3 xonali</span>
                          <span className="text-amber-800 font-bold font-mono">3.6M so‘m/oy</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">5-6 ta rasm va xarita bilan</span>
                      <button
                        onClick={() => setActiveTab('housing')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Kvartira qidirish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* STUDY TAB */}
        {activeTab === 'study' && (
          <div>
            <div className="bg-white border-b border-slate-200 py-6 px-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    O‘quv va Ilmiy Tadqiqotlar Bo‘limi
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Diplom ishlari, kurs ishlari, referatlar, slaydlar va to‘liq ma’ruzalar
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openDocModal('diplom')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                  >
                    + Hujjat generatsiya qilish
                  </button>
                </div>
              </div>
            </div>
            <LectureLibrary />
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && <JobBoard />}

        {/* HOUSING TAB */}
        {activeTab === 'housing' && <ApartmentBoard />}

        {/* SUPER ADMIN TAB */}
        {activeTab === 'admin' && <SuperAdminDashboard />}
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <button
        onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        title="TalabaGO AI Yordamchi"
      >
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:inline">AI Yordamchi</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Global Modals */}
      <DocumentGeneratorModal />
      <SlideGeneratorModal isOpen={isSlideModalOpen} onClose={closeSlideModal} />
      <TopUpBalanceModal />
      <UserProfileModal />
      <AuthModal />
      <AddListingModal />
      <AiAssistantDrawer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Desktop & Mobile Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
