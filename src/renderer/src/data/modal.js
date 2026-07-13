const modalCloseLabels = {
  tr: 'Kapat', en: 'Close', zh: '关闭', hi: 'बंद करें', es: 'Cerrar', ar: 'إغلاق',
  pt: 'Fechar', fr: 'Fermer', de: 'Schließen', ru: 'Закрыть', ja: '閉じる',
};

export const getModalCloseLabel = (language) => modalCloseLabels[language] || modalCloseLabels.en;
