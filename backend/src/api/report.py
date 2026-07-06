"""
周报API路由
"""
from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.review_point import ReviewPoint
from ..models.practice import PracticeQuestion
from ..models.report import WeeklyReport
from ..schemas.report import WeeklyReportResponse
from ..services.analysis_service import generate_weekly_report

router = APIRouter(prefix="/api/analysis", tags=["周度分析"])


@router.get("/weekly", response_model=WeeklyReportResponse)
async def get_weekly_report(
    week_offset: int = Query(0, ge=0, description="周偏移量（0=本周，1=上周）"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取周度分析报告"""
    # 计算目标周的日期范围
    today = date.today()
    target_date = today - timedelta(weeks=week_offset)

    # 找到该周的周一
    day_of_week = target_date.weekday()
    week_start = target_date - timedelta(days=day_of_week)
    week_end = week_start + timedelta(days=6)

    # 查找已存在的周报
    result = await db.execute(
        select(WeeklyReport).where(
            WeeklyReport.user_id == current_user.id,
            WeeklyReport.week_start == week_start,
            WeeklyReport.week_end == week_end
        )
    )
    report = result.scalar_one_or_none()

    if report:
        return WeeklyReportResponse.model_validate(report)

    # 生成新的周报
    report = await generate_weekly_report(db, current_user.id, week_start, week_end)

    return WeeklyReportResponse.model_validate(report)
