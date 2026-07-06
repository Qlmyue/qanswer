"""
每日考核模型
"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class DailyChallenge(Base):
    """每日考核表"""
    __tablename__ = "daily_challenges"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    review_point_id = Column(String, ForeignKey("review_points.id"), nullable=False, index=True)
    challenge_date = Column(Date, nullable=False, default=date.today)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    user_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="daily_challenges")
    review_point = relationship("ReviewPoint", back_populates="daily_challenges")

    def __repr__(self):
        return f"<DailyChallenge {self.id}: {self.challenge_date}>"
