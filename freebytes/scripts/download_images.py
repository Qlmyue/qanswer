"""
图片下载脚本
从 WordPress 导出的文章内容中下载所有图片
"""
import os
import re
import time
import hashlib
import requests
from urllib.parse import urlparse, urljoin


def extract_image_urls(content: str) -> list[str]:
    """从 HTML/Markdown 内容中提取图片 URL"""
    # 匹配 <img src="..."> 格式
    img_pattern = r'<img[^>]+src=["\']([^"\']+)["\']'
    urls = re.findall(img_pattern, content)

    # 匹配 ![alt](url) 格式
    md_pattern = r'!\[[^\]]*\]\(([^)]+)\)'
    urls.extend(re.findall(md_pattern, content))

    # 去重
    return list(set(urls))


def download_image(url: str, save_dir: str, timeout: int = 30) -> str | None:
    """下载单张图片"""
    try:
        # 生成文件名
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path)
        if not filename or '.' not in filename:
            # 使用 URL 的 MD5 作为文件名
            ext = '.jpg'
            filename = hashlib.md5(url.encode()).hexdigest() + ext

        save_path = os.path.join(save_dir, filename)

        # 如果已存在，跳过
        if os.path.exists(save_path):
            return filename

        # 下载
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=timeout, stream=True)
        response.raise_for_status()

        # 保存
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return filename

    except Exception as e:
        print(f"  下载失败: {url} - {e}")
        return None


def download_images_for_post(
    content: str,
    post_slug: str,
    year: int,
    base_dir: str = "content/posts",
) -> tuple[str, list[str]]:
    """为单篇文章下载图片并更新内容中的 URL"""
    # 创建保存目录
    save_dir = os.path.join(base_dir, str(year), post_slug, "images")
    os.makedirs(save_dir, exist_ok=True)

    # 提取图片 URL
    image_urls = extract_image_urls(content)
    if not image_urls:
        return content, []

    downloaded = []
    url_mapping = {}

    for url in image_urls:
        # 跳过相对路径
        if url.startswith('./') or url.startswith('../'):
            continue

        print(f"  下载: {url}")
        filename = download_image(url, save_dir)

        if filename:
            # 映射旧 URL 到新路径
            new_path = f"./images/{filename}"
            url_mapping[url] = new_path
            downloaded.append(filename)

        # 限速：每次下载后等待 0.5 秒
        time.sleep(0.5)

    # 更新内容中的 URL
    for old_url, new_path in url_mapping.items():
        content = content.replace(old_url, new_path)

    return content, downloaded


def batch_download_images(
    posts: list[dict],
    base_dir: str = "content/posts",
    delay: float = 1.0,
) -> dict:
    """批量下载所有文章的图片"""
    stats = {
        'total_posts': len(posts),
        'posts_with_images': 0,
        'total_images': 0,
        'downloaded': 0,
        'failed': 0,
    }

    for i, post in enumerate(posts):
        content = post.get('content', '')
        slug = post.get('slug', f"post-{i}")
        year = post.get('year', 2023)

        image_urls = extract_image_urls(content)
        if not image_urls:
            continue

        stats['posts_with_images'] += 1
        stats['total_images'] += len(image_urls)

        print(f"\n[{i+1}/{len(posts)}] 处理文章: {post.get('title', slug)}")
        print(f"  发现 {len(image_urls)} 张图片")

        new_content, downloaded = download_images_for_post(
            content, slug, year, base_dir
        )

        stats['downloaded'] += len(downloaded)
        stats['failed'] += len(image_urls) - len(downloaded)

        # 更新内容
        post['content'] = new_content

        # 限速
        time.sleep(delay)

    return stats


if __name__ == '__main__':
    import json

    # 测试
    test_url = "https://www.freebytes.net/wp-content/uploads/2019/08/image-1.png"
    save_dir = "test_images"
    os.makedirs(save_dir, exist_ok=True)

    print(f"测试下载: {test_url}")
    result = download_image(test_url, save_dir)
    if result:
        print(f"下载成功: {result}")
    else:
        print("下载失败")
