from celery import Celery
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")

celery = Celery(
    "worker",
    broker=f"redis://{REDIS_HOST}:{REDIS_PORT}/0",
    backend=f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
)

# Import all models to register them with SQLAlchemy
from app.models.user import User
from app.models.candidate import Candidate
from app.models.candidate_application import CandidateApplication
from app.models.job_role import JobRole
from app.models.interview_schedule import InterviewSchedule

# Import tasks to register them with Celery
from app.workers import tasks

celery.conf.task_routes = {
    "workers.tasks.*": {"queue": "resume_queue"}
}