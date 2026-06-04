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

from app.database import engine, SessionLocal, Base
from app.models.candidate import Candidate, CandidateEducation, CandidateExperience
from app.models.job_role import JobRole
from app.models.user import User
from app.models.interview_schedule import InterviewSchedule
from app.models.notification import CandidateActivity, Notification

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

with SessionLocal() as db:
    if not db.query(JobRole).first():
        seed_roles = [
            JobRole(
                title='Senior Frontend Engineer',
                location='Bangalore, India',
                experience='5-8 years',
                total_vacancy=4,
                job_type='Online',
                description='Build delightful user experiences with React, TypeScript, and modern frontend tooling.'
            ),
            JobRole(
                title='Product Designer',
                location='Hyderabad, India',
                experience='3-5 years',
                total_vacancy=2,
                job_type='Offline',
                venue='Tech Park Campus, Floor 3, Room 12',
                description='Design beautiful, intuitive product flows and contribute to our design system.'
            ),
            JobRole(
                title='HR Business Partner',
                location='Pune, India',
                experience='6-10 years',
                total_vacancy=1,
                job_type='Offline',
                venue='Corporate HQ, Conference Room A',
                description='Partner with engineering leadership to drive people strategy and talent growth.'
            )
        ]
        db.add_all(seed_roles)
        db.commit()

    if not db.query(User).first():
        seed_users = [
            User(
                full_name='John Doe',
                email='candidate@example.com',
                password='candidate123',
                role='candidate'
            ),
            User(
                full_name='Sarah Panel',
                email='panel@example.com',
                password='panel123',
                role='panel'
            ),
            User(
                full_name='Admin User',
                email='admin@example.com',
                password='admin123',
                role='admin'
            )
        ]
        db.add_all(seed_users)
        db.commit()

    if not db.query(Candidate).first():
        candidate_user = db.query(User).filter(User.email == 'candidate@example.com').first()
        user_id = candidate_user.id if candidate_user else 1
        
        seed_candidate = Candidate(
            user_id=user_id,
            full_name='John Doe',
            email='candidate@example.com',
            phone='+1 (555) 123-4567',
            location='San Francisco, CA',
            status='new',
            resume_path='resume/john_doe_resume.pdf',
            skills='React,TypeScript,Node.js',
            certificates='AWS Certification,React Professional',
            portfolio_link='https://john-doe.dev',
            linkedin='https://linkedin.com/in/johndoe',
            github='https://github.com/johndoe',
            preferred_location='Remote (India)'
        )
        db.add(seed_candidate)
        db.commit()
        db.refresh(seed_candidate)

        # Seed candidate education
        seed_edu = CandidateEducation(
            candidate_id=seed_candidate.id,
            degree='Bachelor of Computer Science',
            university='Stanford University',
            graduation_year='2022',
            gpa='3.8'
        )
        db.add(seed_edu)

        # Seed candidate experience
        seed_exp = CandidateExperience(
            candidate_id=seed_candidate.id,
            current_role='Frontend Developer',
            company='Tech Corp',
            years_experience='3',
            experience_summary='Experienced frontend engineer building modern web applications.'
        )
        db.add(seed_exp)
        db.commit()

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