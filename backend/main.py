"""
FastAPI 主应用入口
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.core.config import get_settings
from src.core.database import init_db
from src.api import auth, review, practice, challenge, skill, report, dashboard, ai, blog

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期"""
    # 启动时初始化数据库
    await init_db()
    print("[OK] 数据库初始化完成")
    yield
    # 关闭时清理资源
    print("[INFO] 应用关闭")


# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI面试复盘系统API",
    lifespan=lifespan
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router)
app.include_router(review.router)
app.include_router(practice.router)
app.include_router(challenge.router)
app.include_router(skill.router)
app.include_router(report.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
app.include_router(blog.router)

# 静态文件服务（暂时注释掉，避免路由冲突）
# freebytes_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "freebytes")
# content_dir = os.path.join(freebytes_dir, "content")
# uploads_dir = os.path.join(freebytes_dir, "uploads")

# if os.path.exists(content_dir):
#     app.mount("/blog/content", StaticFiles(directory=content_dir), name="blog-content")
# if os.path.exists(uploads_dir):
#     app.mount("/blog/uploads", StaticFiles(directory=uploads_dir), name="blog-uploads")


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}
