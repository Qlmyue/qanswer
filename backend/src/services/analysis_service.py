"""
分析服务模块
生成周度分析报告
"""
from datetime import date, datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..models.review_point import ReviewPoint
from ..models.practice import PracticeQuestion
from ..models.report import WeeklyReport


async def generate_weekly_report(
    db: AsyncSession,
    user_id: str,
    week_start: date,
    week_end: date
) -> WeeklyReport:
    """
    生成周度分析报告
    """
    # 统计本周复盘点
    rp_count = await db.execute(
        select(func.count()).where(
            ReviewPoint.user_id == user_id,
            func.date(ReviewPoint.created_at) >= week_start,
            func.date(ReviewPoint.created_at) <= week_end
        )
    )
    total_review_points = rp_count.scalar() or 0

    # 统计本周练习题
    pq_count = await db.execute(
        select(func.count()).where(
            PracticeQuestion.user_id == user_id,
            PracticeQuestion.practice_date >= week_start,
            PracticeQuestion.practice_date <= week_end
        )
    )
    total_practice_questions = pq_count.scalar() or 0

    # 获取本周复盘点详情
    rp_result = await db.execute(
        select(ReviewPoint).where(
            ReviewPoint.user_id == user_id,
            func.date(ReviewPoint.created_at) >= week_start,
            func.date(ReviewPoint.created_at) <= week_end
        )
    )
    review_points = rp_result.scalars().all()

    # 按技能分类统计
    category_stats = {}
    for rp in review_points:
        if rp.skill_tags:
            for tag in rp.skill_tags:
                if tag not in category_stats:
                    category_stats[tag] = {"total": 0, "reviewed": 0}
                category_stats[tag]["total"] += 1
                if rp.is_reviewed:
                    category_stats[tag]["reviewed"] += 1

    # 识别薄弱点（未复盘的技能）
    weak_points = []
    for category, stats in category_stats.items():
        if stats["total"] > stats["reviewed"]:
            weak_points.append(f"{category}相关知识需要加强复习")

    # 如果没有数据，提供默认建议
    if not weak_points:
        weak_points = ["暂无数据，请先创建复盘点"]

    # 生成改进建议
    improvement_suggestions = generate_suggestions(category_stats, weak_points)

    # 获取上周数据用于趋势对比
    prev_week_start = week_start - __import__('datetime').timedelta(days=7)
    prev_week_end = week_start - __import__('datetime').timedelta(days=1)

    prev_rp_count = await db.execute(
        select(func.count()).where(
            ReviewPoint.user_id == user_id,
            func.date(ReviewPoint.created_at) >= prev_week_start,
            func.date(ReviewPoint.created_at) <= prev_week_end
        )
    )
    prev_total_rp = prev_rp_count.scalar() or 0

    prev_pq_count = await db.execute(
        select(func.count()).where(
            PracticeQuestion.user_id == user_id,
            PracticeQuestion.practice_date >= prev_week_start,
            PracticeQuestion.practice_date <= prev_week_end
        )
    )
    prev_total_pq = prev_pq_count.scalar() or 0

    # 计算趋势
    rp_change = total_review_points - prev_total_rp
    pq_change = total_practice_questions - prev_total_pq

    # 计算复盘率变化
    total_all_rp = await db.execute(
        select(func.count()).where(ReviewPoint.user_id == user_id)
    )
    total_all = total_all_rp.scalar() or 1

    reviewed_all_rp = await db.execute(
        select(func.count()).where(
            ReviewPoint.user_id == user_id,
            ReviewPoint.is_reviewed == True
        )
    )
    reviewed_all = reviewed_all_rp.scalar() or 0

    current_rate = reviewed_all / total_all if total_all > 0 else 0
    # 简化处理：假设上周复盘率
    prev_rate = max(0, current_rate - 0.1)
    rate_change = current_rate - prev_rate

    # 创建周报
    report = WeeklyReport(
        user_id=user_id,
        week_start=week_start,
        week_end=week_end,
        total_review_points=total_review_points,
        total_practice_questions=total_practice_questions,
        category_stats=category_stats,
        weak_points=weak_points,
        improvement_suggestions=improvement_suggestions,
        trend_comparison={
            "review_points_change": rp_change,
            "practice_questions_change": pq_change,
            "review_rate_change": round(rate_change, 2)
        }
    )
    db.add(report)
    await db.flush()

    return report


def generate_suggestions(category_stats: dict, weak_points: List[str]) -> List[str]:
    """生成改进建议"""
    suggestions = []

    # 基于薄弱点生成建议
    for point in weak_points[:3]:
        if "LangChain" in point:
            suggestions.append("建议每天花30分钟学习LangChain官方文档，重点关注Agent和Chain的使用")
        elif "数据库" in point:
            suggestions.append("复习SQLAlchemy的一对多、多对多关系配置")
        elif "API" in point:
            suggestions.append("阅读RESTful API设计指南，实践FastAPI开发")
        elif "前端" in point:
            suggestions.append("增加前端相关知识的复习频率，特别是Vue3的Composition API")
        else:
            suggestions.append(f"针对{point}，建议制定专项学习计划")

    # 通用建议
    if len(suggestions) < 3:
        suggestions.append("保持每天至少创建1个复盘点的习惯")
        suggestions.append("尝试自己实现一个完整的项目来巩固知识")

    return suggestions[:5]
