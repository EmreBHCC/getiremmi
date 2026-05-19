import os
import re
import json  # JSON-LD ayrıştırması için gerekli
from bs4 import BeautifulSoup


def yerel_html_wrapper(dosya_yolu):
    print(f"⚙️ Wrapper analiz ediyor: {os.path.basename(dosya_yolu)}")

        with open(dosya_yolu, "r", encoding="utf-8") as f:
            html_icerik = f.read()

        soup = BeautifulSoup(html_icerik, 'html.parser')

        # 1. Ürün Adı
        urun_adi_etiketi = soup.find(id='productTitle') or soup.find('h1')
        urun_adi = urun_adi_etiketi.text.strip() if urun_adi_etiketi else "Ürün adı bulunamadı"
        urun_adi = " ".join(urun_adi.split())

        # ==========================================
        # 2. ÜRÜN FİYATI (5 Aşamalı Akıllı Motor)
        # ==========================================
        urun_fiyati = "Fiyat bulunamadı"

        # Aşama 1: Sınıfı 'a-offscreen' olan span (En yaygın ve net fiyat, TRY/£ dahil)
        offscreen = soup.find('span', class_='a-offscreen')
        if offscreen and offscreen.text.strip():
            urun_fiyati = offscreen.text.strip()

        # Aşama 2: Tam sayı ve küsurat parçalama kombinasyonu (a-price-whole + a-price-fraction)
        if urun_fiyati == "Fiyat bulunamadı":
            amazon_fiyat_tam = soup.find('span', class_='a-price-whole')
            if amazon_fiyat_tam:
                amazon_sembol = soup.find('span', class_='a-price-symbol')
                amazon_fiyat_kesir = soup.find('span', class_='a-price-fraction')

                sembol = amazon_sembol.text.strip() if amazon_sembol else ""
                tam_sayi = amazon_fiyat_tam.text.strip()
                # Sayının sonuna yapışan virgül/nokta temizliği
                if tam_sayi.endswith('.') or tam_sayi.endswith(','):
                    tam_sayi = tam_sayi[:-1]
                kesir = amazon_fiyat_kesir.text.strip() if amazon_fiyat_kesir else "00"

                urun_fiyati = f"{sembol}{tam_sayi}.{kesir}".strip()

        # Aşama 3: ID bazlı eski fiyat etiketleri
        if urun_fiyati == "Fiyat bulunamadı":
            eski_id_listesi = ['priceblock_ourprice', 'priceblock_dealprice', 'price_inside_buybox']
            for fiyat_id in eski_id_listesi:
                fiyat_etiketi = soup.find(id=fiyat_id)
                if fiyat_etiketi and fiyat_etiketi.text.strip():
                    urun_fiyati = fiyat_etiketi.text.strip()
                    break

        # Aşama 4: data-asin-price attribute özelliği
        if urun_fiyati == "Fiyat bulunamadı":
            fiyat_data_etiketi = soup.find(attrs={"data-asin-price": True})
            if fiyat_data_etiketi:
                val = fiyat_data_etiketi.get("data-asin-price").strip()
                if val:
                    urun_fiyati = val

        # Aşama 5: JSON-LD (application/ld+json) script etiketinin içi (DOM'da fiyat yoksa arkaplan verisine bakar)
        if urun_fiyati == "Fiyat bulunamadı":
            ld_scripts = soup.find_all('script', type='application/ld+json')
            for script in ld_scripts:
                if script.string:
                    try:
                        veri = json.loads(script.string)
                        # Amazon json formatı liste veya dictionary olabilir, ikisini de kontrol ediyoruz
                        veri_listesi = veri if isinstance(veri, list) else [veri]
                        for oge in veri_listesi:
                            if isinstance(oge, dict) and 'offers' in oge:
                                offers = oge['offers']
                                if isinstance(offers, list) and len(offers) > 0 and 'price' in offers[0]:
                                    urun_fiyati = str(offers[0]['price'])
                                    break
                                elif isinstance(offers, dict) and 'price' in offers:
                                    urun_fiyati = str(offers['price'])
                                    break
                    except json.JSONDecodeError:
                        continue
                if urun_fiyati != "Fiyat bulunamadı":
                    break

        # 3. Stok Durumu
        stok_adedi = "Stok detayı net değil"
        stok_etiket = soup.find(id='availability') or soup.find(id='outOfStock') or soup.find(
            id='miracle-delivery-block')
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
            gorsel_url = amazon_gorsel_etiket.get('src') or amazon_gorsel_etiket.get('data-old-hires')

        # 6. Tüm Kullanıcı Yorumları
        yorumlar_listesi = []
        amazon_yorumlar = soup.find_all('span', attrs={"data-hook": "review-body"}) + soup.find_all('div',
                                                                                                    class_='reviewText')

        for blok in amazon_yorumlar:
            yorum_metni = blok.get_text(separator=' ', strip=True)
            yorum_metni = yorum_metni.replace("Read more", "").replace("Report", "").strip()

            if len(yorum_metni) > 20 and yorum_metni not in yorumlar_listesi:
                if not any(k in yorum_metni.lower() for k in ["stars", "yıldız", "images"]):
                    yorumlar_listesi.append(" ".join(yorum_metni.split()))

        toplu_yorum_metni = "\n---\n".join(yorumlar_listesi[:5])

        # ==========================================
        # 🚀 REKLAM / KART FİLTRESİ
        # ==========================================
        yasakli_kelimeler = ["barclaycard", "no hidden fees", "credit card", "amazon card"]

        if any(yasakli in urun_adi.lower() for yasakli in yasakli_kelimeler):
            print(f"🚫 [FİLTRE] Reklam veya kart sayfası tespit edildi, pas geçiliyor: {urun_adi}")
            return None

        return {
            "urun_adi": urun_adi,
            "fiyat": urun_fiyati,
            "puan": yorum_puani,
            "stok": stok_adedi,
            "gorsel_url": gorsel_url,
            "yorumlar": toplu_yorum_metni
        }
