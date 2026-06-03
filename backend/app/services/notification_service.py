from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.notification import (
    CandidateActivity, 
    Notification, 
    ActivityType, 
    NotificationType,
    PriorityLevel
)
from app.models.candidate import Candidate
from app.models.user import User


class NotificationService:
    """Service to handle creating activities and notifications for candidates."""

    @staticmethod
    def create_activity(
        db: Session,
        candidate_id: int,
        user_id: int,
        activity_type: str,
        title: str,
        description: Optional[str] = None,
        reference_id: Optional[int] = None,
        activity_metadata: Optional[Dict[str, Any]] = None
    ) -> CandidateActivity:
        """
        Create a candidate activity.
        
        Args:
            db: Database session
            candidate_id: ID of the candidate
            user_id: ID of the user who performed the action
            activity_type: Type of activity (from ActivityType enum)
            title: Activity title
            description: Optional description
            reference_id: Optional reference ID (e.g., application_id, interview_id)
            activity_metadata: Optional JSON metadata
        
        Returns:
            Created CandidateActivity object
        """
        activity = CandidateActivity(
            candidate_id=candidate_id,
            user_id=user_id,
            activity_type=activity_type,
            title=title,
            description=description,
            reference_id=reference_id,
            activity_metadata=activity_metadata
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "INFO",
        candidate_id: Optional[int] = None,
        activity_id: Optional[int] = None,
        icon: Optional[str] = None,
        priority: str = "medium",
        redirect_url: Optional[str] = None
    ) -> Notification:
        """
        Create a notification for a user.
        
        Args:
            db: Database session
            user_id: ID of the user to notify
            title: Notification title
            message: Notification message
            notification_type: Type of notification (INFO, SUCCESS, WARNING, ERROR)
            candidate_id: Optional candidate ID
            activity_id: Optional related activity ID
            icon: Optional icon name
            priority: Priority level (low, medium, high)
            redirect_url: Optional URL to redirect on click
        
        Returns:
            Created Notification object
        """
        notification = Notification(
            user_id=user_id,
            candidate_id=candidate_id,
            activity_id=activity_id,
            notification_type=notification_type,
            title=title,
            message=message,
            icon=icon,
            priority=priority,
            redirect_url=redirect_url
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def create_activity_and_notify(
        db: Session,
        candidate_id: int,
        user_id: int,
        activity_type: str,
        activity_title: str,
        notification_title: str,
        notification_message: str,
        description: Optional[str] = None,
        reference_id: Optional[int] = None,
        activity_metadata: Optional[Dict[str, Any]] = None,
        notification_type: str = "INFO",
        icon: Optional[str] = None,
        priority: str = "medium",
        redirect_url: Optional[str] = None
    ) -> tuple[CandidateActivity, Notification]:
        """
        Create both an activity and a notification together.
        
        Returns:
            Tuple of (CandidateActivity, Notification)
        """
        activity = NotificationService.create_activity(
            db=db,
            candidate_id=candidate_id,
            user_id=user_id,
            activity_type=activity_type,
            title=activity_title,
            description=description,
            reference_id=reference_id,
            activity_metadata=activity_metadata
        )
        
        notification = NotificationService.create_notification(
            db=db,
            user_id=user_id,
            candidate_id=candidate_id,
            activity_id=activity.id,
            title=notification_title,
            message=notification_message,
            notification_type=notification_type,
            icon=icon,
            priority=priority,
            redirect_url=redirect_url
        )
        
        return activity, notification

    @staticmethod
    def mark_as_read(db: Session, notification_id: int) -> Notification:
        """Mark a notification as read."""
        notification = db.query(Notification).filter(
            Notification.id == notification_id
        ).first()
        if notification:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            db.commit()
            db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        """Mark all notifications as read for a user. Returns count of updated notifications."""
        result = db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).update({
            Notification.is_read: True,
            Notification.read_at: datetime.utcnow()
        })
        db.commit()
        return result

    @staticmethod
    def get_unread_count(db: Session, user_id: int) -> int:
        """Get count of unread notifications for a user."""
        return db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).count()

    @staticmethod
    def get_notifications(
        db: Session,
        user_id: int,
        limit: int = 20,
        offset: int = 0,
        unread_only: bool = False
    ) -> tuple[list[Notification], int]:
        """
        Get notifications for a user.
        
        Returns:
            Tuple of (notifications list, total count)
        """
        query = db.query(Notification).filter(
            Notification.user_id == user_id
        )
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        total = query.count()
        notifications = query.order_by(
            Notification.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return notifications, total

    @staticmethod
    def delete_notification(db: Session, notification_id: int) -> bool:
        """Delete a notification. Returns True if successful."""
        notification = db.query(Notification).filter(
            Notification.id == notification_id
        ).first()
        if notification:
            db.delete(notification)
            db.commit()
            return True
        return False
