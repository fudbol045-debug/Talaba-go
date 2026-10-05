import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeneratedDocument, LectureItem } from '../types';
import { exportToDocx, exportToPdf } from '../lib/exportUtils';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  Headphones,
  HelpCircle,
  Lightbulb,
  Loader2,
  Printer,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';

interface MatchItem {
  id: string;
  relevanceScore: number;
  highlightExcerpt: string;
  matchedTopic: string;
  type?: 'lecture' | 'document';
  lectureData?: LectureItem;
  documentData?: GeneratedDocument;
}

interface NlpSearchResponse {
  directAnswer?: string;
  matches: MatchItem[];
  suggestedQuestions?: string[];
}

export const GlobalStudySearch: React.FC<{
  onSelectLecture: (lec: LectureItem) => void;
  onPlayAudio: (text: string) => void;
  onPrintPdf: (lec: LectureItem) => void;
}> = ({ onSelectLecture, onPlayAudio, onPrintPdf }) => {
  const { lectures, documents, language, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nlpResult, setNlpResult] = useState<NlpSearchResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'lectures' | 'documents'>('all');

  // Popular Natural Language queries for student prompt chips
  const samplePrompts = [
    { label: 'Neyron tarmoqlar turlari', query: 'Sun’iy intellektda neyron tarmoqlar qanday turlarga bo‘linadi?' },
    { label: 'Matritsalar ko‘paytmasi', query: 'Matritsalarni qanday ko‘paytirish kerak va qanday shart bajarilishi lozim?' },
    { label: 'Inflyatsiyani jilovlash', query: 'Makroiqtisodiyotda inflyatsiyani qanday choralar bilan pasaytirish mumkin?' },
    { label: 'Mehnat huquqi imtiyozlari', query: 'Talaba va yosh mutaxassislarga mehnat shartnomasida qanday imtiyozlar berilgan?' },
    { label: 'Kvant fotoeffekt formulasi', query: 'Fotoeffekt hodisasining Eynshteyn tenglamasi qanday ifodalanadi?' },
  ];

  const handleSearch = async (queryText?: string) => {
    const q = (queryText ?? searchQuery).trim();
    if (!q) return;

    if (queryText) {
      setSearchQuery(queryText);
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/ai/nlp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          language,
          lectures,
          documents,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Qidiruvda xatolik');
      }

      // Map enriched items
      const enrichedMatches: MatchItem[] = (data.matches || []).map((m: any) => {
        const foundLec = lectures.find((l) => l.id === m.id);
        const foundDoc = documents.find((d) => d.id === m.id);
        return {
          ...m,
          type: foundLec ? 'lecture' : 'document',
          lectureData: foundLec,
          documentData: foundDoc,
        };
      });

      setNlpResult({
        directAnswer: data.directAnswer,
        matches: enrichedMatches,
        suggestedQuestions: data.suggestedQuestions || [],
      });
    } catch (err) {
      console.warn('NLP server search fallback to local matching:', err);
      // Smart local semantic fallback
      const lower = q.toLowerCase();
      const localMatches: MatchItem[] = [];

      lectures.forEach((l) => {
        let score = 0;
        if (l.title.toLowerCase().includes(lower)) score += 40;
        if (l.content.toLowerCase().includes(lower)) score += 30;
        if (l.subject.toLowerCase().includes(lower)) score += 20;
        if (l.tags.some((tag) => lower.includes(tag.toLowerCase()))) score += 20;

        if (score > 0) {
          localMatches.push({
            id: l.id,
            relevanceScore: Math.min(98, 65 + score),
            highlightExcerpt: `${l.subject}: "${l.title}" ma’ruzasida so‘rovingizga doir nazariy va amaliy ma’lumotlar mavjud.`,
            matchedTopic: l.title,
            type: 'lecture',
            lectureData: l,
          });
        }
      });

      documents.forEach((d) => {
        let score = 0;
        if (d.data?.title?.toLowerCase().includes(lower)) score += 40;
        if (d.data?.introduction?.toLowerCase().includes(lower)) score += 30;

        if (score > 0) {
          localMatches.push({
            id: d.id,
            relevanceScore: Math.min(95, 60 + score),
            highlightExcerpt: `${d.serviceType.toUpperCase()} hujjatida ushbu mavzu yoritilgan.`,
            matchedTopic: d.data?.title || d.topic,
            type: 'document',
            documentData: d,
          });
        }
      });

      setNlpResult({
        directAnswer: `"${q}" mavzusi bo‘yicha o‘quv bazasidan tegishli ma’ruzalar va ilmiy materiallar topildi.`,
        matches: localMatches.sort((a, b) => b.relevanceScore - a.relevanceScore),
        suggestedQuestions: [
          'Ushbu mavzuning amaliy formulalari qanday?',
          'Tegishli adabiyotlar va manbalar ro‘yxati',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setNlpResult(null);
    setHasSearched(false);
  };

  // Filter matches
  const filteredMatches = (nlpResult?.matches || []).filter((m) => {
    if (activeFilter === 'lectures') return m.type === 'lecture';
    if (activeFilter === 'documents') return m.type === 'document';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs mb-8 transition-all">
      {/* NLP Badge & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
              <span>Aqlli Semantik Qidiruv (NLP)</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-[10px] font-extrabold tracking-wide uppercase shadow-2xs">
                Gemini AI
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Barcha ma’ruzalar va tayyorlangan ilmiy hujjatlar bo‘ylab tabiiy tilda savol bering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="hidden sm:inline">Savolingiz mohiyatini tushunadi va to‘g‘ridan-to‘g‘ri javob beradi</span>
        </div>
      </div>

      {/* Main Global Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <div className="absolute left-4 top-3.5 text-indigo-600">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Erkin tilda yozing (masalan: 'matritsalarni ko‘paytirish tartibi' yoki 'fotoeffekt qonunlari')..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="px-5 sm:px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Tahlil qilinmoqda...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Qidirish</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Prompt Chips */}
      {!hasSearched && (
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Tezkor namunalar (1 bosishda sinab ko‘ring):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearch(p.query)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/70 hover:border-indigo-200 transition-all font-medium text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4 animate-pulse">
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Gemini AI barcha ma’ruzalar matni va ilmiy manbalarni tahlil qilmoqda...</span>
          </div>
          <div className="h-4 bg-indigo-200/60 rounded-md w-3/4" />
          <div className="h-4 bg-indigo-200/40 rounded-md w-1/2" />
        </div>
      )}

      {/* Search Results Display */}
      {nlpResult && !isLoading && (
        <div className="mt-6 space-y-5 animate-in fade-in duration-200">
          {/* 1. AI Direct Answer Box */}
          {nlpResult.directAnswer && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-white border border-indigo-200/90 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-900">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>AI Ilmiy Xulosasi & Javob:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {nlpResult.directAnswer}
              </p>

              {/* Follow-up Questions */}
              {nlpResult.suggestedQuestions && nlpResult.suggestedQuestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-100/80 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-indigo-600 font-semibold flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Bog‘liq mavzular:
                  </span>
                  {nlpResult.suggestedQuestions.map((q, qI) => (
                    <button
                      key={qI}
                      onClick={() => handleSearch(q)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Counter & Filter Tabs */}
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
            <div className="font-bold text-slate-700">
              Topilgan materiallar: <span className="text-indigo-600 font-mono">{filteredMatches.length}</span> ta
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Barchasi ({nlpResult.matches.length})
              </button>
              <button
                onClick={() => setActiveFilter('lectures')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeFilter === 'lectures' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ma’ruzalar ({nlpResult.matches.filter((m) => m.type === 'lecture').length})
              </button>
              <button
                onClick={() => setActiveFilter('documents')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  activeFilter === 'documents' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hujjatlar ({nlpResult.matches.filter((m) => m.type === 'document').length})
              </button>
            </div>
          </div>

          {/* Matches List */}
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Ushbu toifada tegishli material topilmadi. So‘rovni o‘zgartirib ko‘ring.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((item, idx) => {
                const isLecture = item.type === 'lecture' && item.lectureData;
                const isDocument = item.type === 'document' && item.documentData;
                const lec = item.lectureData;
                const doc = item.documentData;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isLecture ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Ma’ruza
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 flex items-center gap-1">
                            <FileCheck className="w-3 h-3" /> Ilmiy Hujjat ({doc?.serviceType})
                          </span>
                        )}

                        <span className="text-[11px] font-bold text-slate-600">
                          {lec?.subject || doc?.serviceType}
                        </span>

                        <span className="text-[11px] font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {item.relevanceScore}% moslik
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {lec?.title || doc?.data?.title || item.matchedTopic}
                      </h3>

                      {lec?.author && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{lec.author}</p>
                      )}

                      {/* Excerpt */}
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-sans">
                        <span className="font-semibold text-indigo-700">NLP moslik tavsifi:</span>{' '}
                        {item.highlightExcerpt}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isLecture && lec && (
                        <>
                          <button
                            type="button"
                            onClick={() => onSelectLecture(lec)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>O‘qish</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onPlayAudio(lec.content)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
                            title="Ovozli eshitish"
                          >
                            <Headphones className="w-4 h-4 text-sky-600" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onPrintPdf(lec)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
                            title="PDF yuklab olish"
                          >
                            <Printer className="w-4 h-4 text-rose-600" />
                          </button>
                        </>
                      )}

                      {isDocument && doc && (
                        <>
                          <button
                            type="button"
                            onClick={() => exportToDocx(doc, user?.university)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>DOCX</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => exportToPdf(doc, user?.university)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
