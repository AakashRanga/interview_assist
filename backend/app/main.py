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
from app.models.panel import Panel
from app.models.interview_task import InterviewTask

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

    if not db.query(Panel).first():
        seed_panels = [
            Panel(
                mr_panelist_grade="MR",
                mr_panel_mobile="7708784091",
                hr_panelist_emp_id="1956540",
                hr_panelists_name="Prasanna R",
                hr_panelist_grade="HR",
                hr_panel_mobile="NA",
                tag_coordinator="2262494 - Karthick Kumar",
                slots="10:00 AM to 5:00 PM",
                team_link="https://teams.microsoft.com/mock-link-1",
                interview_type="Technical",
                panel_briefing="MR Panel for technical assessment."
            ),
            Panel(
                mr_panelist_grade="MR",
                mr_panel_mobile="7708784092",
                hr_panelist_emp_id="1956541",
                hr_panelists_name="Rajesh K",
                hr_panelist_grade="HR",
                hr_panel_mobile="9876543210",
                tag_coordinator="2262494 - Karthick Kumar",
                slots="10:00 AM to 5:00 PM",
                team_link="https://teams.microsoft.com/mock-link-2",
                interview_type="Technical",
                panel_briefing="MR Panel for system architecture assessment."
            ),
            Panel(
                mr_panelist_grade="MR",
                mr_panel_mobile="7708784093",
                hr_panelist_emp_id="1956542",
                hr_panelists_name="Anitha S",
                hr_panelist_grade="HR",
                hr_panel_mobile="NA",
                tag_coordinator="2262495 - Vignesh S",
                slots="10:00 AM to 5:00 PM",
                team_link="https://teams.microsoft.com/mock-link-3",
                interview_type="HR",
                panel_briefing="HR panel for cultural fit."
            ),
            Panel(
                mr_panelist_grade="MR",
                mr_panel_mobile="7708784094",
                hr_panelist_emp_id="1956543",
                hr_panelists_name="Vikram M",
                hr_panelist_grade="HR",
                hr_panel_mobile="9876543211",
                tag_coordinator="2262495 - Vignesh S",
                slots="10:00 AM to 5:00 PM",
                team_link="https://teams.microsoft.com/mock-link-4",
                interview_type="Technical",
                panel_briefing="Technical round 2 focus on coding standards."
            ),
            Panel(
                mr_panelist_grade="MR",
                mr_panel_mobile="7708784095",
                hr_panelist_emp_id="1956544",
                hr_panelists_name="Divya N",
                hr_panelist_grade="HR",
                hr_panel_mobile="NA",
                tag_coordinator="2262494 - Karthick Kumar",
                slots="10:00 AM to 5:00 PM",
                team_link="https://teams.microsoft.com/mock-link-5",
                interview_type="Managerial",
                panel_briefing="Managerial round for leadership assessment."
            )
        ]
        db.add_all(seed_panels)
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