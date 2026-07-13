import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { emptyCompany, settingsTextsByLanguage } from "../data/settings.js";
import { getThemeCopy } from "../data/theme.js";
import { api } from "../services/api.js";
import { languages, useI18n } from "../i18n.jsx";
import { useTheme } from "../theme.jsx";

export default function Settings() {
  const { language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const texts = {
    ...settingsTextsByLanguage.en,
    ...(settingsTextsByLanguage[language] || {}),
  };
  const themeTexts = getThemeCopy(language);
  const [form, setForm] = useState(emptyCompany);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    let active = true;
    api.company
      .get()
      .then((data) => {
        if (!active) return;
        setForm({
          name: data.name || "",
          logoDataUrl: data.logo_data_url || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          taxOffice: data.tax_office || "",
          taxNumber: data.tax_number || "",
        });
      })
      .catch(() => active && setNotice({ key: "loadError" }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const change = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const selectLogo = async () => {
    setNotice(null);
    try {
      const result = await api.company.selectLogo();
      if (!result.canceled) {
        setForm((current) => ({ ...current, logoDataUrl: result.dataUrl }));
      }
    } catch {
      setNotice({ key: "logoError" });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await api.company.save(form);
      setNotice({ key: "saved" });
    } catch {
      setNotice({ key: "saveError" });
    } finally {
      setBusy(false);
    }
  };

  const backup = async () => {
    setBackingUp(true);
    setNotice(null);
    try {
      const result = await api.backup();
      setNotice(
        result.canceled
          ? { key: "backupCanceled" }
          : { key: "backupSaved", detail: result.filePath },
      );
    } catch {
      setNotice({ key: "backupError" });
    } finally {
      setBackingUp(false);
    }
  };

  const input =
    "settings-input mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400";
  const noticeText = notice
    ? `${texts[notice.key]}${notice.detail ? ` ${notice.detail}` : ""}`
    : "";
  const noticeIsError = notice?.key?.endsWith("Error");

  return (
    <>
      <PageHeader title={texts.title} description={texts.description} />

      {noticeText && (
        <div
          className={`settings-notice mb-3 rounded-lg px-3 py-2 text-sm ${noticeIsError ? "settings-notice--error" : ""}`}
          role={noticeIsError ? "alert" : "status"}
        >
          {noticeText}
        </div>
      )}

      <div className="settings-layout">
        <form
          onSubmit={save}
          className="settings-card min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          aria-busy={loading || busy}
        >
          <header className="settings-card-header">
            <div>
              <h3 className="text-base font-bold">{texts.companyInfo}</h3>
              {loading && <p className="mt-1 text-xs text-slate-500">{texts.loadingCompany}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || busy}
              className="primary-button rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? texts.saving : texts.saveCompany}
            </button>
          </header>

          <div className="settings-logo-row">
            <div className="settings-logo-preview">
              {form.logoDataUrl ? (
                <img
                  src={form.logoDataUrl}
                  className="h-full w-full object-contain p-2"
                  alt={texts.logoAlt}
                />
              ) : (
                <span>{texts.noLogo}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={selectLogo}
                  disabled={loading}
                  className="secondary-button rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {texts.selectLogo}
                </button>
                {form.logoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, logoDataUrl: "" }))}
                    className="danger-link rounded-lg px-2 py-2 text-sm font-semibold text-red-600"
                  >
                    {texts.removeLogo}
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">{texts.logoHint}</p>
            </div>
          </div>

          <div className="settings-fields">
            <label className="settings-label md:col-span-2">
              {texts.companyName} *
              <input
                required
                disabled={loading}
                name="name"
                maxLength="160"
                value={form.name}
                onChange={change}
                placeholder={texts.companyNamePlaceholder}
                className={input}
              />
            </label>
            <label className="settings-label">
              {texts.phone}
              <input
                disabled={loading}
                name="phone"
                maxLength="30"
                value={form.phone}
                onChange={change}
                placeholder={texts.phonePlaceholder}
                className={input}
              />
            </label>
            <label className="settings-label">
              {texts.email}
              <input
                disabled={loading}
                type="email"
                name="email"
                maxLength="160"
                value={form.email}
                onChange={change}
                placeholder={texts.emailPlaceholder}
                className={input}
              />
            </label>
            <label className="settings-label">
              {texts.taxOffice}
              <input
                disabled={loading}
                name="taxOffice"
                maxLength="100"
                value={form.taxOffice}
                onChange={change}
                placeholder={texts.taxOfficePlaceholder}
                className={input}
              />
            </label>
            <label className="settings-label">
              {texts.taxNumber}
              <input
                disabled={loading}
                name="taxNumber"
                maxLength="20"
                value={form.taxNumber}
                onChange={change}
                placeholder={texts.taxNumberPlaceholder}
                className={input}
              />
            </label>
            <label className="settings-label md:col-span-2">
              {texts.address}
              <textarea
                disabled={loading}
                name="address"
                rows="2"
                maxLength="500"
                value={form.address}
                onChange={change}
                placeholder={texts.addressPlaceholder}
                className={input}
              />
            </label>
          </div>
        </form>

        <aside className="settings-sidebar">
          <section className="settings-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold">{themeTexts.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{themeTexts.description}</p>
            <div className="theme-picker mt-3" role="radiogroup" aria-label={themeTexts.title}>
              <button
                type="button"
                role="radio"
                aria-checked={theme === "light"}
                className={`theme-choice ${theme === "light" ? "is-active" : ""}`}
                onClick={() => setTheme("light")}
              >
                <span className="theme-swatch theme-swatch--light" aria-hidden="true" />
                <span>{themeTexts.light}</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={theme === "dark"}
                className={`theme-choice ${theme === "dark" ? "is-active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <span className="theme-swatch theme-swatch--dark" aria-hidden="true" />
                <span>{themeTexts.dark}</span>
              </button>
            </div>

            <div className="settings-divider">
              <label className="settings-label" htmlFor="settings-language">
                {texts.languageTitle}
              </label>
              <p className="mt-1 text-xs text-slate-500">{texts.languageHelp}</p>
              <select
                id="settings-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="settings-input mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {languages.map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="settings-card rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold">{texts.backupTitle}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{texts.backupDescription}</p>
            <button
              type="button"
              onClick={backup}
              disabled={backingUp}
              className="secondary-action mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {backingUp ? texts.backingUp : texts.createBackup}
            </button>
          </section>
        </aside>
      </div>
    </>
  );
}
