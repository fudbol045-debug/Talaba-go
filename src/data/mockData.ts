import { ApartmentListing, JobListing, LectureItem, User } from '../types';

export const INITIAL_USER: User = {
  id: '58321476',
  name: 'Azizbek Shovqiddinov',
  email: 'azizbekshovqiddinov102@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  university: 'Toshkent Axborot Texnologiyalari Universiteti (TATU)',
  faculty: 'Dasturiy injiniring',
  major: 'Sun’iy intellekt va ma’lumotlar tahlili',
  course: '3-kurs',
  balance: 100000,
  role: 'superadmin',
  savedJobs: ['job-1', 'job-3'],
  savedApartments: ['apt-1'],
  createdAt: '2026-09-01T10:00:00.000Z',
};

export const UNIVERSITIES_LIST = [
  'O‘zbekiston Milliy Universiteti (O‘zMU)',
  'Toshkent Axborot Texnologiyalari Universiteti (TATU)',
  'Toshkent Davlat Iqtisodiyot Universiteti (TDIU)',
  'Toshkent Davlat Yuridik Universiteti (TDYU)',
  'O‘zbekiston Davlat Jahon Tillari Universiteti (O‘zDJTU)',
  'Toshkent Davlat Pedagogika Universiteti (TDPU)',
  'Toshkent Davlat Transport Universiteti (ToshDTrU)',
  'Toshkent Davlat Texnika Universiteti (TDTU)',
  'Samarqand Davlat Universiteti (SamDU)',
  'Toshkent Tibbiyot Akademiyasi (TTA)',
  'Westminster Xalqaro Universiteti (WIUT)',
  'Inha Universiteti (IUT)',
  'Amity Universiteti',
  'Farg‘ona Davlat Universiteti',
  'Buxoro Davlat Universiteti',
  'Andijon Davlat Universiteti',
];

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-1',
    title: 'Junior Frontend Dasturchi (Moslashuvchan grafik)',
    company: 'NextGen IT Solutions & Fintech',
    salary: '4 500 000 — 6 000 000 so‘m',
    workTime: '14:00 - 18:00 (Talabalar uchun qulay)',
    category: 'IT va Dasturlash',
    description: 'Biz talaba dasturchilarni jamoamizga taklif qilamiz! React, TypeScript va Tailwind CSS bo‘yicha boshlang‘ich tajribaga ega bo‘lsangiz, amaliy loyihalarda o‘rganish va yaxshi daromad topish imkoniyati.',
    requirements: [
      'HTML/CSS va JavaScript/TypeScript asoslarini bilish',
      'React yoki Vue bilan kichik loyihalar yaratganlik',
      'Haftasiga 20-25 soat darsdan keyin ishlash imkoniyati',
      'Jamoada samimiy muloqot',
    ],
    contactPhone: '+998 (90) 123-45-67',
    telegramUsername: 'it_recruiter_tashkent',
    location: {
      address: 'Toshkent sh., Mirzo Ulug‘bek tumani, IT Park hududi',
      city: 'Toshkent',
      lat: 41.3385,
      lng: 69.3345,
    },
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-01',
    status: 'active',
  },
  {
    id: 'job-2',
    title: 'Ingliz tili repetitori (IELTS / General English)',
    company: 'StudySmart O‘quv Markazi',
    salary: '3 500 000 — 7 000 000 so‘m',
    workTime: '15:30 - 19:30 (Haftada 3-4 kun)',
    category: 'Ta’lim va Repetitorlik',
    description: 'O‘zDJTU, Westminster yoki boshqa OTM talabalari uchun ajoyib imkoniyat. Bolalar va o‘smirlarga ingliz tilidan dars berish, qiziqarli speaking clublar tashkil etish.',
    requirements: [
      'IELTS 7.0+ yoki CEFR C1 sertifikati',
      'Ochiqko‘ngil va bolalar bilan oson til topisha olish',
      'Mas’uliyatli va vaqtida dars boshlash',
    ],
    contactPhone: '+998 (97) 765-43-21',
    telegramUsername: 'studysmart_hr',
    location: {
      address: 'Toshkent sh., Yunusobod 11-mavze, O‘zMU talabalar shaharchasi yaqinida',
      city: 'Toshkent',
      lat: 41.3654,
      lng: 69.2882,
    },
    images: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-02',
    status: 'active',
  },
  {
    id: 'job-3',
    title: 'Barista & Coffee Maker (Talabalar smenasi)',
    company: 'Bean & Bloom Coffee House',
    salary: '2 800 000 — 4 200 000 so‘m + choypuli',
    workTime: '08:00 - 14:00 yoki 14:00 - 21:00',
    category: 'Xizmat ko‘rsatish va Kafe',
    description: 'Qahvaxonamizda talabalar uchun qulay smena grafiklari mavjud. Qahva tayyorlash sirlari bepul o‘rgatiladi, tushlik va yoqimli musiqiy muhit ta’minlanadi.',
    requirements: [
      'Xushmuomala va do‘stona bo‘lish',
      'Tozalik va tartibga rioya qilish',
      'Tajriba shart emas, bepul o‘rgatamiz',
    ],
    contactPhone: '+998 (99) 888-99-11',
    telegramUsername: 'beanbloom_manager',
    location: {
      address: 'Toshkent sh., Yakkasaroy tumani, Shota Rustaveli ko‘chasi 45',
      city: 'Toshkent',
      lat: 41.2872,
      lng: 69.2561,
    },
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-03',
    status: 'active',
  },
  {
    id: 'job-4',
    title: 'SMM va Kontent Yaratuvchi (Telegram/Instagram)',
    company: 'EduBrand Media Group',
    salary: '3 000 000 — 5 000 000 so‘m (Bonuslar bilan)',
    workTime: 'Yarim stavka / Masofaviy (Remote)',
    category: 'Marketing va Dizayn',
    description: 'Kreativ talabalar uchun masofaviy qulay ish! Qisqa roliklar (Reels, TikTok) g‘oyalarini yozish, Canva/CapCut orqali sodda vizuallarni tayyorlash.',
    requirements: [
      'Ijtimoiy tarmoqlardagi trendlarni tushunish',
      'CapCut yoki VN orqali video montaj qila olish',
      'Matnlarni savodli yozish (O‘zbek yoki Rus tilida)',
    ],
    contactPhone: '+998 (93) 555-12-34',
    telegramUsername: 'edubrand_jobs',
    location: {
      address: 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi',
      city: 'Toshkent',
      lat: 41.2789,
      lng: 69.2156,
    },
    images: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-04',
    status: 'active',
  },
];

export const INITIAL_APARTMENTS: ApartmentListing[] = [
  {
    id: 'apt-1',
    title: 'Beruniy metrosi va Talabalar shaharchasi yonida 2 xonali kvartira',
    price: '2 200 000 so‘m/oy (kishi boshiga 1 100 000)',
    rooms: 2,
    area: 58,
    district: 'Olmazor tumani',
    furniture: [
      'Tezkor Wi-Fi (Optika)',
      'Avtomat kir yuvish mashinasi',
      'Ikki kamerali muzlatgich',
      'Dars qilish uchun stollar va qulay stullar',
      'Konditsioner',
      'Mikroto‘lqinli pech',
      'Issiq suv va gaz doimiy',
    ],
    conditions: [
      'Faqat talaba yigitlar yoki qizlar uchun (ijara shartnomasi qilinadi)',
      'Tartibli, chekmaydigan va darsga xalaqit bermaydigan talabalar',
      'Kommunal to‘lovlar hisoblagich bo‘yicha bo‘linadi',
    ],
    contactPhone: '+998 (90) 912-33-44',
    telegramUsername: 'olmazor_ijara',
    location: {
      address: 'Toshkent sh., Olmazor tumani, Universitet ko‘chasi 14 (O‘zMU va TATUga 5 daqiqalik yo‘l)',
      city: 'Toshkent',
      nearUniversity: 'O‘zMU va TATU',
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
    createdAt: '2026-10-02',
    status: 'active',
  },
  {
    id: 'apt-2',
    title: 'Chilonzor metrosiga yaqin shinam 3 xonali kvartira (Talabalar uchun)',
    price: '3 600 000 so‘m/oy (3-4 talaba uchun qulay)',
    rooms: 3,
    area: 76,
    district: 'Chilonzor tumani',
    furniture: [
      'Wi-Fi internet',
      'Yangi krovatlar va toza matraslar',
      'Kir yuvish mashinasi',
      'Muzlatgich',
      'Shkaf va kitob javonlari',
      'Changyutgich',
    ],
    conditions: [
      'Rasmiy ijara shartnomasi (kontrakt summasiga ega talabalarga davlat kompensatsiyasi olish uchun hujjat beriladi)',
      'Tinchtalik va tozalik saqlash shart',
    ],
    contactPhone: '+998 (93) 180-22-11',
    telegramUsername: 'chilonzor_dom',
    location: {
      address: 'Toshkent sh., Chilonzor 7-mavze, Mirzo Ulug‘bek metrosi yaqinida (TDIU va TDPUga qulay transport)',
      city: 'Toshkent',
      nearUniversity: 'TDIU va TDPU',
      lat: 41.2825,
      lng: 69.2045,
    },
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee1b2da97b0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-03',
    status: 'active',
  },
  {
    id: 'apt-3',
    title: 'Yunusobod 4-mavze, Yangi ta’mirlangan 1 xonali studiya',
    price: '2 000 000 so‘m/oy (1 yoki 2 talaba uchun)',
    rooms: 1,
    area: 42,
    district: 'Yunusobod tumani',
    furniture: [
      'Zamonaviy mebellar',
      'Konditsioner',
      'Smart TV va Wi-Fi',
      'Plita va muzlatgich',
      'Balkon va quritgich',
    ],
    conditions: [
      'O‘qishiga e’tiborli talabalar uchun',
      'To‘lov har oyning 1-sanasida',
    ],
    contactPhone: '+998 (97) 400-55-66',
    telegramUsername: 'yunusobod_flat',
    location: {
      address: 'Toshkent sh., Yunusobod tumani, Ahmad Donish ko‘chasi',
      city: 'Toshkent',
      lat: 41.3712,
      lng: 69.2941,
    },
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-10-04',
    status: 'active',
  },
];

export const INITIAL_LECTURES: LectureItem[] = [
  {
    id: 'lec-1',
    subject: 'Informatika va IT',
    title: 'Sun’iy intellekt va neyron tarmoqlar arxitekturasi',
    author: 'Prof. A. N. Karimov (TATU)',
    pages: 14,
    tags: ['Machine Learning', 'Neyron Tarmoq', 'Python', 'AI'],
    hasAudio: true,
    content: `1. KIRISH VA KONSEPSIYA
Sun’iy intellekt (SI) — inson aqliy faoliyatiga xos bo‘lgan xususiyatlarni (o‘rganish, xulosa chiqarish, umumlashtirish) kompyuter tizimlarida modellashtirish sohasidir.

2. ASOSIY ARXITEKTURALAR:
- Perseptron va ko‘p qatlamli neyron tarmoqlar (MLP)
- Konvolyutsion neyron tarmoqlar (CNN) — tasvirlarni tanib olish uchun
- Rekurrent neyron tarmoqlar (RNN / LSTM) — ketma-ketlik va matn tahlili
- Transformerlar va Self-Attention mexanizmi — zamonaviy Large Language Models (LLM) asosi.

3. O‘QITISH METODLARI:
- Nazorat ostida o‘qitish (Supervised Learning)
- Nazoratsiz o‘qitish (Unsupervised Learning)
- Mustahkamlovchi o‘rganish (Reinforcement Learning)

XULOSA:
Bugungi kunda neyron tarmoqlar ta’lim, tibbiyot, bank va sanoatda inson mehnatining samaradorligini o‘nlab barobar oshirmoqda.`,
  },
  {
    id: 'lec-2',
    subject: 'Iqtisodiyot',
    title: 'Makroiqtisodiy barqarorlik va inflyatsiyani jilovlash mexanizmlari',
    author: 'Dotsent Sh. M. Ergashev (TDIU)',
    pages: 18,
    tags: ['Makroiqtisodiyot', 'Monetar Siyosat', 'Inflyatsiya', 'Markaziy Bank'],
    hasAudio: true,
    content: `1. INFLYATSIYANING TABIATI VA TURiLARI
Inflyatsiya — mamlakatda tovarlar va xizmatlar umumiy narx darajasining barqaror o‘sishi hamda milliy valyuta xarid qobiliyatining pasayishi demakdir.

2. ASOSIY SABABLAR:
- Talab inflyatsiyasi (Demand-pull inflation)
- Xarajatlar inflyatsiyasi (Cost-push inflation)
- Import qilinadigan inflyatsiya

3. MONETAR SIYOSAT CHORALARI:
- Markaziy bank qayta moliyalash stavkasi (asosiy stavka)
- Majburiy zaxira talablari
- Ochiq bozordagi operatsiyalar (obligatsiyalar savdosi)

XULOSA:
Inflyatsiyani 5% li maqsadli targetga tushirish uchun qat’iy monetar siyosat bilan birga raqobat muhitini yaxshilash va ishlab chiqarishni rag‘batlantirish talab etiladi.`,
  },
  {
    id: 'lec-3',
    subject: 'Matematika',
    title: 'Matritsalar algebrasi va chiziqli tenglamalar sistemasi',
    author: 'F.m.f.d. R. Q. Jo‘rayev (O‘zMU)',
    pages: 12,
    tags: ['Chiziqli Algebra', 'Matritsa', 'Kramer Qoidasi', 'Gaus Metodi'],
    hasAudio: true,
    content: `1. MATRITSA TUSHUNCHASI
Matritsa deb m ta satr va n ta ustundan iborat to‘g‘ri to‘rtburchak shakldagi sonlar jadvaliga aytiladi.

2. ASOSIY AMALLAR:
- Matritsalarni qo‘shish va ayirish (o‘lchamlari bir xil bo‘lganda)
- Matritsani songa ko‘paytirish
- Matritsalarni o‘zaro ko‘paytirish (A matritsaning ustunlari soni B matritsaning satrlari soniga teng bo‘lishi zarur)

3. CHIZIQLI TENGLAMALARNI YECHISH USULLARI:
- Gauss usuli (qadam-baqadam yo‘qotish)
- Kramer qoidasi (determinantlar yordamida)
- Teskari matritsa usuli: X = A^(-1) * B.`,
  },
  {
    id: 'lec-4',
    subject: 'Huquq',
    title: 'Mehnat shartnomasi va yosh mutaxassislarning huquqiy kafolatlari',
    author: 'Dots. U. K. Saidov (TDYU)',
    pages: 16,
    tags: ['Mehnat Huquqi', 'Shartnoma', 'Talabalar Huquqi', 'Kafolatlar'],
    hasAudio: true,
    content: `1. MEHNAT SHARTNOMASI TUSHUNCHASI
Mehnat shartnomasi — xodim bilan ish beruvchi o‘rtasida tuzilgan, tomonlarning o‘zaro huquq va majburiyatlarini belgilovchi asosiy huquqiy hujjatdir.

2. TALABA VA YOSHLARGA BERILGAN IMTIYOZLAR:
- Ta’lim olayotgan xodimlar uchun qisqartirilgan ish vaqti
- Sessiya va davlat imtihonlari vaqtida haq to‘lanadigan ta’lim ta’tili olish huquqi
- Sinov muddati belgilanmaydigan toifalar (OTMni tamomlaganiga 3 yildan oshmagan yosh mutaxassislar).`,
  },
  {
    id: 'lec-5',
    subject: 'Fizika',
    title: 'Kvant mexanikasi asoslari va fotoeffekt hodisasi',
    author: 'Prof. X. B. Ahmedov (SamDU)',
    pages: 15,
    tags: ['Kvant Fizikasi', 'Foton', 'Fotoeffekt', 'Eynshteyn'],
    hasAudio: true,
    content: `1. KVANT FARAZI
1900-yilda Maks Plank energiya uzluksiz emas, balki kvantlar (porsiyalar) shaklida nurlanishi haqidagi inqilobiy g‘oyani ilgari surdi: E = h * nu.

2. FOTOEFFEKT QONUNLARI VA EYNSHTEYN TENGLAMASI:
h * nu = A_chiqish + (m * v^2) / 2
Bu yerda A_chiqish — elektronning moddadan chiqish ishi.

3. TEXNIKADA QO‘LLANILISHI:
Quyosh batareyalari, fotodiodlar, tungi ko‘rish asboblari va kvant kompyuterlari aynan ushbu tamoyilga asoslanadi.`,
  },
  {
    id: 'lec-6',
    subject: 'Kimyo',
    title: 'Organik sintez va polimer materiallar kimyosi',
    author: 'Dots. D. T. Alimov',
    pages: 13,
    tags: ['Organik Kimyo', 'Polimerlar', 'Plastmassa', 'Reaksiya'],
    hasAudio: true,
    content: `1. POLIMERLANISH JARAYONI
Polimerlar — molekulalari juda ko‘p sonli monomer bo‘g‘inlarining o‘zaro birikishidan hosil bo‘ladigan yuqori molekulyar birikmalardir.

2. SINFLANISHI:
- Tabiiy polimerlar (oqsil, kraxmal, tsellyuloza, tabiiy kauchuk)
- Sintetik polimerlar (polietilen, polipropilen, teflon, neylon)

3. ZAMONAVIY TENDENSIYA:
Ekologik toza va tabiatda tez parparalanadigan biomateriallarni yaratish.`,
  },
];
