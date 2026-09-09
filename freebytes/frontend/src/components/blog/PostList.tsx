import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { BlogPost, Category } from '@/types'
import PostCard from './PostCard'

interface PostListProps {
  category: Category
  posts: BlogPost[]
}

export default function PostList({ category, posts }: PostListProps) {
  if (posts.length === 0) return null

  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {/* 分类标题 */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="flex items-center gap-2 text-xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.name}
        </h2>
        <Link
          to={`/category/${category.slug}`}
          className="flex items-center gap-1 text-sm no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--app-primary)' }}
        >
          更多
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* 文章网格 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </motion.section>
  )
}
