import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApartmentListing } from '../types';
import { getGoogleMapsUrl } from '../lib/exportUtils';
import {
  Bookmark,
  Check,
  CheckCircle2,
  ExternalLink,
  Home as HomeIcon,
  MapPin,
  Maximize2,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Wifi,
  X,
} from 'lucide-react';

export const ApartmentBoard: React.FC = () => {
  const { apartments, savedApartments, toggleSaveApartment, setIsAddListingOpen, setAddListingType } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedApt, setSelectedApt] = useState<ApartmentListing | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const districts = ['all', 'Olmazor tumani', 'Chilonzor tumani', 'Yunusobod tumani', 'Mirzo Ulug‘bek tumani'];

  const filteredApartments = apartments.filter((apt) => {
    const matchesSearch =
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.location.nearUniversity && apt.location.nearUniversity.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDist = selectedDistrict === 'all' || apt.district === selectedDistrict;
    return matchesSearch && matchesDist;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Talabalar turar joyi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              OTMlar yaqinidagi qulay kvartiralar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Wi-Fi, dars qilish uchun sharoitlar, kir yuvish mashinasi va mebelli ijaralar
            </p>
          </div>

          <button
            onClick={() => {
              setAddListingType('apartment');
              setIsAddListingOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-600/20 self-start md:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Kvartira e’loni berish</span>
          </button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Universitet, metro yoki tuman bo‘yicha qidirish (masalan: O‘zMU, Beruniy)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {districts.map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                  selectedDistrict === dist
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dist === 'all' ? 'Barcha tumanlar' : dist}
              </button>
            ))}
          </div>
        </div>

        {/* Apartment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApartments.map((apt) => {
            const isSaved = savedApartments.includes(apt.id);

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Gallery (5-6 realistic photos) */}
                  <div className="relative h-56 bg-slate-900 group">
                    <img
                      src={apt.images[0]}
                      alt={apt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                      <span>{apt.images.length} ta rasm</span>
                    </div>

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-600 text-white text-[11px] font-bold">
                      {apt.rooms} xonali · {apt.area} m²
                    </div>

                    <button
                      onClick={() => toggleSaveApartment(apt.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved ? 'bg-amber-600 text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isSaved ? 'Saqlanganlardan o‘chirish' : 'Saqlash'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="text-xs font-semibold text-amber-700 mb-1">
                      {apt.district} {apt.location.nearUniversity && `· ${apt.location.nearUniversity} yonida`}
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {apt.title}
                    </h2>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{apt.location.address}</span>
                    </div>

                    {/* Furniture Highlights */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {apt.furniture.slice(0, 3).map((f, fI) => (
                        <span key={fI} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {f}
                        </span>
                      ))}
                      {apt.furniture.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                          +{apt.furniture.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Price & Details */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Ijara narxi</div>
                    <div className="text-sm font-extrabold text-amber-800 font-mono">
                      {apt.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={getGoogleMapsUrl(apt.location.lat, apt.location.lng, apt.location.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs transition-colors"
                      title="Google Maps"
                    >
                      <MapPin className="w-4 h-4 text-rose-500" />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedApt(apt);
                        setActiveImageIndex(0);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      Batafsil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Apartment Details & Gallery */}
        {selectedApt && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              {/* Carousel */}
              <div className="relative h-64 sm:h-80 bg-slate-900 shrink-0">
                <img
                  src={selectedApt.images[activeImageIndex]}
                  alt={selectedApt.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
                  {selectedApt.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-white/50 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedApt(null)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      {selectedApt.district}
                    </span>
                    <span className="text-base font-extrabold text-amber-800 font-mono">
                      {selectedApt.price}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {selectedApt.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{selectedApt.location.address}</span>
                  </p>
                </div>

                {/* Characteristics */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">Xonalar</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{selectedApt.rooms} xona</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Umumiy maydon</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{selectedApt.area} m²</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">OTMga yaqinlik</div>
                    <div className="text-base font-bold text-amber-700 mt-0.5 truncate px-1">
                      {selectedApt.location.nearUniversity || 'Yaqin'}
                    </div>
                  </div>
                </div>

                {/* Furniture and Amenities */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                    Mavjud mebel va maishiy texnikalar
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedApt.furniture.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-700 flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rental Conditions */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Ijara shartlari va talablar
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {selectedApt.conditions.map((cond, cI) => (
                      <li key={cI} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Google Maps Card */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-rose-500 flex items-center justify-center font-bold shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Google Maps Lokatsiya</div>
                      <div className="text-[11px] text-slate-500">{selectedApt.location.address}</div>
                    </div>
                  </div>

                  <a
                    href={getGoogleMapsUrl(selectedApt.location.lat, selectedApt.location.lng, selectedApt.location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Google Maps’da ochish</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>

                {/* Contacts */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`tel:${selectedApt.contactPhone}`}
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Qo‘ng‘iroq: {selectedApt.contactPhone}</span>
                  </a>

                  <a
                    href={`https://t.me/${selectedApt.telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/2 py-3 rounded-xl bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram: @{selectedApt.telegramUsername}</span>
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
