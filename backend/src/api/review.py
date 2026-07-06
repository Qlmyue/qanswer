"""
复盘点API路由
"""
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.review_point import ReviewPoint
from ..schemas.review import (
    ReviewPointCreate,
    ReviewPointUpdate,
    ReviewPointResponse,
    ReviewPointListResponse,
    ReviewStatusUpdate,
)
from ..services.ai_service import call_llm

router = APIRouter(prefix="/api/review-points", tags=["复盘点"])


@router.get("", response_model=ReviewPointListResponse)
async def get_review_points(
    status: Optional[str] = Query(None, description="筛选状态: reviewed/unreviewed"),
    skill_tag: Optional[str] = Query(None, description="技能标签筛选"),
    keyword: Optional[str] = Query(None, description="关键词搜索"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取复盘点列表"""
    # 构建查询
    query = select(ReviewPoint).where(ReviewPoint.user_id == current_user.id)

    # 状态筛选
    if status == "reviewed":
        query = query.where(ReviewPoint.is_reviewed == True)
    elif status == "unreviewed":
        query = query.where(ReviewPoint.is_reviewed == False)

    # 技能标签筛选
    if skill_tag:
        query = query.where(ReviewPoint.skill_tags.contains([skill_tag]))

    # 关键词搜索
    if keyword:
        query = query.where(
            or_(
                ReviewPoint.question.ilike(f"%{keyword}%"),
                ReviewPoint.answer.ilike(f"%{keyword}%")
            )
        )

    # 获取总数
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # 分页
    query = query.order_by(ReviewPoint.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    items = result.scalars().all()

    return ReviewPointListResponse(
        items=[ReviewPointResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{review_point_id}", response_model=ReviewPointResponse)
async def get_review_point(
    review_point_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取单个复盘点"""
    result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.id == review_point_id,
            ReviewPoint.user_id == current_user.id
        )
    )
    review_point = result.scalar_one_or_none()

    if not review_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="复盘点不存在"
        )

    return ReviewPointResponse.model_validate(review_point)


@router.post("", response_model=ReviewPointResponse, status_code=status.HTTP_201_CREATED)
async def create_review_point(
    data: ReviewPointCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建复盘点"""
    # 如果答案为空，自动生成AI答案
    answer = data.answer
    answer_source = data.answer_source

    if not answer or not answer.strip():
        try:
            system_prompt = """你是一个专业的AI智能体工程师面试辅导助手。
请根据面试问题提供高质量的答案，要求：
1. 答案应该准确、详细、专业
2. 使用Markdown格式组织内容
3. 包含核心概念、关键要点、代码示例（如果适用）
4. 语言简洁明了，易于理解"""
            answer = await call_llm(data.question, system_prompt)
            answer_source = "ai_generated"
        except Exception as e:
            # AI生成失败时，使用默认答案
            answer = f"答案生成失败，请手动输入。错误信息: {str(e)}"
            answer_source = "manual_input"

    review_point = ReviewPoint(
        user_id=current_user.id,
        question=data.question,
        answer=answer,
        answer_source=answer_source,
        reference_links=data.reference_links,
        skill_tags=data.skill_tags
    )
    db.add(review_point)
    await db.flush()

    return ReviewPointResponse.model_validate(review_point)


@router.put("/{review_point_id}", response_model=ReviewPointResponse)
async def update_review_point(
    review_point_id: str,
    data: ReviewPointUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新复盘点"""
    result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.id == review_point_id,
            ReviewPoint.user_id == current_user.id
        )
    )
    review_point = result.scalar_one_or_none()

    if not review_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="复盘点不存在"
        )

    # 更新字段
    if data.question is not None:
        review_point.question = data.question
    if data.answer is not None:
        review_point.answer = data.answer
    if data.reference_links is not None:
        review_point.reference_links = data.reference_links
    if data.skill_tags is not None:
        review_point.skill_tags = data.skill_tags

    review_point.updated_at = datetime.utcnow()
    await db.flush()

    return ReviewPointResponse.model_validate(review_point)


@router.patch("/{review_point_id}/review-status", response_model=ReviewPointResponse)
async def update_review_status(
    review_point_id: str,
    data: ReviewStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新复盘状态"""
    result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.id == review_point_id,
            ReviewPoint.user_id == current_user.id
        )
    )
    review_point = result.scalar_one_or_none()

    if not review_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="复盘点不存在"
        )

    review_point.is_reviewed = data.is_reviewed
    review_point.reviewed_at = datetime.utcnow() if data.is_reviewed else None
    await db.flush()

    return ReviewPointResponse.model_validate(review_point)


@router.delete("/{review_point_id}")
async def delete_review_point(
    review_point_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除复盘点"""
    result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.id == review_point_id,
            ReviewPoint.user_id == current_user.id
        )
    )
    review_point = result.scalar_one_or_none()

    if not review_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="复盘点不存在"
        )

    await db.delete(review_point)
    return {"message": "删除成功"}


@router.get("/tags/all")
async def get_all_tags(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取所有技能标签"""
    result = await db.execute(
        select(ReviewPoint.skill_tags).where(ReviewPoint.user_id == current_user.id)
    )
    all_tags = result.scalars().all()

    # 合并所有标签并去重
    tags = set()
    for tag_list in all_tags:
        if tag_list:
            tags.update(tag_list)

    return {"tags": sorted(list(tags))}
