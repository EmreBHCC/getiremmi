import sqlite3

# Veritabanına bağlan
conn = sqlite3.connect("urunler_veritabani.db")
cursor = conn.cursor()

# ID'si 13 ve 23 olan kayıtları sil
cursor.execute("DELETE FROM urunler WHERE id IN (13, 23)")
conn.commit()

# Kaç satır silindiğini ekrana bas
print(f"🧹 Temizlik tamamlandı! Toplam {cursor.rowcount} hatalı kayıt silindi.")

conn.close()