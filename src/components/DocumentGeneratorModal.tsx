import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeneratedDocument, Language, ServiceType } from '../types';
import { exportToDocx, exportToPdf } from '../lib/exportUtils';
import { LANGUAGES, SERVICE_METADATA } from '../lib/i18n';
import { UNIVERSITIES_LIST } from '../data/mockData';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  FileCheck,
  FileDown,
  FileText,
  Loader2,
  Printer,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';

export const DocumentGeneratorModal: React.FC = () => {
  const {
    user,
    language: appLanguage,
    t,
    prices,
    selectedDocService,
    closeDocModal,
    addDocument,
    updateUserBalance,
    setIsTopUpOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [topic, setTopic] = useState('');
  const [docLang, setDocLang] = useState<Language>(appLanguage);
  const [pagesLength, setPagesLength] = useState('standard');
  const [university, setUniversity] = useState(user?.university || 'O‘zbekiston Milliy Universiteti');
  const [faculty, setFaculty] = useState(user?.faculty || '');
  const [notes, setNotes] = useState('');
  
  // Progress states: 0, 25, 50, 75, 100
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!selectedDocService) return null;

  const meta = SERVICE_METADATA[selectedDocService];
  const price = prices[selectedDocService] ?? meta.defaultPrice;
  const userBalance = user?.balance ?? 0;
  const canAfford = userBalance >= price;

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('Iltimos, mavzuni kiriting');
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!canAfford) {
      setErrorMessage(t('insufficient_balance'));
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);
    setProgress(5);
    setStatusText(t('step_0'));

    // Deduct price from user balance
    if (price > 0) {
      updateUserBalance(user.id, -price, `${meta.nameKey.toUpperCase()}: "${topic.slice(0, 30)}..."`);
    }

    // Step-by-step progress simulation while server processes
    const pTimer1 = setTimeout(() => {
      setProgress(25);
      setStatusText(t('step_25'));
    }, 1500);

    const pTimer2 = setTimeout(() => {
      setProgress(50);
      setStatusText(t('step_50'));
    }, 3500);

    const pTimer3 = setTimeout(() => {
      setProgress(75);
      setStatusText(t('step_75'));
    }, 6000);

    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: t(meta.nameKey),
          topic,
          language: docLang,
          length: pagesLength,
          additionalNotes: notes,
          university,
          faculty,
          studentName: user.name,
          studentId: user.id,
        }),
      });

      const resData = await response.json();
      clearTimeout(pTimer1);
      clearTimeout(pTimer2);
      clearTimeout(pTimer3);

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Generatsiyada xatolik');
      }

      setProgress(100);
      setStatusText(t('step_100'));

      const newDoc: GeneratedDocument = {
        id: `doc-${Date.now()}`,
        userId: user.id,
        serviceType: selectedDocService,
        topic,
        language: docLang,
        createdAt: new Date().toISOString(),
        price,
        data: resData.data,
      };

      setGeneratedDoc(newDoc);
      addDocument(newDoc);
    } catch (err: any) {
      console.error(err);
      clearTimeout(pTimer1);
      clearTimeout(pTimer2);
      clearTimeout(pTimer3);
      // Refund balance on error
      if (price > 0) {
        updateUserBalance(user.id, price, `Qaytarildi (Xatolik tufayli): ${topic.slice(0, 30)}`);
      }
      setErrorMessage(err.message || 'Hujjat generatsiyasida xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyFullText = () => {
    if (!generatedDoc) return;
    const d = generatedDoc.data;
    const text = `
${d.title}
(${d.serviceType})

MUNDARIJA:
${d.tableOfContents.join('\n')}

KIRISH:
${d.introduction}

${d.sections
  .map(
    (s) => `
${s.chapterNumber}. ${s.title}
${(s.subSections || []).map((sub) => `${sub.number}. ${sub.title}\n${sub.content}`).join('\n\n')}
`
  )
  .join('\n')}

XULOSA:
${d.conclusion}

ADABIYOTLAR:
${d.references.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                {t(meta.nameKey)}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{meta.badge}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">
                  {price === 0 ? 'Bepul' : `${price.toLocaleString()} ${t('currency')}`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeDocModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!generatedDoc && !isGenerating && (
            <form onSubmit={handleStartGeneration} className="space-y-5">
              {/* Topic Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mavzu <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t('modal_topic_placeholder')}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Language Selection Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('modal_language_label')} (Tayyor mahsulot shu tilda yoziladi)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setDocLang(l.code)}
                      className={`px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${
                        docLang === l.code
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        {l.name}
                      </span>
                      {docLang === l.code && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size / Volume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Hajmi va sahifalar soni
                  </label>
                  <select
                    value={pagesLength}
                    onChange={(e) => setPagesLength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="standard">Standart hajm (Kafedra talabi bo‘yicha)</option>
                    <option value="extended">Kengaytirilgan (Katta tadqiqot, ko‘proq jadvallar)</option>
                    <option value="compact">Ixcham va tezkor (Asosiy tezislar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Universitet / OTM
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {UNIVERSITIES_LIST.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Requirements / Faculty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Fakultet va yo‘nalish (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    placeholder="Masalan: Axborot texnologiyalari, 3-kurs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kafedra maxsus talablari (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masalan: 2024-2026 yillardagi statistik ma’lumotlar bilan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Balance & Price Notice */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Sizning balansingiz:</div>
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {userBalance.toLocaleString()} {t('currency')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Xizmat narxi:</div>
                    <div className="text-base font-extrabold text-indigo-600 font-mono">
                      {price === 0 ? 'Bepul' : `${price.toLocaleString()} ${t('currency')}`}
                    </div>
                  </div>

                  {!canAfford && (
                    <button
                      type="button"
                      onClick={() => setIsTopUpOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      {t('btn_topup')}
                    </button>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canAfford}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  canAfford
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{canAfford ? 'AI orqali tayyorlashni boshlash' : 'Balans yetarli emas — To‘ldirish kerak'}</span>
              </button>
            </form>
          )}

          {/* Real Progress View (0% -> 25% -> 50% -> 75% -> 100%) */}
          {isGenerating && (
            <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"
                  style={{ animationDuration: '1.2s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-extrabold text-sm text-indigo-700 font-mono">
                  {progress}%
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('status_generating')}</h3>
                <p className="text-xs sm:text-sm text-indigo-600 font-medium mt-1">{statusText}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400">
                TalabaGO ilmiy AI modeli O‘zbekiston OTMlarining GOST va akademik qoidalariga rioya qilmoqda...
              </div>
            </div>
          )}

          {/* Generated Result Preview & Downloads */}
          {generatedDoc && (
            <div className="space-y-6">
              {/* Action Toolbar */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      Hujjat muvaffaqiyatli tayyorlandi!
                    </div>
                    <div className="text-[11px] text-slate-500">
                      DOCX yoki PDF sifatida yuklab oling
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => exportToDocx(generatedDoc, university)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('btn_download_docx')}</span>
                  </button>

                  <button
                    onClick={() => exportToPdf(generatedDoc, university)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('btn_download_pdf')}</span>
                  </button>

                  <button
                    onClick={copyFullText}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copied ? 'Nusxalandi!' : 'Nusxa olish'}</span>
                  </button>
                </div>
              </div>

              {/* Document Paper Preview (Styled like academic paper) */}
              <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-10 shadow-inner font-serif text-slate-900 text-sm leading-relaxed space-y-8 max-w-3xl mx-auto">
                {/* Titul Varaq Preview */}
                <div className="text-center pb-8 border-b-2 border-slate-200 space-y-4 font-sans">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    O‘ZBEKISTON RESPUBLIKASI OLIY TA’LIM, FAN VA INNOVATSIYALAR VAZIRLIGI
                  </div>
                  <div className="text-xs font-bold text-slate-800 uppercase">
                    {university}
                  </div>
                  <div className="pt-6 pb-4">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                      {generatedDoc.data.title}
                    </h1>
                    <div className="text-xs font-bold text-indigo-700 uppercase mt-2">
                      ({generatedDoc.data.serviceType})
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 pt-4 text-right">
                    <div><strong>Muallif:</strong> {user?.name || 'Talaba'} (ID: {user?.id})</div>
                    <div><strong>Tekshiruvchi:</strong> Ilmiy maslahatchi</div>
                    <div>Toshkent — 2026</div>
                  </div>
                </div>

                {/* Table of Contents */}
                <div>
                  <h2 className="text-base font-bold font-sans uppercase tracking-wider text-center mb-4 text-slate-900">
                    Mundarija
                  </h2>
                  <div className="space-y-1.5 text-xs sm:text-sm font-sans">
                    {generatedDoc.data.tableOfContents.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Introduction */}
                <div>
                  <h2 className="text-base font-bold font-sans uppercase tracking-wider text-center mb-3 text-slate-900">
                    Kirish
                  </h2>
                  <p className="indent-8 text-justify text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {generatedDoc.data.introduction}
                  </p>
                </div>

                {/* Chapters */}
                {generatedDoc.data.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-4 pt-4 border-t border-slate-100">
                    <h2 className="text-base font-bold font-sans uppercase tracking-wider text-center text-slate-900">
                      {section.chapterNumber}. {section.title}
                    </h2>

                    {(section.subSections || []).map((sub, subIdx) => (
                      <div key={subIdx} className="space-y-2">
                        <h3 className="text-sm font-bold font-sans text-slate-800">
                          {sub.number}. {sub.title}
                        </h3>
                        <p className="indent-8 text-justify text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                          {sub.content}
                        </p>
                      </div>
                    ))}

                    {/* Table if present */}
                    {section.tableData && (
                      <div className="my-4">
                        <div className="text-xs font-bold font-sans mb-1 text-slate-700">
                          {section.tableData.title || '1-jadval'}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse border border-slate-300 font-sans">
                            <thead>
                              <tr className="bg-slate-100">
                                {section.tableData.headers.map((h, i) => (
                                  <th key={i} className="border border-slate-300 p-2 font-bold text-slate-700">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.tableData.rows.map((row, rI) => (
                                <tr key={rI} className="hover:bg-slate-50">
                                  {row.map((cell, cI) => (
                                    <td key={cI} className="border border-slate-300 p-2 text-center text-slate-800">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Conclusion */}
                <div className="pt-4 border-t border-slate-100">
                  <h2 className="text-base font-bold font-sans uppercase tracking-wider text-center mb-3 text-slate-900">
                    Xulosa va takliflar
                  </h2>
                  <p className="indent-8 text-justify text-slate-800 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {generatedDoc.data.conclusion}
                  </p>
                </div>

                {/* References */}
                <div className="pt-4 border-t border-slate-100 font-sans">
                  <h2 className="text-base font-bold uppercase tracking-wider text-center mb-3 text-slate-900">
                    Foydalanilgan adabiyotlar
                  </h2>
                  <ol className="list-decimal pl-6 space-y-1 text-xs text-slate-700">
                    {(generatedDoc.data.references || []).map((ref, rIdx) => (
                      <li key={rIdx}>{ref}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
