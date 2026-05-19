import sqlite3
from datetime import datetime


# =====================================================================
# 3. GÖREV: Veri Tazeliği İçin UTC Zaman Damgası Helper Fonksiyonu
# =====================================================================
def get_current_utc_iso() -> str:
    """Üretim ortamı standartlarında UTC ISO 8601 zaman damgası üretir."""
    return datetime.utcnow().isoformat()


# =====================================================================
# 1. GÖREV: UNIQUE Constraint Migration Script'i
# =====================================================================
def migrate_to_unique_link(db_path="urunler_veritabani.db"):
    print("🛠️ Migration başlatılıyor: 'link' kolonu UNIQUE yapılıyor...")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

        # Transaction başlat
        cursor.execute("BEGIN TRANSACTION;")

        # Adım 1: Yeni tabloyu UNIQUE kısıtlaması ile oluştur.
        # Not: Önceki migration'dan kalan 'fiyat_ham' ve 'fiyat_float'
        # kolonlarını da veri kaybı olmasın diye ekliyoruz.
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS urunler_yeni (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                link TEXT UNIQUE,
                urun_adi TEXT,
                fiyat TEXT,
                yorum_puani TEXT,
                stok_durumu TEXT,
                yerel_gorsel_yolu TEXT,
                yorumlar TEXT,
                durum TEXT DEFAULT 'bekliyor',
                tarama_tarihi TEXT,
                fiyat_ham TEXT,
                fiyat_float REAL
            )
        ''')

        # Adım 2: Eski verileri yeni tabloya kopyala.
        # INSERT OR IGNORE kullanarak, eğer halihazırda veritabanında aynı linkten
        # birden fazla varsa sadece ilkini alıp diğerlerini (duplicate'leri) eziyoruz.
        cursor.execute('''
            INSERT OR IGNORE INTO urunler_yeni 
            (id, link, urun_adi, fiyat, yorum_puani, stok_durumu, yerel_gorsel_yolu, yorumlar, durum, tarama_tarihi, fiyat_ham, fiyat_float)
            SELECT id, link, urun_adi, fiyat, yorum_puani, stok_durumu, yerel_gorsel_yolu, yorumlar, durum, tarama_tarihi, fiyat_ham, fiyat_float 
            FROM urunler
        ''')

        # Adım 3: Eski tabloyu sil ve yeni tabloyu asıl tablo olarak isimlendir.
        cursor.execute("DROP TABLE urunler;")
        cursor.execute("ALTER TABLE urunler_yeni RENAME TO urunler;")

        conn.commit()
        print("✅ Migration başarılı: Tablo artık production-ready ve 'link' kolonu UNIQUE!")
# =====================================================================
# 2. GÖREV: fetcher.py / main.py İçin INSERT OR REPLACE Mantığı
# =====================================================================
def ornek_urun_kaydet_veya_guncelle(db_path, urun_data):
    """
    Bu fonksiyon, ana kodundaki insert işlemini nasıl güncellemen
    gerektiğini gösteren bir örnektir.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Helper fonksiyonumuzdan güncel UTC zamanını al
    guncel_tarih = get_current_utc_iso()

    # INSERT OR REPLACE: Link varsa satırı ezer ve günceller, yoksa yeni kayıt açar.
    sorgu = '''
        INSERT OR REPLACE INTO urunler 
        (link, urun_adi, fiyat, yorum_puani, stok_durumu, yerel_gorsel_yolu, yorumlar, durum, tarama_tarihi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''

    degerler = (
        urun_data['link'],
        urun_data.get('urun_adi', ''),
        urun_data.get('fiyat', ''),
        urun_data.get('yorum_puani', ''),
        urun_data.get('stok_durumu', ''),
        urun_data.get('yerel_gorsel_yolu', ''),
        urun_data.get('yorumlar', ''),
        urun_data.get('durum', 'bekliyor'),
        guncel_tarih  # Python tarafında üretilen tazelik damgası
    )

        cursor.execute(sorgu, degerler)
        conn.commit()
        print(f"✅ Ürün UPSERT edildi: {urun_data['link']}")
if __name__ == "__main__":
    # Sadece migration'ı çalıştır
    migrate_to_unique_link()