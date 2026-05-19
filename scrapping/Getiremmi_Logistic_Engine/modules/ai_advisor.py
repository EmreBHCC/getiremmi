import os
import json
from google import genai
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Kasayı koda yükle
load_dotenv()

# Şifreyi güvenli yoldan çek
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini'ye anahtarı ver
genai.configure(api_key=GEMINI_API_KEY)

def generate_ai_assistant_comment():
    print("🤖 [Gemini AI Advisor] Otomasyon verileri ve ürün yorumları analiz ediliyor...")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    export_dir = os.path.join(base_dir, "export_outputs")

        with open(os.path.join(export_dir, "competitor_data.json"), "r", encoding="utf-8") as f:
            competitor_data = json.load(f)
        with open(os.path.join(export_dir, "trend_forecast.json"), "r", encoding="utf-8") as f:
            trend_data = json.load(f)
    # Kendi API key'ini buraya tırnak içine koy kanka!
    GEMINI_API_KEY = "AIzaSyDryKOz4hlO355aY0ugvCp8gV4ZmTqgK0I"

        client = genai.Client(api_key=GEMINI_API_KEY)

        # 🎯 KOTA VE MODEL FIX: Kota aşımını engellemek için kararlı 'gemini-1.5-pro' modeline çekiyoruz
        prompt = f"""
        Sen modern bir sürdürülebilir lojistik şirketi yönetim panelinin kurumsal AI asistan danışmanısın.
        Bizim otonom web scraper ve wrapper sistemimizin veritabanından çektiği gerçek veriler aşağıdadır.

        Senden İKİ FARKLAR çıktı üretmeni istiyorum ve aralarına '###' işareti koy:
        1) Lojistik yöneticisi için samimi, akıllıca ve 3 cümlelik stratejik bir navlun/trend yorumu yap.
        2) Sistemde en son kazınan ürün için (Örn: Spidey veya Titan oyuncakları) lojistik ve tedarik gözüyle 'Yapay Zeka Ürün Analiz Yorumu' üret. Bu ürünün sevkiyat riski, paket bütünlüğü veya stok durumu lojistik açıdan ne ifade ediyor, net belirt.

        [VERİLER]:
        {json.dumps(competitor_data[:3], ensure_ascii=False)}

        [TREND TAHMİNLERİ]:
        {json.dumps(trend_data[:4], ensure_ascii=False)}
        """

        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=prompt
        )

        raw_text = response.text.strip()
        print("💡 [Gemini AI Advisor] Canlı analiz ve ürün yorumlama başarıyla tamamlandı!")

        # Çıktıyı ikiye bölüyoruz
        parts = raw_text.split('###')
        lojistik_yorum = parts[0].strip()
        urun_yorum = parts[1].strip() if len(
            parts) > 1 else "Ürün tedarik zinciri ve stok durumu lojistik akışa uygundur."

        output_file = os.path.join(export_dir, "ai_advisor_comment.json")
        comment_data = {
            "asistan_lojistik_yorumu": lojistik_yorum,
            "yapay_zeka_urun_yorumu": urun_yorum
        }

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(comment_data, f, ensure_ascii=False, indent=4)
        print(f"✅ [SUCCESS] AI Lojistik ve Ürün Yorumu yazıldı ──► {output_file}")
        return comment_data

if __name__ == "__main__":
    generate_ai_assistant_comment()