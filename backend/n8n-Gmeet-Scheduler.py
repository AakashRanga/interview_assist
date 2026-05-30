
import requests

data = {
    "candidate_name": "Akash Ranga",
    "email": "akash@gmail.com",
    "job_role": "Backend Developer",
    "start_time": "2026-05-29T10:00:00+05:30",
    "end_time": "2026-05-29T11:00:00+05:30"
}

response = requests.post(
    "http://localhost:5678/webhook/schedule-interview",
    json=data
)

print(response.json())

