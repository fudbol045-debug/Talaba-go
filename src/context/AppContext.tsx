import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ApartmentListing,
  GeneratedDocument,
  GeneratedPresentation,
  JobListing,
  Language,
  LectureItem,
  PromoCode,
  ServiceType,
  Transaction,
  User,
} from '../types';
import {
  INITIAL_APARTMENTS,
  INITIAL_JOBS,
  INITIAL_LECTURES,
  INITIAL_USER,
} from '../data/mockData';
import { translations } from '../lib/i18n';
import confetti from 'canvas-confetti';

interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'balance' | 'job' | 'apartment' | 'bonus' | 'info';
  read: boolean;
}

interface AppContextType {
  user: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  prices: Record<ServiceType, number>;
  updatePrice: (service: ServiceType, newPrice: number) => void;
  adminTelegram: string;
  setAdminTelegram: (tg: string) => void;
  usersList: User[];
  updateUserBalance: (userId: string, deltaAmount: number, reason: string) => boolean;
  toggleBlockUser: (userId: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  documents: GeneratedDocument[];
  addDocument: (doc: GeneratedDocument) => void;
  presentations: GeneratedPresentation[];
  addPresentation: (pres: GeneratedPresentation) => void;
  jobs: JobListing[];
  addJob: (job: Omit<JobListing, 'id' | 'createdAt' | 'status'>) => void;
  apartments: ApartmentListing[];
  addApartment: (apt: Omit<ApartmentListing, 'id' | 'createdAt' | 'status'>) => void;
  lectures: LectureItem[];
  savedJobs: string[];
  toggleSaveJob: (id: string) => void;
  savedApartments: string[];
  toggleSaveApartment: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  promoCodes: PromoCode[];
  applyPromoCode: (code: string) => { success: boolean; message: string; bonus?: number };
  addPromoCode: (promo: PromoCode) => void;
  loginAs: (email: string, name?: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  // Modals state
  activeTab: 'home' | 'study' | 'create' | 'jobs' | 'housing' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'study' | 'create' | 'jobs' | 'housing' | 'profile' | 'admin') => void;
  openDocModal: (type?: ServiceType) => void;
  closeDocModal: () => void;
  selectedDocService: ServiceType | null;
  openSlideModal: () => void;
  closeSlideModal: () => void;
  isSlideModalOpen: boolean;
  setIsSlideModalOpen: (open: boolean) => void;
  isTopUpOpen: boolean;
  setIsTopUpOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  activePresentation: GeneratedPresentation | null;
  setActivePresentation: (p: GeneratedPresentation | null) => void;
  activeViewingDoc: GeneratedDocument | null;
  setActiveViewingDoc: (d: GeneratedDocument | null) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isAddListingOpen: boolean;
  setIsAddListingOpen: (open: boolean) => void;
  addListingType: 'job' | 'apartment';
  setAddListingType: (t: 'job' | 'apartment') => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PRICES: Record<ServiceType, number> = {
  diplom: 150000,
  kurs: 60000,
  referat: 25000,
  mustaqil: 20000,
  slayd: 20000,
  maruza: 15000,
  laboratoriya: 25000,
  amaliyot: 45000,
  konspekt: 10000,
  ai_yordamchi: 0,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or fallbacks
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('talabago_lang') as Language) || 'uz';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('talabago_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('talabago_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_USER];
      }
    }
    return [
      INITIAL_USER,
      {
        id: '92418532',
        name: 'Malika Karimova',
        email: 'malika.k@student.uz',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        university: 'O‘zbekiston Milliy Universiteti',
        faculty: 'Iqtisodiyot',
        major: 'Moliya va bank ishi',
        course: '4-kurs',
        balance: 45000,
        role: 'student',
        savedJobs: [],
        savedApartments: [],
        createdAt: '2026-09-12',
      },
      {
        id: '67120943',
        name: 'Jasur Bekmurodov',
        email: 'jasurbek@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        university: 'Toshkent Davlat Texnika Universiteti',
        faculty: 'Mexanika',
        major: 'Mashinasozlik texnologiyasi',
        course: '2-kurs',
        balance: 80000,
        role: 'student',
        savedJobs: ['job-1'],
        savedApartments: [],
        createdAt: '2026-09-20',
      },
    ];
  });

  const [prices, setPrices] = useState<Record<ServiceType, number>>(() => {
    const saved = localStorage.getItem('talabago_prices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PRICES;
      }
    }
    return DEFAULT_PRICES;
  });

  const [adminTelegram, setAdminTelegramState] = useState<string>(() => {
    return localStorage.getItem('talabago_admin_tg') || 'talabago_admin';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('talabago_txs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'tx-1',
        userId: '58321476',
        type: 'topup',
        amount: 100000,
        title: 'Boshlang‘ich balans to‘ldirildi',
        date: '2026-10-01 14:30',
        status: 'completed',
      },
    ];
  });

  const [documents, setDocuments] = useState<GeneratedDocument[]>(() => {
    const saved = localStorage.getItem('talabago_documents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [presentations, setPresentations] = useState<GeneratedPresentation[]>(() => {
    const saved = localStorage.getItem('talabago_presentations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('talabago_jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_JOBS;
      }
    }
    return INITIAL_JOBS;
  });

  const [apartments, setApartments] = useState<ApartmentListing[]>(() => {
    const saved = localStorage.getItem('talabago_apartments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_APARTMENTS;
      }
    }
    return INITIAL_APARTMENTS;
  });

  const [lectures] = useState<LectureItem[]>(INITIAL_LECTURES);

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    return [
      { code: 'TALABA2026', bonusAmount: 20000, maxUses: 1000, usedCount: 142, active: true },
      { code: 'GRANT', bonusAmount: 50000, maxUses: 500, usedCount: 88, active: true },
      { code: 'START', bonusAmount: 10000, maxUses: 2000, usedCount: 450, active: true },
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Xush kelibsiz!',
      message: 'TalabaGO platformasiga xush kelibsiz. Balansingizda 100 000 so‘m mavjud.',
      time: 'Hozir',
      type: 'bonus',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Yangi ish e’loni',
      message: 'IT Park hududida talabalar uchun yangi Junior dasturchi vakansiyasi qo‘shildi.',
      time: '1 soat oldin',
      type: 'job',
      read: false,
    },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'study' | 'create' | 'jobs' | 'housing' | 'profile' | 'admin'>('home');
  const [selectedDocService, setSelectedDocService] = useState<ServiceType | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activePresentation, setActivePresentation] = useState<GeneratedPresentation | null>(null);
  const [activeViewingDoc, setActiveViewingDoc] = useState<GeneratedDocument | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [addListingType, setAddListingType] = useState<'job' | 'apartment'>('job');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('talabago_lang', language);
  }, [language]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('talabago_current_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('talabago_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('talabago_prices', JSON.stringify(prices));
  }, [prices]);

  useEffect(() => {
    localStorage.setItem('talabago_admin_tg', adminTelegram);
  }, [adminTelegram]);

  useEffect(() => {
    localStorage.setItem('talabago_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('talabago_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('talabago_presentations', JSON.stringify(presentations));
  }, [presentations]);

  useEffect(() => {
    localStorage.setItem('talabago_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('talabago_apartments', JSON.stringify(apartments));
  }, [apartments]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.uz[key] || key;
  };

  const updatePrice = (service: ServiceType, newPrice: number) => {
    setPrices((prev) => ({ ...prev, [service]: newPrice }));
    addNotification({
      title: 'Narxlar yangilandi',
      message: `${service.toUpperCase()} narxi ${newPrice.toLocaleString()} so‘mga o‘zgartirildi.`,
      type: 'info',
    });
  };

  const setAdminTelegram = (tg: string) => {
    const cleanTg = tg.replace('@', '').trim();
    setAdminTelegramState(cleanTg);
  };

  const updateUserBalance = (userId: string, deltaAmount: number, reason: string): boolean => {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return false;

    const newBalance = targetUser.balance + deltaAmount;
    if (newBalance < 0) return false;

    // Update in usersList
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u))
    );

    // Update active user if same
    if (user && user.id === userId) {
      setUser((prev) => (prev ? { ...prev, balance: newBalance } : null));
    }

    // Add transaction record
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: deltaAmount >= 0 ? 'topup' : 'spend',
      amount: Math.abs(deltaAmount),
      title: reason,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    if (deltaAmount > 0) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      addNotification({
        title: 'Balans to‘ldirildi',
        message: `ID ${userId}: Balansingizga +${deltaAmount.toLocaleString()} so‘m qo‘shildi. Yangi balans: ${newBalance.toLocaleString()} so‘m.`,
        type: 'balance',
      });
    }

    return true;
  };

  const toggleBlockUser = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const addDocument = (doc: GeneratedDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    addNotification({
      title: 'Buyurtma tayyor bo‘ldi!',
      message: `"${doc.data.title}" nomli ${doc.serviceType.toUpperCase()} hujjatingiz to‘liq tayyor. DOCX va PDF formatda yuklab olishingiz mumkin.`,
      type: 'order',
    });
  };

  const addPresentation = (pres: GeneratedPresentation) => {
    setPresentations((prev) => [pres, ...prev]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    addNotification({
      title: 'Prezentatsiya tayyor!',
      message: `"${pres.topic}" bo‘yicha ${pres.slideCount} ta slayd muvaffaqiyatli generatsiya qilindi.`,
      type: 'order',
    });
  };

  const addJob = (jobData: Omit<JobListing, 'id' | 'createdAt' | 'status'>) => {
    const newJob: JobListing = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'active',
    };
    setJobs((prev) => [newJob, ...prev]);
    addNotification({
      title: 'Yangi ish e’loni berildi',
      message: `"${newJob.title}" e’loningiz muvaffaqiyatli joylashtirildi.`,
      type: 'job',
    });
  };

  const addApartment = (aptData: Omit<ApartmentListing, 'id' | 'createdAt' | 'status'>) => {
    const newApt: ApartmentListing = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'active',
    };
    setApartments((prev) => [newApt, ...prev]);
    addNotification({
      title: 'Yangi kvartira e’loni berildi',
      message: `"${newApt.title}" kvartira e’loningiz joylashtirildi.`,
      type: 'apartment',
    });
  };

  const toggleSaveJob = (id: string) => {
    if (!user) return;
    const exists = user.savedJobs.includes(id);
    const updated = exists ? user.savedJobs.filter((j) => j !== id) : [...user.savedJobs, id];
    setUser({ ...user, savedJobs: updated });
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? { ...u, savedJobs: updated } : u)));
  };

  const toggleSaveApartment = (id: string) => {
    if (!user) return;
    const exists = user.savedApartments.includes(id);
    const updated = exists
      ? user.savedApartments.filter((a) => a !== id)
      : [...user.savedApartments, id];
    setUser({ ...user, savedApartments: updated });
    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, savedApartments: updated } : u))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `n-${Date.now()}`,
      time: 'Hozir',
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const applyPromoCode = (codeText: string) => {
    const cleanCode = codeText.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === cleanCode && p.active);
    if (!found) {
      return { success: false, message: 'Bunday promo-kod mavjud emas yoki muddati o‘tgan' };
    }
    if (found.usedCount >= found.maxUses) {
      return { success: false, message: 'Ushbu promo-kodning foydalanish limiti tugagan' };
    }
    if (!user) return { success: false, message: 'Iltimos, avval tizimga kiring' };

    // Apply bonus
    updateUserBalance(user.id, found.bonusAmount, `Promo-kod bonusi: ${found.code}`);
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === cleanCode ? { ...p, usedCount: p.usedCount + 1 } : p))
    );

    return {
      success: true,
      message: `Tabriklaymiz! Balansingizga ${found.bonusAmount.toLocaleString()} so‘m bonus qo‘shildi.`,
      bonus: found.bonusAmount,
    };
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
  };

  // Generate unique 8-digit ID
  const generate8DigitId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const loginAs = (email: string, name?: string) => {
    const isSuper = email.toLowerCase() === 'azizbekshovqiddinov102@gmail.com';
    const existing = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setUser(existing);
      addNotification({
        title: 'Tizimga kirildi',
        message: `Salom, ${existing.name}! ID: ${existing.id}`,
        type: 'info',
      });
    } else {
      const newUser: User = {
        id: generate8DigitId(),
        name: name || email.split('@')[0],
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        university: 'Toshkent Axborot Texnologiyalari Universiteti',
        faculty: 'Kompyuter injiniringi',
        major: 'Axborot xavfsizligi',
        course: '1-kurs',
        balance: 50000, // Initial bonus
        role: isSuper ? 'superadmin' : 'student',
        savedJobs: [],
        savedApartments: [],
        createdAt: new Date().toISOString(),
      };
      setUsersList((prev) => [newUser, ...prev]);
      setUser(newUser);
      addNotification({
        title: 'Ro‘yxatdan o‘tildi!',
        message: `Sizga noyob 8 xonali ID berildi: ${newUser.id}. Boshlang‘ich 50 000 so‘m balansingizda mavjud!`,
        type: 'bonus',
      });
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('talabago_current_user');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    localStorage.setItem('talabago_current_user', JSON.stringify(updatedUser));
  };

  const openDocModal = (type?: ServiceType) => {
    setSelectedDocService(type || 'diplom');
  };

  const closeDocModal = () => {
    setSelectedDocService(null);
  };

  const openSlideModal = () => {
    setIsSlideModalOpen(true);
  };

  const closeSlideModal = () => {
    setIsSlideModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        language,
        setLanguage,
        t,
        prices,
        updatePrice,
        adminTelegram,
        setAdminTelegram,
        usersList,
        updateUserBalance,
        toggleBlockUser,
        transactions,
        addTransaction,
        documents,
        addDocument,
        presentations,
        addPresentation,
        jobs,
        addJob,
        apartments,
        addApartment,
        lectures,
        savedJobs: user?.savedJobs || [],
        toggleSaveJob,
        savedApartments: user?.savedApartments || [],
        toggleSaveApartment,
        notifications,
        markNotificationAsRead,
        addNotification,
        promoCodes,
        applyPromoCode,
        addPromoCode,
        loginAs,
        logout,
        updateUserProfile,
        activeTab,
        setActiveTab,
        openDocModal,
        closeDocModal,
        selectedDocService,
        openSlideModal,
        closeSlideModal: () => setIsSlideModalOpen(false),
        isSlideModalOpen,
        setIsSlideModalOpen,
        isTopUpOpen,
        setIsTopUpOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        activePresentation,
        setActivePresentation,
        activeViewingDoc,
        setActiveViewingDoc,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isAddListingOpen,
        setIsAddListingOpen,
        addListingType,
        setAddListingType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

