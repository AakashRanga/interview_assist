from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import joinedload

from app.database import SessionLocal
from app.models.notification import Notification
from app.services.notification_service import NotificationService

router = APIRouter()


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    candidate_id: Optional[int] = None
    activity_id: Optional[int] = None
    notification_type: str
    title: str
    message: str
    icon: Optional[str] = None
    is_read: bool
    read_at: Optional[datetime] = None
    priority: str
    redirect_url: Optional[str] = None
    created_at: datetime


class NotificationCountResponse(BaseModel):
    unread_count: int
    total_count: int


@router.get("/user/{user_id}/notifications", response_model=dict)
def get_notifications(
    user_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    unread_only: bool = Query(False)
):
    """Get notifications for a user with pagination."""
    db = SessionLocal()
    try:
        notifications, total = NotificationService.get_notifications(
            db=db,
            user_id=user_id,
            limit=limit,
            offset=offset,
            unread_only=unread_only
        )
        
        return {
            "status": "success",
            "data": [
                NotificationResponse.model_validate(notif)
                for notif in notifications
            ],
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset,
                "remaining": max(0, total - (offset + limit))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/user/{user_id}/notifications/unread-count", response_model=NotificationCountResponse)
def get_notification_counts(user_id: int):
    """Get unread and total notification counts for a user."""
    db = SessionLocal()
    try:
        unread_count = NotificationService.get_unread_count(db=db, user_id=user_id)
        
        # Get total count
        total_count = db.query(Notification).filter(
            Notification.user_id == user_id
        ).count()
        
        return NotificationCountResponse(
            unread_count=unread_count,
            total_count=total_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.put("/notifications/{notification_id}/read")
def mark_notification_as_read(notification_id: int):
    """Mark a single notification as read."""
    db = SessionLocal()
    try:
        notification = NotificationService.mark_as_read(
            db=db,
            notification_id=notification_id
        )
        
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {
            "status": "success",
            "message": "Notification marked as read",
            "data": NotificationResponse.model_validate(notification)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.put("/user/{user_id}/notifications/mark-all-read")
def mark_all_notifications_as_read(user_id: int):
    """Mark all notifications as read for a user."""
    db = SessionLocal()
    try:
        count = NotificationService.mark_all_as_read(db=db, user_id=user_id)
        
        return {
            "status": "success",
            "message": f"Marked {count} notifications as read",
            "count": count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: int):
    """Delete a notification."""
    db = SessionLocal()
    try:
        success = NotificationService.delete_notification(
            db=db,
            notification_id=notification_id
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {
            "status": "success",
            "message": "Notification deleted"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/candidate/{candidate_id}/activities")
def get_candidate_activities(
    candidate_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get activities for a candidate."""
    from app.models.notification import CandidateActivity
    
    db = SessionLocal()
    try:
        total = db.query(CandidateActivity).filter(
            CandidateActivity.candidate_id == candidate_id
        ).count()
        
        activities = db.query(CandidateActivity).filter(
            CandidateActivity.candidate_id == candidate_id
        ).order_by(
            CandidateActivity.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return {
            "status": "success",
            "data": activities,
            "pagination": {
                "total": total,
                "limit": limit,
                "offset": offset
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
