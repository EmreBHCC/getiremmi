import os
import sqlite3
import requests
from bs4 import BeautifulSoup


def gorselleri_fiziksel_olarak_indir_ve_numaralandir():
    print("📸 [Görsel Motoru] Ürün resimleri internetten çekiliyor ve klasörleniyor...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    gorsel_klasoru = os.path.join(base_dir, "urun_gorselleri")
    os.makedirs(gorsel_klasoru, exist_ok=True)

    db_path = os.path.join(base_dir, "urunler_veritabani.db")
    if not os.path.exists(db_path):
        print("❌ Veritabanı bulunamadı!")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 🎯 1. ADIM: Sadece ID'yi değil, mevcut görsel yolunu da çekiyoruz
    cursor.execute("SELECT id, yerel_gorsel_yolu FROM urunler")
    rows = cursor.fetchall()

    # İstatistik sayaçlarımız
    indirilen = 0
    atlanan = 0
    basarisiz = 0

    for row in rows:
        u_id = row[0]
        mevcut_db_yolu = row[1]

        dosya_adi = f"urun_{u_id}.jpg"
        kayit_yolu = os.path.join(gorsel_klasoru, dosya_adi)

        # 🎯 2. ADIM: Zaten indirilmişse ve diskte fiziksel olarak duruyorsa ATLA
        if mevcut_db_yolu and os.path.exists(kayit_yolu):
            print(f"⏭️ Zaten mevcut, atlandı: ID {u_id}")
            atlanan += 1
            continue

        # Eğer yoksa, HTML'den bul ve indir
        html_yolu = os.path.join(base_dir, "data", "html_depo", f"havuz_urun_id_{u_id}.html")

        if os.path.exists(html_yolu):
            with open(html_yolu, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), 'html.parser')

            img_tag = soup.find('img', id='landingImage') or soup.find('img', class_='a-dynamic-image')

            if img_tag and img_tag.get('src'):
                img_url = img_tag['src']

                try:
                    print(f"📥 İndiriliyor: Ürün ID {u_id} -> {dosya_adi}")
                    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                    response = requests.get(img_url, headers=headers, stream=True, timeout=10)

                    if response.status_code == 200:
                        with open(kayit_yolu, 'wb') as img_file:
                            for chunk in response.iter_content(1024):
                                img_file.write(chunk)

                        # 🎯 3. ADIM: Bozuk/Placeholder Kontrolü (1KB = 1024 byte)
                        if os.path.getsize(kayit_yolu) < 1024:
                            os.remove(kayit_yolu)
                            print(f"⚠️ Görsel bozuk veya 1KB'dan küçük, silindi: ID {u_id}")
                            basarisiz += 1
                        else:
                            # Başarılı indirme ve DB güncellemesi
                            guncel_db_yolu = f"urun_gorselleri/{dosya_adi}"
                            cursor.execute("UPDATE urunler SET yerel_gorsel_yolu = ? WHERE id = ?",
                                           (guncel_db_yolu, u_id))
                            indirilen += 1
                    else:
                        print(f"❌ İndirme başarısız (HTTP {response.status_code}): ID {u_id}")
                        basarisiz += 1

                except Exception as e:
                    print(f"❌ Görsel indirme hatası (ID {u_id}): {e}")
                    basarisiz += 1
            else:
                print(f"❌ HTML içinde görsel linki bulunamadı: ID {u_id}")
                basarisiz += 1
        else:
            print(f"⚠️ HTML dosyası bulunamadı: ID {u_id}")
            basarisiz += 1

    conn.commit()
    conn.close()

    # 🎯 4. ADIM: Sistem Özeti (Summary)
    print("\n" + "=" * 50)
    print("📊 GÖRSEL MOTORU RAPORU")
    print("=" * 50)
    print(f"✅ Başarıyla İndirilen : {indirilen}")
    print(f"⏭️ Atlanan (Mevcut)    : {atlanan}")
    print(f"❌ Başarısız / Bozuk   : {basarisiz}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    gorselleri_fiziksel_olarak_indir_ve_numaralandir()