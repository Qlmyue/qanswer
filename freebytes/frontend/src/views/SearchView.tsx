import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PostCard from '@/components/blog/PostCard'
import { usePostStore } from '@/stores/postStore'

export default function SearchView() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { posts, loading, fetchPosts } = usePostStore()

  useEffect(() => {
    if (query) {
      fetchPosts({ search: query, pageSize: 50 })
    }
  }, [query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1
          className="flex items-center gap-3 text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          <Search size={28} style={{ color: 'var(--app-primary)' }} />
          搜索结果
        </h1>
        {query && (
          <p className="mt-2" style={{ color: 'var(--app-muted-text)' }}>
            搜索 "{query}" 共找到 {posts.length} 篇文章
          </p>
        )}
      </motion.div>

      {!query ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          请输入搜索关键词
        </div>
      ) : loading ? (
        <div className="py-12 text-center" style={{ color: 'var(--app-muted-text)' }}>
          搜索中...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-2 text-5xl">🔍</p>
          <p style={{ color: 'var(--app-muted-text)' }}>
            未找到与 "{query}" 相关的文章
          </p>
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
