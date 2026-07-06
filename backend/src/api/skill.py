"""
技能管理API路由
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, distinct

from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.skill import SkillItem
from ..schemas.skill import (
    SkillItemCreate,
    SkillItemUpdate,
    SkillItemResponse,
    SkillListResponse,
)

router = APIRouter(prefix="/api/skills", tags=["技能管理"])


@router.get("", response_model=SkillListResponse)
async def get_skills(
    category: Optional[str] = Query(None, description="分类筛选"),
    priority: Optional[str] = Query(None, description="优先级筛选"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取技能列表"""
    query = select(SkillItem).where(SkillItem.user_id == current_user.id)

    if category:
        query = query.where(SkillItem.category == category)
    if priority:
        query = query.where(SkillItem.priority == priority)

    # 按优先级排序
    priority_order = {"high": 0, "medium": 1, "low": 2}
    query = query.order_by(SkillItem.created_at.desc())

    result = await db.execute(query)
    skills = result.scalars().all()

    # 获取所有分类
    cat_result = await db.execute(
        select(distinct(SkillItem.category)).where(SkillItem.user_id == current_user.id)
    )
    categories = [cat for cat in cat_result.scalars().all() if cat]

    return SkillListResponse(
        skills=[SkillItemResponse.model_validate(s) for s in skills],
        categories=sorted(categories)
    )


@router.post("", response_model=SkillItemResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    data: SkillItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建技能项"""
    # 检查名称是否重复
    existing = await db.execute(
        select(SkillItem).where(
            SkillItem.user_id == current_user.id,
            SkillItem.name == data.name
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="技能名称已存在"
        )

    skill = SkillItem(
        user_id=current_user.id,
        name=data.name,
        description=data.description,
        category=data.category,
        priority=data.priority,
        boundary=data.boundary
    )
    db.add(skill)
    await db.flush()

    return SkillItemResponse.model_validate(skill)


@router.put("/{skill_id}", response_model=SkillItemResponse)
async def update_skill(
    skill_id: str,
    data: SkillItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新技能项"""
    result = await db.execute(
        select(SkillItem).where(
            SkillItem.id == skill_id,
            SkillItem.user_id == current_user.id
        )
    )
    skill = result.scalar_one_or_none()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="技能不存在"
        )

    # 检查名称是否重复（排除自身）
    if data.name:
        existing = await db.execute(
            select(SkillItem).where(
                SkillItem.user_id == current_user.id,
                SkillItem.name == data.name,
                SkillItem.id != skill_id
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="技能名称已存在"
            )

    # 更新字段
    if data.name is not None:
        skill.name = data.name
    if data.description is not None:
        skill.description = data.description
    if data.category is not None:
        skill.category = data.category
    if data.priority is not None:
        skill.priority = data.priority
    if data.boundary is not None:
        skill.boundary = data.boundary

    await db.flush()

    return SkillItemResponse.model_validate(skill)


@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除技能项"""
    result = await db.execute(
        select(SkillItem).where(
            SkillItem.id == skill_id,
            SkillItem.user_id == current_user.id
        )
    )
    skill = result.scalar_one_or_none()

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="技能不存在"
        )

    await db.delete(skill)
    return {"message": "删除成功"}
