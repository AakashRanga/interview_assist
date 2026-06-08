from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    experience = Column(String(100), nullable=False)
    total_vacancy = Column(Integer, nullable=False, default=1)
    job_type = Column(String(50), nullable=False, default="Online")
    venue = Column(String(255), nullable=True)
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
