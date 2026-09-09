"""
博客相关模型
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..core.database import Base


# 文章-标签关联表
post_tags = Table(
    "blog_post_tags",
    Base.metadata,
    Column("post_id", String, ForeignKey("blog_posts.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", String, ForeignKey("blog_tags.id", ondelete="CASCADE"), primary_key=True),
)


class BlogPost(Base):
    """博客文章表"""
    __tablename__ = "blog_posts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    summary = Column(String(500), nullable=True)
    content_md = Column(Text, nullable=False)  # Markdown 内容
    cover_url = Column(String(500), nullable=True)
    category_id = Column(String, ForeignKey("blog_categories.id", ondelete="SET NULL"), nullable=True)
    author_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default="draft", index=True)  # draft / published / private
    is_top = Column(Boolean, default=False)
    views = Column(Integer, default=0)
    word_count = Column(Integer, default=0)
    reading_time = Column(Integer, default=0)  # 分钟
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    category = relationship("BlogCategory", back_populates="posts")
    tags = relationship("BlogTag", secondary=post_tags, back_populates="posts")
    comments = relationship("BlogComment", back_populates="post", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<BlogPost {self.title}>"


class BlogCategory(Base):
    """博客分类表"""
    __tablename__ = "blog_categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    icon = Column(String(10), nullable=True)  # emoji
    parent_id = Column(String, ForeignKey("blog_categories.id", ondelete="SET NULL"), nullable=True)
    sort_order = Column(Integer, default=0)
    post_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    posts = relationship("BlogPost", back_populates="category")
    children = relationship("BlogCategory", backref="parent", remote_side="BlogCategory.id")

    def __repr__(self):
        return f"<BlogCategory {self.name}>"


class BlogTag(Base):
    """博客标签表"""
    __tablename__ = "blog_tags"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    post_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    posts = relationship("BlogPost", secondary=post_tags, back_populates="tags")

    def __repr__(self):
        return f"<BlogTag {self.name}>"


class BlogComment(Base):
    """博客评论表"""
    __tablename__ = "blog_comments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String, ForeignKey("blog_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(String, ForeignKey("blog_comments.id", ondelete="CASCADE"), nullable=True)
    nickname = Column(String(50), nullable=False)
    email = Column(String(100), nullable=True)
    website = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    avatar = Column(String(500), nullable=True)
    ip = Column(String(50), nullable=True)
    status = Column(String(20), default="approved", index=True)  # pending / approved / rejected
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    post = relationship("BlogPost", back_populates="comments")
    replies = relationship("BlogComment", backref="parent", remote_side="BlogComment.id")

    def __repr__(self):
        return f"<BlogComment {self.nickname}>"


class BlogGuestbook(Base):
    """留言板表"""
    __tablename__ = "blog_guestbook"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nickname = Column(String(50), nullable=False)
    email = Column(String(100), nullable=True)
    content = Column(Text, nullable=False)
    avatar = Column(String(500), nullable=True)
    ip = Column(String(50), nullable=True)
    status = Column(String(20), default="approved", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<BlogGuestbook {self.nickname}>"


class BlogDanmaku(Base):
    """弹幕表"""
    __tablename__ = "blog_danmaku"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(String(100), nullable=False)
    color = Column(String(20), default="#ffffff")
    position = Column(String(20), default="scroll")  # top / scroll / bottom
    nickname = Column(String(50), nullable=True)
    ip = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<BlogDanmaku {self.content}>"


class BlogFriendLink(Base):
    """友链表"""
    __tablename__ = "blog_friend_links"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), nullable=False)
    url = Column(String(500), nullable=False)
    avatar = Column(String(500), nullable=True)
    description = Column(String(200), nullable=True)
    sort_order = Column(Integer, default=0)
    status = Column(String(20), default="approved", index=True)  # pending / approved
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<BlogFriendLink {self.name}>"


class BlogSiteConfig(Base):
    """站点配置表"""
    __tablename__ = "blog_site_config"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    site_name = Column(String(100), default="明月工作室")
    site_subtitle = Column(String(200), nullable=True)
    site_description = Column(String(500), nullable=True)
    logo_url = Column(String(500), nullable=True)
    favicon_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    icp_number = Column(String(50), nullable=True)
    footer_text = Column(String(500), nullable=True)
    social_links = Column(Text, nullable=True)  # JSON
    custom_css = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<BlogSiteConfig {self.site_name}>"
