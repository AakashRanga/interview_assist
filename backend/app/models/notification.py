from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class ActivityType(str, enum.Enum):
    PROFILE_UPDATED = "PROFILE_UPDATED"
    RESUME_UPLOADED = "RESUME_UPLOADED"
    JOB_APPLIED = "JOB_APPLIED"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    MEET_LINK_GENERATED = "MEET_LINK_GENERATED"
    APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED"
    APPLICATION_APPROVED = "APPLICATION_APPROVED"
    APPLICATION_REJECTED = "APPLICATION_REJECTED"
    PROFILE_VIEWED = "PROFILE_VIEWED"
    CERTIFICATE_UPLOADED = "CERTIFICATE_UPLOADED"
    ASSESSMENT_COMPLETED = "ASSESSMENT_COMPLETED"


class NotificationType(str, enum.Enum):
    INFO = "INFO"
    SUCCESS = "SUCCESS"
    WARNING = "WARNING"
    ERROR = "ERROR"


class PriorityLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CandidateActivity(Base):
    __tablename__ = "candidate_activities"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    activity_type = Column(String(100), nullable=False, index=True)
    reference_id = Column(Integer, nullable=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    activity_metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    candidate = relationship("Candidate", backref="activities")
    user = relationship("User", backref="candidate_activities")
    notifications = relationship("Notification", back_populates="activity")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=True, index=True)
    
    activity_id = Column(Integer, ForeignKey("candidate_activities.id", ondelete="SET NULL"), nullable=True)
    
    notification_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    icon = Column(String(100), nullable=True)
    
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(DateTime, nullable=True)
    
    priority = Column(SQLEnum(PriorityLevel), default=PriorityLevel.MEDIUM)
    redirect_url = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", backref="notifications")
    candidate = relationship("Candidate", backref="candidate_notifications")
    activity = relationship("CandidateActivity", back_populates="notifications")
