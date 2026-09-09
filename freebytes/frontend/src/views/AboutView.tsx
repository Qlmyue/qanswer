import { motion } from 'framer-motion'

export default function AboutView() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="app-card rounded-2xl p-8"
      >
        <h1
          className="mb-6 text-center text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: '"Noto Serif SC", serif' }}
        >
          ✨ 关于
        </h1>

        <div className="markdown-content">
          <p>你好，欢迎来到明月工作室。</p>

          <p>
            这是一个记录技术与生活的个人博客。在这里，我会分享一些技术笔记、学习心得，以及生活中的随笔感悟。
          </p>

          <p>
            "相信记录的力量"——我相信，文字是有温度的。每一次记录，都是对生活的热爱，对知识的尊重。
          </p>

          <h2>关于我</h2>

          <ul>
            <li>一名热爱技术的开发者</li>
            <li>喜欢探索新技术，也喜欢用文字记录</li>
            <li>相信代码可以改变世界</li>
          </ul>

          <h2>联系方式</h2>

          <p>
            如果你有任何问题或建议，欢迎通过以下方式联系我：
          </p>

          <ul>
            <li>留言板：在留言板留下你的足迹</li>
            <li>邮箱：your-email@example.com</li>
          </ul>

          <h2>技术栈</h2>

          <p>本博客使用以下技术构建：</p>

          <ul>
            <li>前端：React + TypeScript + Tailwind CSS</li>
            <li>后端：FastAPI + SQLAlchemy</li>
            <li>存储：Markdown 文件 + SQLite</li>
            <li>部署：待定</li>
          </ul>

          <blockquote>
            <p>钱塘江上潮信来，今日方知我是我。</p>
          </blockquote>
        </div>
      </motion.div>
    </div>
  )
}
