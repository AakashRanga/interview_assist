from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class CandidateApplication(Base):
    __tablename__ = "candidate_applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False)
    preferred_location = Column(String(255), nullable=True)
    cover_letter = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="Applied")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    candidate = relationship("Candidate", back_populates="applications")
    role = relationship("JobRole")
