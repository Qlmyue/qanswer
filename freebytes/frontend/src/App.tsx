import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BlogLayout from '@/components/layout/BlogLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import HomeView from '@/views/HomeView'
import PostView from '@/views/PostView'
import CategoryView from '@/views/CategoryView'
import TagView from '@/views/TagView'
import ArchiveView from '@/views/ArchiveView'
import GuestbookView from '@/views/GuestbookView'
import FriendsView from '@/views/FriendsView'
import AboutView from '@/views/AboutView'
import SearchView from '@/views/SearchView'
import DashboardView from '@/views/admin/DashboardView'
import PostListView from '@/views/admin/PostListView'
import PostEditView from '@/views/admin/PostEditView'
import CategoryManageView from '@/views/admin/CategoryManageView'
import CommentManageView from '@/views/admin/CommentManageView'
import GuestbookManageView from '@/views/admin/GuestbookManageView'
import DanmakuManageView from '@/views/admin/DanmakuManageView'
import FriendManageView from '@/views/admin/FriendManageView'
import SiteConfigView from '@/views/admin/SiteConfigView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 博客前台 */}
        <Route element={<BlogLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/post/:slug" element={<PostView />} />
          <Route path="/category/:slug" element={<CategoryView />} />
          <Route path="/tag/:slug" element={<TagView />} />
          <Route path="/archive" element={<ArchiveView />} />
          <Route path="/guestbook" element={<GuestbookView />} />
          <Route path="/friends" element={<FriendsView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/search" element={<SearchView />} />
        </Route>

        {/* 管理后台 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="posts" element={<PostListView />} />
          <Route path="posts/new" element={<PostEditView />} />
          <Route path="posts/:id/edit" element={<PostEditView />} />
          <Route path="categories" element={<CategoryManageView />} />
          <Route path="comments" element={<CommentManageView />} />
          <Route path="guestbook" element={<GuestbookManageView />} />
          <Route path="danmaku" element={<DanmakuManageView />} />
          <Route path="friends" element={<FriendManageView />} />
          <Route path="site" element={<SiteConfigView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
