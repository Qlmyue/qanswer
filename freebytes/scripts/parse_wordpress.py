"""
WordPress XML 解析脚本
解析 WordPress eXtended RSS (WXR) 导出文件
"""
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from datetime import datetime
import re


@dataclass
class WpPost:
    """WordPress 文章"""
    post_id: int
    title: str
    link: str
    pub_date: str
    creator: str
    content: str
    excerpt: str
    post_name: str  # slug
    status: str
    post_type: str
    categories: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    comments: list[dict] = field(default_factory=list)
    meta: dict = field(default_factory=dict)
    is_sticky: bool = False


@dataclass
class WpCategory:
    """WordPress 分类"""
    name: str
    slug: str
    parent: str = ""


@dataclass
class WpTag:
    """WordPress 标签"""
    name: str
    slug: str


@dataclass
class WpAttachment:
    """WordPress 附件"""
    post_id: int
    title: str
    url: str
    parent_id: int = 0


def parse_wordpress_xml(xml_path: str) -> dict:
    """解析 WordPress XML 导出文件"""
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # 命名空间
    ns = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'dc': 'http://purl.org/dc/elements/1.1/',
    }

    posts = []
    categories = []
    tags = []
    attachments = []

    # 解析分类
    for cat in root.findall('.//wp:category', ns):
        name = cat.find('wp:cat_name', ns).text or ''
        slug = cat.find('wp:category_nicename', ns).text or ''
        parent = cat.find('wp:category_parent', ns)
        parent_text = parent.text if parent is not None and parent.text else ''
        categories.append(WpCategory(name=name, slug=slug, parent=parent_text))

    # 解析标签
    for tag in root.findall('.//wp:tag', ns):
        name = tag.find('wp:tag_name', ns).text or ''
        slug = tag.find('wp:tag_slug', ns).text or ''
        tags.append(WpTag(name=name, slug=slug))

    # 解析文章
    for item in root.findall('.//item'):
        post_type = item.find('wp:post_type', ns)
        if post_type is None:
            continue

        post_type_text = post_type.text or ''

        # 只处理文章和页面
        if post_type_text not in ('post', 'page'):
            # 处理附件
            if post_type_text == 'attachment':
                post_id = int(item.find('wp:post_id', ns).text or '0')
                title = item.find('title').text or ''
                attachment_url = item.find('wp:attachment_url', ns)
                url = attachment_url.text if attachment_url is not None else ''
                parent_id = int(item.find('wp:post_parent', ns).text or '0')
                attachments.append(WpAttachment(
                    post_id=post_id, title=title, url=url, parent_id=parent_id
                ))
            continue

        post_id = int(item.find('wp:post_id', ns).text or '0')
        title = item.find('title').text or ''
        link = item.find('link').text or ''
        pub_date = item.find('pubDate').text or ''
        creator = item.find('dc:creator', ns).text or ''

        content_elem = item.find('content:encoded', ns)
        content = content_elem.text if content_elem is not None and content_elem.text else ''

        excerpt_elem = item.find('excerpt:encoded', ns)
        excerpt = excerpt_elem.text if excerpt_elem is not None and excerpt_elem.text else ''

        post_name = item.find('wp:post_name', ns)
        slug = post_name.text if post_name is not None else ''

        status = item.find('wp:status', ns)
        status_text = status.text if status is not None else 'draft'

        is_sticky = item.find('wp:is_sticky', ns)
        sticky = is_sticky is not None and is_sticky.text == '1'

        # 分类
        post_categories = []
        for cat in item.findall('category'):
            domain = cat.get('domain', '')
            if domain == 'category':
                post_categories.append(cat.text or '')

        # 标签
        post_tags = []
        for tag in item.findall('category'):
            domain = cat.get('domain', '')
            if domain == 'post_tag':
                post_tags.append(tag.text or '')

        # 评论
        comments = []
        for comment in item.findall('wp:comment', ns):
            comment_id = comment.find('wp:comment_id', ns)
            comment_author = comment.find('wp:comment_author', ns)
            comment_email = comment.find('wp:comment_author_email', ns)
            comment_content = comment.find('wp:comment_content', ns)
            comment_date = comment.find('wp:comment_date', ns)
            comment_approved = comment.find('wp:comment_approved', ns)

            comments.append({
                'id': comment_id.text if comment_id is not None else '',
                'author': comment_author.text if comment_author is not None else '',
                'email': comment_email.text if comment_email is not None else '',
                'content': comment_content.text if comment_content is not None else '',
                'date': comment_date.text if comment_date is not None else '',
                'approved': comment_approved.text if comment_approved is not None else '1',
            })

        # 文章元数据
        meta = {}
        for postmeta in item.findall('wp:postmeta', ns):
            key = postmeta.find('wp:meta_key', ns)
            value = postmeta.find('wp:meta_value', ns)
            if key is not None and value is not None:
                meta[key.text] = value.text

        posts.append(WpPost(
            post_id=post_id,
            title=title,
            link=link,
            pub_date=pub_date,
            creator=creator,
            content=content,
            excerpt=excerpt,
            post_name=slug,
            status=status_text,
            post_type=post_type_text,
            categories=post_categories,
            tags=post_tags,
            comments=comments,
            meta=meta,
            is_sticky=sticky,
        ))

    return {
        'posts': posts,
        'categories': categories,
        'tags': tags,
        'attachments': attachments,
    }


def clean_gutenberg_content(content: str) -> str:
    """清理 Gutenberg 块标记，保留纯 HTML"""
    # 移除 Gutenberg 注释
    content = re.sub(r'<!--\s*wp:[^>]*?-->', '', content)
    content = re.sub(r'<!--\s*/wp:[^>]*?-->', '', content)

    # 清理空行
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content.strip()


if __name__ == '__main__':
    import sys

    xml_path = sys.argv[1] if len(sys.argv) > 1 else 'WordPress.2026-09-08.xml'
    data = parse_wordpress_xml(xml_path)

    print(f"解析完成:")
    print(f"  - 文章: {len([p for p in data['posts'] if p.post_type == 'post'])}")
    print(f"  - 页面: {len([p for p in data['posts'] if p.post_type == 'page'])}")
    print(f"  - 分类: {len(data['categories'])}")
    print(f"  - 标签: {len(data['tags'])}")
    print(f"  - 附件: {len(data['attachments'])}")

    # 显示分类
    print("\n分类列表:")
    for cat in data['categories']:
        print(f"  - {cat.name} ({cat.slug})")

    # 显示标签
    print("\n标签列表:")
    for tag in data['tags'][:20]:
        print(f"  - {tag.name} ({tag.slug})")
    if len(data['tags']) > 20:
        print(f"  ... 还有 {len(data['tags']) - 20} 个标签")
