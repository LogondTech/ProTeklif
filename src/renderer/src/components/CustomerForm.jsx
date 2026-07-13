import { useState } from 'react';
import { customerFormCopy, emptyCustomer } from '../data/customerForm.js';
import { useI18n } from '../i18n.jsx';

export default function CustomerForm({ initialValue, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValue ? {
    name: initialValue.name || '',
    company: initialValue.company || '',
    taxNumber: initialValue.tax_number || '',
    email: initialValue.email || '',
    phone: initialValue.phone || '',
    address: initialValue.address || ''
  } : emptyCustomer);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const { language } = useI18n();
  const text = customerFormCopy[language] || customerFormCopy.en;

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'nameRequired';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'emailInvalid';
    if (form.taxNumber && !/^\d{10,11}$/.test(form.taxNumber.replace(/\s/g, ''))) next.taxNumber = 'taxInvalid';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await onSubmit(form);
    } finally {
      setBusy(false);
    }
  };

  const inputClass = (field) => `mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-400' : 'border-slate-300'}`;

  return (
    <form onSubmit={submit} className="p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">
          {text.name} *
          <input autoFocus name="name" maxLength="120" value={form.name} onChange={change} className={inputClass('name')} />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{text[errors.name]}</span>}
        </label>
        <label className="text-sm font-medium">
          {text.company}
          <input name="company" maxLength="160" value={form.company} onChange={change} className={inputClass('company')} />
        </label>
        <label className="text-sm font-medium">
          {text.taxNumber}
          <input name="taxNumber" inputMode="numeric" maxLength="11" value={form.taxNumber} onChange={change} className={inputClass('taxNumber')} />
          {errors.taxNumber && <span className="mt-1 block text-xs text-red-600">{text[errors.taxNumber]}</span>}
        </label>
        <label className="text-sm font-medium">
          {text.email}
          <input name="email" type="email" maxLength="160" value={form.email} onChange={change} className={inputClass('email')} />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{text[errors.email]}</span>}
        </label>
        <label className="text-sm font-medium">
          {text.phone}
          <input name="phone" type="tel" maxLength="30" value={form.phone} onChange={change} className={inputClass('phone')} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          {text.address}
          <textarea name="address" rows="3" maxLength="500" value={form.address} onChange={change} className={inputClass('address')} />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold">{text.cancel}</button>
        <button type="submit" disabled={busy} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60">{busy ? text.saving : submitLabel}</button>
      </div>
    </form>
  );
}
