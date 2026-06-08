from typing import Optional, List
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from app.database import SessionLocal
from app.models.user import User
from app.models.candidate import Candidate
from app.models.candidate_application import CandidateApplication
from app.models.interview_schedule import InterviewSchedule
from app.models.job_role import JobRole
from app.services.notification_service import NotificationService
from app.models.notification import ActivityType, NotificationType
from app.workers.tasks import schedule_interview_task
from app.models.panel import Panel
from app.models.interview_task import InterviewTask
from datetime import datetime, date, time, timedelta
from zoneinfo import ZoneInfo

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
    Uses Indian Standard Time (IST).
    """
    # Get current time in IST
    IST = ZoneInfo('Asia/Kolkata')
    now_ist = datetime.now(IST)
    current_time_ist = now_ist.time()
    today_ist = now_ist.date()

    # If no target_date provided, use today (IST)
    if target_date is None:
        target_date = today_ist

    # If target_date is in the past, return None
    if target_date < today_ist:
        return None

    # Define working hours (9 AM to 5 PM IST)
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

    # If scheduling for today, start from the next available slot after current time
    if target_date == today_ist:
        # Check if current time is within working hours
        if current_time_ist >= work_start and current_time_ist < work_end:
            hour_now = now_ist.hour
            # If minute > 0, we're past the start of current hour slot, use next slot
            if current_time_ist.minute > 0:
                next_hour = hour_now + 1
                # If next hour is still within work hours
                if next_hour < 17:
                    current_time = time(next_hour, 0)
                else:
                    return None  # No more slots today
            # If minute == 0, we're exactly at slot start, can use current slot

    while current_time and current_time < work_end:
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


def find_5_available_slots(db):
    """
    Find 5 sequential, non-overlapping 1-hour slots during business hours (9 AM - 5 PM IST).
    Checks both interview_schedule and interview_tasks to avoid double booking.
    Returns a list of 5 dicts: [{"date": date, "start_time": time, "end_time": time}]
    """
    IST = ZoneInfo('Asia/Kolkata')
    now_ist = datetime.now(IST)
    current_date = now_ist.date()
    
    work_start = time(9, 0)
    work_end = time(17, 0)
    
    # Decide start time for searching today
    if now_ist.time() >= time(16, 0):
        # Already past last slot start today, start tomorrow at 9 AM
        current_date = current_date + timedelta(days=1)
        current_hour = 9
    elif now_ist.time() >= work_start:
        # We are within the workday, start from the next hour
        current_hour = now_ist.hour + 1
        if current_hour < 9:
            current_hour = 9
    else:
        # Before workday starts today, start at 9 AM today
        current_hour = 9

    current_dt = datetime.combine(current_date, time(current_hour, 0))
    
    slots = []
    
    # We want 5 slots
    while len(slots) < 5:
        slot_date = current_dt.date()
        slot_start = current_dt.time()
        slot_end = (current_dt + timedelta(hours=1)).time()
        
        # Check if the slot exceeds working hours (last slot starts at 4 PM, ends at 5 PM)
        if slot_end > work_end:
            # Move to next day 9 AM
            current_dt = datetime.combine(slot_date + timedelta(days=1), work_start)
            continue
            
        # Check overlap in interview_schedule
        overlap_schedule = db.query(InterviewSchedule).filter(
            InterviewSchedule.date == slot_date,
            InterviewSchedule.interview_status != "cancelled",
            InterviewSchedule.start_time < slot_end,
            InterviewSchedule.end_time > slot_start
        ).first()
        
        # Check overlap in interview_tasks
        overlap_task = db.query(InterviewTask).filter(
            InterviewTask.slot_date == slot_date,
            InterviewTask.status != "failed",
            InterviewTask.start_time < slot_end,
            InterviewTask.end_time > slot_start
        ).first()
        
        if overlap_schedule or overlap_task:
            # Slot is occupied, advance current_dt by 1 hour and search next slot
            current_dt = current_dt + timedelta(hours=1)
        else:
            # Slot is free!
            slots.append({
                "date": slot_date,
                "start_time": slot_start,
                "end_time": slot_end
            })
            current_dt = current_dt + timedelta(hours=1)
            
    return slots


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

        # Step 3: Find available slot (uses IST)
        IST = ZoneInfo('Asia/Kolkata')
        now_ist = datetime.now(IST)
        target_date = now_ist.date()
        slot = find_available_slot(db, target_date)

        if not slot:
            # Try tomorrow
            target_date = now_ist.date() + timedelta(days=1)
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
        # Update candidate application status to "Scheduled"
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == data.candidate_id,
            CandidateApplication.role_id == data.job_id,
            CandidateApplication.status == "Applied"
        ).first()
        if application:
            application.status = "Scheduled"
            db.add(application)
            db.commit()

            try:
                NotificationService.create_activity_and_notify(
                    db=db,
                    candidate_id=candidate.id,
                    user_id=candidate.user_id,
                    activity_type=ActivityType.INTERVIEW_SCHEDULED,
                    activity_title=f"Interview scheduled for {application.role.title if application.role else 'your role'}",
                    notification_title="Interview Scheduled",
                    notification_message=f"Your interview has been scheduled for {target_date} from {start_time} to {end_time}.",
                    reference_id=application.id,
                    notification_type=NotificationType.SUCCESS,
                    icon="calendar",
                    priority="high",
                    redirect_url=f"/applications/{application.id}"
                )
            except Exception as notif_error:
                print(f"Failed to create notification: {notif_error}")

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


# ============ Candidate Management ============

class CandidateAdminDetail(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = ""
    role: str
    status: str
    interviewDate: Optional[str] = None
    interviewTime: Optional[str] = None
    mode: str
    panelId: Optional[str] = ""
    panelGroupId: Optional[str] = ""
    profileComplete: int
    avatar: str
    skills: List[str]
    experience: str
    education: str
    resumeUrl: Optional[str] = None
    meetLink: Optional[str] = None
    venue: Optional[str] = None
    appliedDate: str


class UpdateCandidateStatusRequest(BaseModel):
    status: str


class ReassignCandidatePanelRequest(BaseModel):
    panel_id: str
    panel_group_id: str


class RescheduleInterviewRequest(BaseModel):
    date: str
    time: str


class SchedulePanelInterviewRequest(BaseModel):
    task_id: int


@router.get("/candidates", response_model=List[CandidateAdminDetail])
def get_admin_candidates():
    db = SessionLocal()
    try:
        candidates = db.query(Candidate).all()
        result = []
        for c in candidates:
            # 1. Fetch latest application
            application = db.query(CandidateApplication).filter(
                CandidateApplication.candidate_id == c.id
            ).order_by(CandidateApplication.created_at.desc()).first()
            
            role_title = "No Applied Role"
            app_status = c.status
            applied_date_str = c.created_at.isoformat() if c.created_at else datetime.utcnow().isoformat()
            job_type = "Online"
            venue = None
            job_id = None
            
            if application:
                role_title = application.role.title if application.role else "Unknown Role"
                app_status = application.status
                applied_date_str = application.created_at.isoformat()
                job_type = application.role.job_type if application.role else "Online"
                venue = application.role.venue if application.role else None
                job_id = application.role_id

            # 2. Fetch latest interview schedule
            sched_query = db.query(InterviewSchedule).filter(
                InterviewSchedule.candidate_id == c.id
            )
            if job_id:
                sched_query = sched_query.filter(InterviewSchedule.job_id == job_id)
            schedule = sched_query.order_by(InterviewSchedule.created_at.desc()).first()

            interview_date = None
            interview_time = None
            meet_link = None
            
            if schedule:
                interview_date = schedule.date.isoformat() if schedule.date else None
                if schedule.start_time and schedule.end_time:
                    start_str = schedule.start_time.strftime("%I:%M %p")
                    end_str = schedule.end_time.strftime("%I:%M %p")
                    interview_time = f"{start_str} - {end_str}"
                elif schedule.start_time:
                    interview_time = schedule.start_time.strftime("%I:%M %p")
                meet_link = schedule.gmeet_link

            # 3. Calculate profileComplete
            profile_pct = 60
            if c.phone:
                profile_pct += 10
            if c.resume_path:
                profile_pct += 10
            if c.education_list:
                profile_pct += 10
            if c.experience_list:
                profile_pct += 10
            if profile_pct > 100:
                profile_pct = 100

            # 4. Format skills
            skills_list = [s.strip() for s in c.skills.split(",") if s.strip()] if c.skills else []

            # 5. Format experience summary
            exp_str = "No experience listed"
            if c.experience_list:
                latest_exp = c.experience_list[0]
                exp_str = f"{latest_exp.years_experience} years as {latest_exp.current_role} at {latest_exp.company}"

            # 6. Format education summary
            edu_str = "No education listed"
            if c.education_list:
                latest_edu = c.education_list[0]
                edu_str = f"{latest_edu.degree} from {latest_edu.university} (Class of {latest_edu.graduation_year})"

            # 7. Resume URL
            resume_url = None
            if c.resume_path:
                if c.resume_path.startswith("http"):
                    resume_url = c.resume_path
                else:
                    resume_url = f"http://localhost:8189{c.resume_path}"

            avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={c.id}"

            result.append(
                CandidateAdminDetail(
                    id=str(c.id),
                    name=c.full_name,
                    email=c.email,
                    phone=c.phone or "",
                    role=role_title,
                    status=app_status,
                    interviewDate=interview_date,
                    interviewTime=interview_time,
                    mode=job_type,
                    panelId=c.panel_id or "",
                    panelGroupId=c.panel_group_id or "",
                    profileComplete=profile_pct,
                    avatar=avatar_url,
                    skills=skills_list,
                    experience=exp_str,
                    education=edu_str,
                    resumeUrl=resume_url,
                    meetLink=meet_link,
                    venue=venue,
                    appliedDate=applied_date_str
                )
            )
        return result
    finally:
        db.close()


@router.put("/candidates/{candidate_id}/status")
def update_candidate_status(candidate_id: int, data: UpdateCandidateStatusRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        # Check if status is updated to "Selected" (approved)
        if data.status == "Selected":
            existing_tasks_count = db.query(InterviewTask).filter(
                InterviewTask.candidate_id == candidate_id,
                InterviewTask.status != "failed"
            ).count()
            
            if existing_tasks_count == 0:
                panels = db.query(Panel).order_by(Panel.id).all()
                if len(panels) < 5:
                    raise HTTPException(status_code=400, detail="Fewer than 5 panels registered in the database.")
                
                slots = find_5_available_slots(db)
                
                for i in range(5):
                    task = InterviewTask(
                        candidate_id=candidate_id,
                        panel_id=panels[i].id,
                        slot_date=slots[i]["date"],
                        start_time=slots[i]["start_time"],
                        end_time=slots[i]["end_time"],
                        status="pending"
                    )
                    db.add(task)
        
        # Update candidate status
        candidate.status = data.status
        db.add(candidate)
        
        # Also update latest application status
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate_id
        ).order_by(CandidateApplication.created_at.desc()).first()
        
        if application:
            application.status = data.status
            db.add(application)
            
            try:
                NotificationService.create_activity_and_notify(
                    db=db,
                    candidate_id=candidate.id,
                    user_id=candidate.user_id,
                    activity_type=ActivityType.PROFILE_UPDATED,
                    activity_title=f"Application status updated to {data.status}",
                    notification_title="Application Status Updated",
                    notification_message=f"Your application status for {application.role.title if application.role else 'your role'} has been updated to {data.status}.",
                    reference_id=application.id,
                    notification_type=NotificationType.INFO,
                    icon="info",
                    priority="medium",
                    redirect_url=f"/profile"
                )
            except Exception as notif_error:
                print(f"Failed to create notification: {notif_error}")
        
        db.commit()

        if data.status == "Selected":
            try:
                from app.workers.tasks import process_panel_tasks
                process_panel_tasks.delay(candidate_id)
            except Exception as celery_err:
                print(f"Failed to trigger Celery process_panel_tasks task: {celery_err}")

        return {"status": "success", "message": f"Candidate status updated to {data.status}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.post("/schedule-panel-interview")
def schedule_panel_interview(data: SchedulePanelInterviewRequest):
    db = SessionLocal()
    task = None
    try:
        # 1. Fetch the task
        task = db.query(InterviewTask).filter(InterviewTask.id == data.task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Interview task not found")
            
        if task.status in ["completed", "processing"]:
            return {"status": "success", "message": f"Task already {task.status}"}
            
        # 2. Set task status to processing
        task.status = "processing"
        db.add(task)
        db.commit()
        
        # 3. Fetch candidate, panel, job role
        candidate = db.query(Candidate).filter(Candidate.id == task.candidate_id).first()
        panel = db.query(Panel).filter(Panel.id == task.panel_id).first()
        
        if not candidate:
            task.status = "failed"
            db.add(task)
            db.commit()
            raise HTTPException(status_code=400, detail="Candidate not found for task")
            
        if not panel:
            task.status = "failed"
            db.add(task)
            db.commit()
            raise HTTPException(status_code=400, detail="Panel not found for task")

        # Get role ID from candidate application
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == task.candidate_id
        ).order_by(CandidateApplication.created_at.desc()).first()
        
        job_role_title = "Selected Role"
        job_id = None
        if application:
            job_id = application.role_id
            if application.role:
                job_role_title = application.role.title

        # 4. Insert schedule in interview_schedule table
        schedule = InterviewSchedule(
            candidate_id=task.candidate_id,
            job_id=job_id,
            date=task.slot_date,
            start_time=task.start_time,
            end_time=task.end_time,
            interview_status="pending"
        )
        db.add(schedule)
        db.commit()
        db.refresh(schedule)

        # 5. Fetch Google Meet link from n8n webhook (or fallback)
        N8N_WEBHOOK_URL = "http://localhost:5678/webhook/schedule-interview"
        payload = {
            "candidate_name": candidate.full_name,
            "email": candidate.email,
            "job_role": job_role_title,
            "date": task.slot_date.isoformat(),
            "start_time": task.start_time.isoformat(),
            "end_time": task.end_time.isoformat()
        }
        
        meet_link = None
        try:
            import requests
            response = requests.post(N8N_WEBHOOK_URL, json=payload, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list):
                    event_data = result[0] if result else {}
                else:
                    event_data = result
                meet_link = event_data.get("hangoutLink")
        except Exception as n8n_err:
            print(f"n8n scheduling failed: {n8n_err}")

        # Fallback to mock link if n8n failed/no meet_link returned
        if not meet_link:
            meet_link = f"https://meet.google.com/mock-{candidate.id}-{task.panel_id}"

        # 6. Update schedule with meet link
        schedule.gmeet_link = meet_link
        schedule.interview_status = "scheduled"
        db.add(schedule)
        
        # Update candidate application status and candidate status to "Scheduled"
        if application:
            application.status = "Scheduled"
            db.add(application)
        candidate.status = "Scheduled"
        db.add(candidate)
        
        # 7. Create notification for candidate
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=candidate.user_id,
                activity_type=ActivityType.INTERVIEW_SCHEDULED,
                activity_title=f"Panel Interview Scheduled",
                notification_title="Interview Scheduled",
                notification_message=(
                    f"Your panel interview (Panel: {panel.hr_panelists_name}) has been scheduled "
                    f"for {task.slot_date} at {task.start_time.strftime('%I:%M %p')} IST."
                ),
                reference_id=application.id if application else None,
                notification_type=NotificationType.SUCCESS,
                icon="calendar",
                priority="high",
                redirect_url="/profile"
            )
        except Exception as notif_err:
            print(f"Failed to create notification: {notif_err}")

        # 8. Send email notifications
        from app.services.email_service import send_email
        email_body_candidate = (
            f"Dear {candidate.full_name},\n\n"
            f"Your interview for the {job_role_title} role with Panelist {panel.hr_panelists_name} "
            f"has been scheduled successfully.\n\n"
            f"Date: {task.slot_date}\n"
            f"Time: {task.start_time.strftime('%I:%M %p')} - {task.end_time.strftime('%I:%M %p')} IST\n"
            f"Google Meet Link: {meet_link}\n\n"
            f"Best Regards,\n"
            f"Recruitment Team"
        )
        email_body_panelist = (
            f"Dear {panel.hr_panelists_name},\n\n"
            f"You have been assigned to interview candidate {candidate.full_name} for the {job_role_title} role.\n\n"
            f"Date: {task.slot_date}\n"
            f"Time: {task.start_time.strftime('%I:%M %p')} - {task.end_time.strftime('%I:%M %p')} IST\n"
            f"Google Meet Link: {meet_link}\n\n"
            f"Please join on time.\n\n"
            f"Best Regards,\n"
            f"Recruitment Team"
        )
        
        # Send to candidate
        try:
            send_email(candidate.email, "Interview Scheduled", email_body_candidate)
        except Exception as e:
            print(f"Failed to send email to candidate: {e}")
            
        # Send to panelist (mock panelist email, e.g. panel.hr_panelist_emp_id + "@example.com")
        panelist_email = f"panel_{panel.hr_panelist_emp_id}@example.com"
        try:
            send_email(panelist_email, "Interview Panel Assignment", email_body_panelist)
        except Exception as e:
            print(f"Failed to send email to panelist: {e}")

        # 9. Mark task as completed
        task.status = "completed"
        db.add(task)
        db.commit()
        
        return {"status": "success", "message": "Interview scheduled successfully"}
        
    except Exception as e:
        db.rollback()
        # Mark task as failed if error occurs
        try:
            if task:
                task.status = "failed"
                db.add(task)
                db.commit()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.put("/candidates/{candidate_id}/reassign")
def reassign_candidate_panel(candidate_id: int, data: ReassignCandidatePanelRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        candidate.panel_id = data.panel_id
        candidate.panel_group_id = data.panel_group_id
        db.add(candidate)
        
        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=candidate.user_id,
                activity_type=ActivityType.PROFILE_UPDATED,
                activity_title="Interview Panel Assigned",
                notification_title="Panel Assigned",
                notification_message="An interview panel group and category have been assigned to you.",
                reference_id=None,
                notification_type=NotificationType.INFO,
                icon="users",
                priority="medium",
                redirect_url=f"/profile"
            )
        except Exception as notif_error:
            print(f"Failed to create notification: {notif_error}")
            
        db.commit()
        return {"status": "success", "message": "Candidate panel reassigned successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.put("/candidates/{candidate_id}/reschedule")
def reschedule_interview(candidate_id: int, data: RescheduleInterviewRequest):
    db = SessionLocal()
    try:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        try:
            target_date = datetime.strptime(data.date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Expected YYYY-MM-DD")
            
        try:
            target_time = datetime.strptime(data.time.split()[0], "%H:%M").time()
        except ValueError:
            try:
                target_time = datetime.strptime(data.time.split()[0], "%H:%M:%S").time()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid time format. Expected HH:MM")

        schedule = db.query(InterviewSchedule).filter(
            InterviewSchedule.candidate_id == candidate_id,
            InterviewSchedule.interview_status != "cancelled"
        ).order_by(InterviewSchedule.created_at.desc()).first()

        job_id = None
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate_id
        ).order_by(CandidateApplication.created_at.desc()).first()
        if application:
            job_id = application.role_id
            
        slot_duration = timedelta(hours=1)
        end_time = (datetime.combine(target_date, target_time) + slot_duration).time()

        if schedule:
            schedule.date = target_date
            schedule.start_time = target_time
            schedule.end_time = end_time
            schedule.interview_status = "pending"
            db.add(schedule)
        else:
            schedule = InterviewSchedule(
                candidate_id=candidate_id,
                job_id=job_id,
                date=target_date,
                start_time=target_time,
                end_time=end_time,
                interview_status="pending"
            )
            db.add(schedule)
        
        db.commit()
        db.refresh(schedule)

        if application and application.status != "Scheduled":
            application.status = "Scheduled"
            db.add(application)
            db.commit()

        if candidate.status != "Scheduled":
            candidate.status = "Scheduled"
            db.add(candidate)
            db.commit()

        try:
            NotificationService.create_activity_and_notify(
                db=db,
                candidate_id=candidate.id,
                user_id=candidate.user_id,
                activity_type=ActivityType.INTERVIEW_SCHEDULED,
                activity_title=f"Interview rescheduled for {application.role.title if application and application.role else 'your role'}",
                notification_title="Interview Rescheduled",
                notification_message=f"Your interview has been rescheduled for {target_date} at {target_time.strftime('%I:%M %p')}.",
                reference_id=application.id if application else None,
                notification_type=NotificationType.SUCCESS,
                icon="calendar",
                priority="high",
                redirect_url=f"/profile"
            )
        except Exception as notif_error:
            print(f"Failed to create notification: {notif_error}")

        schedule_interview_task.delay(schedule.id, candidate.id)

        return {
            "status": "success",
            "message": f"Interview rescheduled to {target_date} {target_time}. n8n will generate Google Meet link.",
            "schedule_id": schedule.id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# ============ Roles Management ============

class AdminJobRoleResponse(BaseModel):
    id: str
    title: str
    location: str
    experience: str
    totalVacancy: int
    jobType: str
    venue: Optional[str] = None
    description: Optional[str] = None
    createdAt: str
    isVisible: bool


class CreateJobRoleRequest(BaseModel):
    title: str
    location: str
    experience: str
    totalVacancy: int
    jobType: str
    venue: Optional[str] = None
    description: Optional[str] = None


class ToggleVisibilityRequest(BaseModel):
    is_visible: bool


@router.get("/roles", response_model=List[AdminJobRoleResponse])
def get_admin_roles():
    db = SessionLocal()
    try:
        roles = db.query(JobRole).order_by(JobRole.id.desc()).all()
        result = []
        for r in roles:
            created_str = r.created_at.strftime("%Y-%m-%d") if r.created_at else datetime.utcnow().strftime("%Y-%m-%d")
            result.append(
                AdminJobRoleResponse(
                    id=str(r.id),
                    title=r.title,
                    location=r.location,
                    experience=r.experience,
                    totalVacancy=r.total_vacancy,
                    jobType=r.job_type,
                    venue=r.venue,
                    description=r.description,
                    createdAt=created_str,
                    isVisible=r.is_visible
                )
            )
        return result
    finally:
        db.close()


@router.post("/roles")
def create_job_role(data: CreateJobRoleRequest):
    db = SessionLocal()
    try:
        role = JobRole(
            title=data.title,
            location=data.location,
            experience=data.experience,
            total_vacancy=data.totalVacancy,
            job_type=data.jobType,
            venue=data.venue,
            description=data.description,
            is_visible=True
        )
        db.add(role)
        db.commit()
        db.refresh(role)
        return {
            "status": "success",
            "message": "Job role created successfully",
            "role_id": role.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.put("/roles/{role_id}/visibility")
def toggle_job_role_visibility(role_id: int, data: ToggleVisibilityRequest):
    db = SessionLocal()
    try:
        role = db.query(JobRole).filter(JobRole.id == role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Job role not found")
        
        role.is_visible = data.is_visible
        db.add(role)
        db.commit()
        
        status_text = "visible" if data.is_visible else "hidden"
        return {
            "status": "success",
            "message": f"Job role visibility updated to {status_text}"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.delete("/roles/{role_id}")
def delete_job_role(role_id: int):
    db = SessionLocal()
    try:
        role = db.query(JobRole).filter(JobRole.id == role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Job role not found")
        
        # Soft delete: set visibility to False to avoid foreign key issues
        role.is_visible = False
        db.add(role)
        db.commit()
        return {
            "status": "success",
            "message": "Job role deactivated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
