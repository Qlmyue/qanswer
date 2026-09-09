import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePostStore } from '@/stores/postStore'
import PostDetail from '@/components/blog/PostDetail'
import CommentSection from '@/components/social/CommentSection'

export default function PostView() {
  const { slug } = useParams<{ slug: string }>()
  const { currentPost, loading, error, fetchPost, clearCurrentPost } = usePostStore()

  useEffect(() => {
    if (slug) {
      fetchPost(slug)
    }
    return () => clearCurrentPost()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center" style={{ color: 'var(--app-muted-text)' }}>
          <div
            className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'var(--app-primary)', borderTopColor: 'transparent' }}
          />
          加载中...
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-6xl">😢</p>
          <p className="text-lg font-medium" style={{ color: 'var(--app-text)' }}>
            文章不存在
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--app-muted-text)' }}>
            {error || '请检查链接是否正确'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PostDetail post={currentPost} />
      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <CommentSection postId={currentPost.id} />
      </div>
    </div>
  )
}
