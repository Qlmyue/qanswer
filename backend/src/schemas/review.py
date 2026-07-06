"""
复盘点相关Schema
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ReviewPointBase(BaseModel):
    """复盘点基础Schema"""
    question: str = Field(..., min_length=1, max_length=2000)
    answer: str = Field(..., min_length=1, max_length=10000)


class ReviewPointCreate(BaseModel):
    """创建复盘点Schema"""
    question: str = Field(..., min_length=1, max_length=2000)
    answer: Optional[str] = Field(None, max_length=10000)  # 可选，为空时自动生成
    answer_source: str = Field(default="manual_input", pattern="^(ai_generated|manual_input)$")
    reference_links: List[str] = Field(default_factory=list)
    skill_tags: List[str] = Field(default_factory=list)


class ReviewPointUpdate(BaseModel):
    """更新复盘点Schema"""
    question: Optional[str] = Field(None, min_length=1, max_length=2000)
    answer: Optional[str] = Field(None, min_length=1, max_length=10000)
    reference_links: Optional[List[str]] = None
    skill_tags: Optional[List[str]] = None


class ReviewPointResponse(ReviewPointBase):
    """复盘点响应Schema"""
    id: str
    user_id: str
    answer_source: str
    reference_links: List[str]
    is_reviewed: bool
    reviewed_at: Optional[datetime]
    skill_tags: List[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ReviewPointListResponse(BaseModel):
    """复盘点列表响应Schema"""
    items: List[ReviewPointResponse]
    total: int
    page: int
    page_size: int


class ReviewStatusUpdate(BaseModel):
    """更新复盘状态Schema"""
    is_reviewed: bool


class AIGenerateRequest(BaseModel):
    """AI生成请求Schema"""
    question: str = Field(..., min_length=1, max_length=2000)
