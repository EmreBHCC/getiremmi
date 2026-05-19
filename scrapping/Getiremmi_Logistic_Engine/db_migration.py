import sqlite3


# 1. GÖREV: Fiyat Ayıklama ve Normalize Etme Fonksiyonu
def parse_price_to_float(raw: str) -> float | None:
    if not raw or not isinstance(raw, str):
        return None

    try:
        # Kur sembollerini ve binlik ayracı olan virgülü temizle
        clean_str = raw.replace("TRY", "").replace("$", "").replace("£", "").replace(",", "").strip()

        # Eğer string tamamen boşaldıysa veya anlamsız bir şey kaldıysa None döndür
        if not clean_str:
            return None

        return float(clean_str)
    except ValueError:
        # float() dönüştürme başarısız olursa exception fırlatma, sessizce None dön
        return None


# 2 & 3. GÖREV: Migration ve Tek Seferlik Update İşlemi
def migrate_prices(db_path="urunler_veritabani.db"):
    print("🛠️ Veritabanı Migration işlemi başlatılıyor...")

    # SQLite veritabanına bağlan
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # --- MIGRATION: Kolonları Ekleme ---
    # SQLite'da ALTER TABLE tek seferde birden fazla kolon eklemeyi desteklemez, ayrı ayrı ekliyoruz.
    try:
        cursor.execute("ALTER TABLE urunler ADD COLUMN fiyat_ham TEXT;")
        print("✅ 'fiyat_ham' (TEXT) kolonu eklendi.")
    except sqlite3.OperationalError:
        print("⚠️ 'fiyat_ham' kolonu zaten mevcut, geçiliyor.")

    try:
        cursor.execute("ALTER TABLE urunler ADD COLUMN fiyat_float REAL;")
        print("✅ 'fiyat_float' (REAL) kolonu eklendi.")
    except sqlite3.OperationalError:
        print("⚠️ 'fiyat_float' kolonu zaten mevcut, geçiliyor.")

    # --- UPDATE: Mevcut 24 Kaydı Normalize Edip Güncelleme ---
    print("🔄 Mevcut kayıtlar okunuyor ve dönüştürülüyor...")
    cursor.execute("SELECT id, fiyat FROM urunler")
    rows = cursor.fetchall()

    guncellenen_sayisi = 0

    for row in rows:
        u_id = row[0]
        orijinal_fiyat = row[1]

        # Fonksiyonumuzu kullanarak temiz float değerini al
        float_fiyat = parse_price_to_float(orijinal_fiyat)

        # Tek seferlik UPDATE sorgusu ile yeni kolonları doldur
        cursor.execute("""
            UPDATE urunler 
            SET fiyat_ham = ?, fiyat_float = ? 
            WHERE id = ?
        """, (orijinal_fiyat, float_fiyat, u_id))

        guncellenen_sayisi += 1
        print(f"   -> ID: {u_id} | Ham: {orijinal_fiyat:<12} | Float: {float_fiyat}")

    # Değişiklikleri kaydet ve kapat
    conn.commit()
    conn.close()

    print(f"\n🎯 MIGRATION TAMAMLANDI! Toplam {guncellenen_sayisi} kayıt yeni yapıya uygun olarak güncellendi.")


if __name__ == "__main__":
    # Eğer veritabanı farklı bir klasördeyse buraya tam yolunu (path) verebilirsin.
    migrate_prices("urunler_veritabani.db")