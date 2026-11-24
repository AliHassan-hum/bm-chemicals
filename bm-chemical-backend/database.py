import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Vercel par DATABASE_URL na ho toh fallback /tmp/sql_app.db par chalao
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    if os.environ.get("VERCEL"):
        DATABASE_URL = "sqlite:////tmp/sql_app.db"
    else:
        DATABASE_URL = "sqlite:///./sql_app.db"

# Postgres ke liye driver hamesha psycopg (v3) rakho, taake SQLAlchemy ka
# default driver badalne par bhi "No module named psycopg/psycopg2" na aaye.
for prefix in ("postgres://", "postgresql://", "postgresql+psycopg2://"):
    if DATABASE_URL.startswith(prefix):
        DATABASE_URL = "postgresql+psycopg://" + DATABASE_URL[len(prefix):]
        break

# SQLite ke liye check_same_thread chahiye hota hai
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# Neon (serverless Postgres) idle hone par connection band kar deta hai.
# pool_pre_ping har query se pehle connection check karta hai, aur
# pool_recycle purane connections dobara banata hai.
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()