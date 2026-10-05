import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Mock or fallback responses may be returned.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. AI Document Generator (Diplom ishi, Kurs ishi, Referat, Mustaqil ish, Laboratoriya, Amaliyot hisoboti, Konspekt)
app.post('/api/ai/generate-document', async (req, res) => {
  try {
    const {
      serviceType,
      topic,
      language = 'uz',
      length = 'standard',
      additionalNotes = '',
      university = 'O‘zbekiston Milliy Universiteti',
      faculty = '',
      studentName = 'Talaba',
      studentId = '',
    } = req.body;

    if (!topic || !serviceType) {
      return res.status(400).json({ error: 'Mavzu va xizmat turi talab qilinadi' });
    }

    const langNames: Record<string, string> = {
      uz: "O'zbek tili (lotin yozuvida, akademik va imloviy qoidalarga qat'iy rioya qilgan holda)",
      ru: "Русский язык (академический, научный стиль)",
      en: "English (Academic university standard)",
      zh: "中文 (学术标准)",
      kk: "Қазақ тілі (академиялық стиль)",
      ky: "Кыргыз тили (академиялык стиль)",
    };

    const targetLang = langNames[language] || langNames.uz;

    const systemPrompt = `Siz TalabaGO platformasining bosh ilmiy AI ekspertisiz. 
Talabalar uchun oliy ta'lim andozalariga mos keluvchi professional ilmiy-tadqiqot hujjatlarini yaratasiz.
HUJJAT TILI: Siz barcha matn, sarlavhalar, jadvallar va xulosalarni FAQAT SHU TILDA yozishingiz shart: ${targetLang}.
Hujjat turi: ${serviceType}.
Mavzu: "${topic}".
Foydalanuvchi ma'lumotlari: Universitet: ${university}, Fakultet: ${faculty || 'Umumiy'}, Talaba: ${studentName}, ID: ${studentId}.
Qo'shimcha talablar: ${additionalNotes || 'Standart talablar'}.

Talabalar uchun tayyorlanadigan hujjat tarkibi talablari:
1. Diplom ishi: Titul varaq, Mundarija, Kirish (dolzarbligi, obyekti, predmeti, maqsad va vazifalari, metodologiyasi), kamida 3 ta asosiy Bob (har bir bobda 2-3 tadan bo'lim), amaliy jadvallar va diagramma tavsiflari, Xulosa va ilmiy-amaliy tavsiyalar, Foydalanilgan adabiyotlar (kamida 10-15 ta manba), Ilovalar.
2. Kurs ishi: Titul, Mundarija, Kirish, 2-3 ta bob va bo'limlar, tahlil va formulalar/jadvallar, Xulosa, Foydalanilgan adabiyotlar (kamida 8 ta).
3. Referat: Titul, Reja/Mundarija, Kirish, Asosiy qism (3-4 ta reja bandi), Xulosa, Adabiyotlar ro'yxati.
4. Mustaqil ish: Titul, Reja, Asosiy nazariy va amaliy matn, Savol-javoblar, Xulosa, Manbalar.
5. Laboratoriya ishi: Ishning maqsadi, Nazariy qism, Kerakli asbob-uskunalar va reaktivlar/dasturlar, Ishni bajarish tartibi (bosqichma-bosqich), Tajriba ma'lumotlari va hisob-kitoblar (jadval), Xulosa.
6. Amaliyot hisoboti: Titul, Mundarija, Tashkilot faoliyati haqida umumiy ma'lumot, Amaliyot davomida bajarilgan ishlar kundaligi, Tahliliy qism, Xulosa va takliflar, Adabiyotlar.
7. Konspekt: Asosiy qoidalar, ta'riflar, tezislar, formulalar va jadval ko'rinishidagi ixchamlashtirilgan o'quv konspekti.

Javobni FAQAT to'g'ridan-to'g'ri toza JSON formatida qaytaring (hech qanday markdown \`\`\`json belgilarsiz yoki toza JSON string shaklida):
{
  "title": "Hujjatning to'liq ilmiy mavzusi",
  "serviceType": "${serviceType}",
  "language": "${language}",
  "academicDegree": "Bakalavr / Kurs ishi / Magistr",
  "tableOfContents": [
    "Kirish",
    "1-Bob. ...",
    "1.1. ...",
    "1.2. ...",
    "2-Bob. ...",
    "2.1. ...",
    "2.2. ...",
    "Xulosa",
    "Foydalanilgan adabiyotlar"
  ],
  "introduction": "Batafsil ilmiy kirish matni...",
  "sections": [
    {
      "chapterNumber": "1-Bob",
      "title": "Bob nomi",
      "subSections": [
        {
          "number": "1.1",
          "title": "Bo'lim nomi",
          "content": "Kengaytirilgan, teran va ilmiy dalillarga boy matn..."
        }
      ],
      "tableData": {
        "title": "Jadval nomi",
        "headers": ["№", "Ko'rsatkich", "Birlik", "Natija"],
        "rows": [["1", "Ko'rsatkich A", "foiz", "84.5%"]]
      }
    }
  ],
  "conclusion": "Batafsil ilmiy xulosa va amaliy takliflar...",
  "references": [
    "1. O'zbekiston Respublikasi Qonun hujjatlari...",
    "2. Muallif A. Ilmiy qo'llanma. Toshkent, 2024."
  ],
  "appendices": ["1-Ilova. Tashkiliy sxema", "2-Ilova. Qo'shimcha hisob-kitoblar"]
}`;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Mavzu bo'yicha yuqori sifatli ${serviceType} hujjatini tayyorlab ber: "${topic}". Til: ${targetLang}.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const rawText = response.text || '{}';
    let documentData;
    try {
      documentData = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      documentData = {
        title: topic,
        serviceType,
        language,
        introduction: rawText,
        sections: [
          {
            chapterNumber: '1-Bob',
            title: 'Asosiy qism',
            subSections: [{ number: '1.1', title: topic, content: rawText }],
          },
        ],
        conclusion: 'Hujjat muvaffaqiyatli shakllantirildi.',
        references: ["1. O'quv adabiyotlari va manbalar to'plami."],
      };
    }

    res.json({ success: true, data: documentData });
  } catch (error: any) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: error.message || 'Hujjat generatsiyasida xatolik yuz berdi' });
  }
});

// 2. AI Slides Generator (5, 10, 15, 20, 30 slides with styles)
app.post('/api/ai/generate-slides', async (req, res) => {
  try {
    const {
      topic,
      slideCount = 10,
      designStyle = 'Professional',
      language = 'uz',
      contentOutline = '',
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Mavzu kiritilishi shart' });
    }

    const langNames: Record<string, string> = {
      uz: "O'zbek tili",
      ru: 'Русский язык',
      en: 'English',
      zh: '中文',
      kk: 'Қазақ тілі',
      ky: 'Кыргыз тили',
    };
    const targetLang = langNames[language] || langNames.uz;

    const systemPrompt = `Siz prezentatsiyalar bo'yicha etakchi dizayner va o'qituvchisiz.
Talabalar uchun belgilangan slaydlar soni (${slideCount} ta slayd) va tanlangan uslub (${designStyle}) bo'yicha zamonaviy, ixcham, aniq va estetik slaydlar to'plamini tayyorlaysiz.
QOIDALAR:
1. Matn bilan slaydlarni to'ldirib tashlamang! Har bir slaydda sarlavha, 3-5 ta qisqa va o'tkir tezis (bullet points) va vizual tavsif bo'lsin.
2. Til: FAQAT ${targetLang}.
3. Slaydlar soni: Aniq ${slideCount} ta slayd yaratiladi.
4. Uslub: ${designStyle} (Minimal, Professional, Universitet, Business, Modern).

Qaytaring faqat toza JSON formatida:
{
  "presentationTitle": "${topic}",
  "style": "${designStyle}",
  "totalSlides": ${slideCount},
  "slides": [
    {
      "slideNumber": 1,
      "layout": "hero",
      "title": "Slayd sarlavhasi",
      "subtitle": "Kichik izoh yoki muallif",
      "bulletPoints": ["Muhim fikr 1", "Muhim fikr 2", "Muhim fikr 3"],
      "visualType": "chart | icon-grid | process | photo | stat",
      "visualDescription": "Tavsiya etilgan rasm yoki diagramma izohi",
      "speakerNotes": "Taqdimotchi nutqi uchun 1-2 jumla"
    }
  ]
}`;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Mavzu: "${topic}". Slaydlar soni: ${slideCount}. Uslub: ${designStyle}. Outline: ${contentOutline}.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const rawText = response.text || '{}';
    let presentationData;
    try {
      presentationData = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      presentationData = {
        presentationTitle: topic,
        style: designStyle,
        totalSlides: slideCount,
        slides: Array.from({ length: Number(slideCount) || 5 }, (_, i) => ({
          slideNumber: i + 1,
          layout: i === 0 ? 'hero' : 'split',
          title: `${topic} - ${i + 1}-qism`,
          subtitle: 'TalabaGO AI Generator',
          bulletPoints: [
            "Mavzuning dolzarb yo'nalishlari va tahlili",
            "Asosiy amaliy ko'rsatkichlar",
            "Natija va keyingi qadamlar",
          ],
          visualType: 'icon-grid',
          visualDescription: 'Mavzuga doir zamonaviy illyustratsiya',
          speakerNotes: 'Ushbu slaydda mavzuning asosiy g\'oyasi tushuntiriladi.',
        })),
      };
    }

    res.json({ success: true, data: presentationData });
  } catch (error: any) {
    console.error('Error generating slides:', error);
    res.status(500).json({ error: error.message || 'Slayd generatsiyasida xatolik yuz berdi' });
  }
});

// 3. AI Student Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'uz' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Xabar kiritilmadi' });
    }

    const ai = getAiClient();
    const contents: any[] = [];

    // History
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || '' }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `Siz TalabaGO platformasining do'stona, bilimdon va chaqqon AI yordamchisisiz. 
Talabalarga barcha fanlar (matematika, fizika, IT, iqtisod, huquq, til o'rganish) bo'yicha masalalarni tushuntirasiz, 
diplom va kurs ishlariga reja tuzasiz, ilmiy manbalar tavsiya qilasiz va imlo tekshirib berasiz.
Muloqot tili: Foydalanuvchi qaysi tilda yozsa, shu tilda (standart til: ${language}).
Javoblaringiz aniq, tushunarli va chiroyli formatlangan bo'lsin. Formulalar va misollarni aniq ko'rsating.`,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || 'Kechirasiz, javob olishda uzilish bo‘ldi.' });
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Chatda xatolik yuz berdi' });
  }
});

// 4. Gemini TTS (gemini-3.8-flash-lite-tts) for Lectures & Summaries
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Matn kiritilmadi' });
    }

    const trimmedText = text.slice(0, 1000); // safe limit for quick audio
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: 'Clear, engaging, educational university lecturer voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Ovoz generatsiya qilinmadi' });
    }

    res.json({ success: true, audioBase64: base64Audio });
  } catch (error: any) {
    console.error('Error in TTS:', error);
    res.status(500).json({ error: error.message || 'Audio ovozlashtirishda xatolik' });
  }
});

// 5. Global Study NLP Semantic Search across Lectures & Documents
app.post('/api/ai/nlp-search', async (req, res) => {
  try {
    const { query, language = 'uz', lectures = [], documents = [] } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Qidiruv so‘rovi kiritilmadi' });
    }

    // Build context summary of lectures and documents
    const corpusSummary = [
      ...lectures.map((l: any) => ({
        id: l.id,
        type: 'lecture',
        title: l.title,
        subject: l.subject,
        author: l.author,
        tags: Array.isArray(l.tags) ? l.tags.join(', ') : '',
        snippet: (l.content || '').slice(0, 400),
      })),
      ...documents.map((d: any) => ({
        id: d.id,
        type: 'document',
        title: d.data?.title || d.topic,
        subject: d.serviceType,
        snippet: (d.data?.introduction || '').slice(0, 400),
      })),
    ];

    const systemPrompt = `Siz TalabaGO platformasining o‘quv materiallari bo‘yicha aqlli semantik (Natural Language Processing) qidiruv tizimisiz.
Foydalanuvchi talaba sifatida erkin tabiiy tilda mavzu yoki savol so‘raydi. Masalan: "matritsalarni qanday ko‘paytiramiz", "neyron tarmoqlarning qanday turlari bor", "yashil iqtisodiyot va inflyatsiya", "mehnat huquqi bo‘yicha yoshlarga qanday imtiyozlar bor", "kvant fotoeffekti formulasi" va h.k.

Vazifangiz:
1. Talabaning tabiiy tildagi savolini chuqur tushunib, berilgan o‘quv materiallari (ma’ruzalar va hujjatlar) asosida qisqa, aniq va foydali ilmiy xulosa/javob (directAnswer) bering (2-3 jumla).
2. Materiallar bazasidan aynan shu so‘rovga mos keladiganlarini aniqlab, ularning id, relevanceScore (masalan 98, 85, 75) va qaysi jihati mos kelishini (highlightExcerpt) ko‘rsating.
3. Foydalanuvchiga tavsiya etiladigan 2-3 ta bog‘liq savol (suggestedQuestions) bering.
Muloqot tili: ${language === 'ru' ? 'Rus tili' : language === 'en' ? 'Ingliz tili' : 'O‘zbek tili'}.

Qaytaring FAQAT toza JSON formatida:
{
  "directAnswer": "Talabaning savoliga qisqa ilmiy tushuntirish...",
  "matches": [
    {
      "id": "material_id",
      "relevanceScore": 95,
      "highlightExcerpt": "Ushbu materialda aynan siz izlagan tushuncha bayon etilgan...",
      "matchedTopic": "Mavzu sarlavhasi"
    }
  ],
  "suggestedQuestions": ["Bog‘liq savol 1?", "Bog‘liq savol 2?"]
}`;

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Talaba so‘rovi: "${query}"\n\nMavjud materiallar bazasi:\n${JSON.stringify(corpusSummary, null, 2)}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const rawText = response.text || '{}';
    let result;
    try {
      result = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      result = {
        directAnswer: `"${query}" so‘rovi bo‘yicha materiallar tahlil qilindi.`,
        matches: corpusSummary.slice(0, 3).map((item) => ({
          id: item.id,
          relevanceScore: 85,
          highlightExcerpt: item.title,
          matchedTopic: item.title,
        })),
        suggestedQuestions: [],
      };
    }

    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error in NLP search:', error);
    res.status(500).json({ error: error.message || 'NLP qidiruvida xatolik yuz berdi' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TalabaGO server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
