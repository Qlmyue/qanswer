"""
博客业务逻辑服务
"""
import uuid
from datetime import datetime
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models.blog import (
    BlogPost, BlogCategory, BlogTag, BlogComment,
    BlogGuestbook, BlogDanmaku, BlogFriendLink, BlogSiteConfig,
    post_tags,
)
from ..schemas.blog import (
    PostCreate, PostUpdate, CategoryCreate, CategoryUpdate,
    CommentCreate, GuestbookCreate, DanmakuCreate,
    FriendLinkCreate, FriendLinkUpdate, SiteConfigUpdate,
)


class BlogService:
    """博客服务类"""

    def __init__(self, db: AsyncSession):
        self.db = db

    # ========== 文章 ==========

    async def get_posts(
        self,
        page: int = 1,
        page_size: int = 12,
        category: str | None = None,
        tag: str | None = None,
        search: str | None = None,
        status: str | None = None,
    ) -> tuple[list[BlogPost], int]:
        """获取文章列表"""
        query = select(BlogPost).options(
            selectinload(BlogPost.category),
            selectinload(BlogPost.tags),
        )

        # 状态过滤
        if status:
            query = query.where(BlogPost.status == status)
        else:
            query = query.where(BlogPost.status == "published")

        # 分类过滤
        if category:
            query = query.join(BlogCategory).where(BlogCategory.slug == category)

        # 标签过滤
        if tag:
            query = query.join(post_tags).join(BlogTag).where(BlogTag.slug == tag)

        # 搜索
        if search:
            search_filter = or_(
                BlogPost.title.ilike(f"%{search}%"),
                BlogPost.summary.ilike(f"%{search}%"),
            )
            query = query.where(search_filter)

        # 获取总数
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar() or 0

        # 分页
        query = query.order_by(BlogPost.is_top.desc(), BlogPost.published_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(query)
        posts = list(result.scalars().all())

        return posts, total

    async def get_post_by_slug(self, slug: str) -> BlogPost | None:
        """通过 slug 获取文章"""
        query = (
            select(BlogPost)
            .options(
                selectinload(BlogPost.category),
                selectinload(BlogPost.tags),
            )
            .where(BlogPost.slug == slug)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_post_by_id(self, post_id: str) -> BlogPost | None:
        """通过 ID 获取文章"""
        query = (
            select(BlogPost)
            .options(
                selectinload(BlogPost.category),
                selectinload(BlogPost.tags),
            )
            .where(BlogPost.id == post_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_post(self, data: PostCreate, author_id: str | None = None) -> BlogPost:
        """创建文章"""
        post = BlogPost(
            id=str(uuid.uuid4()),
            title=data.title,
            slug=data.slug,
            summary=data.summary,
            content_md=data.content_md,
            cover_url=data.cover_url,
            category_id=data.category_id,
            author_id=author_id,
            status=data.status,
            is_top=data.is_top,
            word_count=len(data.content_md),
            reading_time=max(1, len(data.content_md) // 300),
            published_at=datetime.utcnow() if data.status == "published" else None,
        )

        # 添加标签
        if data.tag_ids:
            tags = (await self.db.execute(
                select(BlogTag).where(BlogTag.id.in_(data.tag_ids))
            )).scalars().all()
            post.tags = list(tags)

        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)

        # 更新分类计数
        if post.category_id:
            await self._update_category_count(post.category_id)

        return post

    async def update_post(self, post_id: str, data: PostUpdate) -> BlogPost | None:
        """更新文章"""
        post = await self.get_post_by_id(post_id)
        if not post:
            return None

        update_data = data.model_dump(exclude_unset=True)
        tag_ids = update_data.pop("tag_ids", None)

        for key, value in update_data.items():
            setattr(post, key, value)

        if tag_ids is not None:
            tags = (await self.db.execute(
                select(BlogTag).where(BlogTag.id.in_(tag_ids))
            )).scalars().all()
            post.tags = list(tags)

        if data.content_md:
            post.word_count = len(data.content_md)
            post.reading_time = max(1, len(data.content_md) // 300)

        if data.status == "published" and not post.published_at:
            post.published_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(post)
        return post

    async def delete_post(self, post_id: str) -> bool:
        """删除文章"""
        post = await self.get_post_by_id(post_id)
        if not post:
            return False

        category_id = post.category_id
        await self.db.delete(post)
        await self.db.commit()

        if category_id:
            await self._update_category_count(category_id)

        return True

    async def increment_views(self, post_id: str) -> None:
        """增加阅读量"""
        post = await self.get_post_by_id(post_id)
        if post:
            post.views += 1
            await self.db.commit()

    # ========== 分类 ==========

    async def get_categories(self) -> list[BlogCategory]:
        """获取所有分类"""
        query = select(BlogCategory).order_by(BlogCategory.sort_order, BlogCategory.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_category(self, data: CategoryCreate) -> BlogCategory:
        """创建分类"""
        category = BlogCategory(
            id=str(uuid.uuid4()),
            name=data.name,
            slug=data.slug,
            icon=data.icon,
            parent_id=data.parent_id,
            sort_order=data.sort_order,
        )
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def update_category(self, cat_id: str, data: CategoryUpdate) -> BlogCategory | None:
        """更新分类"""
        query = select(BlogCategory).where(BlogCategory.id == cat_id)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()
        if not category:
            return None

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(category, key, value)

        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def delete_category(self, cat_id: str) -> bool:
        """删除分类"""
        query = select(BlogCategory).where(BlogCategory.id == cat_id)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()
        if not category:
            return False

        await self.db.delete(category)
        await self.db.commit()
        return True

    async def _update_category_count(self, cat_id: str) -> None:
        """更新分类文章计数"""
        count = (await self.db.execute(
            select(func.count()).where(BlogPost.category_id == cat_id)
        )).scalar() or 0

        query = select(BlogCategory).where(BlogCategory.id == cat_id)
        result = await self.db.execute(query)
        category = result.scalar_one_or_none()
        if category:
            category.post_count = count
            await self.db.commit()

    # ========== 标签 ==========

    async def get_tags(self) -> list[BlogTag]:
        """获取所有标签"""
        query = select(BlogTag).order_by(BlogTag.post_count.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # ========== 评论 ==========

    async def get_comments(self, post_id: str) -> list[BlogComment]:
        """获取文章评论"""
        query = (
            select(BlogComment)
            .where(BlogComment.post_id == post_id, BlogComment.parent_id.is_(None))
            .options(selectinload(BlogComment.replies))
            .order_by(BlogComment.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_comment(self, post_id: str, data: CommentCreate) -> BlogComment:
        """创建评论"""
        comment = BlogComment(
            id=str(uuid.uuid4()),
            post_id=post_id,
            parent_id=data.parent_id,
            nickname=data.nickname,
            email=data.email,
            website=data.website,
            content=data.content,
        )
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def delete_comment(self, comment_id: str) -> bool:
        """删除评论"""
        query = select(BlogComment).where(BlogComment.id == comment_id)
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()
        if not comment:
            return False

        await self.db.delete(comment)
        await self.db.commit()
        return True

    async def update_comment_status(self, comment_id: str, status: str) -> bool:
        """更新评论状态"""
        query = select(BlogComment).where(BlogComment.id == comment_id)
        result = await self.db.execute(query)
        comment = result.scalar_one_or_none()
        if not comment:
            return False

        comment.status = status
        await self.db.commit()
        return True

    # ========== 留言板 ==========

    async def get_guestbook(self, page: int = 1, page_size: int = 20) -> tuple[list[BlogGuestbook], int]:
        """获取留言列表"""
        query = select(BlogGuestbook).where(BlogGuestbook.status == "approved")

        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar() or 0

        query = query.order_by(BlogGuestbook.created_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def create_guestbook(self, data: GuestbookCreate) -> BlogGuestbook:
        """创建留言"""
        message = BlogGuestbook(
            id=str(uuid.uuid4()),
            nickname=data.nickname,
            email=data.email,
            content=data.content,
        )
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def delete_guestbook(self, msg_id: str) -> bool:
        """删除留言"""
        query = select(BlogGuestbook).where(BlogGuestbook.id == msg_id)
        result = await self.db.execute(query)
        msg = result.scalar_one_or_none()
        if not msg:
            return False

        await self.db.delete(msg)
        await self.db.commit()
        return True

    # ========== 弹幕 ==========

    async def get_danmaku(self, limit: int = 50) -> list[BlogDanmaku]:
        """获取弹幕列表"""
        query = select(BlogDanmaku).order_by(BlogDanmaku.created_at.desc()).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_danmaku(self, data: DanmakuCreate) -> BlogDanmaku:
        """创建弹幕"""
        danmaku = BlogDanmaku(
            id=str(uuid.uuid4()),
            content=data.content,
            color=data.color,
            position=data.position,
            nickname=data.nickname,
        )
        self.db.add(danmaku)
        await self.db.commit()
        await self.db.refresh(danmaku)
        return danmaku

    async def delete_danmaku(self, danmaku_id: str) -> bool:
        """删除弹幕"""
        query = select(BlogDanmaku).where(BlogDanmaku.id == danmaku_id)
        result = await self.db.execute(query)
        danmaku = result.scalar_one_or_none()
        if not danmaku:
            return False

        await self.db.delete(danmaku)
        await self.db.commit()
        return True

    # ========== 友链 ==========

    async def get_friends(self) -> list[BlogFriendLink]:
        """获取友链列表"""
        query = (
            select(BlogFriendLink)
            .where(BlogFriendLink.status == "approved")
            .order_by(BlogFriendLink.sort_order, BlogFriendLink.name)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_friend(self, data: FriendLinkCreate) -> BlogFriendLink:
        """创建友链"""
        friend = BlogFriendLink(
            id=str(uuid.uuid4()),
            name=data.name,
            url=data.url,
            avatar=data.avatar,
            description=data.description,
        )
        self.db.add(friend)
        await self.db.commit()
        await self.db.refresh(friend)
        return friend

    async def update_friend(self, friend_id: str, data: FriendLinkUpdate) -> BlogFriendLink | None:
        """更新友链"""
        query = select(BlogFriendLink).where(BlogFriendLink.id == friend_id)
        result = await self.db.execute(query)
        friend = result.scalar_one_or_none()
        if not friend:
            return None

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(friend, key, value)

        await self.db.commit()
        await self.db.refresh(friend)
        return friend

    async def delete_friend(self, friend_id: str) -> bool:
        """删除友链"""
        query = select(BlogFriendLink).where(BlogFriendLink.id == friend_id)
        result = await self.db.execute(query)
        friend = result.scalar_one_or_none()
        if not friend:
            return False

        await self.db.delete(friend)
        await self.db.commit()
        return True

    # ========== 站点配置 ==========

    async def get_site_config(self) -> BlogSiteConfig:
        """获取站点配置"""
        query = select(BlogSiteConfig).limit(1)
        result = await self.db.execute(query)
        config = result.scalar_one_or_none()

        if not config:
            # 创建默认配置
            config = BlogSiteConfig(id=str(uuid.uuid4()))
            self.db.add(config)
            await self.db.commit()
            await self.db.refresh(config)

        return config

    async def update_site_config(self, data: SiteConfigUpdate) -> BlogSiteConfig:
        """更新站点配置"""
        config = await self.get_site_config()

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(config, key, value)

        await self.db.commit()
        await self.db.refresh(config)
        return config

    # ========== 首页数据 ==========

    async def get_home_data(self) -> dict:
        """获取首页数据"""
        # 统计数据
        total_posts = (await self.db.execute(
            select(func.count()).where(BlogPost.status == "published")
        )).scalar() or 0

        total_categories = (await self.db.execute(
            select(func.count()).select_from(BlogCategory)
        )).scalar() or 0

        total_tags = (await self.db.execute(
            select(func.count()).select_from(BlogTag)
        )).scalar() or 0

        total_views = (await self.db.execute(
            select(func.coalesce(func.sum(BlogPost.views), 0))
        )).scalar() or 0

        # 分类及文章
        categories = (await self.db.execute(
            select(BlogCategory).order_by(BlogCategory.sort_order)
        )).scalars().all()

        category_posts = []
        for cat in categories[:6]:
            posts = (await self.db.execute(
                select(BlogPost)
                .options(selectinload(BlogPost.category), selectinload(BlogPost.tags))
                .where(BlogPost.category_id == cat.id, BlogPost.status == "published")
                .order_by(BlogPost.published_at.desc())
                .limit(6)
            )).scalars().all()
            if posts:
                category_posts.append({"category": cat, "posts": list(posts)})

        # 最近弹幕
        recent_danmaku = (await self.db.execute(
            select(BlogDanmaku).order_by(BlogDanmaku.created_at.desc()).limit(20)
        )).scalars().all()

        return {
            "featured_posts": [],
            "category_posts": category_posts,
            "stats": {
                "total_posts": total_posts,
                "total_categories": total_categories,
                "total_tags": total_tags,
                "total_views": total_views,
            },
            "recent_danmaku": list(recent_danmaku),
        }
