// --- 博客文章 ---
export interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string | null
  contentMd: string
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
  readingTime: number
  commentCount: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

// --- 分类 ---
export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parentId: string | null
  children: Category[]
  postCount: number
  sortOrder: number
}

// --- 标签 ---
export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

// --- 评论 ---
export interface Comment {
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

// --- 留言板 ---
export interface GuestbookMessage {
  id: string
  nickname: string
  email: string | null
  content: string
  avatar: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

// --- 弹幕 ---
export interface Danmaku {
  id: string
  content: string
  color: string
  position: 'top' | 'scroll' | 'bottom'
  nickname: string | null
  createdAt: string
}

// --- 友链 ---
export interface FriendLink {
  id: string
  name: string
  url: string
  avatar: string | null
  description: string | null
  sortOrder: number
  status: 'pending' | 'approved'
}

// --- 站点配置 ---
export interface SiteConfig {
  siteName: string
  siteSubtitle: string
  siteDescription: string
  logoUrl: string | null
  bannerUrl: string | null
  icpNumber: string | null
  footerText: string | null
  socialLinks: Record<string, string>
}

// --- 首页数据 ---
export interface HomeData {
  featuredPosts: BlogPost[]
  categoryPosts: CategoryWithPosts[]
  stats: SiteStats
  recentDanmaku: Danmaku[]
}

export interface CategoryWithPosts {
  category: Category
  posts: BlogPost[]
}

export interface SiteStats {
  totalPosts: number
  totalCategories: number
  totalTags: number
  totalViews: number
}

// --- 分页响应 ---
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// --- API 响应 ---
export interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

// --- 创建/更新请求 ---
export interface CreatePostData {
  title: string
  slug: string
  summary?: string
  contentMd: string
  coverUrl?: string
  categoryId?: string
  tagIds: string[]
  status: 'draft' | 'published'
  isTop?: boolean
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface CreateCategoryData {
  name: string
  slug: string
  icon?: string
  parentId?: string
  sortOrder?: number
}

export interface CreateCommentData {
  nickname: string
  email?: string
  website?: string
  content: string
  parentId?: string
}

export interface CreateGuestbookData {
  nickname: string
  email?: string
  content: string
}

export interface CreateDanmakuData {
  content: string
  color?: string
  position?: 'top' | 'scroll' | 'bottom'
  nickname?: string
}

export interface CreateFriendData {
  name: string
  url: string
  avatar?: string
  description?: string
}

export interface UpdateSiteConfigData {
  siteName?: string
  siteSubtitle?: string
  siteDescription?: string
  logoUrl?: string
  bannerUrl?: string
  icpNumber?: string
  footerText?: string
  socialLinks?: Record<string, string>
}
