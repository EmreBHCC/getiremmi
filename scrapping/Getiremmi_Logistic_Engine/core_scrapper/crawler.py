import os
import time
import random
import re
from bs4 import BeautifulSoup
import undetected_chromedriver as uc


def kategoriden_linkleri_topla(kategori_url):
    print("\n🕵️‍♂️ Kategori tarayıcı (Crawler) başlatılıyor...")
    options = uc.ChromeOptions()
    driver = uc.Chrome(options=options)

    urun_linkleri = set()

        print(f"🌐 Kategori sayfasına gidiliyor: {kategori_url}")
        driver.get(kategori_url)
        time.sleep(random.uniform(4.0, 6.0))

        print("📜 Sayfadaki tüm ürünlerin yüklenmesi için insansı aşağı kaydırma yapılıyor...")
        toplam_uzunluk = driver.execute_script("return document.body.scrollHeight")
        mevcut_konum = 0

        while mevcut_konum < toplam_uzunluk:
            kaydirma_adimi = random.randint(400, 700)
            mevcut_konum += kaydirma_adimi
            driver.execute_script(f"window.scrollTo(0, {mevcut_konum});")
            time.sleep(random.uniform(0.3, 0.5))
            toplam_uzunluk = driver.execute_script("return document.body.scrollHeight")

        print("⏳ Sayfa sonuna ulaşıldı, linkler ayıklanıyor...")
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        for a_etiketi in soup.find_all('a', href=True):
            href = a_etiketi['href']

            if '/dp/' in href and ('amazon.co.uk' in kategori_url or 'amazon' in href):
                asin_match = re.search(r'/dp/([A-Z0-9]{10})', href)
                if asin_match:
                    temiz_link = f"https://www.amazon.co.uk/dp/{asin_match.group(1)}"
                    urun_linkleri.add(temiz_link)

            elif ('/p/' in href or '/itm/' in href) and 'ebay.com' in kategori_url:
                if href.startswith('/'):
                    href = "https://www.ebay.com" + href
                urun_linkleri.add(href.split('?')[0])

        print(f"🎯 Başarılı: Kategori sayfasından {len(urun_linkleri)} adet benzersiz ürün linki toplandı!")
        return list(urun_linkleri)
