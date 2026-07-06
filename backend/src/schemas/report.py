"""
周报相关Schema
"""
from datetime import datetime, date
from typing import Dict, List, Any
from pydantic import BaseModel


class CategoryStat(BaseModel):
    """技能分类统计"""
    total: int
    reviewed: int


class TrendComparison(BaseModel):
    """趋势对比"""
    review_points_change: int
    practice_questions_change: int
    review_rate_change: float


class WeeklyReportResponse(BaseModel):
    """周报响应Schema"""
    id: str
    user_id: str
    week_start: date
    week_end: date
    total_review_points: int
    total_practice_questions: int
    category_stats: Dict[str, CategoryStat]
    weak_points: List[str]
    improvement_suggestions: List[str]
    trend_comparison: TrendComparison
    created_at: datetime

    class Config:
        from_attributes = True
