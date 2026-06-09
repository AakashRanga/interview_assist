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
        job_type = "Online"
        venue = None

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
                    job_type = job_role.job_type or "Online"
                    venue = job_role.venue

        is_offline = job_type and job_type.lower() == "offline"

        # For offline interviews, skip n8n and don't generate gmeet link
        if is_offline:
            schedule.interview_status = "scheduled"
            # Also update candidate_applications status to "Scheduled" if not Selected/Rejected
            if application and application.status not in ["Selected", "Rejected"]:
                application.status = "Scheduled"
            db.commit()
            return {
                "status": "skipped",
                "message": "Offline interview - no gmeet link needed"
            }

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

        meet_link = None
        try:
            response = requests.post(
                N8N_WEBHOOK_URL,
                json=payload,
                timeout=10
            )
            print(f"n8n response status: {response.status_code}")
            if response.status_code == 200:
                try:
                    result = response.json()
                    print("Parsed n8n response:")
                    print(result)
                    if isinstance(result, list):
                        event_data = result[0] if result else {}
                    else:
                        event_data = result
                    meet_link = event_data.get("hangoutLink")
                except Exception as parse_err:
                    print(f"Failed to parse n8n response: {parse_err}")
            else:
                print(f"n8n returned status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Error calling n8n: {str(e)}")

        # Only update if meet_link was successfully generated
        if meet_link:
            schedule.gmeet_link = meet_link
            schedule.interview_status = "scheduled"
        else:
            schedule.interview_status = "pending"
            print("No meet link generated - n8n may have failed")

        # Also update candidate_applications status to "Scheduled" if not Selected/Rejected
        application = db.query(CandidateApplication).filter(
            CandidateApplication.candidate_id == candidate_id,
            CandidateApplication.role_id == schedule.job_id
        ).first()

        if application and application.status not in ["Selected", "Rejected"]:
            application.status = "Scheduled"

        db.commit()

        # ============================================
        # RETRIEVE PANEL AND DISPATCH EMAILS
        # ============================================
        panel = None
        if schedule.panel_id:
            from app.models.panel import Panel
            panel = db.query(Panel).filter(Panel.id == schedule.panel_id).first()

        panel_type = panel.interview_type if panel else "Interview"

        # Email details
        from app.services.email_service import send_email, SMTP_EMAIL, SMTP_PASSWORD
        smtp_configured = bool(SMTP_EMAIL and SMTP_PASSWORD)

        # Candidate Email
        candidate_subject = f"Interview Scheduled - {panel_type} Round"
        meet_link_info = f"Google Meet Link: {meet_link}\n\n" if meet_link else ""
        candidate_body = (
            f"Hi {candidate.full_name},\n\n"
            f"Your {panel_type} interview has been scheduled.\n"
            f"Date: {schedule.date}\n"
            f"Time: 11:00 AM - 12:00 PM IST\n"
            f"{meet_link_info}"
            f"Best regards,\n"
            f"Recruitment Team"
        )

        if smtp_configured:
            try:
                print(f"Sending email to candidate: {candidate.email}")
                send_email(candidate.email, candidate_subject, candidate_body)
            except Exception as email_err:
                print(f"Failed to send email to candidate: {str(email_err)}")
        else:
            print(f"SMTP not configured. Candidate Email Log:\nTo: {candidate.email}\nSubject: {candidate_subject}\nBody:\n{candidate_body}\n")

        # Panelist Email
        if panel:
            panelist_email = f"panel_{panel.hr_panelist_emp_id}@example.com" if panel.hr_panelist_emp_id else "panel@example.com"
            panelist_subject = f"Interview Assignment - {panel_type} Round - {candidate.full_name}"
            panelist_body = (
                f"Hi {panel.hr_panelists_name or 'Panelist'},\n\n"
                f"You have been assigned to conduct an interview.\n"
                f"Candidate: {candidate.full_name}\n"
                f"Round: {panel_type}\n"
                f"Date: {schedule.date}\n"
                f"Time: 11:00 AM - 12:00 PM IST\n"
                f"{meet_link_info}"
                f"Best regards,\n"
                f"Recruitment Team"
            )

            if smtp_configured:
                try:
                    print(f"Sending email to panelist: {panelist_email}")
                    send_email(panelist_email, panelist_subject, panelist_body)
                except Exception as email_err:
                    print(f"Failed to send email to panelist {panelist_email}: {str(email_err)}")
            else:
                print(f"SMTP not configured. Panelist Email Log:\nTo: {panelist_email}\nSubject: {panelist_subject}\nBody:\n{panelist_body}\n")

        print(
            f"Successfully scheduled interview: "
            f"{meet_link}"
        )

        # ============================================
        # SEND EMAIL NOTIFICATIONS
        # ============================================
        try:
            from app.models.panel import Panel
            from app.services.email_service import send_email
            
            panel = None
            if candidate.panel_id:
                # Try finding panel by ID or name
                panel = db.query(Panel).filter(Panel.id == candidate.panel_id).first()
                if not panel:
                    panel = db.query(Panel).filter(Panel.hr_panelists_name == candidate.panel_id).first()
                    
            if not panel:
                # Fallback to the first panel in database if candidate doesn't have one assigned
                panel = db.query(Panel).first()
                
            if panel:
                if is_offline:
                    location_info = f"Venue: {venue or 'TBD'}"
                    email_body_candidate = (
                        f"Dear {candidate.full_name},\n\n"
                        f"Your interview for the {job_role_title} role with Panelist {panel.hr_panelists_name} "
                        f"has been scheduled successfully.\n\n"
                        f"Date: {schedule.date}\n"
                        f"Time: {schedule.start_time.strftime('%I:%M %p')} - {schedule.end_time.strftime('%I:%M %p')} IST\n"
                        f"{location_info}\n\n"
                        f"Best Regards,\n"
                        f"Recruitment Team"
                    )
                    email_body_panelist = (
                        f"Dear {panel.hr_panelists_name},\n\n"
                        f"You have been assigned to interview candidate {candidate.full_name} for the {job_role_title} role.\n\n"
                        f"Date: {schedule.date}\n"
                        f"Time: {schedule.start_time.strftime('%I:%M %p')} - {schedule.end_time.strftime('%I:%M %p')} IST\n"
                        f"{location_info}\n\n"
                        f"Please be present at the venue.\n\n"
                        f"Best Regards,\n"
                        f"Recruitment Team"
                    )
                else:
                    meet_link_info = f"Google Meet Link: {meet_link}\n\n" if meet_link else ""
                    email_body_candidate = (
                        f"Dear {candidate.full_name},\n\n"
                        f"Your interview for the {job_role_title} role with Panelist {panel.hr_panelists_name} "
                        f"has been scheduled successfully.\n\n"
                        f"Date: {schedule.date}\n"
                        f"Time: {schedule.start_time.strftime('%I:%M %p')} - {schedule.end_time.strftime('%I:%M %p')} IST\n"
                        f"{meet_link_info}"
                        f"Best Regards,\n"
                        f"Recruitment Team"
                    )
                    email_body_panelist = (
                        f"Dear {panel.hr_panelists_name},\n\n"
                        f"You have been assigned to interview candidate {candidate.full_name} for the {job_role_title} role.\n\n"
                        f"Date: {schedule.date}\n"
                        f"Time: {schedule.start_time.strftime('%I:%M %p')} - {schedule.end_time.strftime('%I:%M %p')} IST\n"
                        f"{meet_link_info}"
                        f"Please join on time.\n\n"
                        f"Best Regards,\n"
                        f"Recruitment Team"
                    )
                
                # Send candidate email
                try:
                    send_email(candidate.email, "Interview Scheduled", email_body_candidate)
                    print(f"Sent scheduling email to candidate {candidate.email}")
                except Exception as email_err:
                    print(f"Failed to send email to candidate: {email_err}")
                
                # Send panelist email
                panelist_email = f"panel_{panel.hr_panelist_emp_id}@example.com"
                try:
                    send_email(panelist_email, "Interview Panel Assignment", email_body_panelist)
                    print(f"Sent scheduling email to panelist {panelist_email}")
                except Exception as email_err:
                    print(f"Failed to send email to panelist: {email_err}")
        except Exception as e:
            print(f"Failed to execute email notification flow: {e}")

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