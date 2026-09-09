"""
将迁移的 Markdown 数据导入数据库
"""
import os
import sys
import json
import asyncio
import uuid
from datetime import datetime

# 修复 Windows 控制台编码问题
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# 添加项目路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from sqlalchemy import select
from src.core.database import init_db, async_session_factory
from src.models.blog import (
    BlogPost, BlogCategory, BlogTag, BlogSiteConfig,
    post_tags
)


def generate_id():
    return str(uuid.uuid4())


async def import_data(meta_path: str, content_dir: str):
    """导入数据到数据库"""

    # 读取迁移元数据
    with open(meta_path, 'r', encoding='utf-8') as f:
        meta = json.load(f)

    print("=" * 60)
    print("导入数据到数据库")
    print("=" * 60)

    # 初始化数据库
    await init_db()

    async with async_session_factory() as session:
        # 1. 导入分类
        print("\n[1/4] 导入分类...")
        category_map = {}  # name -> id

        for cat_data in meta['categories']:
            # 检查是否已存在
            existing = await session.execute(
                select(BlogCategory).where(BlogCategory.slug == cat_data['slug'])
            )
            if existing.scalar_one_or_none():
                print(f"  跳过已存在: {cat_data['name']}")
                continue

            cat = BlogCategory(
                id=generate_id(),
                name=cat_data['name'],
                slug=cat_data['slug'],
                icon=get_category_icon(cat_data['name']),
            )
            session.add(cat)
            category_map[cat_data['name']] = cat.id
            print(f"  添加: {cat_data['name']}")

        await session.commit()

        # 获取所有分类（包括已存在的）
        all_cats = await session.execute(select(BlogCategory))
        for cat in all_cats.scalars().all():
            category_map[cat.name] = cat.id

        print(f"  共 {len(category_map)} 个分类")

        # 2. 导入标签
        print("\n[2/4] 导入标签...")
        tag_map = {}  # name -> id

        for tag_data in meta['tags']:
            existing = await session.execute(
                select(BlogTag).where(BlogTag.name == tag_data['name'])
            )
            if existing.scalar_one_or_none():
                continue

            tag = BlogTag(
                id=generate_id(),
                name=tag_data['name'],
                slug=tag_data['slug'],
            )
            session.add(tag)
            tag_map[tag_data['name']] = tag.id

        await session.commit()

        # 获取所有标签
        all_tags = await session.execute(select(BlogTag))
        for tag in all_tags.scalars().all():
            tag_map[tag.name] = tag.id

        print(f"  共 {len(tag_map)} 个标签")

        # 3. 导入文章
        print("\n[3/4] 导入文章...")
        imported = 0
        skipped = 0

        for post_data in meta['posts']:
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

            # 解析日期
            try:
                pub_date = datetime.strptime(post_data['date'], '%Y-%m-%d %H:%M:%S')
            except:
                pub_date = datetime.now()

            # 创建文章
            post = BlogPost(
                id=generate_id(),
                title=post_data['title'],
                slug=post_data['slug'],
                summary=extract_summary(content_md),
                content_md=content_md,
                category_id=category_map.get(post_data['category']),
                status='published',
                views=post_data.get('views', 0),
                word_count=len(content_md),
                reading_time=max(1, len(content_md) // 300),
                published_at=pub_date,
            )

            # 添加标签
            for tag_name in post_data.get('tags', []):
                if tag_name in tag_map:
                    tag = await session.get(BlogTag, tag_map[tag_name])
                    if tag:
                        post.tags.append(tag)

            session.add(post)
            imported += 1

            if imported % 20 == 0:
                print(f"  已导入 {imported} 篇...")

        await session.commit()
        print(f"  导入完成: {imported} 篇, 跳过: {skipped} 篇")

        # 4. 更新分类计数
        print("\n[4/4] 更新分类计数...")
        for cat_name, cat_id in category_map.items():
            count = len([p for p in meta['posts'] if p.get('category') == cat_name])
            cat = await session.get(BlogCategory, cat_id)
            if cat:
                cat.post_count = count

        await session.commit()
        print("  计数更新完成")

    print("\n" + "=" * 60)
    print("导入完成!")
    print("=" * 60)


def get_category_icon(name: str) -> str:
    """获取分类图标"""
    icons = {
        '技术博客': '📝',
        '寥寥随笔': '🖊️',
        '原创小说': '📖',
        '时事新闻': '📰',
        '经济学': '📊',
        '资源分享': '🔗',
        '数据库': '🗄️',
        '网络': '🌐',
        'C语言': '💻',
        'java': '☕',
        'Linux': '🐧',
        '前端': '🎨',
        '大数据': '📈',
    }
    return icons.get(name, '📁')


def extract_summary(content: str, max_len: int = 150) -> str:
    """提取摘要"""
    # 去除 frontmatter
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            content = content[end+3:].strip()

    # 去除 Markdown 语法
    import re
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


if __name__ == '__main__':
    meta_path = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts', 'migration_meta.json')
    content_dir = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')

    asyncio.run(import_data(meta_path, content_dir))
