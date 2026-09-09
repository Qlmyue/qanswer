import { motion } from 'framer-motion'
import { Link2, ExternalLink } from 'lucide-react'
import type { FriendLink } from '@/types'

interface FriendLinksProps {
  friends: FriendLink[]
}

export default function FriendLinks({ friends }: FriendLinksProps) {
  if (friends.length === 0) {
    return (
      <div className="py-12 text-center">
        <Link2 size={48} className="mx-auto mb-4 opacity-30" />
        <p style={{ color: 'var(--app-muted-text)' }}>暂无友链</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend, index) => (
        <motion.a
          key={friend.id}
          href={friend.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="app-card group flex items-center gap-4 rounded-2xl p-4 no-underline transition-all hover:-translate-y-1"
        >
          {/* 头像 */}
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ background: 'var(--app-secondary)' }}
          >
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold" style={{ color: 'var(--app-primary)' }}>
                {friend.name[0]}
              </span>
            )}
          </div>

          {/* 信息 */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1">
              <p
                className="truncate font-medium transition-colors group-hover:opacity-80"
                style={{ color: 'var(--app-text)' }}
              >
                {friend.name}
              </p>
              <ExternalLink size={12} style={{ color: 'var(--app-muted-text)' }} />
            </div>
            {friend.description && (
              <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--app-muted-text)' }}>
                {friend.description}
              </p>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  )
}
