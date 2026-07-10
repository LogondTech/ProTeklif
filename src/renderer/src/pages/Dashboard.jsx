import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

const localeByLanguage = {
  tr: 'tr-TR', en: 'en-US', zh: 'zh-CN', hi: 'hi-IN', es: 'es-ES', ar: 'ar-SA',
  pt: 'pt-BR', fr: 'fr-FR', de: 'de-DE', ru: 'ru-RU', ja: 'ja-JP'
};

const copy = {
  tr: {
    description: 'Teklif performansınıza ve son hareketlere hızlı bakış.',
    totalOffers: 'Toplam Teklif', totalAmount: 'Toplam Teklif Tutarı', approvedRevenue: 'Onaylanan Ciro',
    recentTitle: 'Son 5 Teklif', recentDescription: 'En son oluşturduğunuz teklifler', viewAll: 'Tümünü Gör',
    empty: 'Henüz teklif yok. İlk teklifinizi oluşturun.',
    statuses: { draft: 'Taslak', sent: 'Gönderildi', accepted: 'Onaylandı', rejected: 'Reddedildi' }
  },
  en: {
    description: 'A quick overview of your quote performance and recent activity.',
    totalOffers: 'Total Quotes', totalAmount: 'Total Quote Value', approvedRevenue: 'Approved Revenue',
    recentTitle: 'Latest 5 Quotes', recentDescription: 'Your most recently created quotes', viewAll: 'View All',
    empty: 'No quotes yet. Create your first quote.',
    statuses: { draft: 'Draft', sent: 'Sent', accepted: 'Accepted', rejected: 'Rejected' }
  },
  zh: {
    description: '快速查看报价表现和近期动态。',
    totalOffers: '报价总数', totalAmount: '报价总额', approvedRevenue: '已批准收入',
    recentTitle: '最近 5 份报价', recentDescription: '您最近创建的报价', viewAll: '查看全部',
    empty: '暂无报价。请创建您的第一份报价。',
    statuses: { draft: '草稿', sent: '已发送', accepted: '已接受', rejected: '已拒绝' }
  },
  hi: {
    description: 'अपने कोटेशन प्रदर्शन और हाल की गतिविधि पर एक त्वरित नज़र।',
    totalOffers: 'कुल कोटेशन', totalAmount: 'कुल कोटेशन राशि', approvedRevenue: 'स्वीकृत आय',
    recentTitle: 'नवीनतम 5 कोटेशन', recentDescription: 'आपके हाल ही में बनाए गए कोटेशन', viewAll: 'सभी देखें',
    empty: 'अभी कोई कोटेशन नहीं है। अपना पहला कोटेशन बनाएँ।',
    statuses: { draft: 'मसौदा', sent: 'भेजा गया', accepted: 'स्वीकृत', rejected: 'अस्वीकृत' }
  },
  es: {
    description: 'Un vistazo rápido al rendimiento de tus presupuestos y a la actividad reciente.',
    totalOffers: 'Presupuestos totales', totalAmount: 'Importe total', approvedRevenue: 'Ingresos aprobados',
    recentTitle: 'Últimos 5 presupuestos', recentDescription: 'Tus presupuestos creados más recientemente', viewAll: 'Ver todos',
    empty: 'Aún no hay presupuestos. Crea tu primer presupuesto.',
    statuses: { draft: 'Borrador', sent: 'Enviado', accepted: 'Aceptado', rejected: 'Rechazado' }
  },
  ar: {
    description: 'نظرة سريعة على أداء عروض الأسعار والنشاط الأخير.',
    totalOffers: 'إجمالي العروض', totalAmount: 'إجمالي قيمة العروض', approvedRevenue: 'الإيرادات المعتمدة',
    recentTitle: 'أحدث 5 عروض', recentDescription: 'أحدث عروض الأسعار التي أنشأتها', viewAll: 'عرض الكل',
    empty: 'لا توجد عروض أسعار بعد. أنشئ عرضك الأول.',
    statuses: { draft: 'مسودة', sent: 'مُرسل', accepted: 'مقبول', rejected: 'مرفوض' }
  },
  pt: {
    description: 'Uma visão rápida do desempenho das propostas e das atividades recentes.',
    totalOffers: 'Total de propostas', totalAmount: 'Valor total das propostas', approvedRevenue: 'Receita aprovada',
    recentTitle: 'Últimas 5 propostas', recentDescription: 'Suas propostas criadas mais recentemente', viewAll: 'Ver todas',
    empty: 'Ainda não há propostas. Crie sua primeira proposta.',
    statuses: { draft: 'Rascunho', sent: 'Enviada', accepted: 'Aceita', rejected: 'Rejeitada' }
  },
  fr: {
    description: 'Un aperçu rapide des performances de vos devis et de l’activité récente.',
    totalOffers: 'Total des devis', totalAmount: 'Montant total des devis', approvedRevenue: 'Chiffre d’affaires approuvé',
    recentTitle: '5 derniers devis', recentDescription: 'Vos devis créés le plus récemment', viewAll: 'Tout afficher',
    empty: 'Aucun devis pour le moment. Créez votre premier devis.',
    statuses: { draft: 'Brouillon', sent: 'Envoyé', accepted: 'Accepté', rejected: 'Refusé' }
  },
  de: {
    description: 'Ein schneller Überblick über Ihre Angebotsleistung und die letzten Aktivitäten.',
    totalOffers: 'Angebote insgesamt', totalAmount: 'Gesamtwert der Angebote', approvedRevenue: 'Bestätigter Umsatz',
    recentTitle: 'Letzte 5 Angebote', recentDescription: 'Ihre zuletzt erstellten Angebote', viewAll: 'Alle anzeigen',
    empty: 'Noch keine Angebote vorhanden. Erstellen Sie Ihr erstes Angebot.',
    statuses: { draft: 'Entwurf', sent: 'Gesendet', accepted: 'Angenommen', rejected: 'Abgelehnt' }
  },
  ru: {
    description: 'Краткий обзор эффективности предложений и последних действий.',
    totalOffers: 'Всего предложений', totalAmount: 'Общая сумма предложений', approvedRevenue: 'Подтверждённая выручка',
    recentTitle: 'Последние 5 предложений', recentDescription: 'Ваши недавно созданные предложения', viewAll: 'Показать все',
    empty: 'Предложений пока нет. Создайте первое предложение.',
    statuses: { draft: 'Черновик', sent: 'Отправлено', accepted: 'Принято', rejected: 'Отклонено' }
  },
  ja: {
    description: '見積実績と最近の動きをすばやく確認できます。',
    totalOffers: '見積総数', totalAmount: '見積合計金額', approvedRevenue: '承認済み売上',
    recentTitle: '最新の見積 5 件', recentDescription: '最近作成した見積書', viewAll: 'すべて表示',
    empty: '見積はまだありません。最初の見積を作成してください。',
    statuses: { draft: '下書き', sent: '送信済み', accepted: '承認済み', rejected: '却下' }
  }
};

const formatMoney = (value, language) => new Intl.NumberFormat(localeByLanguage[language] || 'en-US', {
  style: 'currency',
  currency: 'TRY'
}).format(value || 0);

export default function Dashboard() {
  const [data, setData] = useState({ customers: [], offers: [] });
  const [loading, setLoading] = useState(true);
  const { language, t } = useI18n();
  const text = copy[language] || copy.en;

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
    [text.totalAmount, formatMoney(total, language), 'text-violet-600'],
    [text.approvedRevenue, formatMoney(accepted, language), 'text-emerald-600']
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
              <strong className="text-end">{formatMoney(offer.grand_total, language)}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
