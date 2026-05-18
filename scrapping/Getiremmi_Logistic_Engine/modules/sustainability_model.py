import os
import json
from datetime import datetime


def calculate_carbon_footprint(distance_km, load_tonnes, vehicle_type="Gemi"):
    # Emisyon katsayıları (kg CO2 per ton-km)
    factors = {"Gemi": 0.015, "Tren": 0.022, "Kamyon": 0.105, "Ucak": 0.500}
    factor = factors.get(vehicle_type, 0.105)
    return distance_km * load_tonnes * factor


def generate_sustainability_report():
    print("🌿 [Green Logistics] Lokal Sürdürülebilirlik Motoru hesaplamalara başladı...")

    # Proje ana dizinini (root) bulma lojiği
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "export_outputs")
    os.makedirs(output_dir, exist_ok=True)

    # Örnek aktif rotalar (Emre abinin ve Damla'nın modüllerine beslenecek)
    routes = [
        {"rota": "Şanghay - İstanbul", "mesafe": 8000, "yuk": 500, "arac": "Gemi"},
        {"rota": "Rotterdam - Mersin", "mesafe": 3500, "yuk": 200, "arac": "Gemi"},
        {"rota": "Münih - İstanbul", "mesafe": 1500, "yuk": 20, "arac": "Kamyon"}
    ]

    report_data = []
    total_co2 = 0

    for r in routes:
        co2 = calculate_carbon_footprint(r["mesafe"], r["yuk"], r["arac"])
        total_co2 += co2
        ska_score = 100 - (co2 / (r["mesafe"] * r["yuk"]) * 500)

        report_data.append({
            "rota": r["rota"],
            "arac": r["arac"],
            "karbon_salinimi_kg": round(co2, 2),
            "ska_puani": max(40, min(100, int(ska_score))),
            "durum": "Optimum" if ska_score > 80 else "İyileştirilmeli"
        })

    final_output = {
        "genel_ska_skoru": 88,
        "toplam_karbon_ayak_izi": round(total_co2, 2),
        "birlesmis_milletler_uyum": ["SKA 7", "SKA 9", "SKA 11", "SKA 13"],
        "rotalar": report_data,
        "guncellenme_zamani": str(datetime.now())
    }

    # Çıktıyı export_outputs klasörüne fırlat
    output_file = os.path.join(output_dir, "sustainability_data.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_output, f, ensure_ascii=False, indent=4)

    print(f"✅ [SUCCESS] SKA Yeşil Karne lokale yazıldı ──► {output_file}")


if __name__ == "__main__":
    generate_sustainability_report()