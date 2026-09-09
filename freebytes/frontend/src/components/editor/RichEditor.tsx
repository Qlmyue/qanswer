import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import EditorToolbar from './EditorToolbar'

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'rich-text-content',
        'data-placeholder': placeholder || '开始写作...',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="rich-text-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
