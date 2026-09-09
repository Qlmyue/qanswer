"""
博客相关 Pydantic schemas
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# --- 分类 ---
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=50)
    slug: str = Field(..., max_length=50)
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: str
    post_count: int = 0
    created_at: datetime
    children: list["CategoryResponse"] | None = []

    class Config:
        from_attributes = True


# --- 标签 ---
class TagBase(BaseModel):
    name: str = Field(..., max_length=50)
    slug: str = Field(..., max_length=50)


class TagCreate(TagBase):
    pass


class TagResponse(TagBase):
    id: str
    post_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# --- 文章 ---
class PostBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: str = Field(..., max_length=200)
    summary: Optional[str] = Field(None, max_length=500)
    cover_url: Optional[str] = None
    category_id: Optional[str] = None
    status: str = "draft"
    is_top: bool = False


class PostCreate(PostBase):
    content_md: str
    tag_ids: list[str] = []


class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content_md: Optional[str] = None
    cover_url: Optional[str] = None
    category_id: Optional[str] = None
    tag_ids: Optional[list[str]] = None
    status: Optional[str] = None
    is_top: Optional[bool] = None


class PostResponse(PostBase):
    id: str
    content_md: str = ""
    author_id: Optional[str] = None
    author_name: str = ""
    views: int = 0
    word_count: int = 0
    reading_time: int = 0
    comment_count: int = 0
    category: Optional[CategoryResponse] = None
    tags: list[TagResponse] = []
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    items: list[PostResponse]
    total: int
    page: int
    page_size: int


# --- 评论 ---
class CommentBase(BaseModel):
    nickname: str = Field(..., max_length=50)
    email: Optional[str] = Field(None, max_length=100)
    website: Optional[str] = Field(None, max_length=200)
    content: str


class CommentCreate(CommentBase):
    parent_id: Optional[str] = None


class CommentResponse(CommentBase):
    id: str
    post_id: str
    parent_id: Optional[str] = None
    avatar: Optional[str] = None
    status: str = "approved"
    replies: list["CommentResponse"] = []
    created_at: datetime

    class Config:
        from_attributes = True


# --- 留言板 ---
class GuestbookBase(BaseModel):
    nickname: str = Field(..., max_length=50)
    email: Optional[str] = Field(None, max_length=100)
    content: str


class GuestbookCreate(GuestbookBase):
    pass


class GuestbookResponse(GuestbookBase):
    id: str
    avatar: Optional[str] = None
    status: str = "approved"
    created_at: datetime

    class Config:
        from_attributes = True


class GuestbookListResponse(BaseModel):
    items: list[GuestbookResponse]
    total: int
    page: int
    page_size: int


# --- 弹幕 ---
class DanmakuBase(BaseModel):
    content: str = Field(..., max_length=100)
    color: str = "#ffffff"
    position: str = "scroll"
    nickname: Optional[str] = None


class DanmakuCreate(DanmakuBase):
    pass


class DanmakuResponse(DanmakuBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- 友链 ---
class FriendLinkBase(BaseModel):
    name: str = Field(..., max_length=50)
    url: str = Field(..., max_length=500)
    avatar: Optional[str] = None
    description: Optional[str] = Field(None, max_length=200)


class FriendLinkCreate(FriendLinkBase):
    pass


class FriendLinkUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    avatar: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class FriendLinkResponse(FriendLinkBase):
    id: str
    sort_order: int = 0
    status: str = "approved"
    created_at: datetime

    class Config:
        from_attributes = True


# --- 站点配置 ---
class SiteConfigBase(BaseModel):
    site_name: str = "明月工作室"
    site_subtitle: Optional[str] = None
    site_description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    icp_number: Optional[str] = None
    footer_text: Optional[str] = None


class SiteConfigUpdate(BaseModel):
    site_name: Optional[str] = None
    site_subtitle: Optional[str] = None
    site_description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    icp_number: Optional[str] = None
    footer_text: Optional[str] = None
    social_links: Optional[dict] = None


class SiteConfigResponse(SiteConfigBase):
    id: str
    social_links: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- 首页数据 ---
class SiteStats(BaseModel):
    total_posts: int = 0
    total_categories: int = 0
    total_tags: int = 0
    total_views: int = 0


class CategoryWithPosts(BaseModel):
    category: CategoryResponse
    posts: list[PostResponse]


class HomeData(BaseModel):
    featured_posts: list[PostResponse] = []
    category_posts: list[CategoryWithPosts] = []
    stats: SiteStats
    recent_danmaku: list[DanmakuResponse] = []
