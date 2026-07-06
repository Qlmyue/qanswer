"""
练习题API路由
"""
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.practice import PracticeQuestion
from ..schemas.practice import PracticeQuestionResponse, SubmitAnswerRequest
from ..services.ai_service import generate_interview_question

router = APIRouter(prefix="/api/practice", tags=["每日练习"])


@router.get("/today", response_model=PracticeQuestionResponse)
async def get_today_practice(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取今日练习题"""
    today = date.today()

    # 查找今日练习题
    result = await db.execute(
        select(PracticeQuestion).where(
            PracticeQuestion.user_id == current_user.id,
            PracticeQuestion.practice_date == today
        )
    )
    practice = result.scalar_one_or_none()

    if practice:
        return PracticeQuestionResponse.model_validate(practice)

    # 生成新的练习题
    question = await generate_interview_question()

    practice = PracticeQuestion(
        user_id=current_user.id,
        question=question,
        practice_date=today
    )
    db.add(practice)
    await db.flush()

    return PracticeQuestionResponse.model_validate(practice)


@router.post("/today/answer", response_model=PracticeQuestionResponse)
async def submit_answer(
    data: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """提交今日练习答案"""
    today = date.today()

    # 查找今日练习题
    result = await db.execute(
        select(PracticeQuestion).where(
            PracticeQuestion.user_id == current_user.id,
            PracticeQuestion.practice_date == today
        )
    )
    practice = result.scalar_one_or_none()

    if not practice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="今日练习题不存在"
        )

    if practice.is_answered:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="今日练习已完成"
        )

    practice.user_answer = data.answer
    practice.is_answered = True
    await db.flush()

    return PracticeQuestionResponse.model_validate(practice)
