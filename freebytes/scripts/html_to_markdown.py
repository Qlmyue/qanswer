"""
HTML → Markdown 转换脚本
将 WordPress Gutenberg HTML 内容转换为 Markdown 格式
"""
import re
from html.parser import HTMLParser


class HtmlToMarkdownParser(HTMLParser):
    """简单的 HTML → Markdown 转换器"""

    def __init__(self):
        super().__init__()
        self.markdown = []
        self.current_tag = None
        self.tag_stack = []
        self.list_type = []  # 'ul' or 'ol'
        self.list_counter = 0
        self.in_pre = False
        self.in_code = False
        self.in_blockquote = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        self.tag_stack.append(tag)
        self.current_tag = tag

        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            level = int(tag[1])
            self.markdown.append('\n' + '#' * level + ' ')
        elif tag == 'p':
            self.markdown.append('\n\n')
        elif tag == 'br':
            self.markdown.append('\n')
        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')
        elif tag == 'code':
            if not self.in_pre:
                self.markdown.append('`')
            self.in_code = True
        elif tag == 'pre':
            self.in_pre = True
            self.markdown.append('\n\n```\n')
        elif tag == 'blockquote':
            self.in_blockquote = True
            self.markdown.append('\n\n> ')
        elif tag == 'a':
            self.markdown.append('[')
        elif tag == 'img':
            src = attrs_dict.get('src', '')
            alt = attrs_dict.get('alt', '')
            self.markdown.append(f'\n\n![{alt}]({src})\n\n')
        elif tag == 'ul':
            self.list_type.append('ul')
            self.markdown.append('\n')
        elif tag == 'ol':
            self.list_type.append('ol')
            self.list_counter = 0
            self.markdown.append('\n')
        elif tag == 'li':
            if self.list_type and self.list_type[-1] == 'ol':
                self.list_counter += 1
                self.markdown.append(f'{self.list_counter}. ')
            else:
                self.markdown.append('- ')
        elif tag == 'table':
            self.markdown.append('\n\n')
        elif tag == 'tr':
            pass
        elif tag == 'th':
            self.markdown.append('| ')
        elif tag == 'td':
            self.markdown.append('| ')
        elif tag == 'hr':
            self.markdown.append('\n\n---\n\n')

    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()

        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.markdown.append('\n\n')
        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')
        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')
        elif tag == 'code':
            if not self.in_pre:
                self.markdown.append('`')
            self.in_code = False
        elif tag == 'pre':
            self.in_pre = False
            self.markdown.append('\n```\n\n')
        elif tag == 'blockquote':
            self.in_blockquote = False
            self.markdown.append('\n\n')
        elif tag == 'a':
            # 查找 href
            self.markdown.append(']()')
        elif tag == 'ul' or tag == 'ol':
            if self.list_type:
                self.list_type.pop()
            self.markdown.append('\n')
        elif tag == 'li':
            self.markdown.append('\n')
        elif tag in ('th', 'td'):
            self.markdown.append(' ')
        elif tag == 'tr':
            self.markdown.append('|\n')
            # 添加表头分隔线
            if tag == 'tr' and self.tag_stack and self.tag_stack[-1] == 'thead':
                pass

    def handle_data(self, data):
        if self.in_blockquote and data.strip():
            # 为引用块中的每行添加 > 前缀
            lines = data.split('\n')
            for i, line in enumerate(lines):
                if line.strip():
                    self.markdown.append(line)
                    if i < len(lines) - 1:
                        self.markdown.append('\n> ')
        else:
            self.markdown.append(data)

    def get_markdown(self) -> str:
        """获取转换后的 Markdown"""
        result = ''.join(self.markdown)
        # 清理多余空行
        result = re.sub(r'\n{3,}', '\n\n', result)
        return result.strip()


def html_to_markdown(html: str) -> str:
    """将 HTML 转换为 Markdown"""
    if not html:
        return ''

    # 清理 Gutenberg 注释
    html = re.sub(r'<!--\s*wp:[^>]*?-->', '', html)
    html = re.sub(r'<!--\s*/wp:[^>]*?-->', '', html)

    # 处理特殊的 WordPress 短代码
    html = re.sub(r'\[caption[^\]]*\](.*?)\[/caption\]', r'\1', html, flags=re.DOTALL)

    parser = HtmlToMarkdownParser()
    try:
        parser.feed(html)
    except Exception as e:
        print(f"HTML 解析错误: {e}")
        # 回退：返回纯文本
        return re.sub(r'<[^>]+>', '', html).strip()

    return parser.get_markdown()


def generate_frontmatter(post_data: dict) -> str:
    """生成 YAML frontmatter"""
    lines = ['---']
    lines.append(f'title: "{post_data.get("title", "")}"')
    lines.append(f'slug: {post_data.get("slug", "")}')
    lines.append(f'date: {post_data.get("date", "")}')
    lines.append(f'category: {post_data.get("category", "")}')

    tags = post_data.get('tags', [])
    if tags:
        lines.append(f'tags: [{", ".join(tags)}]')

    if post_data.get('cover'):
        lines.append(f'cover: {post_data["cover"]}')

    if post_data.get('summary'):
        lines.append(f'summary: "{post_data["summary"]}"')

    lines.append(f'status: {post_data.get("status", "published")}')
    lines.append(f'views: {post_data.get("views", 0)}')
    lines.append('---')

    return '\n'.join(lines)


if __name__ == '__main__':
    # 测试转换
    test_html = """
    <!-- wp:heading -->
    <h2>Docker简介</h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph -->
    <p>docker是属于操作系统层面的虚拟化技术...</p>
    <!-- /wp:paragraph -->

    <!-- wp:code -->
    <pre class="wp-block-code"><code>yum install docker</code></pre>
    <!-- /wp:code -->
    """

    result = html_to_markdown(test_html)
    print("转换结果:")
    print(result)
