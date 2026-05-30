from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from app.database import SessionLocal
from app.models.user import User
from app.models.candidate import Candidate
from app.models.interview_schedule import InterviewSchedule
from app.workers.tasks import schedule_interview_task
from datetime import datetime, date, time, timedelta

router = APIRouter(prefix="/admin", tags=["admin"])


class AddPanelRequest(BaseModel):
    full_name: str
    email: str
    password: str


class PanelResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        orm_mode = True


class AdminResponse(BaseModel):
    status: str
    message: str
    panel: Optional[PanelResponse] = None


def get_current_user_from_email(email: str, db) -> Optional[User]:
    """Helper function to get user from email (in production, use JWT tokens)"""
    return db.query(User).filter(User.email == email).first()


@router.post("/add-panel", response_model=AdminResponse)
def add_panel(data: AddPanelRequest, admin_email: str = Header(None)):
    """
    Add a new panel member (interview panelist).
    Only admins can add panel members.
    admin_email should be passed as a header with the admin's email.
    """
    db = SessionLocal()
    try:
        # Verify admin
        if not admin_email:
            raise HTTPException(status_code=401, detail="Admin email required in headers")

        admin_user = get_current_user_from_email(admin_email, db)
        if not admin_user:
            raise HTTPException(status_code=401, detail="Admin not found")

        if admin_user.role != "admin":
            raise HTTPException(status_code=403, detail="Only admins can add panel members")

        # Check if email already exists
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new panel member
        panel_user = User(
            full_name=data.full_name,
            email=data.email,
            password=data.password,
            role="panel"
        )
        db.add(panel_user)
        db.commit()
        db.refresh(panel_user)

        return {
            "status": "success",
            "message": "Panel member added successfully",
            "panel": PanelResponse(
                id=panel_user.id,
                full_name=panel_user.full_name,
                email=panel_user.email,
                role=panel_user.role
            )
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# ============ Interview Scheduling ============

class ScheduleInterviewRequest(BaseModel):
    candidate_id: int
    job_id: Optional[int] = None


class ScheduleInterviewResponse(BaseModel):
    status: str
    message: str
    schedule_id: Optional[int] = None


def find_available_slot(db, target_date: date = None):
    """
    Find the next available slot for interview.
    Returns (start_time, end_time) or None if no slots available.
    """
    if target_date is None:
        target_date = date.today()

    # Define working hours (9 AM to 5 PM)
    slot_duration = timedelta(hours=1)
    work_start = time(9, 0)
    work_end = time(17, 0)

    # Get all schedules for the target date
    schedules = db.query(InterviewSchedule).filter(
        InterviewSchedule.date == target_date,
        InterviewSchedule.interview_status != "cancelled"
    ).all()

    occupied_slots = [(s.start_time, s.end_time) for s in schedules]

    # Find first available slot
    current_time = work_start
    while current_time < work_end:
        slot_end = (datetime.combine(target_date, current_time) + slot_duration).time()

        # Check if this slot is occupied
        is_occupied = False
        for occupied_start, occupied_end in occupied_slots:
            # Check overlap
            if current_time < occupied_end and slot_end > occupied_start:
                is_occupied = True
                break

        if not is_occupied:
            return current_time, slot_end

        current_time = slot_end

    return None


@router.post("/schedule-interview", response_model=ScheduleInterviewResponse)
def schedule_interview(data: ScheduleInterviewRequest):
    """
    Schedule an interview for a candidate:
    1. Validate candidate exists and has email
    2. Find available slot
    3. Create schedule record
    4. Queue Celery task to call n8n
    """
    db = SessionLocal()

    try:
        # Step 1: Validate candidate
        candidate = db.query(Candidate).filter(
            Candidate.id == data.candidate_id
        ).first()

        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        if not candidate.email:
            raise HTTPException(status_code=400, detail="Candidate has no email address")

        if candidate.status != "Applied":
            raise HTTPException(status_code=400, detail=f"Candidate status '{candidate.status}' is not active")

        # Step 3: Find available slot
        target_date = date.today()
        slot = find_available_slot(db, target_date)

        if not slot:
            # Try tomorrow
            target_date = date.today() + timedelta(days=1)
            slot = find_available_slot(db, target_date)

        if not slot:
            raise HTTPException(status_code=400, detail="No available slots today or tomorrow")

        start_time, end_time = slot

        # Step 4: Create schedule record
        schedule = InterviewSchedule(
            candidate_id=data.candidate_id,
            job_id=data.job_id,
            date=target_date,
            start_time=start_time,
            end_time=end_time,
            interview_status="pending"  # Will be updated by Celery
        )
        db.add(schedule)
        db.commit()
        db.refresh(schedule)

        # Step 5: Queue Celery task
        schedule_interview_task.delay(schedule.id, data.candidate_id)

        return {
            "status": "queued",
            "message": f"Interview scheduled for {target_date} {start_time}-{end_time}. n8n will generate Google Meet link.",
            "schedule_id": schedule.id
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
