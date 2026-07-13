const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

const pdfCopy = {
  tr: ['Profesyonel ürün ve hizmet teklifi','TEKLİF','Teklif Veren','Sayın','Teklif Tarihi','Geçerlilik Tarihi','Ürün / Hizmet','Miktar','Birim Fiyat','KDV','Tutar','Ara toplam','KDV toplamı','Genel toplam','Notlar ve Koşullar','Yetkili İmza / Kaşe','Müşteri Onayı / İmza','Bu teklife henüz kalem eklenmemiştir.'],
  en: ['Professional product and service quote','QUOTE','From','To','Quote Date','Valid Until','Product / Service','Quantity','Unit Price','VAT','Amount','Subtotal','VAT Total','Grand Total','Notes and Terms','Authorized Signature / Stamp','Customer Approval / Signature','No items have been added to this quote.'],
  zh: ['专业产品与服务报价','报价单','报价方','致','报价日期','有效期至','产品 / 服务','数量','单价','增值税','金额','小计','增值税合计','总计','备注与条款','授权签字 / 盖章','客户确认 / 签字','此报价尚未添加项目。'],
  hi: ['पेशेवर उत्पाद और सेवा कोटेशन','कोटेशन','प्रेषक','प्रति','कोटेशन दिनांक','मान्य तिथि','उत्पाद / सेवा','मात्रा','इकाई मूल्य','कर','राशि','उप-योग','कर योग','कुल योग','नोट्स और शर्तें','अधिकृत हस्ताक्षर / मुहर','ग्राहक स्वीकृति / हस्ताक्षर','इस कोटेशन में कोई आइटम नहीं जोड़ा गया है।'],
  es: ['Presupuesto profesional de productos y servicios','PRESUPUESTO','Emisor','Cliente','Fecha','Válido hasta','Producto / Servicio','Cantidad','Precio unitario','IVA','Importe','Subtotal','IVA total','Total general','Notas y condiciones','Firma autorizada / Sello','Aprobación / Firma del cliente','No se han añadido conceptos.'],
  ar: ['عرض احترافي للمنتجات والخدمات','عرض سعر','من','إلى','تاريخ العرض','صالح حتى','المنتج / الخدمة','الكمية','سعر الوحدة','الضريبة','المبلغ','المجموع الفرعي','إجمالي الضريبة','الإجمالي','الملاحظات والشروط','توقيع المفوض / الختم','موافقة العميل / التوقيع','لم تتم إضافة بنود إلى هذا العرض.'],
  pt: ['Proposta profissional de produtos e serviços','PROPOSTA','Proponente','Cliente','Data','Válida até','Produto / Serviço','Quantidade','Preço unitário','IVA','Valor','Subtotal','Total de IVA','Total geral','Notas e condições','Assinatura autorizada / Carimbo','Aprovação / Assinatura do cliente','Nenhum item foi adicionado.'],
  fr: ['Devis professionnel de produits et services','DEVIS','Émetteur','Client','Date du devis','Valable jusqu’au','Produit / Service','Quantité','Prix unitaire','TVA','Montant','Sous-total','Total TVA','Total général','Notes et conditions','Signature autorisée / Cachet','Approbation / Signature du client','Aucun article n’a été ajouté.'],
  de: ['Professionelles Produkt- und Dienstleistungsangebot','ANGEBOT','Anbieter','Kunde','Angebotsdatum','Gültig bis','Produkt / Leistung','Menge','Einzelpreis','MwSt.','Betrag','Zwischensumme','MwSt. gesamt','Gesamtsumme','Hinweise und Bedingungen','Unterschrift / Stempel','Kundenfreigabe / Unterschrift','Keine Positionen hinzugefügt.'],
  ru: ['Профессиональное предложение товаров и услуг','ПРЕДЛОЖЕНИЕ','Отправитель','Клиент','Дата','Действительно до','Товар / Услуга','Количество','Цена за единицу','НДС','Сумма','Подытог','НДС итого','Итого','Примечания и условия','Подпись / Печать','Подтверждение / Подпись клиента','Позиции не добавлены.'],
  ja: ['製品・サービス見積書','見積書','見積元','宛先','見積日','有効期限','製品 / サービス','数量','単価','税','金額','小計','税額合計','合計','備考・条件','担当者署名 / 印','顧客承認 / 署名','見積項目はまだ追加されていません。']
};

const locales = { tr:'tr-TR', en:'en-US', zh:'zh-CN', hi:'hi-IN', es:'es-ES', ar:'ar-SA', pt:'pt-BR', fr:'fr-FR', de:'de-DE', ru:'ru-RU', ja:'ja-JP' };

const PDF_TEMPLATE_IDS = ["modern", "corporate", "elegant", "minimal", "warm"];

const baseStyles = `
  @page{size:A4;margin:0}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#fff}
  body{font-family:Arial,sans-serif;color:#172033;font-size:11px;line-height:1.45}
  .sheet{position:relative;width:100%;min-height:1122px;overflow:hidden;background:#fff}
  .logo{display:block;max-width:104px;max-height:68px;object-fit:contain}
  .logo-placeholder{display:flex;align-items:center;justify-content:center;font-weight:800}
  .muted{color:#64748b}
  .right{text-align:end}
  .document-table{width:100%;border-collapse:collapse}
  .document-table th,.document-table td{text-align:start;vertical-align:top}
  .document-table .right{text-align:end}
  .document-table th{font-size:9px;text-transform:uppercase;letter-spacing:.8px}
  .document-table td{padding:9px 8px}
  .document-table .number{width:28px;color:#94a3b8}
  .item-name{font-weight:700}
  .item-description{display:block;margin-top:2px;color:#64748b;font-size:9px}
  .empty{text-align:center!important;color:#94a3b8;padding:28px!important}
  .summary-line{display:flex;align-items:center;justify-content:space-between;gap:20px}
  .signature-grid{display:grid;grid-template-columns:1fr 1fr;gap:54px}
  .signature{text-align:center}
  .signature-line{border-top:1px solid #94a3b8;padding-top:7px}
  .document-footer{position:absolute;inset-inline:44px;bottom:18px;display:flex;justify-content:space-between;gap:20px;border-top:1px solid #e2e8f0;padding-top:7px;color:#94a3b8;font-size:8px}
  @media print{.sheet{min-height:297mm}}
`;

const templateStyles = {
  modern: `
    .template-modern{padding:0 44px 56px}
    .modern-hero{margin:0 -44px;padding:34px 44px 66px;background:linear-gradient(125deg,#0f2b52,#1457a6 65%,#2563eb);color:#fff}
    .modern-hero-row{display:flex;align-items:flex-start;justify-content:space-between;gap:28px}
    .modern-brand{display:flex;align-items:center;gap:14px;max-width:58%}
    .template-modern .logo-placeholder{width:58px;height:58px;border-radius:16px;background:#fff;color:#1d4ed8;font-size:26px}
    .modern-company{font-size:20px;font-weight:800;letter-spacing:-.3px}
    .modern-tagline{margin-top:3px;color:#dbeafe}
    .modern-document{text-align:end}
    .modern-document h1{margin:0;font-size:28px;letter-spacing:1.5px}
    .modern-number{display:inline-block;margin-top:7px;border-radius:999px;background:#ffffff20;padding:5px 11px;font-weight:700}
    .modern-focus{display:grid;grid-template-columns:1.35fr .65fr;gap:12px;margin-top:-42px}
    .modern-card{border:1px solid #dbeafe;border-radius:14px;background:#fff;padding:15px;box-shadow:0 9px 25px #0f2b5217}
    .modern-label{margin-bottom:5px;color:#2563eb;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
    .modern-customer{font-size:16px;font-weight:800}
    .modern-dates{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .modern-date{border-inline-start:3px solid #60a5fa;padding-inline-start:9px}
    .modern-date span{display:block;color:#64748b;font-size:9px}
    .modern-from{display:flex;justify-content:space-between;gap:20px;margin:17px 0;color:#475569}
    .template-modern .document-table{margin-top:8px}
    .template-modern .document-table thead{background:#14233a;color:#fff}
    .template-modern .document-table th{padding:9px 8px}
    .template-modern .document-table th:first-child{border-radius:8px 0 0 8px}
    .template-modern .document-table th:last-child{border-radius:0 8px 8px 0}
    .template-modern .document-table td{border-bottom:1px solid #e2e8f0}
    .modern-bottom{display:grid;grid-template-columns:1fr 270px;gap:26px;align-items:start;margin-top:18px}
    .modern-notes{border-inline-start:4px solid #3b82f6;border-radius:0 8px 8px 0;background:#f8fafc;padding:11px 13px}
    .modern-notes h3{margin:0 0 4px;font-size:11px}
    .modern-summary{border-radius:12px;background:#eff6ff;padding:12px 14px}
    .modern-summary .summary-line{padding:4px 0}
    .modern-total{margin-top:5px;border-top:1px solid #bfdbfe;padding-top:9px!important;color:#1d4ed8;font-size:15px;font-weight:800}
    .template-modern .signature-grid{margin-top:42px}
  `,
  corporate: `
    .template-corporate{display:grid;grid-template-columns:184px minmax(0,1fr);padding:0}
    .corporate-sidebar{position:relative;min-height:1122px;background:#103b36;color:#fff;padding:38px 24px}
    .corporate-sidebar:after{content:"";position:absolute;inset-inline-end:0;top:0;width:6px;height:100%;background:#2dd4bf}
    .template-corporate .logo{margin:0 auto 18px}
    .template-corporate .logo-placeholder{width:64px;height:64px;margin:0 auto 18px;border:1px solid #ffffff55;border-radius:4px;background:#ffffff14;color:#fff;font-size:26px}
    .corporate-company{font-size:19px;font-weight:800;text-align:center}
    .corporate-tagline{margin:5px 0 26px;color:#99f6e4;text-align:center;font-size:9px}
    .corporate-side-label{margin:18px 0 5px;color:#5eead4;font-size:8px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
    .corporate-side-copy{color:#d1fae5;word-break:break-word}
    .corporate-content{padding:38px 40px 62px}
    .corporate-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;border-bottom:3px solid #0f766e;padding-bottom:16px}
    .corporate-heading h1{margin:0;color:#134e4a;font-size:27px;letter-spacing:1px}
    .corporate-number{margin-top:4px;color:#475569;font-family:Consolas,monospace}
    .corporate-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:end}
    .corporate-meta span{display:block;color:#64748b;font-size:8px;text-transform:uppercase}
    .corporate-client{display:grid;grid-template-columns:88px 1fr;gap:14px;margin:22px 0;border:1px solid #cbd5e1;border-inline-start:5px solid #0f766e;padding:14px}
    .corporate-client-label{color:#0f766e;font-size:9px;font-weight:800;text-transform:uppercase}
    .corporate-client-name{font-size:16px;font-weight:800}
    .template-corporate .document-table thead{border-block:1px solid #0f766e;color:#134e4a}
    .template-corporate .document-table th{padding:8px}
    .template-corporate .document-table td{border-bottom:1px solid #dbe5e3}
    .corporate-summary{width:270px;margin:18px 0 0 auto;border:1px solid #99d8cf}
    .corporate-summary .summary-line{padding:6px 10px;border-bottom:1px solid #dbe5e3}
    .corporate-summary .summary-line:last-child{border:0;background:#0f766e;color:#fff;font-size:14px;font-weight:800}
    .corporate-notes{margin-top:18px;border:1px solid #dbe5e3;padding:11px}
    .corporate-notes h3{margin:0 0 4px;color:#0f766e;font-size:10px;text-transform:uppercase}
    .template-corporate .signature-grid{margin-top:40px}
    .corporate-footer{position:absolute;inset-inline-start:224px;inset-inline-end:40px;bottom:18px;display:flex;justify-content:space-between;border-top:1px solid #cbd5e1;padding-top:7px;color:#64748b;font-size:8px}
  `,
  elegant: `
    .template-elegant{padding:38px 52px 58px;background:#fffdfa;color:#2d2637;font-family:Georgia,"Times New Roman",serif}
    .elegant-header{text-align:center}
    .template-elegant .logo{margin:0 auto 11px}
    .template-elegant .logo-placeholder{width:54px;height:54px;margin:0 auto 11px;border:1px solid #8b5e83;border-radius:50%;color:#6d3f68;font-size:22px}
    .elegant-company{font-size:19px;letter-spacing:1px}
    .elegant-ornament{display:flex;align-items:center;justify-content:center;gap:8px;margin:10px auto;color:#b7864b}
    .elegant-ornament:before,.elegant-ornament:after{content:"";width:84px;height:1px;background:#d7bd9c}
    .elegant-header h1{margin:8px 0 2px;color:#6d3f68;font-size:25px;font-weight:400;letter-spacing:4px}
    .elegant-number{font-family:Arial,sans-serif;color:#766a78;font-size:9px;letter-spacing:1px}
    .elegant-parties{display:grid;grid-template-columns:1fr 1fr;gap:42px;margin:25px 0 17px}
    .elegant-party+ .elegant-party{border-inline-start:1px solid #d7bd9c;padding-inline-start:42px}
    .elegant-label{margin-bottom:7px;color:#9a6b35;font-family:Arial,sans-serif;font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
    .elegant-name{font-size:16px;font-weight:700}
    .elegant-dates{display:flex;justify-content:center;gap:42px;border-block:1px solid #eadfce;padding:8px;text-align:center}
    .elegant-dates span{display:block;color:#8a7d85;font-family:Arial,sans-serif;font-size:8px;text-transform:uppercase}
    .template-elegant .document-table{margin-top:19px}
    .template-elegant .document-table thead{border-bottom:2px solid #6d3f68;color:#6d3f68}
    .template-elegant .document-table th{padding:8px 6px;font-family:Arial,sans-serif}
    .template-elegant .document-table td{border-bottom:1px solid #eadfce;padding:10px 6px}
    .elegant-summary{width:285px;margin:20px auto 0;border-block:1px solid #d7bd9c;padding:7px 0}
    .elegant-summary .summary-line{padding:4px 8px}
    .elegant-total{color:#6d3f68;font-size:15px;font-weight:700}
    .elegant-notes{margin:21px auto 0;max-width:520px;text-align:center;color:#655d66;font-style:italic}
    .elegant-notes h3{margin:0 0 5px;color:#9a6b35;font-size:10px;font-style:normal;letter-spacing:1px;text-transform:uppercase}
    .template-elegant .signature-grid{margin-top:43px}
    .template-elegant .signature-line{border-color:#d7bd9c}
  `,
  minimal: `
    .template-minimal{padding:42px 48px 58px;color:#111827;font-family:Arial,sans-serif}
    .minimal-header{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:start}
    .minimal-kicker{font-size:8px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
    .minimal-header h1{margin:5px 0 0;font-size:30px;font-weight:300;letter-spacing:-1px}
    .minimal-brand{text-align:end}
    .minimal-brand-row{display:flex;align-items:center;justify-content:flex-end;gap:10px}
    .template-minimal .logo{max-width:68px;max-height:44px}
    .template-minimal .logo-placeholder{width:40px;height:40px;border:1px solid #111827;color:#111827;font-size:17px}
    .minimal-company{font-weight:800}
    .minimal-rule{height:3px;margin:18px 0;background:#111827}
    .minimal-info{display:grid;grid-template-columns:1.5fr .5fr .5fr;gap:20px;margin-bottom:22px}
    .minimal-info-label{margin-bottom:5px;color:#6b7280;font-size:8px;text-transform:uppercase}
    .minimal-recipient{border-inline-start:2px solid #111827;padding-inline-start:11px}
    .minimal-recipient strong{display:block;font-size:15px}
    .template-minimal .document-table thead{border-block:1px solid #111827}
    .template-minimal .document-table th{padding:7px 4px;color:#111827}
    .template-minimal .document-table td{border-bottom:1px solid #d1d5db;padding:9px 4px}
    .minimal-summary{width:260px;margin:18px 0 0 auto}
    .minimal-summary .summary-line{padding:4px 0}
    .minimal-total{margin-top:5px;border-block:2px solid #111827;padding:8px 0!important;font-size:15px;font-weight:800}
    .minimal-notes{margin-top:22px;max-width:470px}
    .minimal-notes h3{margin:0 0 5px;font-size:9px;letter-spacing:1px;text-transform:uppercase}
    .template-minimal .signature-grid{margin-top:48px}
    .template-minimal .signature-line{border-color:#111827}
  `,
  warm: `
    .template-warm{padding:32px 40px 56px;background:#fffaf3;color:#42291d}
    .warm-hero{display:grid;grid-template-columns:1.25fr .75fr;gap:18px;border-radius:24px;background:#9a3412;color:#fff;padding:23px 25px}
    .warm-brand{display:flex;align-items:center;gap:13px}
    .template-warm .logo-placeholder{width:58px;height:58px;border-radius:18px;background:#fed7aa;color:#9a3412;font-size:24px}
    .warm-company{font-size:20px;font-weight:800}
    .warm-tagline{margin-top:3px;color:#ffedd5}
    .warm-document{text-align:end}
    .warm-document h1{margin:0;font-size:25px}
    .warm-number{display:inline-block;margin-top:7px;border-radius:10px;background:#7c2d12;padding:5px 10px}
    .warm-info{display:grid;grid-template-columns:1.3fr .7fr;gap:12px;margin:14px 0}
    .warm-card{border:1px solid #fed7aa;border-radius:16px;background:#fff;padding:13px}
    .warm-card-label{margin-bottom:5px;color:#c2410c;font-size:8px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
    .warm-customer{font-size:16px;font-weight:800}
    .warm-date-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0}
    .warm-date-row+ .warm-date-row{border-top:1px dashed #fdba74}
    .warm-section-title{display:flex;align-items:center;gap:10px;margin:17px 0 8px;color:#9a3412;font-size:11px;font-weight:800;text-transform:uppercase}
    .warm-section-title:after{content:"";height:1px;flex:1;background:#fed7aa}
    .warm-items{display:grid;gap:6px}
    .warm-item{display:grid;grid-template-columns:26px minmax(0,1fr) 85px 95px 52px 100px;align-items:start;gap:7px;border:1px solid #ffedd5;border-radius:11px;background:#fff;padding:8px}
    .warm-item-head{background:#ffedd5;color:#9a3412;font-size:8px;font-weight:800;text-transform:uppercase}
    .warm-item-index{display:flex;width:22px;height:22px;align-items:center;justify-content:center;border-radius:8px;background:#fff7ed;color:#c2410c;font-weight:800}
    .warm-empty{border:1px dashed #fdba74;border-radius:12px;background:#fff;padding:26px;text-align:center;color:#9a6b50}
    .warm-bottom{display:grid;grid-template-columns:1fr 268px;gap:18px;margin-top:15px;align-items:start}
    .warm-notes{border-radius:14px;background:#ffedd5;padding:12px}
    .warm-notes h3{margin:0 0 5px;color:#9a3412;font-size:10px}
    .warm-summary{border-radius:16px;background:#42291d;color:#fff;padding:12px 14px}
    .warm-summary .summary-line{padding:4px 0}
    .warm-total{margin-top:5px;border-top:1px solid #ffffff35;padding-top:9px!important;color:#fdba74;font-size:15px;font-weight:800}
    .template-warm .signature-grid{margin-top:40px}
    .template-warm .signature-line{border-color:#c98f6d}
  `,
};

const validImageDataUrl = (value) =>
  typeof value === "string" &&
  /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value);

const parseItems = (value) => {
  try {
    const items = JSON.parse(value || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const normalizeLanguage = (language) =>
  Object.prototype.hasOwnProperty.call(locales, language) ? language : "en";

const normalizeTemplate = (template) =>
  PDF_TEMPLATE_IDS.includes(template) ? template : "modern";

function createDocumentData(offer, company, language) {
  const copy = pdfCopy[language] || pdfCopy.en;
  const [
    tagline,
    documentTitle,
    fromLabel,
    toLabel,
    offerDateLabel,
    validUntilLabel,
    productLabel,
    quantityLabel,
    unitPriceLabel,
    vatLabel,
    amountLabel,
    subtotalLabel,
    vatTotalLabel,
    grandTotalLabel,
    notesLabel,
    authorizedLabel,
    customerApprovalLabel,
    emptyLabel,
  ] = copy;
  const locale = locales[language] || locales.en;
  const money = (value) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "TRY" }).format(
      Number(value) || 0,
    );
  const date = (value) => {
    if (!value) return "-";
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime())
      ? "-"
      : new Intl.DateTimeFormat(locale).format(parsed);
  };
  const companyName = company.name || "ProTeklif";
  const customerName = offer.customer_company || offer.customer_name || "-";
  const customerPerson = offer.customer_company ? offer.customer_name : "";
  const companyTax = [company.tax_office, company.tax_number].filter(Boolean).join(" / ");
  const companyContact = [company.phone, company.email, companyTax]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br>");
  const customerContact = [offer.customer_phone, offer.customer_email, offer.customer_tax_number]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br>");
  const logo = validImageDataUrl(company.logo_data_url)
    ? `<img class="logo" src="${company.logo_data_url}" alt="">`
    : `<div class="logo-placeholder">${escapeHtml(companyName.slice(0, 1).toUpperCase())}</div>`;

  return {
    labels: {
      tagline,
      documentTitle,
      fromLabel,
      toLabel,
      offerDateLabel,
      validUntilLabel,
      productLabel,
      quantityLabel,
      unitPriceLabel,
      vatLabel,
      amountLabel,
      subtotalLabel,
      vatTotalLabel,
      grandTotalLabel,
      notesLabel,
      authorizedLabel,
      customerApprovalLabel,
      emptyLabel,
    },
    logo,
    companyName: escapeHtml(companyName),
    companyAddress: escapeHtml(company.address),
    companyContact,
    customerName: escapeHtml(customerName),
    customerPerson: escapeHtml(customerPerson),
    customerAddress: escapeHtml(offer.customer_address),
    customerContact,
    offerNumber: escapeHtml(offer.offer_number),
    offerDate: date(offer.offer_date),
    validUntil: date(offer.valid_until),
    notes: escapeHtml(offer.notes).replace(/\n/g, "<br>"),
    items: parseItems(offer.items_json),
    money,
    subtotal: money(offer.subtotal),
    vatTotal: money(offer.vat_total),
    grandTotal: money(offer.grand_total),
  };
}

function renderTableRows(data) {
  if (!data.items.length) {
    return `<tr><td colspan="6" class="empty">${data.labels.emptyLabel}</td></tr>`;
  }

  return data.items
    .map((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return `<tr>
        <td class="number">${index + 1}</td>
        <td><span class="item-name">${escapeHtml(item.name)}</span>${
          item.description
            ? `<span class="item-description">${escapeHtml(item.description)}</span>`
            : ""
        }</td>
        <td class="right">${escapeHtml(quantity)} ${escapeHtml(item.unit || "")}</td>
        <td class="right">${data.money(unitPrice)}</td>
        <td class="right">%${escapeHtml(item.vatRate || 0)}</td>
        <td class="right"><strong>${data.money(quantity * unitPrice)}</strong></td>
      </tr>`;
    })
    .join("");
}

function renderDocumentTable(data) {
  return `<table class="document-table">
    <thead><tr>
      <th>#</th>
      <th>${data.labels.productLabel}</th>
      <th class="right">${data.labels.quantityLabel}</th>
      <th class="right">${data.labels.unitPriceLabel}</th>
      <th class="right">${data.labels.vatLabel}</th>
      <th class="right">${data.labels.amountLabel}</th>
    </tr></thead>
    <tbody>${renderTableRows(data)}</tbody>
  </table>`;
}

function renderSummary(data, className) {
  return `<div class="${className}">
    <div class="summary-line"><span>${data.labels.subtotalLabel}</span><strong>${data.subtotal}</strong></div>
    <div class="summary-line"><span>${data.labels.vatTotalLabel}</span><strong>${data.vatTotal}</strong></div>
    <div class="summary-line ${className.split(" ")[0].replace("summary", "total")}"><span>${data.labels.grandTotalLabel}</span><strong>${data.grandTotal}</strong></div>
  </div>`;
}

function renderSignatures(data) {
  return `<div class="signature-grid">
    <div class="signature"><div class="signature-line"><strong>${data.companyName}</strong><br><span class="muted">${data.labels.authorizedLabel}</span></div></div>
    <div class="signature"><div class="signature-line"><strong>${data.customerName}</strong><br><span class="muted">${data.labels.customerApprovalLabel}</span></div></div>
  </div>`;
}

function renderModern(data) {
  return `<main class="sheet template-modern">
    <header class="modern-hero"><div class="modern-hero-row">
      <div class="modern-brand">${data.logo}<div><div class="modern-company">${data.companyName}</div><div class="modern-tagline">${data.labels.tagline}</div></div></div>
      <div class="modern-document"><h1>${data.labels.documentTitle}</h1><div class="modern-number">${data.offerNumber}</div></div>
    </div></header>
    <section class="modern-focus">
      <div class="modern-card"><div class="modern-label">${data.labels.toLabel}</div><div class="modern-customer">${data.customerName}</div>${data.customerPerson ? `<div>${data.customerPerson}</div>` : ""}<div class="muted">${data.customerAddress}${data.customerContact ? `<br>${data.customerContact}` : ""}</div></div>
      <div class="modern-card modern-dates"><div class="modern-date"><span>${data.labels.offerDateLabel}</span><strong>${data.offerDate}</strong></div><div class="modern-date"><span>${data.labels.validUntilLabel}</span><strong>${data.validUntil}</strong></div></div>
    </section>
    <section class="modern-from"><div><strong>${data.labels.fromLabel}: ${data.companyName}</strong><br><span class="muted">${data.companyAddress}</span></div><div class="right muted">${data.companyContact}</div></section>
    ${renderDocumentTable(data)}
    <section class="modern-bottom">${data.notes ? `<div class="modern-notes"><h3>${data.labels.notesLabel}</h3>${data.notes}</div>` : "<div></div>"}${renderSummary(data, "modern-summary")}</section>
    ${renderSignatures(data)}
    <footer class="document-footer"><span>${data.companyAddress}</span><span>${data.offerNumber}</span></footer>
  </main>`;
}

function renderCorporate(data) {
  return `<main class="sheet template-corporate">
    <aside class="corporate-sidebar">${data.logo}<div class="corporate-company">${data.companyName}</div><div class="corporate-tagline">${data.labels.tagline}</div>
      <div class="corporate-side-label">${data.labels.fromLabel}</div><div class="corporate-side-copy">${data.companyAddress}</div>
      <div class="corporate-side-label">Contact</div><div class="corporate-side-copy">${data.companyContact || "-"}</div>
    </aside>
    <section class="corporate-content">
      <header class="corporate-heading"><div><h1>${data.labels.documentTitle}</h1><div class="corporate-number">${data.offerNumber}</div></div><div class="corporate-meta"><div><span>${data.labels.offerDateLabel}</span><strong>${data.offerDate}</strong></div><div><span>${data.labels.validUntilLabel}</span><strong>${data.validUntil}</strong></div></div></header>
      <section class="corporate-client"><div class="corporate-client-label">${data.labels.toLabel}</div><div><div class="corporate-client-name">${data.customerName}</div>${data.customerPerson ? `<div>${data.customerPerson}</div>` : ""}<div class="muted">${data.customerAddress}${data.customerContact ? `<br>${data.customerContact}` : ""}</div></div></section>
      ${renderDocumentTable(data)}
      ${renderSummary(data, "corporate-summary")}
      ${data.notes ? `<section class="corporate-notes"><h3>${data.labels.notesLabel}</h3>${data.notes}</section>` : ""}
      ${renderSignatures(data)}
    </section>
    <footer class="corporate-footer"><span>${data.companyName}</span><span>${data.offerNumber}</span></footer>
  </main>`;
}

function renderElegant(data) {
  return `<main class="sheet template-elegant">
    <header class="elegant-header">${data.logo}<div class="elegant-company">${data.companyName}</div><div class="elegant-ornament">◆</div><h1>${data.labels.documentTitle}</h1><div class="elegant-number">${data.offerNumber}</div></header>
    <section class="elegant-parties">
      <div class="elegant-party"><div class="elegant-label">${data.labels.fromLabel}</div><div class="elegant-name">${data.companyName}</div><div class="muted">${data.companyAddress}${data.companyContact ? `<br>${data.companyContact}` : ""}</div></div>
      <div class="elegant-party"><div class="elegant-label">${data.labels.toLabel}</div><div class="elegant-name">${data.customerName}</div>${data.customerPerson ? `<div>${data.customerPerson}</div>` : ""}<div class="muted">${data.customerAddress}${data.customerContact ? `<br>${data.customerContact}` : ""}</div></div>
    </section>
    <section class="elegant-dates"><div><span>${data.labels.offerDateLabel}</span><strong>${data.offerDate}</strong></div><div><span>${data.labels.validUntilLabel}</span><strong>${data.validUntil}</strong></div></section>
    ${renderDocumentTable(data)}
    ${renderSummary(data, "elegant-summary")}
    ${data.notes ? `<section class="elegant-notes"><h3>${data.labels.notesLabel}</h3>${data.notes}</section>` : ""}
    ${renderSignatures(data)}
    <footer class="document-footer"><span>${data.labels.tagline}</span><span>${data.offerNumber}</span></footer>
  </main>`;
}

function renderMinimal(data) {
  return `<main class="sheet template-minimal">
    <header class="minimal-header"><div><div class="minimal-kicker">${data.offerNumber}</div><h1>${data.labels.documentTitle}</h1></div><div class="minimal-brand"><div class="minimal-brand-row"><div><div class="minimal-company">${data.companyName}</div><div class="muted">${data.companyContact}</div></div>${data.logo}</div></div></header>
    <div class="minimal-rule"></div>
    <section class="minimal-info"><div class="minimal-recipient"><div class="minimal-info-label">${data.labels.toLabel}</div><strong>${data.customerName}</strong>${data.customerPerson ? `<div>${data.customerPerson}</div>` : ""}<div class="muted">${data.customerAddress}${data.customerContact ? `<br>${data.customerContact}` : ""}</div></div><div><div class="minimal-info-label">${data.labels.offerDateLabel}</div><strong>${data.offerDate}</strong></div><div><div class="minimal-info-label">${data.labels.validUntilLabel}</div><strong>${data.validUntil}</strong></div></section>
    ${renderDocumentTable(data)}
    ${renderSummary(data, "minimal-summary")}
    ${data.notes ? `<section class="minimal-notes"><h3>${data.labels.notesLabel}</h3>${data.notes}</section>` : ""}
    ${renderSignatures(data)}
    <footer class="document-footer"><span>${data.companyAddress}</span><span>${data.labels.tagline}</span></footer>
  </main>`;
}

function renderWarmItems(data) {
  const header = `<div class="warm-item warm-item-head"><span>#</span><span>${data.labels.productLabel}</span><span class="right">${data.labels.quantityLabel}</span><span class="right">${data.labels.unitPriceLabel}</span><span class="right">${data.labels.vatLabel}</span><span class="right">${data.labels.amountLabel}</span></div>`;
  if (!data.items.length) return `${header}<div class="warm-empty">${data.labels.emptyLabel}</div>`;

  return (
    header +
    data.items
      .map((item, index) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        return `<div class="warm-item"><span class="warm-item-index">${index + 1}</span><span><span class="item-name">${escapeHtml(item.name)}</span>${item.description ? `<span class="item-description">${escapeHtml(item.description)}</span>` : ""}</span><span class="right">${escapeHtml(quantity)} ${escapeHtml(item.unit || "")}</span><span class="right">${data.money(unitPrice)}</span><span class="right">%${escapeHtml(item.vatRate || 0)}</span><strong class="right">${data.money(quantity * unitPrice)}</strong></div>`;
      })
      .join("")
  );
}

function renderWarm(data) {
  return `<main class="sheet template-warm">
    <header class="warm-hero"><div class="warm-brand">${data.logo}<div><div class="warm-company">${data.companyName}</div><div class="warm-tagline">${data.labels.tagline}</div></div></div><div class="warm-document"><h1>${data.labels.documentTitle}</h1><div class="warm-number">${data.offerNumber}</div></div></header>
    <section class="warm-info"><div class="warm-card"><div class="warm-card-label">${data.labels.toLabel}</div><div class="warm-customer">${data.customerName}</div>${data.customerPerson ? `<div>${data.customerPerson}</div>` : ""}<div class="muted">${data.customerAddress}${data.customerContact ? `<br>${data.customerContact}` : ""}</div></div><div class="warm-card"><div class="warm-date-row"><span class="muted">${data.labels.offerDateLabel}</span><strong>${data.offerDate}</strong></div><div class="warm-date-row"><span class="muted">${data.labels.validUntilLabel}</span><strong>${data.validUntil}</strong></div></div></section>
    <div class="warm-section-title">${data.labels.productLabel}</div><section class="warm-items">${renderWarmItems(data)}</section>
    <section class="warm-bottom">${data.notes ? `<div class="warm-notes"><h3>${data.labels.notesLabel}</h3>${data.notes}</div>` : `<div class="warm-notes"><strong>${data.labels.fromLabel}</strong><br>${data.companyAddress}<br>${data.companyContact}</div>`}${renderSummary(data, "warm-summary")}</section>
    ${renderSignatures(data)}
    <footer class="document-footer"><span>${data.companyName}</span><span>${data.offerNumber}</span></footer>
  </main>`;
}

const renderers = {
  modern: renderModern,
  corporate: renderCorporate,
  elegant: renderElegant,
  minimal: renderMinimal,
  warm: renderWarm,
};

export function createOfferHtml(
  offer,
  company = {},
  language = "tr",
  template = "modern",
) {
  const safeLanguage = normalizeLanguage(language);
  const safeTemplate = normalizeTemplate(template);
  const data = createDocumentData(offer, company, safeLanguage);
  const direction = safeLanguage === "ar" ? "rtl" : "ltr";

  return `<!doctype html>
  <html lang="${safeLanguage}" dir="${direction}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=794">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline';">
      <style>${baseStyles}${templateStyles[safeTemplate]}</style>
    </head>
    <body>${renderers[safeTemplate](data)}</body>
  </html>`;
}
