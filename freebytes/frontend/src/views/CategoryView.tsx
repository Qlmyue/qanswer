import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PostCard from '@/components/blog/PostCard'
import { usePostStore } from '@/stores/postStore'

export default function CategoryView() {
  const { slug } = useParams<{ slug: string }>()
  const { posts, loading, fetchPosts } = usePostStore()

  useEffect(() => {
    if (slug) {
      fetchPosts({ category: slug, pageSize: 50 })
    }
  }, [slug])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          📁 {slug}
        </h1>
        <p className="mt-2" style={{ color: 'var(--app-muted-text)' }}>
          共 {posts.length} 篇文章
        </p>
      </motion.div>

      {loading ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          加载中...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          该分类下暂无文章
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
