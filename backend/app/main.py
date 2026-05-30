from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.resume_routes import router as resume_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router

from app.database import engine, SessionLocal, Base
from app.models.candidate import Candidate
from app.models.job_role import JobRole
from app.models.user import User
from app.models.interview_schedule import InterviewSchedule

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    if not db.query(JobRole).first():
        seed_roles = [
            JobRole(
                title='Senior Frontend Engineer',
                location='Bangalore, India',
                experience='5-8 years',
                total_vacancy=4,
                description='Build delightful user experiences with React, TypeScript, and modern frontend tooling.'
            ),
            JobRole(
                title='Product Designer',
                location='Hyderabad, India',
                experience='3-5 years',
                total_vacancy=2,
                description='Design beautiful, intuitive product flows and contribute to our design system.'
            ),
            JobRole(
                title='HR Business Partner',
                location='Pune, India',
                experience='6-10 years',
                total_vacancy=1,
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
            degree='Bachelor of Computer Science',
            university='Stanford University',
            graduation_year='2022',
            gpa='3.8',
            current_role='Frontend Developer',
            company='Tech Corp',
            years_experience='3',
            experience_summary='Experienced frontend engineer building modern web applications.',
            portfolio_link='https://john-doe.dev',
            linkedin='https://linkedin.com/in/johndoe',
            github='https://github.com/johndoe',
            preferred_location='Remote (India)'
        )
        db.add(seed_candidate)
        db.commit()

app = FastAPI(title="AI Recruitment System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/")
def home():
    return {"message": "Server Running"}

@app.get("/health")
def health():
    return {"status": "ok"}