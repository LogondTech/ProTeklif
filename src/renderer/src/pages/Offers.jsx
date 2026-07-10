import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { api } from "../services/api.js";
import { useI18n } from "../i18n.jsx";

const localeByLanguage = {
  tr: "tr-TR",
  en: "en-US",
  zh: "zh-CN",
  hi: "hi-IN",
  es: "es-ES",
  ar: "ar-SA",
  pt: "pt-PT",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  ja: "ja-JP",
};

const copies = {
  tr: {
    title: "Kayıtlı Teklifler",
    description: "Tekliflerinizi görüntüleyin ve profesyonel PDF olarak kaydedin.",
    offerNumber: "Teklif No",
    customer: "Müşteri",
    date: "Tarih",
    status: "Durum",
    total: "Toplam",
    action: "İşlem",
    loading: "Yükleniyor…",
    empty: "Henüz kayıtlı teklif bulunmuyor.",
    preparing: "Hazırlanıyor…",
    savePdf: "PDF Kaydet",
    pdfSaved: "PDF kaydedildi:",
    loadError: "Teklifler yüklenemedi.",
    exportError: "PDF oluşturulamadı.",
    rows: "kayıt",
    previous: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
    of: "/",
    statuses: { draft: "Taslak", sent: "Gönderildi", accepted: "Onaylandı", rejected: "Reddedildi" },
  },
  en: {
    title: "Saved Quotes",
    description: "View your quotes and save them as professional PDF documents.",
    offerNumber: "Quote No.",
    customer: "Customer",
    date: "Date",
    status: "Status",
    total: "Total",
    action: "Action",
    loading: "Loading…",
    empty: "No saved quotes yet.",
    preparing: "Preparing…",
    savePdf: "Save PDF",
    pdfSaved: "PDF saved:",
    loadError: "Quotes could not be loaded.",
    exportError: "The PDF could not be created.",
    rows: "records",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    statuses: { draft: "Draft", sent: "Sent", accepted: "Accepted", rejected: "Rejected" },
  },
  zh: {
    title: "已保存的报价",
    description: "查看您的报价并将其保存为专业的 PDF 文档。",
    offerNumber: "报价编号",
    customer: "客户",
    date: "日期",
    status: "状态",
    total: "总计",
    action: "操作",
    loading: "正在加载…",
    empty: "暂无已保存的报价。",
    preparing: "正在准备…",
    savePdf: "保存 PDF",
    pdfSaved: "PDF 已保存：",
    loadError: "无法加载报价。",
    exportError: "无法创建 PDF。",
    rows: "条记录",
    previous: "上一页",
    next: "下一页",
    page: "第",
    of: "页，共",
    statuses: { draft: "草稿", sent: "已发送", accepted: "已接受", rejected: "已拒绝" },
  },
  hi: {
    title: "सहेजे गए कोटेशन",
    description: "अपने कोटेशन देखें और उन्हें पेशेवर PDF के रूप में सहेजें।",
    offerNumber: "कोटेशन नं.",
    customer: "ग्राहक",
    date: "तारीख",
    status: "स्थिति",
    total: "कुल",
    action: "कार्रवाई",
    loading: "लोड हो रहा है…",
    empty: "अभी कोई सहेजा गया कोटेशन नहीं है।",
    preparing: "तैयार हो रहा है…",
    savePdf: "PDF सहेजें",
    pdfSaved: "PDF सहेजा गया:",
    loadError: "कोटेशन लोड नहीं किए जा सके।",
    exportError: "PDF नहीं बनाया जा सका।",
    rows: "रिकॉर्ड",
    previous: "पिछला",
    next: "अगला",
    page: "पृष्ठ",
    of: "में से",
    statuses: { draft: "ड्राफ़्ट", sent: "भेजा गया", accepted: "स्वीकृत", rejected: "अस्वीकृत" },
  },
  es: {
    title: "Presupuestos guardados",
    description: "Consulta tus presupuestos y guárdalos como documentos PDF profesionales.",
    offerNumber: "N.º de presupuesto",
    customer: "Cliente",
    date: "Fecha",
    status: "Estado",
    total: "Total",
    action: "Acción",
    loading: "Cargando…",
    empty: "Aún no hay presupuestos guardados.",
    preparing: "Preparando…",
    savePdf: "Guardar PDF",
    pdfSaved: "PDF guardado:",
    loadError: "No se pudieron cargar los presupuestos.",
    exportError: "No se pudo crear el PDF.",
    rows: "registros",
    previous: "Anterior",
    next: "Siguiente",
    page: "Página",
    of: "de",
    statuses: { draft: "Borrador", sent: "Enviado", accepted: "Aceptado", rejected: "Rechazado" },
  },
  ar: {
    title: "العروض المحفوظة",
    description: "اعرض عروض الأسعار واحفظها كمستندات PDF احترافية.",
    offerNumber: "رقم العرض",
    customer: "العميل",
    date: "التاريخ",
    status: "الحالة",
    total: "الإجمالي",
    action: "الإجراء",
    loading: "جارٍ التحميل…",
    empty: "لا توجد عروض أسعار محفوظة حتى الآن.",
    preparing: "جارٍ التحضير…",
    savePdf: "حفظ PDF",
    pdfSaved: "تم حفظ PDF:",
    loadError: "تعذر تحميل عروض الأسعار.",
    exportError: "تعذر إنشاء ملف PDF.",
    rows: "سجل",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
    statuses: { draft: "مسودة", sent: "مُرسل", accepted: "مقبول", rejected: "مرفوض" },
  },
  pt: {
    title: "Propostas guardadas",
    description: "Consulte as suas propostas e guarde-as como documentos PDF profissionais.",
    offerNumber: "N.º da proposta",
    customer: "Cliente",
    date: "Data",
    status: "Estado",
    total: "Total",
    action: "Ação",
    loading: "A carregar…",
    empty: "Ainda não existem propostas guardadas.",
    preparing: "A preparar…",
    savePdf: "Guardar PDF",
    pdfSaved: "PDF guardado:",
    loadError: "Não foi possível carregar as propostas.",
    exportError: "Não foi possível criar o PDF.",
    rows: "registos",
    previous: "Anterior",
    next: "Seguinte",
    page: "Página",
    of: "de",
    statuses: { draft: "Rascunho", sent: "Enviada", accepted: "Aceite", rejected: "Rejeitada" },
  },
  fr: {
    title: "Devis enregistrés",
    description: "Consultez vos devis et enregistrez-les au format PDF professionnel.",
    offerNumber: "N° de devis",
    customer: "Client",
    date: "Date",
    status: "Statut",
    total: "Total",
    action: "Action",
    loading: "Chargement…",
    empty: "Aucun devis enregistré pour le moment.",
    preparing: "Préparation…",
    savePdf: "Enregistrer le PDF",
    pdfSaved: "PDF enregistré :",
    loadError: "Impossible de charger les devis.",
    exportError: "Impossible de créer le PDF.",
    rows: "éléments",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    of: "sur",
    statuses: { draft: "Brouillon", sent: "Envoyé", accepted: "Accepté", rejected: "Refusé" },
  },
  de: {
    title: "Gespeicherte Angebote",
    description: "Sehen Sie Ihre Angebote an und speichern Sie sie als professionelle PDF-Dokumente.",
    offerNumber: "Angebotsnr.",
    customer: "Kunde",
    date: "Datum",
    status: "Status",
    total: "Gesamt",
    action: "Aktion",
    loading: "Wird geladen…",
    empty: "Noch keine Angebote gespeichert.",
    preparing: "Wird vorbereitet…",
    savePdf: "PDF speichern",
    pdfSaved: "PDF gespeichert:",
    loadError: "Die Angebote konnten nicht geladen werden.",
    exportError: "Die PDF-Datei konnte nicht erstellt werden.",
    rows: "Einträge",
    previous: "Zurück",
    next: "Weiter",
    page: "Seite",
    of: "von",
    statuses: { draft: "Entwurf", sent: "Gesendet", accepted: "Angenommen", rejected: "Abgelehnt" },
  },
  ru: {
    title: "Сохранённые предложения",
    description: "Просматривайте предложения и сохраняйте их как профессиональные PDF-документы.",
    offerNumber: "№ предложения",
    customer: "Клиент",
    date: "Дата",
    status: "Статус",
    total: "Итого",
    action: "Действие",
    loading: "Загрузка…",
    empty: "Сохранённых предложений пока нет.",
    preparing: "Подготовка…",
    savePdf: "Сохранить PDF",
    pdfSaved: "PDF сохранён:",
    loadError: "Не удалось загрузить предложения.",
    exportError: "Не удалось создать PDF.",
    rows: "записей",
    previous: "Назад",
    next: "Далее",
    page: "Страница",
    of: "из",
    statuses: { draft: "Черновик", sent: "Отправлено", accepted: "Принято", rejected: "Отклонено" },
  },
  ja: {
    title: "保存済み見積書",
    description: "見積書を確認し、プロ仕様の PDF として保存できます。",
    offerNumber: "見積番号",
    customer: "顧客",
    date: "日付",
    status: "ステータス",
    total: "合計",
    action: "操作",
    loading: "読み込み中…",
    empty: "保存済みの見積書はまだありません。",
    preparing: "準備中…",
    savePdf: "PDFを保存",
    pdfSaved: "PDFを保存しました：",
    loadError: "見積書を読み込めませんでした。",
    exportError: "PDFを作成できませんでした。",
    rows: "件",
    previous: "前へ",
    next: "次へ",
    page: "ページ",
    of: "/",
    statuses: { draft: "下書き", sent: "送信済み", accepted: "承認済み", rejected: "却下" },
  },
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const { language } = useI18n();
  const copy = copies[language] || copies.en;
  const locale = localeByLanguage[language] || localeByLanguage.en;
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(offers.length / pageSize));
  const visibleOffers = offers.slice((page - 1) * pageSize, page * pageSize);
  const money = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "TRY" }),
    [locale],
  );
  const date = useMemo(() => new Intl.DateTimeFormat(locale), [locale]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.offers
      .list()
      .then((data) => active && setOffers(data))
      .catch(() => active && setNotice(copy.loadError))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [copy.loadError]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const exportPdf = async (offer) => {
    setExporting(offer.id);
    setNotice("");
    try {
      const result = await api.offers.exportPdf(offer.id);
      if (!result.canceled) setNotice(`${copy.pdfSaved} ${result.filePath}`);
    } catch {
      setNotice(copy.exportError);
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <PageHeader title={copy.title} description={copy.description} />
      {notice && (
        <div className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {notice}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm rtl:text-right">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">{copy.offerNumber}</th>
                <th className="px-5 py-4">{copy.customer}</th>
                <th className="px-5 py-4">{copy.date}</th>
                <th className="px-5 py-4">{copy.status}</th>
                <th className="px-5 py-4 text-right rtl:text-left">{copy.total}</th>
                <th className="px-5 py-4 text-right rtl:text-left">{copy.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    {copy.loading}
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    {copy.empty}
                  </td>
                </tr>
              ) : (
                visibleOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-blue-700">{offer.offer_number}</td>
                    <td className="px-5 py-4">{offer.customer_name}</td>
                    <td className="px-5 py-4">
                      {date.format(new Date(`${offer.offer_date}T00:00:00`))}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {copy.statuses[offer.status] || offer.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold rtl:text-left">
                      {money.format(offer.grand_total || 0)}
                    </td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      <button
                        type="button"
                        disabled={exporting === offer.id}
                        onClick={() => exportPdf(offer)}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                      >
                        {exporting === offer.id ? copy.preparing : copy.savePdf}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && offers.length > 0 && (
          <footer className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm">
            <span className="text-slate-500">{offers.length} {copy.rows}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40"
              >
                {copy.previous}
              </button>
              <strong>{copy.page} {page} {copy.of} {pageCount}</strong>
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage((value) => value + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40"
              >
                {copy.next}
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
