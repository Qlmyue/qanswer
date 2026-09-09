import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

/**
 * 将 Markdown 转换为 HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}

/**
 * 提取 Markdown 中的目录结构
 */
export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w一-龥-]/g, '')

    toc.push({ id, text, level })
  }

  return toc
}

/**
 * 计算字数
 */
export function countWords(text: string): number {
  // 中文按字符计数，英文按单词计数
  const chineseChars = (text.match(/[一-龥]/g) || []).length
  const englishWords = text
    .replace(/[一-龥]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0).length
  return chineseChars + englishWords
}

/**
 * 生成摘要（取前 N 个字符）
 */
export function generateSummary(text: string, maxLength: number = 150): string {
  // 去除 Markdown 语法
  const plainText = text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/>\s+/g, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.slice(0, maxLength) + '...'
}
