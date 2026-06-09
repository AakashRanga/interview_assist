from pathlib import Path
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from app.routes.resume_routes import router as resume_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router
from app.routes.notification_routes import router as notification_router

from app.database import engine, Base

Base.metadata.create_all(bind=engine)

with engine.begin() as connection:
    if os.getenv("DB_NAME"):
        db_name = os.getenv("DB_NAME")
        result = connection.execute(
            text(
                "SELECT COLUMN_NAME FROM information_schema.columns "
                "WHERE table_schema = :schema AND table_name = 'job_roles'"
            ),
            {"schema": db_name}
        )
        existing_columns = {row[0] for row in result}
        if "job_type" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE job_roles ADD COLUMN job_type VARCHAR(50) NOT NULL DEFAULT 'Online'"
                )
            )
        if "venue" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE job_roles ADD COLUMN venue VARCHAR(255) NULL"
                )
            )
        if "created_at" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE job_roles ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
                )
            )
        if "is_visible" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE job_roles ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE"
                )
            )

        # candidates table columns check
        result_cand = connection.execute(
            text(
                "SELECT COLUMN_NAME FROM information_schema.columns "
                "WHERE table_schema = :schema AND table_name = 'candidates'"
            ),
            {"schema": db_name}
        )
        existing_cand_columns = {row[0] for row in result_cand}
        if "panel_id" not in existing_cand_columns:
            connection.execute(
                text(
                    "ALTER TABLE candidates ADD COLUMN panel_id VARCHAR(100) NULL"
                )
            )
        if "panel_group_id" not in existing_cand_columns:
            connection.execute(
                text(
                    "ALTER TABLE candidates ADD COLUMN panel_group_id VARCHAR(100) NULL"
                )
            )

        # interview_schedule table columns check
        result_sched = connection.execute(
            text(
                "SELECT COLUMN_NAME FROM information_schema.columns "
                "WHERE table_schema = :schema AND table_name = 'interview_schedule'"
            ),
            {"schema": db_name}
        )
        existing_sched_columns = {row[0] for row in result_sched}
        if "panel_id" not in existing_sched_columns:
            connection.execute(
                text(
                    "ALTER TABLE interview_schedule ADD COLUMN panel_id INT NULL"
                )
            )

app = FastAPI(title="AI Recruitment System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8189",
        "http://127.0.0.1:8189",
        "https://aakashranga.github.io/interview_assist",
        "https://aakashranga.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(admin_router)
app.include_router(notification_router)

@app.get("/")
def home():
    return {"message": "Server Running"}

@app.get("/health")
def health():
    return {"status": "ok"}