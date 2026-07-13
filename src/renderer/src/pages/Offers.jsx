import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import PdfPreview from "../components/offers/PdfPreview.jsx";
import PdfTemplatePicker from "../components/offers/PdfTemplatePicker.jsx";
import {
  getOfferTexts,
  getOffersLocale,
  getStoredPdfTemplate,
  OFFER_PAGE_SIZE,
  storePdfTemplate,
} from "../data/offers.js";
import { useI18n } from "../i18n.jsx";
import { api } from "../services/api.js";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [pdfTemplate, setPdfTemplate] = useState(getStoredPdfTemplate);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const { language } = useI18n();
  const texts = useMemo(() => getOfferTexts(language), [language]);
  const formatLocale = getOffersLocale(language);
  const pageCount = Math.max(1, Math.ceil(offers.length / OFFER_PAGE_SIZE));
  const visibleOffers = offers.slice(
    (page - 1) * OFFER_PAGE_SIZE,
    page * OFFER_PAGE_SIZE,
  );
  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) || null,
    [offers, selectedOfferId],
  );
  const money = useMemo(
    () => new Intl.NumberFormat(formatLocale, { style: "currency", currency: "TRY" }),
    [formatLocale],
  );
  const date = useMemo(() => new Intl.DateTimeFormat(formatLocale), [formatLocale]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    api.offers
      .list()
      .then((data) => {
        if (!active) return;
        setOffers(data);
        setSelectedOfferId((current) =>
          data.some((offer) => offer.id === current) ? current : data[0]?.id ?? null,
        );
      })
      .catch(() => active && setNotice(texts.loadError))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [texts.loadError]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  useEffect(() => {
    if (!selectedOfferId) {
      setPreviewHtml("");
      setPreviewError("");
      setPreviewLoading(false);
      return undefined;
    }

    let active = true;
    setPreviewLoading(true);
    setPreviewError("");

    api.offers
      .previewHtml(selectedOfferId, pdfTemplate, language)
      .then((html) => {
        if (active) setPreviewHtml(html);
      })
      .catch(() => {
        if (!active) return;
        setPreviewHtml("");
        setPreviewError(texts.previewError);
      })
      .finally(() => active && setPreviewLoading(false));

    return () => {
      active = false;
    };
  }, [language, pdfTemplate, selectedOfferId, texts.previewError]);

  const chooseTemplate = (templateId) => {
    setPdfTemplate(templateId);
    storePdfTemplate(templateId);
  };

  const exportPdf = async (offer) => {
    setExporting(offer.id);
    setNotice("");
    try {
      const result = await api.offers.exportPdf(offer.id, pdfTemplate, language);
      if (!result.canceled) setNotice(`${texts.pdfSaved} ${result.filePath}`);
    } catch {
      setNotice(texts.exportError);
    } finally {
      setExporting(null);
    }
  };

  return (
    <>
      <PageHeader title={texts.title} description={texts.description} />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3">
          <h3 className="m-0 text-sm font-bold text-slate-800">{texts.templateTitle}</h3>
          <p className="mt-1 text-xs text-slate-500">{texts.templateHint}</p>
        </div>
        <PdfTemplatePicker value={pdfTemplate} onChange={chooseTemplate} texts={texts} />
      </section>

      {notice && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-800">
          {notice}
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm rtl:text-right">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-8 px-3 py-2.5" aria-label={texts.selected} />
                  <th className="px-3 py-2.5">{texts.offerNumber}</th>
                  <th className="px-3 py-2.5">{texts.customer}</th>
                  <th className="px-3 py-2.5">{texts.date}</th>
                  <th className="px-3 py-2.5">{texts.status}</th>
                  <th className="px-3 py-2.5 text-right rtl:text-left">{texts.total}</th>
                  <th className="px-3 py-2.5 text-right rtl:text-left">{texts.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      {texts.loading}
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      {texts.empty}
                    </td>
                  </tr>
                ) : (
                  visibleOffers.map((offer) => {
                    const isSelected = offer.id === selectedOfferId;
                    return (
                      <tr
                        key={offer.id}
                        aria-selected={isSelected}
                        onClick={() => setSelectedOfferId(offer.id)}
                        className={`cursor-pointer transition hover:bg-slate-50 ${
                          isSelected ? "bg-slate-100" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <span
                            className={`block h-3.5 w-3.5 rounded-full border-2 ${
                              isSelected
                                ? "border-blue-600 bg-blue-600 ring-2 ring-blue-500/20"
                                : "border-slate-300"
                            }`}
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-blue-700">
                          {offer.offer_number}
                        </td>
                        <td className="max-w-44 truncate px-3 py-2.5 text-slate-800">
                          {offer.customer_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-800">
                          {date.format(new Date(`${offer.offer_date}T00:00:00`))}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-800">
                            {texts.statuses[offer.status] || offer.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold text-slate-800 rtl:text-left">
                          {money.format(offer.grand_total || 0)}
                        </td>
                        <td className="px-3 py-2.5 text-right rtl:text-left">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedOfferId(offer.id);
                              }}
                              className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                            >
                              {isSelected ? texts.selected : texts.selectPreview}
                            </button>
                            <button
                              type="button"
                              disabled={exporting === offer.id}
                              onClick={(event) => {
                                event.stopPropagation();
                                exportPdf(offer);
                              }}
                              className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                            >
                              {exporting === offer.id ? texts.preparing : texts.savePdf}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && offers.length > 0 && (
            <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2.5 text-xs">
              <span className="text-slate-500">
                {offers.length} {texts.rows}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 disabled:opacity-40"
                >
                  {texts.previous}
                </button>
                <strong className="text-slate-800">
                  {texts.page} {page} {texts.of} {pageCount}
                </strong>
                <button
                  type="button"
                  disabled={page === pageCount}
                  onClick={() => setPage((value) => value + 1)}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 disabled:opacity-40"
                >
                  {texts.next}
                </button>
              </div>
            </footer>
          )}
        </section>

        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-4">
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-slate-800">{texts.previewTitle}</h3>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {selectedOffer
                  ? `${selectedOffer.offer_number} · ${texts.templates[pdfTemplate]}`
                  : texts.previewEmpty}
              </p>
            </div>
            {selectedOffer && (
              <button
                type="button"
                disabled={exporting === selectedOffer.id}
                onClick={() => exportPdf(selectedOffer)}
                className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {exporting === selectedOffer.id ? texts.preparing : texts.savePdf}
              </button>
            )}
          </header>
          <PdfPreview
            html={previewHtml}
            loading={previewLoading}
            message={
              previewLoading
                ? texts.previewLoading
                : previewError || texts.previewEmpty
            }
            title={texts.previewTitle}
          />
        </aside>
      </div>
    </>
  );
}
