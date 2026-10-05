import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../lib/i18n';
import {
  Bell,
  Check,
  ChevronDown,
  Copy,
  Globe,
  Plus,
  ShieldCheck,
  User as UserIcon,
  Wallet,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    setIsTopUpOpen,
    setIsProfileOpen,
    setIsAuthModalOpen,
    notifications,
    markNotificationAsRead,
    openDocModal,
    setIsAiDrawerOpen,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-xl sm:text-2xl tracking-tighter">
              TG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight font-display">
                  Talaba<span className="text-indigo-600">GO</span>
                </span>
                <span className="hidden lg:inline text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  AI Platform
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                {t('app_slogan')}
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => setActiveTab('study')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'study'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav_study')}
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav_jobs')}
            </button>
            <button
              onClick={() => setActiveTab('housing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'housing'
                  ? 'bg-slate-100 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('nav_housing')}
            </button>

            {user?.role === 'superadmin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                {t('nav_admin')}
              </button>
            )}
          </nav>

          {/* Right Action Tools: Language, Balance, ID, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                title="Tilni tanlash / Выбор языка"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsLangOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Sayt tili / Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        language === lang.code ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        {lang.name}
                      </span>
                      {language === lang.code && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* 8-Digit ID Badge (Click to copy) */}
                <button
                  onClick={copyId}
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-xs font-mono font-medium text-slate-700 transition-colors group"
                  title="8 xonali ID (nusxa olish uchun bosing)"
                >
                  <span className="text-slate-400 font-sans text-[11px]">ID:</span>
                  <span className="font-semibold text-slate-900">{user.id}</span>
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  )}
                </button>

                {/* Balance & Top Up */}
                <div className="flex items-center bg-emerald-50 border border-emerald-200/80 rounded-lg p-0.5 sm:p-1">
                  <button
                    onClick={() => setIsTopUpOpen(true)}
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900"
                    title="Hisobni to‘ldirish"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-mono tabular-nums">{user.balance.toLocaleString()}</span>
                    <span className="text-[11px] font-normal text-emerald-700">{t('currency')}</span>
                  </button>
                  <button
                    onClick={() => setIsTopUpOpen(true)}
                    className="p-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Hisobni to‘ldirish (+)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                    title="Bildirishnomalar"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                        <div className="font-semibold text-sm text-slate-900">Bildirishnomalar</div>
                        <span className="text-xs text-slate-500">{notifications.length} ta xabar</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-xs text-slate-400">Yangi xabarlar yo‘q</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationAsRead(n.id)}
                              className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                                n.read
                                  ? 'bg-white border-slate-100 text-slate-600'
                                  : 'bg-indigo-50/60 border-indigo-100 text-slate-900'
                              }`}
                            >
                              <div className="flex items-center justify-between font-semibold mb-1">
                                <span>{n.title}</span>
                                <span className="text-[10px] text-slate-400">{n.time}</span>
                              </div>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar / Cabinet */}
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('btn_login')}</span>
              </button>
            )}

            {/* Quick Action: Create Doc */}
            <button
              onClick={() => openDocModal('diplom')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>{t('btn_start')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
