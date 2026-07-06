"""
周报模型
"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Integer, Float, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class WeeklyReport(Base):
    """周度分析报告表"""
    __tablename__ = "weekly_reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    week_start = Column(Date, nullable=False)
    week_end = Column(Date, nullable=False)
    total_review_points = Column(Integer, default=0)
    total_practice_questions = Column(Integer, default=0)
    category_stats = Column(JSON, default=dict)
    weak_points = Column(JSON, default=list)
    improvement_suggestions = Column(JSON, default=list)
    trend_comparison = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="weekly_reports")

    def __repr__(self):
        return f"<WeeklyReport {self.id}: {self.week_start} ~ {self.week_end}>"
