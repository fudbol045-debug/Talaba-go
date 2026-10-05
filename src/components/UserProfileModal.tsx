import React, { useEffect, useId, useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportToDocx, exportToPdf, exportToPptx } from '../lib/exportUtils';
import { UNIVERSITIES_LIST } from '../data/mockData';
import {
  AlertCircle,
  Award,
  BookOpen,
  Bookmark,
  Building,
  Check,
  CheckCircle2,
  Copy,
  Download,
  GraduationCap,
  History,
  Info,
  LogOut,
  Mail,
  Printer,
  Save,
  School,
  Sparkles,
  User as UserIcon,
  Wallet,
  X,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    user,
    t,
    isProfileOpen,
    setIsProfileOpen,
    setIsTopUpOpen,
    logout,
    updateUserProfile,
    documents,
    presentations,
    transactions,
    jobs,
    apartments,
    savedJobs,
    savedApartments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'saved' | 'payments'>('profile');
  const [copiedId, setCopiedId] = useState(false);

  // Form Fields State
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [customUniversity, setCustomUniversity] = useState('');
  const [isOtherUni, setIsOtherUni] = useState(false);
  const [faculty, setFaculty] = useState(user?.faculty || '');
  const [major, setMajor] = useState(user?.major || '');
  const [course, setCourse] = useState(user?.course || '1-kurs');
  const [studyType, setStudyType] = useState('Kunduzgi');

  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const nameInputId = useId();
  const universitySelectId = useId();
  const customUniversityInputId = useId();
  const facultyInputId = useId();
  const majorInputId = useId();
  const courseSelectId = useId();
  const studyTypeSelectId = useId();

  // Sync state whenever user opens modal
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      const isKnownUni = UNIVERSITIES_LIST.includes(user.university);
      if (isKnownUni) {
        setUniversity(user.university);
        setIsOtherUni(false);
        setCustomUniversity('');
      } else if (user.university) {
        setUniversity('Boshqa OTM');
        setIsOtherUni(true);
        setCustomUniversity(user.university);
      } else {
        setUniversity(UNIVERSITIES_LIST[0]);
        setIsOtherUni(false);
      }
      setFaculty(user.faculty || '');
      setMajor(user.major || '');
      setCourse(user.course || '1-kurs');
    }
  }, [user, isProfileOpen]);

  // Automatic Real-Time Validation Function
  const validate = (
    currentName: string,
    currentUni: string,
    currentCustomUni: string,
    currentFaculty: string,
    currentMajor: string,
    currentCourse: string
  ) => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name Validation
    const trimmedName = currentName.trim();
    if (!trimmedName) {
      newErrors.name = 'Ism-familiyani kiritish majburiy';
    } else if (trimmedName.length < 3) {
      newErrors.name = 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak';
    } else if (/^\d+$/.test(trimmedName)) {
      newErrors.name = 'Ism raqamlardan iborat bo‘lishi mumkin emas';
    }

    // 2. University Validation
    if (isOtherUni) {
      if (!currentCustomUni.trim()) {
        newErrors.university = 'OTM / Universitet nomini yozing';
      } else if (currentCustomUni.trim().length < 4) {
        newErrors.university = 'OTM nomi kamida 4 ta belgidan iborat bo‘lishi kerak';
      }
    } else {
      if (!currentUni) {
        newErrors.university = 'Universitetni tanlang';
      }
    }

    // 3. Faculty Validation
    const trimmedFaculty = currentFaculty.trim();
    if (!trimmedFaculty) {
      newErrors.faculty = 'Fakultet nomini kiritish majburiy';
    } else if (trimmedFaculty.length < 2) {
      newErrors.faculty = 'Fakultet nomi kamida 2 ta harfdan iborat bo‘lishi kerak';
    }

    // 4. Major Validation
    const trimmedMajor = currentMajor.trim();
    if (!trimmedMajor) {
      newErrors.major = 'Ta’lim yo‘nalishini / mutaxassislikni kiriting';
    } else if (trimmedMajor.length < 2) {
      newErrors.major = 'Yo‘nalish nomi kamida 2 ta harfdan iborat bo‘lishi kerak';
    }

    // 5. Course Validation
    if (!currentCourse) {
      newErrors.course = 'O‘qiyotgan kursingizni tanlang';
    }

    setErrors(newErrors);
    return newErrors;
  };

  // Run validation automatically whenever fields change
  useEffect(() => {
    validate(name, university, customUniversity, faculty, major, course);
  }, [name, university, customUniversity, isOtherUni, faculty, major, course]);

  if (!isProfileOpen || !user) return null;

  // Calculate Profile Completeness Score
  const activeUniVal = isOtherUni ? customUniversity : university;
  const fieldsToCheck = [name.trim(), activeUniVal.trim(), faculty.trim(), major.trim(), course.trim()];
  const completedFields = fieldsToCheck.filter(Boolean).length;
  const completenessPercent = Math.round((completedFields / fieldsToCheck.length) * 100);
  const isFormValid = Object.keys(errors).length === 0;

  const copyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleUniversityChange = (val: string) => {
    if (val === 'Boshqa OTM') {
      setIsOtherUni(true);
      setUniversity('Boshqa OTM');
    } else {
      setIsOtherUni(false);
      setUniversity(val);
      setCustomUniversity('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      university: true,
      faculty: true,
      major: true,
      course: true,
    });

    const currentErrors = validate(name, university, customUniversity, faculty, major, course);
    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    const finalUniversity = isOtherUni ? customUniversity.trim() : university;

    updateUserProfile({
      name: name.trim(),
      university: finalUniversity,
      faculty: faculty.trim(),
      major: major.trim(),
      course,
    });

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Quick Faculty Suggestions
  const popularFaculties = [
    'Dasturiy injiniring',
    'Iqtisodiyot va moliya',
    'Yurisprudensiya',
    'Xorijiy filologiya',
    'Menejment',
    'Kiberxavfsizlik',
  ];

  // Quick Major Suggestions
  const popularMajors = [
    'Sun’iy intellekt',
    'Bank ishi va audit',
    'Xalqaro huquq',
    'Ingliz tili va adabiyoti',
    'Axborot tizimlari',
    'Marketing',
  ];

  const userDocs = documents.filter((d) => d.userId === user.id);
  const userPres = presentations.filter((p) => p.userId === user.id);
  const userTxs = transactions.filter((t) => t.userId === user.id);
  const savedJobList = jobs.filter((j) => savedJobs.includes(j.id));
  const savedAptList = apartments.filter((a) => savedApartments.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-display">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                  {user.role === 'superadmin' ? 'Super Admin' : 'Talaba'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>ID: {user.id}</span>
                <span>·</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Profil & OTM ma’lumotlari
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Buyurtmalar & Fayllar ({userDocs.length + userPres.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Saqlanganlar ({savedJobList.length + savedAptList.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            To‘lovlar tarixi ({userTxs.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Profile & University Details with Automatic Validation */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Profile Completeness Indicator */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-sky-50/60 to-white border border-indigo-100/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Akademik profil to‘ldirilishi
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-indigo-700">
                    {completenessPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      completenessPercent === 100
                        ? 'bg-emerald-500'
                        : completenessPercent >= 60
                        ? 'bg-indigo-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${completenessPercent}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>
                    {completenessPercent === 100
                      ? '✓ Barcha ma’lumotlar to‘liq kiritilgan. Titul varaqlar avtomatik to‘g‘ri shakllanadi.'
                      : 'OTM, fakultet va yo‘nalishni to‘liq kiriting, shunda barcha diplom va kurs ishlari titul varag‘i xatosiz chiqadi.'}
                  </span>
                </div>
              </div>

              {/* ID & Balance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Noyob 8 xonali ID
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">
                      {user.id}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyId}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 shadow-xs transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedId ? 'Nusxalandi' : 'Nusxa'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Hamyon Balansi
                    </div>
                    <div className="text-xl font-extrabold text-emerald-950 font-mono">
                      {user.balance.toLocaleString()} {t('currency')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTopUpOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    + To‘ldirish
                  </button>
                </div>
              </div>

              {isSavedNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>OTM va shaxsiy ma’lumotlaringiz muvaffaqiyatli yangilandi va saqlandi!</span>
                </div>
              )}

              {/* Form with Automatic Validation */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* 1. Full Name Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={nameInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      To‘liq ism-familiya <span className="text-rose-500">*</span>
                    </label>
                    {name.trim().length >= 3 && !errors.name && (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> To‘g‘ri
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id={nameInputId}
                      type="text"
                      value={name}
                      onBlur={() => handleBlur('name')}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Sardor Rustamov"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                        touched.name && errors.name
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : name.trim().length >= 3
                          ? 'border-emerald-300 focus:ring-emerald-400'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <div className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* 2. University (OTM) Field with Auto-validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={universitySelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Universitet / OTM <span className="text-rose-500">*</span>
                    </label>
                    {((!isOtherUni && university) || (isOtherUni && customUniversity.trim().length >= 4)) && !errors.university && (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Tanlandi
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      id={universitySelectId}
                      value={isOtherUni ? 'Boshqa OTM' : university}
                      onBlur={() => handleBlur('university')}
                      onChange={(e) => handleUniversityChange(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white font-medium text-slate-800 transition-all focus:outline-none focus:ring-2 ${
                        touched.university && errors.university
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    >
                      {UNIVERSITIES_LIST.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                      <option value="Boshqa OTM">➕ Boshqa OTM (qo‘lda kiritish)</option>
                    </select>
                  </div>

                  {/* Custom University Input if 'Boshqa OTM' */}
                  {isOtherUni && (
                    <div className="mt-2 animate-in fade-in">
                      <input
                        id={customUniversityInputId}
                        aria-label="OTM yoki filial nomini to‘liq kiriting"
                        type="text"
                        value={customUniversity}
                        onBlur={() => handleBlur('university')}
                        onChange={(e) => setCustomUniversity(e.target.value)}
                        placeholder="OTM yoki filial nomini to‘liq kiriting..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          touched.university && errors.university
                            ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                            : customUniversity.trim().length >= 4
                            ? 'border-emerald-300 focus:ring-emerald-400'
                            : 'border-slate-300 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                  )}

                  {touched.university && errors.university && (
                    <div className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.university}</span>
                    </div>
                  )}
                </div>

                {/* 3. Faculty & Major in 2 columns with automatic validation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Faculty Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={facultyInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Fakultet <span className="text-rose-500">*</span>
                      </label>
                      {faculty.trim().length >= 2 && !errors.faculty && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <input
                      id={facultyInputId}
                      type="text"
                      value={faculty}
                      onBlur={() => handleBlur('faculty')}
                      onChange={(e) => setFaculty(e.target.value)}
                      placeholder="Dasturiy injiniring"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        touched.faculty && errors.faculty
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : faculty.trim().length >= 2
                          ? 'border-emerald-300 focus:ring-emerald-400'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    />
                    {touched.faculty && errors.faculty && (
                      <div className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.faculty}</span>
                      </div>
                    )}
                  </div>

                  {/* Major Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={majorInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Ta’lim yo‘nalishi <span className="text-rose-500">*</span>
                      </label>
                      {major.trim().length >= 2 && !errors.major && (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <input
                      id={majorInputId}
                      type="text"
                      value={major}
                      onBlur={() => handleBlur('major')}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="Sun’iy intellekt"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        touched.major && errors.major
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                          : major.trim().length >= 2
                          ? 'border-emerald-300 focus:ring-emerald-400'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    />
                    {touched.major && errors.major && (
                      <div className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.major}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggestions chips for quick selection */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Tezkor tanlash (Fakultet va Yo‘nalish namunalari):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularFaculties.slice(0, 4).map((fName) => (
                      <button
                        key={fName}
                        type="button"
                        onClick={() => setFaculty(fName)}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        +{fName}
                      </button>
                    ))}
                    {popularMajors.slice(0, 3).map((mName) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => setMajor(mName)}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        +{mName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Course & Study Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={courseSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Bosqich / Kurs <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id={courseSelectId}
                      value={course}
                      onBlur={() => handleBlur('course')}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1-kurs">1-kurs</option>
                      <option value="2-kurs">2-kurs</option>
                      <option value="3-kurs">3-kurs</option>
                      <option value="4-kurs">4-kurs</option>
                      <option value="Magistratura 1-kurs">Magistratura 1-kurs</option>
                      <option value="Magistratura 2-kurs">Magistratura 2-kurs</option>
                      <option value="Doktorantura">Doktorantura / PhD</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={studyTypeSelectId} className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Ta’lim shakli
                    </label>
                    <select
                      id={studyTypeSelectId}
                      value={studyType}
                      onChange={(e) => setStudyType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Kunduzgi">Kunduzgi (Davlat granti / Shartnoma)</option>
                      <option value="Sirtqi">Sirtqi ta’lim</option>
                      <option value="Masofaviy">Masofaviy ta’lim</option>
                      <option value="Kechki">Kechki ta’lim</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Titul varaqqa ushbu ma’lumotlar avtomatik joylanadi</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all ${
                        isFormValid
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>{isFormValid ? 'Saqlash' : 'Kamchiliklarni to‘ldiring'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Logout button */}
              <div className="pt-4 border-t border-slate-200 text-right">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Akkauntdan chiqish</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Orders & Ready Files */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userDocs.length === 0 && userPres.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Sizda hali tayyorlangan buyurtmalar mavjud emas.
                </div>
              ) : (
                <div className="space-y-3">
                  {userDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-bold text-indigo-700 uppercase bg-indigo-100/70 px-2 py-0.5 rounded">
                            {doc.serviceType}
                          </span>
                          <span>{doc.createdAt.slice(0, 10)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{doc.data.title}</h4>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => exportToDocx(doc, user.university)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>DOCX</span>
                        </button>
                        <button
                          onClick={() => exportToPdf(doc, user.university)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {userPres.map((pres) => (
                    <div
                      key={pres.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-bold text-sky-700 uppercase bg-sky-100/70 px-2 py-0.5 rounded">
                            Slayd ({pres.slideCount} ta)
                          </span>
                          <span>{pres.createdAt.slice(0, 10)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{pres.topic}</h4>
                      </div>

                      <button
                        onClick={() => exportToPptx(pres)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs self-end sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PPTX</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Items */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Saqlangan ish vakansiyalari ({savedJobList.length})
                </h4>
                {savedJobList.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3">Saqlangan ishlar yo‘q</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedJobList.map((j) => (
                      <div key={j.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-900">{j.title}</div>
                        <div className="text-[11px] text-slate-500">{j.company} · {j.salary}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Saqlangan kvartiralar ({savedAptList.length})
                </h4>
                {savedAptList.length === 0 ? (
                  <div className="text-xs text-slate-400 py-3">Saqlangan kvartiralar yo‘q</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAptList.map((a) => (
                      <div key={a.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-900">{a.title}</div>
                        <div className="text-[11px] text-slate-500">{a.district} · {a.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Transactions History */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              {userTxs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  To‘lovlar tarixi bo‘sh
                </div>
              ) : (
                userTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tx.title}</div>
                      <div className="text-[10px] text-slate-400">{tx.date}</div>
                    </div>
                    <div
                      className={`text-xs font-extrabold font-mono ${
                        tx.type === 'topup' || tx.type === 'bonus' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'topup' || tx.type === 'bonus' ? '+' : '-'}
                      {tx.amount.toLocaleString()} {t('currency')}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
