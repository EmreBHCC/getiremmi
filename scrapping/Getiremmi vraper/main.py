import sqlite3
import os
import time
import random
import undetected_chromedriver as uc
from crawler import kategoriden_linkleri_topla
from fetcher import sayfayi_guzelce_indir, gorsel_indir
from wrapper import yerel_html_wrapper

DB_DOSYASI = "urunler_veritabani.db"


def veritabani_hazirla():
    conn = sqlite3.connect(DB_DOSYASI)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS urunler (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            link TEXT UNIQUE,
            urun_adi TEXT,
            fiyat TEXT,
            yorum_puani TEXT,
            stok_durumu TEXT,
            yerel_gorsel_yolu TEXT,
            yorumlar TEXT,
            durum TEXT DEFAULT 'bekliyor',
            tarama_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


def tam_otomasyon_sistemini_calistir():
    veritabani_hazirla()

    # 🔗 Hedef Amazon Kategori Linki
    ana_kategori_linki = "https://www.amazon.co.uk/b?_encoding=UTF8&node=14520141031"

    # 1. AŞAMA: Linkleri Havuzdan Topla ve DB'ye İndeksle
    toplanan_linkler = kategoriden_linkleri_topla(ana_kategori_linki)

    if not toplanan_linkler:
        print("❌ Kategori sayfasından hiç link toplanamadı. Otomasyon durduruldu.")
        return

    conn = sqlite3.connect(DB_DOSYASI)
    cursor = conn.cursor()

    print("\n💾 Toplanan linkler veri tabanına indeksleniyor...")
    yeni_eklenen_sayisi = 0
    for link in toplanan_linkler:
        try:
            cursor.execute("INSERT INTO urunler (link, durum) VALUES (?, 'bekliyor')", (link,))
            yeni_eklenen_sayisi += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    print(f"📦 {yeni_eklenen_sayisi} adet YENİ link veri tabanına başarıyla indekslendi.")

    # 2. AŞAMA: Bekleyen Linkleri Tek Oturumda Sırayla Kazı
    cursor.execute("SELECT id, link FROM urunler WHERE durum = 'bekliyor'")
    bekleyen_urunler = cursor.fetchall()

    if not bekleyen_urunler:
        print("🏁 Veri tabanında işlenmeyi bekleyen yeni bir ürün linki kalmadı!")
        conn.close()
        return

    print(f"🚀 Veri tabanından {len(bekleyen_urunler)} adet bekleyen ürün çekildi. Kazıma işlemi başlıyor...")

    options = uc.ChromeOptions()
    driver = uc.Chrome(options=options)

    try:
        for sira, (urun_id, link) in enumerate(bekleyen_urunler, start=1):
            print(f"\n🔄 [{sira}/{len(bekleyen_urunler)}] İndeks No: {urun_id} -> Ürün taranıyor...")

            dosya_ismi = f"havuz_urun_id_{urun_id}.html"

            indirilen_html = sayfayi_guzelce_indir(driver, link, dosya_ismi)

            if not indirilen_html:
                print(f"❌ İndeks {urun_id} indirilemedi, sıradakine geçiliyor.")
                continue

            veri = yerel_html_wrapper(indirilen_html)

            if veri:
                print("📸 Ürün görseli yerel klasöre indiriliyor...")
                yerel_resim_yolu = gorsel_indir(veri["gorsel_url"], urun_id)

                try:
                    cursor.execute('''
                        UPDATE urunler 
                        SET urun_adi = ?, fiyat = ?, yorum_puani = ?, stok_durumu = ?, yerel_gorsel_yolu = ?, yorumlar = ?, durum = 'tamamlandi'
                        WHERE id = ?
                    ''', (veri["urun_adi"], veri["fiyat"], veri["puan"], veri["stok"], yerel_resim_yolu,
                          veri["yorumlar"], urun_id))
                    conn.commit()
                    print(f"✅ İNDEKS {urun_id} GÜNCELLENDİ: {veri['urun_adi'][:40]}...")
                except Exception as db_err:
                    print(f"❌ Veri tabanı güncelleme hatası: {db_err}")
            else:
                print(f"❌ HTML Wrapper indeks {urun_id} için veriyi süzemedi.")

            if sira < len(bekleyen_urunler):
                bekleme = random.uniform(6.0, 10.0)
                print(f"😴 IP ban yememek için {bekleme:.1f} saniye bekleniyor...")
                time.sleep(bekleme)

    except Exception as genel_hata:
        print(f"❌ Sistem çalışırken ana döngüde bir hata oluştu: {genel_hata}")
    finally:
        print("\n🛑 Tarayıcı kapatılıyor ve veri tabanı bağlantısı sonlandırılıyor.")
        driver.quit()
        conn.close()
        print("🏁 Otomasyon bitti kanka!")


if __name__ == "__main__":
    tam_otomasyon_sistemini_calistir()