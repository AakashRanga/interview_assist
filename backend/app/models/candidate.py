from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    status = Column(String(100), nullable=False, default="new")
    resume_path = Column(String(500), nullable=True)
    skills = Column(String(1000), nullable=True)
    certificates = Column(String(1000), nullable=True)
    portfolio_link = Column(String(500), nullable=True)
    linkedin = Column(String(500), nullable=True)
    github = Column(String(500), nullable=True)
    preferred_location = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="candidate")
    applications = relationship("CandidateApplication", back_populates="candidate")
    interview_schedules = relationship("InterviewSchedule", back_populates="candidate")
    education_list = relationship("CandidateEducation", back_populates="candidate", cascade="all, delete-orphan")
    experience_list = relationship("CandidateExperience", back_populates="candidate", cascade="all, delete-orphan")


class CandidateEducation(Base):
    __tablename__ = "candidate_education"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    degree = Column(String(255), nullable=True)
    university = Column(String(255), nullable=True)
    graduation_year = Column(String(20), nullable=True)
    gpa = Column(String(20), nullable=True)

    candidate = relationship("Candidate", back_populates="education_list")


class CandidateExperience(Base):
    __tablename__ = "candidate_experience"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    current_role = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    years_experience = Column(String(50), nullable=True)
    experience_summary = Column(Text, nullable=True)

    candidate = relationship("Candidate", back_populates="experience_list")