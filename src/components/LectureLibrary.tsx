import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LectureItem } from '../types';
import { GlobalStudySearch } from './GlobalStudySearch';
import {
  BookOpen,
  Check,
  Download,
  Headphones,
  Library,
  Loader2,
  Pause,
  Play,
  Printer,
  Search,
  Volume2,
  X,
} from 'lucide-react';

export const LectureLibrary: React.FC = () => {
  const { lectures } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [readingLecture, setReadingLecture] = useState<LectureItem | null>(null);

  // Audio TTS playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const subjects = [
    'all',
    'Informatika va IT',
    'Iqtisodiyot',
    'Matematika',
    'Huquq',
    'Fizika',
    'Kimyo',
  ];

  const filteredLectures = lectures.filter((lec) => {
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = selectedSubject === 'all' || lec.subject === selectedSubject;
    return matchesSearch && matchesSub;
  });

  const handlePlayAudio = async (text: string) => {
    if (isPlayingAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAudio(false);
      return;
    }

    setAudioLoading(true);
    try {
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 1000), // send first section for high quality audio lecture
          voice: 'Kore',
        }),
      });

      const data = await response.json();
      if (!data.success || !data.audioBase64) {
        throw new Error(data.error || 'Audio yuklanmadi');
      }

      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      setAudioElement(audio);
      setIsPlayingAudio(true);
    } catch (err) {
      console.error(err);
      // Fallback to browser SpeechSynthesis if backend or key is unavailable
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
        utterance.lang = 'uz-UZ';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } finally {
      setAudioLoading(false);
    }
  };

  const closeReading = () => {
    if (audioElement) {
      audioElement.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setReadingLecture(null);
  };

  const handlePrintPdf = (lec: LectureItem) => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>${lec.title}</title>
          <style>
            body { font-family: serif; padding: 40px; line-height: 1.6; color: #111; }
            h1 { font-size: 20pt; text-align: center; margin-bottom: 5px; }
            .meta { text-align: center; color: #666; margin-bottom: 30px; font-style: italic; }
            pre { font-family: serif; white-space: pre-wrap; font-size: 13pt; text-align: justify; }
          </style>
        </head>
        <body>
          <h1>${lec.title}</h1>
          <div class="meta">${lec.subject} · ${lec.author}</div>
          <pre>${lec.content}</pre>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              O‘quv resurslari
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Fanlar bo‘yicha ma’ruzalar kutubxonasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Universitet professorlari va dotsentlarining tayyor ma’ruza matnlari, PDF va audio shaklda
            </p>
          </div>
        </div>

        {/* Global NLP Semantic Search across all lectures & documents */}
        <GlobalStudySearch
          onSelectLecture={(lec) => setReadingLecture(lec)}
          onPlayAudio={(text) => handlePlayAudio(text)}
          onPrintPdf={(lec) => handlePrintPdf(lec)}
        />

        {/* Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fan, ma’ruza mavzusi yoki muallif bo‘yicha qidirish..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                  selectedSubject === sub
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub === 'all' ? 'Barcha fanlar' : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {lec.subject}
                  </span>
                  <span>{lec.pages} bet</span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {lec.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{lec.author}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {lec.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setReadingLecture(lec)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>O‘qish</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayAudio(lec.content)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
                    title="Audio eshitish (AI TTS)"
                  >
                    <Headphones className="w-4 h-4 text-sky-600" />
                  </button>

                  <button
                    onClick={() => handlePrintPdf(lec)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
                    title="PDF yuklab olish"
                  >
                    <Printer className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Lecture Reader Modal with Audio TTS player */}
        {readingLecture && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div>
                  <div className="text-xs font-semibold text-indigo-700">
                    {readingLecture.subject}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {readingLecture.title}
                  </h2>
                  <div className="text-xs text-slate-500">{readingLecture.author}</div>
                </div>

                <button
                  onClick={closeReading}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Audio Toolbar */}
              <div className="px-6 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-900">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Gemini TTS Ovozli eshitish</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(readingLecture.content)}
                    disabled={audioLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {audioLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Ovoz yuklanmoqda...</span>
                      </>
                    ) : isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>To‘xtatish</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Tinglash</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handlePrintPdf(readingLecture)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto font-serif text-slate-900 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {readingLecture.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
