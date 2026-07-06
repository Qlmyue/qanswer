"""
考核点相关Schema
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class ReviewPointInfo(BaseModel):
    """复盘点简要信息"""
    id: str
    question: str
    skill_tags: List[str]


class DailyChallengeResponse(BaseModel):
    """每日考核响应Schema"""
    id: str
    user_id: str
    review_point_id: str
    review_point: Optional[ReviewPointInfo] = None
    challenge_date: date
    is_completed: bool
    completed_at: Optional[datetime]
    user_answer: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ChallengeResponse(BaseModel):
    """考核响应Schema"""
    challenge: Optional[DailyChallengeResponse]
    has_review_points: bool


class SubmitChallengeRequest(BaseModel):
    """提交考核答案请求Schema"""
    user_answer: str = Field(..., min_length=1, max_length=5000)
