import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Gift,
  Send,
  Sparkles,
  Tag,
  Wallet,
  X,
} from 'lucide-react';

export const TopUpBalanceModal: React.FC = () => {
  const {
    user,
    t,
    isTopUpOpen,
    setIsTopUpOpen,
    adminTelegram,
    applyPromoCode,
    updateUserBalance,
  } = useApp();

  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isTopUpOpen) return null;

  const presetAmounts = [10000, 25000, 50000, 100000];
  const finalAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePayViaTelegram = () => {
    if (!user) return;
    const tgUsername = adminTelegram.replace('@', '');
    const message = encodeURIComponent(
      `Assalomu alaykum! TalabaGO orqali hisobimni to‘ldirmoqchiman.\n\n👤 Talaba: ${user.name}\n🆔 Mening 8 xonali ID: ${user.id}\n💰 To‘lov summasi: ${finalAmount.toLocaleString()} so‘m\n\nTo‘lov chekini ushbu xabarga ilova qilmoqdaman. Iltimos hisobimni to‘ldirib bering!`
    );
    window.open(`https://t.me/${tgUsername}?text=${message}`, '_blank');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {t('btn_topup')}
              </h2>
              <p className="text-xs text-slate-500">
                Telegram orqali tezkor va xavfsiz to‘lov
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTopUpOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User 8-Digit ID Alert Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Sizning shaxsiy 8 xonali ID raqamingiz
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono tracking-wider mt-0.5">
                {user?.id || '58321476'}
              </div>
            </div>

            <button
              onClick={copyId}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nusxalandi</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nusxa olish</span>
                </>
              )}
            </button>
          </div>

          {/* Amount Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              To‘ldirish summasini tanlang
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setIsCustom(false);
                  }}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold font-mono transition-all text-left flex items-center justify-between ${
                    !isCustom && selectedAmount === amt
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{amt.toLocaleString()} {t('currency')}</span>
                  {!isCustom && selectedAmount === amt && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Amount option */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  isCustom
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Boshqa summa kiritish</span>
                {isCustom && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              {isCustom && (
                <div className="mt-2">
                  <input
                    type="number"
                    step="5000"
                    min="5000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Summani so‘mda kiriting (masalan: 150000)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Telegram Payment CTA */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handlePayViaTelegram}
              className="w-full py-3.5 rounded-2xl bg-[#24A1DE] hover:bg-[#1f8ec4] text-white font-bold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('topup_telegram_btn')} ({finalAmount.toLocaleString()} {t('currency')})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Tugmani bosganingizda to‘g‘ridan-to‘g‘ri Super Admin Telegramiga o‘tasiz. Admin ID raqamingiz orqali balansingizni to‘ldiradi.
            </p>
          </div>

          {/* Promo code redemption */}
          <div className="pt-4 border-t border-slate-100">
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Promo-kod bormi?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Masalan: TALABA2026, GRANT"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Faollashtirish
                </button>
              </div>

              {promoMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 ${
                    promoMessage.error
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{promoMessage.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
