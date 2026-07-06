"""
技能项相关Schema
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class SkillItemBase(BaseModel):
    """技能项基础Schema"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=50)
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")
    boundary: Optional[str] = None


class SkillItemCreate(SkillItemBase):
    """创建技能项Schema"""
    pass


class SkillItemUpdate(BaseModel):
    """更新技能项Schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    priority: Optional[str] = Field(None, pattern="^(high|medium|low)$")
    boundary: Optional[str] = None


class SkillItemResponse(SkillItemBase):
    """技能项响应Schema"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class SkillListResponse(BaseModel):
    """技能列表响应Schema"""
    skills: List[SkillItemResponse]
    categories: List[str]
