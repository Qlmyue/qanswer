"""
练习题相关Schema
"""
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field


class PracticeQuestionResponse(BaseModel):
    """练习题响应Schema"""
    id: str
    user_id: str
    question: str
    user_answer: Optional[str]
    practice_date: date
    is_answered: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SubmitAnswerRequest(BaseModel):
    """提交答案请求Schema"""
    answer: str = Field(..., min_length=1, max_length=5000)
