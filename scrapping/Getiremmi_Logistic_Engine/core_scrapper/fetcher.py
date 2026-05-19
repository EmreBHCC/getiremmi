import os
import time
import random
import requests
import undetected_chromedriver as uc


def sayfayi_guzelce_indir(driver, url, dosya_adi, depo_klasoru="html_depo"):
    print(f"🌐 Aynı oturum üzerinden sayfaya gidiliyor: {url}")

    if not os.path.exists(depo_klasoru):
        os.makedirs(depo_klasoru)

    kayit_yolu = os.path.join(depo_klasoru, dosya_adi)

        driver.get(url)
        time.sleep(random.uniform(3.0, 5.0))

        print("📜 İnsansı Smooth-Scroll (Aşağı Kaydırma) başlatıldı...")
        toplam_uzunluk = driver.execute_script("return document.body.scrollHeight")
        mevcut_konum = 0

        while mevcut_konum < toplam_uzunluk:
            kaydirma_adimi = random.randint(300, 500)
            mevcut_konum += kaydirma_adimi
            driver.execute_script(f"window.scrollTo(0, {mevcut_konum});")
            time.sleep(random.uniform(0.2, 0.4))
            toplam_uzunluk = driver.execute_script("return document.body.scrollHeight")

        print("⏳ Veriler eşitleniyor, son 4 saniye...")
        time.sleep(4)

        html_kaynagi = driver.page_source
        with open(kayit_yolu, "w", encoding="utf-8") as f:
            f.write(html_kaynagi)

        return kayit_yolu
def gorsel_indir(gorsel_url, urun_id, klasor="urun_gorselleri"):
    if not gorsel_url or gorsel_url == "Görsel yok":
        return "Görsel yok"

    if not os.path.exists(klasor):
        os.makedirs(klasor)

        uzanti = ".jpg"
        if ".png" in gorsel_url.lower():
            uzanti = ".png"

        gorsel_adi = f"urun_{urun_id}{uzanti}"
        kayit_yolu = os.path.join(klasor, gorsel_adi)

        cevap = requests.get(gorsel_url, timeout=15)
        if cevap.status_code == 200:
            with open(kayit_yolu, 'wb') as f:
                f.write(cevap.content)
            return kayit_yolu
    return "Görsel indirilemedi"