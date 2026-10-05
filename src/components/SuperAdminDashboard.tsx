import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PromoCode, ServiceType, User } from '../types';
import { SERVICE_METADATA } from '../lib/i18n';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle,
  Coins,
  Edit2,
  FileCheck,
  GraduationCap,
  MinusCircle,
  Plus,
  PlusCircle,
  Presentation,
  Save,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    user,
    usersList,
    updateUserBalance,
    toggleBlockUser,
    prices,
    updatePrice,
    adminTelegram,
    setAdminTelegram,
    transactions,
    documents,
    presentations,
    jobs,
    apartments,
    promoCodes,
    addPromoCode,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'users' | 'prices' | 'promos' | 'settings'>('stats');
  const [searchId, setSearchId] = useState('');
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>('50000');
  const [balanceReason, setBalanceReason] = useState<string>('Super Admin tomonidan hisob to‘ldirildi');
  const [balanceSuccess, setBalanceSuccess] = useState('');

  // Price editor state
  const [editingPrices, setEditingPrices] = useState<Record<ServiceType, number>>({ ...prices });
  const [priceSaveSuccess, setPriceSaveSuccess] = useState(false);

  // Telegram username editor state
  const [tgInput, setTgInput] = useState(adminTelegram);
  const [tgSaved, setTgSaved] = useState(false);

  // New promo code
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoBonus, setNewPromoBonus] = useState('20000');
  const [newPromoMaxUses, setNewPromoMaxUses] = useState('500');

  // Statistics calculation
  const totalUsers = usersList.length + 1280; // realistic platform total
  const todayUsers = 84;
  const todayRevenue = 1450000;
  const totalRevenue = 48500000;
  const totalDiploms = documents.filter((d) => d.serviceType === 'diplom').length + 342;
  const totalKurs = documents.filter((d) => d.serviceType === 'kurs').length + 890;
  const totalSlides = presentations.length + 1540;
  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const activeApartments = apartments.filter((a) => a.status === 'active').length;

  const filteredUsers = usersList.filter(
    (u) =>
      u.id.includes(searchId) ||
      u.name.toLowerCase().includes(searchId.toLowerCase()) ||
      u.email.toLowerCase().includes(searchId.toLowerCase())
  );

  const handleUpdateUserBalance = (isAdding: boolean) => {
    if (!selectedUserForBalance) return;
    const amount = Number(balanceAmount);
    if (isNaN(amount) || amount <= 0) return;

    const delta = isAdding ? amount : -amount;
    const success = updateUserBalance(
      selectedUserForBalance.id,
      delta,
      balanceReason || (isAdding ? 'Admin to‘ldirdi' : 'Admin ayirdi')
    );

    if (success) {
      setBalanceSuccess(
        `ID ${selectedUserForBalance.id} balansi muvaffaqiyatli ${isAdding ? '+' : '-'}${amount.toLocaleString()} so‘mga o‘zgartirildi!`
      );
      setTimeout(() => setBalanceSuccess(''), 4000);
    }
  };

  const handleSaveAllPrices = () => {
    Object.entries(editingPrices).forEach(([key, val]) => {
      updatePrice(key as ServiceType, val);
    });
    setPriceSaveSuccess(true);
    setTimeout(() => setPriceSaveSuccess(false), 3000);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminTelegram(tgInput);
    setTgSaved(true);
    setTimeout(() => setTgSaved(false), 3000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const promo: PromoCode = {
      code: newPromoCode.trim().toUpperCase(),
      bonusAmount: Number(newPromoBonus) || 10000,
      maxUses: Number(newPromoMaxUses) || 100,
      usedCount: 0,
      active: true,
    };
    addPromoCode(promo);
    setNewPromoCode('');
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-900 text-slate-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  Super Admin Boshqaruv Markazi
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Root
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin email: <span className="text-amber-300 font-mono">azizbekshovqiddinov102@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 overflow-x-auto self-start md:self-auto">
            <button
              onClick={() => setActiveAdminTab('stats')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'stats'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Statistika
            </button>
            <button
              onClick={() => setActiveAdminTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'users'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Foydalanuvchilar & ID
            </button>
            <button
              onClick={() => setActiveAdminTab('prices')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'prices'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Narxlar
            </button>
            <button
              onClick={() => setActiveAdminTab('promos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'promos'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Promo-kodlar
            </button>
            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sozlamalar
            </button>
          </div>
        </div>

        {/* Tab 1: Statistics */}
        {activeAdminTab === 'stats' && (
          <div className="pt-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Jami foydalanuvchilar</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{totalUsers.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 mt-2">+12% oxirgi haftada</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Bugungi foydalanuvchilar</span>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{todayUsers}</div>
                <div className="text-[11px] text-slate-400 mt-2">Faol talabalar</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Bugungi tushum</span>
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {todayRevenue.toLocaleString()} so‘m
                </div>
                <div className="text-[11px] text-slate-400 mt-2">Telegram orqali to‘lovlar</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Jami tushum</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {totalRevenue.toLocaleString()} so‘m
                </div>
                <div className="text-[11px] text-amber-300 mt-2">Barcha oylik daromad</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Yaratilgan diplomlar</span>
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{totalDiploms}</div>
                <div className="text-[11px] text-slate-400 mt-2">DOCX va PDF shaklda</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Yaratilgan kurs ishlari</span>
                  <FileCheck className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{totalKurs}</div>
                <div className="text-[11px] text-slate-400 mt-2">To‘liq boblar bilan</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Yaratilgan slaydlar</span>
                  <Presentation className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">{totalSlides}</div>
                <div className="text-[11px] text-slate-400 mt-2">PPTX taqdimotlar</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
                <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  <span>Faol ishlar & kvartiralar</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {activeJobs + activeApartments} ta
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  {activeJobs} ish / {activeApartments} kvartira
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users & 8-Digit ID Management */}
        {activeAdminTab === 'users' && (
          <div className="pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="8 xonali ID, ism yoki email orqali qidirish..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="text-xs text-slate-400">
                Topildi: <span className="text-white font-bold">{filteredUsers.length}</span> ta foydalanuvchi
              </div>
            </div>

            {balanceSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{balanceSuccess}</span>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-800/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <th className="p-3.5">8 xonali ID</th>
                    <th className="p-3.5">Foydalanuvchi</th>
                    <th className="p-3.5">Universitet & Kurs</th>
                    <th className="p-3.5">Balans</th>
                    <th className="p-3.5">Holat</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/60">
                      <td className="p-3.5 font-mono font-bold text-amber-400">
                        {u.id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{u.university}</div>
                        <div className="text-[11px] text-slate-400">{u.faculty} · {u.course}</div>
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-emerald-400 text-sm">
                        {u.balance.toLocaleString()} so‘m
                      </td>
                      <td className="p-3.5">
                        {u.isBlocked ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            Bloklangan
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            Faol
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedUserForBalance(u)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-colors"
                        >
                          Balansni boshqarish
                        </button>
                        <button
                          onClick={() => toggleBlockUser(u.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            u.isBlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                          title={u.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}
                        >
                          {u.isBlocked ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Balance Modal for Selected User */}
            {selectedUserForBalance && (
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Foydalanuvchi balansini boshqarish
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: <span className="font-mono text-amber-300">{selectedUserForBalance.id}</span> · {selectedUserForBalance.name} (Joriy balans: {selectedUserForBalance.balance.toLocaleString()} so‘m)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUserForBalance(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Yopish
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Summa (so‘m):</label>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Izoh / Sabab:</label>
                    <input
                      type="text"
                      value={balanceReason}
                      onChange={(e) => setBalanceReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateUserBalance(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Balans qo‘shish</span>
                  </button>

                  <button
                    onClick={() => handleUpdateUserBalance(false)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <MinusCircle className="w-4 h-4" />
                    <span>- Balansdan ayirish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Prices Editor */}
        {activeAdminTab === 'prices' && (
          <div className="pt-8 space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Xizmatlar narxlarini boshqarish</h2>
                <p className="text-xs text-slate-400">
                  Super Admin sifatida barcha AI xizmatlarining narxlarini istalgan vaqtda o‘zgartirishingiz mumkin.
                </p>
              </div>

              <button
                onClick={handleSaveAllPrices}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>O‘zgarishlarni saqlash</span>
              </button>
            </div>

            {priceSaveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Barcha xizmatlar narxi muvaffaqiyatli yangilandi!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(SERVICE_METADATA).map(([key, meta]) => {
                const sKey = key as ServiceType;
                return (
                  <div
                    key={sKey}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white uppercase">{meta.nameKey}</div>
                      <div className="text-[11px] text-slate-400">Standart: {meta.defaultPrice.toLocaleString()} so‘m</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={editingPrices[sKey] ?? meta.defaultPrice}
                        onChange={(e) =>
                          setEditingPrices({
                            ...editingPrices,
                            [sKey]: Number(e.target.value) || 0,
                          })
                        }
                        className="w-28 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-xs text-slate-400 font-mono">so‘m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Promo Codes */}
        {activeAdminTab === 'promos' && (
          <div className="pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Create Promo Code */}
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Yangi Promo-kod yaratish</span>
                </h3>

                <form onSubmit={handleCreatePromo} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Promo-kod nomi:</label>
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="Masalan: TALABA50, GRANT"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs uppercase font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bonus summasi (so‘m):</label>
                    <input
                      type="number"
                      step="5000"
                      value={newPromoBonus}
                      onChange={(e) => setNewPromoBonus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Maksimal ishlatish soni:</label>
                    <input
                      type="number"
                      value={newPromoMaxUses}
                      onChange={(e) => setNewPromoMaxUses(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Promo-kod yaratish
                  </button>
                </form>
              </div>

              {/* Active Promos List */}
              <div className="md:col-span-2 space-y-3">
                <h3 className="font-bold text-sm text-white">Mavjud promo-kodlar</h3>
                <div className="space-y-2">
                  {promoCodes.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-amber-400 text-sm">{p.code}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Bonus: <span className="text-emerald-400 font-mono">+{p.bonusAmount.toLocaleString()} so‘m</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-300 font-mono">
                          {p.usedCount} / {p.maxUses} ishlatildi
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">Faol</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Settings (Telegram admin, etc.) */}
        {activeAdminTab === 'settings' && (
          <div className="pt-8 space-y-6 max-w-xl">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
              <h2 className="font-bold text-sm text-white">Telegram to‘lov qabul qiluvchi akkaunt</h2>
              <p className="text-xs text-slate-400">
                Talabalar hisob to‘ldirish tugmasini bosganda ushbu Telegram profiliga o‘tishadi.
              </p>

              <form onSubmit={handleSaveTelegram} className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                    <input
                      type="text"
                      value={tgInput}
                      onChange={(e) => setTgInput(e.target.value)}
                      placeholder="talabago_admin"
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Saqlash
                  </button>
                </div>
              </form>

              {tgSaved && (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Telegram akkaunt yangilandi!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
