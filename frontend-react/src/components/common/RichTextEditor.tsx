import { useEffect, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import { Bold, Code2, Highlighter, Italic, Link2, List, ListOrdered, Maximize2, Minimize2, Quote, Redo2, Undo2, Underline as UnderlineIcon } from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "在这里写下你的回答…" }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content,
    editorProps: { attributes: { class: "rich-text-content", "data-placeholder": placeholder } },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML()),
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML() && !(content === "" && editor.isEmpty)) editor.commands.setContent(content, { emitUpdate: false })
  }, [content, editor])

  useEffect(() => {
    if (!isFullscreen) return
    const exitOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsFullscreen(false) }
    window.addEventListener("keydown", exitOnEscape)
    return () => window.removeEventListener("keydown", exitOnEscape)
  }, [isFullscreen])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt("请输入链接地址")
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }
  const tools = [
    { label: "加粗", icon: Bold, run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "斜体", icon: Italic, run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { label: "下划线", icon: UnderlineIcon, run: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
    { label: "高亮", icon: Highlighter, run: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive("highlight") },
  ]

  return <div className={`rich-text-editor ${isFullscreen ? "is-fullscreen" : ""}`}>
    <div className="rich-text-toolbar" aria-label="文本格式工具栏">
      <button type="button" className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>标题</button>
      <span className="rich-text-divider" />
      {tools.map(({ label, icon: Icon, run, active }) => <button type="button" title={label} aria-label={label} key={label} className={active ? "is-active" : ""} onClick={run}><Icon /></button>)}
      <span className="rich-text-divider" />
      <button type="button" title="项目列表" aria-label="项目列表" className={editor.isActive("bulletList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></button>
      <button type="button" title="编号列表" aria-label="编号列表" className={editor.isActive("orderedList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></button>
      <button type="button" title="引用" aria-label="引用" className={editor.isActive("blockquote") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></button>
      <button type="button" title="代码块" aria-label="代码块" className={editor.isActive("codeBlock") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 /></button>
      <span className="rich-text-divider" />
      <button type="button" title="插入链接" aria-label="插入链接" className={editor.isActive("link") ? "is-active" : ""} onClick={addLink}><Link2 /></button>
      <button type="button" title="撤销" aria-label="撤销" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 /></button>
      <button type="button" title="重做" aria-label="重做" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 /></button>
      <span className="rich-text-toolbar-spacer" />
      <button type="button" title={isFullscreen ? "退出全屏（Esc）" : "全屏编辑"} aria-label={isFullscreen ? "退出全屏" : "全屏编辑"} onClick={() => setIsFullscreen((value) => !value)}>{isFullscreen ? <Minimize2 /> : <Maximize2 />}</button>
    </div>
    <EditorContent editor={editor} />
    <div className="rich-text-footer"><span>支持常用快捷键与粘贴格式</span><span>{editor.getText().replace(/\s/g, "").length} 字</span></div>
  </div>
}
