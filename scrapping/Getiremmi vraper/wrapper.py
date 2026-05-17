import os
import re
from bs4 import BeautifulSoup


def yerel_html_wrapper(dosya_yolu):
    print(f"⚙️ Wrapper analiz ediyor: {os.path.basename(dosya_yolu)}")

    try:
        with open(dosya_yolu, "r", encoding="utf-8") as f:
            html_icerik = f.read()

        soup = BeautifulSoup(html_icerik, 'html.parser')

        # 1. Ürün Adı
        urun_adi_etiketi = soup.find(id='productTitle') or soup.find('h1',
                                                                     class_='x-item-title__mainTitle') or soup.find(
            'h1')
        urun_adi = urun_adi_etiketi.text.strip() if urun_adi_etiketi else "Ürün adı bulunamadı"
        urun_adi = " ".join(urun_adi.split())

        # 2. Ürün Fiyatı
        urun_fiyati = "Fiyat bulunamadı"
        price_display = soup.find('span', class_='a-price')
        if price_display:
            offscreen = price_display.find('span', class_='a-offscreen')
            if offscreen:
                urun_fiyati = offscreen.text.strip()

        if urun_fiyati == "Fiyat bulunamadı":
            amazon_fiyat = soup.find('span', class_='a-price-whole')
            if amazon_fiyat:
                amazon_sembol = soup.find('span', class_='a-price-symbol')
                amazon_fiyat_kesir = soup.find('span', class_='a-price-fraction')
                sembol = amazon_sembol.text.strip() if amazon_sembol else "£"
                kesir = amazon_fiyat_kesir.text.strip() if amazon_fiyat_kesir else "00"
                urun_fiyati = f"{sembol}{amazon_fiyat.text.strip()}{kesir}".replace('.', '').strip()

        # 3. Stok Durumu
        stok_adedi = "Stok detayı net değil"
        stok_etiket = soup.find(id='availability') or soup.find('div', class_='x-quantity__availability')
        if stok_etiket and stok_etiket.text.strip():
            stok_adedi = stok_etiket.text.strip()
        stok_adedi = " ".join(stok_adedi.split())

        # 4. Yorum Puanı
        yorum_puani = "Puan bulunamadı"
        amazon_puan = soup.find('span', class_='a-icon-alt') or soup.find('span',
                                                                          attrs={"data-hook": "rating-out-of-text"})
        if amazon_puan:
            puan_metni = amazon_puan.text.strip()
            sayi_eslesmesi = re.search(r'(\d[.,]\d)', puan_metni)
            if sayi_eslesmesi:
                yorum_puani = f"{sayi_eslesmesi.group(1).replace(',', '.')} / 5"

        # 5. GÖRSEL URL YAKALAMA
        gorsel_url = None
        amazon_gorsel_etiket = soup.find(id='landingImage') or soup.find(id='imgBlkFront')
        if amazon_gorsel_etiket:
            gorsel_url = amazon_gorsel_etiket.get('src')

        if not gorsel_url:
            ebay_gorsel_container = soup.find('div', class_='ux-image-carousel-item') or soup.find('img', id='icImg')
            if ebay_gorsel_container:
                ebay_img = ebay_gorsel_container.find(
                    'img') if ebay_gorsel_container.name != 'img' else ebay_gorsel_container
                gorsel_url = ebay_img.get('src') or ebay_img.get('data-src')

        # 6. Tüm Kullanıcı Yorumları (Hatanın düzeltildiği yer kanka)
        yorumlar_listesi = []
        amazon_yorumlar = soup.find_all('span', attrs={"data-hook": "review-body"}) + soup.find_all('div',
                                                                                                    class_='reviewText')
        ebay_yorumlar = soup.find_all('div', class_='x-review-section') + soup.find_all('p', class_='review-text')

        for blok in (amazon_yorumlar + ebay_yorumlar):
            yorum_metni = blok.get_text(separator=' ', strip=True)
            yorum_metni = yorum_metni.replace("Read more", "").replace("Report", "").strip()

            # Sözdizimi hatası üreten walrus ifadesi temizlendi, standart kontrole geçildi
            if len(yorum_metni) > 20 and yorum_metni not in yorumlar_listesi:
                if not any(k in yorum_metni.lower() for k in ["stars", "yıldız", "images"]):
                    yorumlar_listesi.append(" ".join(yorum_metni.split()))

        toplu_yorum_metni = "\n---\n".join(yorumlar_listesi[:5])

        return {
            "urun_adi": urun_adi,
            "fiyat": urun_fiyati,
            "puan": yorum_puani,
            "stok": stok_adedi,
            "gorsel_url": gorsel_url,
            "yorumlar": toplu_yorum_metni
        }

    except Exception as e:
        print(f"❌ Wrapper hatası: {e}")
        return None