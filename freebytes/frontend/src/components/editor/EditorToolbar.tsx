import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Highlighter,
  Undo,
  Redo,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const addLink = () => {
    const url = window.prompt('输入链接地址:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: '粗体',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: '斜体',
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      tooltip: '下划线',
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      tooltip: '删除线',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      tooltip: '行内代码',
    },
    { type: 'divider' },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: '标题1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: '标题2',
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      tooltip: '标题3',
    },
    { type: 'divider' },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: '无序列表',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: '有序列表',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      tooltip: '引用',
    },
    { type: 'divider' },
    {
      icon: Highlighter,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      tooltip: '高亮',
    },
    {
      icon: Link,
      action: addLink,
      isActive: editor.isActive('link'),
      tooltip: '链接',
    },
    { type: 'divider' },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      tooltip: '撤销',
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      tooltip: '重做',
      disabled: !editor.can().redo(),
    },
  ]

  return (
    <div className="rich-text-toolbar">
      {tools.map((tool, index) => {
        if (tool.type === 'divider') {
          return <div key={index} className="rich-text-divider" />
        }

        const Tool = tool as {
          icon: typeof Bold
          action: () => void
          isActive: boolean
          tooltip: string
          disabled?: boolean
        }

        return (
          <button
            key={index}
            onClick={Tool.action}
            disabled={Tool.disabled}
            className={Tool.isActive ? 'is-active' : ''}
            title={Tool.tooltip}
          >
            <Tool.icon size={16} />
          </button>
        )
      })}
    </div>
  )
}
