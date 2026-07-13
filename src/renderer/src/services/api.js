const bridge = () => {
  if (!window.proteklif) throw new Error('Electron köprüsü bulunamadı. Uygulamayı Electron içinde çalıştırın.');
  return window.proteklif;
};
const call = (operation) => Promise.resolve().then(operation);
export const api = {
  customers: { list: () => call(() => bridge().customers.list()), create: (data) => call(() => bridge().customers.create(data)), update: (id, data) => call(() => bridge().customers.update(id, data)), remove: (id) => call(() => bridge().customers.remove(id)) },
  offers: {
    list: () => call(() => bridge().offers.list()),
    create: (data) => call(() => bridge().offers.create(data)),
    previewHtml: (id, template = 'modern', language = localStorage.getItem('proteklif-language') || 'tr') => call(() => bridge().offers.previewHtml(id, language, template)),
    exportPdf: (id, template = 'modern', language = localStorage.getItem('proteklif-language') || 'tr') => call(() => bridge().offers.exportPdf(id, language, template))
  },
  company: { get: () => call(() => bridge().company.get()), save: (data) => call(() => bridge().company.save(data)), selectLogo: () => call(() => bridge().company.selectLogo()) },
  backup: () => call(() => bridge().backup.create())
};
