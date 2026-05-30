from datetime import datetime
from pathlib import Path
import os
import shutil
from typing import List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.candidate import Candidate
from app.models.candidate_application import CandidateApplication
from app.models.job_role import JobRole
from app.models.user import User

router = APIRouter()


class CandidateRequest(BaseModel):
    name: str
    email: str
    phone: str


class CandidateEducation(BaseModel):
    degree: Optional[str]
    university: Optional[str]
    graduation_year: Optional[str]
    gpa: Optional[str]


class CandidateExperience(BaseModel):
    current_role: Optional[str]
    company: Optional[str]
    years_experience: Optional[str]
    summary: Optional[str]


class CandidateLinks(BaseModel):
    portfolio: Optional[str]
    linkedin: Optional[str]
    github: Optional[str]


class CandidateDocuments(BaseModel):
    resume_path: Optional[str]
    certificates: List[str] = []


class ApplicationResponse(BaseModel):
    id: int
    role_id: int
    role_title: str
    preferred_location: Optional[str]
    cover_letter: Optional[str]
    status: str
    created_at: datetime


class JobRoleResponse(BaseModel):
    id: int
    title: str
    location: str
    experience: str
    total_vacancy: int
    description: Optional[str]

    class Config:
        orm_mode = True


class CandidateProfileResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    location: Optional[str]
    status: str
    education: CandidateEducation
    experience: CandidateExperience
    skills: List[str]
    links: CandidateLinks
    documents: CandidateDocuments
    applications: List[ApplicationResponse]
    open_roles: List[JobRoleResponse] = []

    class Config:
        orm_mode = True


class ApplyRoleRequest(BaseModel):
    role_id: int
    preferred_location: Optional[str] = None
    cover_letter: Optional[str] = None


class CandidateProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    education: Optional[CandidateEducation] = None
    experience: Optional[CandidateExperience] = None
    skills: Optional[List[str]] = None
    links: Optional[CandidateLinks] = None
    documents: Optional[CandidateDocuments] = None


UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _safe_list(value: Optional[str]):
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _normalize_doc_path(path: str) -> str:
    filename = os.path.basename(path)
    if not filename:
        return path
    return path if path.startswith("/uploads/") else f"/uploads/{filename}"


@router.post("/candidate/user/{user_id}/upload-document")
async def upload_candidate_document(
    user_id: int,
    file: UploadFile = File(...),
    doc_type: str = Form("resume")
):
    if doc_type not in {"resume", "certificate"}:
        raise HTTPException(status_code=400, detail="Invalid doc_type. Use 'resume' or 'certificate'.")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        candidate = db.query(Candidate).filter(Candidate.user_id == user_id).first()
        if not candidate:
            candidate = Candidate(
                user_id=user.id,
                full_name=user.full_name,
                email=user.email,
                status="new"
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)

        suffix = Path(file.filename).suffix
        timestamp = int(datetime.utcnow().timestamp())
        save_name = f"{user_id}_{doc_type}_{timestamp}{suffix}"
        save_path = UPLOAD_DIR / save_name
        
        # Write file to disk
        with save_path.open("wb") as out_file:
            shutil.copyfileobj(file.file, out_file)
        
        # Verify file was saved successfully
        if not save_path.exists():
            raise HTTPException(status_code=500, detail="File failed to save to disk")

        stored_path = f"/uploads/{save_name}"
        if doc_type == "resume":
            candidate.resume_path = stored_path
        else:
            certificates = _safe_list(candidate.certificates)
            certificates.append(stored_path)
            candidate.certificates = ",".join(certificates)

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        return {
            "status": "success",
            "message": "Document uploaded successfully",
            "path": stored_path
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.post("/add-user")
async def add_user(data: CandidateRequest):

    db = SessionLocal()

    try:

        candidate = Candidate(
            full_name=data.name,
            email=data.email,
            phone=data.phone,
            status="new"
        )

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        return {
            "status": "success",
            "message": "User added successfully",
            "data": {
                "id": candidate.id,
                "name": candidate.full_name,
                "email": candidate.email,
                "phone": candidate.phone
            }
        }

    except Exception as e:

        db.rollback()

        return {
            "status": "error",
            "message": str(e)
        }

    finally:
        db.close()


@router.get("/candidate/{candidate_id}/profile", response_model=CandidateProfileResponse)
def get_candidate_profile(candidate_id: int):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        applications = []
        for app in candidate.applications:
            applications.append(ApplicationResponse(
                id=app.id,
                role_id=app.role_id,
                role_title=app.role.title if app.role else "",
                preferred_location=app.preferred_location,
                cover_letter=app.cover_letter,
                status=app.status,
                created_at=app.created_at
            ))

        open_roles = []
        for role in db.query(JobRole).all():
            open_roles.append(JobRoleResponse(
                id=role.id,
                title=role.title,
                location=role.location,
                experience=role.experience,
                total_vacancy=role.total_vacancy,
                description=role.description
            ))

        return CandidateProfileResponse(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
            status=candidate.status,
            education=CandidateEducation(
                degree=candidate.degree,
                university=candidate.university,
                graduation_year=candidate.graduation_year,
                gpa=candidate.gpa
            ),
            experience=CandidateExperience(
                current_role=candidate.current_role,
                company=candidate.company,
                years_experience=candidate.years_experience,
                summary=candidate.experience_summary
            ),
            skills=_safe_list(candidate.skills),
            links=CandidateLinks(
                portfolio=candidate.portfolio_link,
                linkedin=candidate.linkedin,
                github=candidate.github
            ),
            documents=CandidateDocuments(
                resume_path=candidate.resume_path,
                certificates=_safe_list(candidate.certificates)
            ),
            applications=applications,
            open_roles=open_roles
        )
    finally:
        db.close()


@router.get("/candidate/user/{user_id}/profile", response_model=CandidateProfileResponse)
def get_candidate_profile_by_user(user_id: int):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.user_id == user_id).first()
        if not candidate:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            candidate = Candidate(
                user_id=user.id,
                full_name=user.full_name,
                email=user.email,
                status="new"
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)

        applications = []
        for app in candidate.applications:
            applications.append(ApplicationResponse(
                id=app.id,
                role_id=app.role_id,
                role_title=app.role.title if app.role else "",
                preferred_location=app.preferred_location,
                cover_letter=app.cover_letter,
                status=app.status,
                created_at=app.created_at
            ))

        open_roles = []
        for role in db.query(JobRole).all():
            open_roles.append(JobRoleResponse(
                id=role.id,
                title=role.title,
                location=role.location,
                experience=role.experience,
                total_vacancy=role.total_vacancy,
                description=role.description
            ))

        return CandidateProfileResponse(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
            status=candidate.status,
            education=CandidateEducation(
                degree=candidate.degree,
                university=candidate.university,
                graduation_year=candidate.graduation_year,
                gpa=candidate.gpa
            ),
            experience=CandidateExperience(
                current_role=candidate.current_role,
                company=candidate.company,
                years_experience=candidate.years_experience,
                summary=candidate.experience_summary
            ),
            skills=_safe_list(candidate.skills),
            links=CandidateLinks(
                portfolio=candidate.portfolio_link,
                linkedin=candidate.linkedin,
                github=candidate.github
            ),
            documents=CandidateDocuments(
                resume_path=candidate.resume_path,
                certificates=_safe_list(candidate.certificates)
            ),
            applications=applications,
            open_roles=open_roles
        )
    finally:
        db.close()


@router.put("/candidate/user/{user_id}/profile")
def update_candidate_profile(user_id: int, data: CandidateProfileUpdateRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.user_id == user_id).first()
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        if not candidate:
            candidate = Candidate(
                user_id=user.id,
                full_name=user.full_name,
                email=user.email,
                status="new"
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)

        if data.full_name is not None:
            candidate.full_name = data.full_name
            user.full_name = data.full_name
        if data.email is not None:
            candidate.email = data.email
            user.email = data.email
        if data.phone is not None:
            candidate.phone = data.phone
        if data.location is not None:
            candidate.location = data.location

        if data.education:
            candidate.degree = data.education.degree
            candidate.university = data.education.university
            candidate.graduation_year = data.education.graduation_year
            candidate.gpa = data.education.gpa

        if data.experience:
            candidate.current_role = data.experience.current_role
            candidate.company = data.experience.company
            candidate.years_experience = data.experience.years_experience
            candidate.experience_summary = data.experience.summary

        if data.skills is not None:
            candidate.skills = ",".join(data.skills)

        if data.links:
            candidate.portfolio_link = data.links.portfolio
            candidate.linkedin = data.links.linkedin
            candidate.github = data.links.github

        if data.documents:
            if data.documents.resume_path is not None:
                candidate.resume_path = _normalize_doc_path(data.documents.resume_path)
            if data.documents.certificates is not None:
                certificate_paths = [
                    _normalize_doc_path(cert)
                    for cert in data.documents.certificates
                    if cert
                ]
                candidate.certificates = ",".join(certificate_paths)

        db.add(candidate)
        db.add(user)
        db.commit()

        return {
            "status": "success",
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/roles", response_model=List[JobRoleResponse])
def get_roles():
    db = SessionLocal()
    try:
        return db.query(JobRole).all()
    finally:
        db.close()


@router.get("/locations")
def get_locations():
    db = SessionLocal()
    try:
        locations = db.query(JobRole.location).distinct().all()
        return [location[0] for location in locations]
    finally:
        db.close()


@router.post("/candidate/{candidate_id}/apply")
def apply_role(candidate_id: int, data: ApplyRoleRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        role = db.query(JobRole).filter(JobRole.id == data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        existing = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Candidate has already applied to a job role")

        application = CandidateApplication(
            candidate_id=candidate_id,
            role_id=data.role_id,
            preferred_location=data.preferred_location,
            cover_letter=data.cover_letter,
            status="Applied"
        )
        db.add(application)
        candidate.status = "Applied"
        db.add(candidate)
        db.commit()
        db.refresh(application)

        return {
            "status": "success",
            "message": "Application submitted successfully",
            "data": {
                "id": application.id,
                "candidate_id": candidate.id,
                "role_id": role.id,
                "role_title": role.title,
                "preferred_location": application.preferred_location,
                "cover_letter": application.cover_letter,
                "status": application.status,
                "created_at": application.created_at
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.post("/candidate/user/{user_id}/apply")
def apply_role_by_user(user_id: int, data: ApplyRoleRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.user_id == user_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate profile not found for user")

        role = db.query(JobRole).filter(JobRole.id == data.role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        existing = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Candidate has already applied to a job role")

        application = CandidateApplication(
            candidate_id=candidate.id,
            role_id=data.role_id,
            preferred_location=data.preferred_location,
            cover_letter=data.cover_letter,
            status="Applied"
        )
        db.add(application)
        candidate.status = "Applied"
        db.add(candidate)
        db.commit()
        db.refresh(application)

        return {
            "status": "success",
            "message": "Application submitted successfully",
            "data": {
                "id": application.id,
                "candidate_id": candidate.id,
                "role_id": role.id,
                "role_title": role.title,
                "preferred_location": application.preferred_location,
                "cover_letter": application.cover_letter,
                "status": application.status,
                "created_at": application.created_at
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()