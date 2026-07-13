import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { dashboardCopy, formatDashboardMoney } from '../data/dashboard.js';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

export default function Dashboard() {
  const [data, setData] = useState({ customers: [], offers: [] });
  const [loading, setLoading] = useState(true);
  const { language, t } = useI18n();
  const text = dashboardCopy[language] || dashboardCopy.en;

  useEffect(() => {
    Promise.all([api.customers.list(), api.offers.list()])
      .then(([customers, offers]) => setData({ customers, offers }))
      .catch(() => setData({ customers: [], offers: [] }))
      .finally(() => setLoading(false));
  }, []);

  const total = data.offers.reduce((sum, offer) => sum + Number(offer.grand_total || 0), 0);
  const accepted = data.offers
    .filter((offer) => offer.status === 'accepted')
    .reduce((sum, offer) => sum + Number(offer.grand_total || 0), 0);

  const cards = [
    [text.totalOffers, data.offers.length, 'text-blue-600'],
    [text.totalAmount, formatDashboardMoney(total, language), 'text-violet-600'],
    [text.approvedRevenue, formatDashboardMoney(accepted, language), 'text-emerald-600']
  ];

  return (
    <>
      <div className="flex items-start justify-between gap-5">
        <PageHeader title={t('dashboard')} description={text.description} />
        <Link to="/teklif-olustur" className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700">
          + {t('newOffer')}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {cards.map(([label, value, color]) => (
          <section key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <strong className={`mt-3 block text-3xl ${color}`}>{loading ? '—' : value}</strong>
          </section>
        ))}
      </div>

      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold">{text.recentTitle}</h3>
            <p className="text-sm text-slate-500">{text.recentDescription}</p>
          </div>
          <Link to="/teklifler" className="shrink-0 text-sm font-semibold text-blue-700">
            {text.viewAll} <span aria-hidden="true">→</span>
          </Link>
        </header>
        <div className="divide-y divide-slate-100">
          {!loading && data.offers.length === 0 ? (
            <p className="p-8 text-center text-slate-500">{text.empty}</p>
          ) : data.offers.slice(0, 5).map((offer) => (
            <div key={offer.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr] items-center gap-4 px-6 py-4">
              <strong className="text-blue-700">{offer.offer_number}</strong>
              <span>{offer.customer_name}</span>
              <span className="text-sm text-slate-500">{text.statuses[offer.status] || offer.status}</span>
              <strong className="text-end">{formatDashboardMoney(offer.grand_total, language)}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
