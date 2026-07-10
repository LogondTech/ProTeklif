import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const languages = [
  ['tr', 'Türkçe'], ['en', 'English'], ['zh', '中文'], ['hi', 'हिन्दी'], ['es', 'Español'],
  ['ar', 'العربية'], ['pt', 'Português'], ['fr', 'Français'], ['de', 'Deutsch'], ['ru', 'Русский'], ['ja', '日本語']
];

const messages = {
  tr: { selectLanguage:'Dilinizi seçin',selectHint:'ProTeklif hangi dilde kullanılsın?',continue:'Devam Et',dashboard:'Dashboard',customers:'Müşteriler',createOffer:'Teklif Oluştur',savedOffers:'Kayıtlı Teklifler',settings:'Ayarlar',localOffer:'Yerel teklif yönetimi',newCustomer:'Yeni Müşteri',newOffer:'Yeni Teklif',savePdf:'PDF Kaydet',actions:'İşlemler',previous:'Önceki',next:'Sonraki',page:'Sayfa',of:'/',rows:'kayıt',changeLanguage:'Uygulama Dili',languageHelp:'Arayüz dilini değiştirin.' },
  en: { selectLanguage:'Choose your language',selectHint:'Which language should ProTeklif use?',continue:'Continue',dashboard:'Dashboard',customers:'Customers',createOffer:'Create Quote',savedOffers:'Saved Quotes',settings:'Settings',localOffer:'Local quote management',newCustomer:'New Customer',newOffer:'New Quote',savePdf:'Save PDF',actions:'Actions',previous:'Previous',next:'Next',page:'Page',of:'of',rows:'records',changeLanguage:'Application Language',languageHelp:'Change the interface language.' },
  zh: { selectLanguage:'选择您的语言',selectHint:'ProTeklif 应使用哪种语言？',continue:'继续',dashboard:'仪表板',customers:'客户',createOffer:'创建报价',savedOffers:'已保存报价',settings:'设置',localOffer:'本地报价管理',newCustomer:'新客户',newOffer:'新报价',savePdf:'保存 PDF',actions:'操作',previous:'上一页',next:'下一页',page:'第',of:'页，共',rows:'条记录',changeLanguage:'应用语言',languageHelp:'更改界面语言。' },
  hi: { selectLanguage:'अपनी भाषा चुनें',selectHint:'ProTeklif किस भाषा में उपयोग हो?',continue:'जारी रखें',dashboard:'डैशबोर्ड',customers:'ग्राहक',createOffer:'कोटेशन बनाएँ',savedOffers:'सहेजे गए कोटेशन',settings:'सेटिंग्स',localOffer:'स्थानीय कोटेशन प्रबंधन',newCustomer:'नया ग्राहक',newOffer:'नया कोटेशन',savePdf:'PDF सहेजें',actions:'कार्रवाई',previous:'पिछला',next:'अगला',page:'पृष्ठ',of:'में से',rows:'रिकॉर्ड',changeLanguage:'ऐप की भाषा',languageHelp:'इंटरफ़ेस की भाषा बदलें।' },
  es: { selectLanguage:'Elige tu idioma',selectHint:'¿En qué idioma deseas usar ProTeklif?',continue:'Continuar',dashboard:'Panel',customers:'Clientes',createOffer:'Crear presupuesto',savedOffers:'Presupuestos guardados',settings:'Ajustes',localOffer:'Gestión local de presupuestos',newCustomer:'Nuevo cliente',newOffer:'Nuevo presupuesto',savePdf:'Guardar PDF',actions:'Acciones',previous:'Anterior',next:'Siguiente',page:'Página',of:'de',rows:'registros',changeLanguage:'Idioma de la aplicación',languageHelp:'Cambia el idioma de la interfaz.' },
  ar: { selectLanguage:'اختر لغتك',selectHint:'بأي لغة تريد استخدام ProTeklif؟',continue:'متابعة',dashboard:'لوحة التحكم',customers:'العملاء',createOffer:'إنشاء عرض',savedOffers:'العروض المحفوظة',settings:'الإعدادات',localOffer:'إدارة العروض المحلية',newCustomer:'عميل جديد',newOffer:'عرض جديد',savePdf:'حفظ PDF',actions:'الإجراءات',previous:'السابق',next:'التالي',page:'صفحة',of:'من',rows:'سجل',changeLanguage:'لغة التطبيق',languageHelp:'غيّر لغة الواجهة.' },
  pt: { selectLanguage:'Escolha seu idioma',selectHint:'Em qual idioma deseja usar o ProTeklif?',continue:'Continuar',dashboard:'Painel',customers:'Clientes',createOffer:'Criar proposta',savedOffers:'Propostas salvas',settings:'Configurações',localOffer:'Gestão local de propostas',newCustomer:'Novo cliente',newOffer:'Nova proposta',savePdf:'Salvar PDF',actions:'Ações',previous:'Anterior',next:'Próxima',page:'Página',of:'de',rows:'registros',changeLanguage:'Idioma do aplicativo',languageHelp:'Altere o idioma da interface.' },
  fr: { selectLanguage:'Choisissez votre langue',selectHint:'Dans quelle langue utiliser ProTeklif ?',continue:'Continuer',dashboard:'Tableau de bord',customers:'Clients',createOffer:'Créer un devis',savedOffers:'Devis enregistrés',settings:'Paramètres',localOffer:'Gestion locale des devis',newCustomer:'Nouveau client',newOffer:'Nouveau devis',savePdf:'Enregistrer le PDF',actions:'Actions',previous:'Précédent',next:'Suivant',page:'Page',of:'sur',rows:'éléments',changeLanguage:"Langue de l’application",languageHelp:"Modifiez la langue de l’interface." },
  de: { selectLanguage:'Sprache auswählen',selectHint:'In welcher Sprache soll ProTeklif verwendet werden?',continue:'Weiter',dashboard:'Übersicht',customers:'Kunden',createOffer:'Angebot erstellen',savedOffers:'Gespeicherte Angebote',settings:'Einstellungen',localOffer:'Lokale Angebotsverwaltung',newCustomer:'Neuer Kunde',newOffer:'Neues Angebot',savePdf:'PDF speichern',actions:'Aktionen',previous:'Zurück',next:'Weiter',page:'Seite',of:'von',rows:'Einträge',changeLanguage:'Anwendungssprache',languageHelp:'Ändern Sie die Sprache der Oberfläche.' },
  ru: { selectLanguage:'Выберите язык',selectHint:'На каком языке использовать ProTeklif?',continue:'Продолжить',dashboard:'Панель',customers:'Клиенты',createOffer:'Создать предложение',savedOffers:'Сохранённые предложения',settings:'Настройки',localOffer:'Локальное управление предложениями',newCustomer:'Новый клиент',newOffer:'Новое предложение',savePdf:'Сохранить PDF',actions:'Действия',previous:'Назад',next:'Далее',page:'Страница',of:'из',rows:'записей',changeLanguage:'Язык приложения',languageHelp:'Изменить язык интерфейса.' },
  ja: { selectLanguage:'言語を選択',selectHint:'ProTeklif をどの言語で使用しますか？',continue:'続行',dashboard:'ダッシュボード',customers:'顧客',createOffer:'見積書を作成',savedOffers:'保存済み見積書',settings:'設定',localOffer:'ローカル見積管理',newCustomer:'新規顧客',newOffer:'新規見積',savePdf:'PDFを保存',actions:'操作',previous:'前へ',next:'次へ',page:'ページ',of:'/',rows:'件',changeLanguage:'アプリの言語',languageHelp:'インターフェースの言語を変更します。' }
};

export const translate = (language, key) =>
  (messages[language] || messages.en)[key] || messages.en[key] || key;

const I18nContext = createContext(null);
export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('proteklif-language') || '');
  useEffect(() => {
    document.documentElement.lang = language || 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  const setLanguage = (code) => { localStorage.setItem('proteklif-language', code); setLanguageState(code); document.documentElement.lang = code; document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'; };
  const value = useMemo(() => ({ language, setLanguage, t: (key) => translate(language, key) }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export const useI18n = () => useContext(I18nContext);
