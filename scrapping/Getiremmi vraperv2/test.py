import sqlite3
import csv

# Veritabanını aç
conn = sqlite3.connect('urunler_veritabani.db')
cursor = conn.cursor()

# Tablo isimlerini öğren
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

# Her tabloyu CSV'ye aktar
for table in tables:
    table_name = table[0]
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    # Kolon isimlerini al
    columns = [description[0] for description in cursor.description]

    # CSV'ye yaz
    with open(f'{table_name}.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(columns)  # Başlık satırı
        writer.writerows(rows)

    print(f"✅ {table_name}.csv oluşturuldu ({len(rows)} satır)")

conn.close()