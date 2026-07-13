import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('proteklif', {
  customers: {
    list: () => ipcRenderer.invoke('customers:list'),
    create: (customer) => ipcRenderer.invoke('customers:create', customer),
    update: (id, customer) => ipcRenderer.invoke('customers:update', id, customer),
    remove: (id) => ipcRenderer.invoke('customers:remove', id)
  },
  products: { list: () => ipcRenderer.invoke('products:list') },
  offers: {
    list: () => ipcRenderer.invoke('offers:list'),
    create: (offer) => ipcRenderer.invoke('offers:create', offer),
    previewHtml: (id, language, template) => ipcRenderer.invoke('offers:preview-html', id, language, template),
    exportPdf: (id, language, template) => ipcRenderer.invoke('offers:export-pdf', id, language, template)
  },
  company: {
    get: () => ipcRenderer.invoke('company:get'),
    save: (settings) => ipcRenderer.invoke('company:save', settings),
    selectLogo: () => ipcRenderer.invoke('company:select-logo')
  },
  backup: { create: () => ipcRenderer.invoke('backup:create') }
});
