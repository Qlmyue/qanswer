# FreeBytes 博客系统设计文档

## Context

用户有一个 WordPress 博客网站 (freebytes.net)，共 177 篇文章、13 个分类、60 个标签、363 张图片、214 条评论。WordPress 太笨重，需要重新开发一个轻量级博客系统。

**核心需求：**
- 博客以静态 Markdown 文件存储，支持在线富文本编辑
- 页面视觉效果对标 Poetize（诗意、动效丰富、毛玻璃、渐变色）
- 与复盘网站共用 FastAPI 后端
- 包含博客核心 + 社交功能（留言板、弹幕、友链）

---

## 一、技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | React 19 + TypeScript + Vite 8 | 与复盘网站一致 |
| **样式** | Tailwind CSS v4 | 与复盘网站一致 |
| **状态管理** | Zustand | 与复盘网站一致 |
| **路由** | react-router-dom 7 | 与复盘网站一致 |
| **动画** | Framer Motion | 与复盘网站一致 |
| **图标** | lucide-react | 与复盘网站一致 |
| **富文本编辑器** | Tiptap | 已在复盘项目中使用 |
| **Markdown** | unified + remark + rehype | Markdown ↔ HTML 双向转换 |
| **代码高亮** | Shiki / highlight.js | 代码块语法高亮 |
| **HTTP** | Axios | 与复盘网站一致 |
| **后端** | FastAPI + SQLAlchemy + SQLite | 扩展现有后端 |
| **图片处理** | Pillow | 图片压缩/缩略图 |

---

## 二、项目结构

```
freebytes/
├── frontend/                    # 博客前端（新项目）
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   ├── public/
│   │   └── assets/              # 静态资源（波浪动画、默认封面等）
│   └── src/
│       ├── main.tsx
│       ├── App.tsx              # 路由配置
│       ├── index.css            # 全局样式 + 自定义字体
│       ├── components/
│       │   ├── layout/
│       │   │   ├── BlogLayout.tsx       # 博客前台布局（含 Header/Footer）
│       │   │   ├── AdminLayout.tsx      # 后台管理布局
│       │   │   ├── Header.tsx           # 导航栏（emoji前缀菜单）
│       │   │   ├── Footer.tsx           # 页脚
│       │   │   ├── Sidebar.tsx          # 右侧栏（搜索/推荐/标签云/弹幕）
│       │   │   └── WaveBanner.tsx       # Hero 横幅 + 波浪动画
│       │   ├── blog/
│       │   │   ├── PostCard.tsx         # 文章卡片（封面+标题+元信息）
│       │   │   ├── PostList.tsx         # 文章列表（按分类分组）
│       │   │   ├── PostDetail.tsx       # 文章详情（Markdown 渲染）
│       │   │   ├── CategoryNav.tsx      # 分类导航
│       │   │   ├── TagCloud.tsx         # 标签云
│       │   │   ├── Archive.tsx          # 时间线归档
│       │   │   └── SearchBox.tsx        # 搜索组件
│       │   ├── social/
│       │   │   ├── CommentSection.tsx   # 文章评论区
│       │   │   ├── Guestbook.tsx        # 留言板
│       │   │   ├── DanmakuWall.tsx      # 弹幕墙
│       │   │   ├── DanmakuInput.tsx     # 弹幕输入
│       │   │   └── FriendLinks.tsx      # 友链页面
│       │   ├── editor/
│       │   │   ├── RichEditor.tsx       # Tiptap 富文本编辑器
│       │   │   ├── EditorToolbar.tsx    # 编辑器工具栏
│       │   │   └── ImageUpload.tsx      # 图片上传组件
│       │   └── common/
│       │       ├── TypingEffect.tsx     # 打字机效果
│       │       ├── Loading.tsx          # 加载动画
│       │       └── BackToTop.tsx        # 回到顶部
│       ├── stores/
│       │   ├── postStore.ts             # 文章状态
│       │   ├── authStore.ts             # 认证状态
│       │   └── siteStore.ts             # 站点配置
│       ├── services/
│       │   ├── index.ts                 # 服务门面
│       │   └── api/
│       │       ├── post.ts              # 文章 API
│       │       ├── category.ts          # 分类 API
│       │       ├── comment.ts           # 评论 API
│       │       ├── guestbook.ts         # 留言 API
│       │       ├── danmaku.ts           # 弹幕 API
│       │       ├── friend.ts            # 友链 API
│       │       ├── site.ts              # 站点配置 API
│       │       └── upload.ts            # 文件上传 API
│       ├── types/
│       │   └── index.ts                 # 所有类型定义
│       ├── utils/
│       │   ├── markdown.ts              # Markdown ↔ HTML 转换
│       │   ├── date.ts                  # 日期格式化
│       │   └── cn.ts                    # className 合并工具
│       └── views/
│           ├── HomeView.tsx             # 首页（Hero + 分类文章卡片）
│           ├── PostView.tsx             # 文章详情页
│           ├── CategoryView.tsx         # 分类页
│           ├── TagView.tsx              # 标签页
│           ├── ArchiveView.tsx          # 归档页
│           ├── GuestbookView.tsx        # 留言板页
│           ├── FriendsView.tsx          # 友链页
│           ├── AboutView.tsx            # 关于页
│           ├── SearchView.tsx           # 搜索结果页
│           └── admin/
│               ├── DashboardView.tsx    # 管理后台首页
│               ├── PostListView.tsx     # 文章管理列表
│               ├── PostEditView.tsx     # 文章编辑页（富文本）
│               ├── CategoryView.tsx     # 分类管理
│               ├── CommentView.tsx      # 评论管理
│               ├── GuestbookView.tsx    # 留言管理
│               ├── DanmakuView.tsx      # 弹幕管理
│               ├── FriendView.tsx       # 友链管理
│               └── SiteView.tsx         # 站点设置
│
├── content/                     # Markdown 文件存储目录
│   ├── posts/
│   │   ├── 2019/
│   │   │   ├── docker-intro/
│   │   │   │   ├── index.md           # 文章正文
│   │   │   │   └── images/            # 文章内图片
│   │   │   └── ...
│   │   ├── 2020/
│   │   ├── 2021/
│   │   ├── 2022/
│   │   └── 2023/
│   └── pages/                   # 静态页面（关于、友链等）
│       ├── about.md
│       └── friends.md
│
├── uploads/                     # 用户上传的文件
│   └── images/
│
├── scripts/                     # 迁移脚本
│   ├── parse_wordpress.py       # 解析 WordPress XML
│   ├── html_to_markdown.py      # Gutenberg HTML → Markdown
│   ├── download_images.py       # 下载原站图片
│   └── import_to_db.py          # 导入数据库
│
└── WordPress.2026-09-08.xml     # 原始导出文件
```

---

## 三、数据模型

### 3.1 数据库表（扩展现有 SQLite）

```python
# --- 博客文章 ---
class BlogPost(Base):
    __tablename__ = "blog_posts"

    id: str                    # UUID
    title: str                 # 标题
    slug: str                  # URL 别名（唯一）
    summary: str | None        # 摘要
    content_md: str            # Markdown 正文（存文件路径或直接存内容）
    cover_url: str | None      # 封面图 URL
    category_id: str | None    # 所属分类
    author_id: str             # 作者
    status: str                # draft / published / private
    is_top: bool               # 是否置顶
    views: int                 # 阅读量
    word_count: int            # 字数
    reading_time: int          # 预计阅读时间（分钟）
    published_at: datetime     # 发布时间
    created_at: datetime
    updated_at: datetime

    # 关系
    category: Category
    tags: list[Tag]            # 多对多
    comments: list[Comment]

class Category(Base):
    __tablename__ = "blog_categories"

    id: str
    name: str                  # 分类名
    slug: str                  # URL 别名
    icon: str | None           # emoji 图标
    parent_id: str | None      # 父分类（支持层级）
    sort_order: int
    post_count: int            # 文章数量（冗余字段）
    created_at: datetime

class Tag(Base):
    __tablename__ = "blog_tags"

    id: str
    name: str
    slug: str
    post_count: int
    created_at: datetime

class PostTag(Base):
    __tablename__ = "blog_post_tags"
    post_id: str
    tag_id: str

# --- 评论 ---
class Comment(Base):
    __tablename__ = "blog_comments"

    id: str
    post_id: str               # 所属文章
    parent_id: str | None      # 父评论（支持回复）
    nickname: str              # 昵称
    email: str | None          # 邮箱
    website: str | None        # 网址
    content: str               # 评论内容
    avatar: str | None         # 头像 URL
    ip: str | None
    status: str                # pending / approved / rejected
    created_at: datetime

# --- 留言板 ---
class GuestbookMessage(Base):
    __tablename__ = "blog_guestbook"

    id: str
    nickname: str
    email: str | None
    content: str
    avatar: str | None
    ip: str | None
    status: str                # pending / approved / rejected
    created_at: datetime

# --- 弹幕 ---
class Danmaku(Base):
    __tablename__ = "blog_danmaku"

    id: str
    content: str               # 弹幕内容
    color: str                 # 颜色（hex）
    position: str              # top / scroll / bottom
    nickname: str | None
    ip: str | None
    created_at: datetime

# --- 友链 ---
class FriendLink(Base):
    __tablename__ = "blog_friend_links"

    id: str
    name: str                  # 站点名
    url: str                   # 链接
    avatar: str | None         # 头像
    description: str | None    # 描述
    sort_order: int
    status: str                # pending / approved
    created_at: datetime

# --- 站点配置 ---
class SiteConfig(Base):
    __tablename__ = "blog_site_config"

    id: str
    site_name: str             # 站点名称
    site_subtitle: str | None  # 副标题（Hero 区域）
    site_description: str | None
    logo_url: str | None
    favicon_url: str | None
    banner_url: str | None     # Hero 背景图
    icp_number: str | None     # ICP 备案号
    footer_text: str | None    # 页脚文字
    social_links: str | None   # JSON: 社交链接
    custom_css: str | None     # 自定义 CSS
    created_at: datetime
    updated_at: datetime
```

### 3.2 Markdown 文件格式

每篇文章的 `index.md` 使用 YAML frontmatter：

```markdown
---
title: "Docker 简介"
slug: docker-intro
date: 2019-08-15 14:30:00
category: 技术博客
tags: [docker, linux, devops]
cover: ./images/cover.jpg
summary: "Docker 是操作系统层面的虚拟化技术..."
status: published
views: 1520
---

## Docker 简介

Docker 是属于操作系统层面的虚拟化技术...
```

### 3.3 类型定义（TypeScript）

```typescript
interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string | null
  contentMd: string          // Markdown 内容
  coverUrl: string | null
  categoryId: string | null
  category: Category | null
  tags: Tag[]
  authorId: string
  authorName: string
  status: 'draft' | 'published' | 'private'
  isTop: boolean
  views: number
  wordCount: number
  readingTime: number        // 分钟
  commentCount: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null        // emoji
  parentId: string | null
  children: Category[]
  postCount: number
  sortOrder: number
}

interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

interface Comment {
  id: string
  postId: string
  parentId: string | null
  replies: Comment[]
  nickname: string
  email: string | null
  website: string | null
  content: string
  avatar: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

interface GuestbookMessage {
  id: string
  nickname: string
  email: string | null
  content: string
  avatar: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

interface Danmaku {
  id: string
  content: string
  color: string
  position: 'top' | 'scroll' | 'bottom'
  nickname: string | null
  createdAt: string
}

interface FriendLink {
  id: string
  name: string
  url: string
  avatar: string | null
  description: string | null
  sortOrder: number
  status: 'pending' | 'approved'
}

interface SiteConfig {
  siteName: string
  siteSubtitle: string
  siteDescription: string
  logoUrl: string | null
  bannerUrl: string | null
  icpNumber: string | null
  footerText: string | null
  socialLinks: Record<string, string>
}

interface PostListResponse {
  items: BlogPost[]
  total: number
  page: number
  pageSize: number
}

interface CategoryWithPosts {
  category: Category
  posts: BlogPost[]
}
```

---

## 四、API 设计

### 4.1 文章

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/posts` | 文章列表（分页、筛选） |
| GET | `/api/blog/posts/{slug}` | 文章详情（通过 slug） |
| POST | `/api/blog/posts` | 创建文章（管理） |
| PUT | `/api/blog/posts/{id}` | 更新文章（管理） |
| DELETE | `/api/blog/posts/{id}` | 删除文章（管理） |
| GET | `/api/blog/posts/{id}/raw` | 获取原始 Markdown（编辑用） |

查询参数：
- `page`, `pageSize` — 分页
- `category` — 分类 slug
- `tag` — 标签 slug
- `search` — 搜索关键词
- `status` — 状态筛选（管理用）

### 4.2 分类

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/categories` | 所有分类（树形） |
| POST | `/api/blog/categories` | 创建分类（管理） |
| PUT | `/api/blog/categories/{id}` | 更新分类（管理） |
| DELETE | `/api/blog/categories/{id}` | 删除分类（管理） |

### 4.3 标签

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/tags` | 所有标签 |
| GET | `/api/blog/tags/{slug}/posts` | 标签下的文章 |

### 4.4 评论

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/posts/{id}/comments` | 文章评论列表 |
| POST | `/api/blog/posts/{id}/comments` | 提交评论 |
| DELETE | `/api/blog/comments/{id}` | 删除评论（管理） |
| PUT | `/api/blog/comments/{id}/status` | 审核评论（管理） |

### 4.5 留言板

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/guestbook` | 留言列表 |
| POST | `/api/blog/guestbook` | 提交留言 |
| DELETE | `/api/blog/guestbook/{id}` | 删除留言（管理） |

### 4.6 弹幕

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/danmaku` | 弹幕列表（最近 N 条） |
| POST | `/api/blog/danmaku` | 发送弹幕 |
| DELETE | `/api/blog/danmaku/{id}` | 删除弹幕（管理） |

### 4.7 友链

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/friends` | 友链列表 |
| POST | `/api/blog/friends` | 申请友链 |
| PUT | `/api/blog/friends/{id}` | 更新友链（管理） |
| DELETE | `/api/blog/friends/{id}` | 删除友链（管理） |

### 4.8 站点配置

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/site` | 站点配置 |
| PUT | `/api/blog/site` | 更新配置（管理） |

### 4.9 文件上传

| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/blog/upload` | 上传图片/文件 |

### 4.10 首页聚合

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/blog/home` | 首页数据（推荐文章、分类摘要、统计） |

---

## 五、视觉设计（对标 Poetize）

### 5.1 首页布局

```
┌─────────────────────────────────────────────────────────┐
│  🏡 首页  📝 技术博客  🖊️ 随笔  📚 归档  📪 留言  🔗 友链 │  ← 导航栏
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌─────────────────────┐                    │
│              │   相信记录的力量      │  ← Hero 横幅       │
│              │   相信记录|          │    (打字机效果)     │
│              │                     │                    │
│              │  📖 文章 177  📒 分类 13  🔥 访问量 xxx  │
│              └─────────────────────┘                    │
│  ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋ │  ← 波浪动画
├──────────────────────────────────┬──────────────────────┤
│                                  │  🔍 搜索文章         │
│  📝 技术博客                      │                      │
│  ┌──────┐ ┌──────┐ ┌──────┐     │  ⭐ 推荐文章          │
│  │ 封面 │ │ 封面 │ │ 封面 │     │  - 文章标题1          │
│  │ 标题 │ │ 标题 │ │ 标题 │     │  - 文章标题2          │
│  │ 日期 │ │ 日期 │ │ 日期 │     │                      │
│  └──────┘ └──────┘ └──────┘     │  🏷️ 标签云            │
│                                  │  docker java linux   │
│  🖊️ 随笔                         │  mysql redis ...     │
│  ┌──────┐ ┌──────┐ ┌──────┐     │                      │
│  │ 封面 │ │ 封面 │ │ 封面 │     │  💬 最新弹幕          │
│  │ 标题 │ │ 标题 │ │ 标题 │     │  → 滚动弹幕文字       │
│  │ 日期 │ │ 日期 │ │ 日期 │     │                      │
│  └──────┘ └──────┘ └──────┘     │                      │
├──────────────────────────────────┴──────────────────────┤
│  "钱塘江上潮信来，今日方知我是我"                            │  ← 页脚
│  本网站由 FreeBytes 强力驱动  |  ICP 备案号                │
└─────────────────────────────────────────────────────────┘
```

### 5.2 文章详情页布局

```
┌─────────────────────────────────────────────────────────┐
│  导航栏                                                   │
├──────────────────────────────────┬──────────────────────┤
│                                  │  📋 文章目录           │
│  ← 返回列表                      │  - Docker 简介        │
│                                  │  - 安装步骤           │
│  Docker 简介                     │  - 常用命令           │
│  2019-08-15 · 技术博客 · docker  │                      │
│  阅读量 1520 · 5 分钟            │                      │
│                                  │                      │
│  ┌─────────────────────────┐     │                      │
│  │                         │     │                      │
│  │   Markdown 渲染内容      │     │                      │
│  │   代码高亮               │     │                      │
│  │   图片                   │     │                      │
│  │                         │     │                      │
│  └─────────────────────────┘     │                      │
│                                  │                      │
│  ─── 上一篇: xxx ─── 下一篇: xxx  │                      │
│                                  │                      │
│  💬 评论区 (12)                  │                      │
│  ┌─────────────────────────┐     │                      │
│  │ 用户头像 · 昵称 · 时间    │     │                      │
│  │ 评论内容...              │     │                      │
│  │   └ 回复...              │     │                      │
│  └─────────────────────────┘     │                      │
│                                  │                      │
│  📝 发表评论                     │                      │
│  [昵称] [邮箱] [内容...]         │                      │
│  [提交]                          │                      │
├──────────────────────────────────┴──────────────────────┤
│  页脚                                                     │
└─────────────────────────────────────────────────────────┘
```

### 5.3 关键视觉元素

1. **Hero 横幅**：全宽背景图 + 双层波浪 PNG 动画（CSS @keyframes 水平平移）+ 打字机效果副标题
2. **配色方案**：
   - 主色：柔和蓝 `#6C8EBF`
   - 强调色：温暖粉 `#E8A0BF`
   - 背景渐变：`linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`
   - 卡片背景：毛玻璃 `bg-white/60 backdrop-blur-xl`
3. **卡片设计**：圆角 16px、柔和阴影、悬浮上移动效、随机封面图
4. **导航栏**：emoji 前缀菜单项，半透明毛玻璃背景
5. **动画**：
   - 页面切换：Framer Motion fade + slide
   - 卡片悬浮：scale + shadow 过渡
   - 波浪：无限循环水平平移
   - 打字机：逐字显示 + 闪烁光标
   - 弹幕：水平滚动飘过
6. **响应式**：移动端单栏，平板双栏，桌面三栏 + 侧边栏

---

## 六、数据迁移方案

### 6.1 迁移流程

```
WordPress XML → 解析 → HTML转Markdown → 下载图片 → 写入文件 → 导入数据库
```

### 6.2 步骤

1. **解析 WordPress XML**（`scripts/parse_wordpress.py`）
   - 使用 `xml.etree.ElementTree` 解析 WXR 格式
   - 提取 post、category、tag、comment、attachment 数据
   - 过滤掉 draft、private 状态的文章（可选）

2. **HTML → Markdown 转换**（`scripts/html_to_markdown.py`）
   - 去除 Gutenberg 注释标记（`<!-- wp:xxx -->`）
   - 使用 `html2text` 或 `markdownify` 库转换
   - 处理代码块、表格、图片、链接等
   - 保留 frontmatter 元数据

3. **下载图片**（`scripts/download_images.py`）
   - 从 363 个 attachment URL 下载图片
   - 按文章组织到 `content/posts/YYYY/slug/images/` 目录
   - 更新 Markdown 中的图片路径为相对路径
   - 生成缩略图（可选）
   - 限速下载，避免对原站造成压力

4. **导入数据库**（`scripts/import_to_db.py`）
   - 创建分类和标签
   - 导入文章元数据
   - 导入评论
   - 更新计数字段

### 6.3 图片 URL 映射

原站 URL 格式：
```
https://www.freebytes.net/wp-content/uploads/2019/08/image-1.png
```

迁移到：
```
/content/posts/2019/docker-intro/images/image-1.png
```

前端通过 `/api/blog/content/posts/...` 路径访问静态文件。

---

## 七、Markdown 存储与在线编辑

### 7.1 存储策略

**混合存储**：Markdown 文件 + 数据库元数据

- **Markdown 文件**：`content/posts/YYYY/slug/index.md`，包含 frontmatter + 正文
- **数据库**：存储标题、slug、摘要、分类、标签、状态、阅读量等元数据
- **读取流程**：查询数据库获取列表 → 需要正文时读取 .md 文件
- **写入流程**：编辑器保存 → 更新数据库元数据 + 写入 .md 文件

### 7.2 富文本编辑器

使用 **Tiptap**（已在复盘项目中使用）：

- **编辑模式**：所见即所得的富文本编辑
- **存储格式**：编辑器内部是 HTML，保存时转为 Markdown 存储
- **加载格式**：读取 .md 文件，转为 HTML 加载到编辑器
- **工具栏**：标题、粗体、斜体、链接、图片上传、代码块、引用、列表、表格
- **图片上传**：拖拽/粘贴上传，存储到 `uploads/images/`，插入 Markdown 图片语法

### 7.3 Markdown ↔ HTML 转换

使用 `unified` 生态：
- `remark-parse`：Markdown → AST
- `remark-rehype`：Markdown AST → HTML AST
- `rehype-stringify`：HTML AST → HTML 字符串
- `rehype-parse`：HTML → AST
- `rehype-remark`：HTML AST → Markdown AST
- `remark-stringify`：Markdown AST → Markdown 字符串

额外插件：
- `rehype-highlight` / `rehype-shiki`：代码高亮
- `rehype-slug` + `rehype-autolink-headings`：标题锚点
- `remark-gfm`：GitHub 风格 Markdown（表格、任务列表等）

---

## 八、路由设计

### 8.1 前台路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | HomeView | 首页（Hero + 分类文章卡片） |
| `/post/:slug` | PostView | 文章详情 |
| `/category/:slug` | CategoryView | 分类文章列表 |
| `/tag/:slug` | TagView | 标签文章列表 |
| `/archive` | ArchiveView | 时间线归档 |
| `/guestbook` | GuestbookView | 留言板 |
| `/friends` | FriendsView | 友链页面 |
| `/about` | AboutView | 关于页面 |
| `/search` | SearchView | 搜索结果 |

### 8.2 后台路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/admin` | DashboardView | 管理后台首页 |
| `/admin/posts` | PostListView | 文章管理 |
| `/admin/posts/new` | PostEditView | 新建文章 |
| `/admin/posts/:id/edit` | PostEditView | 编辑文章 |
| `/admin/categories` | CategoryManageView | 分类管理 |
| `/admin/comments` | CommentManageView | 评论管理 |
| `/admin/guestbook` | GuestbookManageView | 留言管理 |
| `/admin/danmaku` | DanmakuManageView | 弹幕管理 |
| `/admin/friends` | FriendManageView | 友链管理 |
| `/admin/site` | SiteConfigView | 站点设置 |

---

## 九、后端扩展方案

### 9.1 新增文件

```
backend/src/
├── api/
│   └── blog.py              # 所有博客相关路由
├── models/
│   └── blog.py              # 博客数据模型
├── schemas/
│   └── blog.py              # 博客 Pydantic schemas
└── services/
    └── blog_service.py      # 博客业务逻辑
```

### 9.2 静态文件服务

使用 FastAPI 的 `StaticFiles` 中间件：

```python
app.mount("/blog/content", StaticFiles(directory="freebytes/content"), name="blog-content")
app.mount("/blog/uploads", StaticFiles(directory="freebytes/uploads"), name="blog-uploads")
```

### 9.3 认证

- 前台：无需认证（公开访问）
- 后台管理：复用现有 JWT 认证，添加 `blog_admin` 角色
- 评论/留言：无需登录，通过昵称+邮箱标识

---

## 十、实现计划

### Phase 1：基础设施 + 数据迁移
1. 初始化前端项目（Vite + React + Tailwind + TypeScript）
2. 创建博客数据库模型
3. 编写 WordPress 数据迁移脚本
4. 运行迁移，导入所有数据

### Phase 2：博客核心功能
5. 实现文章列表/详情 API
6. 实现分类/标签 API
7. 构建首页（Hero + 波浪动画 + 文章卡片）
8. 构建文章详情页（Markdown 渲染 + 目录 + 评论）
9. 构建分类/标签/归档/搜索页面

### Phase 3：社交功能
10. 实现评论系统
11. 实现留言板
12. 实现弹幕墙
13. 实现友链页面

### Phase 4：管理后台
14. 实现富文本编辑器（Tiptap）
15. 实现文章管理 CRUD
16. 实现分类/评论/留言/弹幕/友链管理
17. 实现站点设置

### Phase 5：打磨
18. 响应式适配
19. 动画效果完善
20. 性能优化（图片懒加载、代码分割）
21. SEO 优化（meta tags、Open Graph）

---

## 十一、验证方案

1. **数据迁移验证**：对比原站文章数量（177篇）和迁移后数量
2. **图片验证**：检查所有图片是否可正常加载
3. **Markdown 渲染验证**：对比原站 HTML 和 Markdown 渲染效果
4. **编辑器验证**：创建/编辑文章，验证 Markdown 存储正确
5. **API 测试**：使用 pytest 测试所有博客 API 端点
6. **视觉验证**：对比 Poetize 参考站的视觉效果
