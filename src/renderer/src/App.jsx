import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import CreateOffer from './pages/CreateOffer.jsx';
import Offers from './pages/Offers.jsx';
import Settings from './pages/Settings.jsx';
import LanguageSelect from './pages/LanguageSelect.jsx';
import { useI18n } from './i18n.jsx';

export default function App() {
  const { language, t } = useI18n();
  if (!language) return <LanguageSelect/>;
  const links = [['/', t('dashboard')], ['/musteriler', t('customers')], ['/teklif-olustur', t('createOffer')], ['/teklifler', t('savedOffers')], ['/ayarlar', t('settings')]];
  return <div className="h-screen overflow-hidden bg-slate-50 text-slate-800"><aside className="fixed inset-y-0 start-0 w-64 overflow-y-auto bg-slate-950 p-6 text-white"><h1 className="text-2xl font-bold text-blue-400">ProTeklif</h1><p className="mt-1 text-sm text-slate-400">{t('localOffer')}</p><nav className="mt-10 space-y-2">{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `block rounded-lg px-4 py-3 ${isActive ? 'bg-blue-600' : 'text-slate-300 hover:bg-slate-800'}`}>{label}</NavLink>)}</nav></aside><main className="ms-64 h-screen min-w-0 overflow-y-auto overflow-x-hidden p-8 xl:p-10"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/musteriler" element={<Customers/>}/><Route path="/teklif-olustur" element={<CreateOffer/>}/><Route path="/teklifler" element={<Offers/>}/><Route path="/ayarlar" element={<Settings/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main></div>;
}
