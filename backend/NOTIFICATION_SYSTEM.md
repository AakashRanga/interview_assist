# Candidate Notification System

## Overview

The notification system tracks candidate activities and sends real-time notifications. It consists of:

1. **CandidateActivity** - Records candidate actions (profile updates, uploads, applications)
2. **Notification** - User-facing notifications with read status tracking
3. **NotificationService** - Business logic for creating activities and notifications
4. **API Routes** - Endpoints for fetching and managing notifications

---

## Database Tables

### candidate_activities
Stores all activities performed by candidates.

```sql
CREATE TABLE candidate_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    user_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    reference_id INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    activity_metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidate (candidate_id),
    INDEX idx_user (user_id),
    INDEX idx_activity_type (activity_type)
);
```

### notifications
User notifications with read/unread status tracking.

```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    candidate_id INT NULL,
    activity_id INT NULL,
    notification_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    icon VARCHAR(100) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    priority ENUM('low','medium','high') DEFAULT 'medium',
    redirect_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES candidate_activities(id) ON DELETE SET NULL,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
);
```

---

## Activity Types

All supported activity types in the system:

- **PROFILE_UPDATED** - Candidate updated their profile
- **RESUME_UPLOADED** - Candidate uploaded a resume
- **INTERVIEW_SCHEDULED** - Interview was scheduled
- **MEET_LINK_GENERATED** - Google Meet link was generated
- **APPLICATION_SUBMITTED** - Candidate submitted an application
- **APPLICATION_APPROVED** - Application was approved
- **APPLICATION_REJECTED** - Application was rejected
- **PROFILE_VIEWED** - Admin/Panel viewed candidate profile
- **CERTIFICATE_UPLOADED** - Candidate uploaded a certificate
- **ASSESSMENT_COMPLETED** - Candidate completed an assessment

---

## API Endpoints

### Get Notifications
Fetch notifications for a user with pagination.

```
GET /user/{user_id}/notifications?limit=20&offset=0&unread_only=false
```

**Query Parameters:**
- `limit` (int, default=20, max=100) - Number of notifications per page
- `offset` (int, default=0) - Pagination offset
- `unread_only` (bool, default=false) - Only fetch unread notifications

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "candidate_id": 3,
      "activity_id": 10,
      "notification_type": "SUCCESS",
      "title": "Application Submitted",
      "message": "Your application for Senior Frontend Engineer has been submitted successfully.",
      "icon": "send",
      "is_read": false,
      "read_at": null,
      "priority": "high",
      "redirect_url": "/applications/1",
      "created_at": "2026-06-02T10:30:00"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "remaining": 0
  }
}
```

---

### Get Notification Counts
Get unread and total notification counts for a user.

```
GET /user/{user_id}/notifications/unread-count
```

**Response:**
```json
{
  "unread_count": 3,
  "total_count": 15
}
```

---

### Mark Notification as Read
Mark a single notification as read.

```
PUT /notifications/{notification_id}/read
```

**Response:**
```json
{
  "status": "success",
  "message": "Notification marked as read",
  "data": {
    "id": 1,
    "is_read": true,
    "read_at": "2026-06-02T10:35:00",
    ...
  }
}
```

---

### Mark All Notifications as Read
Mark all unread notifications as read for a user.

```
PUT /user/{user_id}/notifications/mark-all-read
```

**Response:**
```json
{
  "status": "success",
  "message": "Marked 3 notifications as read",
  "count": 3
}
```

---

### Delete Notification
Delete a notification.

```
DELETE /notifications/{notification_id}
```

**Response:**
```json
{
  "status": "success",
  "message": "Notification deleted"
}
```

---

### Get Candidate Activities
Fetch activity history for a candidate.

```
GET /candidate/{candidate_id}/activities?limit=50&offset=0
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "candidate_id": 3,
      "user_id": 5,
      "activity_type": "APPLICATION_SUBMITTED",
      "reference_id": 1,
      "title": "Applied for Senior Frontend Engineer",
      "description": null,
      "activity_metadata": {...},
      "created_at": "2026-06-02T10:30:00"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 50,
    "offset": 0
  }
}
```

---

## Usage Examples

### Python - Create Activity and Notification

```python
from app.services.notification_service import NotificationService
from app.database import SessionLocal

db = SessionLocal()

# Create activity and notification together
activity, notification = NotificationService.create_activity_and_notify(
    db=db,
    candidate_id=3,
    user_id=5,
    activity_type="RESUME_UPLOADED",
    activity_title="Resume Uploaded",
    notification_title="Resume Uploaded",
    notification_message="Your resume has been successfully uploaded.",
    notification_type="SUCCESS",
    icon="upload",
    priority="medium",
    redirect_url="/profile"
)

db.close()
```

### JavaScript/TypeScript - Frontend Integration

```typescript
// Get notifications
async function getNotifications(userId: number) {
  const response = await fetch(
    `http://localhost:8000/user/${userId}/notifications?limit=20`
  );
  const data = await response.json();
  return data.data;
}

// Get unread count
async function getUnreadCount(userId: number) {
  const response = await fetch(
    `http://localhost:8000/user/${userId}/notifications/unread-count`
  );
  const data = await response.json();
  return data.unread_count;
}

// Mark as read
async function markAsRead(notificationId: number) {
  const response = await fetch(
    `http://localhost:8000/notifications/${notificationId}/read`,
    { method: 'PUT' }
  );
  return await response.json();
}

// Mark all as read
async function markAllAsRead(userId: number) {
  const response = await fetch(
    `http://localhost:8000/user/${userId}/notifications/mark-all-read`,
    { method: 'PUT' }
  );
  return await response.json();
}

// Poll for notifications (simple approach)
setInterval(async () => {
  const count = await getUnreadCount(userId);
  updateNotificationBadge(count);
}, 5000); // Poll every 5 seconds
```

---

## Automatic Notification Triggers

Notifications are automatically created when:

1. **Resume Upload** - `POST /candidate/user/{user_id}/upload-document`
   - Activity Type: `RESUME_UPLOADED`
   - Notification: ✅ Success

2. **Certificate Upload** - `POST /candidate/user/{user_id}/upload-document`
   - Activity Type: `CERTIFICATE_UPLOADED`
   - Notification: ✅ Success

3. **Profile Update** - `PUT /candidate/user/{user_id}/profile`
   - Activity Type: `PROFILE_UPDATED`
   - Notification: ✅ Success

4. **Application Submission** - `POST /candidate/user/{user_id}/apply`
   - Activity Type: `APPLICATION_SUBMITTED`
   - Notification: ✅ Success

---

## Frontend Implementation

### CandidateNotifications Component

```typescript
import { useEffect, useState } from 'react';

export function CandidateNotifications({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();
    
    // Poll for new notifications every 5 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      getUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    const response = await fetch(
      `http://localhost:8000/user/${userId}/notifications?limit=20`
    );
    const data = await response.json();
    setNotifications(data.data);
  };

  const getUnreadCount = async () => {
    const response = await fetch(
      `http://localhost:8000/user/${userId}/notifications/unread-count`
    );
    const data = await response.json();
    setUnreadCount(data.unread_count);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await fetch(
      `http://localhost:8000/notifications/${notificationId}/read`,
      { method: 'PUT' }
    );
    fetchNotifications();
    getUnreadCount();
  };

  return (
    <div className="notifications">
      <h3>
        Notifications ({unreadCount} unread)
      </h3>
      <div className="notification-list">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.is_read ? 'read' : 'unread'}`}>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
            <small>{new Date(notif.created_at).toLocaleString()}</small>
            {!notif.is_read && (
              <button onClick={() => handleMarkAsRead(notif.id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Migration Guide

If you're upgrading from a system without notifications:

1. **Database**: Tables are auto-created by SQLAlchemy when the app starts
2. **Import Models**: Add notification models to main.py
3. **Import Routes**: Add notification routes to main.py
4. **Restart Server**: Run `uvicorn app.main:app --reload`
5. **Frontend**: Implement notification UI and polling/WebSocket

---

## Future Enhancements

- [ ] WebSocket support for real-time notifications
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard for notification management
- [ ] Notification scheduling (send at specific times)
- [ ] Notification preferences per user
- [ ] Bulk notification creation
- [ ] Notification history cleanup (archive old notifications)
