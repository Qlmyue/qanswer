import { useEffect } from 'react'
import { motion } from 'framer-motion'
import WaveBanner from '@/components/layout/WaveBanner'
import Sidebar from '@/components/layout/Sidebar'
import PostList from '@/components/blog/PostList'
import { usePostStore } from '@/stores/postStore'
import { useSiteStore } from '@/stores/siteStore'

export default function HomeView() {
  const { posts, categories, loading, fetchPosts, fetchCategories } = usePostStore()
  const { fetchHomeData, fetchDanmaku } = useSiteStore()

  useEffect(() => {
    fetchPosts({ page: 1, pageSize: 30 })
    fetchCategories()
    fetchHomeData()
    fetchDanmaku()
  }, [])

  // 按分类分组文章
  const postsByCategory = categories.map(cat => ({
    category: cat,
    posts: posts.filter(p => p.categoryId === cat.id),
  })).filter(g => g.posts.length > 0)

  return (
    <div>
      {/* Hero 横幅 */}
      <WaveBanner />

      {/* 主内容区 */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          {/* 文章列表 */}
          <div className="flex-1">
            {loading ? (
              <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-t-transparent"
                  style={{ borderColor: 'var(--app-primary)', borderTopColor: 'transparent' }}
                />
                加载中...
              </div>
            ) : postsByCategory.length > 0 ? (
              postsByCategory.map(({ category, posts }) => (
                <PostList key={category.id} category={category} posts={posts} />
              ))
            ) : (
              <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
                暂无文章
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
