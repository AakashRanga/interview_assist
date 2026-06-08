import requests
from celery_worker import celery
from app.database import SessionLocal
from app.models.candidate import Candidate
from app.models.candidate_application import CandidateApplication
from app.models.job_role import JobRole
from app.models.interview_schedule import InterviewSchedule
from datetime import datetime, date, time, timedelta

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/schedule-interview"


@celery.task
def process_resume(candidate_id):
    db = SessionLocal()

    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    print("Processing Resume:", candidate.name)

    candidate.status = "processed"

    db.commit()

    return True




@celery.task
def schedule_interview_task(schedule_id, candidate_id):

    db = SessionLocal()

    try:

        # ============================================
        # GET CANDIDATE
        # ============================================

        candidate = db.query(Candidate).filter(
            Candidate.id == candidate_id
        ).first()

        if not candidate:
            return {
                "status": "error",
                "message": "Candidate not found"
            }

        print(
            f"Calling n8n for candidate: "
            f"{candidate.full_name}, "
            f"email: {candidate.email}"
        )

        # ============================================
        # GET INTERVIEW SCHEDULE
        # ============================================

        schedule = db.query(InterviewSchedule).filter(
            InterviewSchedule.id == schedule_id
        ).first()

        if not schedule:
            return {
                "status": "error",
                "message": "Interview schedule not found"
            }

        # ============================================
        # GET JOB ROLE
        # ============================================

        job_role_title = " "

        if schedule.job_id:

            application = db.query(CandidateApplication).filter(
                CandidateApplication.candidate_id == candidate_id,
                CandidateApplication.role_id == schedule.job_id
            ).first()

            if application:

                job_role = db.query(JobRole).filter(
                    JobRole.id == schedule.job_id
                ).first()

                if job_role:
                    job_role_title = job_role.title

        # ============================================
        # PREPARE PAYLOAD FOR N8N
        # ============================================

        
        payload = {
            "candidate_name": candidate.full_name,
            "email": candidate.email,
            "job_role": job_role_title,
            "date": schedule.date.isoformat()
            if schedule.date else None,

            "start_time": schedule.start_time.isoformat()
            if schedule.start_time else None,

            "end_time": schedule.end_time.isoformat()
            if schedule.end_time else None
        }


        print("Sending payload to n8n:")
        print(payload)

        # ============================================
        # CALL N8N WEBHOOK
        # ============================================

        response = requests.post(
            N8N_WEBHOOK_URL,
            json=payload,
            timeout=60
        )

        print(f"n8n response status: {response.status_code}")
        print(f"n8n response text: {response.text}")

        # ============================================
        # CHECK STATUS CODE
        # ============================================

        if response.status_code != 200:

            schedule.interview_status = "failed"
            db.commit()

            return {
                "status": "error",
                "message": f"n8n returned status {response.status_code}"
            }

        # ============================================
        # PARSE JSON RESPONSE
        # ============================================

        try:
            result = response.json()

        except Exception:

            schedule.interview_status = "failed"
            db.commit()

            return {
                "status": "error",
                "message": (
                    f"Invalid JSON from n8n: "
                    f"{response.text[:200]}"
                )
            }

        print("Parsed n8n response:")
        print(result)

        # ============================================
        # GET GOOGLE MEET LINK
        # ============================================

        # Handle both array and object responses from n8n
        if isinstance(result, list):
            # n8n returns an array like [{...}]
            event_data = result[0] if result else {}
        else:
            event_data = result

        meet_link = event_data.get("hangoutLink")

        if not meet_link:

            schedule.interview_status = "failed"
            db.commit()

            return {
                "status": "error",
                "message": (
                    f"No hangoutLink found in response: {result}"
                )
            }

        # ============================================
        # UPDATE DATABASE
        # ============================================

        schedule.gmeet_link = meet_link
        schedule.interview_status = "scheduled"

        # Also update candidate_applications status to "Scheduled"
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate_id,
            CandidateApplication.role_id == schedule.job_id
        ).first()

        if application:
            application.status = "Scheduled"

        db.commit()

        print(
            f"Successfully scheduled interview: "
            f"{meet_link}"
        )

        # ============================================
        # SUCCESS RESPONSE
        # ============================================

        return {
            "status": "success",
            "meet_link": meet_link
        }

    # ============================================
    # TIMEOUT ERROR
    # ============================================

    except requests.exceptions.Timeout:

        print("n8n request timed out")

        schedule = db.query(InterviewSchedule).filter(
            InterviewSchedule.id == schedule_id
        ).first()

        if schedule:
            schedule.interview_status = "failed"
            db.commit()

        return {
            "status": "error",
            "message": "n8n request timed out"
        }

    # ============================================
    # GENERAL ERROR
    # ============================================

    except Exception as e:

        print(f"Error in schedule_interview_task: {str(e)}")

        schedule = db.query(InterviewSchedule).filter(
            InterviewSchedule.id == schedule_id
        ).first()

        if schedule:
            schedule.interview_status = "failed"
            db.commit()

        return {
            "status": "error",
            "message": str(e)
        }

    # ============================================
    # CLOSE DATABASE
    # ============================================

    finally:
        db.close()


@celery.task
def process_panel_tasks(candidate_id):
    from app.models.interview_task import InterviewTask
    db = SessionLocal()
    try:
        tasks = db.query(InterviewTask).filter(
            InterviewTask.candidate_id == candidate_id,
            InterviewTask.status == "pending"
        ).order_by(InterviewTask.id).all()
        
        for task in tasks:
            print(f"Processing panel interview task ID {task.id} for candidate {candidate_id}")
            url = "http://127.0.0.1:8000/admin/schedule-panel-interview"
            try:
                response = requests.post(url, json={"task_id": task.id}, timeout=30)
                if response.status_code != 200:
                    print(f"Failed to process task {task.id}: status {response.status_code}")
                    break
                
                result = response.json()
                if result.get("status") != "success":
                    print(f"Task {task.id} failed response: {result}")
                    break
            except Exception as req_err:
                print(f"HTTP request error for task {task.id}: {req_err}")
                break
    finally:
        db.close()
    return True



        