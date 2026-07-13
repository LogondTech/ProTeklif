import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { navigationItems } from "./data/navigation.js";
import { getThemeCopy } from "./data/theme.js";
import { useI18n } from "./i18n.jsx";
import Customers from "./pages/Customers.jsx";
import CreateOffer from "./pages/CreateOffer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LanguageSelect from "./pages/LanguageSelect.jsx";
import Offers from "./pages/Offers.jsx";
import Settings from "./pages/Settings.jsx";
import { ThemeProvider, useTheme } from "./theme.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { language, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const themeTexts = getThemeCopy(language);

  if (!language) return <LanguageSelect />;

  const nextThemeLabel = theme === "dark" ? themeTexts.useLight : themeTexts.useDark;

  return (
    <div className="app-shell h-screen overflow-hidden bg-slate-50 text-slate-800">
      <aside className="app-sidebar fixed inset-y-0 start-0 w-52 overflow-y-auto p-4 text-white">
        <div className="app-brand">
          <h1 className="text-xl font-bold">ProTeklif</h1>
          <p className="mt-0.5 text-xs">{t("localOffer")}</p>
        </div>

        <nav className="mt-5 space-y-1" aria-label={t("localOffer")}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `app-nav-link block rounded-lg px-3 py-2 text-sm ${isActive ? "is-active" : ""}`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={nextThemeLabel}
          title={nextThemeLabel}
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === "dark" ? "☀" : "☾"}
          </span>
          <span>{theme === "dark" ? themeTexts.light : themeTexts.dark}</span>
        </button>
      </aside>

      <main className="app-main ms-52 h-screen min-w-0 overflow-y-auto overflow-x-hidden p-4 xl:p-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/musteriler" element={<Customers />} />
          <Route path="/teklif-olustur" element={<CreateOffer />} />
          <Route path="/teklifler" element={<Offers />} />
          <Route path="/ayarlar" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
