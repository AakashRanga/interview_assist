from datetime import datetime, date, time
from pathlib import Path
import os
import shutil
from typing import List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import joinedload

from app.database import SessionLocal
from app.models.candidate import Candidate, CandidateEducation as DBCandidateEducation, CandidateExperience as DBCandidateExperience
from app.models.candidate_application import CandidateApplication
from app.models.job_role import JobRole
from app.models.interview_schedule import InterviewSchedule
from app.models.user import User
from app.services.notification_service import NotificationService
from app.models.notification import ActivityType, NotificationType

router = APIRouter()


class CandidateRequest(BaseModel):
    name: str
    email: str
    phone: str


class CandidateEducation(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    degree: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None


class CandidateExperience(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    current_role: Optional[str] = None
    company: Optional[str] = None
    years_experience: Optional[str] = None
    summary: Optional[str] = None


class CandidateLinks(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    portfolio: Optional[str]
    linkedin: Optional[str]
    github: Optional[str]


class CandidateDocuments(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    resume_path: Optional[str]
    certificates: List[str] = []


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role_id: int
    role_title: str
    preferred_location: Optional[str]
    cover_letter: Optional[str]
    status: str
    created_at: datetime
    job_type: Optional[str] = None
    venue: Optional[str] = None


class InterviewScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    job_id: int
    date: date
    start_time: time
    end_time: time
    gmeet_link: Optional[str] = None
    interview_status: str
    job_type: str
    venue: Optional[str] = None

class JobRoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    location: str
    experience: str
    total_vacancy: int
    job_type: str
    venue: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None

class CandidateProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    phone: Optional[str]
    location: Optional[str]
    status: str
    education: List[CandidateEducation] = []
    experience: List[CandidateExperience] = []
    skills: List[str]
    links: CandidateLinks
    documents: CandidateDocuments
    applications: List[ApplicationResponse]
    open_roles: List[JobRoleResponse] = []


class ApplyRoleRequest(BaseModel):
    role_id: int
    preferred_location: Optional[str] = None
    cover_letter: Optional[str] = None


class CandidateProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    education: Optional[List[CandidateEducation]] = None
    experience: Optional[List[CandidateExperience]] = None
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
            activity_type = ActivityType.RESUME_UPLOADED
            activity_title = "Resume Uploaded"
        else:
            certificates = _safe_list(candidate.certificates)
            certificates.append(stored_path)
            candidate.certificates = ",".join(certificates)
            activity_type = ActivityType.CERTIFICATE_UPLOADED
            activity_title = "Certificate Uploaded"

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        # Create notification
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=user_id,
                activity_type=activity_type,
                activity_title=activity_title,
                notification_title=activity_title,
                notification_message=f"Your {doc_type} has been successfully uploaded.",
                reference_id=None,
                notification_type=NotificationType.SUCCESS,
                icon="upload",
                priority="medium",
                redirect_url=f"/profile"
            )
        except Exception as notif_error:
            # Log but don't fail the upload if notification creation fails
            print(f"Failed to create notification: {notif_error}")

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
        for role in db.query(JobRole).filter(JobRole.is_visible == True).all():
            open_roles.append(JobRoleResponse(
                id=role.id,
                title=role.title,
                location=role.location,
                experience=role.experience,
                total_vacancy=role.total_vacancy,
                job_type=role.job_type,
                venue=role.venue,
                level=role.level,
                description=role.description
            ))

        education_list = []
        if candidate.education_list:
            for edu in candidate.education_list:
                education_list.append(CandidateEducation(
                    id=edu.id,
                    degree=edu.degree,
                    university=edu.university,
                    graduation_year=edu.graduation_year,
                    gpa=edu.gpa
                ))

        experience_list = []
        if candidate.experience_list:
            for exp in candidate.experience_list:
                experience_list.append(CandidateExperience(
                    id=exp.id,
                    current_role=exp.current_role,
                    company=exp.company,
                    years_experience=exp.years_experience,
                    summary=exp.experience_summary
                ))

        return CandidateProfileResponse(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
            status=candidate.status,
            education=education_list,
            experience=experience_list,
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
        for role in db.query(JobRole).filter(JobRole.is_visible == True).all():
            open_roles.append(JobRoleResponse(
                id=role.id,
                title=role.title,
                location=role.location,
                experience=role.experience,
                total_vacancy=role.total_vacancy,
                job_type=role.job_type,
                venue=role.venue,
                level=role.level,
                description=role.description
            ))

        education_list = []
        if candidate.education_list:
            for edu in candidate.education_list:
                education_list.append(CandidateEducation(
                    id=edu.id,
                    degree=edu.degree,
                    university=edu.university,
                    graduation_year=edu.graduation_year,
                    gpa=edu.gpa
                ))

        experience_list = []
        if candidate.experience_list:
            for exp in candidate.experience_list:
                experience_list.append(CandidateExperience(
                    id=exp.id,
                    current_role=exp.current_role,
                    company=exp.company,
                    years_experience=exp.years_experience,
                    summary=exp.experience_summary
                ))

        return CandidateProfileResponse(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
            status=candidate.status,
            education=education_list,
            experience=experience_list,
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

        if data.education is not None:
            # Clear existing education records
            db.query(DBCandidateEducation).filter(DBCandidateEducation.candidate_id == candidate.id).delete()
            # Add new education records
            for edu in data.education:
                if edu.degree or edu.university or edu.graduation_year or edu.gpa:
                    db_edu = DBCandidateEducation(
                        candidate_id=candidate.id,
                        degree=edu.degree,
                        university=edu.university,
                        graduation_year=edu.graduation_year,
                        gpa=edu.gpa
                    )
                    db.add(db_edu)

        if data.experience is not None:
            # Clear existing experience records
            db.query(DBCandidateExperience).filter(DBCandidateExperience.candidate_id == candidate.id).delete()
            # Add new experience records
            for exp in data.experience:
                if exp.current_role or exp.company or exp.years_experience or exp.summary:
                    db_exp = DBCandidateExperience(
                        candidate_id=candidate.id,
                        current_role=exp.current_role,
                        company=exp.company,
                        years_experience=exp.years_experience,
                        experience_summary=exp.summary
                    )
                    db.add(db_exp)

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

        # Create notification for profile update
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=user_id,
                activity_type=ActivityType.PROFILE_UPDATED,
                activity_title="Profile Updated",
                notification_title="Profile Updated",
                notification_message="Your profile has been successfully updated.",
                notification_type=NotificationType.SUCCESS,
                icon="edit",
                priority="medium",
                redirect_url=f"/profile"
            )
        except Exception as notif_error:
            print(f"Failed to create notification: {notif_error}")

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
        return db.query(JobRole).filter(JobRole.is_visible == True).all()
    finally:
        db.close()


@router.get("/locations")
def get_locations():
    db = SessionLocal()
    try:
        locations = db.query(JobRole.location).filter(JobRole.is_visible == True).distinct().all()
        return [location[0] for location in locations]
    finally:
        db.close()

@router.get("/candidate/user/{user_id}/dashboard")
def get_candidate_dashboard(user_id: int):
    db = SessionLocal()
    try:
        # Eagerly load candidate with applications and their roles
        candidate = db.query(Candidate).options(
            joinedload(Candidate.applications).joinedload(CandidateApplication.role)
        ).filter(Candidate.user_id == user_id).first()

        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        applications = []
        for app in candidate.applications:
            role = app.role if app.role else None
            applications.append(ApplicationResponse(
                id=app.id,
                role_id=app.role_id,
                role_title=role.title if role else "",
                preferred_location=app.preferred_location,
                cover_letter=app.cover_letter,
                status=app.status,
                created_at=app.created_at,
                job_type=role.job_type if role else None,
                venue=role.venue if role else None,
            ))

        # Sort by created_at to get latest
        sorted_applications = sorted(candidate.applications, key=lambda a: a.created_at, reverse=True)
        latest_app = sorted_applications[0] if sorted_applications else None
        interview_schedule = None
        if latest_app:
            interview = db.query(InterviewSchedule).filter(
                InterviewSchedule.candidate_id == candidate.id,
                InterviewSchedule.job_id == latest_app.role_id,
                InterviewSchedule.interview_status == "scheduled"
            ).first()
            if interview:
                # Get job details for venue and job_type
                job_role = db.query(JobRole).filter(JobRole.id == latest_app.role_id).first()
                interview_schedule = InterviewScheduleResponse(
                    id=interview.id,
                    candidate_id=interview.candidate_id,
                    job_id=interview.job_id,
                    date=interview.date,
                    start_time=interview.start_time,
                    end_time=interview.end_time,
                    gmeet_link=interview.gmeet_link,
                    interview_status=interview.interview_status,
                    job_type=job_role.job_type if job_role else "",
                    venue=job_role.venue if job_role else None,
                )

        # Manually construct the CandidateProfileResponse to avoid Pydantic
        # validation errors when passing SQLAlchemy objects directly.
        education_list = []
        if candidate.education_list:
            for edu in candidate.education_list:
                education_list.append(CandidateEducation(
                    id=edu.id,
                    degree=edu.degree,
                    university=edu.university,
                    graduation_year=edu.graduation_year,
                    gpa=edu.gpa
                ))

        experience_list = []
        if candidate.experience_list:
            for exp in candidate.experience_list:
                experience_list.append(CandidateExperience(
                    id=exp.id,
                    current_role=exp.current_role,
                    company=exp.company,
                    years_experience=exp.years_experience,
                    summary=exp.experience_summary
                ))

        open_roles = []
        for role in db.query(JobRole).filter(JobRole.is_visible == True).all():
            open_roles.append(JobRoleResponse(
                id=role.id,
                title=role.title,
                location=role.location,
                experience=role.experience,
                total_vacancy=role.total_vacancy,
                job_type=role.job_type,
                venue=role.venue,
                level=role.level,
                description=role.description
            ))

        candidate_response = CandidateProfileResponse(
            id=candidate.id,
            full_name=candidate.full_name,
            email=candidate.email,
            phone=candidate.phone,
            location=candidate.location,
            status=candidate.status,
            education=education_list,
            experience=experience_list,
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

        latest_application_response = None
        if latest_app:
            role = latest_app.role if latest_app.role else None
            latest_application_response = ApplicationResponse(
                id=latest_app.id,
                role_id=latest_app.role_id,
                role_title=role.title if role else "",
                preferred_location=latest_app.preferred_location,
                cover_letter=latest_app.cover_letter,
                status=latest_app.status,
                created_at=latest_app.created_at,
                job_type=role.job_type if role else None,
                venue=role.venue if role else None,
            )

        return {
            "candidate": candidate_response,
            "applications": applications,
            "latest_application": latest_application_response,
            "interview_schedule": interview_schedule,
        }
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

        # Create notification for application submission
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=candidate.user_id,
                activity_type=ActivityType.APPLICATION_SUBMITTED,
                activity_title=f"Applied for {role.title}",
                notification_title="Application Submitted",
                notification_message=f"Your application for {role.title} has been submitted successfully.",
                reference_id=application.id,
                notification_type=NotificationType.SUCCESS,
                icon="send",
                priority="high",
                redirect_url=f"/applications/{application.id}"
            )
        except Exception as notif_error:
            print(f"Failed to create notification: {notif_error}")

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

        # Create notification for application
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=user_id,
                activity_type=ActivityType.APPLICATION_SUBMITTED,
                activity_title=f"Applied for {role.title}",
                notification_title="Application Submitted",
                notification_message=f"Your application for {role.title} has been submitted successfully.",
                reference_id=application.id,
                notification_type=NotificationType.SUCCESS,
                icon="send",
                priority="high",
                redirect_url=f"/applications/{application.id}"
            )
        except Exception as notif_error:
            print(f"Failed to create notification: {notif_error}")

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