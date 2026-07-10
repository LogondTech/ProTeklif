import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

let db;

export function initializeDatabase(userDataPath) {
  const directory = path.join(userDataPath, 'database');
  fs.mkdirSync(directory, { recursive: true });
  const databasePath = path.join(directory, 'proteklif.db');

  db = new Database(databasePath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      tax_number TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT NOT NULL DEFAULT 'Adet',
      unit_price REAL NOT NULL DEFAULT 0 CHECK(unit_price >= 0),
      vat_rate REAL NOT NULL DEFAULT 20 CHECK(vat_rate >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offer_number TEXT NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      offer_date TEXT NOT NULL,
      valid_until TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','sent','accepted','rejected')),
      notes TEXT,
      items_json TEXT NOT NULL DEFAULT '[]',
      subtotal REAL NOT NULL DEFAULT 0,
      vat_total REAL NOT NULL DEFAULT 0,
      grand_total REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS company_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      name TEXT NOT NULL DEFAULT '',
      logo_data_url TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      tax_office TEXT,
      tax_number TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO company_settings (id, name) VALUES (1, '');

    CREATE INDEX IF NOT EXISTS idx_offers_customer_id ON offers(customer_id);
    CREATE INDEX IF NOT EXISTS idx_offers_date ON offers(offer_date);
  `);

  return databasePath;
}

function connection() {
  if (!db) throw new Error('Veritabanı henüz başlatılmadı.');
  return db;
}

export const customers = {
  list: () => connection().prepare('SELECT * FROM customers ORDER BY name COLLATE NOCASE').all(),
  create: (data) => {
    const statement = connection().prepare(`
      INSERT INTO customers (name, company, tax_number, email, phone, address)
      VALUES (@name, @company, @tax_number, @email, @phone, @address)
    `);
    const result = statement.run({ name: data.name, company: data.company || null, tax_number: data.taxNumber || null, email: data.email || null, phone: data.phone || null, address: data.address || null });
    return connection().prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);
  },
  update: (id, data) => {
    const result = connection().prepare(`
      UPDATE customers
      SET name = @name, company = @company, tax_number = @tax_number,
          email = @email, phone = @phone, address = @address,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({ id, name: data.name, company: data.company || null, tax_number: data.taxNumber || null, email: data.email || null, phone: data.phone || null, address: data.address || null });
    return result.changes ? connection().prepare('SELECT * FROM customers WHERE id = ?').get(id) : null;
  },
  remove: (id) => connection().prepare('DELETE FROM customers WHERE id = ?').run(id).changes > 0
};

export const products = {
  list: () => connection().prepare('SELECT * FROM products ORDER BY name COLLATE NOCASE').all()
};

export const companySettings = {
  get: () => connection().prepare('SELECT * FROM company_settings WHERE id = 1').get(),
  update: (data) => {
    connection().prepare(`UPDATE company_settings SET name = @name, logo_data_url = @logo_data_url,
      address = @address, phone = @phone, email = @email, tax_office = @tax_office,
      tax_number = @tax_number, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).run({
        name: data.name, logo_data_url: data.logoDataUrl || null, address: data.address || null,
        phone: data.phone || null, email: data.email || null, tax_office: data.taxOffice || null,
        tax_number: data.taxNumber || null
      });
    return companySettings.get();
  }
};

export const offers = {
  list: () => connection().prepare(`SELECT offers.*, customers.name AS customer_name FROM offers JOIN customers ON customers.id = offers.customer_id ORDER BY offers.id DESC`).all(),
  create: (data) => {
    const items = Array.isArray(data.items) ? data.items : [];
    const subtotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const vatTotal = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0) * Number(item.vatRate || 0) / 100, 0);
    const offerNumber = data.offerNumber || `TKL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const result = connection().prepare(`
      INSERT INTO offers (offer_number, customer_id, offer_date, valid_until, notes, items_json, subtotal, vat_total, grand_total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(offerNumber, data.customerId, data.offerDate, data.validUntil || null, data.notes || null, JSON.stringify(items), subtotal, vatTotal, subtotal + vatTotal);
    return connection().prepare('SELECT * FROM offers WHERE id = ?').get(result.lastInsertRowid);
  },
  get: (id) => connection().prepare(`SELECT offers.*, customers.name AS customer_name,
    customers.company AS customer_company, customers.address AS customer_address,
    customers.email AS customer_email, customers.phone AS customer_phone,
    customers.tax_number AS customer_tax_number
    FROM offers JOIN customers ON customers.id = offers.customer_id WHERE offers.id = ?`).get(id)
};

export function checkpointDatabase() {
  connection().pragma('wal_checkpoint(TRUNCATE)');
}

export function closeDatabase() {
  if (db?.open) db.close();
  db = undefined;
}
