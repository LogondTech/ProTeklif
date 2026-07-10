import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useI18n } from "../i18n.jsx";
import { api } from "../services/api.js";

const copy = {
  tr: {
    title: "Teklif Oluştur",
    description:
      "Müşteri ve ürün/hizmet kalemlerini girin; toplamlar otomatik hesaplansın.",
    customer: "Müşteri",
    selectCustomer: "Müşteri seçin",
    noCustomers: "Kayıtlı müşteri bulunmuyor",
    offerDate: "Teklif tarihi",
    validUntil: "Geçerlilik tarihi",
    itemsTitle: "Ürün ve Hizmetler",
    itemsHelp:
      "Teklife en az bir kalem ekleyin. Çok sayıdaki satır bu alan içinde kaydırılır.",
    addRow: "+ Satır Ekle",
    productService: "Ürün / Hizmet",
    quantity: "Miktar",
    unit: "Birim",
    unitPrice: "Birim Fiyat",
    vat: "KDV %",
    amount: "Tutar",
    productPlaceholder: "Ürün veya hizmet adı",
    descriptionPlaceholder: "Açıklama (isteğe bağlı)",
    deleteRow: "Satırı sil",
    units: {
      piece: "Adet",
      hour: "Saat",
      day: "Gün",
      kg: "Kg",
      meter: "Metre",
      package: "Paket",
    },
    notes: "Notlar ve koşullar",
    notesPlaceholder:
      "Ödeme koşulları, teslim süresi veya diğer açıklamalar…",
    subtotal: "Ara toplam",
    vatTotal: "KDV toplamı",
    grandTotal: "Genel toplam",
    saving: "Kaydediliyor…",
    saveAndPdf: "Teklifi Kaydet ve PDF Oluştur",
    loadError: "Müşteriler yüklenemedi. Lütfen tekrar deneyin.",
    saveError: "Teklif kaydedilemedi. Lütfen bilgileri kontrol edip tekrar deneyin.",
  },
  en: {
    title: "Create Quote",
    description:
      "Enter the customer and product/service items; totals are calculated automatically.",
    customer: "Customer",
    selectCustomer: "Select a customer",
    noCustomers: "No customers found",
    offerDate: "Quote date",
    validUntil: "Valid until",
    itemsTitle: "Products and Services",
    itemsHelp:
      "Add at least one item to the quote. Additional rows scroll within this area.",
    addRow: "+ Add Row",
    productService: "Product / Service",
    quantity: "Quantity",
    unit: "Unit",
    unitPrice: "Unit Price",
    vat: "VAT %",
    amount: "Amount",
    productPlaceholder: "Product or service name",
    descriptionPlaceholder: "Description (optional)",
    deleteRow: "Delete row",
    units: {
      piece: "Piece",
      hour: "Hour",
      day: "Day",
      kg: "Kg",
      meter: "Meter",
      package: "Package",
    },
    notes: "Notes and terms",
    notesPlaceholder: "Payment terms, delivery time, or other details…",
    subtotal: "Subtotal",
    vatTotal: "Total VAT",
    grandTotal: "Grand total",
    saving: "Saving…",
    saveAndPdf: "Save Quote and Create PDF",
    loadError: "Customers could not be loaded. Please try again.",
    saveError:
      "The quote could not be saved. Check the information and try again.",
  },
  zh: {
    title: "创建报价",
    description: "输入客户和产品/服务项目，系统将自动计算总额。",
    customer: "客户",
    selectCustomer: "选择客户",
    noCustomers: "未找到客户",
    offerDate: "报价日期",
    validUntil: "有效期至",
    itemsTitle: "产品与服务",
    itemsHelp: "请至少添加一个报价项目。更多行将在此区域内滚动显示。",
    addRow: "+ 添加一行",
    productService: "产品 / 服务",
    quantity: "数量",
    unit: "单位",
    unitPrice: "单价",
    vat: "增值税 %",
    amount: "金额",
    productPlaceholder: "产品或服务名称",
    descriptionPlaceholder: "说明（可选）",
    deleteRow: "删除此行",
    units: {
      piece: "件",
      hour: "小时",
      day: "天",
      kg: "千克",
      meter: "米",
      package: "包",
    },
    notes: "备注与条款",
    notesPlaceholder: "付款条款、交付时间或其他说明…",
    subtotal: "小计",
    vatTotal: "增值税合计",
    grandTotal: "总计",
    saving: "正在保存…",
    saveAndPdf: "保存报价并生成 PDF",
    loadError: "无法加载客户，请重试。",
    saveError: "无法保存报价，请检查信息后重试。",
  },
  hi: {
    title: "कोटेशन बनाएँ",
    description:
      "ग्राहक और उत्पाद/सेवा मदें दर्ज करें; कुल राशि अपने आप गणना होगी।",
    customer: "ग्राहक",
    selectCustomer: "ग्राहक चुनें",
    noCustomers: "कोई ग्राहक नहीं मिला",
    offerDate: "कोटेशन की तारीख",
    validUntil: "तक मान्य",
    itemsTitle: "उत्पाद और सेवाएँ",
    itemsHelp:
      "कोटेशन में कम से कम एक मद जोड़ें। अतिरिक्त पंक्तियाँ इसी क्षेत्र में स्क्रॉल होंगी।",
    addRow: "+ पंक्ति जोड़ें",
    productService: "उत्पाद / सेवा",
    quantity: "मात्रा",
    unit: "इकाई",
    unitPrice: "इकाई मूल्य",
    vat: "वैट %",
    amount: "राशि",
    productPlaceholder: "उत्पाद या सेवा का नाम",
    descriptionPlaceholder: "विवरण (वैकल्पिक)",
    deleteRow: "पंक्ति हटाएँ",
    units: {
      piece: "नग",
      hour: "घंटा",
      day: "दिन",
      kg: "किग्रा",
      meter: "मीटर",
      package: "पैकेज",
    },
    notes: "टिप्पणियाँ और शर्तें",
    notesPlaceholder: "भुगतान की शर्तें, डिलीवरी समय या अन्य विवरण…",
    subtotal: "उप-योग",
    vatTotal: "कुल वैट",
    grandTotal: "कुल योग",
    saving: "सहेजा जा रहा है…",
    saveAndPdf: "कोटेशन सहेजें और PDF बनाएँ",
    loadError: "ग्राहक लोड नहीं हो सके। कृपया फिर प्रयास करें।",
    saveError:
      "कोटेशन सहेजा नहीं जा सका। जानकारी जाँचकर फिर प्रयास करें।",
  },
  es: {
    title: "Crear presupuesto",
    description:
      "Introduce el cliente y los productos/servicios; los totales se calculan automáticamente.",
    customer: "Cliente",
    selectCustomer: "Selecciona un cliente",
    noCustomers: "No se encontraron clientes",
    offerDate: "Fecha del presupuesto",
    validUntil: "Válido hasta",
    itemsTitle: "Productos y servicios",
    itemsHelp:
      "Añade al menos un concepto al presupuesto. Las filas adicionales se desplazan dentro de esta área.",
    addRow: "+ Añadir fila",
    productService: "Producto / Servicio",
    quantity: "Cantidad",
    unit: "Unidad",
    unitPrice: "Precio unitario",
    vat: "IVA %",
    amount: "Importe",
    productPlaceholder: "Nombre del producto o servicio",
    descriptionPlaceholder: "Descripción (opcional)",
    deleteRow: "Eliminar fila",
    units: {
      piece: "Unidad",
      hour: "Hora",
      day: "Día",
      kg: "Kg",
      meter: "Metro",
      package: "Paquete",
    },
    notes: "Notas y condiciones",
    notesPlaceholder: "Condiciones de pago, plazo de entrega u otros detalles…",
    subtotal: "Subtotal",
    vatTotal: "IVA total",
    grandTotal: "Total general",
    saving: "Guardando…",
    saveAndPdf: "Guardar presupuesto y crear PDF",
    loadError: "No se pudieron cargar los clientes. Inténtalo de nuevo.",
    saveError:
      "No se pudo guardar el presupuesto. Revisa la información e inténtalo de nuevo.",
  },
  ar: {
    title: "إنشاء عرض سعر",
    description: "أدخل العميل وبنود المنتجات/الخدمات؛ تُحسب الإجماليات تلقائيًا.",
    customer: "العميل",
    selectCustomer: "اختر عميلاً",
    noCustomers: "لم يتم العثور على عملاء",
    offerDate: "تاريخ عرض السعر",
    validUntil: "صالح حتى",
    itemsTitle: "المنتجات والخدمات",
    itemsHelp:
      "أضف بندًا واحدًا على الأقل إلى عرض السعر. يتم تمرير الصفوف الإضافية داخل هذه المنطقة.",
    addRow: "+ إضافة صف",
    productService: "المنتج / الخدمة",
    quantity: "الكمية",
    unit: "الوحدة",
    unitPrice: "سعر الوحدة",
    vat: "ضريبة القيمة المضافة %",
    amount: "المبلغ",
    productPlaceholder: "اسم المنتج أو الخدمة",
    descriptionPlaceholder: "الوصف (اختياري)",
    deleteRow: "حذف الصف",
    units: {
      piece: "قطعة",
      hour: "ساعة",
      day: "يوم",
      kg: "كغ",
      meter: "متر",
      package: "حزمة",
    },
    notes: "الملاحظات والشروط",
    notesPlaceholder: "شروط الدفع أو مدة التسليم أو تفاصيل أخرى…",
    subtotal: "المجموع الفرعي",
    vatTotal: "إجمالي الضريبة",
    grandTotal: "المجموع الكلي",
    saving: "جارٍ الحفظ…",
    saveAndPdf: "حفظ عرض السعر وإنشاء PDF",
    loadError: "تعذر تحميل العملاء. يرجى المحاولة مرة أخرى.",
    saveError:
      "تعذر حفظ عرض السعر. تحقق من المعلومات وحاول مرة أخرى.",
  },
  pt: {
    title: "Criar proposta",
    description:
      "Informe o cliente e os itens de produtos/serviços; os totais são calculados automaticamente.",
    customer: "Cliente",
    selectCustomer: "Selecione um cliente",
    noCustomers: "Nenhum cliente encontrado",
    offerDate: "Data da proposta",
    validUntil: "Válida até",
    itemsTitle: "Produtos e serviços",
    itemsHelp:
      "Adicione pelo menos um item à proposta. As linhas adicionais rolam dentro desta área.",
    addRow: "+ Adicionar linha",
    productService: "Produto / Serviço",
    quantity: "Quantidade",
    unit: "Unidade",
    unitPrice: "Preço unitário",
    vat: "IVA %",
    amount: "Valor",
    productPlaceholder: "Nome do produto ou serviço",
    descriptionPlaceholder: "Descrição (opcional)",
    deleteRow: "Excluir linha",
    units: {
      piece: "Unidade",
      hour: "Hora",
      day: "Dia",
      kg: "Kg",
      meter: "Metro",
      package: "Pacote",
    },
    notes: "Notas e condições",
    notesPlaceholder: "Condições de pagamento, prazo de entrega ou outros detalhes…",
    subtotal: "Subtotal",
    vatTotal: "IVA total",
    grandTotal: "Total geral",
    saving: "Salvando…",
    saveAndPdf: "Salvar proposta e criar PDF",
    loadError: "Não foi possível carregar os clientes. Tente novamente.",
    saveError:
      "Não foi possível salvar a proposta. Verifique os dados e tente novamente.",
  },
  fr: {
    title: "Créer un devis",
    description:
      "Saisissez le client et les produits/services ; les totaux sont calculés automatiquement.",
    customer: "Client",
    selectCustomer: "Sélectionnez un client",
    noCustomers: "Aucun client trouvé",
    offerDate: "Date du devis",
    validUntil: "Valable jusqu’au",
    itemsTitle: "Produits et services",
    itemsHelp:
      "Ajoutez au moins un élément au devis. Les lignes supplémentaires défilent dans cette zone.",
    addRow: "+ Ajouter une ligne",
    productService: "Produit / Service",
    quantity: "Quantité",
    unit: "Unité",
    unitPrice: "Prix unitaire",
    vat: "TVA %",
    amount: "Montant",
    productPlaceholder: "Nom du produit ou du service",
    descriptionPlaceholder: "Description (facultative)",
    deleteRow: "Supprimer la ligne",
    units: {
      piece: "Pièce",
      hour: "Heure",
      day: "Jour",
      kg: "Kg",
      meter: "Mètre",
      package: "Forfait",
    },
    notes: "Notes et conditions",
    notesPlaceholder: "Conditions de paiement, délai de livraison ou autres détails…",
    subtotal: "Sous-total",
    vatTotal: "Total TVA",
    grandTotal: "Total général",
    saving: "Enregistrement…",
    saveAndPdf: "Enregistrer le devis et créer le PDF",
    loadError: "Impossible de charger les clients. Veuillez réessayer.",
    saveError:
      "Impossible d’enregistrer le devis. Vérifiez les informations et réessayez.",
  },
  de: {
    title: "Angebot erstellen",
    description:
      "Kunden sowie Produkt-/Dienstleistungspositionen eingeben; Summen werden automatisch berechnet.",
    customer: "Kunde",
    selectCustomer: "Kunden auswählen",
    noCustomers: "Keine Kunden gefunden",
    offerDate: "Angebotsdatum",
    validUntil: "Gültig bis",
    itemsTitle: "Produkte und Dienstleistungen",
    itemsHelp:
      "Fügen Sie dem Angebot mindestens eine Position hinzu. Weitere Zeilen werden in diesem Bereich gescrollt.",
    addRow: "+ Zeile hinzufügen",
    productService: "Produkt / Dienstleistung",
    quantity: "Menge",
    unit: "Einheit",
    unitPrice: "Einzelpreis",
    vat: "MwSt. %",
    amount: "Betrag",
    productPlaceholder: "Name des Produkts oder der Dienstleistung",
    descriptionPlaceholder: "Beschreibung (optional)",
    deleteRow: "Zeile löschen",
    units: {
      piece: "Stück",
      hour: "Stunde",
      day: "Tag",
      kg: "Kg",
      meter: "Meter",
      package: "Paket",
    },
    notes: "Hinweise und Bedingungen",
    notesPlaceholder: "Zahlungsbedingungen, Lieferzeit oder weitere Angaben…",
    subtotal: "Zwischensumme",
    vatTotal: "MwSt. gesamt",
    grandTotal: "Gesamtsumme",
    saving: "Wird gespeichert…",
    saveAndPdf: "Angebot speichern und PDF erstellen",
    loadError: "Kunden konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    saveError:
      "Das Angebot konnte nicht gespeichert werden. Prüfen Sie die Angaben und versuchen Sie es erneut.",
  },
  ru: {
    title: "Создать предложение",
    description:
      "Укажите клиента и товары/услуги; итоговые суммы рассчитываются автоматически.",
    customer: "Клиент",
    selectCustomer: "Выберите клиента",
    noCustomers: "Клиенты не найдены",
    offerDate: "Дата предложения",
    validUntil: "Действительно до",
    itemsTitle: "Товары и услуги",
    itemsHelp:
      "Добавьте в предложение хотя бы одну позицию. Дополнительные строки прокручиваются внутри этой области.",
    addRow: "+ Добавить строку",
    productService: "Товар / Услуга",
    quantity: "Количество",
    unit: "Единица",
    unitPrice: "Цена за единицу",
    vat: "НДС %",
    amount: "Сумма",
    productPlaceholder: "Название товара или услуги",
    descriptionPlaceholder: "Описание (необязательно)",
    deleteRow: "Удалить строку",
    units: {
      piece: "Шт.",
      hour: "Час",
      day: "День",
      kg: "Кг",
      meter: "Метр",
      package: "Пакет",
    },
    notes: "Примечания и условия",
    notesPlaceholder: "Условия оплаты, срок доставки или другие сведения…",
    subtotal: "Подытог",
    vatTotal: "Всего НДС",
    grandTotal: "Итого",
    saving: "Сохранение…",
    saveAndPdf: "Сохранить предложение и создать PDF",
    loadError: "Не удалось загрузить клиентов. Повторите попытку.",
    saveError:
      "Не удалось сохранить предложение. Проверьте данные и повторите попытку.",
  },
  ja: {
    title: "見積書を作成",
    description: "顧客と商品／サービス項目を入力すると、合計が自動計算されます。",
    customer: "顧客",
    selectCustomer: "顧客を選択",
    noCustomers: "顧客が見つかりません",
    offerDate: "見積日",
    validUntil: "有効期限",
    itemsTitle: "商品とサービス",
    itemsHelp:
      "見積書に1項目以上追加してください。追加した行はこの領域内でスクロールします。",
    addRow: "+ 行を追加",
    productService: "商品 / サービス",
    quantity: "数量",
    unit: "単位",
    unitPrice: "単価",
    vat: "消費税 %",
    amount: "金額",
    productPlaceholder: "商品またはサービス名",
    descriptionPlaceholder: "説明（任意）",
    deleteRow: "行を削除",
    units: {
      piece: "個",
      hour: "時間",
      day: "日",
      kg: "kg",
      meter: "メートル",
      package: "パッケージ",
    },
    notes: "備考と条件",
    notesPlaceholder: "支払条件、納期、その他の詳細…",
    subtotal: "小計",
    vatTotal: "消費税合計",
    grandTotal: "総合計",
    saving: "保存中…",
    saveAndPdf: "見積書を保存して PDF を作成",
    loadError: "顧客を読み込めませんでした。もう一度お試しください。",
    saveError: "見積書を保存できませんでした。内容を確認して再度お試しください。",
  },
};

const localeByLanguage = {
  tr: "tr-TR",
  en: "en-US",
  zh: "zh-CN",
  hi: "hi-IN",
  es: "es-ES",
  ar: "ar-SA",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ru: "ru-RU",
  ja: "ja-JP",
};

const today = new Date().toISOString().slice(0, 10);
const futureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const newItem = () => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  quantity: 1,
  unit: "Adet",
  unitPrice: "",
  vatRate: 20,
});
const money = (value, language) =>
  new Intl.NumberFormat(localeByLanguage[language] || localeByLanguage.en, {
    style: "currency",
    currency: "TRY",
  }).format(value || 0);

export default function CreateOffer() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const c = copy[language] || copy.en;
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customerId: "",
    offerDate: today,
    validUntil: futureDate(15),
    notes: "",
  });
  const [items, setItems] = useState([newItem()]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.customers.list().then(setCustomers).catch(() => setError(c.loadError));
  }, [c.loadError]);

  const totals = useMemo(
    () =>
      items.reduce(
        (result, item) => {
          const base =
            (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
          result.subtotal += base;
          result.vat += (base * (Number(item.vatRate) || 0)) / 100;
          return result;
        },
        { subtotal: 0, vat: 0 },
      ),
    [items],
  );

  const updateItem = (id, field, value) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const offer = await api.offers.create({
        ...form,
        customerId: Number(form.customerId),
        items: items.map(({ id, ...item }) => item),
      });
      await api.offers.exportPdf(offer.id);
      navigate("/teklifler");
    } catch {
      setError(c.saveError);
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <>
      <PageHeader title={c.title} description={c.description} />
      {error && (
        <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={submit}>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <label className="text-sm font-medium">
              {c.customer} *
              <select
                required
                value={form.customerId}
                onChange={(event) =>
                  setForm({ ...form, customerId: event.target.value })
                }
                className={`mt-1 ${input}`}
              >
                <option value="">
                  {customers.length === 0 ? c.noCustomers : c.selectCustomer}
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company
                      ? `${customer.company} - ${customer.name}`
                      : customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              {c.offerDate} *
              <input
                required
                type="date"
                value={form.offerDate}
                onChange={(event) =>
                  setForm({ ...form, offerDate: event.target.value })
                }
                className={`mt-1 ${input}`}
              />
            </label>
            <label className="text-sm font-medium">
              {c.validUntil}
              <input
                type="date"
                min={form.offerDate}
                value={form.validUntil}
                onChange={(event) =>
                  setForm({ ...form, validUntil: event.target.value })
                }
                className={`mt-1 ${input}`}
              />
            </label>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h3 className="text-lg font-bold">{c.itemsTitle}</h3>
              <p className="text-sm text-slate-500">{c.itemsHelp}</p>
            </div>
            <button
              type="button"
              onClick={() => setItems([...items, newItem()])}
              className="shrink-0 rounded-lg border border-blue-200 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            >
              {c.addRow}
            </button>
          </header>
          <div className="h-[390px] overflow-auto">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[42%]" />
                <col className="w-[8%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[15%]" />
                <col className="w-[5%]" />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase text-slate-500 shadow-[0_1px_0_#e2e8f0]">
                <tr>
                  <th className="px-4 py-3">{c.productService}</th>
                  <th className="px-2 py-3">{c.quantity}</th>
                  <th className="px-2 py-3">{c.unit}</th>
                  <th className="px-2 py-3">{c.unitPrice}</th>
                  <th className="px-2 py-3">{c.vat}</th>
                  <th className="px-3 py-3 text-right">{c.amount}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td className="p-3">
                      <input
                        required
                        placeholder={c.productPlaceholder}
                        value={item.name}
                        onChange={(event) =>
                          updateItem(item.id, "name", event.target.value)
                        }
                        className={input}
                      />
                      <input
                        placeholder={c.descriptionPlaceholder}
                        value={item.description}
                        onChange={(event) =>
                          updateItem(item.id, "description", event.target.value)
                        }
                        className="mt-1.5 w-full border-0 px-3 py-1 text-xs text-slate-500 outline-none placeholder:text-slate-400"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(item.id, "quantity", event.target.value)
                        }
                        className={`${input} px-2`}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.unit}
                        onChange={(event) =>
                          updateItem(item.id, "unit", event.target.value)
                        }
                        className={`${input} px-2`}
                      >
                        <option value="Adet">{c.units.piece}</option>
                        <option value="Saat">{c.units.hour}</option>
                        <option value="Gün">{c.units.day}</option>
                        <option value="Kg">{c.units.kg}</option>
                        <option value="Metre">{c.units.meter}</option>
                        <option value="Paket">{c.units.package}</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(event) =>
                          updateItem(item.id, "unitPrice", event.target.value)
                        }
                        className={`${input} px-2`}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.vatRate}
                        onChange={(event) =>
                          updateItem(item.id, "vatRate", event.target.value)
                        }
                        className={`${input} px-2`}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </td>
                    <td className="overflow-hidden whitespace-nowrap p-3 text-right font-semibold">
                      {money(
                        (Number(item.quantity) || 0) *
                          (Number(item.unitPrice) || 0),
                        language,
                      )}
                    </td>
                    <td className="p-1 text-center">
                      <button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() =>
                          setItems(items.filter((row) => row.id !== item.id))
                        }
                        className="rounded px-2 py-1 text-red-600 disabled:opacity-30"
                        aria-label={c.deleteRow}
                        title={c.deleteRow}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="text-sm font-medium">
              {c.notes}
              <textarea
                rows="5"
                maxLength="2000"
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                placeholder={c.notesPlaceholder}
                className={`mt-2 ${input}`}
              />
            </label>
          </section>
          <section className="rounded-xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex justify-between py-2 text-slate-300">
              <span>{c.subtotal}</span>
              <strong>{money(totals.subtotal, language)}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-700 py-2 text-slate-300">
              <span>{c.vatTotal}</span>
              <strong>{money(totals.vat, language)}</strong>
            </div>
            <div className="flex justify-between py-5 text-xl">
              <span>{c.grandTotal}</span>
              <strong className="text-blue-400">
                {money(totals.subtotal + totals.vat, language)}
              </strong>
            </div>
            <button
              disabled={busy || customers.length === 0}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              {busy ? c.saving : c.saveAndPdf}
            </button>
          </section>
        </div>
      </form>
    </>
  );
}
