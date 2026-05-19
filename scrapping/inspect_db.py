import sqlite3

db_path = r'c:\Users\emre_\Documents\Github\getiremmi\scrapping\Getiremmi vraperv2\urunler_veritabani.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables:", tables)

for table in tables:
    table_name = table[0]
    print(f"\n--- Table: {table_name} ---")
    cursor.execute(f"PRAGMA table_info({table_name})")
    cols = cursor.fetchall()
    print("Columns:", [(c[1], c[2]) for c in cols])
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
    rows = cursor.fetchall()
    print("Sample rows:")
    for row in rows:
        print(row)

conn.close()
