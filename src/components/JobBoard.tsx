import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobListing } from '../types';
import { getGoogleMapsUrl } from '../lib/exportUtils';
import {
  Bookmark,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  Phone,
  Plus,
  Search,
  Send,
  Share2,
  X,
} from 'lucide-react';

export const JobBoard: React.FC = () => {
  const { jobs, savedJobs, toggleSaveJob, setIsAddListingOpen, setAddListingType } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = [
    'all',
    'IT va Dasturlash',
    'Ta’lim va Repetitorlik',
    'Xizmat ko‘rsatish va Kafe',
    'Marketing va Dizayn',
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Talabalar bandligi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Talabalar uchun moslashuvchan ishlar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Darsdan keyingi smenalar, masofaviy ishlar va OTMlar yaqinidagi vakansiyalar
            </p>
          </div>

          <button
            onClick={() => {
              setAddListingType('job');
              setIsAddListingOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/20 self-start md:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ish e’loni berish</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ish nomi, kompaniya yoki soha bo‘yicha qidirish..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Barcha sohalar' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Gallery Grid (Top 5-6 photos) */}
                  <div className="relative h-56 sm:h-64 bg-slate-900 group">
                    <img
                      src={job.images[0]}
                      alt={job.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                      <span>{job.images.length} ta rasm</span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isSaved ? 'Saqlanganlardan o‘chirish' : 'Saqlab qo‘yish'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {job.category}
                      </span>
                      <span>{job.createdAt}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {job.title}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {job.company}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{job.workTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{job.location.address}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Requirements preview */}
                    <div className="mt-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Talablar:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requirements.slice(0, 3).map((req, rI) => (
                          <span
                            key={rI}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Bar: Salary & Actions */}
                <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Maosh</div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-700 font-mono">
                      {job.salary}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getGoogleMapsUrl(job.location.lat, job.location.lng, job.location.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs transition-colors"
                      title="Google Maps xaritada ko‘rish"
                    >
                      <MapPin className="w-4 h-4 text-rose-500" />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveImageIndex(0);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      Batafsil / Bog‘lanish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Job Detail & Gallery Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              {/* Image Carousel */}
              <div className="relative h-64 sm:h-80 bg-slate-900 shrink-0">
                <img
                  src={selectedJob.images[activeImageIndex]}
                  alt={selectedJob.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Thumbs */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
                  {selectedJob.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-white/50 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {selectedJob.category}
                    </span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {selectedJob.salary}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {selectedJob.company}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400">Ish vaqti:</span>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedJob.workTime}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Manzil:</span>
                    <div className="font-bold text-slate-800 mt-0.5">{selectedJob.location.address}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Ish haqida batafsil ma’lumot
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nomzodga qo‘yilgan talablar
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Google Maps Embed / Link Card */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-rose-500 flex items-center justify-center font-bold shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Google Maps Lokatsiya</div>
                      <div className="text-[11px] text-slate-500">{selectedJob.location.address}</div>
                    </div>
                  </div>

                  <a
                    href={getGoogleMapsUrl(selectedJob.location.lat, selectedJob.location.lng, selectedJob.location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Google Maps’da ochish</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>

                {/* Contact Actions */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`tel:${selectedJob.contactPhone}`}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Qo‘ng‘iroq: {selectedJob.contactPhone}</span>
                  </a>

                  <a
                    href={`https://t.me/${selectedJob.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram: @{selectedJob.telegramUsername}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
