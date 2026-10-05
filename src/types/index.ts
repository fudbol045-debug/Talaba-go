export type Language = 'uz' | 'ru' | 'en' | 'zh' | 'kk' | 'ky';

export type ServiceType =
  | 'diplom'
  | 'kurs'
  | 'referat'
  | 'mustaqil'
  | 'slayd'
  | 'maruza'
  | 'laboratoriya'
  | 'amaliyot'
  | 'konspekt'
  | 'ai_yordamchi';

export interface User {
  id: string; // 8-digit ID, e.g. "58321476"
  name: string;
  email: string;
  avatar: string;
  university: string;
  faculty: string;
  major: string;
  course: string;
  balance: number; // in Uzbek so'm, e.g. 100000
  role: 'student' | 'superadmin';
  savedJobs: string[];
  savedApartments: string[];
  createdAt: string;
  isBlocked?: boolean;
}

export interface GeneratedDocument {
  id: string;
  userId: string;
  serviceType: ServiceType;
  topic: string;
  language: Language;
  createdAt: string;
  price: number;
  data: {
    title: string;
    serviceType: string;
    language: string;
    academicDegree?: string;
    tableOfContents: string[];
    introduction: string;
    sections: {
      chapterNumber: string;
      title: string;
      subSections?: {
        number: string;
        title: string;
        content: string;
      }[];
      tableData?: {
        title: string;
        headers: string[];
        rows: string[][];
      };
    }[];
    conclusion: string;
    references: string[];
    appendices?: string[];
  };
}

export interface SlideItem {
  slideNumber: number;
  layout: 'hero' | 'split' | 'cards' | 'timeline' | 'quote';
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visualType: 'chart' | 'icon-grid' | 'process' | 'photo' | 'stat';
  visualDescription: string;
  speakerNotes: string;
}

export interface GeneratedPresentation {
  id: string;
  userId: string;
  topic: string;
  style: 'Minimal' | 'Professional' | 'Universitet' | 'Business' | 'Modern';
  slideCount: number;
  language: Language;
  createdAt: string;
  price: number;
  slides: SlideItem[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  salary: string; // e.g. "4 500 000 so'm" or "500$"
  workTime: string; // e.g. "14:00 - 18:00 (Darsdan keyin)"
  requirements: string[];
  description: string;
  contactPhone: string;
  telegramUsername: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    city: string;
  };
  images: string[];
  category: string;
  createdAt: string;
  status: 'active' | 'pending' | 'rejected';
}

export interface ApartmentListing {
  id: string;
  title: string;
  price: string; // e.g. "1 800 000 so'm/oy"
  rooms: number;
  area: number; // in sq.m
  furniture: string[];
  conditions: string[];
  contactPhone: string;
  telegramUsername: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    city: string;
    nearUniversity?: string;
  };
  images: string[];
  district: string;
  createdAt: string;
  status: 'active' | 'pending' | 'rejected';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'topup' | 'spend' | 'bonus';
  amount: number; // in so'm
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  orderId?: string;
}

export interface LectureItem {
  id: string;
  subject: string;
  title: string;
  author: string;
  pages: number;
  content: string;
  tags: string[];
  pdfDownloadUrl?: string;
  audioVoice?: string;
  hasAudio?: boolean;
}

export interface PromoCode {
  code: string;
  bonusAmount: number; // in so'm
  maxUses: number;
  usedCount: number;
  active: boolean;
}

export interface PlatformConfig {
  adminEmail: string;
  adminTelegram: string;
  prices: Record<ServiceType, number>;
  promos: PromoCode[];
}
