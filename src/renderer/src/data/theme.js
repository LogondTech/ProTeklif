export const themeCopy = {
  tr: {
    title: "Görünüm",
    description: "Uygulamanın renk temasını seçin.",
    light: "Açık",
    dark: "Koyu",
    useLight: "Açık temaya geç",
    useDark: "Koyu temaya geç",
    toggle: "Tema değiştir",
  },
  en: {
    title: "Appearance",
    description: "Choose the application color theme.",
    light: "Light",
    dark: "Dark",
    useLight: "Switch to light theme",
    useDark: "Switch to dark theme",
    toggle: "Change theme",
  },
  zh: { title: "外观", description: "选择应用程序的颜色主题。", light: "浅色", dark: "深色", useLight: "切换到浅色主题", useDark: "切换到深色主题", toggle: "更改主题" },
  hi: { title: "दिखावट", description: "ऐप की रंग थीम चुनें।", light: "हल्का", dark: "गहरा", useLight: "हल्की थीम पर जाएँ", useDark: "गहरी थीम पर जाएँ", toggle: "थीम बदलें" },
  es: { title: "Apariencia", description: "Elige el tema de color de la aplicación.", light: "Claro", dark: "Oscuro", useLight: "Cambiar al tema claro", useDark: "Cambiar al tema oscuro", toggle: "Cambiar tema" },
  ar: { title: "المظهر", description: "اختر سمة ألوان التطبيق.", light: "فاتح", dark: "داكن", useLight: "التبديل إلى السمة الفاتحة", useDark: "التبديل إلى السمة الداكنة", toggle: "تغيير السمة" },
  pt: { title: "Aparência", description: "Escolha o tema de cores da aplicação.", light: "Claro", dark: "Escuro", useLight: "Mudar para o tema claro", useDark: "Mudar para o tema escuro", toggle: "Alterar tema" },
  fr: { title: "Apparence", description: "Choisissez le thème de couleurs de l’application.", light: "Clair", dark: "Sombre", useLight: "Passer au thème clair", useDark: "Passer au thème sombre", toggle: "Changer de thème" },
  de: { title: "Darstellung", description: "Wählen Sie das Farbschema der Anwendung.", light: "Hell", dark: "Dunkel", useLight: "Zum hellen Design wechseln", useDark: "Zum dunklen Design wechseln", toggle: "Design wechseln" },
  ru: { title: "Оформление", description: "Выберите цветовую тему приложения.", light: "Светлая", dark: "Тёмная", useLight: "Переключить на светлую тему", useDark: "Переключить на тёмную тему", toggle: "Сменить тему" },
  ja: { title: "外観", description: "アプリのカラーテーマを選択します。", light: "ライト", dark: "ダーク", useLight: "ライトテーマに切り替え", useDark: "ダークテーマに切り替え", toggle: "テーマを変更" },
};

export const getThemeCopy = (language) => themeCopy[language] || themeCopy.en;
