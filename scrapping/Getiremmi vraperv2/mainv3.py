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
        print("❌ Kategori sayfasından hiçbir ürün linki toplanamadı!")
        return

    conn = sqlite3.connect(DB_DOSYASI)
    cursor = conn.cursor()

    yeni_eklenen_sayisi = 0
    for link in toplanan_linkler:
        try:
            cursor.execute("INSERT INTO urunler (link, durum) VALUES (?, 'bekliyor')", (link,))
            yeni_eklenen_sayisi += 1
        except sqlite3.IntegrityError:
            pass

    conn.commit()
    print(f"📦 Link havuzu güncellendi. {yeni_eklenen_sayisi} adet YENİ ürün sisteme eklendi.")

    # 2. AŞAMA: Bekleyen Linkleri Sırayla Taramaya Başla
    cursor.execute("SELECT id, link FROM urunler WHERE durum = 'bekliyor'")
    bekleyen_urunler = cursor.fetchall()

    if not bekleyen_urunler:
        print("🏁 Havuzda 'bekleyen' durumda hiçbir link kalmadı, her şey güncel!")
        conn.close()
        return

    print(f"🚀 Toplam {len(bekleyen_urunler)} ürün için ana pipeline tetiklendi.")

    options = uc.ChromeOptions()
    driver = uc.Chrome(options=options)

    try:
        for sira, (urun_id, link) in enumerate(bekleyen_urunler, start=1):
            print(f"\n⚡ [{sira}/{len(bekleyen_urunler)}] İşlemdeki İndeks: {urun_id}")

            dosya_ismi = f"havuz_urun_id_{urun_id}.html"
            indirilen_html = sayfayi_guzelce_indir(driver, link, dosya_ismi)

            if not indirilen_html:
                print(f"⚠️ İndeks {urun_id} ağ hatası nedeniyle pas geçildi.")
                continue

            veri = yerel_html_wrapper(indirilen_html)

            if veri:
                print("📸 Ürün görseli indiriliyor...")
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

            # İş bitimi ham HTML dosyasını sil (Temizlik)
            if os.path.exists(indirilen_html):
                os.remove(indirilen_html)

            if sira < len(bekleyen_urunler):
                bekleme = random.uniform(6.0, 10.0)
                print(f"😴 IP ban yememek için {bekleme:.1f} saniye bekleniyor...")
                time.sleep(bekleme)

    except Exception as genel_hata:
        print(f"❌ Sistem çalışırken ana döngüde bir hata oluştu: {genel_hata}")
    finally:
        driver.quit()
        conn.close()
        print("\n🏁 Ana pipeline oturumu başarıyla sonlandırıldı.")


def eksik_verileri_tamamla():
    """
    Fiyat, puan, yorum veya görseli eksik olan kayıtları bulup sayfayı
    yeniden çekerek yamar. Dolu alanları asla ezmez.
    """
    conn = sqlite3.connect(DB_DOSYASI)
    cursor = conn.cursor()

    # 1. Aşama: Eksik verisi olan TÜM alanları kapsayan sorgu (fiyat dahil edildi)
    cursor.execute('''
        SELECT id, link, fiyat, yorum_puani, yorumlar, yerel_gorsel_yolu
        FROM urunler
        WHERE fiyat = 'Fiyat bulunamadı'
           OR yorum_puani = 'Puan bulunamadı'
           OR yorumlar = ''
           OR yorumlar IS NULL
           OR yerel_gorsel_yolu IN ('Görsel yok', 'Görsel indirilemedi')
    ''')
    eksik_kayitlar = cursor.fetchall()

    if not eksik_kayitlar:
        print("✅ Veritabanında eksik kayıt bulunamadı. Her şey tam!")
        conn.close()
        return

    print(f"🛠️ Toplam {len(eksik_kayitlar)} adet eksik kayıt tespit edildi. Tamamlama başlıyor...")

    # Eksik alanların özeti
    fiyat_eksik = sum(1 for r in eksik_kayitlar if r[2] == 'Fiyat bulunamadı')
    puan_eksik  = sum(1 for r in eksik_kayitlar if r[3] == 'Puan bulunamadı')
    yorum_eksik = sum(1 for r in eksik_kayitlar if not r[4])
    gorsel_eksik = sum(1 for r in eksik_kayitlar if r[5] in ('Görsel yok', 'Görsel indirilemedi'))
    print(f"   💰 Fiyat eksik : {fiyat_eksik} ürün")
    print(f"   ⭐ Puan eksik  : {puan_eksik} ürün")
    print(f"   💬 Yorum eksik : {yorum_eksik} ürün")
    print(f"   🖼️  Görsel eksik: {gorsel_eksik} ürün")

    options = uc.ChromeOptions()
    driver = uc.Chrome(options=options)

    guncellenen_sayisi = 0

    try:
        for sira, (urun_id, link, eski_fiyat, eski_puan, eski_yorum, eski_gorsel) in enumerate(eksik_kayitlar, start=1):
            print(f"\n🔄 [{sira}/{len(eksik_kayitlar)}] Eksik Taranıyor -> İndeks: {urun_id}")

            dosya_ismi = f"eksik_tamamla_id_{urun_id}.html"

            # 2. Aşama: Sayfayı tekrar indir
            indirilen_html = sayfayi_guzelce_indir(driver, link, dosya_ismi)

            if not indirilen_html:
                print(f"⚠️ Ağ hatası nedeniyle İndeks {urun_id} pas geçildi.")
                continue

            # 3. Aşama: Yeniden parse et
            veri = yerel_html_wrapper(indirilen_html)

            if veri:
                guncellenecek_alanlar = []
                degerler = []

                # 4. Aşama: Yalnızca eksik olanları güncelle (dolu alanları ezme)

                # Fiyat kontrolü (YENİ EKLENEN)
                if eski_fiyat == 'Fiyat bulunamadı' and veri["fiyat"] != 'Fiyat bulunamadı':
                    guncellenecek_alanlar.append("fiyat = ?")
                    degerler.append(veri["fiyat"])
                    print(f"   💰 Fiyat bulundu: {veri['fiyat']}")

                # Puan kontrolü
                if eski_puan == 'Puan bulunamadı' and veri["puan"] != 'Puan bulunamadı':
                    guncellenecek_alanlar.append("yorum_puani = ?")
                    degerler.append(veri["puan"])
                    print(f"   ⭐ Puan bulundu: {veri['puan']}")

                # Yorum kontrolü
                if (not eski_yorum or eski_yorum.strip() == '') and veri["yorumlar"]:
                    guncellenecek_alanlar.append("yorumlar = ?")
                    degerler.append(veri["yorumlar"])
                    print(f"   💬 Yorumlar bulundu.")

                # Görsel kontrolü
                if eski_gorsel in ('Görsel yok', 'Görsel indirilemedi') and veri["gorsel_url"]:
                    print("   🖼️  Eksik görsel indiriliyor...")
                    yeni_gorsel_yolu = gorsel_indir(veri["gorsel_url"], urun_id)
                    if yeni_gorsel_yolu not in ('Görsel yok', 'Görsel indirilemedi'):
                        guncellenecek_alanlar.append("yerel_gorsel_yolu = ?")
                        degerler.append(yeni_gorsel_yolu)
                        print(f"   🖼️  Görsel kaydedildi: {yeni_gorsel_yolu}")

                if guncellenecek_alanlar:
                    sorgu = f"UPDATE urunler SET {', '.join(guncellenecek_alanlar)} WHERE id = ?"
                    degerler.append(urun_id)

                    try:
                        cursor.execute(sorgu, tuple(degerler))
                        conn.commit()
                        guncellenen_sayisi += 1
                        print(f"✅ İNDEKS {urun_id} EKSİKLERİ BAŞARIYLA YAMANDI! ({len(guncellenecek_alanlar)} alan güncellendi)")
                    except Exception as db_err:
                        print(f"❌ Veri tabanı yama hatası (ID: {urun_id}): {db_err}")
                else:
                    print(f"ℹ️ İndeks {urun_id} için sayfa tekrar tarandı ancak yeni bir değer yakalanamadı.")
                    print(f"   (Bu ürünün Amazon sayfasında ilgili veri olmayabilir.)")
            else:
                print(f"❌ Ayrıştırma hatası veya filtreye takıldı: İndeks {urun_id}")

            if os.path.exists(indirilen_html):
                os.remove(indirilen_html)

            if sira < len(eksik_kayitlar):
                bekleme = random.uniform(4.0, 6.0)
                print(f"😴 {bekleme:.1f} saniye bekleniyor...")
                time.sleep(bekleme)

    except Exception as e:
        print(f"💥 Kritik Sistem Hatası: {e}")
    finally:
        driver.quit()
        conn.close()
        print(f"\n🏁 YAMA İŞLEMİ BİTTİ! Toplam yamalanan/güncellenen ürün sayısı: {guncellenen_sayisi}")


if __name__ == "__main__":
    # -----------------------------------------------------------------
    # 📌 NASIL ÇALIŞTIRIRSIM?
    # -----------------------------------------------------------------
    # EĞER SIFIRDAN KATEGORİ TARAYACAKSAN: Alttaki satırı aktif et, diğerini kapat.
    # tam_otomasyon_sistemini_calistir()

    # EĞER SADECE EKSİK KALAN VERİLERİ YAMAYACAKSAN: Bu satır aktif kalsın.
    eksik_verileri_tamamla()
