"""
练习题模型
"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base


class PracticeQuestion(Base):
    """每日练习题表"""
    __tablename__ = "practice_questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=True)
    practice_date = Column(Date, nullable=False, default=date.today)
    is_answered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="practice_questions")

    def __repr__(self):
        return f"<PracticeQuestion {self.id}: {self.question[:30]}...>"
