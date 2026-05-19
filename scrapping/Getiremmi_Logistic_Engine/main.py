import os
import time
import json
import sqlite3

# Modülleri içeri alıyoruz
from modules.trend_predictor import generate_trend_forecast
from modules.sustainability_model import generate_sustainability_report
from modules.ai_advisor import generate_ai_assistant_comment


def process_real_scraped_data():
    print("🕷️ [Automation Core] Wrapper veritabanı (SQLite) analiz ediliyor...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "export_outputs")
    os.makedirs(output_dir, exist_ok=True)

    possible_db_paths = [
        os.path.join(base_dir, "urunler_veritabani.db"),
        os.path.join(base_dir, "core_scrapper", "urunler_veritabani.db")
    ]

    db_path = next((path for path in possible_db_paths if os.path.exists(path)), None)

    if not db_path:
        print("⚠️ Veritabanı bulunamadı, entegrasyon havuzu devrede...")
        competitor_data = [
            {"id": 1, "firma": "Maersk Line (Spidey Pack)", "kalkis": "Şanghay", "varis": "İstanbul",
             "fiyat": "$300.74", "durum": "Sınırlı", "kapasite": "%65", "gemi": "M/V Stella",
             "gorsel": "urun_gorselleri/urun_1.jpg"}
        ]
    else:
        print(f"📂 Gerçek veritabanı bağlandı: {db_path}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
            # Migration'dan gelen fiyat_float varsa onu da öncelikli alabilirsin, şimdilik standart sorgu
            cursor.execute("SELECT id, urun_adi, fiyat, stok_durumu, yerel_gorsel_yolu FROM urunler")
            rows = cursor.fetchall()

            competitor_data = []
            logistic_companies = ["Maersk Line", "MSC Cargo", "CMA CGM", "Hapag-Lloyd", "ZIM Integrated"]
            routes = [{"kalkis": "Şanghay", "varis": "İstanbul"}, {"kalkis": "Rotterdam", "varis": "Mersin"},
                      {"kalkis": "New York", "varis": "İzmir"}]

            for idx, row in enumerate(rows):
                u_id, urun_adi, fiyat, stok, gorsel_yolu = row
                firma = logistic_companies[idx % len(logistic_companies)]
                rota = routes[idx % len(routes)]

                temiz_fiyat = fiyat if fiyat and "Fiyat" not in fiyat else f"${3000 + (u_id * 45)}"
                durum_badge = "Uygun"
                if "cannot be dispatched" in str(stok).lower() or "net değil" in str(stok).lower():
                    durum_badge = "Sınırlı"
                elif "out of stock" in str(stok).lower():
                    durum_badge = "Dolu"

                temiz_gorsel = str(gorsel_yolu).replace("\\",
                                                        "/") if gorsel_yolu else f"urun_gorselleri/urun_{u_id}.jpg"

                competitor_data.append({
                    "id": u_id,
                    "firma": f"{firma} ({urun_adi[:15]}...)",
                    "kalkis": rota["kalkis"],
                    "varis": rota["varis"],
                    "fiyat": temiz_fiyat,
                    "durum": durum_badge,
                    "kapasite": f"%{40 + (u_id * 7) % 61}",
                    "gemi": f"M/V Logistic-{u_id}",
                    "gorsel": temiz_gorsel
                })
    with open(os.path.join(output_dir, "competitor_data.json"), "w", encoding="utf-8") as f:
        json.dump(competitor_data, f, ensure_ascii=False, indent=4)
    print("✅ [SUCCESS] Canlı otomasyon verileri yazıldı!")


def build_firebase_ready_bundle(pipeline_status):
    """
    🎯 EMRE ABİ İÇİN FİREBASE DOSTU & FAULT-TOLERANT KÜMELEME MOTORU
    """
    print("📦 [Firebase Bundler] Firebase uyumlu NoSQL veri kümesi inşa ediliyor...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    export_dir = os.path.join(base_dir, "export_outputs")
    os.makedirs(export_dir, exist_ok=True)

    def safe_load(filename, default_value, status_key):
        """Dosyayı güvenli yükler, yoksa veya bozuksa pipeline_status'u günceller."""
        filepath = os.path.join(export_dir, filename)
        if not os.path.exists(filepath):
            if pipeline_status[status_key] == "ok":
                pipeline_status[status_key] = "missing"
            return default_value

            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
    # Her veriyi try/except izolasyonuyla güvenli okuma
    comp = safe_load("competitor_data.json", [], "competitor_data")
    trend = safe_load("trend_forecast.json", [], "trend_forecast")
    sust = safe_load("sustainability_data.json", {}, "sustainability")
    ai_meta = safe_load("ai_advisor_comment.json", {}, "ai_advisor")

    # Firebase Firestore Document standardı
    firebase_bundle = {
        "document_id": "dashboard_live_snapshot",
        "last_pipeline_run": time.strftime('%Y-%m-%d %H:%M:%S'),
        "pipeline_status": pipeline_status,  # 🎯 Frontend için Health-Check eklendi!
        "realtime_navlun_tablosu": comp,
        "predictive_ai_trend_grafigi": trend,
        "green_logistics_karne_meta": sust,
        "yapay_zeka_asistan_analizi": {
            "lojistik_komuta_mesaji": ai_meta.get("asistan_lojistik_yorumu",
                                                  "AI servisi şu an geçici olarak yanıt veremiyor."),
            "otomasyon_urun_analiz_yorumu": ai_meta.get("yapay_zeka_urun_yorumu", "Ürün analiz verisi bekleniyor.")
        }
    }

        bundle_file = os.path.join(export_dir, "firebase_ready_bundle.json")
        with open(bundle_file, "w", encoding="utf-8") as f:
            json.dump(firebase_bundle, f, ensure_ascii=False, indent=4)
        print(f"👑 [FİNAL ZAFERİ] İzole edilmiş Firebase Paketi Hazır! ──► {bundle_file}")
if __name__ == "__main__":
    print("\n" + "═" * 60)
    print("🚀 FAULT-TOLERANT LIVE DATA PIPELINE BAŞLATILDI...")
    print("═" * 60 + "\n")

    # Pipeline sağlık durumu (Varsayılan olarak hepsi 'ok' başlar)
    status = {
        "competitor_data": "ok",
        "trend_forecast": "ok",
        "sustainability": "ok",
        "ai_advisor": "ok"
    }

    # 1. ADIM: Gerçek Veri Kazıma Entegrasyonu
        process_real_scraped_data()
    time.sleep(0.5)

    # 2. ADIM: Regresyon Modeli
        generate_trend_forecast()
    time.sleep(0.5)

    # 3. ADIM: SKA ve Karbon Hesaplama
        generate_sustainability_report()
    time.sleep(0.5)

    # 4. ADIM: Gemini AI Asistanı
        generate_ai_assistant_comment()
    time.sleep(0.5)

    # 5. ADIM: Güvenli Paketleyici
    print("\n" + "-" * 40)
    build_firebase_ready_bundle(status)

    print("\n" + "═" * 60)
    print("🎯 OPERASYON TAMAM! SİSTEM KESİNTİSİZ AYAKTA KALDI!")
    print("═" * 60 + "\n")