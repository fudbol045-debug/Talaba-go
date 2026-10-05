import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Briefcase,
  Home,
  Plus,
  Sparkles,
  User,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openDocModal, setIsProfileOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Bosh sahifa</span>
      </button>

      <button
        onClick={() => setActiveTab('study')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'study' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">O‘qish</span>
      </button>

      {/* Center Action: Yaratish */}
      <button
        onClick={() => openDocModal('diplom')}
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-indigo-700 mt-0.5">Yaratish</span>
      </button>

      <button
        onClick={() => setActiveTab('jobs')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activeTab === 'jobs' || activeTab === 'housing'
            ? 'text-indigo-600 font-bold'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Ish / Uy</span>
      </button>

      <button
        onClick={() => setIsProfileOpen(true)}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profil</span>
      </button>
    </div>
  );
};
