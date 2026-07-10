import { useState } from 'react';
import { languages, translate, useI18n } from '../i18n.jsx';

export default function LanguageSelect() {
  const { setLanguage } = useI18n();
  const [selected, setSelected] = useState('tr');
  const text = (key) => translate(selected, key);
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6" dir={selected === 'ar' ? 'rtl' : 'ltr'}><section className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl"><div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">P</div><h1 className="mt-5 text-3xl font-bold">{text('selectLanguage')}</h1><p className="mt-2 text-slate-500">{text('selectHint')}</p></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{languages.map(([code, label]) => <button type="button" key={code} onClick={() => setSelected(code)} className={`rounded-xl border p-4 text-start transition ${selected === code ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}><strong className="block">{label}</strong><span className="text-xs uppercase text-slate-400">{code}</span></button>)}</div><button onClick={() => setLanguage(selected)} className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700">{text('continue')}</button></section></main>;
}
