"""
WordPress 数据迁移主脚本
将 WordPress 导出数据迁移到新的博客系统
"""
import os
import sys
import json
import asyncio
import hashlib
from datetime import datetime

# 修复 Windows 控制台编码问题
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# 添加项目路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from parse_wordpress import parse_wordpress_xml, clean_gutenberg_content
from html_to_markdown import html_to_markdown, generate_frontmatter


def generate_slug(title: str, post_name: str = '') -> str:
    """生成 URL slug"""
    if post_name:
        return post_name

    # 将中文标题转为拼音式的 slug（简化处理）
    slug = title.lower()
    slug = slug.replace(' ', '-')
    # 移除特殊字符
    slug = ''.join(c for c in slug if c.isalnum() or c == '-')
    # 去除连续的 -
    slug = '-'.join(filter(None, slug.split('-')))
    return slug[:50]


def get_year_from_date(date_str: str) -> int:
    """从日期字符串中提取年份"""
    try:
        # WordPress 日期格式: Thu, 30 Mar 2023 05:37:23 +0000
        dt = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
        return dt.year
    except:
        try:
            # 尝试 YYYY-MM-DD 格式
            return int(date_str[:4])
        except:
            return 2023


def format_date(date_str: str) -> str:
    """格式化日期"""
    try:
        dt = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return date_str


def migrate_wordpress(
    xml_path: str,
    output_dir: str = 'content/posts',
    download_images: bool = True,
):
    """执行 WordPress 数据迁移"""

    print("=" * 60)
    print("WordPress 数据迁移工具")
    print("=" * 60)

    # 1. 解析 XML
    print("\n[1/4] 解析 WordPress XML...")
    data = parse_wordpress_xml(xml_path)

    posts = [p for p in data['posts'] if p.post_type == 'post' and p.status == 'publish']
    categories = data['categories']
    tags = data['tags']
    attachments = data['attachments']

    print(f"  - 已发布文章: {len(posts)}")
    print(f"  - 分类: {len(categories)}")
    print(f"  - 标签: {len(tags)}")
    print(f"  - 附件: {len(attachments)}")

    # 2. 转换为 Markdown
    print("\n[2/4] 转换为 Markdown...")
    migrated_posts = []
    migration_stats = {
        'total': len(posts),
        'success': 0,
        'failed': 0,
        'categories': len(categories),
        'tags': len(tags),
    }

    for i, post in enumerate(posts):
        try:
            # 清理 Gutenberg 标记
            clean_html = clean_gutenberg_content(post.content)

            # 转换为 Markdown
            markdown_content = html_to_markdown(clean_html)

            # 生成 slug
            slug = generate_slug(post.title, post.post_name)

            # 获取年份
            year = get_year_from_date(post.pub_date)

            # 获取分类
            category = post.categories[0] if post.categories else ''

            # 生成 frontmatter
            frontmatter = generate_frontmatter({
                'title': post.title,
                'slug': slug,
                'date': format_date(post.pub_date),
                'category': category,
                'tags': post.tags,
                'summary': post.excerpt[:150] if post.excerpt else '',
                'status': 'published',
                'views': int(post.meta.get('views', '0')),
            })

            # 完整的 Markdown 文件内容
            full_content = f"{frontmatter}\n\n{markdown_content}"

            migrated_posts.append({
                'title': post.title,
                'slug': slug,
                'year': year,
                'category': category,
                'tags': post.tags,
                'content': full_content,
                'markdown': markdown_content,
                'comments': post.comments,
                'views': int(post.meta.get('views', '0')),
                'date': format_date(post.pub_date),
                'post_id': post.post_id,
            })

            migration_stats['success'] += 1
            print(f"  [{i+1}/{len(posts)}] OK {post.title}")

        except Exception as e:
            migration_stats['failed'] += 1
            print(f"  [{i+1}/{len(posts)}] FAIL {post.title}: {e}")

    # 3. 保存 Markdown 文件
    print("\n[3/4] 保存 Markdown 文件...")
    saved_count = 0

    for post in migrated_posts:
        try:
            # 创建目录
            post_dir = os.path.join(output_dir, str(post['year']), post['slug'])
            os.makedirs(post_dir, exist_ok=True)

            # 保存 Markdown 文件
            md_path = os.path.join(post_dir, 'index.md')
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(post['content'])

            saved_count += 1

        except Exception as e:
            print(f"  保存失败: {post['title']} - {e}")

    print(f"  已保存 {saved_count} 个文件")

    # 4. 保存迁移元数据（用于后续导入数据库）
    print("\n[4/4] 保存迁移元数据...")
    meta_path = os.path.join(output_dir, 'migration_meta.json')

    # 准备保存的数据
    save_data = {
        'migrated_at': datetime.now().isoformat(),
        'stats': migration_stats,
        'categories': [{'name': c.name, 'slug': c.slug, 'parent': c.parent} for c in categories],
        'tags': [{'name': t.name, 'slug': t.slug} for t in tags],
        'posts': [{
            'title': p['title'],
            'slug': p['slug'],
            'year': p['year'],
            'category': p['category'],
            'tags': p['tags'],
            'views': p['views'],
            'date': p['date'],
            'post_id': p['post_id'],
            'comments_count': len(p['comments']),
        } for p in migrated_posts],
    }

    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(save_data, f, ensure_ascii=False, indent=2)

    print(f"  元数据已保存到: {meta_path}")

    # 打印统计
    print("\n" + "=" * 60)
    print("迁移完成!")
    print("=" * 60)
    print(f"  - 总文章数: {migration_stats['total']}")
    print(f"  - 成功: {migration_stats['success']}")
    print(f"  - 失败: {migration_stats['failed']}")
    print(f"  - 分类数: {migration_stats['categories']}")
    print(f"  - 标签数: {migration_stats['tags']}")

    return save_data


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='WordPress 数据迁移工具')
    parser.add_argument('xml_path', help='WordPress XML 导出文件路径')
    parser.add_argument('--output', '-o', default='content/posts', help='输出目录')
    parser.add_argument('--no-images', action='store_true', help='不下载图片')

    args = parser.parse_args()

    migrate_wordpress(
        xml_path=args.xml_path,
        output_dir=args.output,
        download_images=not args.no_images,
    )
