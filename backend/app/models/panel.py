from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class Panel(Base):
    __tablename__ = "panels"

    id = Column(Integer, primary_key=True, index=True)
    mr_panelist_grade = Column(String(100), nullable=True)
    mr_panel_mobile = Column(String(50), nullable=True)
    hr_panelist_emp_id = Column(String(100), nullable=True)
    hr_panelists_name = Column(String(255), nullable=True)
    hr_panelist_grade = Column(String(100), nullable=True)
    hr_panel_mobile = Column(String(50), nullable=True)
    tag_coordinator = Column(String(255), nullable=True)
    slots = Column(String(255), nullable=True)
    team_link = Column(String(500), nullable=True)
    interview_type = Column(String(100), nullable=True)
    panel_briefing = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
