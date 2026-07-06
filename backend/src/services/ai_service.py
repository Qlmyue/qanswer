"""
AI Service Module
"""
import random
import httpx
from typing import AsyncGenerator
from ..core.config import get_settings

settings = get_settings()

INTERVIEW_QUESTIONS = [
    "Explain Python GIL and its impact on multithreading",
    "What is RAG (Retrieval-Augmented Generation)?",
    "Explain LangChain Agent concept",
    "What is FastAPI and how it differs from Flask?",
    "Explain Vue3 Composition API",
    "What is a vector database and its use cases?",
    "Explain Docker vs virtual machines",
    "What is CI/CD and its main workflow?",
    "Explain RESTful API design principles",
    "What is SQLAlchemy ORM?",
]


async def call_llm(prompt: str, system_prompt: str = "") -> str:
    """Call LLM API - raises exception on failure"""
    if not settings.OPENAI_API_KEY:
        raise ValueError("未配置 API Key，请在 .env 文件中设置 OPENAI_API_KEY")

    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": settings.OPENAI_MODEL,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.7
    }

    # 自动检测 API Base URL 格式，避免重复 /v1
    api_base = settings.OPENAI_API_BASE.rstrip("/")
    if api_base.endswith("/v1"):
        url = f"{api_base}/chat/completions"
    else:
        url = f"{api_base}/v1/chat/completions"

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        elif response.status_code == 401:
            raise ValueError("API Key 无效或已过期，请检查 .env 中的 OPENAI_API_KEY")
        elif response.status_code == 429:
            raise ValueError("API 请求频率超限，请稍后重试")
        else:
            error_detail = response.text[:200]
            raise RuntimeError(f"AI 服务返回错误 (HTTP {response.status_code}): {error_detail}")


async def generate_interview_question() -> str:
    """Generate interview question - raises on failure"""
    system_prompt = "You are an AI engineer interview question generator. Generate one high-quality interview question. Only output the question."

    result = await call_llm("Generate an AI engineer interview question", system_prompt)

    if len(result) < 10:
        return random.choice(INTERVIEW_QUESTIONS)

    return result.strip()


async def generate_answer(question: str) -> AsyncGenerator[str, None]:
    """Generate answer with streaming - raises on failure"""
    system_prompt = """You are a professional AI engineer interview assistant.
Provide high-quality answers with:
1. Accurate and detailed content
2. Markdown format
3. Code examples when applicable
4. Reference links"""

    answer = await call_llm(question, system_prompt)

    for char in answer:
        yield char


async def generate_ai_answer_with_links(question: str) -> dict:
    """Generate AI answer with reference links - raises on failure"""
    system_prompt = """You are a professional AI engineer interview assistant.
Provide high-quality answers with reference links.
Return JSON format with 'answer' and 'links' fields."""

    result = await call_llm(question, system_prompt)

    import json
    try:
        data = json.loads(result)
        return {
            "answer": data.get("answer", result),
            "links": data.get("links", [])
        }
    except Exception:
        return {
            "answer": result,
            "links": [
                "https://docs.python.org/3/",
                "https://fastapi.tiangolo.com/"
            ]
        }
