import { useState } from 'react';
import { useI18n } from '../i18n.jsx';

const emptyCustomer = { name: '', company: '', taxNumber: '', email: '', phone: '', address: '' };

const copy = {
  tr: {
    name: 'Müşteri adı', company: 'Firma', taxNumber: 'Vergi / T.C. numarası', email: 'E-posta', phone: 'Telefon', address: 'Adres',
    nameRequired: 'Müşteri adı zorunludur.', emailInvalid: 'Geçerli bir e-posta adresi girin.',
    taxInvalid: 'Vergi/T.C. numarası 10 veya 11 rakam olmalıdır.', cancel: 'İptal', saving: 'Kaydediliyor…'
  },
  en: {
    name: 'Customer name', company: 'Company', taxNumber: 'Tax / National ID', email: 'Email', phone: 'Phone', address: 'Address',
    nameRequired: 'Customer name is required.', emailInvalid: 'Enter a valid email address.',
    taxInvalid: 'Tax/National ID must contain 10 or 11 digits.', cancel: 'Cancel', saving: 'Saving…'
  },
  zh: {
    name: '客户姓名', company: '公司', taxNumber: '税号 / 身份证号', email: '电子邮件', phone: '电话', address: '地址',
    nameRequired: '客户姓名为必填项。', emailInvalid: '请输入有效的电子邮件地址。',
    taxInvalid: '税号/身份证号必须为 10 或 11 位数字。', cancel: '取消', saving: '正在保存…'
  },
  hi: {
    name: 'ग्राहक का नाम', company: 'कंपनी', taxNumber: 'कर / राष्ट्रीय पहचान संख्या', email: 'ईमेल', phone: 'फ़ोन', address: 'पता',
    nameRequired: 'ग्राहक का नाम आवश्यक है।', emailInvalid: 'मान्य ईमेल पता दर्ज करें।',
    taxInvalid: 'कर/राष्ट्रीय पहचान संख्या 10 या 11 अंकों की होनी चाहिए।', cancel: 'रद्द करें', saving: 'सहेजा जा रहा है…'
  },
  es: {
    name: 'Nombre del cliente', company: 'Empresa', taxNumber: 'N.º fiscal / documento', email: 'Correo electrónico', phone: 'Teléfono', address: 'Dirección',
    nameRequired: 'El nombre del cliente es obligatorio.', emailInvalid: 'Introduce un correo electrónico válido.',
    taxInvalid: 'El número fiscal/documento debe tener 10 u 11 dígitos.', cancel: 'Cancelar', saving: 'Guardando…'
  },
  ar: {
    name: 'اسم العميل', company: 'الشركة', taxNumber: 'الرقم الضريبي / الهوية', email: 'البريد الإلكتروني', phone: 'الهاتف', address: 'العنوان',
    nameRequired: 'اسم العميل مطلوب.', emailInvalid: 'أدخل عنوان بريد إلكتروني صالحًا.',
    taxInvalid: 'يجب أن يتكون الرقم الضريبي/الهوية من 10 أو 11 رقمًا.', cancel: 'إلغاء', saving: 'جارٍ الحفظ…'
  },
  pt: {
    name: 'Nome do cliente', company: 'Empresa', taxNumber: 'N.º fiscal / documento', email: 'E-mail', phone: 'Telefone', address: 'Endereço',
    nameRequired: 'O nome do cliente é obrigatório.', emailInvalid: 'Insira um endereço de e-mail válido.',
    taxInvalid: 'O número fiscal/documento deve ter 10 ou 11 dígitos.', cancel: 'Cancelar', saving: 'Salvando…'
  },
  fr: {
    name: 'Nom du client', company: 'Entreprise', taxNumber: 'N° fiscal / identité', email: 'E-mail', phone: 'Téléphone', address: 'Adresse',
    nameRequired: 'Le nom du client est obligatoire.', emailInvalid: 'Saisissez une adresse e-mail valide.',
    taxInvalid: 'Le numéro fiscal/d’identité doit contenir 10 ou 11 chiffres.', cancel: 'Annuler', saving: 'Enregistrement…'
  },
  de: {
    name: 'Kundenname', company: 'Firma', taxNumber: 'Steuer- / Identifikationsnummer', email: 'E-Mail', phone: 'Telefon', address: 'Adresse',
    nameRequired: 'Der Kundenname ist erforderlich.', emailInvalid: 'Geben Sie eine gültige E-Mail-Adresse ein.',
    taxInvalid: 'Die Steuer-/Identifikationsnummer muss 10 oder 11 Ziffern enthalten.', cancel: 'Abbrechen', saving: 'Wird gespeichert…'
  },
  ru: {
    name: 'Имя клиента', company: 'Компания', taxNumber: 'ИНН / идентификационный номер', email: 'Эл. почта', phone: 'Телефон', address: 'Адрес',
    nameRequired: 'Имя клиента обязательно.', emailInvalid: 'Введите действительный адрес электронной почты.',
    taxInvalid: 'Налоговый/идентификационный номер должен содержать 10 или 11 цифр.', cancel: 'Отмена', saving: 'Сохранение…'
  },
  ja: {
    name: '顧客名', company: '会社', taxNumber: '税番号 / 個人識別番号', email: 'メール', phone: '電話', address: '住所',
    nameRequired: '顧客名は必須です。', emailInvalid: '有効なメールアドレスを入力してください。',
    taxInvalid: '税番号/個人識別番号は 10 桁または 11 桁で入力してください。', cancel: 'キャンセル', saving: '保存中…'
  }
};

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
  const text = copy[language] || copy.en;

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
