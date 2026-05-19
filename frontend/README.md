# Getiremmi Frontend

Bu proje, **Getiremmi** uygulamasının kullanıcı arayüzünü (frontend) içerir. Modern web teknolojileri kullanılarak, B2B ticaret, e-ihracat analizleri ve araçları sunmak üzere geliştirilmiştir.

## 🚀 Teknolojiler (Tech Stack)

- **Framework:** [React 18](https://react.dev/)
- **Build Aracı:** [Vite](https://vitejs.dev/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Stilleme:** [Tailwind CSS](https://tailwindcss.com/)
- **İkonlar:** [Lucide React](https://lucide.dev/)
- **Backend / Veritabanı Servisleri:** Firebase (& Supabase)

## 🏗️ Mimari ve Proje Yapısı

Proje, **Single Page Application (SPA)** mimarisiyle kurgulanmış olup modüler bir sayfa (page) ve bileşen (component) yapısına sahiptir. Yönlendirme (routing), harici bir kütüphane yerine şimdilik `App.tsx` içindeki state (`activePage`) ile yönetilmektedir.

### Klasör Yapısı

```text
frontend/
├── assets/         # Görseller, logolar ve statik dosyalar
├── public/         # Halka açık public statik varlıklar
└── src/
    ├── components/ # Yeniden kullanılabilir UI bileşenleri (Header, Sidebar, Chart vb.)
    ├── pages/      # Uygulamanın ana sayfaları ve modülleri
    ├── App.tsx     # Ana uygulama bileşeni ve routing mantığı
    ├── index.css   # Global Tailwind CSS stilleri
    ├── main.tsx    # Uygulamanın giriş noktası
    └── firebase.ts # Firebase konfigürasyon ve bağlantı ayarları
```

## 🧩 Modüller ve Sayfalar (Özellikler)

Uygulama temel olarak ana gösterge panelleri ve ticari araçlardan oluşmaktadır:

1. **Temel Sayfalar:**
   - **Dashboard (DashboardPage):** Genel durum, istatistikler ve özet görünüm.
   - **Ürün Karşılaştırmaları (ComparisonsPage):** Farklı ürünlerin detaylı analizi ve karşılaştırılması.
   - **Pazarlar (MarketsPage):** Seçilen ürün bazında hedef pazar analizleri.

2. **Ticari Araçlar (Tools):**
   - **Sürdürülebilirlik Karnesi (SustainabilityPage):** Ürün ve süreçlerin sürdürülebilirlik metrikleri.
   - **Talep Havuzu (DemandPoolPage):** Ürünlere yönelik piyasa taleplerinin analizi.
   - **Lojistik Maliyet Hesaplayıcı (LogisticsPage):** Nakliye ve lojistik giderlerinin hesabı.
   - **Gümrük Mevzuat Kütüphanesi (CustomsPage):** Gümrük kural ve regülasyonları sorgulama.
   - **Rakip Analizi (CompetitorPage):** Rakiplerin performans ve strateji analizleri.
   - **Trend Öngörücü (TrendPage):** Gelecekteki pazar ve ürün trendlerinin tahmini.

3. **Kullanıcı İşlemleri:**
   - **Ayarlar (SettingsPage):** Uygulama ve hesap ayarları.
   - **Profil (ProfilePage):** Kullanıcı profil bilgileri.

## 💻 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   *Not: Uygulama varsayılan olarak Vite'in belirlediği portta (genellikle `http://localhost:5173`) çalışacaktır.*

3. Projeyi canlı (production) ortamı için derlemek isterseniz:
   ```bash
   npm run build
   ```

## 📝 Ek Notlar

- ESLint ve PostCSS entegrasyonları proje genelinde aktiftir (`eslint.config.js`, `postcss.config.js`).
- Tailwind CSS yapılandırması Vite ve PostCSS ile entegre bir şekilde çalışmaktadır.
