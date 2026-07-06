"""
每日考核API路由
"""
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.review_point import ReviewPoint
from ..models.challenge import DailyChallenge
from ..schemas.challenge import (
    DailyChallengeResponse,
    ChallengeResponse,
    SubmitChallengeRequest,
    ReviewPointInfo,
)

router = APIRouter(prefix="/api/challenges", tags=["每日考核"])


@router.get("/today", response_model=ChallengeResponse)
async def get_today_challenge(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取今日考核"""
    today = date.today()

    # 查找今日考核
    result = await db.execute(
        select(DailyChallenge).where(
            DailyChallenge.user_id == current_user.id,
            DailyChallenge.challenge_date == today
        )
    )
    challenge = result.scalar_one_or_none()

    if challenge:
        # 获取关联的复盘点信息
        rp_result = await db.execute(
            select(ReviewPoint).where(ReviewPoint.id == challenge.review_point_id)
        )
        review_point = rp_result.scalar_one_or_none()

        challenge_data = DailyChallengeResponse.model_validate(challenge)
        if review_point:
            challenge_data.review_point = ReviewPointInfo(
                id=review_point.id,
                question=review_point.question,
                skill_tags=review_point.skill_tags or []
            )

        return ChallengeResponse(
            challenge=challenge_data,
            has_review_points=True
        )

    # 检查是否有复盘点
    count_result = await db.execute(
        select(func.count()).where(ReviewPoint.user_id == current_user.id)
    )
    total_count = count_result.scalar()

    if total_count == 0:
        return ChallengeResponse(
            challenge=None,
            has_review_points=False
        )

    # 从未复盘的复盘点中随机选择
    unreviewed_result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.user_id == current_user.id,
            ReviewPoint.is_reviewed == False
        ).order_by(func.random()).limit(1)
    )
    review_point = unreviewed_result.scalar_one_or_none()

    # 如果没有未复盘的，从所有复盘点中随机选择
    if not review_point:
        all_result = await db.execute(
            select(ReviewPoint).where(
                ReviewPoint.user_id == current_user.id
            ).order_by(func.random()).limit(1)
        )
        review_point = all_result.scalar_one_or_none()

    if not review_point:
        return ChallengeResponse(
            challenge=None,
            has_review_points=False
        )

    # 创建今日考核
    challenge = DailyChallenge(
        user_id=current_user.id,
        review_point_id=review_point.id,
        challenge_date=today
    )
    db.add(challenge)
    await db.flush()

    challenge_data = DailyChallengeResponse.model_validate(challenge)
    challenge_data.review_point = ReviewPointInfo(
        id=review_point.id,
        question=review_point.question,
        skill_tags=review_point.skill_tags or []
    )

    return ChallengeResponse(
        challenge=challenge_data,
        has_review_points=True
    )


@router.post("/today/complete", response_model=DailyChallengeResponse)
async def complete_challenge(
    data: SubmitChallengeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """完成今日考核"""
    today = date.today()

    # 查找今日考核
    result = await db.execute(
        select(DailyChallenge).where(
            DailyChallenge.user_id == current_user.id,
            DailyChallenge.challenge_date == today
        )
    )
    challenge = result.scalar_one_or_none()

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="今日考核不存在"
        )

    if challenge.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="今日考核已完成"
        )

    challenge.user_answer = data.user_answer
    challenge.is_completed = True
    challenge.completed_at = datetime.utcnow()
    await db.flush()

    return DailyChallengeResponse.model_validate(challenge)
