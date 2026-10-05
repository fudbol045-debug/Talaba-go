import React from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../lib/i18n';
import { Send, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, setLanguage, setActiveTab, openDocModal, openSlideModal, adminTelegram } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-md">
                TG
              </div>
              <span className="text-xl font-extrabold text-white font-display">
                Talaba<span className="text-indigo-400">GO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('app_slogan')} O‘zbekiston va xalqaro OTM talabalari uchun yaratilgan ko‘p tilli AI akademik ekotizim.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://t.me/${adminTelegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#24A1DE]" />
                <span>@{adminTelegram}</span>
              </a>
            </div>
          </div>

          {/* Col 2: AI Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              AI Ilmiy Xizmatlar
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => openDocModal('diplom')} className="hover:text-white transition-colors">
                  Diplom ishi tayyorlash
                </button>
              </li>
              <li>
                <button onClick={() => openDocModal('kurs')} className="hover:text-white transition-colors">
                  Kurs ishi
                </button>
              </li>
              <li>
                <button onClick={() => openDocModal('referat')} className="hover:text-white transition-colors">
                  Referat & Mustaqil ish
                </button>
              </li>
              <li>
                <button onClick={() => openSlideModal()} className="hover:text-white transition-colors">
                  Slayd / Prezentatsiya generator
                </button>
              </li>
              <li>
                <button onClick={() => openDocModal('laboratoriya')} className="hover:text-white transition-colors">
                  Laboratoriya & Amaliyot hisoboti
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Life & Housing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Talabalar hayoti
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('jobs')} className="hover:text-white transition-colors">
                  Darsdan keyingi yarim stavka ishlar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('housing')} className="hover:text-white transition-colors">
                  OTM yaqinidagi kvartiralar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('study')} className="hover:text-white transition-colors">
                  Ma’ruzalar va konspektlar
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-white transition-colors">
                  Shaxsiy talaba kabineti & Balans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: International Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Platforma tillari (6 ta til)
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-left px-2 py-1 rounded-md transition-colors ${
                    language === l.code ? 'text-indigo-400 font-bold bg-slate-800' : 'hover:text-white'
                  }`}
                >
                  <span className="mr-1.5">{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Super Admin: azizbekshovqiddinov102@gmail.com
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 TalabaGO. Barcha huquqlar himoyalangan.</div>
          <div className="text-[11px] text-slate-400">
            “Talabalar uchun hammasi bir joyda.”
          </div>
        </div>
      </div>
    </footer>
  );
};
