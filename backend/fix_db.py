from database.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE doctors ALTER COLUMN specialization SET DEFAULT 'General'"))
    conn.execute(text("ALTER TABLE doctors ALTER COLUMN experience SET DEFAULT 0"))
    conn.execute(text("ALTER TABLE doctors ALTER COLUMN consultation_fee SET DEFAULT 500"))
    conn.execute(text("ALTER TABLE doctors ALTER COLUMN available_days SET DEFAULT 'Mon-Fri'"))
    conn.commit()
    print("Done! Defaults set.")
    