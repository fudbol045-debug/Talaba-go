import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Check,
  Home as HomeIcon,
  MapPin,
  Plus,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

export const AddListingModal: React.FC = () => {
  const {
    isAddListingOpen,
    setIsAddListingOpen,
    addListingType,
    setAddListingType,
    addJob,
    addApartment,
  } = useApp();

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobWorkTime, setJobWorkTime] = useState('14:00 - 18:00 (Darsdan keyin)');
  const [jobCategory, setJobCategory] = useState('IT va Dasturlash');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobPhone, setJobPhone] = useState('+998 (90) ');
  const [jobTg, setJobTg] = useState('');
  const [jobAddress, setJobAddress] = useState('Toshkent sh., Yunusobod tumani');

  // Apartment form state
  const [aptTitle, setAptTitle] = useState('');
  const [aptPrice, setAptPrice] = useState('2 000 000 so‘m/oy');
  const [aptRooms, setAptRooms] = useState('2');
  const [aptArea, setAptArea] = useState('55');
  const [aptDistrict, setAptDistrict] = useState('Olmazor tumani');
  const [aptAddress, setAptAddress] = useState('Toshkent sh., Beruniy metrosi yaqinida');
  const [aptNearUni, setAptNearUni] = useState('O‘zMU va TATU');
  const [aptPhone, setAptPhone] = useState('+998 (90) ');
  const [aptTg, setAptTg] = useState('');
  const [aptFurniture, setAptFurniture] = useState('Wi-Fi, Kir yuvish mashinasi, Muzlatgich, Dars stoli');
  const [aptConditions, setAptConditions] = useState('Faqat talabalar uchun, tinchlik saqlash shart');

  if (!isAddListingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (addListingType === 'job') {
      addJob({
        title: jobTitle,
        company: jobCompany || 'Xususiy ish beruvchi',
        salary: jobSalary || 'Kelishilgan holda',
        workTime: jobWorkTime,
        category: jobCategory,
        description: jobDesc,
        requirements: jobReqs ? jobReqs.split(',').map((r) => r.trim()) : ['Mas’uliyatli bo‘lish'],
        contactPhone: jobPhone,
        telegramUsername: jobTg.replace('@', ''),
        location: {
          address: jobAddress,
          city: 'Toshkent',
          lat: 41.311081,
          lng: 69.240562,
        },
        images: [
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        ],
      });
    } else {
      addApartment({
        title: aptTitle,
        price: aptPrice,
        rooms: Number(aptRooms) || 1,
        area: Number(aptArea) || 40,
        district: aptDistrict,
        furniture: aptFurniture.split(',').map((f) => f.trim()),
        conditions: aptConditions.split(',').map((c) => c.trim()),
        contactPhone: aptPhone,
        telegramUsername: aptTg.replace('@', ''),
        location: {
          address: aptAddress,
          city: 'Toshkent',
          nearUniversity: aptNearUni,
          lat: 41.3531,
          lng: 69.2089,
        },
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
        ],
      });
    }

    setIsAddListingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Yangi e’lon joylashtirish
            </h2>
            <p className="text-xs text-slate-500">
              Talabalar uchun ish yoki kvartira e’lonini bering
            </p>
          </div>

          <button
            onClick={() => setIsAddListingOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="px-6 py-3 border-b border-slate-100 flex gap-2 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={() => setAddListingType('job')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              addListingType === 'job'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Ish vakansiyasi</span>
          </button>

          <button
            type="button"
            onClick={() => setAddListingType('apartment')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              addListingType === 'apartment'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Kvartira / Turar joy</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {addListingType === 'job' ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ish nomi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Masalan: Qahvaxonaga barista (yarim smena)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kompaniya / Korxona
                  </label>
                  <input
                    type="text"
                    value={jobCompany}
                    onChange={(e) => setJobCompany(e.target.value)}
                    placeholder="Masalan: Bean & Bloom Coffee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Maosh (so‘mda)
                  </label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="Masalan: 3 500 000 so‘m"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Ish vaqti / Smena
                  </label>
                  <input
                    type="text"
                    value={jobWorkTime}
                    onChange={(e) => setJobWorkTime(e.target.value)}
                    placeholder="14:00 - 18:00 (Darsdan keyin)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Soha / Kategoriya
                  </label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="IT va Dasturlash">IT va Dasturlash</option>
                    <option value="Ta’lim va Repetitorlik">Ta’lim va Repetitorlik</option>
                    <option value="Xizmat ko‘rsatish va Kafe">Xizmat ko‘rsatish va Kafe</option>
                    <option value="Marketing va Dizayn">Marketing va Dizayn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ish tavsifi
                </label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Vazifalar va qulayliklar haqida yozing..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Talablar (vergul bilan ajrating)
                </label>
                <input
                  type="text"
                  value={jobReqs}
                  onChange={(e) => setJobReqs(e.target.value)}
                  placeholder="Xushmuomala, Vaqtida kelish, Rus tilini bilish"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Google Maps lokatsiyasi va manzil
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={jobAddress}
                    onChange={(e) => setJobAddress(e.target.value)}
                    placeholder="Toshkent sh., Yunusobod 11-mavze"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Aloqa telefoni
                  </label>
                  <input
                    type="text"
                    value={jobPhone}
                    onChange={(e) => setJobPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Telegram username
                  </label>
                  <input
                    type="text"
                    value={jobTg}
                    onChange={(e) => setJobTg(e.target.value)}
                    placeholder="hr_manager"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Kvartira sarlavhasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  placeholder="Masalan: Beruniy metrosi va TATU yonida 2 xonali kvartira"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Narxi (oyiga)
                  </label>
                  <input
                    type="text"
                    value={aptPrice}
                    onChange={(e) => setAptPrice(e.target.value)}
                    placeholder="2 000 000 so‘m"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Xonalar soni
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={aptRooms}
                    onChange={(e) => setAptRooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Maydon (m²)
                  </label>
                  <input
                    type="number"
                    value={aptArea}
                    onChange={(e) => setAptArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tuman
                  </label>
                  <input
                    type="text"
                    value={aptDistrict}
                    onChange={(e) => setAptDistrict(e.target.value)}
                    placeholder="Olmazor tumani"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Qaysi OTMga yaqin
                  </label>
                  <input
                    type="text"
                    value={aptNearUni}
                    onChange={(e) => setAptNearUni(e.target.value)}
                    placeholder="O‘zMU va TATU"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Google Maps lokatsiyasi va to‘liq manzil
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={aptAddress}
                    onChange={(e) => setAptAddress(e.target.value)}
                    placeholder="Toshkent sh., Olmazor tumani, Universitet ko‘chasi"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mebel va jihozlar (vergul bilan)
                </label>
                <input
                  type="text"
                  value={aptFurniture}
                  onChange={(e) => setAptFurniture(e.target.value)}
                  placeholder="Wi-Fi, Muzlatgich, Kir yuvish mashinasi, Dars stollari"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ijara shartlari (vergul bilan)
                </label>
                <input
                  type="text"
                  value={aptConditions}
                  onChange={(e) => setAptConditions(e.target.value)}
                  placeholder="Faqat talabalar uchun, Shartnoma qilinadi, Tinchlik saqlash"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={aptPhone}
                    onChange={(e) => setAptPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Telegram username
                  </label>
                  <input
                    type="text"
                    value={aptTg}
                    onChange={(e) => setAptTg(e.target.value)}
                    placeholder="kvartira_egasi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>E’lonni joylashtirish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
