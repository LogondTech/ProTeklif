# ProTeklif

Sunucu ve internet gerektirmeyen Electron + React masaüstü teklif uygulaması.

## Çalıştırma

```bash
npm install
npm run dev
```

## Dosyaların görevleri

- `src/main/main.js`: Electron yaşam döngüsü, pencere, doğrulanan IPC handler'ları, yedekleme ve yerel PDF kaydı.
- `src/preload/preload.js`: Renderer'a yalnızca izin verilen işlemleri açan güvenli köprü.
- `database/database.js`: SQLite bağlantısı, ilk açılış şeması ve veri erişim metotları.
- `src/main/pdf-template.js`: Teklif verisini yazdırılabilir HTML'e dönüştürür.
- `src/renderer/src/pages`: Dashboard, müşteri, teklif ve ayarlar ekranları.
- `src/renderer/src/components`: Paylaşılan React bileşenleri.
- `src/renderer/src/services/api.js`: React tarafındaki IPC servis katmanı.

Veritabanı geliştirme klasörüne değil, işletim sisteminin Electron `userData/database` dizinine yazılır. Böylece paketli uygulamada veri güncellemelerden etkilenmez. PDF için ek Chromium paketi indiren `html-pdf-node` yerine Electron'ın kendi `webContents.printToPDF` özelliği kullanılır; sonuç tamamen yereldir.
