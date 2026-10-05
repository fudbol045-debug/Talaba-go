import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Apple, Check, Globe, Mail, ShieldCheck, Sparkles, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    loginAs(emailInput.trim(), nameInput.trim() || undefined);
  };

  const handleGoogleLogin = () => {
    // 1-click Google Sign-in simulation with realistic user
    loginAs('azizbekshovqiddinov102@gmail.com', 'Azizbek Shovqiddinov');
  };

  const handleAppleLogin = () => {
    // 1-click Apple Sign-in simulation
    loginAs('apple.student@icloud.com', 'Talaba Apple User');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto p-6 sm:p-8">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-md shadow-indigo-600/20">
            TG
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            TalabaGO platformasiga kirish
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Har bir talabaga avtomatik noyob 8 xonali ID beriladi
          </p>
        </div>

        {/* 1-Click Social Sign-in Buttons */}
        <div className="space-y-2.5 mb-6">
          {/* Google Sign-in */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.64v3h3.86c2.26-2.09 3.685-5.17 3.685-9.08z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Google orqali 1 bosishda kirish</span>
          </button>

          {/* Apple Sign-in */}
          <button
            onClick={handleAppleLogin}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
          >
            <Apple className="w-4 h-4" />
            <span>Apple orqali 1 bosishda kirish</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider absolute">
            yoki Email orqali
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ismingiz (ixtiyoriy)
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Masalan: Sardor Aliyev"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email manzilingiz
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="talaba@university.uz"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Email orqali kirish</span>
          </button>
        </form>

        {/* Super Admin Quick Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => loginAs('azizbekshovqiddinov102@gmail.com', 'Azizbek Shovqiddinov (Super Admin)')}
            className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Super Admin (azizbekshovqiddinov102@gmail.com) sifatida kirish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
