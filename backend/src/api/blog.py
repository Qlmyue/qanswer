"""
博客 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..services.blog_service import BlogService
from ..schemas.blog import (
    PostCreate, PostUpdate, PostResponse, PostListResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
    TagResponse,
    CommentCreate, CommentResponse,
    GuestbookCreate, GuestbookResponse, GuestbookListResponse,
    DanmakuCreate, DanmakuResponse,
    FriendLinkCreate, FriendLinkUpdate, FriendLinkResponse,
    SiteConfigUpdate, SiteConfigResponse,
    HomeData,
)

router = APIRouter(prefix="/api/blog", tags=["blog"])


def get_blog_service(db: AsyncSession = Depends(get_db)) -> BlogService:
    return BlogService(db)


# ========== 首页 ==========

@router.get("/home", response_model=HomeData)
async def get_home_data(service: BlogService = Depends(get_blog_service)):
    """获取首页数据"""
    return await service.get_home_data()


# ========== 文章 ==========

@router.get("/posts", response_model=PostListResponse)
async def get_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category: str | None = None,
    tag: str | None = None,
    search: str | None = None,
    status: str | None = None,
    service: BlogService = Depends(get_blog_service),
):
    """获取文章列表"""
    posts, total = await service.get_posts(
        page=page,
        page_size=page_size,
        category=category,
        tag=tag,
        search=search,
        status=status,
    )
    return PostListResponse(
        items=[_post_to_response(p) for p in posts],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/posts/{slug}", response_model=PostResponse)
async def get_post(
    slug: str,
    service: BlogService = Depends(get_blog_service),
):
    """获取文章详情"""
    post = await service.get_post_by_slug(slug)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 增加阅读量
    await service.increment_views(post.id)

    return _post_to_response(post)


@router.get("/posts/{post_id}/raw")
async def get_post_raw(
    post_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """获取原始 Markdown"""
    post = await service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    return {"content": post.content_md}


@router.post("/posts", response_model=PostResponse)
async def create_post(
    data: PostCreate,
    service: BlogService = Depends(get_blog_service),
):
    """创建文章"""
    post = await service.create_post(data)
    return _post_to_response(post)


@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    service: BlogService = Depends(get_blog_service),
):
    """更新文章"""
    post = await service.update_post(post_id, data)
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")
    return _post_to_response(post)


@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除文章"""
    success = await service.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="文章不存在")
    return {"message": "删除成功"}


# ========== 分类 ==========

@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(service: BlogService = Depends(get_blog_service)):
    """获取所有分类"""
    return await service.get_categories()


@router.post("/categories", response_model=CategoryResponse)
async def create_category(
    data: CategoryCreate,
    service: BlogService = Depends(get_blog_service),
):
    """创建分类"""
    return await service.create_category(data)


@router.put("/categories/{cat_id}", response_model=CategoryResponse)
async def update_category(
    cat_id: str,
    data: CategoryUpdate,
    service: BlogService = Depends(get_blog_service),
):
    """更新分类"""
    category = await service.update_category(cat_id, data)
    if not category:
        raise HTTPException(status_code=404, detail="分类不存在")
    return category


@router.delete("/categories/{cat_id}")
async def delete_category(
    cat_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除分类"""
    success = await service.delete_category(cat_id)
    if not success:
        raise HTTPException(status_code=404, detail="分类不存在")
    return {"message": "删除成功"}


# ========== 标签 ==========

@router.get("/tags", response_model=list[TagResponse])
async def get_tags(service: BlogService = Depends(get_blog_service)):
    """获取所有标签"""
    return await service.get_tags()


# ========== 评论 ==========

@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
async def get_comments(
    post_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """获取文章评论"""
    return await service.get_comments(post_id)


@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def create_comment(
    post_id: str,
    data: CommentCreate,
    service: BlogService = Depends(get_blog_service),
):
    """提交评论"""
    return await service.create_comment(post_id, data)


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除评论"""
    success = await service.delete_comment(comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="评论不存在")
    return {"message": "删除成功"}


@router.put("/comments/{comment_id}/status")
async def update_comment_status(
    comment_id: str,
    status: str,
    service: BlogService = Depends(get_blog_service),
):
    """审核评论"""
    success = await service.update_comment_status(comment_id, status)
    if not success:
        raise HTTPException(status_code=404, detail="评论不存在")
    return {"message": "更新成功"}


# ========== 留言板 ==========

@router.get("/guestbook", response_model=GuestbookListResponse)
async def get_guestbook(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: BlogService = Depends(get_blog_service),
):
    """获取留言列表"""
    messages, total = await service.get_guestbook(page, page_size)
    return GuestbookListResponse(
        items=messages,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("/guestbook", response_model=GuestbookResponse)
async def create_guestbook(
    data: GuestbookCreate,
    service: BlogService = Depends(get_blog_service),
):
    """提交留言"""
    return await service.create_guestbook(data)


@router.delete("/guestbook/{msg_id}")
async def delete_guestbook(
    msg_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除留言"""
    success = await service.delete_guestbook(msg_id)
    if not success:
        raise HTTPException(status_code=404, detail="留言不存在")
    return {"message": "删除成功"}


# ========== 弹幕 ==========

@router.get("/danmaku", response_model=list[DanmakuResponse])
async def get_danmaku(
    limit: int = Query(50, ge=1, le=200),
    service: BlogService = Depends(get_blog_service),
):
    """获取弹幕列表"""
    return await service.get_danmaku(limit)


@router.post("/danmaku", response_model=DanmakuResponse)
async def create_danmaku(
    data: DanmakuCreate,
    service: BlogService = Depends(get_blog_service),
):
    """发送弹幕"""
    return await service.create_danmaku(data)


@router.delete("/danmaku/{danmaku_id}")
async def delete_danmaku(
    danmaku_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除弹幕"""
    success = await service.delete_danmaku(danmaku_id)
    if not success:
        raise HTTPException(status_code=404, detail="弹幕不存在")
    return {"message": "删除成功"}


# ========== 友链 ==========

@router.get("/friends", response_model=list[FriendLinkResponse])
async def get_friends(service: BlogService = Depends(get_blog_service)):
    """获取友链列表"""
    return await service.get_friends()


@router.post("/friends", response_model=FriendLinkResponse)
async def create_friend(
    data: FriendLinkCreate,
    service: BlogService = Depends(get_blog_service),
):
    """申请友链"""
    return await service.create_friend(data)


@router.put("/friends/{friend_id}", response_model=FriendLinkResponse)
async def update_friend(
    friend_id: str,
    data: FriendLinkUpdate,
    service: BlogService = Depends(get_blog_service),
):
    """更新友链"""
    friend = await service.update_friend(friend_id, data)
    if not friend:
        raise HTTPException(status_code=404, detail="友链不存在")
    return friend


@router.delete("/friends/{friend_id}")
async def delete_friend(
    friend_id: str,
    service: BlogService = Depends(get_blog_service),
):
    """删除友链"""
    success = await service.delete_friend(friend_id)
    if not success:
        raise HTTPException(status_code=404, detail="友链不存在")
    return {"message": "删除成功"}


# ========== 站点配置 ==========

@router.get("/site", response_model=SiteConfigResponse)
async def get_site_config(service: BlogService = Depends(get_blog_service)):
    """获取站点配置"""
    return await service.get_site_config()


@router.put("/site", response_model=SiteConfigResponse)
async def update_site_config(
    data: SiteConfigUpdate,
    service: BlogService = Depends(get_blog_service),
):
    """更新站点配置"""
    return await service.update_site_config(data)


# ========== 辅助函数 ==========

def _post_to_response(post) -> PostResponse:
    """将 BlogPost 转换为 PostResponse"""
    # 获取评论数量（安全处理懒加载）
    comment_count = 0
    try:
        if hasattr(post, 'comments') and post.comments:
            comment_count = len(post.comments)
    except Exception:
        pass

    return PostResponse(
        id=post.id,
        title=post.title,
        slug=post.slug,
        summary=post.summary,
        content_md="",  # 列表不返回完整内容
        cover_url=post.cover_url,
        category_id=post.category_id,
        category=post.category,
        tags=post.tags or [],
        author_id=post.author_id,
        author_name="",
        status=post.status,
        is_top=post.is_top,
        views=post.views,
        word_count=post.word_count,
        reading_time=post.reading_time,
        comment_count=comment_count,
        published_at=post.published_at,
        created_at=post.created_at,
        updated_at=post.updated_at,
    )
