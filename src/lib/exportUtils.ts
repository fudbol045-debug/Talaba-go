import { GeneratedDocument, GeneratedPresentation } from '../types';

/**
 * Downloads generated academic work as a clean, professionally formatted Microsoft Word (.doc/.docx compatible) document.
 */
export const exportToDocx = (doc: GeneratedDocument, userUniversity = 'O‘zbekiston Respublikasi Oliy Ta’lim Muassasasi') => {
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${doc.data.title}</title>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    line-height: 1.5;
    color: #000;
    margin: 3cm 2cm 2cm 3cm; /* Standard GOST academic margins */
  }
  .titul-center {
    text-align: center;
    margin-bottom: 2cm;
  }
  .titul-header {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 1.5cm;
  }
  .titul-title {
    font-size: 18pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 2cm 0;
  }
  .titul-author {
    margin-left: 50%;
    margin-top: 3cm;
    font-size: 14pt;
    line-height: 1.4;
  }
  .titul-footer {
    text-align: center;
    margin-top: 4cm;
    font-weight: bold;
  }
  .page-break {
    page-break-after: always;
  }
  h1 {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 24pt;
    margin-bottom: 12pt;
  }
  h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 8pt;
  }
  p {
    text-indent: 1.25cm;
    text-align: justify;
    margin-bottom: 8pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 12pt;
  }
  table, th, td {
    border: 1px solid black;
    padding: 6pt;
    text-align: center;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  ol, ul {
    margin-left: 1.5cm;
    margin-bottom: 12pt;
  }
  li {
    margin-bottom: 4pt;
  }
</style>
</head>
<body>

<!-- TITUL VARAQ -->
<div class="titul-center">
  <div class="titul-header">
    O‘ZBEKISTON RESPUBLIKASI OLIY TA’LIM, FAN VA INNOVATSIYALAR VAZIRLIGI<br>
    ${userUniversity.toUpperCase()}
  </div>
  
  <div style="font-size: 13pt; margin-top: 1cm;">
    MUTAXASSISLIK KAFEDRASI
  </div>

  <div class="titul-title">
    ${doc.data.title}
  </div>

  <div style="font-size: 14pt; font-style: italic;">
    ${doc.data.serviceType.toUpperCase()}
  </div>

  <div class="titul-author">
    <strong>Bajardi:</strong> TalabaGO foydalanuvchisi<br>
    <strong>Tekshirdi:</strong> Ilmiy rahbar<br>
    <strong>Baholandi:</strong> "____" ________ 2026-yil
  </div>

  <div class="titul-footer">
    TOSHKENT — 2026
  </div>
</div>

<div class="page-break"></div>

<!-- MUNDARIJA -->
<h1>MUNDARIJA</h1>
<ul style="list-style-type: none; padding-left: 0;">
  ${doc.data.tableOfContents
    .map(
      (item) => `
    <li style="border-bottom: 1px dotted #999; padding: 4pt 0; display: flex; justify-content: space-between;">
      <span>${item}</span>
    </li>
  `
    )
    .join('')}
</ul>

<div class="page-break"></div>

<!-- KIRISH -->
<h1>KIRISH</h1>
<p>${(doc.data.introduction || '').replace(/\n/g, '</p><p>')}</p>

<div class="page-break"></div>

<!-- BOBLAR VA BO'LIMLAR -->
${doc.data.sections
  .map(
    (sec) => `
  <h1>${sec.chapterNumber}. ${sec.title}</h1>
  ${(sec.subSections || [])
    .map(
      (sub) => `
    <h2>${sub.number}. ${sub.title}</h2>
    <p>${(sub.content || '').replace(/\n/g, '</p><p>')}</p>
  `
    )
    .join('')}

  ${
    sec.tableData
      ? `
    <div style="margin: 16pt 0;">
      <div style="font-weight: bold; text-align: left; margin-bottom: 4pt;">${sec.tableData.title || '1-jadval'}</div>
      <table>
        <thead>
          <tr>
            ${sec.tableData.headers.map((h) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${sec.tableData.rows
            .map(
              (r) => `
            <tr>
              ${r.map((c) => `<td>${c}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
      : ''
  }
`
  )
  .join('<div class="page-break"></div>')}

<div class="page-break"></div>

<!-- XULOSA -->
<h1>XULOSA VA TAVSIYALAR</h1>
<p>${(doc.data.conclusion || '').replace(/\n/g, '</p><p>')}</p>

<div class="page-break"></div>

<!-- ADABIYOTLAR -->
<h1>FOYDALANILGAN ADABIYOTLAR RO‘YXATI</h1>
<ol>
  ${(doc.data.references || []).map((ref) => `<li>${ref}</li>`).join('')}
</ol>

${
  doc.data.appendices && doc.data.appendices.length > 0
    ? `
  <div class="page-break"></div>
  <h1>ILOVALAR</h1>
  <ul>
    ${doc.data.appendices.map((app) => `<li>${app}</li>`).join('')}
  </ul>
`
    : ''
}

</body>
</html>
`;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = doc.data.title.slice(0, 40).replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
  link.download = `TalabaGO_${safeFilename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Triggers PDF printing / download for academic documents.
 */
export const exportToPdf = (doc: GeneratedDocument, userUniversity = 'O‘zbekiston Milliy Universiteti') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.data.title}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 25mm;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #111;
    }
    .titul {
      text-align: center;
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
    }
    h1 {
      font-size: 15pt;
      text-align: center;
      text-transform: uppercase;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 13pt;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    p {
      text-indent: 12mm;
      text-align: justify;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #333;
      padding: 6px 10px;
      text-align: center;
    }
    th {
      background: #f4f4f4;
    }
    .page-break {
      page-break-after: always;
    }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #2563eb; color: #fff; padding: 12px; text-align: center; font-family: sans-serif; position: sticky; top: 0; z-index: 999;">
    <strong>TalabaGO PDF Eksport:</strong> Ushbu sahifani PDF sifatida saqlash uchun "Chop etish" oynasida "PDF sifatida saqlash" (Save as PDF) ni tanlang.
    <button onclick="window.print()" style="margin-left: 15px; padding: 6px 16px; background: #fff; color: #2563eb; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Chop etish / PDF saqlash</button>
  </div>

  <div class="titul">
    <div>
      <div style="font-weight: bold; font-size: 13pt;">O‘ZBEKISTON RESPUBLIKASI OLIY TA’LIM VAZIRLIGI</div>
      <div style="font-weight: bold; font-size: 12pt; margin-top: 5px;">${userUniversity.toUpperCase()}</div>
      <div style="margin-top: 20px; font-size: 11pt;">KAFEDRA: AXBOROT TEXNOLOGIYALARI VA ILMIY TADQIQOTLAR</div>
    </div>
    
    <div style="margin: 60px 0;">
      <div style="font-size: 18pt; font-weight: bold; text-transform: uppercase;">${doc.data.title}</div>
      <div style="font-size: 13pt; margin-top: 15px; font-weight: 500;">(${doc.data.serviceType.toUpperCase()})</div>
    </div>

    <div style="text-align: right; width: 80%; margin: 0 auto;">
      <p style="margin: 0;"><strong>Bajaruvchi:</strong> Talaba</p>
      <p style="margin: 0;"><strong>Ilmiy rahbar:</strong> Dotsent / Katta o‘qituvchi</p>
      <p style="margin: 0;"><strong>Sana:</strong> 2026-yil</p>
    </div>

    <div style="font-weight: bold; margin-bottom: 20px;">
      TOSHKENT — 2026
    </div>
  </div>

  <div class="page-break"></div>

  <h1>MUNDARIJA</h1>
  <ul>
    ${doc.data.tableOfContents.map((i) => `<li style="padding: 4px 0;">${i}</li>`).join('')}
  </ul>

  <div class="page-break"></div>

  <h1>KIRISH</h1>
  <p>${(doc.data.introduction || '').replace(/\n/g, '</p><p>')}</p>

  ${doc.data.sections
    .map(
      (sec) => `
    <div class="page-break"></div>
    <h1>${sec.chapterNumber}. ${sec.title}</h1>
    ${(sec.subSections || [])
      .map(
        (sub) => `
      <h2>${sub.number}. ${sub.title}</h2>
      <p>${(sub.content || '').replace(/\n/g, '</p><p>')}</p>
    `
      )
      .join('')}
    ${
      sec.tableData
        ? `
      <table>
        <thead><tr>${sec.tableData.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${sec.tableData.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    `
        : ''
    }
  `
    )
    .join('')}

  <div class="page-break"></div>
  <h1>XULOSA VA TAVSIYALAR</h1>
  <p>${(doc.data.conclusion || '').replace(/\n/g, '</p><p>')}</p>

  <div class="page-break"></div>
  <h1>FOYDALANILGAN ADABIYOTLAR</h1>
  <ol>
    ${(doc.data.references || []).map((r) => `<li>${r}</li>`).join('')}
  </ol>
</body>
</html>
`;

  printWindow.document.write(html);
  printWindow.document.close();
};

/**
 * Downloads presentation slides as formatted HTML/PPTX slide package.
 */
export const exportToPptx = (presentation: GeneratedPresentation) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${presentation.topic}</title>
<style>
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #0f172a;
    color: #fff;
  }
  .slide {
    width: 960px;
    height: 540px;
    margin: 30px auto;
    padding: 40px;
    box-sizing: border-box;
    border-radius: 12px;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .slide-header {
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 12px;
  }
  .slide-title {
    font-size: 28px;
    font-weight: bold;
    color: #f8fafc;
    margin: 0;
  }
  .slide-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 4px;
  }
  .slide-body {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 40px;
    margin-top: 20px;
  }
  .bullet-list {
    flex: 3;
    font-size: 18px;
    line-height: 1.8;
  }
  .bullet-list li {
    margin-bottom: 12px;
    color: #e2e8f0;
  }
  .visual-box {
    flex: 2;
    background: rgba(59, 130, 246, 0.1);
    border: 1px dashed #3b82f6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: #60a5fa;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #64748b;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 10px;
  }
</style>
</head>
<body>
  ${presentation.slides
    .map(
      (s) => `
    <div class="slide">
      <div class="slide-header">
        <h1 class="slide-title">${s.title}</h1>
        ${s.subtitle ? `<div class="slide-subtitle">${s.subtitle}</div>` : ''}
      </div>
      <div class="slide-body">
        <ul class="bullet-list">
          ${s.bulletPoints.map((bp) => `<li>${bp}</li>`).join('')}
        </ul>
        <div class="visual-box">
          <strong>Vizual tavsiya:</strong><br>
          ${s.visualDescription}
        </div>
      </div>
      <div class="slide-footer">
        <span>TalabaGO — ${presentation.topic}</span>
        <span>Slayd ${s.slideNumber} / ${presentation.slides.length}</span>
      </div>
    </div>
  `
    )
    .join('')}
</body>
</html>
`;

  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = presentation.topic.slice(0, 30).replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
  link.download = `TalabaGO_Slayd_${safeFilename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Returns Google Maps link for coordinate or address.
 */
export const getGoogleMapsUrl = (lat: number, lng: number, address?: string) => {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Tashkent')}`;
};
