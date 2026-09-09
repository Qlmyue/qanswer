import Guestbook from '@/components/social/Guestbook'
import DanmakuWall from '@/components/social/DanmakuWall'

export default function GuestbookView() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Guestbook />
      <div className="mt-8">
        <DanmakuWall />
      </div>
    </div>
  )
}
