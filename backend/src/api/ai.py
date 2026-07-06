"""
AI生成API路由
"""
from fastapi import APIRouter, Depends

from ..core.security import get_current_user
from ..models.user import User
from ..schemas.review import AIGenerateRequest
from ..services.ai_service import call_llm

router = APIRouter(prefix="/api/ai", tags=["AI生成"])


@router.post("/generate-answer")
async def generate_answer(
    data: AIGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    """AI生成答案"""
    system_prompt = """你是一个专业的AI智能体工程师面试辅导助手。
请根据面试问题提供高质量的答案，要求：
1. 答案应该准确、详细、专业
2. 使用Markdown格式组织内容
3. 包含核心概念、关键要点、代码示例（如果适用）
4. 语言简洁明了，易于理解"""

    try:
        answer = await call_llm(data.question, system_prompt)
        return {"answer": answer}
    except ValueError as e:
        return {"error": str(e), "answer": None}
    except Exception as e:
        return {"error": f"AI服务暂时不可用: {str(e)}", "answer": None}


@router.post("/generate-question")
async def generate_question(
    current_user: User = Depends(get_current_user)
):
    """AI生成面试问题"""
    from ..services.ai_service import generate_interview_question

    try:
        question = await generate_interview_question()
        return {"question": question}
    except ValueError as e:
        return {"error": str(e), "question": None}
    except Exception as e:
        return {"error": f"AI服务暂时不可用: {str(e)}", "question": None}
