import requests

data = {
    "candidate_name": "dhatchu",
    "email": "dhatchu1810@gmail.com",
    "job_role": "Backend Developer"
}

response = requests.post(
    "http://localhost:5678/webhook-test/schedule-interview",
    json=data
)

print(response.json())