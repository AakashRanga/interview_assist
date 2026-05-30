from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import datetime

def create_google_meet():

    creds = Credentials.from_authorized_user_file(
        "token.json"
    )

    service = build(
        "calendar",
        "v3",
        credentials=creds
    )

    event = {
        'summary': 'Technical Interview',
        'start': {
            'dateTime': '2026-05-28T10:00:00',
            'timeZone': 'Asia/Kolkata',
        },
        'end': {
            'dateTime': '2026-05-28T11:00:00',
            'timeZone': 'Asia/Kolkata',
        },
        'conferenceData': {
            'createRequest': {
                'requestId': 'random-string'
            }
        },
    }

    event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1
    ).execute()

    return event['hangoutLink']