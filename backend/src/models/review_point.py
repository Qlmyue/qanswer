"""
复盘点模型
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base


class ReviewPoint(Base):
    """复盘点表"""
    __tablename__ = "review_points"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    answer_source = Column(String(20), nullable=False, default="manual_input")  # ai_generated / manual_input
    reference_links = Column(JSON, default=list)
    is_reviewed = Column(Boolean, default=False)
    reviewed_at = Column(DateTime, nullable=True)
    skill_tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="review_points")
    daily_challenges = relationship("DailyChallenge", back_populates="review_point")

    def __repr__(self):
        return f"<ReviewPoint {self.id}: {self.question[:30]}...>"
