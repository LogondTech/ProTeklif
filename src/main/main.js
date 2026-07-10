import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkpointDatabase, closeDatabase, companySettings, customers, initializeDatabase, offers, products } from '../../database/database.js';
import { createOfferHtml } from './pdf-template.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
let databasePath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 960, minHeight: 640,
    backgroundColor: '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  else mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
}

function validateCustomer(data) {
  if (!data || typeof data.name !== 'string' || !data.name.trim()) throw new Error('Müşteri adı zorunludur.');
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Geçerli bir e-posta adresi girin.');
  const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  return {
    name: clean(data.name, 120), company: clean(data.company, 160),
    taxNumber: clean(data.taxNumber, 20), email: email.slice(0, 160),
    phone: clean(data.phone, 30), address: clean(data.address, 500)
  };
}

function validateOffer(data) {
  const customerId = Number(data?.customerId);
  if (!Number.isInteger(customerId) || customerId < 1) throw new Error('Geçerli bir müşteri seçin.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data?.offerDate || '')) throw new Error('Geçerli bir teklif tarihi girin.');
  if (!Array.isArray(data?.items) || data.items.length === 0) throw new Error('Teklife en az bir ürün veya hizmet ekleyin.');
  const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  const items = data.items.map((item, index) => {
    const name = clean(item.name, 160);
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    const vatRate = Number(item.vatRate);
    if (!name) throw new Error(`${index + 1}. kalemin adı zorunludur.`);
    if (!Number.isFinite(quantity) || quantity <= 0) throw new Error(`${index + 1}. kalemin miktarı sıfırdan büyük olmalıdır.`);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) throw new Error(`${index + 1}. kalemin birim fiyatı geçersizdir.`);
    if (!Number.isFinite(vatRate) || vatRate < 0 || vatRate > 100) throw new Error(`${index + 1}. kalemin KDV oranı geçersizdir.`);
    return { name, description: clean(item.description, 300), unit: clean(item.unit, 30) || 'Adet', quantity, unitPrice, vatRate };
  });
  return { customerId, offerDate: data.offerDate, validUntil: /^\d{4}-\d{2}-\d{2}$/.test(data.validUntil || '') ? data.validUntil : '', notes: clean(data.notes, 2000), items };
}

function registerIpcHandlers() {
  ipcMain.handle('customers:list', () => customers.list());
  ipcMain.handle('customers:create', (_event, data) => customers.create(validateCustomer(data)));
  ipcMain.handle('customers:update', (_event, id, data) => {
    const customerId = Number(id);
    if (!Number.isInteger(customerId) || customerId < 1) throw new Error('Geçersiz müşteri.');
    const updated = customers.update(customerId, validateCustomer(data));
    if (!updated) throw new Error('Müşteri bulunamadı.');
    return updated;
  });
  ipcMain.handle('customers:remove', (_event, id) => {
    const customerId = Number(id);
    if (!Number.isInteger(customerId) || customerId < 1) throw new Error('Geçersiz müşteri.');
    try { return customers.remove(customerId); }
    catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') throw new Error('Bu müşteriye ait teklifler bulunduğu için müşteri silinemez.');
      throw error;
    }
  });
  ipcMain.handle('products:list', () => products.list());
  ipcMain.handle('offers:list', () => offers.list());
  ipcMain.handle('offers:create', (_event, data) => offers.create(validateOffer(data)));
  ipcMain.handle('company:get', () => companySettings.get());
  ipcMain.handle('company:save', (_event, data) => {
    if (!data || typeof data.name !== 'string' || !data.name.trim()) throw new Error('Firma adı zorunludur.');
    const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const email = clean(data.email, 160);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Geçerli bir firma e-postası girin.');
    const logoDataUrl = typeof data.logoDataUrl === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(data.logoDataUrl) ? data.logoDataUrl : '';
    return companySettings.update({ name: clean(data.name, 160), logoDataUrl, address: clean(data.address, 500), phone: clean(data.phone, 30), email, taxOffice: clean(data.taxOffice, 100), taxNumber: clean(data.taxNumber, 20) });
  });
  ipcMain.handle('company:select-logo', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { title: 'Firma Logosu Seç', properties: ['openFile'], filters: [{ name: 'Görsel', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
    if (canceled || !filePaths[0]) return { canceled: true };
    const filePath = filePaths[0];
    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) throw new Error('Logo dosyası en fazla 2 MB olabilir.');
    const extension = path.extname(filePath).toLowerCase();
    const mime = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
    return { canceled: false, dataUrl: `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}` };
  });
  ipcMain.handle('backup:create', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, { title: 'Veritabanı Yedeği', defaultPath: `proteklif-yedek-${new Date().toISOString().slice(0, 10)}.db`, filters: [{ name: 'SQLite Veritabanı', extensions: ['db'] }] });
    if (canceled || !filePath) return { canceled: true };
    checkpointDatabase();
    fs.copyFileSync(databasePath, filePath);
    return { canceled: false, filePath };
  });
  ipcMain.handle('offers:export-pdf', async (_event, id, language = 'tr') => {
    const offer = offers.get(Number(id));
    if (!offer) throw new Error('Teklif bulunamadı.');
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, { title: 'Teklifi PDF Kaydet', defaultPath: `${offer.offer_number}.pdf`, filters: [{ name: 'PDF', extensions: ['pdf'] }] });
    if (canceled || !filePath) return { canceled: true };
    const pdfWindow = new BrowserWindow({ show: false, webPreferences: { sandbox: true } });
    try {
      await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(createOfferHtml(offer, companySettings.get(), language))}`);
      const pdf = await pdfWindow.webContents.printToPDF({ pageSize: 'A4', printBackground: true, margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 } });
      fs.writeFileSync(filePath, pdf);
      return { canceled: false, filePath };
    } finally { pdfWindow.destroy(); }
  });
}

app.whenReady().then(() => {
  databasePath = initializeDatabase(app.getPath('userData'));
  registerIpcHandlers();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('before-quit', closeDatabase);
