import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import CustomerCombobox from '../components/CustomerCombobox.jsx';
import {
  createOfferCopy,
  createOfferInitialForm,
  createOfferItem,
  formatOfferMoney,
  offerFieldClass,
  offerUnitOptions,
  offerVatRates,
} from '../data/createOffer.js';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

export default function CreateOffer() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const texts = createOfferCopy[language] || createOfferCopy.en;
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(createOfferInitialForm);
  const [items, setItems] = useState(() => [createOfferItem()]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api.customers.list()
      .then((data) => active && setCustomers(data))
      .catch(() => active && setError(texts.loadError));
    return () => { active = false; };
  }, [texts.loadError]);

  const totals = useMemo(() => items.reduce((result, item) => {
    const base = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    return {
      subtotal: result.subtotal + base,
      vat: result.vat + ((base * (Number(item.vatRate) || 0)) / 100),
    };
  }, { subtotal: 0, vat: 0 }), [items]);

  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateItem = (id, field, value) => setItems((current) => current.map((item) => (
    item.id === id ? { ...item, [field]: value } : item
  )));
  const addItem = () => setItems((current) => [...current, createOfferItem()]);
  const removeItem = (id) => setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const offer = await api.offers.create({
        ...form,
        customerId: Number(form.customerId),
        items: items.map(({ id, ...item }) => item),
      });
      await api.offers.exportPdf(offer.id, localStorage.getItem('proteklif-pdf-template') || 'modern');
      navigate('/teklifler');
    } catch {
      setError(texts.saveError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="create-offer-page mx-auto max-w-[1500px]">
      <PageHeader title={texts.title} description={texts.description} />

      {error && <div role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form onSubmit={submit} className="space-y-3">
        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(260px,1.5fr)_minmax(180px,.7fr)_minmax(180px,.7fr)]">
            <label className="text-xs font-semibold text-slate-700">
              <span className="mb-1 block">{texts.customer} *</span>
              <CustomerCombobox customers={customers} value={form.customerId} onChange={(value) => updateForm('customerId', value)} placeholder={texts.selectCustomer} emptyText={texts.noCustomers} className={offerFieldClass} />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span className="mb-1 block">{texts.offerDate} *</span>
              <input required type="date" value={form.offerDate} onChange={(event) => updateForm('offerDate', event.target.value)} className={offerFieldClass} />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              <span className="mb-1 block">{texts.validUntil}</span>
              <input type="date" min={form.offerDate} value={form.validUntil} onChange={(event) => updateForm('validUntil', event.target.value)} className={offerFieldClass} />
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
            <div>
              <h3 className="text-base font-bold text-slate-900">{texts.itemsTitle}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{texts.itemsHelp}</p>
            </div>
            <button type="button" onClick={addItem} className="h-8 rounded-md border border-blue-300 bg-blue-50 px-3 text-sm font-semibold text-blue-700 hover:bg-blue-100">{texts.addRow}</button>
          </header>

          <div className="overflow-x-auto">
            <div className="min-w-[960px]">
              <div className="offer-item-grid grid grid-cols-[minmax(280px,1fr)_82px_105px_120px_82px_125px_32px] items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <span>{texts.productService}</span><span>{texts.quantity}</span><span>{texts.unit}</span><span>{texts.unitPrice}</span><span>{texts.vat}</span><span className="text-right">{texts.amount}</span><span />
              </div>
              <div className="max-h-[330px] overflow-y-auto">
                {items.map((item, index) => (
                  <div key={item.id} className="offer-item-grid grid grid-cols-[minmax(280px,1fr)_82px_105px_120px_82px_125px_32px] items-start gap-2 border-b border-slate-100 px-3 py-2 last:border-b-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 shrink-0 text-center text-xs font-semibold text-slate-400">{index + 1}</span>
                        <input required value={item.name} onChange={(event) => updateItem(item.id, 'name', event.target.value)} placeholder={texts.productPlaceholder} className={offerFieldClass} />
                      </div>
                      <input value={item.description} onChange={(event) => updateItem(item.id, 'description', event.target.value)} placeholder={texts.descriptionPlaceholder} className="offer-description mt-1 h-7 w-full border-0 bg-transparent px-7 text-xs text-slate-500 outline-none placeholder:text-slate-400 focus:text-slate-800" />
                    </div>
                    <input required type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, 'quantity', event.target.value)} className={offerFieldClass} />
                    <select value={item.unit} onChange={(event) => updateItem(item.id, 'unit', event.target.value)} className={offerFieldClass}>
                      {offerUnitOptions.map(([value, key]) => <option key={value} value={value}>{texts.units[key]}</option>)}
                    </select>
                    <input required type="number" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(item.id, 'unitPrice', event.target.value)} className={offerFieldClass} />
                    <select value={item.vatRate} onChange={(event) => updateItem(item.id, 'vatRate', event.target.value)} className={offerFieldClass}>
                      {offerVatRates.map((rate) => <option key={rate} value={rate}>%{rate}</option>)}
                    </select>
                    <div className="flex h-9 items-center justify-end whitespace-nowrap text-sm font-bold text-slate-900">{formatOfferMoney((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), language)}</div>
                    <button type="button" disabled={items.length === 1} onClick={() => removeItem(item.id)} aria-label={texts.deleteRow} title={texts.deleteRow} className="flex h-9 items-center justify-center rounded-md text-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-25">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
          <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <label className="text-xs font-semibold text-slate-700">
              <span className="mb-1 block">{texts.notes}</span>
              <textarea rows="3" maxLength="2000" value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} placeholder={texts.notesPlaceholder} className="offer-field min-h-[84px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
            </label>
          </section>

          <section className="offer-summary rounded-lg bg-slate-900 p-3.5 text-white shadow-sm">
            <div className="flex justify-between py-1 text-sm text-slate-300"><span>{texts.subtotal}</span><strong>{formatOfferMoney(totals.subtotal, language)}</strong></div>
            <div className="flex justify-between border-b border-slate-700 py-1.5 text-sm text-slate-300"><span>{texts.vatTotal}</span><strong>{formatOfferMoney(totals.vat, language)}</strong></div>
            <div className="flex items-center justify-between py-2.5"><span className="font-semibold">{texts.grandTotal}</span><strong className="text-lg text-blue-400">{formatOfferMoney(totals.subtotal + totals.vat, language)}</strong></div>
            <button disabled={busy || customers.length === 0} className="h-9 w-full rounded-md bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{busy ? texts.saving : texts.saveAndPdf}</button>
          </section>
        </div>
      </form>
    </div>
  );
}
