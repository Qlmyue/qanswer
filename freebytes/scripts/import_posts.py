"""
导入文章数据到数据库
"""
import os
import sys
import json
import uuid
import re
from datetime import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from sqlalchemy import select, insert
from src.core.database import init_db, async_session_factory
from src.models.blog import BlogPost, BlogCategory, BlogTag, post_tags


def extract_summary(content: str, max_len: int = 150) -> str:
    """提取摘要"""
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            content = content[end+3:].strip()

    text = re.sub(r'#+\s+', '', content)
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'`(.+?)`', r'\1', text)
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
    text = re.sub(r'!\[.*?\]\(.+?\)', '', text)
    text = re.sub(r'>\s+', '', text)
    text = re.sub(r'[-*+]\s+', '', text)
    text = re.sub(r'\n+', ' ', text).strip()

    if len(text) <= max_len:
        return text
    return text[:max_len] + '...'


async def import_posts():
    """导入文章"""
    meta_path = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts', 'migration_meta.json')
    content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')

    with open(meta_path, 'r', encoding='utf-8') as f:
        meta = json.load(f)

    print("开始导入文章...")
    print(f"共 {len(meta['posts'])} 篇文章待导入")

    await init_db()

    async with async_session_factory() as session:
        # 获取分类和标签映射
        cats = (await session.execute(select(BlogCategory))).scalars().all()
        cat_map = {c.name: c.id for c in cats}

        tags = (await session.execute(select(BlogTag))).scalars().all()
        tag_map = {t.name: t for t in tags}

        imported = 0
        skipped = 0

        for i, post_data in enumerate(meta['posts']):
            # 检查是否已存在
            existing = await session.execute(
                select(BlogPost).where(BlogPost.slug == post_data['slug'])
            )
            if existing.scalar_one_or_none():
                skipped += 1
                continue

            # 读取 Markdown 内容
            md_path = os.path.join(content_dir, str(post_data['year']), post_data['slug'], 'index.md')
            content_md = ''
            if os.path.exists(md_path):
                with open(md_path, 'r', encoding='utf-8') as f:
                    content_md = f.read()
            else:
                print(f"  文件不存在: {md_path}")
                continue

            # 解析日期
            try:
                pub_date = datetime.strptime(post_data['date'], '%Y-%m-%d %H:%M:%S')
            except:
                pub_date = datetime.now()

            # 创建文章
            post_id = str(uuid.uuid4())
            post = BlogPost(
                id=post_id,
                title=post_data['title'],
                slug=post_data['slug'],
                summary=extract_summary(content_md),
                content_md=content_md,
                category_id=cat_map.get(post_data.get('category', '')),
                status='published',
                views=post_data.get('views', 0),
                word_count=len(content_md),
                reading_time=max(1, len(content_md) // 300),
                published_at=pub_date,
            )

            session.add(post)
            imported += 1

            if imported % 20 == 0:
                print(f"  已导入 {imported} 篇...")
                await session.commit()

        await session.commit()

        # 批量插入标签关联
        print("  插入标签关联...")
        for post_data in meta['posts']:
            post = (await session.execute(
                select(BlogPost).where(BlogPost.slug == post_data['slug'])
            )).scalar_one_or_none()

            if not post:
                continue

            for tag_name in set(post_data.get('tags', [])):
                if tag_name in tag_map:
                    try:
                        await session.execute(
                            insert(post_tags).values(post_id=post.id, tag_id=tag_map[tag_name].id)
                        )
                    except:
                        pass  # 忽略重复

        await session.commit()

        print(f"\n导入完成!")
        print(f"  - 成功导入: {imported} 篇")
        print(f"  - 跳过已存在: {skipped} 篇")

        # 验证
        count = (await session.execute(select(BlogPost).where(BlogPost.status == 'published'))).scalars().all()
        print(f"  - 数据库中文章总数: {len(count)}")


if __name__ == '__main__':
    import asyncio
    asyncio.run(import_posts())
