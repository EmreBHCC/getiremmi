from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
import os
from typing import Optional

app = FastAPI(title="Getiremmi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "scrapping",
    "Getiremmi vraperv2",
    "urunler_veritabani.db",
)

GORSEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "scrapping",
    "Getiremmi vraperv2",
)

# Serve static product images
app.mount("/gorseller", StaticFiles(directory=GORSEL_PATH), name="gorseller")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# Kategori tespiti: ürün adından anahtar kelimelerle
def detect_category(urun_adi: str) -> str:
    name_lower = urun_adi.lower()

    if any(k in name_lower for k in ["marvel", "avengers", "batman", "superman", "dc comics", "spider", "spidey"]):
        return "Marvel & DC"
    elif any(k in name_lower for k in ["star wars", "mandalorian"]):
        return "Star Wars"
    elif any(k in name_lower for k in ["sonic", "mario", "yoshi", "nintendo"]):
        return "Oyun Karakterleri"
    elif any(k in name_lower for k in ["disney", "pixar", "toy story", "buzz", "woody", "jessie"]):
        return "Disney & Pixar"
    elif any(k in name_lower for k in ["godzilla", "kong", "monsterverse", "kaiju"]):
        return "Canavar & Yaratıklar"
    elif any(k in name_lower for k in ["anime", "jujutsu", "gojo", "dragon ball", "naruto", "one piece"]):
        return "Anime"
    else:
        return "Diğer Figürler"


@app.get("/api/kategoriler")
def get_kategoriler():
    """Her kategori için temsilci görsel ile birlikte kategorileri döndür"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT urun_adi, yerel_gorsel_yolu FROM urunler WHERE durum='tamamlandi' ORDER BY id ASC"
    )
    rows = cursor.fetchall()
    conn.close()

    # Her kategori için ilk gelen ürünün görselini al
    kategori_map: dict[str, str | None] = {}
    for row in rows:
        kat = detect_category(row["urun_adi"])
        if kat not in kategori_map:
            gorsel = row["yerel_gorsel_yolu"]
            if gorsel:
                filename = gorsel.replace("\\", "/").split("/")[-1]
                kategori_map[kat] = f"/gorseller/urun_gorselleri/{filename}"
            else:
                kategori_map[kat] = None

    result = [
        {"ad": kat, "gorsel_url": gorsel}
        for kat, gorsel in sorted(kategori_map.items())
    ]
    return {"kategoriler": result}


@app.get("/api/urunler")
def get_urunler(
    kategori: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Ürünleri getir, kategoriye göre filtrele"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, link, urun_adi, fiyat, yorum_puani, stok_durumu, yerel_gorsel_yolu, durum FROM urunler WHERE durum='tamamlandi'"
    )
    rows = cursor.fetchall()
    conn.close()

    urunler = []
    for row in rows:
        row_dict = dict(row)
        row_dict["kategori"] = detect_category(row_dict["urun_adi"])
        # Gorsel URL'si
        gorsel = row_dict.get("yerel_gorsel_yolu", "")
        if gorsel:
            filename = gorsel.replace("\\", "/").split("/")[-1]
            row_dict["gorsel_url"] = f"/gorseller/urun_gorselleri/{filename}"
        else:
            row_dict["gorsel_url"] = None
        urunler.append(row_dict)

    # Kategori filtresi
    if kategori and kategori != "Tümü":
        urunler = [u for u in urunler if u["kategori"] == kategori]

    total = len(urunler)
    urunler = urunler[offset : offset + limit]

    return {"total": total, "urunler": urunler}


@app.get("/api/urunler/{urun_id}")
def get_urun_detail(urun_id: int):
    """Tek ürün detayı"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM urunler WHERE id=?", (urun_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"error": "Ürün bulunamadı"}

    row_dict = dict(row)
    row_dict["kategori"] = detect_category(row_dict["urun_adi"])
    gorsel = row_dict.get("yerel_gorsel_yolu", "")
    if gorsel:
        filename = gorsel.replace("\\", "/").split("/")[-1]
        row_dict["gorsel_url"] = f"/gorseller/urun_gorselleri/{filename}"
    else:
        row_dict["gorsel_url"] = None

    return row_dict


@app.get("/api/health")
def health():
    return {"status": "ok"}
