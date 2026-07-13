import { useCallback, useEffect, useState } from 'react';
import CustomerForm from '../components/CustomerForm.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { CUSTOMER_PAGE_SIZE, customersCopy } from '../data/customers.js';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

export default function Customers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState(1);
  const { language, t } = useI18n();
  const text = customersCopy[language] || customersCopy.en;
  const pageCount = Math.max(1, Math.ceil(items.length / CUSTOMER_PAGE_SIZE));
  const visibleItems = items.slice((page - 1) * CUSTOMER_PAGE_SIZE, page * CUSTOMER_PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.customers.list());
    } catch {
      setNotice({ type: 'error', text: text.loadFailed });
    } finally {
      setLoading(false);
    }
  }, [text.loadFailed]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage((current) => Math.min(current, pageCount)); }, [pageCount]);

  const saveNew = async (data) => {
    try {
      await api.customers.create(data);
      setDialog(null);
      setNotice({ type: 'success', text: text.added });
      await load();
    } catch {
      setNotice({ type: 'error', text: text.createFailed });
    }
  };

  const saveEdit = async (data) => {
    try {
      await api.customers.update(dialog.customer.id, data);
      setDialog(null);
      setNotice({ type: 'success', text: text.updated });
      await load();
    } catch {
      setNotice({ type: 'error', text: text.updateFailed });
    }
  };

  const remove = async () => {
    try {
      await api.customers.remove(dialog.customer.id);
      setDialog(null);
      setNotice({ type: 'success', text: text.deleted });
      await load();
    } catch {
      setDialog(null);
      setNotice({ type: 'error', text: text.deleteFailed });
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <PageHeader title={t('customers')} description={text.description} />
        <button
          type="button"
          onClick={() => setDialog({ type: 'create' })}
          className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          + {t('newCustomer')}
        </button>
      </div>

      {notice && (
        <div className={`mb-5 flex justify-between gap-4 rounded-lg px-4 py-3 text-sm ${notice.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label={text.closeNotice}>×</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-start text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">{text.customerCompany}</th>
                <th className="px-5 py-4">{text.contact}</th>
                <th className="px-5 py-4">{text.taxNo}</th>
                <th className="px-5 py-4">{text.address}</th>
                <th className="px-5 py-4 text-end">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">{text.loading}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-500">{text.empty}</td></tr>
              ) : visibleItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <strong className="block text-slate-900">{item.name}</strong>
                    <span className="text-slate-500">{item.company || text.individual}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="block">{item.phone || '—'}</span>
                    <span className="text-slate-500">{item.email || '—'}</span>
                  </td>
                  <td className="px-5 py-4">{item.tax_number || '—'}</td>
                  <td className="max-w-xs truncate px-5 py-4" title={item.address || ''}>{item.address || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-end">
                    <button
                      type="button"
                      onClick={() => setDialog({ type: 'edit', customer: item })}
                      className="me-2 rounded-md px-3 py-2 font-medium text-blue-700 hover:bg-blue-50"
                    >
                      {text.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDialog({ type: 'delete', customer: item })}
                      className="rounded-md px-3 py-2 font-medium text-red-700 hover:bg-red-50"
                    >
                      {text.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <footer className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm">
            <span className="text-slate-500">{items.length} {t('rows')}</span>
            <div className="flex items-center gap-3">
              <button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40">{t('previous')}</button>
              <strong>{t('page')} {page} {t('of')} {pageCount}</strong>
              <button type="button" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-40">{t('next')}</button>
            </div>
          </footer>
        )}
      </div>

      {dialog?.type === 'create' && (
        <Modal title={text.createTitle} onClose={() => setDialog(null)}>
          <CustomerForm submitLabel={text.addCustomer} onSubmit={saveNew} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === 'edit' && (
        <Modal title={text.editTitle} onClose={() => setDialog(null)}>
          <CustomerForm initialValue={dialog.customer} submitLabel={text.saveChanges} onSubmit={saveEdit} onCancel={() => setDialog(null)} />
        </Modal>
      )}

      {dialog?.type === 'delete' && (
        <Modal title={text.deleteTitle} onClose={() => setDialog(null)}>
          <div className="p-6">
            <p>{text.deleteQuestion.replace('{name}', dialog.customer.name)}</p>
            <p className="mt-2 text-sm text-slate-500">{text.deleteWarning}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDialog(null)} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold">{text.cancel}</button>
              <button type="button" onClick={remove} className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white">{text.confirmDelete}</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
