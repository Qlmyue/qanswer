"""
仪表盘API路由
"""
from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.review_point import ReviewPoint
from ..models.practice import PracticeQuestion
from ..models.challenge import DailyChallenge

router = APIRouter(prefix="/api/dashboard", tags=["仪表盘"])


@router.get("")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取仪表盘数据"""
    # 统计复盘点
    total_rp = await db.execute(
        select(func.count()).where(ReviewPoint.user_id == current_user.id)
    )
    total_review_points = total_rp.scalar()

    reviewed_rp = await db.execute(
        select(func.count()).where(
            ReviewPoint.user_id == current_user.id,
            ReviewPoint.is_reviewed == True
        )
    )
    reviewed_points = reviewed_rp.scalar()

    review_rate = reviewed_points / total_review_points if total_review_points > 0 else 0

    # 统计练习题
    total_pq = await db.execute(
        select(func.count()).where(PracticeQuestion.user_id == current_user.id)
    )
    total_practice_questions = total_pq.scalar()

    # 今日考核状态
    today = date.today()
    today_challenge = await db.execute(
        select(DailyChallenge).where(
            DailyChallenge.user_id == current_user.id,
            DailyChallenge.challenge_date == today
        )
    )
    challenge = today_challenge.scalar_one_or_none()

    # 今日练习状态
    today_practice = await db.execute(
        select(PracticeQuestion).where(
            PracticeQuestion.user_id == current_user.id,
            PracticeQuestion.practice_date == today
        )
    )
    practice = today_practice.scalar_one_or_none()

    # 最近复盘点
    recent_rp = await db.execute(
        select(ReviewPoint)
        .where(ReviewPoint.user_id == current_user.id)
        .order_by(ReviewPoint.created_at.desc())
        .limit(5)
    )
    recent_points = recent_rp.scalars().all()

    return {
        "stats": {
            "totalReviewPoints": total_review_points,
            "reviewedPoints": reviewed_points,
            "reviewRate": round(review_rate, 2),
            "totalPracticeQuestions": total_practice_questions,
            "weeklyStreak": 3  # TODO: 计算连续打卡天数
        },
        "todayChallenge": {
            "isCompleted": challenge.is_completed if challenge else False,
            "questionPreview": ""  # 需要关联查询
        },
        "todayPractice": {
            "isAnswered": practice.is_answered if practice else False,
            "questionPreview": practice.question[:30] + "..." if practice else ""
        },
        "recentReviewPoints": [
            {
                "id": rp.id,
                "question": rp.question,
                "isReviewed": rp.is_reviewed,
                "createdAt": rp.created_at.isoformat()
            }
            for rp in recent_points
        ]
    }
